import { get, post } from './api';
import useAuthStore from '../store/useAuthStore';

interface PromptResponse {
  content: string;
}

const API_BASE_URL = 'http://localhost:5000';
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
  
  const url = `${API_BASE_URL}/prompt/${userId}`;
  const response = await post<{}, { 
    user_type: string; 
    prompt_blob: string;
    prompt: string;
  }>(
    url,
    { 
      user_type: userType, 
      prompt_blob: promptBlob,
      prompt 
    }
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
