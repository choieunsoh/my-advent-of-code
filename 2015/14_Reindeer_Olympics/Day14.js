// Day 14: Reindeer Olympics
// https://adventofcode.com/2015/day/14

const utils = require('../../utils');

const day = 14;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

class Reindeer {
  constructor(name, speed, flyTime, restTime) {
    this.name = name;
    this.speed = speed;
    this.flyTime = flyTime;
    this.restTime = restTime;
    this.cycleTime = flyTime + restTime;
    this.cycleDistance = speed * flyTime;
    this.points = 0;
  }

  getDistanceAtTime(seconds) {
    const fullCycles = Math.floor(seconds / this.cycleTime);
    const remainingTime = Math.min(this.flyTime, seconds % this.cycleTime);
    return fullCycles * this.cycleDistance + this.speed * remainingTime;
  }
}

function prepareData(input) {
  const pattern = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;
  return input.split('\r\n').map((line) => {
    const match = line.match(pattern);
    return new Reindeer(match[1], Number(match[2]), Number(match[3]), Number(match[4]));
  });
}

function part1(input, totalSeconds) {
  const reindeers = prepareData(input);
  return Math.max(...reindeers.map((reindeer) => reindeer.getDistanceAtTime(totalSeconds)));
}

function part2(input, totalSeconds) {
  const reindeers = prepareData(input);
  const points = new Map(reindeers.map((reindeer) => [reindeer.name, 0]));

  for (let second = 1; second <= totalSeconds; second++) {
    const distances = reindeers.map((reindeer) => ({
      name: reindeer.name,
      distance: reindeer.getDistanceAtTime(second),
    }));

    const maxDistance = Math.max(...distances.map((d) => d.distance));
    distances.filter((d) => d.distance === maxDistance).forEach((d) => points.set(d.name, points.get(d.name) + 1));
  }

  return Math.max(...points.values());
}

console.log('Part 1:', part1(input, 1000)); // 1120
console.time('Part 1');
console.log('Part 1:', part1(inputTest, 2503)); // 2655
console.timeEnd('Part 1');

console.log('Part 2:', part2(input, 1000)); // 689
console.time('Part 2');
console.log('Part 2:', part2(inputTest, 2503)); // 1059
console.timeEnd('Part 2');
