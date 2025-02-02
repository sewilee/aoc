// https://adventofcode.com/2024/day/8
const fs = require('fs');

const txtFile = 'input';

const input = fs.readFileSync(`day9/${txtFile}.txt`, 'utf8').toString().trim();

const convertDiskmap = (diskmap) => {
  let individualBlocks = [];

  for (let i = 0; i < input.length; i++) {
    const blockLength = Number(input[i]);
    const isFile = i % 2 === 0;
    if (isFile) {
      const fileIndex = i / 2;
      const fileBlock = new Array(blockLength).fill(fileIndex);
      individualBlocks = individualBlocks.concat(fileBlock);
    } else {
      const freeblock = new Array(blockLength).fill('.');
      individualBlocks = individualBlocks.concat(freeblock);
    }
  }
  return individualBlocks;
};

const partOne = (input) => {
  // length of file and length of free space
  // example: 12345, 1 file, 2 free space, 3 file, 4 free space, 5 file
  // example: 90909, 9 file, 0 free space, 9 file, 0 free space, 9 file
  // Part One 8:37 am - 9:27am
  // 1. convert diskmap to individualBlocks, 12345 => 0..111....22222
  let individualBlocks = convertDiskmap(input);

  // console.log('individualBlocks', individualBlocks);

  // 2. move file blocks one at a time from most right to the next free space at the most left,
  // example: 0..111....22222 => 02.111....2222. until it is => 022111222......
  for (let i = individualBlocks.length - 1; i >= 0; i--) {
    const fileBlock = individualBlocks[i];
    const freeBlockIdx = individualBlocks.indexOf('.');

    if (fileBlock === '.') continue;
    if (freeBlockIdx > i) break;

    individualBlocks[freeBlockIdx] = fileBlock;
    individualBlocks[i] = '.';
  }
  // console.log('individualBlocks', individualBlocks);

  // 3. checksum: multiple index and val, skip ".", example: "022111222......", index is 0, fileId is 0. 0 * 0 = 0. add all.
  let checkSum = 0;

  for (let i = 0; i < individualBlocks.length; i++) {
    const val = individualBlocks[i];
    if (val === '.') break;
    const sum = i * val;
    checkSum = checkSum + sum;
  }

  return checkSum;
};

// part two below ------

// const findIndexOfFreeEndIdx = (block, start) => {
//   if (start === 5) {
//     console.log('block', block);
//   }
//   for (i = start; i < block.length; i++) {
//     if (block[i] !== '.') return i - 1;
//   }

//   return i;
// };

// const searchForFreeSpace = (block, spaceNeeded) => {
//   // return start Index if space found
//   let freeStartIdx = block.indexOf('.');
//   if (freeStartIdx === -1) return -1;

//   while (freeStartIdx < block.length) {
//     let freeEndIdx = findIndexOfFreeEndIdx(block, freeStartIdx);
//     let freeBlock = block.slice(freeStartIdx);
//     if (freeEndIdx !== -1) {
//       freeBlock = block.slice(freeStartIdx, freeEndIdx + 1);
//     }
//     if (freeBlock.length >= spaceNeeded) {
//       return [freeStartIdx, freeEndIdx];
//     } else {
//       freeStartIdx = freeEndIdx + 2;
//     }
//   }

//   return -1;
// };

// const moveBlocks = (
//   block,
//   [startFileBlock, endFileBlock],
//   [startFreeBlock, endFreeBlock]
// ) => {
//   // console.log('block', block);

//   const fileBlock = block.slice(startFileBlock, endFileBlock + 1);
//   // console.log('fileBlock', fileBlock);
//   const freeblock = block.slice(startFreeBlock, endFreeBlock + 1);

//   const newFileBlock = fileBlock.concat(freeblock.slice(fileBlock.length));
//   const newFreeBlock = Array(fileBlock.length).fill('.');

//   // console.log('fileBlock', fileBlock);
//   // console.log('newFileBlock', newFileBlock);
//   // console.log('newFreeBlock', newFreeBlock);

