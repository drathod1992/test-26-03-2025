import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";
import App from "./App";

describe("App Component", () => {
  it("renders the PostList component within the Redux Provider", () => {
    render(<App />);
    expect(screen.getByText(/Posts/i)).toBeInTheDocument();
  });
});
