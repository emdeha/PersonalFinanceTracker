Feature: Categorize an expense
  As a person tracking my finances
  I want to give an expense a category
  So that I can see what kind of spending it was

  Background:
    Given I open the Personal Finance Tracker
    And no expenses have been added

  Rule: An expense can be given a category

    Scenario: Add an expense with a category
      When I add an expense named "Coffee" with amount "5" and category "Food"
      Then I see an expense row "Coffee 5 (Food)"

    Scenario: An expense can be added without a category
      When I add an expense named "Coffee" with amount "5"
      Then I see an expense row "Coffee 5"

    Scenario: Each expense keeps its own category
      Given I have added an expense named "Coffee" with amount "5" and category "Food"
      When I add an expense named "Bus" with amount "3" and category "Transport"
      Then the first expense row is "Coffee 5 (Food)"
      And the second expense row is "Bus 3 (Transport)"

  Rule: Surrounding whitespace in the category is ignored

    Scenario: Surrounding whitespace is trimmed from the category
      When I add an expense named "Coffee" with amount "5" and category "  Food  "
      Then I see an expense row "Coffee 5 (Food)"

    Scenario: A whitespace-only category counts as no category
      When I add an expense named "Coffee" with amount "5" and category "   "
      Then I see an expense row "Coffee 5"

  Rule: The category field is cleared after a successful add

    Scenario: The category field is cleared after adding an expense
      When I add an expense named "Coffee" with amount "5" and category "Food"
      Then the category field is empty

  Rule: A failed add keeps the category I typed

    Scenario: The category is kept when validation fails
      When I try to add an expense with only the category "Food"
      Then I see the error "Name is required"
      And no expense row is added
      And the category field contains "Food"

    Scenario: A kept category is saved when the add succeeds on retry
      Given I tried to add an expense with only the category "Food"
      When I complete the expense with name "Coffee" and amount "5"
      Then I see an expense row "Coffee 5 (Food)"
