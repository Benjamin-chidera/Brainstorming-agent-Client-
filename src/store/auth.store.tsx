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
  getUser: (force?: boolean) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  full_name: string;
  setFull_Name: (full_name: string) => void;
  otp: string;
  setOtp: (otp: string) => void;

  // check user
  user: string | null;
  setUser: (user: string | null) => void;
  isAuth: boolean;
  setInitialized: (isAuth: boolean) => void;

  // logout
  logout: () => Promise<void>;
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
      isAuth: false,
      setUser: (user: string | null) => set({ user }),
      setInitialized: (isAuth: boolean) => set({ isAuth }),

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
        const { user, isAuth } = get();
        if (user && isAuth) return;

        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
          );
          if (data) {
            // console.log(data);

            set({ user: data, isAuth: true });
          }
        } catch (error: any) {
          // If 401, we just set user to null but mark initialized as true
          set({ user: null, isAuth: false });
        }
      },

      // google auth
      handleGoogleLogin: async () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
      },

      // logout
      logout: async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
          );
          console.log("logout res:", res);
          if (res.status === 200) {
            set({ user: null, isAuth: false });
            toast.success(res.data.message);
          }
        } catch (error: any) {
          console.error("logout error:", error.response?.data || error.message);
          toast.error(error.response?.data.detail);
        }
      },
    }),
    { name: "auth" },
  ),
);
