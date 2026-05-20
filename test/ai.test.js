const test = require('node:test');
const assert = require('node:assert/strict');

const { getAiMove } = require('../src/ai');
const { EMPTY, createBoard } = require('../src/board');
const { getLegalMoves } = require('../src/moves');

function emptyBoard() {
  const board = createBoard();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) board[r][c] = EMPTY;
  return board;
}

test('getAiMove returns null when no legal moves', () => {
  const board = emptyBoard();
  // With no pieces for the side to move, there are no legal moves.
  const move = getAiMove(board, false);
  assert.equal(move, null);
});

test('getAiMove returns a legal move when available', () => {
  const board = emptyBoard();
  board[0][2] = 'k';
  board[1][2] = 'p';
  board[7][2] = 'K';
  const move = getAiMove(board, false, 1);
  assert.ok(move);

  const legal = getLegalMoves(board, false);
  assert.ok(legal.some((m) => JSON.stringify(m) === JSON.stringify(move)));
});

test('AI does not return a move that leaves own king in check', () => {
  const board = emptyBoard();
  board[0][2] = 'k';
  board[0][1] = 'r';
  board[7][2] = 'K';
  board[7][4] = 'R';
  const move = getAiMove(board, false, 2);
  assert.ok(move);

  const legal = getLegalMoves(board, false);
  assert.ok(legal.some((m) => JSON.stringify(m) === JSON.stringify(move)));
});
