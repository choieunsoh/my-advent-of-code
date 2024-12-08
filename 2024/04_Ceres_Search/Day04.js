// Day 4: Ceres Search
// https://adventofcode.com/2024/day/4

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n').filter(Boolean);
};

function countXMASInGrid(grid) {
  const word = 'XMAS';
  const directions = [
    [1, 0], // S
    [0, -1], // W
    [-1, 0], // N
    [0, 1], // E
    [1, 1], // SE
    [1, -1], // SW
    [-1, -1], // NW
    [-1, 1], // NE
  ];
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] !== 'X') continue;
      for (const [dRow, dCol] of directions) {
        if (search(row, col, 0, dRow, dCol)) {
          count++;
        }
      }
    }
  }
  return count;

  function search(row, col, wordIndex, dRow, dCol) {
    if (wordIndex === word.length) {
      return true;
    }

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return false;
    }

    if (grid[row][col] !== word[wordIndex]) {
      return false;
    }

    return search(row + dRow, col + dCol, wordIndex + 1, dRow, dCol);
  }
}

function countPatterns(grid) {
  const patterns = [
    ['M.S', '.A.', 'M.S'],
    ['M.M', '.A.', 'S.S'],
    ['S.S', '.A.', 'M.M'],
    ['S.M', '.A.', 'S.M'],
  ];
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      if (grid[row][col] !== 'A') continue;
      for (const pattern of patterns) {
        if (matchesPattern(grid, row - 1, col - 1, pattern)) {
          count++;
        }
      }
    }
  }
  return count;

  function matchesPattern(grid, startRow, startCol, pattern) {
    for (let i = 0; i < 3; i += 2) {
      for (let j = 0; j < 3; j += 2) {
        if (grid[startRow + i][startCol + j] !== pattern[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}

function part1(input) {
  return countXMASInGrid(input);
}

function part2(input) {
  return countPatterns(input);
}

console.log(part1(readInput('Day04'))); // 18
console.log(part1(readInput('Day04_test'))); // 2644

console.log(part2(readInput('Day04'))); // 9
console.log(part2(readInput('Day04_test'))); // 1952
