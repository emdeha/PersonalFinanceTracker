# Instructions

1. Instruct Claude to write Gherkin spec - adding an expense by Name and Amount
   1. It'll add it under docs/features -> first improvement to CLAUDE.md
2. Instruct Claude to write Playwright tests based on the Gherkin spec
   1. First it'll create an e2e test. Instruct it to create component tests instead and encode that kknowledge in CLAUDE.md
   2. Rewrite the tests to be component-based
   3. Make sure that these tests fail
   4. Make sure that there are no linter/type errors
3. Review the specs by hand
4. Go through the Gherkin scenarios one by one and implement them
    1. Do as small steps as possible
    2. After each step, review code
5. After the first pass, encode this flow in CLAUDE.md - use https://claude.ai/share/50aa04d6-2bcd-4326-bcca-e9a2865f4cdd as an example how to extract relevant info to build a skill
6. Continue until all is implemented and observe how well does Claude keep the flow. Add modifications to CLAUDE.md
7. Next step - add category. But before you start it out - encode the BDD workflow into a skill and start using it (steps 1 to 4)
8. Add a Gherkin review agent (based on some good resource on BDD) + a code review agent (based on a good resource on code review)
