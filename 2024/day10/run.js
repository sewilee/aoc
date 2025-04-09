// https://adventofcode.com/2024/day/10
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day10/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((r) => r.split(''));

// find hiking trail, 0 lowest, 9 highest
// only increase by a height of 1
// up down left right, no diagonal
// trailhead = starting, always height at 0

const hikingTrailDfs = (board, trailNum, [r, c]) => {
  // if not within boundaries and not increasing by one
  if (
    r < 0 ||
    r >= board.length ||
    c < 0 ||
    c >= board[r].length ||
    board[r][c] !== trailNum.toString()
  ) {
    return [];
  }
  if (trailNum === 9 && trailNum.toString() === board[r][c]) {
    console.log('found 9', [r, c]);
    return [`${r},${c}`];
  }

  const nextTrailNum = trailNum + 1;
  const up = hikingTrailDfs(board, nextTrailNum, [r - 1, c]);
  const down = hikingTrailDfs(board, nextTrailNum, [r + 1, c]);
  const left = hikingTrailDfs(board, nextTrailNum, [r, c - 1]);
  const right = hikingTrailDfs(board, nextTrailNum, [r, c + 1]);

  return [...new Set([...up, ...down, ...left, ...right])];
};

const partOne = (topoMap) => {
  // 8:51am - 12:34
  // was originally counting all different trails instead of unique trails to 9
  let trailCount = 0;
  for (let r = 0; r < topoMap.length; r++) {
    for (let c = 0; c < topoMap[r].length; c++) {
      const trailScores = hikingTrailDfs(topoMap, 0, [r, c]);
      trailCount = trailCount + trailScores.length;
    }
  }

  return trailCount;
};

const trailRatingDfs = (board, trailNum, [r, c]) => {
  // if not within boundaries and not increasing by one
  if (
    r < 0 ||
    r >= board.length ||
    c < 0 ||
    c >= board[r].length ||
    board[r][c] !== trailNum.toString()
  ) {
    return 0;
  }
  if (trailNum === 9 && trailNum.toString() === board[r][c]) {
    return 1;
  }

  const nextTrailNum = trailNum + 1;
  const up = trailRatingDfs(board, nextTrailNum, [r - 1, c]);
  const down = trailRatingDfs(board, nextTrailNum, [r + 1, c]);
  const left = trailRatingDfs(board, nextTrailNum, [r, c - 1]);
  const right = trailRatingDfs(board, nextTrailNum, [r, c + 1]);

  return up + down + left + right;
};

const partTwo = (topoMap) => {
  // 12:36 - 12:38 lol
  let trailRating = 0;
  for (let r = 0; r < topoMap.length; r++) {
    for (let c = 0; c < topoMap[r].length; c++) {
      const rating = trailRatingDfs(topoMap, 0, [r, c]);
      trailRating = trailRating + rating;
    }
  }

  return trailRating;
};

// console.log('Part one', partOne(input));
console.log('Part two', partTwo(input));
