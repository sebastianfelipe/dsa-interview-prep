# Interview Strategy (45-minute round)

## Timeline

| Minutes | Do this |
|---------|---------|
| 0–2 | Clarify input/output, constraints, edge cases |
| 2–5 | Brute force aloud → improve → name the pattern |
| 5–8 | Confirm approach + complexity with interviewer |
| 8–35 | Code cleanly; narrate decisions |
| 35–40 | Dry-run on example; fix bugs |
| 40–45 | Discuss optimizations / follow-ups |

## Clarifying questions (always ask)

1. Input size / value ranges?
2. Sorted? Duplicates? Negatives? Empty input?
3. Mutate in place or return new structure?
4. What to return when no answer exists?

## Approach ladder

```text
Brute force  →  Optimize with data structure / pattern  →  Code
```

Never jump straight to the clever solution without stating the naive baseline. Interviewers want to see the **tradeoff reasoning**.

## While coding

- Name variables clearly (`left`, `right`, `freq`, not `i`, `j`, `d`).
- Handle empty / single-element cases early or prove they fall out naturally.
- Prefer readable over micro-optimized.

## After coding

Dry-run one example **out loud**, line by line, updating your variables. Then check:

- Empty input
- Single element
- All duplicates
- Already sorted / reverse sorted
- Maximum constraint size (complexity sanity check)

## If stuck

1. Restate the problem in your own words.
2. Work a tiny example by hand.
3. Ask: "What information am I recomputing?" → memo / hash / prefix.
4. Ask: "Can sorting or a different order help?"
5. Fall back to brute force and optimize one bottleneck.

## Key Extract

Clarify → brute → pattern → confirm complexity → code → dry-run. That sequence is the interview skill.
