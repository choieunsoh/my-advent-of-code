// Day 5: Print Queue
// https://adventofcode.com/2024/day/5

const fs = require('fs');
var readInput = function (filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8');
};

function toNumArray(input, separator) {
  return input.split('\n').map((line) => line.split(separator).map(Number));
}

function prepareData(input) {
  const [firstSection, secondSection] = input.trim().split('\n\n');
  const rules = toNumArray(firstSection, '|');
  const updates = toNumArray(secondSection, ',');
  return [rules, updates];
}

function isValidOrder(rules, list) {
  const map = list.reduce((map, num, index) => map.set(num, index), new Map());
  for (const [x, y] of rules) {
    const xIndex = map.get(x) ?? -1;
    const yIndex = map.get(y) ?? -1;

    if (xIndex !== -1 && yIndex !== -1 && xIndex > yIndex) {
      return false;
    }
  }
  return true;
}

function findMiddleSum(rules, updates) {
  let middleSum = 0;
  for (const list of updates) {
    if (isValidOrder(rules, list)) {
      const midIndex = list.length >> 1;
      middleSum += list[midIndex];
    }
  }
  return middleSum;
}

function reorderAndSum(rules, updates) {
  let middleSum = 0;
  for (const list of updates) {
    if (!isValidOrder(rules, list)) {
      const sortedList = reorderUnsortedList(list);
      const midIndex = sortedList.length >> 1;
      middleSum += sortedList[midIndex];
    }
  }
  return middleSum;

  function reorderUnsortedList(list) {
    const map = list.reduce((map, num, index) => map.set(num, index), new Map());
    const graph = new Map();
    const inDegree = new Map();

    list.forEach((page) => {
      graph.set(page, []);
      inDegree.set(page, 0);
    });

    for (const [x, y] of rules) {
      if (map.has(x) && map.has(y)) {
        graph.get(x).push(y);
        inDegree.set(y, inDegree.get(y) + 1);
      }
    }

    const queue = [];
    for (const [node, degree] of inDegree) {
      if (degree === 0) queue.push(node);
    }

    const sortedList = [];
    while (queue.length > 0) {
      const node = queue.shift();
      sortedList.push(node);
      for (const neighbor of graph.get(node)) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) queue.push(neighbor);
      }
    }
    return sortedList;
  }
}

function part1(input) {
  const [rules, updates] = prepareData(input);
  return findMiddleSum(rules, updates);
}

function part2(input) {
  const [rules, updates] = prepareData(input);
  return reorderAndSum(rules, updates);
}

console.log(part1(readInput('Day05'))); // 143
console.log(part1(readInput('Day05_test'))); // 6612

console.log(part2(readInput('Day05'))); // 123
console.log(part2(readInput('Day05_test'))); // 4944
