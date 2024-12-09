// Day 9: Disk Fragmenter
// https://adventofcode.com/2024/day/9

const fs = require('fs');
function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('').map(Number);
}

function createFileSystem(input, flatten) {
  let fileId = 0;
  let isFileBlock = true;
  const fragments = [];
  for (const size of input) {
    const block = new Array(size).fill(isFileBlock ? fileId : null);
    if (flatten) {
      fragments.push(...block);
    } else {
      fragments.push(block);
    }

    if (isFileBlock) fileId++;
    isFileBlock = !isFileBlock;
  }
  return fragments;
}

function moveFileLeftmost(fragments) {
  const n = fragments.length;
  let left = 0;
  let right = n - 1;
  while (left < right) {
    while (left < n && fragments[left] !== null) left++;
    while (right >= 0 && fragments[right] === null) right--;

    if (left < right) {
      fragments[left] = fragments[right];
      fragments[right] = null;
    }

    left++;
    right--;
  }
}

function calcCheckSum(fragments) {
  let index = 0;
  let checkSum = 0;
  for (const fileId of fragments) {
    if (fileId === null) break;
    checkSum += index * fileId;
    index++;
  }
  return checkSum;
}

function moveWholeFileBlock(fragments) {
  const n = fragments.length;
  let fileBlockMoved = false;
  do {
    fileBlockMoved = false;

    for (let fileBlockIndex = n - 1; fileBlockIndex >= 0; fileBlockIndex--) {
      const files = fragments[fileBlockIndex];
      if (files.length === 0 || files.at(-1) === null) continue;

      let spaceIndex = 0;
      for (; spaceIndex < n; spaceIndex++) {
        const spaces = fragments[spaceIndex].filter((num) => num === null);
        if (spaces.length >= files.length) break;
      }
      if (spaceIndex > fileBlockIndex) continue;

      const fileFragment = fragments[fileBlockIndex];
      const spaceFragment = fragments[spaceIndex];
      if (fileFragment.length > spaceFragment.length) continue;

      const startIndex = spaceFragment.findIndex((num) => num === null);
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        spaceFragment[startIndex + fileIndex] = files[fileIndex];
      }
      fragments[fileBlockIndex] = new Array(files.length).fill(null);

      fileBlockMoved = true;
    }
  } while (fileBlockMoved);
}

function calcFullCheckSum(fragments) {
  return fragments.flat().reduce((checkSum, fileId, index) => checkSum + (fileId ?? 0) * index, 0);
}

function part1(input) {
  const fragments = createFileSystem(input, true);
  moveFileLeftmost(fragments);
  const checkSum = calcCheckSum(fragments);
  return checkSum;
}

function part2(input) {
  const fragments = createFileSystem(input, false);
  moveWholeFileBlock(fragments);
  const checkSum = calcFullCheckSum(fragments);
  return checkSum;
}

var filename = 'Day09';
console.log('Part 1:', part1(readInput(filename))); // 1928
console.time('Part 1');
console.log('Part 1 Test:', part1(readInput(`${filename}_test`))); // 6432869891895
console.timeEnd('Part 1');

console.log('Part 2:', part2(readInput(filename))); // 2858
console.time('Part 2');
console.log('Part 2 Test:', part2(readInput(`${filename}_test`))); // 6467290479134
console.timeEnd('Part 2');
