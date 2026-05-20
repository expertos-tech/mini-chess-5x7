#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const { createBoard } = require('../src/board');

function parseArgs(argv) {
  const args = {
    flip: false,
    out: path.join(__dirname, '..', 'docs', 'board-web.html'),
    title: 'Simple Chess 5x8 Board',
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--flip') args.flip = true;
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error(`Unknown arg: ${a}`);
  }

  return args;
}

function usage() {
  return [
    'Usage: node scripts/build-docs-board.js [--flip] [--out <file>] [--title <title>]',
    '',
    'Generates a standalone HTML file that renders the initial 5x8 board.',
    '',
    'Options:',
    '  --flip           Render from Black perspective (Black at bottom)',
    '  --out <file>     Output HTML path (default: docs/board-web.html)',
    '  --title <title>  HTML title (default: "Simple Chess 5x8 Board")',
  ].join('\n');
}

function pieceImgUrl(piece) {
  const color = piece === piece.toUpperCase() ? 'w' : 'b';
  return `https://lichess1.org/assets/piece/cburnett/${color}${piece.toUpperCase()}.svg`;
}

function buildHtml({ board, flip, title }) {
  const files = ['a', 'b', 'c', 'd', 'e'];
  const fileLabels = flip ? [...files].reverse() : files;
  const rankLabels = flip ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];

  const rows = [];
  for (let displayRow = 0; displayRow < 8; displayRow++) {
    const internalRow = flip ? 7 - displayRow : displayRow;
    for (let displayCol = 0; displayCol < 5; displayCol++) {
      const internalCol = flip ? 4 - displayCol : displayCol;
      const piece = board[internalRow][internalCol];
      const isLight = (internalRow + internalCol) % 2 === 0;
      rows.push({ piece, isLight });
    }
  }

  const squares = rows
    .map(({ piece, isLight }) => {
      const cls = isLight ? 'light' : 'dark';
      if (piece === '.') return `<div class="square ${cls}"></div>`;
      const url = pieceImgUrl(piece);
      return `<div class="square ${cls}"><img alt="${piece}" src="${url}" /></div>`;
    })
    .join('\n');

  const fileHeader = fileLabels.map((f) => `<div class="file">${f}</div>`).join('\n');
  const rankHeader = rankLabels.map((r) => `<div class="rank">${r}</div>`).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        --bg: #1a1a2e;
        --panel: #16213e;
        --border: #2a2a4a;
        --accent: #e0c88a;
        --light: #f0d9b5;
        --dark: #b58863;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background: var(--bg);
        color: #eee;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      }

      .wrap {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 18px 18px 14px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55);
        width: min(520px, 94vw);
      }

      h1 {
        margin: 0 0 12px 0;
        font-size: 1rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--accent);
      }

      .board-wrap {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        justify-content: center;
      }

      .ranks {
        display: flex;
        flex-direction: column;
      }

      .rank {
        height: 64px;
        width: 22px;
        display: grid;
        place-items: center;
        font-size: 0.85rem;
        color: #9aa0b5;
        font-weight: 700;
      }

      .board-col {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
      }

      .board {
        display: grid;
        grid-template-columns: repeat(5, 64px);
        grid-template-rows: repeat(8, 64px);
        border: 2px solid #333;
        border-radius: 6px;
        overflow: hidden;
        background: #000;
      }

      .square {
        width: 64px;
        height: 64px;
        display: grid;
        place-items: center;
      }

      .square.light { background: var(--light); }
      .square.dark { background: var(--dark); }

      .square img {
        width: 56px;
        height: 56px;
        display: block;
        user-select: none;
        pointer-events: none;
      }

      .files {
        display: flex;
        width: 320px;
      }

      .file {
        width: 64px;
        text-align: center;
        font-size: 0.85rem;
        color: #9aa0b5;
        font-weight: 700;
      }

      .note {
        margin-top: 10px;
        font-size: 0.82rem;
        color: #aab2c8;
      }
      code { color: #fff; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>${escapeHtml(title)}</h1>
      <div class="board-wrap">
        <div class="ranks">
          ${rankHeader}
        </div>
        <div class="board-col">
          <div class="board">
            ${squares}
          </div>
          <div class="files">
            ${fileHeader}
          </div>
        </div>
      </div>
      <div class="note">Generated by <code>scripts/build-docs-board.js</code>.</div>
    </div>
  </body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
  }

  const outPath = path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out);
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });

  const board = createBoard();
  const html = buildHtml({ board, flip: args.flip, title: args.title });
  fs.writeFileSync(outPath, html, 'utf8');
  process.stdout.write(`Wrote ${outPath}\n`);
}

main();
