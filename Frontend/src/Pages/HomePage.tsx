import Loader from "@/components/Loader";
import { FetchState } from "@/helper";
import { fetchUserData } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const HomePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (id != null) {
      dispatch(fetchUserData(id));
    }
  }, []);

  const status: FetchState = useSelector((state: RootState) => state.status);
  return (
    <>{status === FetchState.loading ? <Loader /> : <div>HomePage</div>}</>
  );
};

export default HomePage;
