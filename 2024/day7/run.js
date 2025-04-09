// https://adventofcode.com/2024/day/7
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day7/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => {
    const [testValue, equationValues] = l.split(':');
    return [testValue, equationValues.trim().split(' ')];
  });

const combinations = (elements, length) => {
  let results = elements.map((v) => [v]); // [aa, ab, ba, bb]
  let l = 1;

  while (l < length) {
    const newResult = [];
    // console.log('newResult', newResult);
    for (let i = 0; i < results.length; i++) {
      // console.log('results[i]----', results[i]);
      for (let j = 0; j < elements.length; j++) {
        // console.log('elements[j]', elements[j]);
        newResult.push([...results[i], elements[j]]);
      }
    }
    results = newResult;
    l++;
  }

  return results;
};

const partOne = (testValues) => {
  const trueTestValues = [];

  testValues.forEach(([sum, eqNums]) => {
    if (eqNums.length === 1 && sum === eqNums[0]) {
      trueTestValues.push(sum);
    } else {
      const operatorOptions = combinations(['+', '*'], eqNums.length - 1);
      // console.log('operatorOptions', operatorOptions);
      for (let i = 0; i < operatorOptions.length; i++) {
        const equationOption = operatorOptions[i];
        // console.log(`${[sum, eqNums]}`, equationOption);
        const equationSum = eqNums.reduce((acc, val, indx) => {
          if (indx === 0) return Number(val);
          const operator = equationOption[indx - 1];
          switch (operator) {
            case '+':
              // console.log(`${acc}${operator}${val}`, Number(acc) + Number(val));
              return Number(acc) + Number(val);
            case '*':
              // console.log(`${acc}${operator}${val}`, Number(acc) * Number(val));
              return Number(acc) * Number(val);
            default:
              // console.log('defaulted');
              return Number(acc);
          }
        }, 0);

        if (Number(equationSum) === Number(sum)) {
          trueTestValues.push(Number(equationSum));
          break;
        }
      }
    }
  });
  // console.log('trueTestValues', trueTestValues);
  return trueTestValues.reduce((acc, val) => {
    return acc + val;
  }, 0);
};

const partTwo = (testValues) => {
  const trueTestValues = [];

  testValues.forEach(([sum, eqNums]) => {
    if (eqNums.length === 1 && sum === eqNums[0]) {
      trueTestValues.push(sum);
    } else {
      const operatorOptions = combinations(['+', '*', '||'], eqNums.length - 1);
      // console.log('operatorOptions', operatorOptions, eqNums.length - 1);
      for (let i = 0; i < operatorOptions.length; i++) {
        const equationOption = operatorOptions[i];
        // console.log(`${[sum, eqNums]}`, equationOption);
        const equationSum = eqNums.reduce((acc, val, indx) => {
          if (indx === 0) return Number(val);
          const operator = equationOption[indx - 1];
          switch (operator) {
            case '+':
              // console.log(`${acc}${operator}${val}`, Number(acc) + Number(val));
              return Number(acc) + Number(val);
            case '*':
              // console.log(`${acc}${operator}${val}`, Number(acc) * Number(val));
              return Number(acc) * Number(val);
            case '||':
              return Number(acc.toString() + val.toString());
            default:
              // console.log('defaulted');
              return Number(acc);
          }
        }, 0);

        if (Number(equationSum) === Number(sum)) {
          trueTestValues.push(Number(equationSum));
          break;
        }
      }
    }
  });
  // console.log('trueTestValues', trueTestValues);
  return trueTestValues.reduce((acc, val) => {
    return acc + val;
  }, 0);
};

console.log('Part One', partOne(input));
console.log('Part Two', partTwo(input));
// console.log('comb', combinations(['+', '*', '||'], 5));
