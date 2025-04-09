// https://adventofcode.com/2024/day/4
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day4/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const partOne = (board, word) => {
  let count = 0;

  const dfs = (row, col, indx, rowInc, colInc) => {
    if (indx === word.length) return true;
    if (
      row >= board.length ||
      row < 0 ||
      col >= board[row].length ||
      col < 0 ||
      board[row][col] !== word[indx]
    )
      return false;
    return dfs(row + rowInc, col + colInc, indx + 1, rowInc, colInc);
  };

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      // check straight letters for each boxes
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, -1)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, 0)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, 1)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, 0, -1)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, 0, 1)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, -1)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, 0)) count++;
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, 1)) count++;
    }
  }

  return count;
};

const partTwo = (board, word) => {
  let count = 0;
  const midIndex = Math.floor(word.length / 2);

  const dfs = (row, col, indx, rowInc, colInc) => {
    if (indx === word.length) return true;
    if (
      row >= board.length ||
      row < 0 ||
      col >= board[row].length ||
      col < 0 ||
      board[row][col] !== word[indx]
    )
      return false;
    return dfs(row + rowInc, col + colInc, indx + 1, rowInc, colInc);
  };

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      let xTally = 0;
      // check straight letters for each boxes
      if (board[r][c] === word[midIndex]) {
        // topleft
        if (dfs(r - midIndex, c - midIndex, 0, 1, 1)) xTally++;
        // topright
        if (dfs(r - midIndex, c + midIndex, 0, 1, -1)) xTally++;
        // bottomright
        if (dfs(r + midIndex, c + midIndex, 0, -1, -1)) xTally++;
        // bottomleft
        if (dfs(r + midIndex, c - midIndex, 0, -1, 1)) xTally++;

        // if any (2) of these are true, count ++
        if (xTally === 2) count++;
      }
    }
  }

  return count;
};

console.log(partOne(input, 'XMAS'));
console.log(partTwo(input, 'MAS'));
