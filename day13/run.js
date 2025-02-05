// https://adventofcode.com/2024/day/13
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day13/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n');

const sortMachines = (part) => {
  const machines = [];
  let buttons = [];
  let prize = {};
  input.forEach((v, i) => {
    if (v.indexOf('Button A') !== -1) {
      const movements = v.split('Button A: ')[1].split(', ');
      const x = Number(movements[0].slice(2));
      const y = Number(movements[1].slice(2));
      buttons.push({ x, y, type: 'a' });
    }
    if (v.indexOf('Button B') !== -1) {
      const movements = v.split('Button B: ')[1].split(', ');
      const x = Number(movements[0].slice(2));
      const y = Number(movements[1].slice(2));
      buttons.push({ x, y, type: 'b' });
    }
    if (v.indexOf('Prize') !== -1) {
      const movements = v.split('Prize: ')[1].split(', ');
      const x = Number(movements[0].slice(2));
      const y = Number(movements[1].slice(2));
      if (part === 2) {
        prize = { x: x + 10000000000000, y: y + 10000000000000 };
      } else {
        prize = { x, y };
      }
    }
    if (v === '' || i === input.length - 1) {
      machines.push({ buttons, prize });
      buttons = [];
      prize = {};
    }
  });

  return machines;
  // [
  // {
  //   buttons: [ { x: 94, y: 34, type: 'a' }, { x: 22, y: 67, type: 'b' } ],
  //   prize: { x: 8400, y: 5400 }
  // }
  // ]
};

const parsedInput = sortMachines();

const bfs = (start, end, buttons) => {
  const visited = {};
  const queue = [{ coord: start, count: { a: 0, b: 0 } }];

  visited[`${start.x}|${start.y}`] = true;

  while (queue.length) {
    const current = queue.shift();
    // console.log('current', current);
    const { coord, count } = current;

    for (let i = 0; i < buttons.length; i++) {
      const { x, y, type } = buttons[i];
      const nextX = coord.x + x;
      const nextY = coord.y + y;
      const nextCount = { ...count };
      nextCount[type] = count[type] + 1;

      // 1. check if out of bounds || if visited
      if (
        nextX > end.x ||
        nextY > end.y ||
        visited[`${nextX}|${nextY}`] === true
      )
        continue;
      // 2. check if end
      if (nextX === end.x && nextY === end.y) {
        // console.log('nextCount', nextCount);
        return nextCount;
      }
      // 3. add to queue
      queue.push({ coord: { x: nextX, y: nextY }, count: nextCount });
      visited[`${nextX}|${nextY}`] = true;
    }
  }

  return { a: 0, b: 0 };
};

const partOne = (machines) => {
  const tokenCost = {
    a: 3,
    b: 1,
  };
  let totalCost = 0;
  machines.forEach((machine, indx) => {
    console.log('...running machine:', indx + 1, machine);
    const { buttons, prize } = machine;
    // console.log('buttons', buttons);
    const tokenCount = bfs({ x: 0, y: 0 }, prize, buttons);

    const tokenA = tokenCost.a * tokenCount.a;
    const tokenB = tokenCost.b * tokenCount.b;

    totalCost += tokenA + tokenB;
  });

  return totalCost;
};

const parsedInput2 = sortMachines(2);

const sample = {
  buttons: [
    { x: 94, y: 34, type: 'a' },
    { x: 22, y: 67, type: 'b' },
  ],
  prize: { x: 8400, y: 5400 },
};

const partTwo = (machines) => {
  let tokens = 0;

  const findTokenCountByMath = (buttons, prize) => {
    const [a, b] = buttons;
    const tokenBCount =
      (prize.y * a.x - prize.x * a.y) / (-a.y * b.x + b.y * a.x);

    const tokenACount = (prize.x - b.x * tokenBCount) / a.x;
    console.log('prize', prize);
    console.log('tokenACount', tokenACount);
    console.log('tokenBCount', tokenBCount);
    console.log('---');

    if (Number.isInteger(tokenACount) && Number.isInteger(tokenBCount)) {
      return { a: tokenACount, b: tokenBCount };
    }

    return { a: 0, b: 0 };
  };

  machines.forEach((machine) => {
    const { a, b } = findTokenCountByMath(machine.buttons, machine.prize);
    tokens += a * 3 + b;
  });

  return tokens;
};

// console.log('input', sortMachines());
// console.log('part one', partOne(parsedInput)); //9:44am
console.log('part two', partTwo(parsedInput2)); //12:09pm
// console.log(
//   'bfs',
//   bfs({ x: 0, y: 0 }, sample.prize, [
//     { x: sample.A.x, y: sample.A.y, type: 'a' },
//     { x: sample.B.x, y: sample.B.y, type: 'b' },
//   ])
// );
