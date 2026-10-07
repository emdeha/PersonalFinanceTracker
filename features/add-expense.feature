Feature: Add an expense by name and amount
  As a person tracking my finances
  I want to add an expense by entering its name and amount
  So that I can see where my money goes

  Background:
    Given I open the Personal Finance Tracker
    And no expenses have been added

  Scenario: Add a valid expense
    When I enter "Coffee" in the name field
    And I enter "5" in the amount field
    And I click "Add"
    Then I see an expense row with name "Coffee" and amount "5"

  Scenario: Input fields are cleared after adding an expense
    Given I have entered "Coffee" in the name field
    And I have entered "5" in the amount field
    When I click "Add"
    Then the name field is empty
    And the amount field is empty

  Scenario: Add multiple expenses
    Given I have added an expense named "Coffee" with amount "5"
    When I add an expense named "Groceries" with amount "30"
    Then I see an expense row with name "Coffee" and amount "5"
    And I see an expense row with name "Groceries" and amount "30"

  Scenario: Expenses are listed in the order they were added
    Given I have added an expense named "Coffee" with amount "5"
    When I add an expense named "Groceries" with amount "30"
    Then the first expense row is "Coffee"
    And the second expense row is "Groceries"

  Scenario: Add an expense with a decimal amount
    When I add an expense named "Coffee" with amount "4.50"
    Then I see an expense row with name "Coffee" and amount "4.50"

  Scenario: Add two expenses with the same name
    Given I have added an expense named "Coffee" with amount "5"
    When I add an expense named "Coffee" with amount "6"
    Then I see 2 expense rows named "Coffee"

  Scenario: Surrounding whitespace is trimmed from the name
    When I add an expense named "  Coffee  " with amount "5"
    Then I see an expense row with name "Coffee" and amount "5"

  Scenario: Cannot add an expense without a name
    When I enter "5" in the amount field
    And I click "Add"
    Then I see the error "Name is required"
    And no expense row is added

  Scenario: Cannot add an expense with a whitespace-only name
    When I add an expense named "   " with amount "5"
    Then I see the error "Name is required"
    And no expense row is added

  Scenario: Cannot add an expense without an amount
    When I enter "Coffee" in the name field
    And I click "Add"
    Then I see the error "Amount is required"
    And no expense row is added

  Scenario Outline: Cannot add an expense with an invalid amount
    When I add an expense named "Coffee" with amount "<amount>"
    Then I see the error "<error>"
    And no expense row is added

    Examples:
      | amount | error                         |
      | abc    | Amount must be a number       |
      | 0      | Amount must be greater than 0 |
      | -5     | Amount must be greater than 0 |

  Scenario: Entered values are kept when validation fails
    Given I have entered "Coffee" in the name field
    When I click "Add"
    Then the name field contains "Coffee"

  Scenario: The error disappears after a successful add
    Given I tried to add an expense without a name
    And I see the error "Name is required"
    When I add an expense named "Coffee" with amount "5"
    Then I do not see any error
