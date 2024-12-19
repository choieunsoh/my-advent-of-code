// Day 19: Linen Layout
// https://adventofcode.com/2024/day/19

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n\r\n');
}

function prepareData(input) {
  const towels = input[0].split(', ');
  const patterns = input[1].split('\r\n');
  return { towels, patterns };
}

function solve(pattern, towels) {
  const memo = new Map();
  return fn(pattern);

  function fn(pattern) {
    if (memo.has(pattern)) return memo.get(pattern);

    if (pattern === '') return 1;

    const count = towels
      .filter((towel) => pattern.startsWith(towel))
      .reduce((sum, towel) => sum + fn(pattern.slice(towel.length)), 0);

    memo.set(pattern, count);
    return count;
  }
}

function part1({ input, debug = false }) {
  const { towels, patterns } = prepareData(input);
  let count = 0;
  for (const pattern of patterns) {
    count += solve(pattern, towels) > 0 ? 1 : 0;
  }
  return count;
}

function part2({ input, debug = false }) {
  const { towels, patterns } = prepareData(input);
  let count = 0;
  for (const pattern of patterns) {
    count += solve(pattern, towels);
  }
  return count;
}

const filename = 'Day19';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 6
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 304
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 16
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 705756472327497
console.timeEnd('Part 2');
