import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


axios.defaults.withCredentials = true;

interface AuthState {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  isOtpModalOpen: boolean;
  setIsOtpModalOpen: (isOtpModalOpen: boolean) => void;
  register: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  login: () => Promise<void>;
  getUser: () => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  full_name: string;
  setFull_Name: (full_name: string) => void;
  otp: string;
  setOtp: (otp: string) => void;

  // check user
  user: string | null;
  isInitialized: boolean;
  setUser: (user: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
  // error: null,
  otp: "",
  // setError: (error: string | null) => set({ error }),
  email: "",
  full_name: "",
  setOtp: (otp: string) => set({ otp }),
  setEmail: (email: string) => set({ email }),
  setFull_Name: (full_name: string) => set({ full_name }),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => set({ isModalOpen }),
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  isLogin: true,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  isOtpModalOpen: false,
  setIsOtpModalOpen: (isOtpModalOpen: boolean) => set({ isOtpModalOpen }),

  // user
  user: null,
  isInitialized: false,
  setUser: (user: string | null) => set({ user }),
  setInitialized: (isInitialized: boolean) => set({ isInitialized }),

  // auth functions
  register: async () => {
    const { email, full_name } = get();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { full_name, email },
      );
      // console.log("register res:", res);
      if (res.status === 201) {
        set({ isOtpModalOpen: true, isModalOpen: false });
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(
        "register error:",
        error.response?.data.detail || error.message.detail,
      );
      // set({ error: error.response?.data.detail });
      toast.error(error.response?.data.detail);
    }
  },

  verifyOtp: async () => {
    const { otp, email, getUser } = get();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { otp, email },
      );
      console.log(res);
      if (res.status === 200) {
        set({
          isOtpModalOpen: false,
          isModalOpen: false,
          otp: "",
          email: "",
          full_name: "",
        });
        toast.success(res.data.message);
        getUser();
      }
    } catch (error: any) {
      console.error(
        "verify otp error:",
        error.response?.data.detail || error.message.detail,
      );
      toast.error(error.response?.data.detail);
    }
  },

  login: async () => {
    const { email } = get();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email },
      );
      console.log("login res:", res);
      if (res.status === 200) {
        set({ isOtpModalOpen: true, isModalOpen: false });
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error("login error:", error.response?.data || error.message);
      toast.error(error.response?.data.detail);
    }
  },

  getUser: async () => {
    const { user, isInitialized } = get();
    if (user || isInitialized) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      console.log("check user res:", res);
      if (res.status === 200) {
        set({ user: res.data.user, isInitialized: true });
      }

      console.log("user:", user);
    } catch (error: any) {
      console.error(
        "check user error:",
        error.response?.data.detail || error.message.detail,
      );
      set({ isInitialized: true });
    }
  },

  // google auth
  handleGoogleLogin: async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  },
    }),
    { name: "auth" },
  ),
);
