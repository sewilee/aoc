const fs = require('fs');

const args = process.argv.slice(1);

const filePaths = args[0].split('/');
const filePath = `${filePaths[6]}/${filePaths[7]}`;
const txtFile = args.includes('input') ? 'input' : 'sample';
const part = args.includes('part2') ? 'part2' : 'part1';

const input = fs
  .readFileSync(`${filePath}/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(' '));

const partOne = (input) => {
  console.log('Running Part One ...', `testing ${txtFile} file`);
};
const partTwo = (input) => {
  console.log('Running Part Two ...', `testing ${txtFile} file`);
};

const build = () => {
  if (part === 'part1') console.log('part one', partOne(input));
  if (part === 'part2') console.log('part two', partTwo(input));
};

build();
