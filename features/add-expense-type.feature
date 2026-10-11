Feature: Mark an expense as expense or income
  As a person tracking my finances
  I want to mark each expense as an expense or income
  So that I can tell money going out from money coming in

  Background:
    Given I open the Personal Finance Tracker
    And no expenses have been added

  Rule: Every expense row shows its type after the category

    Scenario: An expense added without choosing a type is an expense
      When I add an expense named "Coffee" with amount "5"
      Then I see an expense row "Coffee 5 Expense"

    Scenario: The type is shown after the category
      When I add an expense named "Salary" with amount "3000", category "Work" and type "Income"
      Then I see an expense row "Salary 3000 (Work) Income"

  Rule: An expense can be marked as income

    Scenario: Add an income
      When I add an expense named "Salary" with amount "3000" and type "Income"
      Then I see an expense row "Salary 3000 Income"

  Rule: An expense is an expense unless I choose otherwise

    Scenario: Expense is selected when the form opens
      Then the type field shows "Expense"

    Scenario: The type returns to Expense after adding an expense
      When I add an expense named "Salary" with amount "3000" and type "Income"
      Then the type field shows "Expense"

    Scenario: A type chosen once does not carry over to the next expense
      Given I have added an expense named "Salary" with amount "3000" and type "Income"
      When I add an expense named "Coffee" with amount "5"
      Then the first expense row is "Salary 3000 Income"
      And the second expense row is "Coffee 5 Expense"

  Rule: A failed add keeps the type I chose

    Scenario: The type is kept when validation fails
      When I try to add an expense with only the type "Income"
      Then I see the error "Name is required"
      And the type field shows "Income"

    Scenario: A kept type is saved when the add succeeds on retry
      Given I tried to add an expense with only the type "Income"
      When I complete the expense with name "Salary" and amount "3000"
      Then I see an expense row "Salary 3000 Income"
