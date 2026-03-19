import { Navigate, Outlet } from "react-router-dom";

export const Protect = ({ isAuth }: { isAuth: boolean }) => {
  // const {user} = useAuthStore()
  if (!isAuth) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
