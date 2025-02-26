import { get } from './api';

interface LoginStatusResponse {
  logged_in: boolean;
  user_id?: string;
}

const API_BASE_URL = 'http://localhost:5000';

export async function checkLoginStatus() {
  const response = await get<LoginStatusResponse>(`${API_BASE_URL}/loginstatus`, true);
  return {
    isLoggedIn: response.success && response.data ? response.data.logged_in : false,
    userId: response.success && response.data ? response.data.user_id || null : null,
    error: response.error
  };
}

export function getGoogleLoginUrl(callbackUrl: string) {
  return `${API_BASE_URL}/login/google/patient?cb=${encodeURIComponent(callbackUrl)}`;
}
