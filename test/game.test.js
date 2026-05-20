const test = require('node:test');
const assert = require('node:assert/strict');

const { parseMove, getStatus } = require('../src/game');
const { createBoard } = require('../src/board');

test('parseMove parses valid moves', () => {
  assert.deepEqual(parseMove('a2a3'), { fromRow: 6, fromCol: 0, toRow: 5, toCol: 0 });
  assert.deepEqual(parseMove('e1e2'), { fromRow: 7, fromCol: 4, toRow: 6, toCol: 4 });
});

test('parseMove rejects invalid input', () => {
  assert.equal(parseMove(''), null);
  assert.equal(parseMove('a2a'), null);
  assert.equal(parseMove('f2a3'), null);
  assert.equal(parseMove('a0a3'), null);
  assert.equal(parseMove('a2a9'), null);
  assert.equal(parseMove('a2aX'), null);
});

test('getStatus is ongoing at game start', () => {
  const board = createBoard();
  assert.equal(getStatus(board, true), 'ongoing');
});
