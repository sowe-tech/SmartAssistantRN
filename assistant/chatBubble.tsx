import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AiHelperContext } from "./AiHelperProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatBubble = () => {
  const { setIsChatOpen } = useContext(AiHelperContext);


  const handleOpenChat = () => {
    setIsChatOpen(true);
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenChat}>
      <Ionicons name="chatbubble" size={32} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
    right: 16,
    backgroundColor: '#011836',
    height: 60,
    width: 60,
    borderRadius: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default ChatBubble;
