// Day 10: Elves Look, Elves Say
// https://adventofcode.com/2015/day/10

const input = '1';
const inputTest = '1113222113';

function lookAndSay(sequence) {
  let result = '';
  let currentChar = sequence[0];
  let count = 1;

  for (let i = 1; i <= sequence.length; i++) {
    if (i === sequence.length || sequence[i] !== currentChar) {
      result += count + currentChar;
      currentChar = sequence[i];
      count = 1;
    } else {
      count++;
    }
  }

  return result;
}

function generateLookAndSaySequence(input, iterations) {
  let sequence = input;
  for (let i = 0; i < iterations; i++) {
    sequence = lookAndSay(sequence);
  }

  return sequence.length;
}

function part1(input) {
  return generateLookAndSaySequence(input, 40);
}

function part2(input) {
  return generateLookAndSaySequence(input, 50);
}

console.log('Part 1:', part1(input)); // 82350
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 252594
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 1166642
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 3579328
console.timeEnd('Part 2');
