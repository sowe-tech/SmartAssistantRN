import React, { createContext, useEffect, useState } from "react";
import HelpAI from "./assistant";
import OpenAI from "openai";
import ChatBubble from "./chatBubble";
import ChatModal from "./chatModal";

export const AiHelperContext = createContext<{
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  setMessages: (
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) => void;
  assistant?: HelpAI;
  isChatOpen: boolean;
  setIsChatOpen: (isChatOpen: boolean) => void;
  setButtons: (
    button: {
      label: string;
      onPress: () => {};
    }[] | null
  ) => void;
  buttons:
    | {
        label: string;
        onPress: () => {};
      }[]
    | null;
    setShowChatBubble: (showChatBubble: boolean) => void;
}>({
  messages: [],
  setMessages: () => {},
  assistant: undefined,
  isChatOpen: false,
  setIsChatOpen: () => {},
  setButtons: () => {},
  buttons: null,
  setShowChatBubble: () => {},
});

const AiHelperProvider = ({
  children,
  assistant,
}: {
  children: any;
  assistant: HelpAI;
}) => {
  const firstMessage = `¡Hola! Soy ${assistant?.options.name}, tu asistente personal. Estoy aquí para resolver tus dudas y ayudarte a navegar por la app, guiándote a la pantalla correcta o brindándote la información que necesitas. ¿En qué puedo ayudarte hoy?`;

  const [messages, setMessages] = useState<
    OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  >([
    {
      role: "assistant",
      content: firstMessage,
    },
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [buttons, setButtons] = useState<
    | {
        label: string;
        onPress: () => {};
      }[]
    | null
  >(null);
  const [showChatBubble, setShowChatBubble] = useState(false);

  useEffect(() => {
    if (!assistant) {
      console.error("Assistant is not defined");
    } else {
      setShowChatBubble(true);
    }
  }, []);

  return (
    <AiHelperContext.Provider
      value={{
        messages,
        setMessages,
        assistant,
        isChatOpen,
        setIsChatOpen,
        setButtons,
        buttons,
        setShowChatBubble,
      }}
    >
      {children}
      {isChatOpen && <ChatModal /> } 
      {(showChatBubble  && !isChatOpen) && <ChatBubble />}
    </AiHelperContext.Provider>
  );
};

export default AiHelperProvider;
