const { cloneBoard, applyMove, isWhite, EMPTY } = require('./board');
const { ROWS, COLS } = require('./constants');
const { getLegalMoves, isInCheck } = require('./moves');
const { AI_PIECE_VALUES } = require('./pieces');

function evaluate(board) {
  let score = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r][c];
      if (p === EMPTY) continue;
      const v = AI_PIECE_VALUES[p.toLowerCase()] || 0;
      score += isWhite(p) ? v : -v;
    }
  }
  score += getLegalMoves(board, true).length;
  score -= getLegalMoves(board, false).length;
  return score;
}

function minimax(board, depth, alpha, beta, whiteTurn) {
  const moves = getLegalMoves(board, whiteTurn);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      if (isInCheck(board, whiteTurn)) return whiteTurn ? -9000 : 9000;
      return 0;
    }
    return evaluate(board);
  }

  if (whiteTurn) {
    let best = -Infinity;
    for (const move of moves) {
      const copy = cloneBoard(board);
      applyMove(copy, move);
      const score = minimax(copy, depth - 1, alpha, beta, false);
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const copy = cloneBoard(board);
      applyMove(copy, move);
      const score = minimax(copy, depth - 1, alpha, beta, true);
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getAiMove(board, whiteTurn, depth = 3) {
  const moves = getLegalMoves(board, whiteTurn);
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestScore = whiteTurn ? -Infinity : Infinity;

  for (const move of moves) {
    const copy = cloneBoard(board);
    applyMove(copy, move);
    const score = minimax(copy, depth - 1, -Infinity, Infinity, !whiteTurn);
    if (whiteTurn ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

module.exports = { getAiMove };
