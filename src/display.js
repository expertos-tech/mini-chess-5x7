const { ROWS, COLS } = require('./constants');

// Unicode block sprites: exactly 9 chars wide x 3 rows tall
const SPRITES = {
  K: ['    ╬    ', '   ███   ', '  █████  '],
  R: ['  █ █ █  ', '  █████  ', '  █████  '],
  B: ['    █    ', '   █▀█   ', '  █████  '],
  N: ['   ██▄   ', '  ███▀   ', '   ▀██   '],
  P: ['   ▄█▄   ', '    █    ', '  █████  '],
};

const C = {
  bgLight: '\x1b[48;5;136m', // amber/gold - strong contrast
  bgDark: '\x1b[48;5;58m', // deep olive brown
  bgHilite: '\x1b[48;5;22m', // dark green - last move highlight
  fgWhite: '\x1b[1;97m', // bright white - white pieces
  fgBlack: '\x1b[36m', // cyan - black pieces (do not reset background)
  reset: '\x1b[0m',
};

const W = 9;
const H = '─'.repeat(W);
const TOP = `   ┌${H}┬${H}┬${H}┬${H}┬${H}┐`;
const SEP = `   ├${H}┼${H}┼${H}┼${H}┼${H}┤`;
const BOT = `   └${H}┴${H}┴${H}┴${H}┴${H}┘`;
const BORDERS = '\x1b[0;37m';

function isHL(row, col, last) {
  if (!last) return false;
  return (
    (row === last.fromRow && col === last.fromCol) || (row === last.toRow && col === last.toCol)
  );
}

const LEGEND = [' K = Rei   ', ' R = Torre ', ' B = Bispo ', ' N = Cavalo', ' P = Peão  '];
const LEGEND_START = 3; // attach starting at rank 7 middle line

function printBoard(board, lastMove = null, opts = {}) {
  const { flip = false } = opts;
  const lines = [];
  const emit = (s) => lines.push(s);

  const fileHeader = '        a         b         c         d         e';
  emit(fileHeader);
  emit(`${BORDERS}${TOP}${C.reset}`);

  const rowIndices = flip ? [...Array(ROWS).keys()].reverse() : [...Array(ROWS).keys()];
  for (const row of rowIndices) {
    const rank = flip ? row + 1 : ROWS - row;
    for (let li = 0; li < 3; li++) {
      const prefix = li === 1 ? ` ${rank} │` : `   │`;
      let line = prefix;
      const colIndices = flip ? [...Array(COLS).keys()].reverse() : [...Array(COLS).keys()];
      for (const col of colIndices) {
        const piece = board[row][col];
        const hl = isHL(row, col, lastMove);
        const bg = hl ? C.bgHilite : (row + col) % 2 === 0 ? C.bgLight : C.bgDark;
        if (piece !== '.') {
          const art = (SPRITES[piece.toUpperCase()] || ['         ', '         ', '         '])[li];
          const fg = piece === piece.toUpperCase() ? C.fgWhite : C.fgBlack;
          line += `${bg}${fg}${art}${C.reset}│`;
        } else {
          line += `${bg}${' '.repeat(W)}${C.reset}│`;
        }
      }
      emit(line);
    }
    const isLast = flip ? row === 0 : row === ROWS - 1;
    emit(`${BORDERS}${!isLast ? SEP : BOT}${C.reset}`);
  }

  console.log('');
  lines.forEach((line, i) => {
    const li = i - LEGEND_START;
    const leg = li >= 0 && li < LEGEND.length ? `  \x1b[0;37m${LEGEND[li]}\x1b[0m` : '';
    console.log(line + leg);
  });

  if (lastMove) {
    const cols = 'abcde';
    const fromFile = flip ? cols[COLS - 1 - lastMove.fromCol] : cols[lastMove.fromCol];
    const fromRank = flip ? lastMove.fromRow + 1 : ROWS - lastMove.fromRow;
    const toFile = flip ? cols[COLS - 1 - lastMove.toCol] : cols[lastMove.toCol];
    const toRank = flip ? lastMove.toRow + 1 : ROWS - lastMove.toRow;
    const from = `${fromFile}${fromRank}`;
    const to = `${toFile}${toRank}`;
    console.log(`\n  \x1b[0;37mÚltimo movimento:\x1b[0m \x1b[1;37m${from} -> ${to}\x1b[0m`);
  }
  console.log('');
}

module.exports = { printBoard };
