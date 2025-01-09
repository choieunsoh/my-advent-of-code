// Day 20: Infinite Elves and Infinite Houses
// https://adventofcode.com/2015/day/20

const utils = require('../../utils');

const inputTest = 33100000;

function getDivisors(n) {
  const smallDivisors = [];
  const largeDivisors = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      smallDivisors.push(i);
      if (n / i !== i) {
        largeDivisors.push(n / i);
      }
    }
  }
  return smallDivisors.concat(largeDivisors);
}

function part1(target) {
  let i = 0;
  while (true) {
    i++;
    const divisors = getDivisors(i);
    if (divisors.reduce((sum, d) => sum + d, 0) * 10 >= target) {
      return i;
    }
  }
}

function part2(target) {
  let i = 0;
  while (true) {
    i++;
    const divisors = getDivisors(i);
    if (divisors.reduce((sum, d) => sum + d, 0) * 10 >= target) {
      return i;
    }
  }
}

console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 776160
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 786240
console.timeEnd('Part 2');
