import { io } from "socket.io-client";
import { create } from "zustand";

// export const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8000", {
//     withCredentials: true // Crucial bit to ensure the frontend sends the HTTPOnly cookie
// });

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : "http://localhost:8000";
console.log(SOCKET_URL);
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

// Optional: you can export a hook or a zustand store here if you want to track the connection state globally
interface SocketState {
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
}));

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  useSocketStore.getState().setIsConnected(true);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
  useSocketStore.getState().setIsConnected(false);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
  useSocketStore.getState().setIsConnected(false);
});
