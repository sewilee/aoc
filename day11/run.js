// https://adventofcode.com/2024/day/11
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day11/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split(' ')
  .map(Number);

const partOne = (input, blinks) => {
  // 2:26pm - 2:59pm
  // all stones are in a straight line, order is preserved
  let stones = input;
  let blinkCount = 0;

  while (blinkCount < blinks) {
    blinkCount++;
    const newStones = [];

    for (let i = 0; i < stones.length; i++) {
      const stoneNum = stones[i];
      // if 0 => 1
      if (stoneNum === 0) {
        newStones.push(1);
        continue;
      }
      // if even digits => (2) stones, ex: 12 => [1, 2], remove leading zeros ex: 1000 => [10, 0]
      if (stoneNum.toString().length % 2 === 0) {
        const midIndex = Math.floor(stoneNum.toString().length / 2);
        const leftNum = Number(stoneNum.toString().slice(0, midIndex));
        const rightNum = Number(stoneNum.toString().slice(midIndex));
        newStones.push(leftNum);
        newStones.push(rightNum);
        continue;
      }

      // if none of rules above apply, new stone === num * 2024
      newStones.push(stoneNum * 2024);
    }
    // console.log('newStones', newStones, blinkCount);
    stones = newStones;
  }

  return stones.length;
};

const COUNT_AND_BLINK_CACHE = {};

const partTwo = (stones, blinks) => {
  // 3:00 - 6:34
  let count = 0;
  stones.forEach((stone) => {
    const cachedResult = COUNT_AND_BLINK_CACHE[stone + '|' + blinks];
    if (cachedResult != null) {
      count += cachedResult;
      return;
    }

    if (blinks < 1) {
      count++;
      return;
    }

    const newStones = [];
    if (stone === 0) {
      newStones.push(1);
    } else if (stone.toString().length % 2 === 0) {
      const midIndex = Math.floor(stone.toString().length / 2);
      const leftNum = Number(stone.toString().slice(0, midIndex));
      const rightNum = Number(stone.toString().slice(midIndex));
      newStones.push(leftNum);
      newStones.push(rightNum);
    } else {
      newStones.push(stone * 2024);
    }
    const newCount = partTwo(newStones, blinks - 1);
    COUNT_AND_BLINK_CACHE[stone + '|' + blinks] = newCount;
    count += newCount;
  });

  return count;
};

// console.log('input', input);
// console.log('Part One', partOne(input, 25));
console.log('Part Two', partTwo(input, 75));
