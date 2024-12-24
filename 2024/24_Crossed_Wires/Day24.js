// Day 24: Crossed Wires
// https://adventofcode.com/2024/day/24

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n\r\n');
}

function prepareData(input) {
  const [section1, section2] = input;
  const wires = section1.split('\r\n').reduce((map, line) => {
    const [name, value] = line.split(': ');
    map.set(name, Number(value));
    return map;
  }, new Map());
  const gates = section2.split('\r\n').map((line) => {
    const [wire1, gate, wire2, , output] = line.split(/\s+/g);
    return { wire1, gate, wire2, output, executed: false };
  });
  return { wires, gates };
}

const GATES = {
  AND: (wire1, wire2) => wire1 & wire2,
  OR: (wire1, wire2) => wire1 | wire2,
  XOR: (wire1, wire2) => wire1 ^ wire2,
};

function part1({ input, debug = false }) {
  const { wires, gates } = prepareData(input);

  while ([...gates.values()].some((gate) => !gate.executed)) {
    for (const gate of gates) {
      if (gate.executed || !wires.has(gate.wire1) || !wires.has(gate.wire2)) continue;
      gate.executed = true;

      const wire1 = wires.get(gate.wire1);
      const wire2 = wires.get(gate.wire2);
      const gateOutput = GATES[gate.gate](wire1, wire2);
      wires.set(gate.output, gateOutput);
    }
  }

  const zWires = [...wires.entries()].filter(([wire]) => wire.startsWith('z'));
  const zValue = zWires.reduce((acc, [wire, value]) => acc + (BigInt(value) << BigInt(wire.slice(1))), 0n);
  if (debug) console.log(zWires, zValue);
  return Number(zValue);
}

function part2({ input, debug = false }) {
  const { gates } = prepareData(input);
  const zGates = gates.filter(({ output }) => output.startsWith('z'));
  const MAX_BIT = Math.max(...zGates.map(({ output }) => Number(output.slice(1))));
  console.log('MAX BIT', MAX_BIT);

  const incorrect = [];
  for (let bit = 0; bit <= MAX_BIT; bit++) {
    const id = bit.toString().padStart(2, '0');
    const xId = `x${id}`;
    const yId = `y${id}`;
    const zId = `z${id}`;

    const xorGate = gates.find((gate) => hasXY(gate, xId, yId, 'XOR'));
    if (!xorGate) continue;

    const andGate = gates.find((gate) => hasXY(gate, xId, yId, 'AND'));
    if (!andGate) continue;

    const zGate = gates.find((gate) => gate.output === zId);
    if (!zGate) continue;

    if (zGate.gate !== 'XOR') incorrect.push(zGate.output);

    const orGate = gates.find((gate) => gate.wire1 === andGate.output || gate.wire2 === andGate.output);
    if (orGate && orGate.gate !== 'OR' && bit > 0) incorrect.push(andGate.output);

    const afterGate = gates.find((gate) => gate.wire1 === xorGate.output || gate.wire2 === xorGate.output);
    if (afterGate && afterGate.gate === 'OR') incorrect.push(xorGate.output);
  }

  const otherGates = gates.filter(noXYZ).map(({ output }) => output);
  incorrect.push(...otherGates);

  return incorrect.sort().join(',');

  function hasXY(gate, xId, yId, gateType) {
    if (gate.gate !== gateType) return false;
    return (gate.wire1 === xId && gate.wire2 === yId) || (gate.wire1 === yId && gate.wire2 === xId);
  }

  function noXYZ(gate) {
    if (gate.gate !== 'XOR') return false;

    const XY = 'xy';
    return !XY.includes(gate.wire1[0]) && !XY.includes(gate.wire2[0]) && gate.output[0] !== 'z';
  }
}

const filename = 'Day24';
const input = readInput(filename);
const inputDemo = readInput(`${filename}_demo`);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 4
console.log('Part 1 Demo:', part1({ input: inputDemo, debug: true })); // 2024
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 51657025112326
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); //
console.log('Part 2 Demo:', part2({ input: inputDemo, debug: true })); // mjb,tgd,wpb
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // gbf,hdt,jgt,mht,nbf,z05,z09,z30
console.timeEnd('Part 2');
