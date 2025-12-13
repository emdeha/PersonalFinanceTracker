import { screen, render } from "@testing-library/react";
import App from "./App.tsx";

describe("App", () => {
  it("renders ExpenseTracker", () => {
    render(<App />);

    expect(screen.getByTestId("expense-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("expense-amount-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-expense-button")).toBeInTheDocument();
  });
});