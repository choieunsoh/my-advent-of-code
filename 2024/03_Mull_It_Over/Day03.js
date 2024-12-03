// Day 3: Mull It Over
// https://adventofcode.com/2024/day/3

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n').filter(Boolean);
};

function part1(input) {
  const data = input.join('');
  const regex = /mul\((\d+),(\d+)\)/g;
  let match;
  let totalSum = 0;
  while ((match = regex.exec(data)) !== null) {
    const num1 = Number(match[1]);
    const num2 = Number(match[2]);
    const product = num1 * num2;
    totalSum += product;
  }
  return totalSum;
}

function part2(input) {
  const data = input.join('');
  const regex = /(do\(\)|don't\(\)|mul\((\d+),(\d+)\))/g;
  let match;
  let totalSum = 0;
  let doMul = 1;
  while ((match = regex.exec(data)) !== null) {
    if (match[0].startsWith('do')) {
      doMul = match[0] === "don't()" ? 0 : 1;
      continue;
    }
    const num1 = Number(match[2]);
    const num2 = Number(match[3]);
    const product = doMul * num1 * num2;
    totalSum += product;
  }
  return totalSum;
}

console.log(part1(readInput('Day03'))); // 161
console.log(part1(readInput('Day03_test'))); // 155955228

console.log(part2(readInput('Day03_part2'))); // 48
console.log(part2(readInput('Day03_test'))); // 100189366
