// https://adventofcode.com/2024/day/15
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day15/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const parseInput = () => {
  const map = [];
  const moves = [];
  let key = 'map';

  input.forEach((l) => {
    if (l === '') {
      key = 'moves';
      return;
    }

    if (key === 'map') {
      map.push(l.split(''));
    }

    if (key === 'moves') {
      const nextMoves = l.split('');
      moves.push(...nextMoves);
    }
  });

  return { moves, map };
};

const parsedInput = parseInput();
const directions = {
  '^': [-1, 0],
  v: [1, 0],
  '<': [0, -1],
  '>': [0, 1],
};

const findStartPosition = (map) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const guard = map[i][j];
      if (guard === '@') return [i, j];
    }
  }
};

const isMovePossible = (map, [rDir, cDir], [rCurr, cCurr]) => {
  let newMap = map;
  const rNext = rCurr + rDir;
  const cNext = cCurr + cDir;

  const nextPos = newMap[rNext][cNext];

  if (nextPos === '#') return false;
  if (nextPos === '.') {
    const curr = map[rCurr][cCurr];
    newMap[rNext][cNext] = curr;
    newMap[rCurr][cCurr] = '.';
    return newMap;
  }

  const nextMap = isMovePossible(newMap, [rDir, cDir], [rNext, cNext]);

  if (nextMap) {
    const curr = map[rCurr][cCurr];
    newMap[rNext][cNext] = curr;
    newMap[rCurr][cCurr] = '.';
    return nextMap;
  }

  return nextMap;
};

const partOne = ({ moves, map }) => {
  // 1. Move the guard and boxes
  let newMap = map;
  let currentPos = findStartPosition(map);
  moves.forEach((moveDir) => {
    const [rDir, cDir] = directions[moveDir];
    const [rCurr, cCurr] = currentPos;
    const movedMap = isMovePossible(newMap, [rDir, cDir], currentPos);

    if (!movedMap) return;
    newMap = movedMap;
    currentPos = [rCurr + rDir, cCurr + cDir];
  });

  // 2. find the "gps"
  let distance = 0;

  for (let r = 0; r < newMap.length; r++) {
    for (let c = 0; c < newMap[0].length; c++) {
      const box = newMap[r][c];
      if (box === 'O') {
        // console.log('r, c', r, c);
        distance += 100 * r + c;
      }
    }
  }

  return distance;
};

const parseInput2 = () => {
  const { moves, map } = parsedInput;
  const newMap = map.map((r) => {
    return r
      .map((tile) => {
        // console.log('tile', tile);
        if (tile === '@') return '@.';
        if (tile === 'O') return '[]';
        return `${tile}${tile}`;
      })
      .join('')
      .split('');
  });
  return { moves, map: newMap };
};

const parsedInput2 = parseInput2();

const checkNodeChild = (map, [rDir, cDir], [rCurr, cCurr]) => {
  const rNext = rCurr + rDir;
  const cNext = cCurr + cDir;

  if (map[rNext][cNext] === '#') return false;
  if (map[rNext][cNext] === '.') {
    const newMap = map;
    newMap[rCurr][cCurr] = '.';
    newMap[rNext][cNext] = '@';
    return newMap;
  }

  const visited = {};
  const queue = [];
  queue.push([rCurr, cCurr]);

  visited[`${rCurr},${cCurr}`] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    const node = map[r][c];
    // console.log('node', node);
    if (node === '@') {
      queue.push([rNext, cNext]);
      visited[`${rNext},${cNext}`] = true;
    }
    if (node === '[' || node === ']') {
      const [rN, cN] = [r + rDir, c + cDir];
      const [rAdj, cAdj] = [r, node === '[' ? c + 1 : c - 1];
      const nextNode = map[rN][cN];

      if (nextNode === '#') return false;
      if (nextNode !== '.' && !visited[`${rN},${cN}`]) {
        queue.push([rN, cN]);

        visited[`${rN},${cN}`] = true;
      }

      const adjNode = map[rAdj][cAdj];
      if (adjNode !== '#' && adjNode !== '.' && !visited[`${rAdj},${cAdj}`]) {
        queue.push([rAdj, cAdj]);
        visited[`${rAdj},${cAdj}`] = true;
      }
    }
  }

  // console.log('visited', visited);
  const newMap = structuredClone(map);
  const remapped = {};
  Object.keys(visited).forEach((key) => {
    const [r, c] = key.split(',');
    const curr = map[r][c];
    const rNew = Number(r) + rDir;
    const cNew = Number(c) + cDir;

    newMap[rNew][cNew] = curr;
    remapped[`${rNew},${cNew}`] = true;
    if (!remapped[`${r},${c}`]) {
      newMap[r][c] = '.';
    }
  });

  return newMap;
};

const partTwo = ({ moves, map }) => {
  // 9:00 - 11:34
  // had to restart using bfs instead of recurrsion
  // 1. Move the guard and boxes
  let newMap = map;
  let currentPos = findStartPosition(map);
  // console.log(
  //   'init Map',
  //   newMap.map((l) => l.join(''))
  // );
  moves.forEach((moveDir) => {
    const [rDir, cDir] = directions[moveDir];
    const [rCurr, cCurr] = currentPos;

    const movedMap = checkNodeChild(newMap, [rDir, cDir], [rCurr, cCurr]);
    if (!movedMap) return;

    newMap = movedMap;
    currentPos = [rCurr + rDir, cCurr + cDir];
    // console.log(
    //   'newMap',
    //   moveDir,
    //   newMap.map((l) => l.join(''))
    // );
  });

  // 2. find the "gps"
  let distance = 0;

  for (let r = 0; r < newMap.length; r++) {
    for (let c = 0; c < newMap[0].length; c++) {
      const box = newMap[r][c];
      if (box === '[') {
        // console.log('r, c', r, c);
        distance += 100 * r + c;
      }
    }
  }

  return distance;
};

// console.log('part one', partOne(parsedInput));
console.log('part two', partTwo(parsedInput2));
