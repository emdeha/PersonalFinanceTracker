# Sources and rationale

Material behind the `review-implementation` skill. Each entry says what was taken and which pass uses it. Pages marked "fetched" were read directly while building the skill. Pages marked "search only" were seen only in search results, so check them before quoting them. Items marked "from memory" were not looked up in this session.

## XP: review without a review meeting

### C2 wiki, "Extreme Reviews" (search only)
https://c2.com/xp/ExtremeReviews.html

- XP has no formal review stage. Pair programming, collective code ownership and impromptu informal reviews do the job, with the tests running as the machine reviewer. A community wiki, not an authoritative statement from Beck or Jeffries. Taken into: the intro and Stance (review as a navigator would, small and concrete, about the next move).

### Kent Beck, "Extreme Programming Explained" (from memory, not read)
- Pairing as continuous review, collective ownership, and refactoring as the routine third step of the cycle. Taken into: the intro.

### Cockburn and Williams, pair programming cost study (search only, via Kent State lecture)
https://www.cs.kent.edu/~jmaletic/cs63901/lectures/eXtremeProgramming.pdf

- About 15% more development cost and about 15% fewer defects. Secondary source, so not quoted in the skill. Background only.

## Simple design

### Martin Fowler, "Beck Design Rules" (fetched)
https://www.martinfowler.com/bliki/BeckDesignRules.html

- Four rules in priority order: passes the tests, reveals intention, no duplication, fewest elements. The middle two refine each other. Duplication added for clarity usually signals an unsolved problem. In rare conflicts "empathy wins". Taken into: Stance (the order of values), Pass B (reveals intention, duplication), Pass E (fewest elements).

### J. B. Rainsberger, "The Four Elements of Simple Design" (search only)
https://legacy-blog.jbrains.ca/permalink/the-four-elements-of-simple-design

- The rules read as a loop: duplication and unclear names are the engines that drive a design toward good structure. Not read. Taken into: the idea in Pass B that the smell comes first and the structure is derived from it.

### Jeff Langr, "Four Better Rules for Software Design" (search only)
https://naildrivin5.com/blog/2019/07/25/four-better-rules-for-software-design.html

- A critique: "no abstractions the program does not directly need" and the fewest concepts. Taken into: Pass E.

## Tests

### Kent Beck, "Test Desiderata" (fetched)
https://testdesiderata.com/

- The twelve properties: isolated, composable, deterministic, fast, writable, readable, behavioral, structure-insensitive, automated, specific, predictive, inspiring. Beck stresses that they trade off, and no test has all of them. Taken into: Pass A. Behavioral and structure-insensitive are the two that decide whether a test blocks refactoring. The "tests were not weakened" check is this project's own addition.

### Freeman and Pryce, "Growing Object-Oriented Software, Guided by Tests" (from memory, not read)
- Tests through the outermost public door, and test code that reads as a specification. Do not mock types you do not own. Taken into: Pass A.

## Refactoring and abstraction

### Sandi Metz, "The Wrong Abstraction" (fetched)
https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction

- An abstraction forms from duplication, a later requirement almost fits, a parameter and a conditional are added, and the cycle repeats. The remedy is to inline back into every caller, delete the unneeded branches, and re-extract. "The fastest way forward is back." Taken into: Pass B (do not flag look-alike duplication) and Pass E (wrong abstraction).

### Rule of three (search only)
https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)

- Credited to Fowler's *Refactoring*. Two copies may not justify the abstraction, three do. A counter-view in the results says duplication costs more than the slogan suggests, and the real fault is conditional-heavy code. Taken into: Pass B and Pass E. The limit of three is a heuristic.

### Martin Fowler, "Yagni" (fetched)
https://martinfowler.com/bliki/Yagni.html

- Presumptive features carry four costs: build, delay, carry, repair. Yagni does not mean skipping refactoring, self-testing or code health: "Yagni requires (and enables) malleable code". Taken into: Pass E, and the line that under-engineering is a finding too.

### Martin Fowler, "Refactoring" and Kerievsky, "Refactoring to Patterns" (from memory, not read)
- The catalog of smells and named moves (Extract Function, Move Function, Replace Primitive with Object), and patterns introduced by refactoring toward them, not up front. Taken into: Pass B and Pass E.

## Architecture and domain design

### Alistair Cockburn, "Hexagonal architecture" (fetched)
https://alistair.cockburn.us/hexagonal-architecture/

- The application is driven by users, programs or tests and is built without depending on devices or databases. Ports are the application's purposeful conversations, adapters translate between a port and a technology. Primary ports drive, secondary ports are driven. One port can have several adapters, such as a real and an in-memory database. The core can be regression-tested without UI or a live database. Taken into: Pass D (where things live, ports only when a driven dependency exists).

### Martin Fowler, "Anemic Domain Model" (fetched)
https://martinfowler.com/bliki/AnemicDomainModel.html

- Domain objects that hold data while services hold the logic are procedural design with the cost of a model and none of the benefit. The service layer should stay thin. Taken into: Pass D. The cure in functional TypeScript (pure functions next to the type, not classes) is this project's adaptation, from the user's functional-light guidelines.

### Eric Evans, "Domain-Driven Design" and Vaughn Vernon, "Implementing Domain-Driven Design" (from memory, not read; no source on these was returned by search)
- Ubiquitous language, value objects, aggregates that protect invariants, repositories, bounded contexts. Taken into: Pass C and Pass D. The rule that an aggregate must name an invariant that crosses objects, and that none is added before a scenario needs it, is this skill's way of keeping DDD in proportion. It is not a claim from either book.

### Rich Hickey, "Simple Made Easy" (from memory, not read)
- Simple means few interleaved concerns, not few files or familiar tools. Taken into: Pass E (under-engineering, and "simple means few concepts").

## Decisions in this skill that are not from a source

- The proportion test (name the current scenario that needs each layer, port or type) resolves the pull between Pass D and Pass E. It is this skill's own device.
- The blocking list and the "smallest next move" requirement come from this project's conventions and the user's guidelines.
- Examples and thresholds (nesting depth two, rule of three) are heuristics, not standards.
