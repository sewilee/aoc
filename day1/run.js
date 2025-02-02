// https://adventofcode.com/2024/day/1
const fs = require('fs');

// Read from input txt
const input = fs
  .readFileSync('day1/input.txt', 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split('   '));

const list1 = input.map(([x, _]) => x);
const list2 = input.map(([_, y]) => y);

// 1. sort each list from lowest to highest
// 2. store the difference of each pair from lowest to highest. no negs
// 3. add up all the differences and return sum

const partOne = (list1, list2) => {
  const sortedList1 = list1.sort((a, b) => a - b);
  const sortedList2 = list2.sort((a, b) => a - b);

  const distanceSum = sortedList1.reduce((av, cv, ci) => {
    if (typeof sortedList2[ci] !== undefined) {
      const distance = Math.abs(cv - sortedList2[ci]);
      return av + distance;
    }
    return av + cv;
  }, 0);

  return distanceSum;
};

const partTwo = (list1, list2) => {
  return list1.reduce((acc, num) => {
    const simCount = list2.join(' ').split(num).length - 1;
    return acc + num * simCount;
  }, 0);
};

console.log('partOne', partOne(list1, list2));
console.log('partTwo', partTwo(list1, list2));
