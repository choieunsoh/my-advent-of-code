// Day 12: JSAbacusFramework.io
// https://adventofcode.com/2015/day/12

const utils = require('../../utils');

const day = 12;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function part1(input) {
  const nums = (input.match(/-?\d+/g) ?? []).map(Number);
  return nums.reduce((sum, num) => sum + num, 0);
}

function part2(input) {
  const obj = JSON.parse(input);
  return sumExcludeRed(obj);

  function sumExcludeRed(obj) {
    if (Array.isArray(obj)) {
      return obj.reduce((acc, val) => acc + sumExcludeRed(val), 0);
    }

    if (typeof obj === 'object') {
      if (Object.values(obj).includes('red')) {
        return 0;
      }
      return Object.values(obj).reduce((acc, val) => acc + sumExcludeRed(val), 0);
    }

    if (typeof obj === 'number') {
      return obj;
    }

    return 0;
  }
}

console.log('Part 1:', part1(input)); // 18
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 191164
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 18
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 87842
console.timeEnd('Part 2');
