import { get, post } from './api';
import useAuthStore from '../store/useAuthStore';
import API_CONFIG from '../config';

interface ChatHistoryResponse {
  content: string; // It's a JSON string that needs to be parsed
}

const API_BASE_URL = API_CONFIG.BASE_URL;
const DEFAULT_USER_TYPE = 'patient';

export async function fetchChatHistory() {
  // Get the current user ID from the auth store
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      messages: [],
      error: 'User not authenticated'
    };
  }
  
  const url = `${API_BASE_URL}/chat/${userId}/history?user_type=${encodeURIComponent(DEFAULT_USER_TYPE)}`;
  const response = await get<ChatHistoryResponse>(url, true);
  
  try {
    if (response.success && response.data?.content) {
      // Parse the JSON string into an array of message objects
      const parsedMessages = JSON.parse(response.data.content);
      return {
        success: true,
        messages: Array.isArray(parsedMessages) ? parsedMessages : [],
        error: null
      };
    }
    
    return {
      success: response.success,
      messages: [],
      error: response.error
    };
  } catch (parseError) {
    console.error('Error parsing chat history JSON:', parseError);
    return {
      success: false,
      messages: [],
      error: 'Invalid chat history format'
    };
  }
}

export async function saveChatHistory(messages: Array<{ type: string; content: string; isImage?: boolean }>) {
  // Get the current user ID from the auth store
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }
  
  const url = `${API_BASE_URL}/chat/${userId}/history?user_type=${encodeURIComponent(DEFAULT_USER_TYPE)}`;
  
  // Convert messages array to JSON string
  const messagesJson = JSON.stringify(messages);
  
  const response = await post<{}, { content: string }>(
    url,
    { content: messagesJson }  // Send it in the expected format (as 'prompt')
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
