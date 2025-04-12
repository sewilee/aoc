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
  .map((l) => l.split(''));

// const sampleInput = [
//   ['1', 'a', 'b', 'c', '2'],
//   ['p', 'q', 'r', '3', 's', 't', 'u', '8', 'v', 'w', 'x'],
//   ['a', '1', 'b', '2', 'c', '3', 'd', '4', 'e', '5', 'f'],
//   ['t', 'r', 'e', 'b', '7', 'u', 'c', 'h', 'e', 't'],
// ];

const dictionary = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const partOne = (input) => {
  console.log('Running Part One ...', `testing ${txtFile} file`);
  const onlyNums = input.map((line) => {
    return line.filter((val) => Number(val));
  });

  return onlyNums.reduce((a, line) => {
    const start = line[0];
    const end = line[line.length - 1];
    return a + Number(start + end);
  }, 0);
};
const partTwo = (input) => {
  console.log('Running Part Two ...', `testing ${txtFile} file`);
  const spelledOutNums = Object.keys(dictionary);

  const onlyNums = input.map((line) => {
    const nums = [];
    let lineString = line.join('');
    while (lineString.length > 0) {
      if (Number(lineString[0])) {
        nums.push(lineString[0]);
        lineString = lineString.slice(1);
        continue;
      }

      let num;
      const isSpelledNum = spelledOutNums.some((key) => {
        if (lineString.startsWith(key)) {
          num = key;
          return true;
        }
      });

      if (isSpelledNum) {
        nums.push(dictionary[num]);
        lineString = lineString.slice(num.length - 1);
        continue;
      }

      lineString = lineString.slice(1);
    }
    return nums;
  });

  return onlyNums.reduce((a, line) => {
    const start = line[0];
    const end = line[line.length - 1];
    return a + Number(start + end);
  }, 0);
};

const build = () => {
  if (part === 'part1') console.log('part one', partOne(input));
  if (part === 'part2') console.log('part two', partTwo(input));
};

build();
