// Day 1: Secret Entrance
// https://adventofcode.com/2025/day/1

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n').filter(Boolean);
}

function prepareData(input) {
  const rotations = input.map((rotation) => {
    const direction = rotation[0] === 'L' ? -1 : 1;
    const steps = Number(rotation.slice(1));
    return steps * direction;
  });
  return rotations;
}

function part1(input) {
  const MAX = 100;
  const START = 50;
  const rotations = prepareData(input);

  let zeroCount = 0;
  let pointer = START;
  for (const steps of rotations) {
    pointer = (pointer + steps + MAX) % MAX;
    if (pointer === 0) {
      zeroCount++;
    }
  }
  return zeroCount;
}

function part2(input) {
  const MAX = 100;
  const START = 50;
  const rotations = prepareData(input);

  let totalLaps = 0;
  let pointer = START;
  for (const rotation of rotations) {
    let steps = Math.abs(rotation);
    const needed = rotation < 0 ? pointer || MAX : MAX - pointer;
    const fullLap = steps >= needed ? 1 : 0;
    if (steps >= needed) {
      steps -= needed;
    }
    const laps = (steps / MAX) | 0;
    totalLaps += fullLap + laps;
    pointer = (((pointer + rotation) % MAX) + MAX) % MAX;
  }
  return totalLaps;
}

const filename = 'data';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1(input)); // 3
console.time('Part 1');
console.log('Part 1 Test:', part1(inputTest)); // 1026
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 6
console.time('Part 2');
console.log('Part 2 Test:', part2(inputTest)); // 5923
console.timeEnd('Part 2');
