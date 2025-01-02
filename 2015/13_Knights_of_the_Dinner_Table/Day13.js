// Day 13: Knights of the Dinner Table
// https://adventofcode.com/2015/day/13

const utils = require('../../utils');

const day = 13;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  // Alice would gain 54 happiness units by sitting next to Bob.
  const attendeesPlanned = input
    .split('\r\n')
    .map((line) => line.match(/(\w+) would (lose|gain) (\d*) happiness units by sitting next to (\w+)\./) ?? []);
  return attendeesPlanned.map((planned) => ({
    name: planned[1],
    next: planned[4],
    happiness: planned[2] === 'gain' ? +planned[3] : -planned[3],
  }));
}

function calculateHappiness(input, includeMe) {
  const planned = prepareData(input);
  const map = new Map();
  const uniqueNames = new Set();
  for (const { name, next, happiness } of planned) {
    if (!map.has(name)) map.set(name, new Map());
    map.get(name).set(next, happiness);
    uniqueNames.add(name);
  }

  const n = uniqueNames.size;
  const pairs = includeMe ? n - 1 : n;
  const list = utils.permutations([...uniqueNames]);

  let maxHappiness = 0;
  for (const names of list) {
    let happiness = 0;
    for (let i = 0; i < pairs; i++) {
      const name = names[i];
      const next = names[(i + 1) % n];
      happiness += map.get(name).get(next) + map.get(next).get(name);
    }
    maxHappiness = Math.max(maxHappiness, happiness);
  }
  return maxHappiness;
}

function part1(input) {
  return calculateHappiness(input, false);
}

function part2(input) {
  return calculateHappiness(input, true);
}

console.log('Part 1:', part1(input)); // 330
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 733
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 286
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 725
console.timeEnd('Part 2');
