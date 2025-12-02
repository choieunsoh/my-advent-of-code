// Day 2: Gift Shop
// https://adventofcode.com/2025/day/2

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8');
}

function prepareData(input) {
  return input.split(',').map((range) => range.split('-').map(Number));
}

function part1(input) {
  let sum = 0n;
  const ranges = prepareData(input);
  const invalidNums = [];
  for (const [start, end] of ranges) {
    const digits = Math.ceil(Math.log10(end));
    const startDigits = digits >> 1;
    const endDigits = digits - startDigits;
    const startNum = (start / 10 ** endDigits) | 0;
    const endNum = 10 ** startDigits;
    const lower = BigInt(start);
    const upper = BigInt(end);

    for (let num = startNum; num <= endNum; num++) {
      const invalidNum = BigInt(`${num}${num}`);
      if (invalidNum < lower) continue;
      if (invalidNum > upper) break;

      sum += invalidNum;
      invalidNums.push(invalidNum);
    }
  }

  return sum;
}

function part2(input) {
  let sum = 0n;
  const ranges = prepareData(input);
  const invalidNums = [];
  for (const [start, end] of ranges) {
    const seen = new Set();
    const endStr = end.toString();
    const maxLen = endStr.length;
    const lower = BigInt(start);
    const upper = BigInt(end);

    for (let len = 1; len <= 5; len++) {
      const maxRepeat = (maxLen / len) | 0;
      const maxNum = Number('9'.repeat(len));
      for (let num = 1; num <= maxNum; num++) {
        for (let repeat = 2; repeat <= maxRepeat; repeat++) {
          const str = num.toString().repeat(repeat);
          const candidate = BigInt(str);
          if (candidate > upper) break;
          if (candidate < lower) continue;
          if (seen.has(candidate)) continue;

          invalidNums.push(candidate);
          seen.add(candidate);
          sum += candidate;
        }
      }
    }
  }

  return sum;
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 1227775554
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 28846518423
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 4174379265
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 31578210022
console.timeEnd('Part 2');
