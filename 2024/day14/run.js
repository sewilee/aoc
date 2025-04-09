// https://adventofcode.com/2024/day/14
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day14/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => {
    const [p, v] = l.split(' ');
    const [pX, pY] = p.slice(2).split(',');
    const [vX, vY] = v.slice(2).split(',');

    return {
      p: [Number(pX), Number(pY)],
      v: [Number(vX), Number(vY)],
    };
  });

const findIndex = (num, length) => {
  if (num < 0) {
    const mol = num % length;
    return (length + mol) % length;
  }
  if (num > length - 1) {
    const multiplier = Math.floor(num / length);
    // console.log('calc', num - length * multiplier);
    return num - length * multiplier;
  }
  return num;
};

const partOne = (input, xLength, yLength, sec) => {
  // 12:33pm
  const seconds = sec;
  const grid = new Array(yLength);

  // create grid
  for (let i = 0; i < yLength; i++) {
    grid[i] = new Array(xLength);
    for (let j = 0; j < xLength; j++) {
      grid[i][j] = 0;
    }
  }

  const robotNewPosition = input.map(({ p, v }) => {
    const [pX, pY] = p;
    const [vX, vY] = v;

    const nextX = pX + vX * seconds;
    const nextY = pY + vY * seconds;
    // console.log('nextX', nextX);
    return [findIndex(nextX, xLength), findIndex(nextY, yLength)];
  });

  robotNewPosition.forEach(([x, y]) => {
    const count = grid[y][x];
    grid[y][x] = count + 1;
  });

  const xMid = Math.floor(xLength / 2);
  const yMid = Math.floor(yLength / 2);

  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;

  const newGrid = grid.map((l) => l.join(''));
  console.log('grid', newGrid);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (y < yMid && x < xMid) q1 += grid[y][x];
      if (y < yMid && x > xMid) q2 += grid[y][x];
      if (y > yMid && x < xMid) q3 += grid[y][x];
      if (y > yMid && x > xMid) q4 += grid[y][x];
    }
  }

  return q1 * q2 * q3 * q4;
};

const createRobotGrid = (grid, seconds, input, xLength, yLength) => {
  const newGrid = grid;

  const robotNewPosition = input.map(({ p, v }) => {
    const [pX, pY] = p;
    const [vX, vY] = v;

    const nextX = pX + vX * seconds;
    const nextY = pY + vY * seconds;
    // console.log('nextX', nextX);
    return [findIndex(nextX, xLength), findIndex(nextY, yLength)];
  });

  robotNewPosition.forEach(([x, y]) => {
    const count = newGrid[y][x];
    // newGrid[y][x] = '#';
    newGrid[y][x] = '1';
    // newGrid[y][x] = newGrid[y][x] + 1;
  });

  // console.log('newGrid'), newGrid;

  return newGrid;
};

const isPossibleTree = (grid) => {
  const newGrid = grid.map((l) => l.join(''));
  for (let i = 0; i < newGrid.length; i++) {
    if (newGrid[i].indexOf('1111111111') !== -1) {
      return true;
    }
  }
  return false;
};

const createEmptyGrid = (xLength, yLength) => {
  const grid = new Array(yLength);
  // create grid
  for (let i = 0; i < yLength; i++) {
    grid[i] = new Array(xLength);
    for (let j = 0; j < xLength; j++) {
      grid[i][j] = '.';
    }
  }

  return grid;
};

const partTwo = (input, xLength, yLength, sec) => {
  let seconds = sec;
  let tree = false;

  while (!tree) {
    console.log('checking seconds: ', seconds);
    // need to recreate empty grid every second or old data will populate empty grid
    const grid = createEmptyGrid(xLength, yLength);
    const newGrid = createRobotGrid(grid, seconds, input, xLength, yLength);
    const isTree = isPossibleTree(newGrid);
    if (isTree) {
      console.log(
        'seconds',
        seconds,
        isTree,
        newGrid.map((l) => l.join(''))
      );
      return seconds;
    }
    seconds++;
  }
};

// console.log('part one', partOne(input, 101, 103, 74401));
console.log('part two', partTwo(input, 101, 103, 500));

//
// console.log('input', input);
/**
 * [
  { p: [ 0, 4 ], v: [ 3, -3 ] },

  { p: [ 6, 3 ], v: [ -1, -3 ] },
  { p: [ 10, 3 ], v: [ -1, 2 ] },
  { p: [ 2, 0 ], v: [ 2, -1 ] },
  { p: [ 0, 0 ], v: [ 1, 3 ] },
  { p: [ 3, 0 ], v: [ -2, -2 ] },
  { p: [ 7, 6 ], v: [ -1, -3 ] },
  { p: [ 3, 0 ], v: [ -1, -2 ] },
  { p: [ 9, 3 ], v: [ 2, 3 ] },
  { p: [ 7, 3 ], v: [ -1, 2 ] },
  { p: [ 2, 4 ], v: [ 2, -3 ] },
  { p: [ 9, 5 ], v: [ -3, -3 ] }
]
 * 
 */
