const EMPTY = '.';

// Uppercase = white, lowercase = black
// K/k=King, R/r=Rook, B/b=Bishop, N/n=Knight, P/p=Pawn

const INITIAL_BOARD = [
  ['n', 'r', 'k', 'r', 'b'], // row 0 = rank 8 (black back rank)
  ['p', 'p', 'p', 'p', 'p'], // row 1 = rank 7
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P'], // row 6 = rank 2
  ['B', 'R', 'K', 'R', 'N'], // row 7 = rank 1 (white back rank)
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
  const from = `${cols[move.fromCol]}${8 - move.fromRow}`;
  const to = `${cols[move.toCol]}${8 - move.toRow}`;
  return `${from}${to}${move.promotion || ''}`;
}

module.exports = { EMPTY, createBoard, cloneBoard, isWhite, isBlack, applyMove, moveToStr };
