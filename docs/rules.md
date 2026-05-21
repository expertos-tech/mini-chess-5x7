# Rules (5x7)

## Board and setup

- Board: 5 files (`a-e`) x 7 ranks (`1-7`).
- White starts at rank 1: `B N K N R` (a1-e1).
- Black starts at rank 7: `r n k n b` (a7-e7).
- Pawns start on rank 2 (White) and rank 6 (Black).

```txt
7   r  n  k  n  b
6   p  p  p  p  p
5   .  .  .  .  .
4   .  .  .  .  .
3   .  .  .  .  .
2   P  P  P  P  P
1   B  N  K  N  R
    a  b  c  d  e
```

## Pieces

- King (`K/k`): one square in any direction.
- Rook (`R/r`): slides orthogonally.
- Bishop (`B/b`): slides diagonally.
- Knight (`N/n`): standard L-shape.
- Pawn (`P/p`):
  - moves one square forward
  - captures diagonally forward
  - no double push
  - no en passant

## Promotion

- A pawn that reaches the last rank promotes to a rook.

## Win and draw

- Checkmate: player to move has no legal moves and is in check.
- Stalemate: player to move has no legal moves and is not in check.
