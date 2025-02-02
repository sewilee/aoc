// https://adventofcode.com/2024/day/8
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day8/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((r) => r.split(''));

const findNodeAntennas = (board, nodes) => {
  if (nodes.length === 0) return [];
  const antennas = [];
  const firstNode = nodes[0];
  const restNodes = nodes.slice(1);

  for (let i = 0; i < restNodes.length; i++) {
    const [r, c] = firstNode;
    const [rNext, cNext] = restNodes[i];
    const [r1Ant, c1Ant] = [r + (r - rNext), c + (c - cNext)];
    const [r2Ant, c2Ant] = [rNext + (rNext - r), cNext + (cNext - c)];

    // console.log('firstNode', firstNode);
    // console.log('restNodes[i]', restNodes[i]);
    // console.log('[r1Ant, c1Ant]', [r1Ant, c1Ant]);
    // console.log('[r2Ant, c2Ant]', [r2Ant, c2Ant]);
    // console.log('----');

    if (
      r1Ant >= 0 &&
      r1Ant < board.length &&
      c1Ant >= 0 &&
      c1Ant < board[r1Ant].length
    ) {
      antennas.push([r1Ant, c1Ant]);
    }

    if (
      r2Ant >= 0 &&
      r2Ant < board.length &&
      c2Ant >= 0 &&
      c2Ant < board[r2Ant].length
    ) {
      antennas.push([r2Ant, c2Ant]);
    }
  }

  const restAnts = findNodeAntennas(board, restNodes);
  return [...antennas, ...restAnts];
};

const findAllNodeAntennas = (board, nodes) => {
  if (nodes.length === 0) return [];
  const antennas = [];
  const firstNode = nodes[0];
  const restNodes = nodes.slice(1);

  for (let i = 0; i < restNodes.length; i++) {
    const [r, c] = firstNode;
    const [rNext, cNext] = restNodes[i];
    let [r1Ant, c1Ant] = [r + (r - rNext), c + (c - cNext)];
    let [r2Ant, c2Ant] = [rNext + (rNext - r), cNext + (cNext - c)];
    // if (r === 8 && c === 8) {
    //   console.log('r1Ant, c1Ant', r1Ant, c1Ant);
    // }
    while (
      r1Ant >= 0 &&
      r1Ant < board.length &&
      c1Ant >= 0 &&
      c1Ant < board[r1Ant].length
    ) {
      antennas.push([r1Ant, c1Ant]);
      r1Ant = r1Ant + (r - rNext);
      c1Ant = c1Ant + (c - cNext);
    }

    while (
      r2Ant >= 0 &&
      r2Ant < board.length &&
      c2Ant >= 0 &&
      c2Ant < board[r2Ant].length
    ) {
      antennas.push([r2Ant, c2Ant]);
      r2Ant = r2Ant + (rNext - r);
      c2Ant = c2Ant + (cNext - c);
    }
  }

  const restAnts = findAllNodeAntennas(board, restNodes);
  return [...antennas, ...restAnts];
};

const partOne = (input) => {
  // 1.Find all matching nodes
  const matchingNodes = {};
  const allAntennas = [];

  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      const freqNode = input[r][c];
      if (freqNode !== '.') {
        if (matchingNodes[freqNode]) {
          matchingNodes[freqNode] = [...matchingNodes[freqNode], [r, c]];
        } else {
          matchingNodes[freqNode] = [[r, c]];
        }
      }
    }
  }

  // 2. Run thru each nodes
  const nodeValues = Object.values(matchingNodes);

  nodeValues.forEach((v) => {
    // 3. Check if anything interferes with (2) nodes freq
    const antennas = findNodeAntennas(input, v);
    allAntennas.push(...antennas);
  });

  const uniqueAntennas = [...new Set(allAntennas.map((v) => v.toString()))].map(
    (v) => v.split(',')
  );

  console.log('uniqueAntennas', uniqueAntennas);

  uniqueAntennas.forEach(([r, c]) => {
    if (input[r][c] !== '.') {
      input[r][c] = '#';
    }
  });

  return uniqueAntennas.length;
};

const partTwo = (input) => {
  // 1.Find all matching nodes
  const matchingNodes = {};
  const allAntennas = [];

  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      const freqNode = input[r][c];
      if (freqNode !== '.') {
        if (matchingNodes[freqNode]) {
          matchingNodes[freqNode] = [...matchingNodes[freqNode], [r, c]];
        } else {
          matchingNodes[freqNode] = [[r, c]];
        }
      }
    }
  }

  // 2. Run thru each nodes
  const nodeValues = Object.values(matchingNodes);

  nodeValues.forEach((v) => {
    // 3. Check if anything interferes with (2) nodes freq
    const antennas = findAllNodeAntennas(input, v);
    allAntennas.push(...antennas, ...v);
  });

  const uniqueAntennas = [...new Set(allAntennas.map((v) => v.toString()))].map(
    (v) => v.split(',')
  );

  console.log('uniqueAntennas', uniqueAntennas);

  uniqueAntennas.forEach(([r, c]) => {
    if (input[r][c] === '.') {
      console.log('input[r][c]', input[r][c]);
      input[r][c] = '#';
    }
  });

  console.log('board', input);

  return uniqueAntennas.length;
};

// console.log('Part One', partOne(input));
console.log('Part Two', partTwo(input));
// console.log('input', input);
