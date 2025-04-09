// https://adventofcode.com/2024/day/6
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day6/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((r) => r.split(''));

const MOVE_DIRECTION = {
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

const TURN_DIRECTION = {
  '^': '>',
  v: '<',
  '>': 'v',
  '<': '^',
};

const VISITED_DIRECTION = {
  '^': '|',
  v: '|',
  '>': '-',
  '<': '-',
};

const DIRECTIONS = Object.keys(MOVE_DIRECTION);

const findStartPosition = (board) => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (DIRECTIONS.indexOf(board[r][c]) !== -1) return [r, c];
    }
  }

  return null;
};

const countVisitedPositions = (board) => {
  let count = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 'X') count++;
    }
  }

  return count;
};

const partOne = (board) => {
  let updatedBoard = structuredClone(board);

  const startPosition = findStartPosition(board);
  let currentPostion = startPosition;
  if (startPosition === null) return 0;

  let isGuardHere = true;
  while (isGuardHere) {
    const [r, c] = currentPostion;
    const guard = updatedBoard[r][c];
    const [rMove, cMove] = MOVE_DIRECTION[guard];
    const [rNext, cNext] = [r + rMove, c + cMove];

    if (
      rNext < 0 ||
      rNext >= board.length ||
      cNext < 0 ||
      cNext >= board[rNext].length
    ) {
      updatedBoard[r][c] = 'X';
      isGuardHere = false;
      break;
    }

    const nextPosition = updatedBoard[rNext][cNext];
    if (nextPosition === '#') {
      updatedBoard[r][c] = TURN_DIRECTION[guard];
    } else {
      currentPostion = [rNext, cNext];
      updatedBoard[rNext][cNext] = guard;
      updatedBoard[r][c] = 'X';
    }
  }
  return countVisitedPositions(updatedBoard);
};

const traveledPath = (board) => {
  let updatedBoard = structuredClone(board);

  const startPosition = findStartPosition(board);
  let currentPostion = startPosition;
  if (startPosition === null) return 0;

  let isGuardHere = true;
  while (isGuardHere) {
    const [r, c] = currentPostion;
    const guard = updatedBoard[r][c];
    const [rMove, cMove] = MOVE_DIRECTION[guard];
    const [rNext, cNext] = [r + rMove, c + cMove];

    if (
      rNext < 0 ||
      rNext >= board.length ||
      cNext < 0 ||
      cNext >= board[rNext].length
    ) {
      updatedBoard[r][c] = 'X';
      isGuardHere = false;
      break;
    }

    const nextPosition = updatedBoard[rNext][cNext];
    if (nextPosition === '#') {
      updatedBoard[r][c] = TURN_DIRECTION[guard];
    } else {
      currentPostion = [rNext, cNext];
      updatedBoard[rNext][cNext] = guard;
      updatedBoard[r][c] = 'X';
    }
  }
  return updatedBoard;
};

const isGuardLooping = (board) => {
  const startPosition = findStartPosition(board);
  const traveledTurns = {};
  let startedPatrol = false;

  let updatedBoard = structuredClone(board);
  let currentPostion = startPosition;

  let isGuardHere = true;
  while (isGuardHere) {
    const [r, c] = currentPostion;
    const guard = updatedBoard[r][c];
    const [rMove, cMove] = MOVE_DIRECTION[guard];
    const [rNext, cNext] = [r + rMove, c + cMove];

    if (
      rNext < 0 ||
      rNext >= board.length ||
      cNext < 0 ||
      cNext >= board[rNext].length
    ) {
      isGuardHere = false;
      return false;
    }

    const nextPosition = updatedBoard[rNext][cNext];

    if (startedPatrol) {
      if (
        startPosition[0] === rNext &&
        startPosition[1] === cNext &&
        nextPosition === guard
      ) {
        // console.log('updatedBoard1', updatedBoard);
        return true;
      }
    }

    if (nextPosition === '#' || nextPosition === 'O') {
      updatedBoard[r][c] = TURN_DIRECTION[guard];
      const key = `${r},${c}`;
      const listOfTurns = traveledTurns[key];
      if (listOfTurns) {
        if (listOfTurns.some((val) => val === TURN_DIRECTION[guard])) {
          // console.log('updateBoard2', updatedBoard, traveledTurns);
          return true;
        } else {
          traveledTurns[key] = [...listOfTurns, TURN_DIRECTION[guard]];
        }
      } else {
        traveledTurns[key] = [TURN_DIRECTION[guard]];
      }
    } else {
      // console.log('updatedBoard3', updatedBoard);
      currentPostion = [rNext, cNext];
      updatedBoard[rNext][cNext] = guard;
      updatedBoard[r][c] = VISITED_DIRECTION[updatedBoard[r][c]];
      startedPatrol = true;
    }
  }

  // console.log('updatedBoard4', updatedBoard);

  return false;
};

const partTwo = (board) => {
  const [rStart, cStart] = findStartPosition(board);
  // map out all the X paths
  const traveledBoard = traveledPath(board);
  traveledBoard[rStart][cStart] = board[rStart][cStart];

  const obstacles = [];

  for (let r = 0; r < traveledBoard.length; r++) {
    for (let c = 0; c < traveledBoard[r].length; c++) {
      const additionalObstacleBoard = structuredClone(board);
      if (traveledBoard[r][c] === 'X') {
        additionalObstacleBoard[r][c] = 'O';
        console.log('whatttt ------- ', r, c);
        if (isGuardLooping(additionalObstacleBoard)) {
          obstacles.push([r, c]);
        }
      }
    }
  }

  return obstacles.length;
};

// console.log('Part One', partOne(input));
console.log('Part Two', partTwo(input));
