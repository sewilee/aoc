// https://adventofcode.com/2024/day/17
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day17/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const parseInput = (input) => {
  const parsed = { registered: {}, program: [] };
  input.forEach((l) => {
    const splitLine = l.split(': ');
    switch (splitLine[0]) {
      case 'Register A':
        parsed.registered['A'] = Number(splitLine[1]);
        break;
      case 'Register B':
        parsed.registered['B'] = Number(splitLine[1]);
        break;
      case 'Register C':
        parsed.registered['C'] = Number(splitLine[1]);
        break;
      case 'Program':
        parsed.program = splitLine[1].split(',').map((s) => Number(s));
        break;
      default:
        break;
    }
  });
  return parsed;
};

const parsedInput = parseInput(input);

const runProgram = (registered, program) => {
  let instructionPointer = 0;
  const result = [];

  const adv0 = (combo) => {
    const result = Math.floor(registered.A / 2 ** combo);
    registered.A = result;
    // console.log('a:', result);
  };

  const bxl1 = (literal) => {
    const XOR = registered.B ^ literal;
    registered.B = XOR;
    // console.log('b:', XOR);
  };

  const bst2 = (combo) => {
    const result = combo % 8;
    registered.B = result;
    // console.log('b:', result);
  };

  const jnz3 = (literal) => {
    if (registered.A === 0) {
      instructionPointer += 2;
      return;
    }
    // jumps
    instructionPointer = literal;
  };

  const bxc4 = () => {
    const result = registered.B ^ registered.C;
    registered.B = result;
    // console.log('b:', result);
  };

  const out5 = (combo) => {
    // console.log('print', combo % 8);
    return combo % 8;
  };

  const bdv6 = (combo) => {
    const result = Math.floor(registered.A / 2 ** combo);
    registered.B = result;
    // console.log('b:', result);
  };

  const cdv7 = (combo) => {
    const result = Math.floor(registered.A / 2 ** combo);
    registered.C = result;
    // console.log('c:', result);
  };

  while (instructionPointer < program.length - 1) {
    const opcode = program[instructionPointer];
    const operands = program[instructionPointer + 1];

    const combo =
      operands === 4
        ? registered.A
        : operands === 5
        ? registered.B
        : operands === 6
        ? registered.C
        : operands;

    if (opcode !== 3) {
      if (opcode === 0) adv0(combo);
      if (opcode === 1) bxl1(operands);
      if (opcode === 2) bst2(combo);
      if (opcode === 4) bxc4();
      if (opcode === 5) {
        const val = out5(combo);
        result.push(val);
      }
      if (opcode === 6) bdv6(combo);
      if (opcode === 7) cdv7(combo);

      instructionPointer += 2;
    } else {
      jnz3(operands);
    }
  }

  return result;
};

const findDigitRange = (input) => {
  const { program } = input;
  const registered = { A: 0, B: 0, C: 0 };
  const resultLength = program.length;

  let maxDigit, minDigit;
  let digit = 1;
  let digitLength = runProgram({ ...registered, A: digit }, program).length;
  let maxDigitLength = resultLength;
  let minDigitLength = resultLength;

  while (resultLength !== digitLength) {
    digit = digit * 10;
    console.log('computing digit:', digit);
    const newRegistered = {
      ...input.registered,
      A: digit,
    };
    digitLength = runProgram(newRegistered, program).length;
  }

  if (resultLength === maxDigitLength) {
    maxDigit = digit;
    while (resultLength === maxDigitLength) {
      maxDigit = maxDigit + digit;
      console.log('computing maxDigit:', digit);
      const newRegistered = {
        ...input.registered,
        A: maxDigit,
      };
      maxDigitLength = runProgram(newRegistered, program).length;
    }
  }

  if (resultLength === minDigitLength) {
    minDigit = digit;
    while (resultLength === minDigitLength) {
      minDigit -= 10000000000000;
      console.log('computing minDigit:', minDigit);
      const newRegistered = {
        ...input.registered,
        A: minDigit,
      };
      const result = runProgram(newRegistered, program);
      if (result.join(',') === program.join(',')) {
        return minDigit;
      } else {
        minDigitLength = result.length;
      }
    }
  }

  return { maxDigit, minDigit };
};

const partOne = (input) => {
  const { registered, program } = input;

  const result = runProgram(structuredClone(registered), program);
  return result.join(',');
};

const testOctals = (program) => {
  const registered = { A: 0, B: 0, C: 0 };

  const start = 30000000000000;
  const end = 300000000000000;

  for (let i = start; i <= end; i += 100000000) {
    const newRegistered = structuredClone(registered);
    newRegistered.A = i;
    const output = runProgram(newRegistered, program);
    console.log('computing...', i);
    if (output === '2,4,1,5,7,5,1,6,0,3,4,0,5,5,3,0') {
      console.log('A:', i, 'output:', output);
    }
  }
};

// console.log('findDigitRange', findDigitRange(parsedInput));
console.log('testOctals', testOctals(parsedInput.program));

const partTwo = (input) => {};

// console.log('partOne', partOne(parsedInput));
// console.log('findDigitRange', findDigitRange(parsedInput));
// console.log('partTwo', partTwo(parsedInput));
