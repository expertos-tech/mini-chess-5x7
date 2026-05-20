const test = require('node:test');
const assert = require('node:assert/strict');

const { createBoard, cloneBoard, applyMove, moveToStr, EMPTY } = require('../src/board');

test('createBoard returns 8x5 initial board', () => {
  const board = createBoard();
  assert.equal(board.length, 8);
  for (const row of board) assert.equal(row.length, 5);

  assert.deepEqual(board[0], ['n', 'r', 'k', 'r', 'b']);
  assert.deepEqual(board[1], ['p', 'p', 'p', 'p', 'p']);
  assert.deepEqual(board[6], ['P', 'P', 'P', 'P', 'P']);
  assert.deepEqual(board[7], ['B', 'R', 'K', 'R', 'N']);
});

test('cloneBoard does not share row references', () => {
  const board = createBoard();
  const cloned = cloneBoard(board);
  assert.notEqual(cloned, board);
  for (let i = 0; i < board.length; i++) assert.notEqual(cloned[i], board[i]);
});

test('applyMove moves piece and clears source', () => {
  const board = createBoard();
  applyMove(board, { fromRow: 6, fromCol: 0, toRow: 5, toCol: 0 });
  assert.equal(board[6][0], EMPTY);
  assert.equal(board[5][0], 'P');
});

test('moveToStr converts coordinates correctly', () => {
  assert.equal(moveToStr({ fromRow: 6, fromCol: 0, toRow: 5, toCol: 0 }), 'a2a3');
  assert.equal(moveToStr({ fromRow: 7, fromCol: 4, toRow: 5, toCol: 3 }), 'e1d3');
});
