// Day 1: Not Quite Lisp
// https://adventofcode.com/2015/day/1

const utils = require('../../utils');

function countChar(str, char) {
  return str.split(char).length - 1;
}

function part1(input) {
  return countChar(input, '(') - countChar(input, ')');
}

function part2(input) {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    floor += input[i] === '(' ? 1 : -1;
    if (floor === -1) {
      return i + 1;
    }
  }
  return -1;
}

const day = 1;
const input = utils.readInputByDay(day);
const input2 = utils.readInputByDay(day, '_2');
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input)); // -3
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 138
console.timeEnd('Part 1');

console.log('Part 2:', part2(input2)); // 5
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 1771
console.timeEnd('Part 2');
