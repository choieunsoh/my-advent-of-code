// Day 2: I Was Told There Would Be No Math
// https://adventofcode.com/2015/day/2

const utils = require('../../utils');

function prepareData(input) {
  return input.split('\r\n').map((box) => box.split('x').map(Number));
}

function calculateWrappingPaper(box) {
  const [l, w, h] = box;
  const sides = [l * w, w * h, h * l];
  const smallestSide = Math.min(...sides);
  return 2 * sides.reduce((acc, side) => acc + side, 0) + smallestSide;
}

function calculateWrappingRibbon(box) {
  const [l, w, h] = box;
  const maxSide = Math.max(l, w, h);
  const otherSides = l + w + h - maxSide;
  const perimeter = 2 * otherSides;
  const volume = l * w * h;
  return perimeter + volume;
}

function part1(input) {
  const boxes = prepareData(input);
  return boxes.reduce((total, box) => total + calculateWrappingPaper(box), 0);
}

function part2(input) {
  const boxes = prepareData(input);
  return boxes.reduce((total, box) => total + calculateWrappingRibbon(box), 0);
}

const day = 2;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input)); // 101
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 1588178
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 48
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 3783758
console.timeEnd('Part 2');
