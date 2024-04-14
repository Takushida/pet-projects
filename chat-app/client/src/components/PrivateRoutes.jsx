import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AccountContext } from "./UserContext";

function useAuth() {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
}

export default function PrivateRoutes() {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}
