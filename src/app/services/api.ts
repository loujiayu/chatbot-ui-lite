// Base API utility functions for fetch requests

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function get<T>(url: string, includeCredentials = false): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (includeCredentials) {
      options.credentials = 'include';
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
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
