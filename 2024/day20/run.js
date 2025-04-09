// https://adventofcode.com/2024/day/20
const fs = require('fs');

const txtFile = 'input';
const picoSize = 100;

const input = fs
  .readFileSync(`day20/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(''));

const findCoord = (val, racetrack) => {
  for (let i = 0; i < racetrack.length; i++) {
    for (let j = 0; j < racetrack[0].length; j++) {
      if (val === racetrack[i][j]) return [i, j];
    }
  }

  return null;
};

const directions = [
  { direction: '<', coord: [0, -1], opposite: '>' },
  { direction: '>', coord: [0, 1], opposite: '<' },
  { direction: '^', coord: [-1, 0], opposite: 'v' },
  { direction: 'v', coord: [1, 0], opposite: '^' },
];

const findPathOrder = (racetrack, start, end) => {
  // console.log('racetrack', racetrack);
  // console.log('start', start);
  // console.log('end', end);
  const queue = [];
  const visited = {};
  const startNode = { coord: start, picoseconds: 0, path: [start.join(',')] };
  visited[start.join('|')] = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const node = queue.shift();
    const { coord, picoseconds, path } = node;
    const [r, c] = coord;

    if (r === end[0] && c === end[1]) {
      return node;
    }

    for (let i = 0; i < directions.length; i++) {
      const [rInc, cInc] = directions[i].coord;
      const rNext = r + rInc;
      const cNext = c + cInc;
      // console.log('[rNext][cNext]', [rNext], racetrack.length);
      if (
        rNext < 0 ||
        rNext >= racetrack.length ||
        cNext < 0 ||
        cNext >= racetrack[0].length ||
        racetrack[rNext][cNext] === '#' ||
        visited[`${rNext}|${cNext}`]
      ) {
        continue;
      }

      const nextNode = {
        coord: [rNext, cNext],
        picoseconds: picoseconds + 1,
        path: [...path, `${rNext},${cNext}`],
      };

      queue.push(nextNode);
      visited[nextNode.coord.join('|')] = true;
    }
  }
};

const partOne = (racetrack, savedNum) => {
  const start = findCoord('S', racetrack);
  const end = findCoord('E', racetrack);
  const pathOrder = findPathOrder(racetrack, start, end).path;
  const maxPico = pathOrder.length - savedNum;

  // const visited = {};
  let cheatCount = 0;

  // console.log('pathOrder', pathOrder);

  for (let i = 0; i < pathOrder.length; i++) {
    const [r, c] = pathOrder[i].split(',');
    // Find Wall for cheat
    for (let j = 0; j < directions.length; j++) {
      const [rInc, cInc] = directions[j].coord;
      const [rWall, cWall] = [Number(r) + rInc, Number(c) + cInc];
      // Border
      if (
        rWall === 0 ||
        rWall === racetrack.length - 1 ||
        cWall === 0 ||
        cWall === racetrack[0].length - 1 ||
        racetrack[rWall][cWall] === '.'
      )
        continue;

      // Find Path
      for (let k = 0; k < directions.length; k++) {
        const [rInc2, cInc2] = directions[k].coord;
        const [rPath, cPath] = [rWall + rInc2, cWall + cInc2];

        if (Number(r) === rPath && Number(c) === cPath) continue;
        if (racetrack[rPath][cPath] !== '#') {
          const pathIndex = pathOrder.findIndex(
            (ele) => ele === `${rPath},${cPath}`
          );
          const remainingPath = pathOrder.slice(pathIndex);
          const picoseconds = i + 1 + remainingPath.length;
          if (picoseconds === maxPico) {
            // console.log('`${rPath},${cPath}`', `${rPath},${cPath}`);
            // console.log('remainingPath', remainingPath);
            // console.log('picoseconds', picoseconds);
            // console.log('---');
            cheatCount++;
          }
        }
      }
    }
  }

  return cheatCount;
};

const travelByPicoseconds = (racetrack, start, maxPico, all) => {
  const allPaths = [];
  const queue = [];
  const visited = {};
  const startNode = { coord: start, picoseconds: 0, path: [start.join(',')] };
  visited[start.join('|')] = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const node = queue.shift();
    const { coord, picoseconds, path } = node;
    const [r, c] = coord;
    if (racetrack[r][c] === '.' || racetrack[r][c] === 'E') {
      if (all) {
        allPaths.push(node);
      } else {
        return [node];
      }
    }

    if (picoseconds >= maxPico) continue;
    if (racetrack[r][c] === 'E') continue;

    for (let i = 0; i < directions.length; i++) {
      const [rInc, cInc] = directions[i].coord;
      const rNext = r + rInc;
      const cNext = c + cInc;
      if (
        rNext < 1 ||
        rNext > racetrack.length - 1 ||
        cNext < 1 ||
        cNext > racetrack[0].length - 1 ||
        visited[`${rNext}|${cNext}`]
      ) {
        continue;
      }

      const nextNode = {
        coord: [rNext, cNext],
        picoseconds: picoseconds + 1,
        path: [...path, `${rNext},${cNext}`],
      };

      queue.push(nextNode);
      visited[nextNode.coord.join('|')] = true;
    }
  }

  return allPaths;
};

const create20StepGrid = (start, gridSize) => {
  const markedCoords = [];
  const steps = 20;
  const createGrid = () => {
    const grid = [];
    for (let r = 0; r < gridSize; r++) {
      const row = [];
      for (let c = 0; c < gridSize; c++) {
        row.push('.');
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = createGrid();
  const newGrid = structuredClone(grid);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (r === start[0] && c === start[1]) continue;
      const path = findPathOrder(grid, [r, c], start);
      if (path.picoseconds <= steps) {
        // console.log('path', path.picoseconds);
        newGrid[r][c] = 'X';
        markedCoords.push({
          coord: [r - start[0], c - start[0]],
          pico: path.picoseconds,
        });
        // console.log('r, c', r, c);
        // console.log('x, y', [r - start[0], c - start[0]]);
      }
    }
  }

  // return newGrid;
  return markedCoords;

  /**
 * [
  '..................................................',
  '..................................................',
  '..................................................',
  '..................................................',
  '..................................................',
  '.........................X........................',
  '........................XXX.......................',
  '.......................XXXXX......................',
  '......................XXXXXXX.....................',
  '.....................XXXXXXXXX....................',
  '....................XXXXXXXXXXX...................',
  '...................XXXXXXXXXXXXX..................',
  '..................XXXXXXXXXXXXXXX.................',
  '.................XXXXXXXXXXXXXXXXX................',
  '................XXXXXXXXXXXXXXXXXXX...............',
  '...............XXXXXXXXXXXXXXXXXXXXX..............',
  '..............XXXXXXXXXXXXXXXXXXXXXXX.............',
  '.............XXXXXXXXXXXXXXXXXXXXXXXXX............',
  '............XXXXXXXXXXXXXXXXXXXXXXXXXXX...........',
  '...........XXXXXXXXXXXXXXXXXXXXXXXXXXXXX..........',
  '..........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.........',
  '.........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX........',
  '........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.......',
  '.......XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX......',
  '......XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.....',
  '.....XXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXX....',
  '......XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.....',
  '.......XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX......',
  '........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.......',
  '.........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX........',
  '..........XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.........',
  '...........XXXXXXXXXXXXXXXXXXXXXXXXXXXXX..........',
  '............XXXXXXXXXXXXXXXXXXXXXXXXXXX...........',
  '.............XXXXXXXXXXXXXXXXXXXXXXXXX............',
  '..............XXXXXXXXXXXXXXXXXXXXXXX.............',
  '...............XXXXXXXXXXXXXXXXXXXXX..............',
  '................XXXXXXXXXXXXXXXXXXX...............',
  '.................XXXXXXXXXXXXXXXXX................',
  '..................XXXXXXXXXXXXXXX.................',
  '...................XXXXXXXXXXXXX..................',
  '....................XXXXXXXXXXX...................',
  '.....................XXXXXXXXX....................',
  '......................XXXXXXX.....................',
  '.......................XXXXX......................',
  '........................XXX.......................',
  '.........................X........................',
  '..................................................',
  '..................................................',
  '..................................................',
  '..................................................'
]

 */
};

const partTwo3 = (racetrack, save) => {
  let cheatCount = 0;
  const start = findCoord('S', racetrack);
  const end = findCoord('E', racetrack);
  const pathOrder = findPathOrder(racetrack, start, end).path;
  const allCheats = create20StepGrid([25, 25], 50);
  // console.log('pathOrder', pathOrder);

  const modRacetrack = structuredClone(racetrack);

  // mark each path by pico count
  pathOrder.forEach((coord, indx) => {
    const [r, c] = coord.split(',');
    modRacetrack[Number(r)][Number(c)] = indx;
  });

  pathOrder.forEach((coord) => {
    console.log('computing...:', coord);
    const [r, c] = coord.split(',');
    const currPico = modRacetrack[r][c];
    for (let i = 0; i < allCheats.length; i++) {
      const { coord: cheatCoord, pico: cheatPico } = allCheats[i];

      const [rInc, cInc] = cheatCoord;
      const rNext = Number(r) + rInc;
      const cNext = Number(c) + cInc;

      if (
        rNext < 0 ||
        cNext < 0 ||
        rNext > modRacetrack.length - 1 ||
        cNext > modRacetrack[0].length - 1 ||
        modRacetrack[rNext][cNext] === '#'
      )
        continue;

      const nextPico = modRacetrack[rNext][cNext];

      if (nextPico - currPico - cheatPico >= save) {
        cheatCount++;
      }
    }
  });

  return cheatCount;

  // console.log(modRacetrack);
};

// const partTwo2 = (racetrack, save) => {
//   const start = findCoord('S', racetrack);
//   const end = findCoord('E', racetrack);
//   const pathOrder = findPathOrder(racetrack, start, end).path;
//   const allCheats = {};

//   let cheatCount = 0;

//   // for (let startIndex = 0; startIndex < 1; startIndex++) {
//   const halfwaypoint = Math.ceil((pathOrder.length - save) / 2);
//   for (let startIndex = 0; startIndex < halfwaypoint; startIndex++) {
//     const [r1Start, c1Start] = pathOrder[startIndex]
//       .split(',')
//       .map((n) => Number(n));
//     console.log(
//       'computing startIndex of ...:',
//       [r1Start, c1Start],
//       '--- ',
//       startIndex,
//       'of ',
//       pathOrder.length - save
//     );

//     const start2Index = startIndex + halfwaypoint;
//     const [r2Start, c2Start] = pathOrder[start2Index]
//       .split(',')
//       .map((n) => Number(n));

//     console.log(
//       'computing start2Index of ...:',
//       [r2Start, c2Start],
//       '--- ',
//       start2Index,
//       'of ',
//       pathOrder.length - save
//     );

//     // for (
//     //   let endIndex = pathOrder.length - 1;
//     //   endIndex > startIndex + save;
//     //   endIndex--
//     // ) {
//     //   const [rEnd, cEnd] = pathOrder[endIndex].split(',').map((n) => Number(n));

//     const cheats1 = travelByPicoseconds(
//       racetrack,
//       [r1Start, c1Start],
//       20,
//       true
//     );
//     const cheats2 = travelByPicoseconds(
//       racetrack,
//       [r2Start, c2Start],
//       20,
//       true
//     );

//     [...cheats1, cheats2].forEach(({ coord, picoseconds }) => {
//       if (coord) {
//         const endIndex = pathOrder.findIndex((ele) => ele === coord.join(','));
//         if (endIndex - startIndex - picoseconds <= save) {
//           if (allCheats[pathOrder[startIndex]]) {
//             allCheats[pathOrder[startIndex]].add(coord.join(','));
//           } else {
//             allCheats[pathOrder[startIndex]] = new Set();
//             allCheats[pathOrder[startIndex]].add(coord.join(','));
//           }
//         }
//       }
//     });

//     // console.log('allCheats', allCheats);
//     // }
//   }

//   Object.values(allCheats).forEach((val) => {
//     cheatCount += val.size;
//   });

//   return cheatCount;
// };

// const partTwo1 = (racetrack, savedNum) => {
//   const start = findCoord('S', racetrack);
//   // const end = findCoord('E', racetrack);
//   const pathOrder = findPathOrder(racetrack, start).path;
//   const maxPico = pathOrder.length - savedNum;

//   // const visited = {};
//   let cheatCount = 0;

//   // console.log('pathOrder', pathOrder);

//   const isCheatValid = (currPico, maxPico) => {
//     return (pos, cheatPico) => {
//       console.log('currPico', currPico);
//       console.log('maxPico', maxPico);
//       console.log('pos', pos);
//       console.log('cheatPico', cheatPico);
//       console.log('----');
//       const pathIndex = pathOrder.findIndex((ele) => ele === pos);
//       const remainingPath = pathOrder.slice(pathIndex);
//       const picoseconds = currPico + cheatPico + remainingPath.length;

//       if (picoseconds <= maxPico) {
//         return true;
//       }
//       return false;
//     };
//   };

//   const findCheatPath = (picoseconds, racetrack, pos, isValid) => {
//     let allCheats = {};
//     const [r, c] = pos;
//     const val = racetrack[r][c];

//     if ((val === '.' || val === 'E') && picoseconds !== 0) {
//       if (isValid(pos, picoseconds)) {
//         allCheats[`${pos}|${picoseconds}`] = true;
//         return allCheats;
//       } else {
//         return false;
//       }
//     }
//     if (picoseconds === 20) return false;

//     for (let i = 0; i < directions.length; i++) {
//       const cheatRaceTrack = structuredClone(racetrack);
//       const [rInc, cInc] = directions[i].coord;
//       const [rNext, cNext] = [r + rInc, c + cInc];

//       if (
//         rNext === 0 ||
//         rNext === racetrack.length - 1 ||
//         cNext === 0 ||
//         cNext === racetrack[0].length - 1
//       )
//         continue;

//       const nextVal = racetrack[rNext][cNext];
//       if (picoseconds === 0 && nextVal === '.') continue;
//       if (alphabet.includes(nextVal) || nextVal === 'S') continue;
//       if (nextVal === '#') {
//         cheatRaceTrack[rNext][cNext] = alphabet[picoseconds];
//       }

//       const newCheats = findCheatPath(
//         picoseconds + 1,
//         cheatRaceTrack,
//         [rNext, cNext],
//         isValid
//       );

//       if (newCheats) {
//         allCheats = { ...allCheats, ...newCheats };
//       }
//     }

//     return allCheats;
//   };

//   for (let i = 0; i < 1; i++) {
//     // for (let i = 0; i < pathOrder.length - savedNum; i++) {
//     const [r, c] = pathOrder[i].split(',').map((n) => Number(n));
//     console.log('computing position...:', [r, c]);
//     const cheatStart =
//       i <= pathOrder.length - savedNum - 20 ? 0 : i - 20 - savedNum;
//     const positions = findCheatPath(
//       cheatStart,
//       racetrack,
//       [r, c],
//       isCheatValid(i, maxPico)
//     );
//     const cheats = Object.keys(positions);
//     console.log('cheats', cheats);

//     // cheats.forEach((cheat) => {
//     //   const [coord, pico] = cheat.split('|');
//     //   if (isCheatValid(coord, i, Number(pico), maxPico)) {
//     //     cheatCount++;
//     //   }
//     // });
//     // console.log('...cheatCount:', cheatCount);
//   }

//   return cheatCount;
// };

// console.log('partOne', partOne(input, 100));
console.log('partTwo', partTwo3(input, picoSize));
