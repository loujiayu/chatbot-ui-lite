import { get, post } from './api';
import useAuthStore from '../store/useAuthStore';
import API_CONFIG from '../config';

interface PromptResponse {
  content: string;
}

const API_BASE_URL = API_CONFIG.BASE_URL;
const DEFAULT_USER_TYPE = 'patient';
const DEFAULT_PROMPT_BLOB = 'system_instruction.txt';

export async function fetchPrompt(_ = DEFAULT_USER_TYPE, promptBlob = DEFAULT_PROMPT_BLOB) {
  const url = `${API_BASE_URL}/prompt?&prompt_blob=${encodeURIComponent(promptBlob)}`;
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
  
  // Use the new simplified endpoint format
  const url = `${API_BASE_URL}/prompt?prompt_blob=${encodeURIComponent(promptBlob)}`;
  
  const response = await post<{}, { prompt: string }>(
    url,
    { prompt }
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
