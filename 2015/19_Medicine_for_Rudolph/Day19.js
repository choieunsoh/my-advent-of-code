// Day 19: Medicine for Rudolph
// https://adventofcode.com/2015/day/19

const utils = require('../../utils');

const day = 19;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  const [section1, section2] = input.split('\r\n\r\n');
  const lines = section1.split('\r\n').map((line) => line.split(' => '));
  const replacements = new Map();
  for (const [key, value] of lines) {
    if (!replacements.has(key)) {
      replacements.set(key, []);
    }
    replacements.get(key).push(value);
  }
  return {
    replacements,
    molecule: section2.trim(),
  };
}

function part1(input) {
  const { replacements, molecule } = prepareData(input);
  const uniqueMolecules = new Set();
  for (const [key, values] of replacements) {
    const re = new RegExp(key, 'g');
    let match;
    while ((match = re.exec(molecule)) !== null) {
      for (const value of values) {
        const newMolecule = molecule.slice(0, match.index) + value + molecule.slice(match.index + key.length);
        uniqueMolecules.add(newMolecule);
      }
    }
  }
  return uniqueMolecules.size;
}

function part2(input) {
  const { replacements, molecule } = prepareData(input);
  const reverseReplacements = [];
  for (const [key, values] of replacements) {
    for (const value of values) {
      reverseReplacements.push([value, key]);
    }
  }
  reverseReplacements.sort((a, b) => b[0].length - a[0].length);

  let steps = 0;
  let currentMolecule = molecule;
  while (currentMolecule !== 'e') {
    for (const [value, key] of reverseReplacements) {
      if (currentMolecule.includes(value)) {
        currentMolecule = currentMolecule.replace(value, key);
        steps++;
        break;
      }
    }
  }

  return steps;
}

console.log('Part 1:', part1(input)); // 7
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 518
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 6
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 200
console.timeEnd('Part 2');
/*
e => H
e => O
H => HO
H => OH
O => HH

H > HO > HOO, HHH
H > OH > HHH
O > HH > HOH, OHH, HHO, HOH
*/
