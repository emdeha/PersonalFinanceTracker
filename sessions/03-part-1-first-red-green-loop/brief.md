# part-1-first-red-green-loop

- Session ID: `984fb66d-7a6a-464e-b635-9aa978714169`
- Started: 2026-10-07T07:44:31.390Z
- Human prompts: 21

## Prompt 1

let's implement the first failing test in @src/add-expense.ct.tsx. Mark all others as skipped so our pipeline runs fast

## Prompt 2

do any other tests pass as part of this implementation?

## Prompt 3

okay, so let's remove the code that makes any other tests besides the first pass

## Prompt 4

okay, encode the rule that only the test chosen at this step should pass in CLAUDE.md

## Prompt 5

commit and push

## Prompt 6

okay, now let's uncomment the other test and write the minimum amount of code to make it pass

## Prompt 7

yes, commit and push

## Prompt 8

okay, now let's handle adds an expense with a decimal amount

## Prompt 9

commit and push

## Prompt 10

now, let's extract this red-green flow in a skill instead of keeping it in Claude.md

## Prompt 11

now create an agent that uses this skill so we can preserve the main context

## Prompt 12

now, let's use hooks to make sure the agent actually follows the loop. The hooks should take care of the following:
1. When a test has been chosen - verify that only this test is unskipped and it fails
2. When the implementation has been written - verify that only the source code of the implementation has been edited
3. After the implementation has been written - verify that the unskipped test is green
4. After the implementation has been written - verify that only: 4.1. the unskipped test is green and 4.2 all other tests that used to be green are still green and 4.3. all other tests are red
5. Overall, the hooks should make sure the red-green loop is followed strictly; one test at a time

## Prompt 13

okay, let's go step by step first - start with point 1. When the agent has been invoked, it should first unskip the test and the test should fail. only if that happens the agent can continue

## Prompt 14

good, that works. let's implement point 2

## Prompt 15

okay, now let's implement point 3

## Prompt 16

go ahead with point 4

## Prompt 17

keep it as strict. if such a condition occurs we'll instruct a separate agent to rework the tests or delete a test that doesn't add new insight into the system

## Prompt 18

let's implement point 5. the other stuff will be handled separately

## Prompt 19

the agent in the "part-1-first-red-green-loop-test-2" session succeeded even though the hooks were violated

## Prompt 20

actually, when this happens, the subagent should revert its changes apart from reporting the failed scenario to the main agent. the human should go in and resolve the issue

## Prompt 21

this agent reported the following issue



<pasted_content id="31cf">
❯ run @"red-green-implementer (agent)" in a loop until all skipped tests are passing

  Searched for 1 pattern

There are 8 skipped tests (the Scenario Outline at line 113 may expand to several). I'll run the agent one step at a time.

⏺ red-green-implementer(Red-green step: next skipped test)
Backgrounded agent (↓ to manage · ctrl+o to expand)

The first red-green step is running in the background. I'll launch the next one when it finishes, and keep going until no test.skip is left.

✻ Waiting for 1 background agent to finish

⏺ Agent "Red-green step: next skipped test" finished · 1m 21s

  Ran 1 shell command
Resuming agent a839941
Allowed by auto mode classifier

I asked the agent to explain what happened. Its first run left no changes (the working tree is clean and all 8 test.skip remain) and it sent no report. I'm waiting for its answer before I start the next step.

⏺ Agent "Red-green step: next skipped test" finished · 2m 3s

  Read 1 file, ran 2 shell commands

The loop is stopped. The agent made no progress, and I haven't changed anything myself. All 8 skipped tests are still skipped and the working tree is clean.

What went wrong:
- The agent ran twice (about 20 tool calls). Neither run sent a report through the handback tool.
- Both times, the SubagentStop hook (.claude/hooks/tdd-loop/hook.ts) blocked it with: "The chosen test is locked, but src/add-expense.ct.tsx changed. Revert it."
- The agent had already reverted its changes, and git shows nothing changed. So the hook looks like it is holding stale lock state from the first attempt.

Why I stopped: Another run would hit the same block. The fix is in the hook's state, and the hook is the enforcement you added in the last commits. Sandbox rules also protect .claude/hooks, so I didn't edit or reset it.

What I need from you: Check whether the hook keeps a lock or state file, for example under .claude/ or the scratchpad, and clear it. Or tell me how it resets. Once that's done I'll relaunch the agent and keep looping until no test.skip remains. The next target is "lists expenses in the order they were added" (line 59).
</pasted_content id="31cf">
