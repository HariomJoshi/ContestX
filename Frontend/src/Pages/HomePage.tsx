import Blogs from "@/components/Blogs";
import Loader from "@/components/Loader";
import { FetchState } from "@/helper";
import { fetchUserData } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const HomePage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (id != null) {
      dispatch(fetchUserData(id));
    }
  }, [id]);

  const status: FetchState = useSelector((state: RootState) => {
    // console.log(state.user);
    return state.user.status;
  });

  return <>{status === FetchState.loading ? <Loader /> : <Blogs />}</>;
};

export default HomePage;
