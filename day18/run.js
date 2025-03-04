// https://adventofcode.com/2024/day/18
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day18/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(','));

const createMap = (w, h, input, byte) => {
  const map = [];

  for (let i = 0; i < w; i++) {
    const row = [];
    for (let j = 0; j < h; j++) {
      row.push('.');
    }
    map.push(row);
  }

  for (let j = 0; j < byte; j++) {
    const [x, y] = input[j];
    // console.log('x', x, 'y', x);
    map[x][y] = '#';
  }

  return map;
};

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const bfs = (start, end, map) => {
  const startNode = {
    coord: start,
    count: 0,
    path: [start],
    name: start.join(','),
  };

  const queue = [];
  const visited = {};

  queue.push(startNode);
  visited[startNode.name] = true;

  // console.log(
  //   'map',
  //   map.map((l) => l.join(''))
  // );

  while (queue.length > 0) {
    const node = queue.shift();
    const { coord, count, path, name } = node;

    if (name === end.join(',')) {
      return node;
    }

    for (let i = 0; i < directions.length; i++) {
      const [r, c] = directions[i];
      const nextCoord = [coord[0] + r, coord[1] + c];
      const [rNext, cNext] = nextCoord;
      const nextCoordName = nextCoord.join(',');

      if (
        rNext < 0 ||
        rNext > map.length - 1 ||
        cNext < 0 ||
        cNext > map[0].length - 1 ||
        map[rNext][cNext] === '#' ||
        visited[nextCoordName]
      ) {
        continue;
      }

      const nextNode = {
        coord: nextCoord,
        path: [...path, nextCoord],
        count: count + 1,
        name: nextCoordName,
      };

      queue.push(nextNode);
      visited[nextCoordName] = true;
    }
  }

  return false;
};

const partOne = (size, byte) => {
  const map = createMap(size, size, input, byte);
  const start = [0, 0];
  const end = [size - 1, size - 1];
  const node = bfs(start, end, map);

  return node.count;
};

const partTwo = (size) => {
  const start = [0, 0];
  const end = [size - 1, size - 1];

  for (let i = 2800; i < input.length; i++) {
    const map = createMap(size, size, input, i);
    const isPath = bfs(start, end, map);
    console.log('computing path:', i);
    if (!isPath) {
      return input[i - 1];
    }
  }
};

// console.log('partTwo', partTwo(71));
// console.log('partOne', partOne(71, 1024));
// console.log('createMap', createMap(7, 7, input));
