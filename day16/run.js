// https://adventofcode.com/2024/day/16
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day16/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(''));

const findPostionAt = (board, letter) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const pos = board[i][j];
      if (pos === letter) return [i, j];
    }
  }
};

const directions = [
  { direction: '<', coord: [0, -1], opposite: '>' },
  { direction: '>', coord: [0, 1], opposite: '<' },
  { direction: '^', coord: [-1, 0], opposite: 'v' },
  { direction: 'v', coord: [1, 0], opposite: '^' },
];

const bfs = (maze, path) => {
  const [rS, cS] = findPostionAt(maze, 'S');

  const queue = [];
  const visited = {};
  queue.push({
    coord: [rS, cS],
    direction: '>',
    count: 0,
    path: [`${rS},${cS}`],
  });
  visited[`${rS},${cS}`] = { coord: [0, 0], direction: '>', count: 0 };

  while (queue.length > 0) {
    const node = queue.shift();
    const {
      coord: nodeCoord,
      direction: nodeDirection,
      count: nodeCount,
      path: nodePath,
    } = node;

    if (maze[nodeCoord[0]][nodeCoord[1]] === 'E') {
      const newPath = nodePath.join('');
      if (newPath !== path) return node;
    }

    for (let i = 0; i < directions.length; i++) {
      const { direction, coord } = directions[i];
      const [rNext, cNext] = [nodeCoord[0] + coord[0], nodeCoord[1] + coord[1]];
      const nextPos = maze[rNext][cNext];
      if (nextPos === '#') continue;

      if (nodeDirection !== direction) {
        // readjust count for turns
        visited[`${nodeCoord[0]},${nodeCoord[1]}`].count = nodeCount + 1001;
      }

      const nextNode = {
        coord: [rNext, cNext],
        direction,
        count: nodeDirection === direction ? nodeCount + 1 : nodeCount + 1001,
        path: [...nodePath, `${rNext},${cNext}`],
      };

      if (
        visited[`${rNext},${cNext}`] &&
        visited[`${rNext},${cNext}`].count < nextNode.count
      ) {
        // if node was already visited check the count to see which is lower.
        // console.log('node', nextNode, visited[`${rNext},${cNext}`]);
        continue;
      }

      const isLargeCount = queue.findIndex((n) => n.count > nextNode.count);
      if (isLargeCount === -1) {
        queue.push(nextNode);
      } else {
        queue.splice(isLargeCount, 0, nextNode);
      }

      visited[`${rNext},${cNext}`] = nextNode;
    }
  }

  return null;
};

const partOne = (maze) => {
  const bestPath = bfs(maze);
  return bestPath.count;
};

const dfs = (maze, [r, c], path, count, prevDir, maxCount) => {
  // console.log('computing:', r, c, count);
  console.log('maze', maze.map((l) => l.join('')).slice(100));
  if (
    r < 0 ||
    r > maze.length ||
    c < 0 ||
    c > maze[0].length ||
    maze[r][c] === '#' ||
    maze[r][c] === 'O'
  )
    return false;
  if (count > maxCount) return false;
  if (maze[r][c] === 'E') {
    // console.log('count', count, '<', maxCount);
    // console.log('path found', path);
    return [...path, `${r},${c}`].join('|');
  }

  const newMaze = structuredClone(maze);
  newMaze[r][c] = 'O';

  const upCount = prevDir === '^' ? count + 1 : count + 1001;
  const rightCount = prevDir === '>' ? count + 1 : count + 1001;
  const leftCount = prevDir === '<' ? count + 1 : count + 1001;
  const downCount = prevDir === 'v' ? count + 1 : count + 1001;

  const up = dfs(
    newMaze,
    [r, c - 1],
    [...path, `${r},${c - 1}`],
    upCount,
    '^',
    maxCount
  );
  const down = dfs(
    newMaze,
    [r, c + 1],
    [...path, `${r},${c + 1}`],
    downCount,
    'v',
    maxCount
  );
  const left = dfs(
    newMaze,
    [r - 1, c],
    [...path, `${r - 1},${c}`],
    leftCount,
    '<',
    maxCount
  );
  const right = dfs(
    newMaze,
    [r + 1, c],
    [...path, `${r + 1},${c}`],
    rightCount,
    '>',
    maxCount
  );

  const newPaths = [];
  if (up && up.length > 0) newPaths.push(up);
  if (down && down.length > 0) newPaths.push(down);
  if (left && left.length > 0) newPaths.push(left);
  if (right && right.length > 0) newPaths.push(right);

  return newPaths.flat();
};

const bfsAllPaths = (maze, path) => {
  const [rS, cS] = findPostionAt(maze, 'S');
  let count;
  const bestPaths = [];

  const queue = [];
  const visited = {};
  queue.push({
    coord: [rS, cS],
    direction: '>',
    count: 0,
    path: [`${rS},${cS}`],
  });
  // store visited by directions to determine count
  visited[`${rS},${cS}|>`] = { coord: [0, 0], direction: '>', count: 0 };

  while (queue.length > 0) {
    const node = queue.shift();
    const {
      coord: nodeCoord,
      direction: nodeDirection,
      count: nodeCount,
      path: nodePath,
    } = node;

    if (maze[nodeCoord[0]][nodeCoord[1]] === 'E') {
      // console.log('node', node);
      // console.log('q', queue);
      const newPath = nodePath.join('');
      if (newPath !== path) {
        if (!count) {
          count = node.count;
        }
        if (count === node.count) {
          bestPaths.push(node);
          continue;
        }
      }
    }

    for (let i = 0; i < directions.length; i++) {
      const { direction, coord, opposite } = directions[i];
      if (node.direction === opposite) continue;
      const [rNext, cNext] = [nodeCoord[0] + coord[0], nodeCoord[1] + coord[1]];
      const nextPos = maze[rNext][cNext];
      if (nextPos === '#') continue;

      if (nodeDirection !== direction) {
        // readjust count for turns
        visited[`${nodeCoord[0]},${nodeCoord[1]}|${direction}`] = {
          ...node,
          count: nodeCount + 1001,
        };
      }

      const nextNode = {
        coord: [rNext, cNext],
        direction,
        count: nodeDirection === direction ? nodeCount + 1 : nodeCount + 1001,
        path: [...nodePath, `${rNext},${cNext}`],
      };

      if (count && nextNode.count > count) {
        continue;
      }

      if (visited[`${rNext},${cNext}|${nextNode.direction}`]) {
        const visitedNode = visited[`${rNext},${cNext}|${nextNode.direction}`];
        if (visitedNode.count < nextNode.count) continue;
      }

      if (queue[0]?.count > nextNode.count) {
        queue.unshift(nextNode);
      } else {
        queue.push(nextNode);
      }

      console.log('now queuing:', queue.length, queue[0].count);

      visited[`${rNext},${cNext}|${nextNode.direction}`] = nextNode;
    }
  }

  return bestPaths;
};

const partTwo = (maze) => {
  console.log('computing bestPaths....');
  const bestPaths = bfsAllPaths(maze);
  console.log('computed bestPath count:', bestPaths[0].count);

  let allTiles = [];

  bestPaths.forEach((node, i) => {
    console.log('path', i, node);
    allTiles = allTiles.concat(node.path);
  });

  const uniqueTiles = new Set(allTiles);
  return uniqueTiles.size;
};

// console.log('part one', partOne(input));
console.log('part two', partTwo(input));
