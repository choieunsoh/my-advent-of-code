// Day 20: Race Condition
// https://adventofcode.com/2024/day/20

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split(/\s+/g);
}

function prepareData(input) {
  return input.map((row) => row.split(''));
}

function printGrid(grid) {
  console.log(grid.map((row) => row.join(' ')).join('\n'));
  console.log();
}

function findStartAndEnd(grid) {
  const height = grid.length;
  const width = grid[0].length;

  let startPos = { x: 0, y: 0 };
  let endPos = { x: 0, y: 0 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') {
        startPos = { x, y };
      } else if (grid[y][x] === 'E') {
        endPos = { x, y };
      }
    }
  }
  return { startPos, endPos };
}

function getNeighborsLocationWithCondition(grid, x, y, condition) {
  const neighbors = [
    x > 0 ? { x: x - 1, y } : null,
    x < grid[0].length - 1 ? { x: x + 1, y } : null,
    y > 0 ? { x, y: y - 1 } : null,
    y < grid.length - 1 ? { x, y: y + 1 } : null,
    // diag
    x > 0 && y > 0 ? { x: x - 1, y: y - 1 } : null,
    x > 0 && y < grid.length - 1 ? { x: x - 1, y: y + 1 } : null,
    x < grid[0].length - 1 && y > 0 ? { x: x + 1, y: y - 1 } : null,
    x < grid[0].length - 1 && y < grid.length - 1 ? { x: x + 1, y: y + 1 } : null,
  ];
  return neighbors.filter((k) => k !== null && condition(k.x, k.y, grid[k.y][k.x]));
}

function bfs(grid, startPos, endPos) {
  const positions = [];
  const visited = new Set();
  const queue = [{ ...startPos }];
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    positions.push({ x, y });

    if (x === endPos.x && y === endPos.y) {
      break;
    }

    visited.add(`${x},${y}`);

    const neighbors = getNeighborsLocationWithCondition(grid, x, y, (x, y, v) => {
      return v !== '#' && !visited.has(`${x},${y}`);
    });

    queue.push({ x: neighbors[0].x, y: neighbors[0].y });
  }

  for (const { x, y } of positions) {
    if (grid[y][x] === '.') grid[y][x] = 'x';
  }

  return positions;
}

function findPathSkips({ positions, maxCheats = 2, minSave = 100, debug = false }) {
  let skips = 0;
  const savedArr = new Map();
  for (let first = 0; first < positions.length - 1; first++) {
    for (let second = first + 1; second < positions.length; second++) {
      const savedBySkipping = second - first;

      const firstPos = positions[first];
      const secondPos = positions[second];

      const xDiff = Math.abs(firstPos.x - secondPos.x);
      const yDiff = Math.abs(firstPos.y - secondPos.y);

      if (xDiff + yDiff > maxCheats) continue;

      const saved = savedBySkipping - (xDiff + yDiff);
      if (saved < minSave) continue;

      savedArr.set(saved, (savedArr.get(saved) ?? 0) + 1);
      skips++;
    }
  }

  if (debug) {
    const sorted = [...savedArr.entries()].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    sorted.map(([diff, count]) => console.log(diff, count));
  }

  return skips;
}

function startRace({ input, maxCheats, minSave, debug = false }) {
  const grid = prepareData(input);
  if (debug) printGrid(grid);

  const { startPos, endPos } = findStartAndEnd(grid);
  const positions = bfs(grid, startPos, endPos);
  const skips = findPathSkips({ positions, maxCheats, minSave, debug });
  return skips;
}

function part1({ input, debug = false }) {
  return startRace({ input, maxCheats: 2, minSave: 100, debug });
}

function part2({ input, debug = false }) {
  return startRace({ input, maxCheats: 20, minSave: 100, debug });
}

const filename = 'Day20';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 0
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 1323
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 0
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest, debug: true })); // 983905
console.timeEnd('Part 2');
