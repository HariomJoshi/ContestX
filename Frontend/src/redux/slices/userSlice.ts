import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UserSliceType } from "../../types";
import { FetchState } from "../../helper";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData", // action type prefix
  async (userId, thunkAPI) => {
    // payload creator
    const response = await fetch(
      `https://localhost:3000/api/v1/user`
      // backend API here
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
);

const initialState: UserSliceType = {
  status: FetchState.loaded,
  error: "error message here",
  data: {
    name: "Name",
    username: "Username",
    email: "mail@gmail.com",
    contestsGiven: 1,
  },
};

const userSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = FetchState.loading;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = FetchState.failed;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = FetchState.failed;
        state.error = action.error.message;
      });
  },
});
export const {} = userSlice.actions;
export default userSlice;
