import { theme } from "./theme";
import { AssistantOptions, MessagesType, OpenAIModel, RoutesAI, Theme } from "./types";
import OpenAI from "openai";

const defaultAiModel: OpenAIModel = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

class HelpAI {
  options: AssistantOptions;

  _openai: OpenAI;

  _system_prompt: string;
  _messages_prompt: MessagesType[];

  _route_tools: OpenAI.Chat.Completions.ChatCompletionTool | undefined;
  _helper_toools: OpenAI.Chat.Completions.ChatCompletionTool[];
  _functions_dict: {
    [key: string]: (args: any) => Promise<any>;
  };
  _executable_functions: string[];

  _firstMessage: string;

  _theme: Theme;

  _modelSettings: OpenAIModel;

  constructor(options: AssistantOptions) {
    this.options = options;
    this._messages_prompt = []; // messages History (can be deleted?)

    this._helper_toools = []; // OpenAI tools for the helper
    this._functions_dict = {}; // Dictionary of functions
    this._executable_functions = []; // functions that will show the button

    this._route_tools = undefined; // OpenAI tools for the routes

    this._openai = new OpenAI({
      apiKey: options.apiKey,
    });

    const language = options.language || "English";

    this._system_prompt = `You are an assistant designed exclusively to provide greater accessibility in a mobile application. Your main purpose is to help users navigate through the different sections of the app or directly access the data it provides. You must limit yourself solely to answering questions related to the app's functionality, navigation, or available data.

    Do not attempt to answer questions that are not directly related to the application. If the user asks a question outside your scope, kindly inform them that you can only assist with topics related to the app.
    
    Links cannot be embedded in the text as the chat does not support this functionality.
    
    Your goal is to ensure a smooth, fast, and efficient experience for the user within the context of the application.
    
    You will need to communicate in the ${language} language.`;

    this._firstMessage =
      options.firstMessage ||
      `Hello! I'm ${options.name}, your personal assistant. I'm here to answer your questions and help you navigate the app, guiding you to the right screen or providing the information you need. How can I assist you today?`;

    this._theme = {
      chat: {
        ...theme.chat,
        ...options.theme?.chat,
      },
      bubble: {
        ...theme.bubble,
        ...options.theme?.bubble,
      },
    };

    this._modelSettings = {
      ...defaultAiModel,
      ...options.modelSettings,
    };
  }

  addHelper(
    name: string,
    func: () => any,
    descriptionPrompt: string,
    args: { description: string; type: string; name: string }[] = [],
    requiredArgs: string[] = []
  ) {
    if (Object.keys(this._functions_dict).includes(name)) {
      console.error(`Function name already existe (${name})`);
      return;
    }

    this._functions_dict[name] = func; // saves function in dictionary
    this._executable_functions.push(name);

    // Create parameters object
    const parameters = {} as OpenAI.FunctionParameters;

    args.forEach((arg) => {
      parameters[arg.name] = {
        type: arg.type,
        description: arg.description,
      };
    });

    // Create tool object
    this._helper_toools.push({
      type: "function",
      function: {
        name: name,
        description: descriptionPrompt,
        parameters: {
          type: "object",
          properties: {
            ...parameters,
            _buttonLabel: {
              type: "string",
              description:
                "El nombre del boton que se mostrara en la pantalla del chat para ejecutar esta funcion",
            },
          },
          required: [...requiredArgs, "_buttonLabel"],
        },
      },
    });
  }

  addAttribute(name: string, data: any, descriptionPrompt: string) {
    // User data is stored in tools then an other model is used to create the text
    // for that given data to reduce the ammount of tokens needed

    if (Object.keys(this._functions_dict).includes(`_get_${name}`)) {
      console.error(`Function name already exists (_get_${name})`);
      return;
    }

    this._functions_dict[`_get_${name}`] = () => {
      return data;
    }; // saves function in dictionary

    this._helper_toools.push({
      type: "function",
      function: {
        name: `_get_${name}`,
        description: descriptionPrompt,
      },
    });
  }

  setRouteHelper(routes: RoutesAI) {
    // Creates tool object that navigates to the given deeplink parameter by AI
    if (!this._executable_functions.includes("navigate")) {
      this._executable_functions.push("navigate");
    }

    this._route_tools = {
      type: "function",
      function: {
        name: "navigate",
        description:
          "Genera botones de navegacion dentro de la app usando los deeplinks disponibles.",
        parameters: {
          type: "object",
          properties: {
            deepLink: {
              type: "string",
              description:
                "El deep link de la ruta a la que deseas navegar. Las rutas disponibles son:\n" +
                routes
                  .map((r) => `${r.route_name}: ${r.description}`)
                  .join("\n"),
            },
            _buttonLabel: {
              type: "string",
              description:
                "El nombre del boton que se mostrara en la pantalla del chat para ejecutar esta funcion",
            },
          },
          required: ["deepLink", "_buttonLabel"],
        },
      },
    };
  }
}

export default HelpAI;
