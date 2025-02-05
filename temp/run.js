// https://adventofcode.com/2024/day/13
const fs = require('fs');

const txtFile = 'sample';

const input = fs
  .readFileSync(`day13/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(' '));
