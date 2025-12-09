Feature: Add Expense to Personal Finance Tracker
  As a user
  I want to add expenses with a name and amount
  So that I can track my personal finances

  Scenario: Successfully adding a valid expense
    Given I am on the expense form
    When I enter "Groceries" as the expense name
    And I enter "50.00" as the amount
    And I click the "Add Expense" button
    Then the expense should be added to the list
    And I should see "Groceries" with amount "50.00" in the expense list

  Scenario: Rejecting expense with empty name
    Given I am on the expense form
    When I leave the expense name empty
    And I enter "25.00" as the amount
    And I click the "Add Expense" button
    Then I should see an error message "Expense name is required"
    And the expense should not be added to the list

  Scenario: Rejecting expense with empty amount
    Given I am on the expense form
    When I enter "Coffee" as the expense name
    And I leave the amount empty
    And I click the "Add Expense" button
    Then I should see an error message "Amount is required"
    And the expense should not be added to the list

  Scenario: Rejecting expense with negative amount
    Given I am on the expense form
    When I enter "Refund" as the expense name
    And I enter "-10.00" as the amount
    And I click the "Add Expense" button
    Then I should see an error message "Amount must be greater than zero"
    And the expense should not be added to the list

  Scenario: Rejecting expense with zero amount
    Given I am on the expense form
    When I enter "Free Item" as the expense name
    And I enter "0" as the amount
    And I click the "Add Expense" button
    Then I should see an error message "Amount must be greater than zero"
    And the expense should not be added to the list

  Scenario: Viewing multiple added expenses
    Given I am on the expense form
    And I have added an expense "Groceries" with amount "50.00"
    And I have added an expense "Coffee" with amount "5.50"
    And I have added an expense "Transport" with amount "15.00"
    When I view the expense list
    Then I should see "Groceries" with amount "50.00" in the expense list
    And I should see "Coffee" with amount "5.50" in the expense list
    And I should see "Transport" with amount "15.00" in the expense list

  Scenario: Viewing empty expense list
    Given I am on the expense form
    And I have not added any expenses
    When I view the expense list
    Then I should see a message "No expenses added yet"
