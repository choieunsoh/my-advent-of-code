// Day 13: Claw Contraption
// https://adventofcode.com/2024/day/13

const fs = require('fs');

function readInput(filename) {
  return fs
    .readFileSync(`${filename}.txt`, 'utf8')
    .split('\r\n\r\n')
    .map((line) => line.split('\r\n'));
}

function buildClawMachines(config, conversionError, limitToken) {
  const machines = [];
  for (const machineConfig of config) {
    const [buttonAConfig, buttonBConfig, prizeConfig] = machineConfig;

    const buttonA = parsedButton(buttonAConfig, 3);
    const buttonB = parsedButton(buttonBConfig, 1);
    const prize = parsedPrize(prizeConfig, conversionError);
    const machine = { buttonA, buttonB, prize };

    const { a, b, win } = solveLinearEquations(machine, limitToken);
    machine.a = a;
    machine.b = b;
    machine.win = win;
    machine.totalCost = win ? machine.a * machine.buttonA.cost + machine.b * machine.buttonB.cost : 0;

    machines.push(machine);
  }
  return machines;
}

function parsedButton(buttonConfig, cost) {
  // Button A: X+94, Y+34
  const regex = /Button (\w): X([+-]?\d+), Y([+-]?\d+)/;
  const match = buttonConfig.match(regex);

  return {
    x: Number(match[2]),
    y: Number(match[3]),
    cost,
  };
}

function parsedPrize(prizeConfig, error) {
  // Prize: X=8400, Y=5400
  const regex = /Prize: X=(\d+), Y=(\d+)/;
  const match = prizeConfig.match(regex);

  return {
    x: Number(match[1]) + error,
    y: Number(match[2]) + error,
  };
}

function solveLinearEquations(machine, limit = 100) {
  const [a1, b1] = [machine.buttonA.x, machine.buttonB.x];
  const [a2, b2] = [machine.buttonA.y, machine.buttonB.y];
  const [c1, c2] = [machine.prize.x, machine.prize.y];

  const determinant = a1 * b2 - a2 * b1;
  const a = (c1 * b2 - c2 * b1) / determinant;
  const b = (a1 * c2 - a2 * c1) / determinant;

  return { a, b, win: isWin(a, b) };

  function isWin(a, b) {
    if (limit > 0 && (a > limit || b > limit)) return false;
    return !isFloat(a) && !isFloat(b);
  }

  function isFloat(value) {
    return typeof value === 'number' && Number.isFinite(value) && !Number.isInteger(value);
  }
}

function part1({ input, error = 0, limit = 100, debug = false }) {
  const machines = buildClawMachines(input, error, limit);
  if (debug) console.log(machines);
  return machines.reduce((sum, machine) => sum + machine.totalCost, 0);
}

function part2({ input, error = ERROR, limit = 0, debug = false }) {
  const machines = buildClawMachines(input, error, limit);
  return machines.reduce((sum, machine) => sum + machine.totalCost, 0);
}

const ERROR = 10_000_000_000_000;
const filename = 'Day13';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 480
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 36758
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // 875318608908
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 76358113886726
console.timeEnd('Part 2');
