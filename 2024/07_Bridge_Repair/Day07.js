// Day 7: Bridge Repair
// https://adventofcode.com/2024/day/7

const fs = require('fs');
function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\n');
}

function parsedEquations(input) {
  return input.map((line) => {
    const [target, nums] = line.split(': ');
    return {
      target: Number(target),
      nums: nums.split(' ').map(Number),
    };
  });
}

function solveEquations(equations, enabledConcat = false) {
  return equations.map(({ target, nums }) => {
    const solution = evaluate(nums, target, enabledConcat);
    return {
      target,
      nums,
      solution,
      result: solution ? target : 0,
    };
  });
}

function evaluate(nums, target, enabledConcat = false, index = 0, currentValue = nums[0], expression = `${nums[0]}`) {
  if (index === nums.length - 1) {
    if (currentValue === target) {
      return expression;
    }
    return null;
  }

  const nextIndex = index + 1;
  const nextValue = nums[nextIndex];

  const addValue = currentValue + nextValue;
  const addExpression = `${expression} + ${nextValue}`;
  const addResult = evaluate(nums, target, enabledConcat, nextIndex, addValue, addExpression);
  if (addResult) return addResult;

  const multiplyValue = currentValue * nextValue;
  const multiplyExpression = `${expression} * ${nextValue}`;
  const multiplyResult = evaluate(nums, target, enabledConcat, nextIndex, multiplyValue, multiplyExpression);
  if (multiplyResult) return multiplyResult;

  if (enabledConcat) {
    const concatValue = Number(`${currentValue}${nextValue}`);
    const concatExpression = `${expression} || ${nextValue}`;
    const concatResult = evaluate(nums, target, enabledConcat, nextIndex, concatValue, concatExpression);
    if (concatResult) return concatResult;
  }

  return null;
}

function part1(input) {
  const equations = parsedEquations(input);
  const solutions = solveEquations(equations);
  return solutions.reduce((sum, { result }) => sum + result, 0);
}

function part2(input) {
  const equations = parsedEquations(input);
  const solutions = solveEquations(equations, true);
  return solutions.reduce((sum, { result }) => sum + result, 0);
}

console.log(part1(readInput('Day07'))); // 3749
console.time('Part 1');
console.log(part1(readInput('Day07_test'))); // 4122618559853
console.timeEnd('Part 1');

console.log(part2(readInput('Day07'))); // 11387
console.time('Part 2');
console.log(part2(readInput('Day07_test'))); // 227615740238334
console.timeEnd('Part 2');
