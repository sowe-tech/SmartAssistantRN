import { useContext } from "react";
import { AiHelperContext } from "./AiHelperProvider";
import { Linking } from "react-native";
import { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";

const useAssistant = () => {
  const {
    messages,
    setMessages,
    assistant,
    setButtons,
    setIsChatOpen,
    setShowChatBubble,
  } = useContext(AiHelperContext);

  const handleActions = async (
    userMessage: string,
    tool_calls: ChatCompletionMessageToolCall[]
  ) => {
    const openai = assistant?._openai;

    const handleNavigate = async (deepLink: string) => {
      console.info("Navigating to ", deepLink);
      await Linking.openURL(deepLink);
    };

    const functions = {
      navigate: ({ deepLink }: { deepLink: string }) => {
        handleNavigate(deepLink);
      },
      ...assistant?._functions_dict, // Adds all functions from the assistant
    };

    if (!openai) {
      return console.error("Assistant is not set correctly");
    }

    const resultFunctions = [] as ChatCompletionMessageToolCall[];
    const userData = [];
    tool_calls.forEach((tool_call) => {
      const mustShowButton = assistant?._executable_functions.includes(
        tool_call.function.name
      );

      if (mustShowButton) {
        resultFunctions.push(tool_call);
      } else {
        userData.push(functions[tool_call.function.name]());
      }
    });

    // Solicitar a la IA generar un mensaje de feedback basado en el resultado
    const feedbackCompletion = await openai.chat.completions.create({
      model: assistant?._modelSettings.model,
      temperature: assistant?._modelSettings.temperature,
      max_tokens: assistant?._modelSettings.maxTokens,
      top_p: assistant?._modelSettings.topP,
      frequency_penalty: assistant?._modelSettings.frequencyPenalty,
      presence_penalty: assistant?._modelSettings.presencePenalty,
      store: true,
      messages: [
        {
          role: "system",
          content: `Eres un asistente que proporciona feedback claro y amigable basado en resultados. Se obtienen los siguientes datos del usuario: ${JSON.stringify(
            userData
          )} y se ejecutaron las siguientes funciones: ${JSON.stringify(
            resultFunctions
          )},
              para cada una de estas funciones, el usuario YA tendra un boton abajo para ejecutarlas a cada una de ellas`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const buttonData = resultFunctions.map((tool_call) => {
      return {
        label: JSON.parse(tool_call.function.arguments)._buttonLabel,
        onPress: async () => {
          await functions[tool_call.function.name](
            JSON.parse(tool_call.function.arguments)
          );
        },
      };
    });

    setButtons(buttonData);

    setMessages([
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: feedbackCompletion.choices[0].message.content,
      },
    ]);
  };

  const handleMessage = async (message: string) => {
    const openai = assistant?._openai;

    if (message.trim().length === 0) {
      return;
    }

    if (!openai) {
      return console.error("Assistant is not set correctly");
    }
    const newMessages = [...messages, { role: "user", content: message }];

    setMessages(newMessages);
    setButtons(null);

    try {
      const completion = await openai.chat.completions.create({
        model: assistant?._modelSettings.model,
        temperature: assistant?._modelSettings.temperature,
        max_tokens: assistant?._modelSettings.maxTokens,
        top_p: assistant?._modelSettings.topP,
        frequency_penalty: assistant?._modelSettings.frequencyPenalty,
        presence_penalty: assistant?._modelSettings.presencePenalty,
        store: true,
        messages: [
          {
            role: "system",
            content: assistant?._system_prompt,
          },
          ...messages,
          {
            role: "user",
            content: message,
          },
        ],
        tools: assistant?._route_tools
          ? [assistant?._route_tools, ...assistant?._helper_toools]
          : assistant?._helper_toools,
      });

      if (
        completion.choices[0].message.tool_calls &&
        completion.choices[0].message.tool_calls.length > 0
      ) {
        await handleActions(message, completion.choices[0].message.tool_calls);
        return completion.choices[0].message.content;
      }

      newMessages.push({
        role: "assistant",
        content: completion.choices[0].message.content,
      });

      setMessages(newMessages);

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const hideChatBubble = () => {
    setShowChatBubble(false);
  };

  const showChatBubble = () => {
    setShowChatBubble(true);
  };

  return {
    handleMessage,
    handleOpenChat,
    hideChatBubble,
    showChatBubble,
  };
};

export default useAssistant;
