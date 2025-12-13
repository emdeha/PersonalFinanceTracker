Feature: Add Multiple Expenses
  As a user managing my personal finances
  I want to add multiple expenses with names and amounts
  So that I can track all my spending

  Scenario: Successfully add multiple valid expenses
    Given I am on the expense tracker page
    When I enter "Coffee" as the expense name
    And I enter "5" as the expense amount
    And I click the add expense button
    And I enter "Lunch" as the expense name
    And I enter "12.50" as the expense amount
    And I click the add expense button
    And I enter "Bus fare" as the expense name
    And I enter "2.75" as the expense amount
    And I click the add expense button
    Then the expense list should contain 3 expenses
    And the expense list should contain "Coffee" with amount "5"
    And the expense list should contain "Lunch" with amount "12.50"
    And the expense list should contain "Bus fare" with amount "2.75"

  Scenario: Cannot add expense with empty name
    Given I am on the expense tracker page
    When I leave the expense name field empty
    And I enter "10" as the expense amount
    And I click the add expense button
    Then the expense should not be added
    And I should see an error message "Name is required"

  Scenario: Cannot add expense with empty amount
    Given I am on the expense tracker page
    When I enter "Lunch" as the expense name
    And I leave the expense amount field empty
    And I click the add expense button
    Then the expense should not be added
    And I should see an error message "Amount is required"

  Scenario: Cannot add expense with zero amount
    Given I am on the expense tracker page
    When I enter "Free item" as the expense name
    And I enter "0" as the expense amount
    And I click the add expense button
    Then the expense should not be added
    And I should see an error message "Amount must be greater than zero"

  Scenario: Cannot add expense with negative amount
    Given I am on the expense tracker page
    When I enter "Refund" as the expense name
    And I enter "-20" as the expense amount
    And I click the add expense button
    Then the expense should not be added
    And I should see an error message "Amount must be greater than zero"
