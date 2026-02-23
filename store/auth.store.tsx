import { create } from "zustand";

interface AuthState {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => set({ isModalOpen }),
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  isLogin: true,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
}));

