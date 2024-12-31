// Day 5: Doesn't He Have Intern-Elves For This?
// https://adventofcode.com/2015/day/5

const utils = require('../../utils');

function hasTripleVowels(str) {
  const pattern = /[aeiou]/g;
  const vowels = str.match(pattern);
  return vowels?.length > 2;
}

function hasDoubleLetters(str) {
  const pattern = /([a-z])\1/;
  const doubleLetters = str.match(pattern);
  return doubleLetters?.length > 0;
}

function hasNoForbiddenPairs(str) {
  const pattern = /ab|cd|pq|xy/;
  const badPairs = str.match(pattern);
  return !badPairs || badPairs.length === 0;
}

function hasTwiceLetterPair(str) {
  const pattern = /([a-z]{2})[a-z]*\1/;
  const twicePairs = str.match(pattern);
  return twicePairs?.length > 0;
}

function hasSingleLetterBetweenThem(str) {
  const pattern = /([a-z])[a-z]\1/;
  const singleLetterBetweenThem = str.match(pattern);
  return singleLetterBetweenThem?.length > 0;
}

function isNiceStringPart1(str) {
  return hasTripleVowels(str) && hasDoubleLetters(str) && hasNoForbiddenPairs(str);
}

function isNiceStringPart2(str) {
  return hasTwiceLetterPair(str) && hasSingleLetterBetweenThem(str);
}

function part1(input) {
  return input.split('\r\n').filter(isNiceStringPart1).length;
}

function part2(input) {
  return input.split('\r\n').filter(isNiceStringPart2).length;
}

const day = 5;
const input = utils.readInputByDay(day);
const input2 = utils.readInputByDay(day, '_2');
const inputTest = utils.readInputByDay(day, '_test');

console.log('Part 1:', part1(input)); // 2
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 238
console.timeEnd('Part 1');

console.log('Part 2:', part2(input2)); // 2
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 69
console.timeEnd('Part 2');
