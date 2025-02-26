import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  showSSOLogin: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setShowSSOLogin: (value: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  showSSOLogin: true, // Start with login screen visible
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setShowSSOLogin: (showSSOLogin) => set({ showSSOLogin }),
}));

export default useAuthStore;
