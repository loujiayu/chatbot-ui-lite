import { post } from './api';
import API_CONFIG from '../config';
import useAuthStore from '../store/useAuthStore';

export interface Message {
  type: string;
  content: string;
  isImage?: boolean;
}

interface ChatResponse {
  message: string;
}

export async function sendChatMessage(messages: Message[]) {
  // Use the new API endpoint format with patient_id in the path
  const url = `${API_CONFIG.CHAT_API_URL}/chat/session`;
  
  const response = await post<ChatResponse>(
    url,
    { messages }
  );
  
  return {
    success: response.success,
    message: response.data?.message || "I understand. Please tell me more about how you're feeling.",
    error: response.error
  };
}
