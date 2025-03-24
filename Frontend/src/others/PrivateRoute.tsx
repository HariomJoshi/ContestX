import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  // currently doing it with localStorage, ultimately i have to move it to cookies
  // (user cannot open this route untill it is logged in)

  return token ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
