import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const useAuth = (): boolean => {
  const token = useSelector((state: RootState) => state.auth.token);
  return Boolean(token);
};

export default useAuth;
