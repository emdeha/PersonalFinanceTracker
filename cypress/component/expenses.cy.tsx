import App from "../../src/App";

const mountApp = () => cy.mount(<App />);

const fillExpenseForm = ({
  name,
  amount,
}: {
  name: string;
  amount: string;
}) => {
  if (name) {
    cy.findByLabelText(/name/i).type(name);
  }
  if (amount) {
    cy.findByLabelText(/amount/i).type(amount);
  }
};

const submitExpenseForm = () => {
  cy.findByRole("button", { name: /add expense/i }).click();
};

const addExpense = (options: { name: string; amount: string }) => {
  fillExpenseForm(options);
  submitExpenseForm();
};

describe("Expense Management", () => {
  context("Empty state", () => {
    it("shows an empty expense list message when there are no expenses", () => {
      mountApp();
      cy.findByText(/no expenses/i).should("be.visible");
    });
  });

  context("Adding expenses", () => {
    it("shows the expense in the list after adding it with name and formatted amount", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "50" });
      cy.findByText("Groceries").should("be.visible");
      cy.findByText("£50.00").should("be.visible");
    });

    it("clears the form inputs after adding an expense", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "50" });
      cy.findByLabelText(/name/i).should("have.value", "");
      cy.findByLabelText(/amount/i).should("have.value", "");
    });

    it("shows all expenses when multiple are added", () => {
      mountApp();
      addExpense({ name: "Rent", amount: "1200" });
      addExpense({ name: "Utilities", amount: "80" });
      cy.findByText("Rent").should("be.visible");
      cy.findByText("£1200.00").should("be.visible");
      cy.findByText("Utilities").should("be.visible");
      cy.findByText("£80.00").should("be.visible");
    });
  });

  context("Validation", () => {
    it("shows a name field validation error and does not add an expense when name is empty", () => {
      mountApp();
      addExpense({ name: "", amount: "50" });
      cy.findByLabelText(/name/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("shows an amount field validation error and does not add an expense when amount is empty", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "" });
      cy.findByLabelText(/amount/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("shows an amount field validation error when amount is not a number", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "abc" });
      cy.findByLabelText(/amount/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("shows an amount field validation error when amount is zero", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "0" });
      cy.findByLabelText(/amount/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("shows an amount field validation error when amount is negative", () => {
      mountApp();
      addExpense({ name: "Groceries", amount: "-10" });
      cy.findByLabelText(/amount/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("shows a name field validation error when name is whitespace-only", () => {
      mountApp();
      addExpense({ name: "   ", amount: "50" });
      cy.findByLabelText(/name/i).should("have.attr", "aria-invalid", "true");
      cy.findByText(/no expenses/i).should("be.visible");
    });
  });

  context("Removing expenses", () => {
    it("removes the expense from the list", () => {
      mountApp();
      addExpense({ name: "Coffee", amount: "5" });
      cy.findByRole("button", { name: /remove coffee/i }).click();
      cy.findByText("Coffee").should("not.exist");
    });

    it("shows the empty state message after removing the last expense", () => {
      mountApp();
      addExpense({ name: "Coffee", amount: "5" });
      cy.findByRole("button", { name: /remove coffee/i }).click();
      cy.findByText(/no expenses/i).should("be.visible");
    });

    it("does not affect other expenses when one expense is removed", () => {
      mountApp();
      addExpense({ name: "Coffee", amount: "5" });
      addExpense({ name: "Lunch", amount: "12" });
      cy.findByRole("button", { name: /remove coffee/i }).click();
      cy.findByText("Coffee").should("not.exist");
      cy.findByText("Lunch").should("be.visible");
      cy.findByText("£12.00").should("be.visible");
    });
  });
});
