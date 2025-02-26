import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  showSSOLogin: boolean;
  userId: string | null;
  setIsLoggedIn: (value: boolean) => void;
  setShowSSOLogin: (value: boolean) => void;
  setUserId: (userId: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  showSSOLogin: true, // Start with login screen visible
  userId: null,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setShowSSOLogin: (showSSOLogin) => set({ showSSOLogin }),
  setUserId: (userId) => set({ userId }),
  logout: () => set({ 
    isLoggedIn: false, 
    showSSOLogin: true,
    userId: null
  }),
}));

export default useAuthStore;
