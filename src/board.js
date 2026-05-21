const EMPTY = '.';
const { ROWS, COLS } = require('./constants');

// Uppercase = white, lowercase = black
// K/k=King, R/r=Rook, B/b=Bishop, N/n=Knight, P/p=Pawn

const INITIAL_BOARD = [
  ['r', 'n', 'k', 'n', 'b'], // row 0 = rank 7 (black back rank)
  ['p', 'p', 'p', 'p', 'p'], // row 1 = rank 6
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P'], // row 5 = rank 2
  ['B', 'N', 'K', 'N', 'R'], // row 6 = rank 1 (white back rank)
];

function createBoard() {
  return INITIAL_BOARD.map((row) => [...row]);
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function isWhite(piece) {
  return piece !== EMPTY && piece === piece.toUpperCase();
}

function isBlack(piece) {
  return piece !== EMPTY && piece === piece.toLowerCase();
}

function applyMove(board, move) {
  const { fromRow, fromCol, toRow, toCol, promotion } = move;
  const piece = board[fromRow][fromCol];

  board[toRow][toCol] = promotion || piece;
  board[fromRow][fromCol] = EMPTY;
}

function moveToStr(move) {
  const cols = 'abcde';
  const from = `${cols[move.fromCol]}${ROWS - move.fromRow}`;
  const to = `${cols[move.toCol]}${ROWS - move.toRow}`;
  return `${from}${to}${move.promotion || ''}`;
}

module.exports = {
  EMPTY,
  ROWS,
  COLS,
  createBoard,
  cloneBoard,
  isWhite,
  isBlack,
  applyMove,
  moveToStr,
};
