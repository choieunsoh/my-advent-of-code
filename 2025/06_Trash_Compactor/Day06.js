// Day 6: Trash Compactor
// https://adventofcode.com/2025/day/6

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n').filter(Boolean);
}

function preparePart1Data(input) {
  const operatorLine = input[input.length - 1];
  const grid = input.slice(0, -1).map((line) => line.trim().split(/\s+/).map(Number));
  const operators = operatorLine.trim().split(/\s+/);
  return { grid, operators };
}

function preparePart2Data(input) {
  return input.map((line) => [...line.split(''), ' ']);
}

function part1(input) {
  const { grid, operators } = preparePart1Data(input);

  let total = 0;
  const rows = grid.length;
  const cols = grid[0].length;
  for (let col = 0; col < cols; col++) {
    const operator = operators[col];
    let sum = operator === '+' ? 0 : 1;
    for (let row = 0; row < rows; row++) {
      const num = grid[row][col];
      if (operator === '+') {
        sum += num;
      } else {
        sum *= num;
      }
    }
    total += sum;
  }
  return total;
}

function part2(input) {
  const grid = preparePart2Data(input);
  const rows = grid.length;
  const cols = grid[0].length;

  let total = 0;
  let operator = '';
  const nums = [];
  for (let col = 0; col < cols; col++) {
    if (grid[rows - 1][col] !== ' ') {
      operator = grid[rows - 1][col];
    }

    let num = 0;
    for (let row = 0; row < rows - 1; row++) {
      if (grid[row][col] !== ' ') {
        num = num * 10 + Number(grid[row][col]);
      }
    }

    if (num === 0) {
      if (operator === '+') {
        total += nums.reduce((a, b) => a + b, 0);
      } else {
        total += nums.reduce((a, b) => a * b, 1);
      }
      nums.length = 0;
    } else {
      nums.push(num);
    }
  }
  return total;
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 4277556
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 5552221122013
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 3263827
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 11371597126232
console.timeEnd('Part 2');
