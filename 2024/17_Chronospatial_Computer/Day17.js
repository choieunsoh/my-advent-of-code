// Day 17: Chronospatial Computer
// https://adventofcode.com/2024/day/17

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8');
}

function runProgram(input, part1 = true, debug = false) {
  const instructions = [
    () => (a = Math.floor(a / (1 << combo()))),
    () => (b = b ^ program[ptr + 1]),
    () => (b = combo() & 7),
    () => a && (ptr = program[ptr + 1] - 2),
    () => (b = b ^ c),
    () => output.push(combo() & 7),
    () => (b = Math.floor(a / (1 << combo()))),
    () => (c = Math.floor(a / (1 << combo()))),
  ];

  const [registerA, registerB, registerC, ...program] = input.match(/\d+/g)?.map(Number);
  const output = [];

  let [a, b, c] = [registerA, registerB, registerC];
  let ptr = 0;

  if (part1) {
    run();
    return output.join(',');
  } else {
    return findInitialA();
  }

  function run() {
    output.length = 0;
    ptr = 0;
    while (program[ptr] != null) {
      instructions[program[ptr]]();
      ptr += 2;
    }
  }

  function combo() {
    return [0, 1, 2, 3, a, b, c][program[ptr + 1]];
  }

  function findInitialA(nextVal = 0, i = program.length - 1) {
    if (i < 0) return nextVal;
    const start = nextVal * 8;
    const end = start + 8;
    if (debug) console.log(nextVal, start, end);
    for (let aVal = start; aVal < end; aVal++) {
      a = aVal;
      run();
      if (output[0] === program[i]) {
        if (debug) console.log(aVal, output, program[i], i);
        const finalVal = findInitialA(aVal, i - 1);
        if (finalVal >= 0) return finalVal;
      }
    }
    return -1;
  }
}

function part1({ input, debug = false }) {
  return runProgram(input, true, debug);
}

function part2({ input, debug = false }) {
  return runProgram(input, false, debug);
}

const filename = 'Day17';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 4,6,3,5,6,3,5,2,1,0
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 6,7,5,2,1,3,5,1,7
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 29328
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 216549846240877
console.timeEnd('Part 2');
