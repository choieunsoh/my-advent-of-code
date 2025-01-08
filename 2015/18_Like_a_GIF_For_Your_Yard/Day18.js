// Day 18: Like a GIF For Your Yard
// https://adventofcode.com/2015/day/18

const utils = require('../../utils');

const day = 18;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  return input.split('\r\n').map((line) => line.split(''));
}

function countLights(grid, row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      if (grid[row + i] && grid[row + i][col + j] === '#') count++;
    }
  }
  return count;
}

function nextIsOn(grid, row, col) {
  const count = countLights(grid, row, col);
  if (grid[row][col] === '#') return count === 2 || count === 3;
  return count === 3;
}

function setCornersAlwaysOn(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  grid[0][0] = '#';
  grid[0][cols - 1] = '#';
  grid[rows - 1][0] = '#';
  grid[rows - 1][cols - 1] = '#';
}

function part1(input, steps) {
  let grid = prepareData(input);
  const rows = grid.length;
  const cols = grid[0].length;
  while (steps-- > 0) {
    const nextGrid = grid.map((row) => row.slice());
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nextGrid[row][col] = nextIsOn(grid, row, col) ? '#' : '.';
      }
    }
    grid = nextGrid;
  }
  return grid.flat().filter((light) => light === '#').length;
}

function part2(input, steps) {
  let grid = prepareData(input);
  setCornersAlwaysOn(grid);

  const rows = grid.length;
  const cols = grid[0].length;
  while (steps-- > 0) {
    const nextGrid = grid.map((row) => row.slice());
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nextGrid[row][col] = nextIsOn(grid, row, col, true) ? '#' : '.';
      }
    }

    grid = nextGrid;
    setCornersAlwaysOn(grid);
  }
  return grid.flat().filter((light) => light === '#').length;
}

console.log('Part 1:', part1(input, 4)); // 4
console.time('Part 1');
console.log('Part 1:', part1(inputTest, 100)); // 1061
console.timeEnd('Part 1');

console.log('Part 2:', part2(input, 5)); // 17
console.time('Part 2');
console.log('Part 2:', part2(inputTest, 100)); // 17
console.timeEnd('Part 2');
