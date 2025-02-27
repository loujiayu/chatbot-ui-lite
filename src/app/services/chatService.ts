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

export async function sendChatMessage(messages: Message[], instruction: string) {
  // Get the current user ID to use as patient_id
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to send messages.",
      error: 'User not authenticated'
    };
  }
  
  // Use the new API endpoint format with patient_id in the path
  const url = `${API_CONFIG.CHAT_API_URL}/chat/${userId}`;
  
  const response = await post<ChatResponse>(
    url,
    { messages, instruction }
  );
  
  return {
    success: response.success,
    message: response.data?.message || "I understand. Please tell me more about how you're feeling.",
    error: response.error
  };
}
