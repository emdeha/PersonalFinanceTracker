Feature: Expenses API
  As a client application
  I want to create expenses via a REST API
  So that expenses are stored on the server

  # ---------------------------------------------------------------------------
  # POST /api/expenses — Create an expense
  # ---------------------------------------------------------------------------

  Scenario: Creating a valid expense
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries", "amount": 50 }
      """
    Then the response status should be 201
    And the response Content-Type should be "application/json"
    And the response JSON should include a generated "id"
    And the response JSON "name" should equal "Groceries"
    And the response JSON "amount" should equal 50

  Scenario: Creating a second expense assigns a different id
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries", "amount": 50 }
      """
    And I POST to "/api/expenses" with JSON body:
      """
      { "name": "Rent", "amount": 1200 }
      """
    Then the two responses should have different "id" values

  Scenario: Creating an expense trims whitespace from the name
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "  Groceries  ", "amount": 50 }
      """
    Then the response status should be 201
    And the response JSON "name" should equal "Groceries"

  # ---------------------------------------------------------------------------
  # Validation errors
  # ---------------------------------------------------------------------------

  Scenario: Cannot create an expense without a name
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "amount": 50 }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "name"

  Scenario: Cannot create an expense with an empty name
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "", "amount": 50 }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "name"

  Scenario: Cannot create an expense with a whitespace-only name
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "   ", "amount": 50 }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "name"

  Scenario: Cannot create an expense without an amount
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries" }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "amount"

  Scenario: Cannot create an expense with a zero amount
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries", "amount": 0 }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "amount"

  Scenario: Cannot create an expense with a negative amount
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries", "amount": -10 }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "amount"

  Scenario: Cannot create an expense with a non-numeric amount
    Given the expense store is empty
    When I POST to "/api/expenses" with JSON body:
      """
      { "name": "Groceries", "amount": "abc" }
      """
    Then the response status should be 422
    And the response JSON should contain a validation error for "amount"
