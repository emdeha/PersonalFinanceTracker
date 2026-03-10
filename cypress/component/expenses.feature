Feature: Expense Management
  As a user
  I want to manage my expenses
  So that I can track my personal finances

  # ---------------------------------------------------------------------------
  # Empty state
  # ---------------------------------------------------------------------------

  Scenario: Viewing the home page with no expenses
    Given I am on the home page
    Then I should see an empty expense list message

  # ---------------------------------------------------------------------------
  # Adding expenses
  # ---------------------------------------------------------------------------

  Scenario: Adding an expense with a name and amount
    Given I am on the home page
    When I add an expense with name "Groceries" and amount "50"
    Then I should see "Groceries" in the expense list
    And I should see "£50.00" next to "Groceries"

  Scenario: Form clears after adding an expense
    Given I am on the home page
    When I add an expense with name "Groceries" and amount "50"
    Then the name input should be empty
    And the amount input should be empty

  Scenario: Adding multiple expenses
    Given I am on the home page
    When I add an expense with name "Rent" and amount "1200"
    And I add an expense with name "Utilities" and amount "80"
    Then I should see "Rent" in the expense list
    And I should see "£1200.00" next to "Rent"
    And I should see "Utilities" in the expense list
    And I should see "£80.00" next to "Utilities"

  # ---------------------------------------------------------------------------
  # Validation
  # ---------------------------------------------------------------------------

  Scenario: Cannot add an expense without a name
    Given I am on the home page
    When I add an expense with name "" and amount "50"
    Then I should see a validation error for the name field
    And the expense list should be empty

  Scenario: Cannot add an expense without an amount
    Given I am on the home page
    When I add an expense with name "Groceries" and amount ""
    Then I should see a validation error for the amount field
    And the expense list should be empty

  Scenario: Cannot add an expense with a non-numeric amount
    Given I am on the home page
    When I add an expense with name "Groceries" and amount "abc"
    Then I should see a validation error for the amount field
    And the expense list should be empty

  Scenario: Cannot add an expense with a zero amount
    Given I am on the home page
    When I add an expense with name "Groceries" and amount "0"
    Then I should see a validation error for the amount field
    And the expense list should be empty

  Scenario: Cannot add an expense with a negative amount
    Given I am on the home page
    When I add an expense with name "Groceries" and amount "-10"
    Then I should see a validation error for the amount field
    And the expense list should be empty

  Scenario: Cannot add an expense with a whitespace-only name
    Given I am on the home page
    When I add an expense with name "   " and amount "50"
    Then I should see a validation error for the name field
    And the expense list should be empty

  # ---------------------------------------------------------------------------
  # Removing expenses
  # ---------------------------------------------------------------------------

  Scenario: Removing an expense
    Given I am on the home page
    And I have added an expense with name "Coffee" and amount "5"
    When I remove the expense "Coffee"
    Then I should not see "Coffee" in the expense list

  Scenario: Removing the last expense shows the empty state message
    Given I am on the home page
    And I have added an expense with name "Coffee" and amount "5"
    When I remove the expense "Coffee"
    Then I should see an empty expense list message

  Scenario: Removing one expense does not affect others
    Given I am on the home page
    And I have added an expense with name "Coffee" and amount "5"
    And I have added an expense with name "Lunch" and amount "12"
    When I remove the expense "Coffee"
    Then I should not see "Coffee" in the expense list
    And I should see "Lunch" in the expense list
    And I should see "£12.00" next to "Lunch"
