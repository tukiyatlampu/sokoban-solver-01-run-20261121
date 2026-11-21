# TEST_RESULTS.md — sokoban-solver-01-run-20261121

## Scores (kit scorer, `program/scorer/score.ts`)
- Practice set: **1,000,000**, passed 5/5 (i001–i005 at P*: 13/16/29/47/60 pushes), ~0.54–0.62 s/set.
- 3 freshly drawn sets (kit `draw.ts`, random seeds): **1,000,000** each (P* 12–67), 0.43–0.51 s/set.
- Baseline plain-astar on practice: 200,000 (only i001 solved).
- `grade-local --driver process`: score 1,000,000, two executions byte-identical (L1 regrade reproduced).

## Determinism, edges
- Two full practice runs byte-identical. Per-instance 165–368 ms (incl. Node startup).
- Unsolvable / box≠goal / already-solved / CRLF input: empty valid solution, exit 0. Missing-player input: empty, exit 0 (was a hang pre-fix, fixed with a 4-byte guard).
- Open 4-box room (whole-level fallback): solved in 6 pushes, checker-valid. Judge's 16-box counterexample (opposite doors, same column): fallback exhausts 250k cap in ~1.1 s, empty solution — but the generator forbids it (`generate.mjs`: a room below never shares the door column of the room above), so it is out-of-family.
- Worst-case work bound (ESTIMATE, not a proven bound): 5 instances × (4 rooms + 1 fallback) × 250k states ≈ 6.25M states ≈ ~28 s at the measured 4.4 µs/state on one saturated fallback board. Measured worst observed: 1.1 s for a saturated 16-box fallback; all generated sets (practice + 3 fresh, incl. 4-room/16-box i005) run in 0.43–0.62 s — far inside the 60 s wall.

## Judge (gpt-6.1-sol, harshest)
- Round 1: **88/100**. Fixes applied: missing-player guard (+4 B), README trimmed 2,328→1,336 B. Fallback incompleteness accepted: proven impossible under the generator's door-column invariant.
- Round 2: **94/100**, verdict "submit as-is". Remaining notes: runtime 28 s is an estimate (wording corrected above); TEST_RESULTS.md kept per task requirement; no demonstrated bug left.
- Round 3: **95/100**, verdict "submit as-is". Target reached (≥95); no new weakness, no solver-byte change justified.
- Zero-fail QA (clean room): PASS — README quick test exits 0 (`uulDD`), full practice run from the clean dir byte-identical to the build machine, no secrets/hardcoded paths (only the public GitHub username in badge URLs).

## Entry size (grader count: bytes + path, starter-identical files 0)
- main.ts 4,673 + 7; README.md 1,470 + 9; TEST_RESULTS.md (this file) + 15; .makefun/owner.json 58 + 19; LICENSE 0 (byte-identical to kit starter). Final grade-local: **8,755 counted bytes**.
