// Day 22: Monkey Market
// https://adventofcode.com/2024/day/22

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n').map(BigInt);
}

const MOD = 16777216n;

function nextRandomSecret(secret) {
  secret = ((secret << 6n) ^ secret) % MOD;
  secret = ((secret >> 5n) ^ secret) % MOD;
  secret = ((secret << 11n) ^ secret) % MOD;
  return secret;
}

function nextNthSecret(secret, n) {
  for (let i = 0; i < n; i++) {
    secret = nextRandomSecret(secret);
  }
  return secret;
}

function part1({ input, debug = false }) {
  let sum = 0n;
  for (const secret of input) {
    const nthSecret = nextNthSecret(secret, 2000);
    sum += nthSecret;
  }
  return Number(sum);
}

function part2({ input, debug = false }) {
  let maxPrice = 0;
  const sequences = new Map();
  for (const initSecret of input) {
    const visited = new Set();
    const changes = [];
    let secret = initSecret;
    for (let i = 0; i < 2000; i++) {
      const nextSecret = nextRandomSecret(secret);
      const currentPrice = Number(secret % 10n);
      const nextPrice = Number(nextSecret % 10n);
      const change = nextPrice - currentPrice;
      changes.push(change);
      secret = nextSecret;

      if (changes.length === 4) {
        const sequence = changes.join(',');
        if (!visited.has(sequence)) {
          visited.add(sequence);

          const totalPrice = (sequences.get(sequence) ?? 0) + nextPrice;
          sequences.set(sequence, totalPrice);
          maxPrice = Math.max(maxPrice, totalPrice);
        }
        changes.shift();
      }
    }
  }
  return maxPrice;
}

const filename = 'Day22';
const input = readInput(filename);
const input2 = readInput(`${filename}-2`);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 37327623
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 12664695565
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input: input2, debug: true })); // 23
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 1444
console.timeEnd('Part 2');
