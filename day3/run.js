// https://adventofcode.com/2024/day/3
const fs = require('fs');

const txtFile = 'input';

const input = fs.readFileSync(`day3/${txtFile}.txt`, 'utf8').toString().trim();

const mul = (x, y) => x * y;

const partOne = (instructions) => {
  const unscrambledData = [];

  let startIndex = 0;
  // minimum length left needs to be at least 8 for "mul(x,y)"
  const length = instructions.length - 'mul(x,y)'.length;

  while (startIndex < length) {
    // Get start and end index of instructions
    startIndex = instructions.indexOf('mul(', startIndex);

    // if "mul(" doesn't exist
    if (startIndex === -1) break;

    const endIndex = instructions.indexOf(')', startIndex);

    // Narrow out only the "numbers"
    const potentialNums = instructions
      .slice(startIndex + 4, endIndex)
      .split(',');

    // Check if they are numbers
    if (potentialNums.every((num) => Number(num))) {
      unscrambledData.push(potentialNums);
      startIndex = endIndex;
    } else {
      startIndex++;
    }
  }

  return unscrambledData.reduce((a, [x, y]) => a + mul(x, y), 0);
};

const partTwo = (instructions) => {
  // split instructions to "don't"
  const dontList = instructions.split("don't()");

  // instructions before the first don't is enabled
  const enabledInstructions = [dontList.shift()];

  // loop thru dontList to find any index of do() instructions and add it to the enabledInstructions
  dontList.forEach((rules) => {
    const doIndex = rules.indexOf('do()');
    if (doIndex !== -1) {
      enabledInstructions.push(rules.slice(doIndex));
    }
  });

  return enabledInstructions.reduce(
    (a, enabledRules) => a + partOne(enabledRules),
    0
  );
};

console.log('Part One', partOne(input));
console.log('Part Two', partTwo(input));
