// Day 16: Reindeer Maze
// https://adventofcode.com/2024/day/16

const fs = require('fs');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n');
}

const directions = [
  { name: 'North', dy: -1, dx: 0 },
  { name: 'East', dy: 0, dx: 1 },
  { name: 'South', dy: 1, dx: 0 },
  { name: 'West', dy: 0, dx: -1 },
];

function aStarSearch(map, part1 = true, debug = false) {
  const pq = new MinPriorityQueue({ priority: (node) => node.score });
  const visited = new Map();
  const pathMap = map.map((row) => row.split(''));
  const { startX, startY, endX, endY } = findStartEndPoints(pathMap);
  let bestCost = Infinity;

  pq.enqueue({ x: startX, y: startY, dir: 1, d: 'E', score: 0, path: [] });
  const key = `${startX},${startY},${1}`;
  visited.set(key, [0, []]);

  while (!pq.isEmpty()) {
    const { x, y, dir, d, score, path } = pq.dequeue().element;
    const key = `${x},${y},${dir}`;

    if (x === endX && y === endY) {
      if (score > bestCost) {
        break;
      }
      bestCost = score;
      if (part1) return bestCost;
    }

    // Try turning left or right
    for (let turn = -1; turn <= 1; turn += 2) {
      const newDir = (dir + turn + 4) % 4;
      const newKey = `${x},${y},${newDir}`;
      const newScore = score + 1000;

      const wasSeen = visited.has(newKey);
      if (wasSeen) {
        const [visitedScore] = visited.get(newKey);
        if (visitedScore < newScore) continue;
      }

      if (debug) console.log({ d: directions[newDir].name[0], x, y, newDir, cell: pathMap[y][x] });

      if (!wasSeen) {
        visited.set(newKey, [newScore, []]);
      } else {
        const [, visitedPath] = visited.get(newKey);
        visitedPath.push(key);
      }

      if (!wasSeen) {
        const newPath = [...path];
        pq.enqueue({ x, y, dir: newDir, d: directions[newDir].name[0], score: newScore, path: newPath });
      }
    }

    // Try moving forward
    {
      const forwardX = x + directions[dir].dx;
      const forwardY = y + directions[dir].dy;
      const newKey = `${forwardX},${forwardY},${dir}`;
      const newScore = score + 1;

      if (debug) console.log({ d, forwardX, forwardY, cell: pathMap[forwardY][forwardX] });
      if (pathMap[forwardY][forwardX] === '#') continue;

      let wasSeen = visited.has(newKey);
      if (wasSeen) {
        const [visitedScore] = visited.get(newKey);
        if (visitedScore < newScore) continue;

        if (visitedScore > newScore) {
          visited.delete(newKey);
        }
      }

      wasSeen = visited.has(newKey);

      if (!wasSeen) {
        visited.set(newKey, [newScore, []]);
      } else {
        const [, visitedPath] = visited.get(newKey);
        visitedPath.push(key);
      }

      if (!wasSeen) {
        const newPath = [...path, { x: forwardX, y: forwardY }];
        pq.enqueue({ x: forwardX, y: forwardY, dir, d, score: score + 1, path: newPath });
      }
    }
  }

  return bestCost;
}

function findStartEndPoints(map) {
  const points = {};
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'S') {
        points.startY = i;
        points.startX = j;
      } else if (map[i][j] === 'E') {
        points.endY = i;
        points.endX = j;
      }

      if (points.startX !== undefined && points.endX !== undefined) break;
    }
  }
  return points;
}

function printPQ(moves, pq) {
  console.log('Moves', moves);
  const arr = pq.toArray();
  for (let i = 0; i < arr.length; i++) {
    const {
      element: { path, ...rest },
    } = arr[i];
    console.log(i, rest);
    path.forEach((p) => console.log(p));
  }
  console.log();
}

function part1({ input, debug = false }) {
  return aStarSearch(input, true, debug);
}

function part2({ input, debug = false }) {
  return 0;
}

const filename = 'Day16';
const input = readInput(filename);
const inputDemo = readInput(`${filename}_demo`);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 7036
console.log('Part 1:', part1({ input: inputDemo })); // 11048
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 82460
console.timeEnd('Part 1');
/*
console.log('Part 2:', part2({ input, debug: true })); // 618
console.log('Part 2:', part2({ input: inputDemo, debug: true })); // 9021
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 1446175
console.timeEnd('Part 2');
*/
