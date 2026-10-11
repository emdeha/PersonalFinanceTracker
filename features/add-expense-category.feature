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

    Scenario: The category field is cleared after adding an expense
      Given I have entered "Coffee" in the name field
      And I have entered "5" in the amount field
      And I have entered "Food" in the category field
      When I click "Add"
      Then the category field is empty

    Scenario: An expense can be added without a category
      When I add an expense named "Coffee" with amount "5"
      Then I see an expense row "Coffee 5"
      And the row shows no category

  Rule: The category is cleaned up like the name

    Scenario: Surrounding whitespace is trimmed from the category
      When I add an expense named "Coffee" with amount "5" and category "  Food  "
      Then I see an expense row "Coffee 5 (Food)"

    Scenario: A whitespace-only category counts as no category
      When I add an expense named "Coffee" with amount "5" and category "   "
      Then I see an expense row "Coffee 5"
      And the row shows no category

  Rule: A failed add keeps what I typed

    Scenario: The category is kept when validation fails
      Given I have entered "Food" in the category field
      When I click "Add"
      Then I see the error "Name is required"
      And the category field contains "Food"
