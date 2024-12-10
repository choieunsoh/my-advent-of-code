// Day 10: Hoof It
// https://adventofcode.com/2024/day/10

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n').filter(Boolean);
};

function buildGrid(input) {
  return input.map((row) => row.trim().split('').map(Number));
}

function countNinthPoints(grid, countUniquePoint) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [0, 1, 0, -1, 0];

  let totalScore = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] !== 0) continue;

      const ninthPoints = getNinthPoints(row, col);
      if (countUniquePoint) {
        const uniqueNinthPoints = new Set(ninthPoints);
        totalScore += uniqueNinthPoints.size;
      } else {
        totalScore += ninthPoints.length;
      }
    }
  }
  return totalScore;

  function isInBounds(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  function getNinthPoints(startRow, startCol) {
    const ninthPoints = [];
    let queue = [[startRow, startCol, 0]];
    while (queue.length > 0) {
      const nextQueue = [];
      for (const [row, col, currentNumber] of queue) {
        if (currentNumber === 9) {
          const key = row * cols + col;
          ninthPoints.push(key);
          continue;
        }

        for (let d = 0; d < 4; d++) {
          const newRow = row + directions[d];
          const newCol = col + directions[d + 1];
          const nextNumber = currentNumber + 1;

          if (!isInBounds(newRow, newCol)) continue;
          if (grid[newRow][newCol] !== nextNumber) continue;

          nextQueue.push([newRow, newCol, nextNumber]);
        }
      }
      queue = nextQueue;
    }
    return ninthPoints;
  }
}

function part1(input) {
  const grid = buildGrid(input);
  return countNinthPoints(grid, true);
}

function part2(input) {
  const grid = buildGrid(input);
  return countNinthPoints(grid, false);
}

var filename = 'Day10';
console.log('Part 1:', part1(readInput(filename))); // 36
console.time('Part 1');
console.log('Part 1 Test:', part1(readInput(`${filename}_test`))); // 825
console.timeEnd('Part 1');

console.log('Part 2:', part2(readInput(filename))); // 81
console.time('Part 2');
console.log('Part 2 Test:', part2(readInput(`${filename}_test`))); // 1805
console.timeEnd('Part 2');
