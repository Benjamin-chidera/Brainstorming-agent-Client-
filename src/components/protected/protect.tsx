import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export const Protect = ({ isAuth }: { isAuth: boolean }) => {
  const { setIsModalOpen, setIsLogin } = useAuthStore();
  if (!isAuth) {
    setIsModalOpen(true);
    setIsLogin(true);
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