//   const newBlock = block
//     .slice(0, startFreeBlock)
//     .concat(newFileBlock)
//     .concat(block.slice(endFreeBlock + 1, startFileBlock))
//     .concat(newFreeBlock)
//     .concat(block.slice(endFileBlock + 1));

//   // console.log('newblock', newBlock);
//   return newBlock;
// };

const groupIndividualBlocks = (blocks) => {
  const groupedBlocks = [];
  let newGroup = [];

  blocks.forEach((v, idx) => {
    if (idx !== 0 && newGroup[0] !== v) {
      groupedBlocks.push(newGroup);
      newGroup = [];
    }

    newGroup.push(v);

    if (idx === blocks.length - 1) {
      groupedBlocks.push(newGroup);
    }
  });

  return groupedBlocks;
};

// const partTwo = (input) => {
//   // 9:33am - 2:20pm
//   // 1. convert to individualBlocks
//   let individualBlocks = convertDiskmap(input);

//   // 2. move whole file blocks from the most right to the next free space starting from the most left
//   let fileId = Math.floor(input.length / 2);
//   while (fileId >= 0) {
//     console.log(`Computing fileId: ${fileId}`);
//     // 2A. FIND FILE BLOCK
//     const startIdxFile = individualBlocks.indexOf(fileId);
//     const endIdxFile = individualBlocks.lastIndexOf(fileId);
//     const fileBlock = individualBlocks.slice(startIdxFile, endIdxFile + 1);

//     // 2B. FIND FREE BLOCK
//     const freeSpace = searchForFreeSpace(individualBlocks, fileBlock.length);
//     // check if free space exist and the location of space is earlier than current space
//     if (freeSpace === -1 || freeSpace[0] > startIdxFile) {
//       fileId--;
//       continue;
//     } else {
//       individualBlocks = moveBlocks(
//         individualBlocks,
//         [startIdxFile, endIdxFile],
//         freeSpace
//       );
//       fileId--;
//       // console.log('individualBlocks', individualBlocks);
//     }
//   }

//   let checkSum = 0;
//   for (let i = 0; i < individualBlocks.length; i++) {
//     const val = individualBlocks[i];
//     if (val === '.') continue;
//     checkSum = checkSum + val * i;
//   }

//   return checkSum;
// };

const partTwo = () => {
  // 2:20 - 4:30
  // 1. convert to individualBlocks
  let individualBlocks = convertDiskmap(input);
  let groupedBlocks = groupIndividualBlocks(individualBlocks); // [0, 0, 0], [., ., .]

  // 2. move whole file blocks from the most right to the next free space starting from the most left
  let seenFileId;
  let i = groupedBlocks.length - 1;
  while (i > 0) {
    const fileBlock = groupedBlocks[i];
    const fileId = groupedBlocks[i][0];
    if (fileId === '.' || seenFileId <= fileId) {
      i--;
      continue;
    }
    seenFileId = fileId;
    console.log('Computing fileId:', fileId);
    for (let j = 0; j < groupedBlocks.length; j++) {
      const freeBlock = groupedBlocks[j];

      if (j >= i) {
        i--;
        break;
      }

      if (freeBlock[0] !== '.') continue;
      if (freeBlock.length < fileBlock.length) continue;

      const newFreeBlock = Array(fileBlock.length).fill('.');
      const newFileBlock = [
        fileBlock,
        Array(freeBlock.length - fileBlock.length).fill('.'),
      ].filter((arr) => arr.length !== 0);

      groupedBlocks[i] = newFreeBlock;
      groupedBlocks = [
        ...groupedBlocks.slice(0, j),
        ...newFileBlock,
        ...groupedBlocks.slice(j + 1),
      ];

      // if free space is larger than file space, length is increased.
      if (newFileBlock.length === 1) i--;
      break;
    }
  }

  groupedBlocks = groupedBlocks.flat();

  let checkSum = 0;
  for (let i = 0; i < groupedBlocks.length; i++) {
    const val = groupedBlocks[i];
    if (val === '.') continue;
    checkSum = checkSum + val * i;
  }

  return checkSum;
};

// console.log('Part One', partOne(input));
console.log('Part Two', partTwo(input));
