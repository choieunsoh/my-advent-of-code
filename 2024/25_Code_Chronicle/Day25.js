// Day 25: Code Chronicle
// https://adventofcode.com/2024/day/25

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n\r\n');
}

function prepareData(input) {
  const grids = input.map((line) => line.split(/\s+/g));
  const locks = [];
  const keys = [];
  grids.forEach((grid) => {
    const isLock = grid[0][0] === '#';
    if (isLock) {
      locks.push(toLockHeights(grid));
    } else {
      keys.push(toKeyHeights(grid));
    }
  });
  return { locks, keys };
}

function toLockHeights(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const heights = new Array(cols).fill(0);
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[row][col] === '.') {
        heights[col] = row - 1;
        break;
      }
    }
  }
  return heights;
}

function toKeyHeights(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const heights = new Array(cols).fill(0);
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[row][col] === '#') {
        heights[col] = rows - row - 1;
        break;
      }
    }
  }
  return heights;
}

function part1({ input, debug = false }) {
  const { locks, keys } = prepareData(input);
  console.log('locks', locks.length);
  console.log('keys', keys.length);

  let matches = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (debug) {
        console.log(lock);
        console.log(key);
        console.log(isMatchLockAndKey(lock, key));
      }
      if (isMatchLockAndKey(lock, key)) {
        matches++;
      }
    }
  }
  return matches;

  function isMatchLockAndKey(lock, key) {
    for (let i = 0; i < lock.length; i++) {
      const sum = lock[i] + key[i];
      if (sum > 5) return false;
    }
    return true;
  }
}

const filename = 'Day25';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 3
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 3360
console.timeEnd('Part 1');
