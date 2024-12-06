// Day 6: Guard Gallivant
// https://adventofcode.com/2024/day/6

const fs = require('fs');
function readInput(filename) {
  return fs
    .readFileSync(`${filename}.txt`, 'utf8')
    .split('\n')
    .map((x) => x.split(''));
}

const CellType = {
  STARTING_POINT: '^',
  OBSTACLE: '#',
  EMPTY: '.',
  VISITED: 'x',
};

function isInBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function findStartingPosition(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === CellType.STARTING_POINT) {
        return [row, col];
      }
    }
  }
}

function markAsVisited(grid) {
  const visitedList = [];
  let rowDirection = -1;
  let colDirection = 0;
  let [row, col] = findStartingPosition(grid);
  while (true) {
    const nextRow = row + rowDirection;
    const nextCol = col + colDirection;

    if (!isInBounds(grid, nextRow, nextCol)) break;

    const nextCell = grid[nextRow][nextCol];
    if (nextCell === CellType.OBSTACLE) {
      // Turn RIGHT
      [rowDirection, colDirection] = [colDirection, -rowDirection];
    } else {
      row = nextRow;
      col = nextCol;

      if (grid[row][col] === CellType.EMPTY) {
        grid[row][col] = CellType.VISITED;
        visitedList.push([row, col]);
      }
    }
  }
  return visitedList;
}

function toDir(rowDirection, colDirection) {
  if (rowDirection === -1 && colDirection === 0) return 'U';
  if (rowDirection === 1 && colDirection === 0) return 'D';
  if (rowDirection === 0 && colDirection === -1) return 'L';
  if (rowDirection === 0 && colDirection === 1) return 'R';
}

function isCycle(grid, row, col, rowObstacle, colObstacle) {
  grid[rowObstacle][colObstacle] = CellType.OBSTACLE;

  let dir = 'U';
  let rowDirection = -1;
  let colDirection = 0;

  const visited = new Set();
  const key = `${row},${col},${dir}`;
  visited.add(key);

  while (true) {
    const nextRow = row + rowDirection;
    const nextCol = col + colDirection;

    if (!isInBounds(grid, nextRow, nextCol)) {
      grid[rowObstacle][colObstacle] = CellType.EMPTY;
      return false;
    }

    if (grid[nextRow][nextCol] === CellType.OBSTACLE) {
      // Turn RIGHT
      [rowDirection, colDirection] = [colDirection, -rowDirection];
      dir = toDir(rowDirection, colDirection);
    } else {
      row = nextRow;
      col = nextCol;
    }

    const key = `${row},${col},${dir}`;
    if (visited.has(key)) {
      grid[rowObstacle][colObstacle] = CellType.EMPTY;
      return true;
    }

    visited.add(key);
  }
}

function part1(grid) {
  const visitedList = markAsVisited(grid);
  return visitedList.length + 1;
}

function part2(grid) {
  const visitedList = markAsVisited(grid);

  let countCycle = 0;
  const [startRow, startCol] = findStartingPosition(grid);
  for (const [row, col] of visitedList) {
    if (isCycle(grid, startRow, startCol, row, col)) {
      countCycle++;
    }
  }
  return countCycle;
}

console.log(part1(readInput('Day06'))); // 41
console.log(part1(readInput('Day06_test'))); // 4826

console.log(part2(readInput('Day06'))); // 6
console.time('Part 2');
console.log(part2(readInput('Day06_test'))); // 1721
console.timeEnd('Part 2');
