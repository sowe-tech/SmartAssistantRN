export type AssistantOptions = {
    language?: string;
    name: string;
    avatar?: string;
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export type RouteAI = {
    route_name: string,
    description: string,
}

export type RoutesAI = RouteAI[];

export type MessagesType = {
    model: string;
    messages: {
        role: "system" | "user" | "assistant";
        content: string;
    };
}