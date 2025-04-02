import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../slices/postSlice";
import { Post } from "../types";

function* fetchPostsSaga() {
  try {
    const response: { data: Post[] } = yield call(
      axios.get,
      "http://localhost:5000/api/posts"
    );
    yield put(fetchPostsSuccess(response.data));
  } catch (error) {
    yield put(fetchPostsFailure("Error fetching posts"));
  }
}

export default function* rootSaga() {
  yield takeLatest(fetchPostsRequest.type, fetchPostsSaga);
}
