const fs = require('fs');
const readInput = (name) => fs.readFileSync(`${name}.txt`, 'utf8');
const readInputByDay = (day, suffix = '') => readInput(`./Day${String(day).padStart(2, '0')}${suffix}`);

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

function combinations(nums, targetSum) {
  const list = [];
  const maxMask = 1 << nums.length;
  for (let mask = 1; mask < maxMask; mask++) {
    const combination = [];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      if (mask & (1 << i)) {
        combination.push(nums[i]);
        sum += nums[i];
      }
    }

    if (targetSum === undefined || sum === targetSum) {
      list.push(combination);
    }
  }
  return list;
}

module.exports = { readInput, readInputByDay, permutations, combinations };
