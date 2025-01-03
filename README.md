# React Native Smart Assistant

`SmartAssistantRN` is a React Native library that integrates an OpenAI-powered chatbot assistant into your application. It enhances app usability by providing features such as navigation guidance, user attribute access, and dynamic button generation.

## Features

- **OpenAI-Powered Chatbot**: Leverage advanced AI capabilities to provide intelligent responses and interactions within your app.
- **Navigation Guidance**: Assist users in navigating through different sections of your application seamlessly.
- **User Attribute Access**: Access and utilize user-specific attributes to personalize interactions.
- **Dynamic Button Generation**: Create and display buttons dynamically based on the context of the conversation.

## Installation

1. Install the `react-native-smart-assistant` package:

```bash
npm install react-native-smart-assistant
```


2. Import the necessary components:

```javascript
import {Assistant, , AiHelperProvider} from 'react-native-smart-assistant';
```

3. Initialize the assistant with the required information:

```javascript
const assistant = new HelpAI({
  name:  '<Assistant name>',
  avatar: require('<Assistant avatar>'),
  apiKey: '<Open ai key>',
});
```

4. Set up the route helper to provide context about different routes in your application:

```javascript
assistant.setRouteHelper([
  {
    route_name: "myapp://(app)",
    description: "This is a route description, here you can do this, this and that",
  },
  {
    route_name: "myapp://register",
    description: "You can register to access the app",
  },
  // Add more routes as needed
]);
```

5. Wrap your application in the AiHelperProvider to provide the assistant context:

```javascript
export default function RootLayout() {
  return (
    <AiHelperProvider assistant={assistant}>
      <App />
    </AiHelperProvider>
  );
}
```
________________________

## `useAssistant` Hook

The `useAssistant` hook is designed to provide advanced control and interaction with the Smart Assistant in your application. It allows you to manage and send messages, handle user interactions, and execute custom assistant functions based on the user's actions.

### Key Functionalities

- **`handleMessage(message: string)`**: This function sends a message to the assistant and handles the response. If the assistant needs to execute any actions (such as navigating to a route or calling a tool), it processes them and generates the necessary feedback for the user.

  - **Inputs**: A string message from the user.
  - **Outputs**: The assistant’s response message.

- **`handleActions(userMessage: string, tool_calls: ChatCompletionMessageToolCall[])`**: This function is responsible for handling actions triggered by the assistant based on the user's message. For example, it can handle navigation or execute additional tools.

  - **Inputs**: The user's message and a list of tool calls that specify the assistant's actions.
  - **Outputs**: Sends appropriate actions like navigating to routes or executing functions, and generates dynamic buttons for the user to interact with.

- **`handleOpenChat()`**: Opens the chat interface of the assistant.

  - **Outputs**: Updates the state to indicate the chat should be opened.

- **`hideChatBubble()`**: Hides the chat bubble when the assistant's chat is not needed.

  - **Outputs**: Updates the state to hide the chat bubble.

- **`showChatBubble()`**: Shows the chat bubble to indicate the assistant is ready to assist.

  - **Outputs**: Updates the state to show the chat bubble.

### How it Works

1. **Message Handling**: The hook processes messages sent by the user, queries the assistant (via OpenAI API), and handles any necessary actions such as navigation or calling functions.
2. **Button Generation**: If certain actions require user interaction (e.g., navigating to a deep link), buttons are dynamically generated. These buttons are then displayed for the user to click.
3. **Assistant Integration**: The hook interacts with the `AiHelperContext`, which stores the assistant instance, messages, buttons, and other states. This allows the assistant to dynamically respond to user input and perform tasks like navigation.

### Example Usage

```javascript
const { handleMessage, handleOpenChat, hideChatBubble, showChatBubble } = useAssistant();

// Send a message to the assistant
handleMessage("What can I do today?");

// Open the chat interface
handleOpenChat();

// Show or hide the chat bubble
showChatBubble();
hideChatBubble();

