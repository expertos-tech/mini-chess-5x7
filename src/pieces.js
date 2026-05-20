const PIECE_VALUES = Object.freeze({
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  k: 0,
});

const AI_PIECE_VALUES = Object.freeze({
  p: 10,
  n: 30,
  b: 25,
  r: 50,
  k: 900,
});

module.exports = { PIECE_VALUES, AI_PIECE_VALUES };
