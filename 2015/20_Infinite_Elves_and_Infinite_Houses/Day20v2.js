// Day 20: Infinite Elves and Infinite Houses
// https://adventofcode.com/2015/day/20

const utils = require('../../utils');

const inputTest = 33100000;

function sumDeliveringPresents(houses, presents, maxHousePerElf = Infinity) {
  let sum = 0;
  const maxDivisor = Math.floor(Math.sqrt(houses)) + 1;
  for (let divisor = 1; divisor <= maxDivisor; divisor++) {
    if (houses % divisor === 0) {
      if (houses / divisor <= maxHousePerElf) sum += divisor;
      if (divisor <= maxHousePerElf) sum += houses / divisor;
    }
  }
  return sum * presents;
}

function part1(target) {
  let houses = 0;
  while (sumDeliveringPresents(houses, 10) < target) {
    houses++;
  }
  return houses;
}

function part2(target) {
  let houses = 0;
  while (sumDeliveringPresents(houses, 11, 50) < target) {
    houses++;
  }
  return houses;
}

console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 776160
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 786240
console.timeEnd('Part 2');
