const fs = require('fs');

const args = process.argv.slice(1);

const filePath = args[0].split('/')[6];
const txtFile = args[1];
const part = args[2];

const input = fs
  .readFileSync(`${filePath}/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(' '));

const partOne = (input) => {
  console.log('inside part 1');
};
const partTwo = (input) => {
  console.log('inside part 2');
};

const build = () => {
  if (part === 'part1') console.log('part one', partOne(input));
  if (part === 'part2') console.log('part two', partTwo(input));
};

build();
