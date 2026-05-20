const { EMPTY, isWhite, isBlack, cloneBoard, applyMove } = require('./board');

const ROWS = 8;
const COLS = 5;

function inBounds(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function isOwn(board, row, col, whiteTurn) {
  const p = board[row][col];
  return whiteTurn ? isWhite(p) : isBlack(p);
}

function isEnemy(board, row, col, whiteTurn) {
  const p = board[row][col];
  return whiteTurn ? isBlack(p) : isWhite(p);
}

function addPawnMoves(board, row, col, whiteTurn, moves) {
  const dir = whiteTurn ? -1 : 1;
  const promRow = whiteTurn ? 0 : 7;
  const promos = whiteTurn ? ['R'] : ['r'];
  const nr = row + dir;

  if (!inBounds(nr, col)) return;

  // One step forward
  if (board[nr][col] === EMPTY) {
    if (nr === promRow) {
      promos.forEach((p) =>
        moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: col, promotion: p })
      );
    } else {
      moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: col });
    }
  }

  // Diagonal captures
  for (const dc of [-1, 1]) {
    const nc = col + dc;
    if (!inBounds(nr, nc)) continue;
    if (isEnemy(board, nr, nc, whiteTurn)) {
      if (nr === promRow) {
        promos.forEach((p) =>
          moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc, promotion: p })
        );
      } else {
        moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
      }
    }
  }
}

function addSliding(board, row, col, whiteTurn, moves, dirs) {
  for (const [dr, dc] of dirs) {
    let nr = row + dr;
    let nc = col + dc;
    while (inBounds(nr, nc)) {
      if (board[nr][nc] === EMPTY) {
        moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
      } else if (isEnemy(board, nr, nc, whiteTurn)) {
        moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
        break;
      } else {
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
}

function addKnightMoves(board, row, col, whiteTurn, moves) {
  for (const [dr, dc] of [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]) {
    const nr = row + dr;
    const nc = col + dc;
    if (inBounds(nr, nc) && !isOwn(board, nr, nc, whiteTurn)) {
      moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
    }
  }
}

function addKingMoves(board, row, col, whiteTurn, moves) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (inBounds(nr, nc) && !isOwn(board, nr, nc, whiteTurn)) {
        moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
      }
    }
  }
}

function pseudoMoves(board, whiteTurn) {
  const moves = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const piece = board[row][col];
      if (piece === EMPTY) continue;
      if (whiteTurn && isBlack(piece)) continue;
      if (!whiteTurn && isWhite(piece)) continue;

      const t = piece.toLowerCase();
      if (t === 'p') addPawnMoves(board, row, col, whiteTurn, moves);
      else if (t === 'r')
        addSliding(board, row, col, whiteTurn, moves, [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]);
      else if (t === 'b')
        addSliding(board, row, col, whiteTurn, moves, [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]);
      else if (t === 'n') addKnightMoves(board, row, col, whiteTurn, moves);
      else if (t === 'k') addKingMoves(board, row, col, whiteTurn, moves);
    }
  }
  return moves;
}

function isInCheck(board, whiteTurn) {
  const king = whiteTurn ? 'K' : 'k';
  let kr = -1,
    kc = -1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === king) {
        kr = r;
        kc = c;
      }
    }
  }
  if (kr === -1) return true;
  return pseudoMoves(board, !whiteTurn).some((m) => m.toRow === kr && m.toCol === kc);
}

function getLegalMoves(board, whiteTurn) {
  return pseudoMoves(board, whiteTurn).filter((move) => {
    const copy = cloneBoard(board);
    applyMove(copy, move);
    return !isInCheck(copy, whiteTurn);
  });
}

module.exports = { getLegalMoves, isInCheck };
