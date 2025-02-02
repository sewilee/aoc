// https://adventofcode.com/2024/day/4

const wordSearchBoard = [
  ['M', 'M', 'M', 'S', 'X', 'X', 'M', 'A', 'S', 'M'],
  ['M', 'S', 'A', 'M', 'X', 'M', 'S', 'M', 'S', 'A'],
  ['A', 'M', 'X', 'S', 'X', 'M', 'A', 'A', 'M', 'M'],
  ['M', 'S', 'A', 'M', 'A', 'S', 'M', 'S', 'M', 'X'],
  ['X', 'M', 'A', 'S', 'A', 'M', 'X', 'A', 'M', 'M'],
  ['X', 'X', 'A', 'M', 'M', 'X', 'X', 'A', 'M', 'A'],
  ['S', 'M', 'S', 'M', 'S', 'A', 'S', 'X', 'S', 'S'],
  ['S', 'A', 'X', 'A', 'M', 'A', 'S', 'A', 'A', 'A'],
  ['M', 'A', 'M', 'M', 'M', 'X', 'M', 'M', 'M', 'M'],
  ['M', 'X', 'M', 'X', 'A', 'X', 'M', 'A', 'S', 'X'],
];

const findNumberOfWord = (board, word) => {
  const dfs = (r, c, i, rowInc, colInc) => {
    // end of the word
    if (word.length === i) return true;

    // inbound and current letter check
    if (
      r >= board.length ||
      r < 0 ||
      c >= board[r].length ||
      c < 0 ||
      board[r][c] !== word[i]
    )
      return false;

    // traverse the board
    if (dfs(r + rowInc, c + colInc, i + 1, rowInc, colInc)) {
      return true;
    }
  };

  let count = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, -1)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, 0)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, -1, 1)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, 0, -1)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, 0, 1)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, -1)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, 0)) {
        count++;
      }
      if (board[r][c] === word[0] && dfs(r, c, 0, 1, 1)) {
        count++;
      }
    }
  }

  return count;
};

console.log(findNumberOfWord(wordSearchBoard, 'XMAS'));
