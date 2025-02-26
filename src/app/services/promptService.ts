import { get, post } from './api';
import useAuthStore from '../store/useAuthStore';

interface PromptResponse {
  content: string;
}

const API_BASE_URL = 'http://localhost:5000';
const USER_TYPE = 'patient';
const PROMPT_BLOB = 'system_instruction.txt';

export async function fetchPrompt() {
  // Get the current user ID from the auth store
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      content: '',
      error: 'User not authenticated'
    };
  }
  
  const url = `${API_BASE_URL}/prompt/${userId}`;
  const response = await get<PromptResponse>(url, true);
  
  return {
    success: response.success,
    content: response.data?.content || '',
    error: response.error
  };
}

export async function savePrompt(prompt: string) {
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
      user_type: USER_TYPE, 
      prompt_blob: PROMPT_BLOB,
      prompt 
    }
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
