import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import createSagaMiddleware from "redux-saga";
import { RootState } from "../../store/store";
import { fetchPostsRequest, updatePost } from "../../slices/postSlice";
import mockPosts from "./_mocks_/mockData.json";
import PostList from "./PostList";

// Setup Redux mock store with Saga middleware
const sagaMiddleware = createSagaMiddleware();
const mockStore = configureStore([sagaMiddleware]);

const initialState: RootState = {
  posts: { data: mockPosts, loading: false, error: null },
};

describe("PostList Component", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  test("renders PostList component", () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search Post/i)).toBeInTheDocument();
  });

  test("dispatches fetchPostsRequest on mount", () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchPostsRequest());
  });

  test("displays loading state", () => {
    store = mockStore({
      posts: { data: [], loading: true, error: null },
    });

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("renders fetched posts correctly", async () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    expect(screen.getByText("Sample Post 1")).toBeInTheDocument();
    expect(screen.getByText("Sample body content 1")).toBeInTheDocument();
  });

  test("filters posts based on search input", async () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("Search Post");
    fireEvent.change(searchInput, { target: { value: "Post 1" } });

    await waitFor(() => {
      expect(screen.getByText("Sample Post 1")).toBeInTheDocument();
      expect(screen.queryByText("Sample Post 2")).not.toBeInTheDocument();
    });
  });

  test("opens and edits post in the dialog", async () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    const postRow = screen.getByText("Sample Post 1");
    fireEvent.click(postRow);

    await waitFor(() => {
      expect(screen.getByText("Edit Post")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Sample Post 1");
    fireEvent.change(titleInput, { target: { value: "Updated Post Title" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updatePost({ ...mockPosts[0], title: "Updated Post Title" })
      );
    });
  });

  test("changes pagination and updates post list", async () => {
    store = mockStore({
      posts: {
        data: [...mockPosts, { userId: 1, id: 3, title: "Extra Post", body: "Body 3" }],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByText("Extra Post")).toBeInTheDocument();
    });
  });
});
