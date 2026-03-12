# LEARNINGS: GET and DELETE /api/expenses

This file captures gotchas, decisions, and patterns discovered during the
implementation of the GET and DELETE endpoints. It is a running log — entries
are added as they are discovered, not at the end.

## Project Context

- Express 5 (`^5.2.1`) — route params and error handling differ slightly from v4
- Vitest `@vitest-environment node` annotation required at top of server test files
- `supertest` used for HTTP integration tests (no live server port needed)
- In-memory store reassigned via spread (`expenses = [...expenses, ...]`) to maintain
  immutability of the array reference between tests

## Decisions

### DELETE returns 204 No Content

REST convention for a successful delete with no body. 200 with a body would also be
acceptable but adds unnecessary payload for this use case.

### GET returns empty array, not 404, when store is empty

Returning 404 for an empty collection conflates "resource not found" (a specific item)
with "collection exists but is empty". An empty array with 200 is the correct semantic.

### 404 for DELETE on unknown id

Returning 404 signals that the target resource does not exist. An alternative (204
idempotent delete) would also be defensible, but 404 is clearer for client error
handling and matches what the Gherkin spec will describe.

## Gotchas

### `amount as number` still required at the ValidationResult boundary

Even though the `valid: true` branch guarantees `amount` was checked with
`typeof amount === "number"`, TypeScript cannot narrow the outer `body["amount"]`
binding through the discriminated union. The `as number` assertion is confined to
the validator's return value and does not leak into handler code — the handler
only ever sees the already-typed `ValidatedExpenseInput`.

## Patterns

### ValidationResult discriminated union — return parsed data alongside errors

When a validator needs to both reject invalid input and hand off clean, typed data
to its caller, return a discriminated union rather than throwing or returning a
boolean:

```typescript
type ValidationResult =
  | { readonly valid: true; readonly data: ValidatedExpenseInput }
  | { readonly valid: false; readonly errors: ValidationError[] };
```

The handler then narrows with a single `if (!result.valid)` guard and accesses
`result.data` with full type safety — no type assertions at the call site:

```typescript
// ✅ CORRECT — no assertion needed in the handler
if (!result.valid) {
  res.status(422).json({ errors: result.errors });
  return;
}
const expense: Expense = { id: crypto.randomUUID(), ...result.data };
```

```typescript
// ❌ WRONG — requires assertion at call site, couples handler to internal shape
const { valid, errors } = validateCreateExpense(body);
if (!valid) { ... }
const name = body.name as string; // assertion escapes the validator
```

This pattern is the "Parse, don't validate" principle applied at the function
boundary: the validator parses the raw input and returns either a typed value or
structured errors. The caller never touches raw data after the guard.
