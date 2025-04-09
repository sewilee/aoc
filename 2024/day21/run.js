// https://adventofcode.com/2024/day/21
const fs = require('fs');

const txtFile = 'sample';

const input = fs
  .readFileSync(`day21/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(''));

const numericKeyPad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['X', '0', 'A'],
];

const directionalKeyPad = [
  ['X', '^', 'A'],
  ['<', 'v', '>'],
];

const movement = [
  { coord: [0, -1], direction: '<', opposite: '>' },
  { coord: [0, 1], direction: '>', opposite: '<' },
  { coord: [-1, 0], direction: '^', opposite: 'v' },
  { coord: [1, 0], direction: 'v', opposite: '^' },
];

const findCoord = (val, grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (val === grid[i][j]) return [i, j];
    }
  }

  return null;
};

const dictionary = { robot0: {}, human: {} };

const keypadBFS2 = (keypad, start, end) => {
  const startCoord = findCoord(start, keypad);
  const queue = [];
  const startNode = {
    coord: startCoord,
    path: [],
    moves: 0,
    count: 0,
  };

  const allPaths = [];

  const visited = {};
  visited[`${start}|${startNode.count}`] = startNode;
  queue.push(startNode);

  while (queue.length > 0) {
    const node = queue.shift();
    const { coord, path, moves, count } = node;
    const [r, c] = coord;
    const nodeVal = keypad[r][c];

    if (allPaths.length > 0 && moves > allPaths[0].moves) {
      continue;
    }

    if (nodeVal === end) {
      if (allPaths.length > 0 && count > allPaths[0].count) continue;
      allPaths.push(node);
    }

    for (let i = 0; i < movement.length; i++) {
      const { coord, direction, opposite } = movement[i];
      const [rInc, cInc] = coord;
      const [rNext, cNext] = [r + rInc, c + cInc];

      if (opposite === path[path.length - 1]) continue;

      if (
        rNext < 0 ||
        cNext < 0 ||
        rNext > keypad.length - 1 ||
        cNext > keypad[0].length - 1
      )
        continue;

      const nextNodeVal = keypad[rNext][cNext];

      const nextNode = {
        coord: [rNext, cNext],
        path: [...path, direction],
        moves: moves + 1,
        count: path[path.length - 1] === direction ? count + 1 : count + 100,
      };

      if (visited[`${nextNodeVal}|${nextNode.count}`] || nextNodeVal === 'X')
        continue;

      const indexAtMoves = queue.findIndex((ele) => {
        return nextNode.moves <= ele.moves;
      });

      if (indexAtMoves === -1) {
        queue.push(nextNode);
      } else {
        const indexAtCount = queue.findIndex((ele, indx) => {
          return indx >= indexAtMoves && nextNode.count <= ele.count;
        });
        if (indexAtCount === -1) {
          queue.push(nextNode);
        } else {
          queue.splice(indexAtCount, 0, nextNode);
        }
      }
    }
  }

  return allPaths;
};

const findAllMovements = () => {
  const KEYPAD_MOVEMENT = {};
  const numeric = 'A0987654321'.split('');
  const directional = 'A<^>v'.split('');

  // NUMERIC
  for (let i = 0; i < numeric.length; i++) {
    const start = numeric[i];
    for (let j = 0; j < numeric.length; j++) {
      const paths = [];
      const end = numeric[j];

      const pathNodes = keypadBFS2(numericKeyPad, start, end);
      pathNodes.forEach((node) => {
        paths.push(node.path.join('') + 'A');
      });

      KEYPAD_MOVEMENT[`${start},${end}`] = paths;
    }
  }

  // DIRECTIONAL
  for (let i = 0; i < directional.length; i++) {
    const start = directional[i];
    for (let j = 0; j < directional.length; j++) {
      const paths = [];
      const end = directional[j];

      const pathNodes = keypadBFS2(directionalKeyPad, start, end);
      pathNodes.forEach((node) => {
        paths.push(node.path.join('') + 'A');
      });

      KEYPAD_MOVEMENT[`${start},${end}`] = paths;
    }
  }

  return KEYPAD_MOVEMENT;
};

// console.log('KEYPAD_MOVEMENT', KEYPAD_MOVEMENT);

const findAllPath = (code, keypad, dictionaryKey) => {
  let endPath = [];
  code.forEach((digi, index) => {
    let allPaths;

    const start = index === 0 ? 'A' : code[index - 1];
    const end = digi;

    if (dictionary[dictionaryKey][`${start},${end}`]) {
      allPaths = dictionary[dictionaryKey][`${start},${end}`];
    } else {
      const bfsNodes = keypadBFS2(keypad, start, end);
      allPaths = bfsNodes.map((node) => {
        return [...node.path, 'A'].join('');
      });
      dictionary[dictionaryKey][`${start},${end}`] = allPaths;
    }

    if (endPath.length === 0) {
      endPath = allPaths;
    } else {
      const newEndPath = [];
      allPaths.forEach((ap) => {
        endPath.forEach((ep) => {
          newEndPath.push(`${ep}${ap}`);
        });
      });
      endPath = newEndPath;
    }
  });
  return endPath;
};

const partOne2 = (input) => {
  let count = 0;

  input.forEach((code) => {
    const robot1Directions = findAllPath(code, numericKeyPad, 'robot1');
    // console.log('robot1Directions', robot1Directions);
    let robot2Directions = [];
    robot1Directions.forEach((code2) => {
      robot2Directions = [
        ...robot2Directions,
        ...findAllPath(code2.split(''), directionalKeyPad, 'robot2'),
      ];
    });
    // console.log('robot2Directions', robot2Directions);
    let humanDirections = [];
    robot2Directions.forEach((code3) => {
      humanDirections = [
        ...humanDirections,
        ...findAllPath(code3.split(''), directionalKeyPad, 'human'),
      ];
    });
    // console.log('humanDirections', code, humanDirections);
    const shortestPath = humanDirections.reduce((acc, code) => {
      return acc.length < code.length ? acc : code;
    }, humanDirections[0]);
    const numericCode = Number(code.slice(0, code.length - 1).join(''));
    count += numericCode * shortestPath.length;
    console.log(code.join(''), shortestPath.length, numericCode);
    console.log('---');
  });
  return count;
};

// console.log('partOne2', partOne2(input));

const pathByCount = (count, code, memo, dictionary) => {
  const key = `${code}|${count}`;
  if (memo[key]) return memo[key];
  if (count === 0) {
    memo[key] = code;
    return code;
  }
};

const partTwo = (input) => {
  const KEYPAD_MOVEMENT = findAllMovements();
  const memo = {};

  input.forEach((code) => {
    let robot1 = [];
    code.forEach((digit, index) => {
      const start = index === 0 ? 'A' : code[index - 1];
      const end = digit;
      const movementKey = `${start},${end}`;
      const paths = KEYPAD_MOVEMENT[movementKey];

      const newPaths = [];

      paths.forEach((add) => {
        if (robot1.length === 0) {
          newPaths.push(add);
        } else {
          robot1.forEach((curr) => {
            newPaths.push(`${curr}${add}`);
          });
        }
      });

      robot1 = newPaths;
    });

    // console.log('robot1', code.join(''), robot1);
  });
};

console.log('partTwo', partTwo(input));
