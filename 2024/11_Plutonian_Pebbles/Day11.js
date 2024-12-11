// Day 11: Plutonian Pebbles
// https://adventofcode.com/2024/day/11

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split(' ').map(Number);
}

const memo = new Map();

function countStones(num, blinks) {
  const key = `${num},${blinks}`;
  if (memo.has(key)) {
    return memo.get(key);
  }

  let stones = 0;
  if (blinks === 0) {
    stones = 1;
  } else if (num === 0) {
    stones = countStones(1, blinks - 1);
  } else {
    const numStr = num.toString();
    const len = numStr.length;
    if (len & 1) {
      stones = countStones(2024 * num, blinks - 1);
    } else {
      const half = len >> 1;
      const leftNum = Number(numStr.slice(0, half));
      const rightNum = Number(numStr.slice(half));
      const leftStones = countStones(leftNum, blinks - 1);
      const rightStones = countStones(rightNum, blinks - 1);
      stones = leftStones + rightStones;
    }
  }

  memo.set(key, stones);
  return stones;
}

function part1(nums) {
  return nums.reduce((totalStones, num) => totalStones + countStones(num, 25), 0);
}

function part2(nums) {
  return nums.reduce((totalStones, num) => totalStones + countStones(num, 75), 0);
}

var filename = 'Day11';
console.log('Part 1:', part1(readInput(filename))); // 55312
console.time('Part 1');
console.log('Part 1 Test:', part1(readInput(`${filename}_test`))); // 239714
console.timeEnd('Part 1');

console.log('Part 2:', part2(readInput(filename))); // 65601038650482
console.time('Part 2');
console.log('Part 2 Test:', part2(readInput(`${filename}_test`))); // 284973560658514
console.timeEnd('Part 2');
