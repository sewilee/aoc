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
  .split('\n');

const parseInput = (input) => {
  const parsed = {};
  input.forEach((line) => {
    const maxCubesByColor = {};
    const gameAndBag = line.split(': ');
    const cubeList = gameAndBag[1].split('; ');
    const gameId = gameAndBag[0].split(' ')[1];

    cubeList.forEach((subset) => {
      const cubes = subset.split(', ');
      cubes.forEach((cube) => {
        const [num, color] = cube.split(' ');
        if (
          !maxCubesByColor[color] ||
          (maxCubesByColor[color] && maxCubesByColor[color] < Number(num))
        ) {
          maxCubesByColor[color] = Number(num);
        }
      });
    });

    parsed[gameId] = maxCubesByColor;
  });

  return parsed;
};

const partOne = (input, bag) => {
  console.log('Running Part One ...', `testing ${txtFile} file`);
  const games = parseInput(input);
  let count = 0;
  const bagColors = Object.keys(bag);

  for (const [key, val] of Object.entries(games)) {
    const isPossible = bagColors.every((color) => {
      return val[color] <= bag[color];
    });

    if (isPossible) {
      count += Number(key);
    }
  }

  return count;
};
const partTwo = (input) => {
  console.log('Running Part Two ...', `testing ${txtFile} file`);
  const games = parseInput(input);
  let sum = 0;

  Object.values(games).forEach((game) => {
    let power = 1;
    const cubes = Object.values(game);
    cubes.forEach((cube) => {
      power *= cube;
    });

    sum += power;
  });

  return sum;
};

const build = () => {
  if (part === 'part1')
    console.log('part one', partOne(input, { red: 12, green: 13, blue: 14 }));
  if (part === 'part2') console.log('part two', partTwo(input));
};

build();
