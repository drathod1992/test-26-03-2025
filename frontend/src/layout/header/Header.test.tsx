import { render, screen } from "@testing-library/react";
import Header from "./Header"; // Adjust the import path if needed

describe("Header Component", () => {
  test("renders the header with correct text", () => {
    render(<Header />);
    const headerElement = screen.getByText(/Post Management/i);
    expect(headerElement).toBeInTheDocument();
  });
});