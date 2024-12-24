// Day 18: RAM Run
// https://adventofcode.com/2024/day/18

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split(/\s+/g);
}

function prepareData(input) {
  return input
    .map((line) => line.split(',').map(Number))
    .map(([x, y]) => ({
      x,
      y,
    }));
}

function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(' '));
  }
  console.log();
}

function printFinalGrid(grid, path) {
  const clonedGrid = structuredClone(grid);
  for (let i = 0; i < path.length; i++) {
    const { y: row, x: col } = path[i];
    const next = path[i + 1];
    if (!next) {
      const prev = path[i - 1];
      clonedGrid[row][col] = clonedGrid[prev.y][prev.x];
      break;
    }

    if (next.x > col) clonedGrid[row][col] = '>';
    else if (next.x < col) clonedGrid[row][col] = '<';
    else if (next.y > row) clonedGrid[row][col] = 'v';
    else if (next.y < row) clonedGrid[row][col] = '^';
  }
  printGrid(clonedGrid);
}

function bfs(grid, start, target) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const visited = new Set();
  const queue = [[start, [start]]];
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [curr, path] = queue.shift() || [];
      if (curr.x === target.x && curr.y === target.y) {
        return [steps, path];
      }

      for (const [dx, dy] of directions) {
        const nx = curr.x + dx;
        const ny = curr.y + dy;
        if (isInvalid(nx, ny)) continue;

        queue.push([{ x: nx, y: ny }, [...path, { x: nx, y: ny }]]);
        visited.add(`${nx},${ny}`);
      }
    }
    steps++;
  }
  return [-1, []];

  function isInvalid(x, y) {
    return x < 0 || x >= rows || y < 0 || y >= cols || grid[x][y] === '#' || visited.has(`${x},${y}`);
  }
}

function part1({ input, firstBytes, debug = false }) {
  const bytes = prepareData(input);
  const size = Math.max(...bytes.map(({ x, y }) => Math.max(x, y))) + 1;
  const grid = Array.from({ length: size }, () => new Array(size).fill('.'));
  for (let i = 0; i < firstBytes; i++) {
    const { y: row, x: col } = bytes[i];
    grid[row][col] = '#';
  }
  if (debug) printGrid(grid);

  const start = { x: 0, y: 0 };
  const target = { x: size - 1, y: size - 1 };
  const [shortestPath, path] = bfs(grid, start, target);

  if (debug) printFinalGrid(grid, path);

  return shortestPath;
}

function part2({ input, debug = false }) {
  const bytes = prepareData(input);
  const size = Math.max(...bytes.map(({ x, y }) => Math.max(x, y))) + 1;
  const grid = Array.from({ length: size }, () => new Array(size).fill('.'));
  const start = { x: 0, y: 0 };
  const target = { x: size - 1, y: size - 1 };
  for (let i = 0; i < bytes.length; i++) {
    const { y: row, x: col } = bytes[i];
    grid[row][col] = '#';

    if (debug) printGrid(grid);

    const [shortestPath, path] = bfs(grid, start, target);

    if (debug) printFinalGrid(grid, path);

    if (debug) console.log('bytes:', i, 'x,y:', `${col},${row}`, 'shortestPath', shortestPath);
    if (shortestPath === -1) {
      return `${col},${row}`;
    }
  }
  return 'Not found';
}

const filename = 'Day18';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, firstBytes: 12, debug: true })); // 22
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest, firstBytes: 1024 })); // 354
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 6,1
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 36,17
console.timeEnd('Part 2');
