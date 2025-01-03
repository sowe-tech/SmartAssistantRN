# React Native Smart Assistant

`SmartAssistantRN` is a React Native library that integrates an OpenAI-powered chatbot assistant into your application. It enhances app usability by providing features such as navigation guidance, user attribute access, and dynamic button generation.

## Features

- **OpenAI-Powered Chatbot**: Leverage advanced AI capabilities to provide intelligent responses and interactions within your app.
- **Navigation Guidance**: Assist users in navigating through different sections of your application seamlessly.
- **User Attribute Access**: Access and utilize user-specific attributes to personalize interactions.
- **Dynamic Button Generation**: Create and display buttons dynamically based on the context of the conversation.

<img src="https://github.com/user-attachments/assets/6fa5e16f-1256-452f-b832-90150c1e056f" alt="Mobile Phone Image" width="300" />

## Installation

1. Install the `react-native-smart-assistant` package:

```bash
npm install react-native-smart-assistant
```


2. Import the necessary components:

```javascript
import {Assistant, AiHelperProvider} from 'react-native-smart-assistant';
```

3. Initialize the assistant with the required information:

```javascript
const assistant = new Assistant({
  name:  '<Assistant name>',
  avatar: require('<Assistant avatar>'),
  apiKey: '<Open ai key>',
  language: '<Language for the ai>' // Default is English
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

## Assistant Options  

The following table describes the configuration options for the assistant:

| Property        | Description                                              | Type          | Required | Default         |
|------------------|----------------------------------------------------------|---------------|----------|-----------------|
| `name`          | The name of the assistant displayed in the chat UI        | `string`      | Yes      | `undefined`     |
| `apiKey`        | Your OpenAI API key for enabling AI functionality         | `string`      | Yes      | `undefined`     |
| `firstMessage`  | The first message displayed to the user in the chat       | `string`      | No       | `undefined`     |
| `language`      | The default language for the assistant responses          | `string`      | No       | `"English"`     |
| `theme`         | Custom theme object to style the chat UI                  | `Theme`       | No       | Default theme   |
| `avatar`        | Path to the assistant's avatar image                      | `string`      | No       | `undefined`     |

### Notes:
- The `name` and `apiKey` properties are required for the assistant to function properly.
- The `theme` should follow the structure defined in the [Theme](#theme-properties) section.
- The `avatar` can be a local image file or a URL to an image resource.
- If `firstMessage` is not provided, the chat will start empty until the user interacts.

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
```

## Actions
The AI assistant can identify when a user needs to execute a predefined function, such as contacting support or logging out, and creates a button for the user.

### Example Usage

```javascript
assistant.addHelper(
  "contcatHuman", // unique function name
  () => {
    // Logic to contact support
    Alert.alert(
      "Hello"
    );
  },
  "Function contact a human", // description of the function
);
```

The assitant also alows handling multiple functions at once!

<div style="display:flex;">
<img src="https://github.com/user-attachments/assets/f39cd00c-f6f7-447e-beb9-160b04568256" alt="Mobile Phone Image" width="300" />
<img src="https://github.com/user-attachments/assets/eb3f083c-33fd-47a8-80eb-249fb1fc3525" alt="Mobile Phone Image" width="300" />
</div>

## User Attributes
The AI assistant can identify when a user needs to access personal details and uses them to create an answer.

### Example Usage

```javascript
assistant.addAttribute(
  "personalDetails",
  {
    name: "Corrado",
    age: 23,
    gender: "male",
    email: "hello@sowe.tech",
  },
  "User personal details, name, age, gender and email"
);
```

## Theme
Easily customize the chat's appearance to match your app's branding by defining a theme. You can modify various aspects, such as colors, text styles, and layouts.

### Example Usage

```javascript
const chatTheme = {
  chat: {
    header: "#1E1E1E", // Header background color
    headerText: "#FFFFFF", // Header text color
    background: "#F5F5F5", // Chat background color

    textLeft: "#333333", // Text color for messages from others
    textRight: "#FFFFFF", // Text color for your messages
    messageBubbleLeft: "#E0E0E0", // Bubble color for messages from others
    messageBubbleRight: "#007BFF", // Bubble color for your messages

    messageActionWrapper: "#FFFFFF", // Background for action wrapper
    messageActionText: "#007BFF", // Text color for actions

    textFieldBackground: "#FFFFFF", // Background of the input field
    textFieldColor: "#333333", // Input text color

    bottomWrapper: "#E0E0E0", // Background for the bottom wrapper
  },
};

const assistant = new Assistant({
  name:  '<Assistant name>',
  avatar: require('<Assistant avatar>'),
  apiKey: '<Open ai key>',
  language: '<Language for the ai>', // Default is English
  theme: chatTheme
});
```

## Theme Properties  

The following table describes the customizable properties for the chat UI theme:

| Property                | Location                         | Description                                   | Type      |
|-------------------------|-----------------------------------|-----------------------------------------------|-----------|
| `chat.header`           | Header                          | Background color of the chat header           | `string`  |
| `chat.headerText`       | Header                          | Text color of the chat header                 | `string`  |
| `chat.background`       | Chat Background                 | Background color of the entire chat screen    | `string`  |
| `chat.textLeft`         | Messages (Incoming)             | Text color for messages received              | `string`  |
| `chat.textRight`        | Messages (Outgoing)             | Text color for messages sent                  | `string`  |
| `chat.messageBubbleLeft`| Message Bubbles (Incoming)      | Background color for received message bubbles | `string`  |
| `chat.messageBubbleRight`| Message Bubbles (Outgoing)     | Background color for sent message bubbles     | `string`  |
| `chat.messageActionWrapper` | Action Buttons              | Background color for action button wrappers   | `string`  |
| `chat.messageActionText`| Action Buttons                 | Text color for action buttons                 | `string`  |
| `chat.textFieldBackground` | Input Field                 | Background color of the message input field   | `string`  |
| `chat.textFieldColor`   | Input Field                     | Text color of the input field                 | `string`  |
| `chat.bottomWrapper`    | Bottom Wrapper                  | Background color of the bottom wrapper        | `string`  |
| `bubble.background`     | Quick Reply Bubble              | Background color for quick reply bubbles      | `string`  |
| `bubble.icon`           | Quick Reply Icon                | Icon color inside quick reply bubbles         | `string`  |

### Notes:
- All colors should be provided as valid CSS color values, such as `"#FFFFFF"`, `"rgba(0, 0, 0, 0.5)"`, or `"blue"`. 
- Optional properties can be omitted if default styling is sufficient.
