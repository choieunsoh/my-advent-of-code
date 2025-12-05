// Day 5: Cafeteria
// https://adventofcode.com/2025/day/5

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n\r\n').filter(Boolean);
}

function prepareData(input) {
  const ranges = input[0].split('\r\n').map((line) => line.split('-').map(Number));
  const targetIds = input[1].split('\r\n').map(Number);
  return { ranges, targetIds };
}

function mergeRanges(ranges) {
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [];
  for (const range of ranges) {
    if (merged.length === 0 || range[0] > merged[merged.length - 1][1] + 1) {
      merged.push(range);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]);
    }
  }
  return merged;
}

function part1(input) {
  const { ranges, targetIds } = prepareData(input);
  const mergedRanges = mergeRanges(ranges);
  let count = 0;
  for (const id of targetIds) {
    for (const [min, max] of mergedRanges) {
      if (id >= min && id <= max) {
        count++;
        break;
      }
    }
  }
  return count;
}

function part2(input) {
  const { ranges } = prepareData(input);
  const mergedRanges = mergeRanges(ranges);
  let count = 0;
  for (const [min, max] of mergedRanges) {
    count += max - min + 1;
  }
  return count;
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 3
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 828
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 14
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 352681648086146
console.timeEnd('Part 2');
