export type Theme = {
    chat?: {
        header?: string;
        headerText?: string;

        background?: string;

        textLeft?: string;
        textRight?: string;
        messageBubbleLeft?: string;
        messageBubbleRight?: string;

        messageActionWrapper?: string;
        messageActionText?: string;

        textFieldBackground?: string;
        textFieldColor?: string;

        bottomWrapper?: string;
    },
    bubble?: {
        background?: string;
        icon?: string;
    }
}

export type AssistantOptions = {
    name: string;
    apiKey: string;
    firstMessage?: string;
    language?: string;
    theme?: Theme;
    avatar?: string;
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