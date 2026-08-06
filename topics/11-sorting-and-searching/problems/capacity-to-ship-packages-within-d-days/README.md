# Capacity To Ship Packages Within D Days

## Problem

Packages in order; ship with capacity. Min capacity to finish in `days` days.

## Recognition

Binary search on answer + greedy feasible check.

## Key Extract

`lo = max package`, `hi = sum`. Feasible = simulate days needed. Same pattern as Split Array Largest Sum / Koko.
