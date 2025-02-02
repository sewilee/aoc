// https://adventofcode.com/2024/day/xx
const fs = require('fs');

const txtFile = 'sample';

const input = fs
  .readFileSync(`dayxx/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(' '));
