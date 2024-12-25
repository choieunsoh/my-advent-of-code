// Day 16: Reindeer Maze
// https://adventofcode.com/2024/day/16

const fs = require('fs');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n');
}

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

function parseGrid(grid) {
  const width = grid[0].length;
  const height = grid.length;

  // construct a graph to make dijkstra search easier
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };
  const forward = {};
  const reverse = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') start = { x, y };
      if (grid[y][x] === 'E') end = { x, y };

      if (grid[y][x] !== '#') {
        DIRECTIONS.forEach((direction, i) => {
          const position = { x: x + direction.x, y: y + direction.y };

          const key = `${x},${y},${i}`;
          const moveKey = `${position.x},${position.y},${i}`;

          if (
            position.x >= 0 &&
            position.x < width &&
            position.y >= 0 &&
            position.y < height &&
            grid[position.y][position.x] !== '#'
          ) {
            if (forward[key] === undefined) forward[key] = {};
            if (reverse[moveKey] === undefined) reverse[moveKey] = {};

            forward[key][moveKey] = 1;
            reverse[moveKey][key] = 1;
          }

          for (const rotateKey of [`${x},${y},${(i + 3) % 4}`, `${x},${y},${(i + 1) % 4}`]) {
            if (forward[key] === undefined) forward[key] = {};
            if (reverse[rotateKey] === undefined) reverse[rotateKey] = {};

            forward[key][rotateKey] = 1000;
            reverse[rotateKey][key] = 1000;
          }
        });
      }
    }
  }

  DIRECTIONS.forEach((_, i) => {
    const key = `${end.x},${end.y}`;
    const rotateKey = `${end.x},${end.y},${i}`;

    if (forward[rotateKey] === undefined) forward[rotateKey] = {};
    if (reverse[key] === undefined) reverse[key] = {};

    forward[rotateKey][key] = 0;
    reverse[key][rotateKey] = 0;
  });

  return { start, end, forward, reverse };
}

function dijkstra(graph, start, directionless) {
  const pq = new MinPriorityQueue({ priority: (x) => x.score });
  const distances = {};

  let startingKey = `${start.x},${start.y},0`;
  if (directionless) startingKey = `${start.x},${start.y}`;

  pq.enqueue({ score: 0, node: startingKey });
  distances[startingKey] = 0;

  while (pq.size()) {
    const current = pq.dequeue().element;

    if (distances[current.node] < current.score) continue;

    if (graph[current.node] === undefined) continue;

    Object.entries(graph[current.node]).forEach(([next, weight]) => {
      const newScore = current.score + weight;
      if (distances[next] === undefined || distances[next] > newScore) {
        distances[next] = newScore;
        pq.enqueue({ score: newScore, node: next });
      }
    });
  }

  return distances;
}

function part2(grid) {
  const { start, end, forward, reverse } = parseGrid(grid);

  const fromStart = dijkstra(forward, start, false);
  const toEnd = dijkstra(reverse, end, true);

  const endKey = `${end.x},${end.y}`;
  const target = fromStart[endKey];
  const spaces = new Set();

  Object.keys(fromStart).forEach((position) => {
    if (position !== endKey && fromStart[position] + toEnd[position] === target) {
      const [x, y] = position.split(',');
      spaces.add(`${x},${y}`);
    }
  });

  return spaces.size;
}

const filename = 'Day16';
const input = readInput(filename);
const inputDemo = readInput(`${filename}_demo`);
const inputTest = readInput(`${filename}_test`);

console.log('Part 2:', part2(input)); // 45
console.log('Part 2:', part2(inputDemo)); // 64
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 590
console.timeEnd('Part 2');
