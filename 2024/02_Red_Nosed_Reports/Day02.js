// Day 2: Red-Nosed Reports
// https://adventofcode.com/2024/day/2

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n').filter(Boolean);
};

function isSafeReport(nums, allowOneRemove = false) {
  if (nums.length === 0) return false;

  const [MIN_DIFF, MAX_DIFF] = [1, 3];
  const direction = nums[1] - nums[0] > 0 ? 1 : -1;
  for (let i = 1; i < nums.length; i++) {
    const diff = (nums[i] - nums[i - 1]) * direction;
    if (diff >= MIN_DIFF && diff <= MAX_DIFF) continue;

    if (!allowOneRemove) return false;

    // 1 2 3 [4] 5 6 >> 1 2 3 5 6
    // 1 2 [3] 4 5 6 >> 1 2 4 5 6
    // 1 [2] 3 4 5 6 >> 1 3 4 5 6
    const newNums = nums.filter((_, index) => index !== i);
    if (isSafeReport(newNums, false)) return true;

    for (let removedIndex = i - 1; removedIndex >= Math.max(0, i - 2); removedIndex--) {
      newNums[removedIndex] = nums[removedIndex + 1];
      if (isSafeReport(newNums, false)) return true;
    }

    return false;
  }
  return true;
}

function run(input, canRemove) {
  const data = prepareInput(input);
  return data.map((nums) => isSafeReport(nums, canRemove)).filter(Boolean).length;
}

function prepareInput(input) {
  return input.map((line) => line.split(' ').map(Number));
}

function part1(input) {
  return run(input, false);
}

function part2(input) {
  return run(input, true);
}

console.log(part1(readInput('Day02'))); // 2
console.log(part1(readInput('Day02_test'))); // 686

console.log(part2(readInput('Day02'))); // 4
console.log(part2(readInput('Day02_test'))); // 717
