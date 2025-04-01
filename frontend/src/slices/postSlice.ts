import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../types";


interface PostState {
    data: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostState = { data: [], loading: false, error: null };

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        fetchPostsRequest: (state) => { state.loading = true; },
        fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
            state.data = action.payload;
            state.loading = false;
        },
        fetchPostsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.data.findIndex(post => post.id === action.payload.id);
            if (index !== -1) state.data[index] = action.payload;
        }
    }
});

export const { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure, updatePost } = postSlice.actions;
export default postSlice.reducer;
