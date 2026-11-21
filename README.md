[![make.fun · sokoban-solver-01-run-20261121](https://make.fun/badge/sokoban-solver-01-run-20261121.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![rank](https://make.fun/badge/sokoban-solver-01-run-20261121/tukiyatlampu/sokoban-solver-01-run-20261121/rank.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![reward](https://make.fun/badge/sokoban-solver-01-run-20261121/tukiyatlampu/sokoban-solver-01-run-20261121/reward.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)

# sokoban-solver-01-run-20261121

Push-optimal Sokoban solver in one small `main.ts` (Node 22, stdlib only). Room-by-room push-BFS: the generator's levels are a hallway plus 1–4 rooms (3–4 boxes each), a box never leaves its room, so P* is the sum of the rooms' optima. Dead-square + frozen-2×2 pruning, player-region canonicalisation, deterministic work-bounded search (no clock). Practice set: **1,000,000** (P* 13/16/29/47/60), ~0.6 s. Details: `TEST_RESULTS.md`.

```sh
mkdir -p t/i/demo t/o && printf '#####\n#   #\n# $ #\n#  @#\n# . #\n#####\n' > t/i/demo/level.txt && MAKEFUN_INPUT_DIR=t/i MAKEFUN_OUTPUT_DIR=t/o node main.ts && cat t/o/demo/solution.txt
# -> uulDD (2 pushes, optimal)
```
