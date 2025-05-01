import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const useBlocked = (contestId: String | undefined): boolean => {
  const blockedContests: Number[] = useSelector(
    (state: RootState) => state.contests.blockedContests
  );
  if (contestId === undefined) return false;
  blockedContests.map((id) => {
    if (id === Number(contestId)) {
      return true;
    }
  });
  return false;
};

export default useBlocked;
