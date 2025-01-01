// Day 11: Corporate Policy
// https://adventofcode.com/2015/day/11

let input = 'abcdefgh';
let input2 = 'ghijklmn';
let inputTest = 'hepxcrrq';

function incrementPassword(str) {
  const chars = str.split('');
  let i = chars.length - 1;
  while (i >= 0) {
    if (chars[i] === 'z') {
      chars[i--] = 'a';
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      break;
    }
  }
  return chars.join('');
}

function isValidPassword(password) {
  const forbidden = password.match(/[iol]/g);
  const doublePairs = password.match(/([a-z])\1.*([a-z])\2/);
  const straight = password.match(
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/
  );
  return !forbidden && doublePairs && straight;
}

function part1(input) {
  while (!isValidPassword(input)) {
    input = incrementPassword(input);
  }
  return input;
}

function part2(input) {
  input = incrementPassword(input);
  while (!isValidPassword(input)) {
    input = incrementPassword(input);
  }
  return input;
}

input = part1(input);
console.log('Part 1:', input); // abcdffaa
input2 = part1(input2);
console.log('Part 1:', input2); // ghjaabcc
console.time('Part 1');
inputTest = part1(inputTest);
console.log('Part 1:', inputTest); // hepxxyzz
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // abcdffbb
console.log('Part 2:', part2(input2)); // ghjbbcdd
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // heqaabcc
console.timeEnd('Part 2');
