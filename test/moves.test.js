const test = require('node:test');
const assert = require('node:assert/strict');

const { getLegalMoves, isInCheck } = require('../src/moves');
const { ROWS, COLS, createBoard, EMPTY } = require('../src/board');

function emptyBoard() {
  const board = createBoard();
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) board[r][c] = EMPTY;
  board[6][2] = 'K';
  board[0][2] = 'k';
  return board;
}

test('white pawns move up (toward row 0) and only one square', () => {
  const board = createBoard();
  const moves = getLegalMoves(board, true);
  assert.ok(
    moves.some((m) => m.fromRow === 5 && m.fromCol === 0 && m.toRow === 4 && m.toCol === 0)
  );
  assert.ok(
    !moves.some((m) => m.fromRow === 5 && m.fromCol === 0 && m.toRow === 3 && m.toCol === 0)
  );
});

test('pawn captures diagonally', () => {
  const board = emptyBoard();
  board[5][1] = 'P';
  board[4][0] = 'p';
  const moves = getLegalMoves(board, true);
  assert.ok(
    moves.some((m) => m.fromRow === 5 && m.fromCol === 1 && m.toRow === 4 && m.toCol === 0)
  );
});

test('rook slides and is blocked by pieces', () => {
  const board = emptyBoard();
  board[6][2] = EMPTY;
  board[6][4] = 'K';
  board[6][0] = 'R';
  board[6][1] = 'P';
  const moves = getLegalMoves(board, true);
  assert.ok(!moves.some((m) => m.toRow === 6 && m.toCol === 1));
  assert.ok(!moves.some((m) => m.toRow === 6 && m.toCol === 2));
});

test('bishop slides diagonally', () => {
  const board = emptyBoard();
  board[6][0] = 'B';
  const moves = getLegalMoves(board, true);
  assert.ok(moves.some((m) => m.toRow === 5 && m.toCol === 1));
  assert.ok(moves.some((m) => m.toRow === 4 && m.toCol === 2));
});

test('knight moves in L shape', () => {
  const board = emptyBoard();
  board[6][4] = 'N';
  const moves = getLegalMoves(board, true);
  assert.ok(moves.some((m) => m.toRow === 4 && m.toCol === 3));
  assert.ok(moves.some((m) => m.toRow === 5 && m.toCol === 2));
});

test('king moves one square', () => {
  const board = emptyBoard();
  board[6][2] = 'K';
  const moves = getLegalMoves(board, true);
  assert.ok(moves.some((m) => m.toRow === 5 && m.toCol === 2));
  assert.ok(!moves.some((m) => m.toRow === 4 && m.toCol === 2));
});

test('isInCheck detects simple rook check', () => {
  const board = emptyBoard();
  board[6][2] = 'K';
  board[6][4] = 'r';
  assert.equal(isInCheck(board, true), true);
});

test('legal moves cannot leave own king in check', () => {
  const board = emptyBoard();
  board[6][2] = 'K';
  board[6][1] = 'R';
  board[6][4] = 'r';
  const moves = getLegalMoves(board, true);
  assert.ok(!moves.some((m) => m.fromRow === 6 && m.fromCol === 1 && m.toRow === 5));
});

test('pawn promotes upon reaching last rank', () => {
  const board = emptyBoard();
  board[1][0] = 'P';
  const moves = getLegalMoves(board, true);
  const promoMove = moves.find((m) => m.toRow === 0);
  assert.equal(promoMove.promotion, 'R');

  board[5][0] = 'p';
  const blackMoves = getLegalMoves(board, false);
  const blackPromo = blackMoves.find((m) => m.toRow === 6);
  assert.equal(blackPromo.promotion, 'r');
});
