// Day 4: Printing Department
// https://adventofcode.com/2025/day/4

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n').filter(Boolean);
}

function prepareData(input) {
  return input.map((row) => row.split(''));
}

function part1(input, debug = false) {
  let rollCount = 0;
  const grid = prepareData(input);

  if (debug) grid.forEach((row) => console.log(row.join('')));

  const rows = grid.length;
  const cols = grid[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      if (cell === '.') continue;

      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const nextRow = row + i;
          const nextCol = col + j;
          if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
          const nextCell = grid[nextRow][nextCol];
          if (nextCell !== '.') {
            count++;
          }
        }
      }

      if (count < 4) {
        grid[row][col] = 'x';
        rollCount++;
      }
    }
  }

  if (debug) {
    console.log('-'.repeat(cols));
    grid.forEach((row) => console.log(row.join('')));
  }

  return rollCount;
}

function part2(input, debug = true) {
  let rollCount = 0;
  const grid = prepareData(input);

  if (debug) grid.forEach((row) => console.log(row.join('')));

  const rows = grid.length;
  const cols = grid[0].length;

  let round = 0;
  let hasRemovedRoll = true;
  while (hasRemovedRoll) {
    let removedRolls = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = grid[row][col];
        if (cell === '.') continue;

        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nextRow = row + i;
            const nextCol = col + j;
            if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
            const nextCell = grid[nextRow][nextCol];
            if (nextCell !== '.') {
              count++;
            }
          }
        }

        if (count < 4) {
          grid[row][col] = 'x';
          removedRolls++;
        }
      }
    }

    if (debug) {
      console.log('-'.repeat(cols + 10));
      grid.forEach((row) => console.log(row.join('')));
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === 'x') {
          grid[row][col] = '.';
        }
      }
    }

    rollCount += removedRolls;
    hasRemovedRoll = removedRolls > 0;

    if (debug) console.log(++round, removedRolls, rollCount);
  }
  return rollCount;
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 13
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 1449
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 43
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 8746
console.timeEnd('Part 2');
