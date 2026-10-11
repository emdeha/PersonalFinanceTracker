# part-2-extracting-bdd-and-next-iteration-2-code-review-agent

- Session ID: `ecd1f190-61ae-4f7f-930f-f3fce7447d38`
- Started: 2026-10-11T11:29:59.611Z
- Last activity: 2026-10-11T11:49:01.720Z
- Human prompts: 8

## Prompt 1

Create a skill and an agent that review code developed by the red-green-implemented agent. Research high quality code review practices from the XP community. The resulting code should:
1. Have high qualiyt behavior-driven tests not coupled to implementation
2. Be well refactored
3. Have well named variables
4. Follow hexagonal architecture and domain-driven design
5. Not be overengineered and abstracted away too much

## Prompt 2

the review implementation skill can be invoked at the end of a series of red-green-steps

## Prompt 3

no, decouple it from the red-green-step

## Prompt 4

@"implementation-reviewer (agent)" review the current codebase

## Prompt 5

validate finding 2 by actually doing the mutation

## Prompt 6

let's add that new rule to the skill and make sure the agent has the permissions to verify

## Prompt 7

@"implementation-reviewer (agent)" review the current codebase

## Prompt 8

resolve all findings
