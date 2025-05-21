import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  showSSOLogin: boolean;
  userId: string | null;
  token: string | null;
  userRole: string | null;
  setIsLoggedIn: (value: boolean) => void;
  setShowSSOLogin: (value: boolean) => void;
  setUserId: (userId: string | null) => void;
  setToken: (token: string | null) => void;
  setUserRole: (role: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  showSSOLogin: true, // Start with login screen visible
  userId: null,
  token: null,
  userRole: null,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setShowSSOLogin: (showSSOLogin) => set({ showSSOLogin }),
  setUserId: (userId) => set({ userId }),
  setToken: (token) => set({ token }),
  setUserRole: (userRole) => set({ userRole }),
  logout: () => {
    // Clear token from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    set({ 
      isLoggedIn: false, 
      showSSOLogin: true,
      userId: null,
      token: null,
      userRole: null
    });
  },
}));

export default useAuthStore;
