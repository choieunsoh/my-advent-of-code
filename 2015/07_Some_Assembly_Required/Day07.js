// Day 7: Some Assembly Required
// https://adventofcode.com/2015/day/7

const utils = require('../../utils');

function prepareData(input) {
  return input.split('\r\n').map(parseInstruction);
}

const MASK = 0xffff;
const OPERATIONS = {
  ASSIGN: (a) => a & MASK,
  NOT: (a) => ~a & MASK,
  AND: (a, b) => a & b & MASK,
  OR: (a, b) => (a | b) & MASK,
  LSHIFT: (a, b) => (a << b) & MASK,
  RSHIFT: (a, b) => (a >> b) & MASK,
};

function parseInstruction(data) {
  const parts = data.split(/\s+/);
  if (parts.length === 3) {
    return {
      operation: 'ASSIGN',
      input1: parts[0],
      output: parts[2],
      executed: false,
    };
  } else if (parts.length === 4) {
    return {
      operation: 'NOT',
      input1: parts[1],
      output: parts[3],
      executed: false,
    };
  } else {
    return {
      operation: parts[1],
      input1: parts[0],
      input2: parts[2],
      output: parts[4],
      executed: false,
    };
  }
}

function part1(input) {
  const instructions = prepareData(input);
  return executeCircuit(instructions, 'a');
}

function part2(input) {
  const instructions = prepareData(input);
  const aValue = executeCircuit(instructions, 'a');
  return executeCircuit(instructions, 'a', new Map([['b', aValue]]));
}

function executeCircuit(instructions, target, initialValues = new Map()) {
  const wires = new Map(initialValues);
  const executed = new Set(wires.keys());
  while (executed.size < instructions.length) {
    for (const { operation, input1, input2, output } of instructions) {
      if (executed.has(output) || !isValid(input1) || (input2 && !isValid(input2))) {
        continue;
      }

      const value1 = getValue(input1, wires);
      const value2 = input2 ? getValue(input2, wires) : null;

      wires.set(output, OPERATIONS[operation](value1, value2));
      executed.add(output);
    }
  }
  return wires.get(target);

  function isValid(input) {
    return !isNaN(input) || wires.has(input);
  }

  function getValue(input) {
    return isNaN(input) ? wires.get(input) : Number(input);
  }
}

const day = 7;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input)); // 50
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 16076
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 50
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 2797
console.timeEnd('Part 2');
