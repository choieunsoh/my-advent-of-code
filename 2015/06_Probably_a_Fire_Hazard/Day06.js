// Day 6: Probably a Fire Hazard
// https://adventofcode.com/2015/day/6

const utils = require('../../utils');

function prepareData(input) {
  const pattern = /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/;
  return input.split('\r\n').map((line) => {
    const [, action, x1, y1, x2, y2] = line.match(pattern);
    return {
      action,
      x1: Number(x1),
      y1: Number(y1),
      x2: Number(x2),
      y2: Number(y2),
    };
  });
}

function part1(input) {
  const instructions = prepareData(input);
  const grid = Array.from({ length: 1000 }, () => new Array(1000).fill(0));
  for (const { action, x1, x2, y1, y2 } of instructions) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        if (action === 'turn on') {
          grid[x][y] = 1;
        } else if (action === 'turn off') {
          grid[x][y] = 0;
        } else if (action === 'toggle') {
          grid[x][y] ^= 1;
        }
      }
    }
  }

  return grid.flat().reduce((acc, val) => acc + val, 0);
}

function part2(input) {
  const instructions = prepareData(input);
  const grid = Array.from({ length: 1000 }, () => new Array(1000).fill(0));
  for (const { action, x1, x2, y1, y2 } of instructions) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        if (action === 'turn on') {
          grid[x][y]++;
        } else if (action === 'turn off') {
          if (grid[x][y] > 0) grid[x][y]--;
        } else if (action === 'toggle') {
          grid[x][y] += 2;
        }
      }
    }
  }

  return grid.flat().reduce((acc, val) => acc + val, 0);
}

const day = 6;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input)); // 998996
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 569999
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 1001996
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 17836115
console.timeEnd('Part 2');
