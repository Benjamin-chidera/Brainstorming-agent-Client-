import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export const Protect = ({ isAuth }: { isAuth: boolean }) => {
  const { isCheckingAuth, setIsModalOpen, setIsLogin } = useAuthStore();

  if (isCheckingAuth) {
    // Return null or a loading spinner while the auth check completes
    return null; 
  }

  if (!isAuth) {
    setIsModalOpen(true);
    setIsLogin(true);
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
