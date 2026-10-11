# Sources and rationale

Material behind the `review-bdd-scenarios` skill. Each entry says what was taken and which pass uses it. Pages marked "fetched" were read directly while building the skill. Pages marked "not read" were only seen in search results, so check them before quoting them. Sources shared with `write-bdd-scenarios` are in `../../write-bdd-scenarios/references/sources.md`.

## Specification by Example (Gojko Adzic)

### "How to get the most out of Given-When-Then" (fetched)
https://gojko.net/2015/02/25/how-to-get-the-most-out-of-given-when-then/

- Keep the order Given, When, Then and do not interleave. One When per scenario. One thing checked per scenario. Taken into: Pass B.
- Tense trick: past for Given, present for When, future for Then. Givens and Thens are passive values and states, the When is the active action. "Given the user types 20% into the tax field" is the example of a Given that is really an action. Taken into: Pass B.
- Smells: multiple Whens, actions inside Then, interleaved clauses, unclear input versus outcome, long scenarios that read like a user session, a purpose you cannot state in one sentence. Taken into: Passes A and B.
- A single When forces you past UI mechanics to the business behaviour. Taken into: Pass B declarative check.

### "Focus on key examples" (fetched)
https://gojko.net/2014/05/05/focus-on-key-examples/

- Exhaustive example lists hide misunderstandings, give false completeness and cannot be read by humans. Aim for small groups per rule, around 5 to 10, centred on boundaries. A sprawl of near-identical examples signals a missing business concept or the wrong abstraction level. Taken into: Pass D balance check, "too many".
- Boundary conditions give most of the value. Taken into: Pass D boundary check.
- Separate validation from processing. Taken into: Pass A (one rule per scenario) and Pass D.
- The numbers (5 to 10) are the author's rule of thumb, not a standard.

### "Stop automating manual test scripts!" (fetched)
https://gojko.net/2010/07/19/stop-automating-manual-test-scripts/

- Long, interdependent scripts fail for many reasons and are hard to diagnose. Ask what behaviour the script checks and write one small, independent scenario per rule. Taken into: Pass A script check and Pass C independence.

### "Specification by Example" book (search results only, not read)
https://www.infoq.com/articles/specification-by-example-book

- Seven process patterns, among them illustrating with examples, refining the specification, and automating validation without changing the specification. Taken into: the reviewer's view that the scenarios are the specification and the tests only validate it.

## Formulation (Seb Rose and Gaspar Nagy)

### BRIEF principles, via Scott Logic summary (fetched, secondary source)
https://blog.scottlogic.com/2024/07/26/beyond-automation-unveiling-the-true-essence-of-bdd.html

- Business language, Real data, Intention revealing, Essential, Focused (one rule per scenario), Brief. Taken into: Pass B, near one to one.
- Smells: technical terms, test procedures, too many context steps, too many journey scenarios, tables with no behaviour-relevant data or no boundary values. Taken into: Pass B and Pass D.
- The 10-step ceiling comes from this secondary summary, not a confirmed quote from the book. The skill treats it as a heuristic, with 5 steps as the smell threshold following the Cucumber reference.

### The BDD Books, "Formulation" (search results only, not read)
https://leanpub.com/bddbooks-formulation

- Chapters on keeping scenarios brief, documenting the essence of the behaviour, reading like a specification, using real data where it clarifies, and "communication, not testing". The book is withdrawn from sale and folded into Manning's "Effective Behavior Driven Development". Taken into: Pass A. Verify exact wording in the Manning book before quoting.

### "BDD Formulation: Cleaning Up an Old Scenario" (fetch failed, 403)
https://huddle.eurostarsoftwaretesting.com/resources/test-automation/bdd-formulation-cleaning-up-an-old-scenario

- Not read. Listed because it is a worked rewrite of a bad scenario by the same authors.

### "Writing Better BDD Scenarios", ACCU 2022 slides (not readable)
https://accu.org/conf-docs/PDFs_2022/seb_rose_WritingBetterBDDScenarios-ACCU2022.pdf

- The PDF came back as compressed binary and no text tool was available, so nothing was taken from it.

## Discovery and conversation

### Liz Keogh, "Conversational patterns in BDD" (fetched)
https://lizkeogh.com/2011/09/22/conversational-patterns-in-bdd/

- Context questioning and outcome questioning. Taken into: Pass D. Also the view that BDD without conversation is not BDD, which is why open questions go to the user rather than being guessed.

### Cucumber, "BDD" overview (fetched)
https://cucumber.io/docs/bdd/

- Discovery, Formulation and Automation as three practices, with the examples failing until the behaviour exists. Taken into: Pass F, where a skipped test must be able to fail for the missing behaviour.

### Cucumber, "Better Gherkin" (fetched)
https://cucumber.io/docs/bdd/better-gherkin/

- Procedural steps, implementation-bound wording, brittleness and hidden intent as smells. The wording test and the extensibility test (adding a variant should add a scenario, not rewrite existing ones). Taken into: Pass B.

### Cucumber, anti-patterns blog (fetch failed, 404)
https://cucumber.io/blog/cucumber-antipatterns/

- Not read. The search result showed only a podcast summary.

## XP acceptance tests

Searches for Beck and Jeffries guidance on customer tests returned only secondary summaries (not read in full): customers define acceptance tests, the team keeps them passing, and they check that the programmers' understanding matches the customer's need. The extremeprogramming.org page failed on a certificate error. Taken into: the reviewer's insistence that scenarios must be readable and judgeable by the person who owns the requirement (Pass A). Treat the XP link as thin, and read the primary text before citing it.

## Adversarial and mutation thinking

Pass E (invent a plausible wrong implementation and see whether any scenario catches it) is borrowed from mutation testing, not from a BDD source. The repo already has `nw-mutation-test` for code. Pass E applies the same idea to the specification before any code exists. It is this skill's own technique, so no source backs it.
