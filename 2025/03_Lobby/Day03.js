// Day 3: Lobby
// https://adventofcode.com/2025/day/3

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8');
}

function prepareData(input) {
  return input.split('\r\n').filter(Boolean);
}

function part1(input) {
  let sumJoltage = 0;
  const banks = prepareData(input);
  for (const bank of banks) {
    const maxJoltage = findMaxJoltage(bank, 2);
    sumJoltage += Number(maxJoltage);
  }
  return sumJoltage;
}

function part2(input) {
  let sumJoltage = 0;
  const banks = prepareData(input);
  for (const bank of banks) {
    const maxJoltage = findMaxJoltage(bank, 12);
    sumJoltage += Number(maxJoltage);
  }
  return sumJoltage;
}

function findMaxJoltage(bank, k) {
  const stack = [];
  const n = bank.length;
  for (let i = 0; i < n; i++) {
    const digit = bank[i];
    while (stack.length > 0 && stack[stack.length - 1] < digit && stack.length + (n - i - 1) >= k) {
      stack.pop();
    }
    if (stack.length < k) {
      stack.push(digit);
    }
  }
  return stack.join('');
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 357
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 17324
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 3121910778619
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 31578210022
console.timeEnd('Part 2');
