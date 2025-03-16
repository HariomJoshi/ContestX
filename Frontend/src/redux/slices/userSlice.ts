import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UserSliceType, UserType } from "../../types";
import { FetchState } from "../../helper";
import axios from "axios";

export const fetchUserData = createAsyncThunk<UserType, string>(
  "user/fetchUserData", // action type prefix

  async (userId, thunkAPI) => {
    // payload creator
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(
        `${BACKEND_URL}/getUser?userId=${userId}`
      );
      return response.data.data;
    } catch (err) {
      console.log(err);
      throw new Error("Some error occured while fetching the user");
    }
  }
);

const initialState: UserSliceType = {
  status: FetchState.loading,
  error: "Error message here",
  data: {
    id: 23,
    name: "Name",
    username: "Username",
    email: "mail@gmail.com",
    ratingsChanged: [34],
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
        state.status = FetchState.loaded;
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = FetchState.failed;
        state.error = action.error.message;
      });
  },
});
export const {} = userSlice.actions;
export default userSlice.reducer;
