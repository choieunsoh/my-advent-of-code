// Day 8: Matchsticks
// https://adventofcode.com/2015/day/8

const utils = require('../../utils');

const day = 8;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

const ESCAPE_SEQUENCES = {
  SLASH: /\\{2}/g,
  QUOTE: /\\"/g,
  ASCII: /\\x[0-9a-f]{2}/g,
};

function countEscapeSequences(line) {
  const trimmedLine = line.slice(1, -1);
  return {
    slashCount: (trimmedLine.match(ESCAPE_SEQUENCES.SLASH) ?? []).length,
    quoteCount: (trimmedLine.match(ESCAPE_SEQUENCES.QUOTE) ?? []).length,
    asciiCount: (trimmedLine.match(ESCAPE_SEQUENCES.ASCII) ?? []).length,
  };
}

function calculateAddedLength(line, initialLength, adjustments) {
  const { slashCount, quoteCount, asciiCount } = countEscapeSequences(line);
  return (
    initialLength + adjustments.slash * slashCount + adjustments.quote * quoteCount + adjustments.ascii * asciiCount
  );
}

function part1(input) {
  const lines = input.split('\r\n');
  const adjustments = {
    slash: 1, // \\ -> \
    quote: 1, // \" -> "
    ascii: 3, // \xAA -> single character
  };
  return lines.reduce((total, line) => total + calculateAddedLength(line, 2, adjustments), 0);
}

function part2(input) {
  const lines = input.split('\r\n');
  const adjustments = {
    slash: 2, // \\ -> \\\\
    quote: 2, // \" -> \\"
    ascii: 1, // \xAA -> \\xAA
  };
  return lines.reduce((total, line) => total + calculateAddedLength(line, 4, adjustments), 0);
}

console.log('Part 1:', part1(input)); // 12
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 1371
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 19
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 2117
console.timeEnd('Part 2');
