// Day 3: Perfectly Spherical Houses in a Vacuum
// https://adventofcode.com/2015/day/3

const utils = require('../../utils');

const DIRECTIONS = {
  '^': [0, -1],
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
};

function part1(input) {
  let santa = { x: 0, y: 0 };
  const visited = new Set();
  visited.add(`${santa.x},${santa.y}`);
  for (const dir of input) {
    const [dx, dy] = DIRECTIONS[dir];
    santa.x += dx;
    santa.y += dy;
    visited.add(`${santa.x},${santa.y}`);
  }
  return visited.size;
}

function part2(input) {
  let santa = { x: 0, y: 0 };
  let robotSanta = { x: 0, y: 0 };
  const visited = new Set();
  visited.add(`${santa.x},${santa.y}`);
  visited.add(`${robotSanta.x},${robotSanta.y}`);
  for (let i = 0; i < input.length; i += 2) {
    const [dx1, dy1] = DIRECTIONS[input[i]];
    const [dx2, dy2] = DIRECTIONS[input[i + 1]] ?? [0, 0];
    santa.x += dx1;
    santa.y += dy1;
    robotSanta.x += dx2;
    robotSanta.y += dy2;
    visited.add(`${santa.x},${santa.y}`);
    visited.add(`${robotSanta.x},${robotSanta.y}`);
  }
  return visited.size;
}

const day = 3;
const input1 = '>';
const input1v2 = '^v';
const input2 = '^>v<';
const input3 = '^v^v^v^v^v';
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input1)); // 2
console.log('Part 1:', part1(input2)); // 4
console.log('Part 1:', part1(input3)); // 2
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 2572
console.timeEnd('Part 1');

console.log('Part 2:', part2(input1v2)); // 3
console.log('Part 2:', part2(input2)); // 3
console.log('Part 2:', part2(input3)); // 11
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 2631
console.timeEnd('Part 2');
