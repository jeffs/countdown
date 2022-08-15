import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders solver", () => {
  render(<App />);
  const element = screen.getByText("Solver");
  expect(element).toBeInTheDocument();
});
