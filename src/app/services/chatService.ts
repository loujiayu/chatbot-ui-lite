import { post } from './api';

interface Message {
  type: string;
  content: string;
  isImage?: boolean;
}

interface ChatResponse {
  message: string;
}

export async function sendChatMessage(messages: Message[], instruction: string) {
  const response = await post<ChatResponse>(
    'https://doctormt-85352025976.us-central1.run.app?ispatient=true',
    { messages, instruction }
  );
  
  return {
    success: response.success,
    message: response.data?.message || "I understand. Please tell me more about how you're feeling.",
    error: response.error
  };
}
