const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ROWS,
  COLS,
  createBoard,
  cloneBoard,
  applyMove,
  moveToStr,
  EMPTY,
} = require('../src/board');

test('createBoard returns 7x5 initial board', () => {
  const board = createBoard();
  assert.equal(board.length, ROWS);
  for (const row of board) assert.equal(row.length, COLS);

  assert.deepEqual(board[0], ['r', 'n', 'k', 'n', 'b']);
  assert.deepEqual(board[1], ['p', 'p', 'p', 'p', 'p']);
  assert.deepEqual(board[5], ['P', 'P', 'P', 'P', 'P']);
  assert.deepEqual(board[6], ['B', 'N', 'K', 'N', 'R']);
});

test('board has correct piece counts', () => {
  const board = createBoard();
  const counts = {};
  for (const row of board) {
    for (const piece of row) {
      if (piece !== EMPTY) {
        counts[piece] = (counts[piece] || 0) + 1;
      }
    }
  }

  assert.equal(counts['K'], 1);
  assert.equal(counts['k'], 1);
  assert.equal(counts['R'], 1);
  assert.equal(counts['r'], 1);
  assert.equal(counts['N'], 2);
  assert.equal(counts['n'], 2);
  assert.equal(counts['B'], 1);
  assert.equal(counts['b'], 1);
  assert.equal(counts['P'], 5);
  assert.equal(counts['p'], 5);
});

test('cloneBoard does not share row references', () => {
  const board = createBoard();
  const cloned = cloneBoard(board);
  assert.notEqual(cloned, board);
  for (let i = 0; i < board.length; i++) assert.notEqual(cloned[i], board[i]);
});

test('applyMove moves piece and clears source', () => {
  const board = createBoard();
  applyMove(board, { fromRow: 5, fromCol: 0, toRow: 4, toCol: 0 });
  assert.equal(board[5][0], EMPTY);
  assert.equal(board[4][0], 'P');
});

test('moveToStr converts coordinates correctly', () => {
  assert.equal(moveToStr({ fromRow: 5, fromCol: 0, toRow: 4, toCol: 0 }), 'a2a3');
  assert.equal(moveToStr({ fromRow: 6, fromCol: 4, toRow: 4, toCol: 3 }), 'e1d3');
});
