import { get, post } from './api';
import useAuthStore from '../store/useAuthStore';
import API_CONFIG from '../config';

interface PromptResponse {
  content: string;
}

interface ChatHistoryResponse {
  content: string; // It's a JSON string that needs to be parsed
}

const API_BASE_URL = API_CONFIG.BASE_URL;
const DEFAULT_USER_TYPE = 'patient';
const DEFAULT_PROMPT_BLOB = 'system_instruction.txt';

export async function fetchPrompt(userType = DEFAULT_USER_TYPE, promptBlob = DEFAULT_PROMPT_BLOB) {
  // Get the current user ID from the auth store
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      content: '',
      error: 'User not authenticated'
    };
  }
  
  const url = `${API_BASE_URL}/prompt/${userId}?user_type=${encodeURIComponent(userType)}&prompt_blob=${encodeURIComponent(promptBlob)}`;
  const response = await get<PromptResponse>(url, true);
  
  return {
    success: response.success,
    content: response.data?.content || '',
    error: response.error
  };
}

export async function savePrompt(prompt: string, userType = DEFAULT_USER_TYPE, promptBlob = DEFAULT_PROMPT_BLOB) {
  // Get the current user ID from the auth store
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }
  
  // Include user_type and prompt_blob as URL parameters instead of in the body
  const url = `${API_BASE_URL}/prompt/${userId}?user_type=${encodeURIComponent(userType)}&prompt_blob=${encodeURIComponent(promptBlob)}`;
  
  const response = await post<{}, { prompt: string }>(
    url,
    { prompt }
  );
  
  return {
    success: response.success,
    error: response.error
  };
}

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
  
  const url = `${API_BASE_URL}/prompt/${userId}?user_type=${encodeURIComponent(DEFAULT_USER_TYPE)}&prompt_blob=chat_history`;
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
  
  const url = `${API_BASE_URL}/prompt/${userId}?user_type=${encodeURIComponent(DEFAULT_USER_TYPE)}&prompt_blob=chat_history`;
  
  // Convert messages array to JSON string
  const messagesJson = JSON.stringify(messages);
  
  const response = await post<{}, { prompt: string }>(
    url,
    { prompt: messagesJson }  // Send it in the expected format (as 'prompt')
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
