export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export interface Message {
  role: Role;
  content: string;
}

export interface MedResponse {
  thread_id: string;
  message: string;
}

export type Role = "assistant" | "user";
