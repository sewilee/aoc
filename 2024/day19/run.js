// https://adventofcode.com/2024/day/19
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day19/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const towels = input[0].split(', ');
const patterns = input.slice(2);

// const sortTowelsByLength = (towels) => {
//   const sorted = {};
//   towels.forEach((towel) => {
//     const len = towel.length;
//     if (sorted[len]) {
//       const newList = [...sorted[len], towel];
//       sorted[len] = newList;
//     } else {
//       sorted[len] = [towel];
//     }
//   });

//   return sorted;
// };

// const findLargestTowelLength = (sortedTowels) => {
//   const lengths = Object.keys(sortedTowels);
//   let largest = 0;
//   lengths.forEach((num) => {
//     if (num > largest) {
//       largest = num;
//     }
//   });

//   return largest;
// };

// const isPatternPossible = (pattern, towels, maxLength, combinedVisited) => {
//   const visited = combinedVisited;
//   const startNode = { curr: pattern, prev: '' };
//   const queue = [startNode];

//   while (queue.length > 0) {
//     // console.log('qu', queue);
//     const { curr, prev } = queue.shift();
//     if (visited[curr] || curr.length === 0) {
//       return { visited, isPossible: true };
//     }

//     for (let i = maxLength; i > 0; i--) {
//       if (curr.length < i) continue;
//       const patSnip = curr.slice(0, i);
//       if (towels[i].includes(patSnip)) {
//         const nextNode = {
//           curr: curr.slice(i),
//           prev: `${prev}${patSnip}`,
//         };
//         if (queue[0] && nextNode.curr.length < queue[0].curr.length) {
//           queue.unshift(nextNode);
//         } else {
//           queue.push(nextNode);
//         }
//         visited[`${prev}${patSnip}`] = true;
//       }
//     }
//   }

//   return { visited, isPossible: false };
// };

// const partOne = () => {
//   const possible = [];
//   const impossible = [];
//   let combinedVisited = {};

//   // const sortedTowels = sortUniqueTowelsByLength(towels);
//   const sortedTowels = sortTowelsByLength(towels);
//   const maxLengthTowel = findLargestTowelLength(sortedTowels);
//   // console.log('sortedTowels', sortedTowels);
//   patterns.forEach((pattern, idx) => {
//     // console.log('computing:', idx, '---', pattern);
//     const { visited, isPossible } = isPatternPossible(
//       pattern,
//       sortedTowels,
//       maxLengthTowel,
//       combinedVisited
//     );

//     if (isPossible) {
//       possible.push(pattern);
//     } else {
//       impossible.push(pattern);
//     }

//     combinedVisited = visited;
//   });

//   // 248 is too low
//   // console.log('impossible', impossible);
//   // console.log('combinedVisited', combinedVisited);

//   return possible;
// };

const partOne = () => {
  let count = 0;

  const comboCounter = (pattern, towelPatterns) => {
    if (pattern === '') {
      return true;
    }
    const possibleTowels = towelPatterns.filter((p) => pattern.startsWith(p));
    const isPossible = possibleTowels.some((towel) => {
      const newPattern = pattern.slice(towel.length);
      return comboCounter(newPattern, towelPatterns);
    });
    return isPossible;
  };

  patterns.forEach((p) => {
    if (comboCounter(p, towels)) {
      // console.log('p', p);
      count++;
    }
  });

  return count;
};

const comboCount = (pattern) => {
  const visited = new Map();
  visited.set('', 1);

  const comboCountRecur = (pattern, towelPatterns) => {
    let count = 0;
    if (visited.has(pattern)) {
      return visited.get(pattern);
    }
    const possibleTowels = towelPatterns.filter((p) => pattern.startsWith(p));
    for (let i = 0; i < possibleTowels.length; i++) {
      const towel = possibleTowels[i];
      const newPattern = pattern.slice(towel.length);
      const newCount = comboCountRecur(newPattern, towelPatterns);
      count += newCount;
    }
    visited.set(pattern, count);
    return count;
  };

  return comboCountRecur(pattern, towels);
};

const partTwo = () => {
  const combinations = {};
  patterns.forEach((p) => {
    const count = comboCount(p);
    combinations[p] = count;
  });

  console.log('combinations', combinations);

  return Object.values(combinations).reduce((acc, val) => {
    return acc + val;
  }, 0);
};

console.log('partOne', partOne());
// console.log('partTwo', partTwo());
// console.log('towelsByeLength', towelsByLength);
