# Instructions

1. Instruct Claude to write Gherkin spec - adding an expense by Name and Amount
   1. It'll add it under docs/features -> first improvement to CLAUDE.md
2. Instruct Claude to write Playwright tests based on the Gherkin spec
   1. First it'll create an e2e test. Instruct it to create component tests instead and encode that knowledge in CLAUDE.md
   2. Rewrite the tests to be component-based
   3. Make sure that these tests fail
   4. Make sure that there are no linter/type errors
3. Review the specs by hand
4. Go through the Gherkin scenarios one by one and implement them
    1. In the first scenario it'll probably make other tests pass as well. With the prompt:
        > 'let's implement the first failing test in @src/add-expense.ct.tsx. Mark all others as skipped so our pipeline runs fast'
    2. After you see the test pass, ask it to verify if others pass as well
    3. Encode that in CLAUDE.md as well
    4. After each step, review code
    5. Encode that in a loop
        1. Skill
        2. Agent that uses the skill to preserve context
        3. Hooks that control the loop - when a part of the hook has been implemented, I test it out in a separate claude session by skipping a test that already passes
        4. We start to work in 2 Claude sessions. One implements the code, the other improves our harness
        5. Notice that when "adds multiple expenses" is implemented the hooks might decide not to be called
        6. Notice that the state doesn't get cleaned between agent invocations
5. Continue until all is implemented and observe how well does Claude keep the flow. Add modifications to CLAUDE.md
6. Next step - add category. But before you start it out - encode the BDD workflow into a skill and start using it (steps 1 to 4)
7. Add a Gherkin review agent (based on some good resource on BDD) + a code review agent (based on a good resource on code review). Do the review + 
8. Start the category adding after the tests have been written.
	1. In a separate worktree
	2. Talk a bit about Supacode and other similar tools
	3. Until the red-green agent does them, spin up a separate worktree to work on the next functionality
9. Once the first is done, show how you'll approach merging the two diverging implementations
