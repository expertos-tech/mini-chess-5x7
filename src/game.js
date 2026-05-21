const { getLegalMoves, isInCheck } = require('./moves');
const { ROWS } = require('./constants');

function parseMove(str) {
  if (!str || str.length < 4) return null;
  const colMap = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  const fromCol = colMap[str[0]];
  const fromRank = parseInt(str[1]);
  const toCol = colMap[str[2]];
  const toRank = parseInt(str[3]);

  if (fromCol === undefined || toCol === undefined) return null;
  if (isNaN(fromRank) || isNaN(toRank)) return null;
  if (fromRank < 1 || fromRank > ROWS || toRank < 1 || toRank > ROWS) return null;

  return { fromRow: ROWS - fromRank, fromCol, toRow: ROWS - toRank, toCol };
}

// Returns 'ongoing' | 'white_wins' | 'black_wins' | 'stalemate'
function getStatus(board, whiteTurn) {
  const moves = getLegalMoves(board, whiteTurn);
  if (moves.length > 0) return 'ongoing';
  return isInCheck(board, whiteTurn) ? (whiteTurn ? 'black_wins' : 'white_wins') : 'stalemate';
}

module.exports = { parseMove, getStatus };
