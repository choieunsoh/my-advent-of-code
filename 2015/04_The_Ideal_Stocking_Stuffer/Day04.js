// Day 4: The Ideal Stocking Stuffer
// https://adventofcode.com/2015/day/4

const crypto = require('crypto');

const md5 = (plainText) => crypto.createHash('md5').update(plainText).digest('hex');

function part1(input) {
  let runningNumber = 0;
  while (!md5(`${input}${runningNumber}`).startsWith('00000')) {
    runningNumber++;
  }
  return runningNumber;
}

function part2(input) {
  let runningNumber = 0;
  while (!md5(`${input}${runningNumber}`).startsWith('000000')) {
    runningNumber++;
  }
  return runningNumber;
}

const input1 = 'abcdef';
const input2 = 'pqrstuv';
const inputTest = 'bgvyzdsv';

console.log('Part 1:', part1(input1)); // 609043
console.log('Part 1:', part1(input2)); // 1048970
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 254575
console.timeEnd('Part 1');

console.log('Part 2:', part2(input1)); // 6742839
console.log('Part 2:', part2(input2)); // 5714438
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 1038736
console.timeEnd('Part 2');
