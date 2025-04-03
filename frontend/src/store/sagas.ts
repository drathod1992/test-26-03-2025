import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../slices/postSlice";
import { Post } from "../types";

// Base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Saga to handle fetching posts from the API.
 */
function* fetchPostsSaga() {
  try {
    // Call the API using axios.get and wait for the response
    const response: { data: Post[] } = yield call(
      axios.get,
      `${API_URL}/api/posts`
    );

    // Dispatch success action with fetched data
    yield put(fetchPostsSuccess(response.data));
  } catch (error) {
    // Dispatch failure action if an error occurs
    yield put(fetchPostsFailure("Error fetching posts"));
  }
}

/**
 * Root saga that watches for fetchPostsRequest action
 * and triggers fetchPostsSaga whenever the action is dispatched.
 */
export default function* rootSaga() {
  yield takeLatest(fetchPostsRequest.type, fetchPostsSaga);
}
