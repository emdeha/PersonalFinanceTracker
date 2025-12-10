Feature: Remove Expense
  As a user of the Personal Finance Tracker
  I want to remove expenses from my list
  So that I can correct mistakes or remove unwanted expenses

  Background:
    Given the Personal Finance Tracker application is open
    And I have added an expense named "Groceries" with amount "50.00"
    And I have added an expense named "Coffee" with amount "4.50"

  Scenario: Remove multiple expenses
    When I click the remove button for the expense "Groceries"
    And I click the remove button for the expense "Coffee"
    Then the expense list should be empty
    And I should see the message "No expenses added yet"

  Scenario: Remove the last remaining expense
    Given I have added an expense named "Groceries" with amount "50.00"
    And the expense list contains only 1 expense
    When I click the remove button for the expense "Groceries"
    Then the expense list should be empty
    And I should see the message "No expenses added yet"

  Scenario: Remove clears error messages
    Given I have attempted to add an expense with an empty name
    And I see the error message "Expense name is required"
    When I click the remove button for the expense "Groceries"
    Then I should no longer see the error message "Expense name is required"