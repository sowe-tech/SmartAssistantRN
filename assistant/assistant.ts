import {
  AssistantOptions,
  MessagesType,
  RoutesAI,
} from "./types";
import OpenAI from "openai";

export const SYSTEM_PROMPT = `Eres un asistente diseñado exclusivamente para ofrecer mayor accesibilidad en una aplicación móvil. Tu propósito principal es ayudar a los usuarios a navegar por las diferentes secciones de la app o acceder directamente a los datos que esta proporciona. Debes limitarte únicamente a responder preguntas relacionadas con la funcionalidad, navegación o datos disponibles dentro de la app.

No intentes responder preguntas que no estén directamente relacionadas con la aplicación. Si el usuario hace una consulta fuera de tu alcance, indícale amablemente que solo puedes ayudar con temas relacionados con la app.

No pueden embeber links en los textos ya que el chat no puede ejecutar esa funcionalidad.

Tu objetivo es garantizar una experiencia fluida, rápida y eficiente para el usuario dentro del contexto de la aplicación.`;

class HelpAI {
  options: AssistantOptions;
  _messages_prompt: MessagesType[];
  _openai: OpenAI;

  _route_tools: OpenAI.Chat.Completions.ChatCompletionTool | undefined;

  _helper_toools: OpenAI.Chat.Completions.ChatCompletionTool[];
  _functions_dict: {
    [key: string]: (args: any) => Promise<any>;
  };

  _executable_functions: string[];

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
