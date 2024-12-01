// Day 1: Historian Hysteria
// https://adventofcode.com/2024/day/1

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n');
};

var prepareInput = function (input) {
  const leftNumbers = [];
  const rightNumbers = [];
  for (const line of input) {
    const [left, right] = line.split(/\s+/);
    leftNumbers.push(Number(left));
    rightNumbers.push(Number(right));
  }
  return [leftNumbers, rightNumbers];
};

var part1 = function (input) {
  const [leftNumbers, rightNumbers] = prepareInput(input);
  leftNumbers.sort((a, b) => a - b);
  rightNumbers.sort((a, b) => a - b);

  let sumOfAbsDiff = 0;
  for (let i = 0; i < leftNumbers.length; i++) {
    sumOfAbsDiff += Math.abs(leftNumbers[i] - rightNumbers[i]);
  }
  return sumOfAbsDiff;
};

var part2 = function (input) {
  const [leftNumbers, rightNumbers] = prepareInput(input);
  const freqRightNumbers = new Map();
  for (const rightNumber of rightNumbers) {
    freqRightNumbers.set(rightNumber, (freqRightNumbers.get(rightNumber) ?? 0) + 1);
  }

  let similarityScore = 0;
  for (const leftNumber of leftNumbers) {
    const freqLeftNumber = freqRightNumbers.get(leftNumber) ?? 0;
    similarityScore += leftNumber * freqLeftNumber;
  }
  return similarityScore;
};

console.log(part1(readInput('Day01'))); // 11
console.log(part1(readInput('Day01_test'))); // 1941353

console.log(part2(readInput('Day01'))); // 31
console.log(part2(readInput('Day01_test'))); // 22539317
