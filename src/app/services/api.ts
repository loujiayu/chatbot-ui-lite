// Base API utility functions for fetch requests

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper function to get the access token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export async function get<T>(url: string, includeCredentials = false): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method: 'GET',
      credentials: "include",
      headers: {}
    };
    
    if (includeCredentials) {
      options.credentials = 'include';
    }
    
    // Add Authorization header if token exists
    const token = getAccessToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`,
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function post<T, U = any>(url: string, body: U): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token exists
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`,
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
