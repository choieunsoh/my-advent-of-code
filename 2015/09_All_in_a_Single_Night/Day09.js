// Day 9: All in a Single Night
// https://adventofcode.com/2015/day/9

const utils = require('../../utils');

const day = 9;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  return input.split('\r\n').map((line) => {
    const pattern = /(\w+) to (\w+) = (\d+)/;
    const match = line.match(pattern);
    return {
      from: match[1],
      to: match[2],
      distance: Number(match[3]),
    };
  });
}

function permutations(array) {
  const result = [];
  const used = Array(array.length).fill(false);

  function backtrack(path) {
    if (path.length === array.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < array.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(array[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}

function calculateDistances(input) {
  const routes = prepareData(input);
  const uniqueCities = new Set();
  const map = new Map();
  for (const { from, to, distance } of routes) {
    uniqueCities.add(from);
    uniqueCities.add(to);

    if (!map.has(from)) map.set(from, new Map());
    map.get(from).set(to, distance);

    if (!map.has(to)) map.set(to, new Map());
    map.get(to).set(from, distance);
  }

  let shortestDistance = Infinity;
  let longestDistance = 0;
  const permuteCities = permutations(uniqueCities);
  for (const cities of permuteCities) {
    let distance = 0;
    for (let i = 0; i < cities.length - 1; i++) {
      const from = cities[i];
      const to = cities[i + 1];
      distance += map.get(from).get(to);
    }
    shortestDistance = Math.min(shortestDistance, distance);
    longestDistance = Math.max(longestDistance, distance);
  }

  return { shortestDistance, longestDistance };
}

function part1(input) {
  return calculateDistances(input).shortestDistance;
}

function part2(input) {
  return calculateDistances(input).longestDistance;
}

console.log('Part 1:', part1(input)); // 605
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 251
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 982
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 898
console.timeEnd('Part 2');
