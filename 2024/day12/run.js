// https://adventofcode.com/2024/day/12
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day12/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(''));

const visited1 = [];

// 8:00 - 9:31
const areaPerimeterDfs = (board, plantType, [r, c]) => {
  if (r < 0 || r >= board.length || c < 0 || c >= board[0].length)
    return { area: 0, perimeter: 1, board };

  const nextPlantType = board[r][c];

  if (nextPlantType === `${plantType}${plantType}`)
    return { area: 0, perimeter: 0, board };
  if (plantType !== nextPlantType) return { area: 0, perimeter: 1, board };

  const newBoard = board;
  // `${plantType}${plantType}` indicates visited plot but same plant
  newBoard[r][c] = `${plantType}${plantType}`;

  const up = areaPerimeterDfs(newBoard, plantType, [r - 1, c]);
  const down = areaPerimeterDfs(newBoard, plantType, [r + 1, c]);
  const left = areaPerimeterDfs(newBoard, plantType, [r, c - 1]);
  const right = areaPerimeterDfs(newBoard, plantType, [r, c + 1]);

  // console.log('[r, c]', [r, c]);
  // console.log('area', up.area + down.area + left.area + right.area + 1);
  // console.log(
  //   'perimeter',
  //   up.perimeter + down.perimeter + left.perimeter + right.perimeter
  // );
  // console.log('board', newBoard);

  return {
    area: up.area + down.area + left.area + right.area + 1,
    perimeter: up.perimeter + down.perimeter + left.perimeter + right.perimeter,
    newBoard,
  };
};

const partOne = (gardenGrid) => {
  let newGardenGrid = gardenGrid;
  let fencePrice = 0;

  for (let r = 0; r < newGardenGrid.length; r++) {
    for (let c = 0; c < newGardenGrid[0].length; c++) {
      const plantType = gardenGrid[r][c];
      if (visited1.indexOf(plantType) !== -1) continue;

      const plantDfs = areaPerimeterDfs(newGardenGrid, plantType, [r, c]);
      // console.log('plantType', plantType);
      // console.log('plantDfs.area', plantDfs.area);
      // console.log('plantDfs.perimeter', plantDfs.perimeter);
      // console.log('price', plantDfs.area * plantDfs.perimeter);

      // console.log('---');

      newGardenGrid = plantDfs.newBoard;
      fencePrice += plantDfs.area * plantDfs.perimeter;
      visited1.push(`${plantType}${plantType}`);
    }
  }

  return fencePrice;
};

// 9:33

const visited2 = [];

const areaSidesDfs = (board, plantType, [r, c]) => {
  // console.log('board', board);
  const type = plantType.split('|')[0];
  let side = 0;

  if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) {
    return { side: 0, area: 0, board };
  }

  const nextPlantType = board[r][c];

  if (nextPlantType === plantType) return { side: 0, area: 0, board };

  if (type !== nextPlantType) {
    return { side: 0, area: 0, board };
  }

  // console.log('----');

  const newBoard = board;
  newBoard[r][c] = plantType;

  // console.log([r, c], newBoard);

  const up = newBoard[r - 1]?.[c] ?? null;
  const down = newBoard[r + 1]?.[c] ?? null;
  const left = newBoard[r]?.[c - 1] ?? null;
  const right = newBoard[r]?.[c + 1] ?? null;
  const topLeft = newBoard[r - 1]?.[c - 1] ?? null;
  const topRight = newBoard[r - 1]?.[c + 1] ?? null;
  const bottomLeft = newBoard[r + 1]?.[c - 1] ?? null;
  const bottomRight = newBoard[r + 1]?.[c + 1] ?? null;

  /**
   * FIND THE CORNERS, SIDE++
   *  RR  RR  XR  RX
   *  RX  XR  RR  RR
   *
   *  XX  RX  XR  XX
   *  RX  XX  XX  XR
   */

  if (
    (down === plantType || down === type) &&
    (right === plantType || right === type) &&
    bottomRight !== plantType &&
    bottomRight !== type
  )
    side++;

  if (
    (down === plantType || down === type) &&
    (left === plantType || left === type) &&
    bottomLeft !== plantType &&
    bottomLeft !== type
  )
    side++;

  if (
    (up === plantType || up === type) &&
    (right === plantType || right === type) &&
    topRight !== plantType &&
    topRight !== type
  )
    side++;

  if (
    (up === plantType || up === type) &&
    (left === plantType || left === type) &&
    topLeft !== plantType &&
    topLeft !== type
  )
    side++;

  if (up !== plantType && up !== type && right !== plantType && right !== type)
    side++;

  if (up !== plantType && up !== type && left !== plantType && left !== type)
    side++;

  if (
    down !== plantType &&
    down !== type &&
    right !== plantType &&
    right !== type
  )
    side++;

  if (
    down !== plantType &&
    down !== type &&
    left !== plantType &&
    left !== type
  )
    side++;

  const upNext = areaSidesDfs(newBoard, plantType, [r - 1, c]);
  const downNext = areaSidesDfs(newBoard, plantType, [r + 1, c]);
  const leftNext = areaSidesDfs(newBoard, plantType, [r, c - 1]);
  const rightNext = areaSidesDfs(newBoard, plantType, [r, c + 1]);

  // console.log([r, c], side);

  return {
    area: upNext.area + downNext.area + leftNext.area + rightNext.area + 1,
    side: side + upNext.side + downNext.side + leftNext.side + rightNext.side,
    newBoard,
  };
};

const partTwo = (gardenGrid) => {
  let newGardenGrid = gardenGrid;
  let fencePrice = 0;

  for (let r = 0; r < gardenGrid.length; r++) {
    for (let c = 0; c < gardenGrid[0].length; c++) {
      if (visited2.indexOf(gardenGrid[r][c]) !== -1) continue;
      const plantType = `${gardenGrid[r][c]}|${r}${c}`;
      const plantDfs = areaSidesDfs(newGardenGrid, plantType, [r, c]);

      newGardenGrid = plantDfs.newBoard;
      console.log(plantType, 'area', plantDfs.area, 'side', plantDfs.side);
      fencePrice += plantDfs.area * plantDfs.side;
      visited2.push(plantType);
    }
  }

  return fencePrice;
};

console.log('part two', partTwo(input));
// console.log('side', areaSidesDfs(input, 'B|13', [1, 3]));
// console.log('input', input);
