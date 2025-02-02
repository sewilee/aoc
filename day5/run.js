// https://adventofcode.com/2024/day/5
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day5/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const pageOrderingRules = input.slice(0, input.indexOf('')).map((rule) => {
  const splitList = rule.split('|');
  return [splitList[0], splitList[1]];
});

const pageUpdate = input
  .slice(input.indexOf('') + 1)
  .map((update) => update.split(','));

const sortPrintRules = (rules) => {
  const sortedRules = {};
  rules.forEach(([x, y]) => {
    if (sortedRules[x]) {
      sortedRules[x] = [...sortedRules[x], y];
    } else {
      sortedRules[x] = [y];
    }
  });

  return sortedRules;
};

const orderRules = sortPrintRules(pageOrderingRules);

const isPrintOrderCorrect = (prints, rules) => {
  for (let i = 0; i < prints.length; i++) {
    // [1, 2, 3, 4]
    const num = prints[i];
    if (rules[num]) {
      const numRules = rules[num];
      for (let ruleInx = 0; ruleInx < numRules.length; ruleInx++) {
        const afterNumInx = prints.indexOf(numRules[ruleInx]);
        if (afterNumInx !== -1 && afterNumInx < i) return false;
      }
    }
  }
  return true;
};

const partOne = (prints) => {
  const correctOrder = [];
  // [1, 2, 3, 4]
  prints.forEach((printOrder) => {
    if (isPrintOrderCorrect(printOrder, orderRules)) {
      correctOrder.push(printOrder);
    }
  });

  return correctOrder.reduce((acc, list) => {
    const midIndex = Math.floor(list.length / 2);
    return acc + Number(list[midIndex]);
  }, 0);
};

const sortIncorrectOrders = (printOrder, orderRules) => {
  const newPrintOrder = [];
  for (let i = 0; i < printOrder.length; i++) {
    const listOfRulesAfterNum = orderRules[printOrder[i]];

    if (listOfRulesAfterNum && newPrintOrder.length !== 0) {
      for (let j = 0; j < newPrintOrder.length; j++) {
        console.log('--newPrintOrder--', newPrintOrder);

        if (listOfRulesAfterNum.indexOf(newPrintOrder[j]) !== -1) {
          newPrintOrder.splice(j, 0, printOrder[i]);
          break;
        }
        if (j === newPrintOrder.length - 1) {
          newPrintOrder.push(printOrder[i]);
          break;
        }
      }
    } else {
      newPrintOrder.push(printOrder[i]);
    }
  }
  return newPrintOrder;
};

const partTwo = (prints) => {
  const incorrectOrderUpdates = prints.filter((order) => {
    return !isPrintOrderCorrect(order, orderRules);
  });

  const sortedOrder = incorrectOrderUpdates.map((order) =>
    sortIncorrectOrders(order, orderRules)
  );

  return sortedOrder.reduce((acc, list) => {
    const midIndex = Math.floor(list.length / 2);
    return acc + Number(list[midIndex]);
  }, 0);
};

console.log('Part One', partOne(pageUpdate));
console.log('Part Two', partTwo(pageUpdate));
