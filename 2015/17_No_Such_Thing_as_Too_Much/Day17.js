// Day 17: No Such Thing as Too Much
// https://adventofcode.com/2015/day/17

const utils = require('../../utils');

const day = 17;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  return input.split('\r\n').map(Number);
}

function calculateCombinations(nums, targetSum) {
  const map = new Map();
  const maxMask = 1 << nums.length;
  for (let mask = 1; mask < maxMask; mask++) {
    const combination = [];
    for (let i = 0; i < nums.length; i++) {
      if (mask & (1 << i)) {
        combination.push(nums[i]);
      }
    }
    const sum = combination.reduce((a, b) => a + b, 0);
    if (sum === targetSum) {
      const len = combination.length;
      map.set(len, (map.get(len) ?? 0) + 1);
    }
  }
  return map;
}

function part1(input, eggnog) {
  const containers = prepareData(input);
  const memo = new Map();
  return dfs(0, 0);

  function dfs(i, sum) {
    const key = `${i},${sum}`;
    if (memo.has(key)) return memo.get(key);
    if (sum === eggnog) return 1;
    if (sum > eggnog) return 0;
    if (i === containers.length) return 0;

    const take = dfs(i + 1, sum + containers[i]);
    const skip = dfs(i + 1, sum);
    const ways = take + skip;
    memo.set(key, ways);
    return ways;
  }
}

function part2(input, eggnog) {
  const containers = prepareData(input);
  const map = calculateCombinations(containers, eggnog);
  const minContainers = Math.min(...map.keys());
  return map.get(minContainers);
}

console.log('Part 1:', part1(input, 25)); // 4
console.time('Part 1');
console.log('Part 1:', part1(inputTest, 150)); // 1638
console.timeEnd('Part 1');

console.log('Part 2:', part2(input, 25)); // 3
console.time('Part 2');
console.log('Part 2:', part2(inputTest, 150)); // 17
console.timeEnd('Part 2');
