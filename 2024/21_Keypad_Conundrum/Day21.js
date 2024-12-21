// Day 21: Keypad Conundrum
// https://adventofcode.com/2024/day/21

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n');
}

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| X | 0 | A |
+---+---+---+
*/
const NUM_PAD = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
};

/*
+---+---+---+
| X | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/
const DIR_PAD = {
  X: { x: 0, y: 0 },
  '^': { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  '<': { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  '>': { x: 2, y: 1 },
};

const DIRECTIONS = new Map([
  ['^', { x: 0, y: -1 }],
  ['>', { x: 1, y: 0 }],
  ['v', { x: 0, y: 1 }],
  ['<', { x: -1, y: 0 }],
]);

function getAllMoves(start, target, PAD) {
  if (start === target) return ['A'];

  const queue = [{ ...PAD[start], path: '' }];
  const distances = new Map();

  const allPaths = [];
  while (queue.length) {
    const curr = queue.shift();

    if (curr.x === PAD[target].x && curr.y === PAD[target].y) {
      allPaths.push(curr.path + 'A');
    }

    const currKey = `${curr.x},${curr.y}`;
    if (distances.has(currKey) && distances.get(`${curr.x},${curr.y}`) < curr.path.length) continue;

    for (const [direction, { x: dx, y: dy }] of DIRECTIONS) {
      const next = { x: curr.x + dx, y: curr.y + dy };

      if (PAD.X.x === next.x && PAD.X.y === next.y) {
        continue;
      }

      const button = Object.values(PAD).find((button) => button.x === next.x && button.y === next.y);
      if (!button) continue;

      const nextPath = curr.path + direction;
      const nextKey = `${next.x},${next.y}`;
      if (distances.has(nextKey) && distances.get(nextKey) < nextPath.length) {
        continue;
      }

      queue.push({ ...next, path: nextPath });
      distances.set(nextKey, nextPath.length);
    }
  }
  return allPaths.sort((a, b) => a.length - b.length);
}

function getKeyPresses(code, robots, PAD, memo) {
  const key = `${code},${robots}`;
  if (memo.has(key)) return memo.get(key);

  let current = 'A';
  let length = 0;
  for (let i = 0; i < code.length; i++) {
    const moves = getAllMoves(current, code[i], PAD);
    if (robots === 0) {
      length += moves[0].length;
    } else {
      length += Math.min(...moves.map((move) => getKeyPresses(move, robots - 1, DIR_PAD, memo)));
    }
    current = code[i];
  }

  memo.set(key, length);
  return length;
}

function executeCommand({ input, numberOfRobots, debug = false }) {
  if (debug) console.log(input);
  const memo = new Map();
  let sum = 0;
  for (const code of input) {
    const num = parseInt(code, 10);
    const presses = getKeyPresses(code, numberOfRobots, NUM_PAD, memo);
    sum += num * presses;
    if (debug) console.log(code, num, presses, sum);
  }
  return sum;
}

function part1({ input, debug = false }) {
  return executeCommand({ input, numberOfRobots: 2, debug });
}

function part2({ input, debug = false }) {
  return executeCommand({ input, numberOfRobots: 25, debug });
}

const filename = 'Day21';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 126384
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 137870
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 154115708116294
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 170279148659464
console.timeEnd('Part 2');
