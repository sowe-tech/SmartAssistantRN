import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AiHelperContext } from "./AiHelperProvider";
import useAssistant from "./useAssistant";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import TypingAnimation from "./typingAnimation";

const ChatModal = () => {
  const { handleMessage } = useAssistant();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const translateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const { messages, buttons, assistant, isChatOpen, setIsChatOpen } =
    useContext(AiHelperContext);
  const scrollViewRef = useRef<ScrollView>(null);

  const theme = assistant?._theme.chat;

  const handleSendMessage = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await handleMessage(message);
    setIsLoading(false);
    setMessage("");
  };

  const handleCloseChat = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: Dimensions.get("window").height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsChatOpen(false);
    });
  };

  const handleSrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (isChatOpen) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isChatOpen]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleSrollToBottom
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleSrollToBottom
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const messageBubbleLeft = {
    ...styles.messageBubbuleLeft,
    backgroundColor: theme?.messageBubbleLeft,
  };

  const messageBubbleRight = {
    ...styles.messageBubbuleRight,
    backgroundColor: theme?.messageBubbleRight,
  };

  const leftText = {
    ...styles.text,
    color: theme?.textLeft,
  };

  const rightText = {
    ...styles.textRight,
    color: theme?.textRight,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: theme?.header,
        },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: theme?.header,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <View style={styles.assistantAvatar}>
            <Image
              style={{ height: 32, width: 32 }}
              contentFit="contain"
              source={assistant?.options.avatar}
            />
          </View>

          <View style={styles.assistantStatus}>
            <Text style={[styles.assistantName, { color: theme?.headerText }]}>
              {assistant?.options.name}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme?.headerText,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: theme?.headerText,
                  fontWeight: "bold",
                }}
              >
                Online
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.closeIcon]}
            onPress={handleCloseChat}
          >
            <Ionicons name="close" size={32} color={theme?.headerText} />
          </TouchableOpacity>
        </View>

        <ScrollView
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={{ flex: 1, gap: 12, backgroundColor: theme?.background }}
          ref={scrollViewRef}
        >
          {messages.map((m) => (
            <View
              style={
                m.role == "assistant" ? messageBubbleLeft : messageBubbleRight
              }
            >
              {m.content && (
                <Text style={m.role == "assistant" ? leftText : rightText}>
                  {m.content as string}
                </Text>
              )}
            </View>
          ))}

          {isLoading && (
            <View style={messageBubbleLeft}>
              <TypingAnimation color={leftText.color as string} />
            </View>
          )}

          <View style={styles.actions}>
            {Boolean(buttons?.length) &&
              buttons?.map((button) => (
                <TouchableOpacity
                  style={[
                    styles.buttonFunction,
                    { backgroundColor: theme?.messageActionWrapper },
                  ]}
                  onPress={() => {
                    button.onPress();
                    handleCloseChat();
                  }}
                >
                  <Text
                    style={[
                      styles.messageActionText,
                      { color: theme?.messageActionText },
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>

        <KeyboardAvoidingView behavior="padding">
          <View
            style={[styles.message, { backgroundColor: theme?.bottomWrapper }]}
          >
            <TextInput
              style={[
                styles.messageInput,
                { backgroundColor: theme?.textFieldBackground },
                { color: theme?.textFieldColor },
              ]}
              placeholder="Como te puedo ayudar?"
              value={message}
              onChangeText={setMessage}
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={[styles.messageAction, isLoading && { paddingLeft: 0 }]}
              onPress={handleSendMessage}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#2f2f2f" />
              ) : (
                <Ionicons name="send" size={24} color="#2f2f2f" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#2f2f2f",
    height: "100%",
    width: "100%",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageInput: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 18,
  },
  message: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#2f2f2f",
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  messageActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageAction: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 300,
    paddingLeft: 4,
  },
  messageActionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeIcon: {
    marginLeft: "auto",
  },
  messageBubbuleLeft: {
    maxWidth: "90%",
    backgroundColor: "#dbdbdb",
    padding: 12,
    marginLeft: 12,
    marginRight: "auto",
    borderRadius: 18,
    marginVertical: 8,
  },
  messageBubbuleRight: {
    maxWidth: "90%",
    backgroundColor: "#010238",
    padding: 12,
    marginLeft: "auto",
    borderRadius: 18,
    marginVertical: 8,
    marginRight: 12,
  },
  text: {
    fontSize: 18,
  },
  textRight: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  buttonFunction: {
    backgroundColor: "#010238",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    marginVertical: 8,
  },
  assistantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  assistantName: {
    fontSize: 24,
  },
  assistantStatus: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default ChatModal;
