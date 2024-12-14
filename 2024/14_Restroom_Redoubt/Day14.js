// Day 14: Restroom Redoubt
// https://adventofcode.com/2024/day/14

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n');
}

function buildRobots(config) {
  const robots = config.map(toRobot);
  const tall = Math.max(...robots.map((r) => r.y)) + 1;
  const wide = Math.max(...robots.map((r) => r.x)) + 1;
  return [robots, tall, wide];
}

function toRobot(line) {
  // p=2,4 v=2,-3
  const [p, v] = line.split(' ');
  const [x, y] = p.split('=')[1].split(',').map(Number);
  const [dx, dy] = v.split('=')[1].split(',').map(Number);
  return {
    x,
    y,
    dx,
    dy,
  };
}

function moveRobots(robots, moves, wide, tall) {
  return robots.map((robot) => {
    const { x, y, dx, dy } = robot;
    let newX = (x + dx * moves) % wide;
    let newY = (y + dy * moves) % tall;

    newX = (newX + wide) % wide;
    newY = (newY + tall) % tall;

    return {
      x: newX,
      y: newY,
      dx,
      dy,
    };
  });
}

function splitRegions(robots, wide, tall) {
  const midX = wide >> 1;
  const midY = tall >> 1;
  const regions = [[], [], [], []];

  robots.forEach((robot) => {
    const { x, y } = robot;
    if (x === midX || y === midY) return;

    if (x < midX && y < midY) {
      regions[0].push(robot); // Top-left
    } else if (x >= midX && y < midY) {
      regions[1].push(robot); // Top-right
    } else if (x < midX && y >= midY) {
      regions[2].push(robot); // Bottom-left
    } else if (x >= midX && y >= midY) {
      regions[3].push(robot); // Bottom-right
    }
  });

  return regions;
}

function printRobots(robots, wide, tall, print = true) {
  const grid = Array.from({ length: tall }, () => Array(wide).fill('.'));
  robots.forEach((robot) => {
    const { x, y } = robot;
    grid[y][x] = '#';
  });
  const pattern = grid.map((row) => row.join('')).join('\n');
  if (print) console.log(pattern, '\n');
  return pattern;
}

function isUniquePositions(robots) {
  const positions = robots.map((robot) => `${robot.x},${robot.y}`);
  return new Set(positions).size === positions.length;
}

function part1({ input, moves = 100, debug = false }) {
  const [robots, tall, wide] = buildRobots(input);
  const movedRobots = moveRobots(robots, moves, wide, tall);
  const regions = splitRegions(movedRobots, wide, tall);
  if (debug) {
    console.log(regions);
    printRobots(movedRobots, wide, tall);
  }
  const safetyFactor = regions.reduce((factor, region) => factor * (region.length || 1), 1);
  return safetyFactor;
}

function part2({ input, debug = false }) {
  const buildResult = buildRobots(input);
  const [, tall, wide] = buildResult;
  let [robots] = buildResult;

  const patternSet = new Map();
  let moves = 0;
  while (true) {
    moves++;
    robots = moveRobots(robots, 1, wide, tall);

    if (isUniquePositions(robots)) {
      const pattern = printRobots(robots, wide, tall, false);
      if (patternSet.has(pattern)) {
        console.log('Found a loop!', moves, 'moves');
        break;
      }
      patternSet.set(pattern, [moves, robots]);
    }
  }

  console.log('Total unique robot positions:', patternSet.size);
  for (const [, [moves, robots]] of patternSet) {
    console.log('Moves:', moves);
    printRobots(robots, wide, tall);
  }
  return 0;
}

const filename = 'Day14';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 12
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 218619120
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 0
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 7055
console.timeEnd('Part 2');
