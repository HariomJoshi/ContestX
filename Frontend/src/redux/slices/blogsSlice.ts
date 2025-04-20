import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FetchState } from "@/helper";

interface BlogContent {
  section: string;
  text: string;
  subsections?: SubsectionBlogContent[];
}

interface SubsectionBlogContent {
  subsection: string;
  text: string;
}

interface Blog {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  content: BlogContent[];
}

const initialState = {
  status: FetchState.loading,
  data: [] as Blog[],
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      console.log("Fetching blogs function");
      const response = await axios.get(`${BACKEND_URL}/user/getBlogs`);
      console.log("Response: ");
      console.log(response);
      return response.data;
    } catch (error: any) {
      // If the request fails, check for an error response from the server.
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const Blogslice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBlogs.pending, (state) => {
      state.status = FetchState.loading;
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      state.status = FetchState.loaded;
      state.data = action.payload;
      console.log(action.payload);
    });
    builder.addCase(fetchBlogs.rejected, (state) => {
      console.log("Blogs cannot be fetched");
      state.status = FetchState.failed;
    });
  },
});

export const {} = Blogslice.actions;

export default Blogslice.reducer;
