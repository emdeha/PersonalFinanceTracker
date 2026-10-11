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
      And the category field is empty

  Rule: Surrounding whitespace in the category is ignored

    Scenario: Surrounding whitespace is trimmed from the category
      When I add an expense named "Coffee" with amount "5" and category "  Food  "
      And I add an expense named "Bus" with amount "3" and category "   "
      Then the first expense row is "Coffee 5 (Food)"
      And the second expense row is "Bus 3"
