# Architecture

## Modules

- `src/board.js`: board representation and basic helpers (create/clone/apply move).
- `src/moves.js`: legal move generation and check detection.
- `src/game.js`: move parsing and game status (ongoing/checkmate/stalemate).
- `src/ai.js`: minimax with alpha-beta pruning.
- `src/cli.js`: terminal UI loop and command parsing.
- `src/server.js`: HTTP server and WebSocket protocol for browser UI.
- `public/index.html`: browser UI (Vue via CDN).

## Data model

- Board is a 7x5 matrix of single-character strings.
- `ROWS = 7`
- `COLS = 5`
- `.` is empty.
- Uppercase pieces are White, lowercase pieces are Black.
- Coordinates use files `a-e` and ranks `1-7`.

## Browser flow

- `src/server.js` serves `public/index.html`.
- Browser connects via WebSocket.
- Server sends a `state` message after connect and after each move.

## CLI flow

- `src/cli.js` loops on user input in `a2a3` notation.
- After a legal White move, AI replies for Black.
