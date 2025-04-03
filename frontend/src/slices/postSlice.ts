import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../types";

// Define the shape of the state for posts
interface PostState {
  data: Post[]; // Array to store fetched posts
  loading: boolean; // Indicates if posts are being loaded
  error: string | null; // Stores error messages (if any)
}

// Initial state of the post slice
const initialState: PostState = {
  data: [],
  loading: false,
  error: null,
};

// Create the slice using createSlice from Redux Toolkit
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Action to indicate that posts are being fetched
    fetchPostsRequest: (state) => {
      state.loading = true;
    },

    // Action to store the successfully fetched posts in state
    fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.data = action.payload; // Update posts data
      state.loading = false; // Set loading to false
    },

    // Action to handle errors if fetching posts fails
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload; // Store error message
      state.loading = false; // Set loading to false
    },

    // Action to update a specific post in the state
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.data.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) state.data[index] = action.payload; // Update the post if found
    },
  },
});

// Export action creators
export const {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  updatePost,
} = postSlice.actions;

// Export the reducer to be used in the store
export default postSlice.reducer;
