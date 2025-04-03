import { render, screen } from "@testing-library/react";
import Footer from "./Footer"; // Adjust the import path if needed

describe("Footer Component", () => {
  test("renders the footer with correct text", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const footerText = `\u00A9 ${currentYear} Post Management System`;
    const footerElement = screen.getByText(footerText);
    expect(footerElement).toBeInTheDocument();
  });
});