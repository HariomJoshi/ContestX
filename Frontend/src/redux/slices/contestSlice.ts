import { FetchState } from "@/helper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ContestState {
  status: FetchState;
  contests: number[];
  blockedContests: string[];
}

const initialState: ContestState = {
  status: FetchState.loaded,
  contests: [],
  blockedContests: [],
};

export const fetchContests = createAsyncThunk<number[], string>(
  "user/fetchCotests",
  async (userId, thunkAPI) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const contests = await axios.get(
        `${BACKEND_URL}/user/contests/${userId}`
      );
      const contestIdArr: number[] = [];
      contests.data.map((contest: any) => {
        contestIdArr.push(contest.contestId);
      });
      return contestIdArr;
    } catch (err) {
      console.error("Error fetching contests:", err);
      return thunkAPI.rejectWithValue("Failed to fetch contests");
    }
  }
);

const contestSlice = createSlice({
  name: "user/contests",
  initialState,
  reducers: {
    addContest: (state, action) => {
      state.contests = [...state.contests, action.payload];
    },
    blockContest: (state, action) => {
      if (!Array.isArray(state.blockedContests)) {
        state.blockedContests = [action.payload];
      }
      if (!state.blockedContests.includes(action.payload)) {
        state.blockedContests = [...state.blockedContests, action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContests.pending, (state) => {
        state.status = FetchState.loading;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.status = FetchState.loaded;
        state.contests = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.status = FetchState.failed;
      });
  },
});

export const { addContest, blockContest } = contestSlice.actions;

export default contestSlice.reducer;
