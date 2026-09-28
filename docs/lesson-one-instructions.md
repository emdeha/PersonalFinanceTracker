# Instructions

1. Instruct Claude to write Gherkin spec
2. Instruct Claude to write Cypress tests based on the Gherkin spec
   1. Make sure that these tests fail
   2. Make sure that there are no linter/type errors
3. Use nw-acceptance-design-reviewer to review the specs
4. Go through the Gherkin scenarios one by one and implement them
    1. Do as small steps as possible
    2. After each step, spawn an nw-software-crafter-reviewer
5. Make sure to implement with hexagonal architecture
