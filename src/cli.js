const readline = require('readline');
const { ROWS, COLS, createBoard, applyMove } = require('./board');
const { getLegalMoves, isInCheck } = require('./moves');
const { getAiMove } = require('./ai');
const { getStatus } = require('./game');
const { printBoard } = require('./display');

function parseMovePerspective(str, playerIsWhite) {
  if (!str || str.length < 4) return null;
  const colMap = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  const fromFile = colMap[str[0]];
  const fromRank = parseInt(str[1], 10);
  const toFile = colMap[str[2]];
  const toRank = parseInt(str[3], 10);

  if (fromFile === undefined || toFile === undefined) return null;
  if (Number.isNaN(fromRank) || Number.isNaN(toRank)) return null;
  if (fromRank < 1 || fromRank > ROWS || toRank < 1 || toRank > ROWS) return null;

  if (playerIsWhite) {
    return { fromRow: ROWS - fromRank, fromCol: fromFile, toRow: ROWS - toRank, toCol: toFile };
  }
  return {
    fromRow: fromRank - 1,
    fromCol: COLS - 1 - fromFile,
    toRow: toRank - 1,
    toCol: COLS - 1 - toFile,
  };
}

function moveToStrPerspective(move, playerIsWhite) {
  const cols = 'abcde';
  if (playerIsWhite) {
    const from = `${cols[move.fromCol]}${ROWS - move.fromRow}`;
    const to = `${cols[move.toCol]}${ROWS - move.toRow}`;
    return `${from}${to}${move.promotion || ''}`;
  }
  const from = `${cols[COLS - 1 - move.fromCol]}${move.fromRow + 1}`;
  const to = `${cols[COLS - 1 - move.toCol]}${move.toRow + 1}`;
  return `${from}${to}${move.promotion || ''}`;
}

async function main() {
  if (process.argv.includes('--browser')) {
    const portIdx = process.argv.indexOf('--port');
    const portArg = portIdx !== -1 ? process.argv[portIdx + 1] : null;
    const port = portArg ? Number(portArg) : undefined;
    require('./server').start({ port });
    return;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

  console.log('=== Simple Chess 5x7 ===');
  const sideAnswer = (await ask('Play as (w) White or (b) Black? [w]: ')).trim().toLowerCase();
  const playerIsWhite = sideAnswer !== 'b' && sideAnswer !== 'black';
  console.log(`You play ${playerIsWhite ? 'White' : 'Black'}. Enter moves like: a2a3, e1e2`);
  console.log('Type "quit" to exit.');

  let board = createBoard();
  let whiteTurn = true;
  let lastMove = null;

  while (true) {
    process.stdout.write('\x1b[2J\x1b[H');
    printBoard(board, lastMove, { flip: !playerIsWhite });

    const status = getStatus(board, whiteTurn);
    if (status !== 'ongoing') {
      if (status === 'white_wins') console.log('Checkmate! White wins.');
      else if (status === 'black_wins') console.log('Checkmate! Black wins.');
      else console.log('Stalemate! Draw.');
      break;
    }

    const playerToMove = playerIsWhite ? whiteTurn : !whiteTurn;

    if (playerToMove) {
      if (isInCheck(board, whiteTurn)) console.log('  \x1b[1;91mCheck!\x1b[0m');

      const input = (await ask('  Your move: ')).trim().toLowerCase();

      if (input === 'quit' || input === 'q') {
        console.log('Bye!');
        break;
      }

      const parsed = parseMovePerspective(input, playerIsWhite);
      if (!parsed) {
        console.log('  Invalid format. Example: a2a3');
        continue;
      }

      const legal = getLegalMoves(board, whiteTurn);
      const match = legal.find(
        (m) =>
          m.fromRow === parsed.fromRow &&
          m.fromCol === parsed.fromCol &&
          m.toRow === parsed.toRow &&
          m.toCol === parsed.toCol
      );

      if (!match) {
        console.log('  Illegal move.');
        continue;
      }

      lastMove = match;
      applyMove(board, match);
      whiteTurn = !whiteTurn;
    } else {
      if (isInCheck(board, whiteTurn))
        console.log(`  ${whiteTurn ? 'White' : 'Black'} is in check!`);
      process.stdout.write('  AI thinking...');

      const aiMove = getAiMove(board, whiteTurn);
      if (!aiMove) break;

      applyMove(board, aiMove);
      console.log(` \x1b[1;36mAI plays: ${moveToStrPerspective(aiMove, playerIsWhite)}\x1b[0m`);
      lastMove = aiMove;
      whiteTurn = !whiteTurn;
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
