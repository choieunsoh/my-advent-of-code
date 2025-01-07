// Day 16: Aunt Sue
// https://adventofcode.com/2015/day/16

const utils = require('../../utils');

const day = 16;
const inputTest = utils.readInputByDay(day, '_test');

function prepareData(input) {
  // Sue 1: cars: 9, akitas: 3, goldfish: 0
  const pattern = /Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/;
  return input.split('\r\n').map((line) => {
    const match = line.match(pattern);
    return {
      id: Number(match[1]),
      [match[2]]: Number(match[3]),
      [match[4]]: Number(match[5]),
      [match[6]]: Number(match[7]),
    };
  });
}

function part1(input) {
  const aunts = prepareData(input);
  for (const aunt of aunts) {
    if (isMatch(aunt)) {
      return aunt.id;
    }
  }
  return -1;

  function isMatch(aunt) {
    const ticketTape = {
      children: 3,
      cats: 7,
      samoyeds: 2,
      pomeranians: 3,
      akitas: 0,
      vizslas: 0,
      goldfish: 5,
      trees: 3,
      cars: 2,
      perfumes: 1,
    };

    for (const [key, value] of Object.entries(ticketTape)) {
      if (aunt[key] !== undefined && aunt[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

function part2(input) {
  const aunts = prepareData(input);
  for (const aunt of aunts) {
    if (isMatch(aunt)) {
      return aunt.id;
    }
  }
  return -1;

  function isMatch(aunt) {
    const ticketTape = {
      children: 3,
      cats: 7,
      samoyeds: 2,
      pomeranians: 3,
      akitas: 0,
      vizslas: 0,
      goldfish: 5,
      trees: 3,
      cars: 2,
      perfumes: 1,
    };

    for (const [key, value] of Object.entries(ticketTape)) {
      if (aunt[key] === undefined) continue;
      switch (key) {
        case 'cats':
        case 'trees':
          if (aunt[key] <= value) return false;
          break;
        case 'pomeranians':
        case 'goldfish':
          if (aunt[key] >= value) return false;
          break;
        default:
          if (aunt[key] !== value) return false;
          break;
      }
    }
    return true;
  }
}

console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 373
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 260
console.timeEnd('Part 2');
