// Day 12: Garden Groups
// https://adventofcode.com/2024/day/12

const fs = require('fs');

function readInput(filename) {
  return fs
    .readFileSync(`${filename}.txt`, 'utf8')
    .split(/\s+/g)
    .map((line) => line.trim().split(''));
}

function calculateTotalPrice(map, enabledDiscount, debug = false) {
  const rows = map.length;
  const cols = map[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  let totalPrice = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (visited[row][col]) continue;

      const [area, perimeter, edges] = calculate(map, visited, row, col, map[row][col]);
      const price = enabledDiscount ? edges : perimeter;
      totalPrice += area * price;
      if (debug) console.log(map[row][col], area, perimeter, edges, area * price, totalPrice);
    }
  }
  return totalPrice;
}

function calculate(map, visited, startRow, startCol, plant) {
  const rows = map.length;
  const cols = map[0].length;
  const directions = [1, 0, -1, 0, 1];

  let area = 0;
  let perimeter = 0;
  let edgeCount = 0;
  const edges = new Set();

  const queue = [[startRow, startCol]];
  visited[startRow][startCol] = true;

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    area++;

    const neighbors = getNeighbors(row, col);
    for (let d = 0; d < neighbors.length; d++) {
      const [newRow, newCol] = neighbors[d];

      if (!isValidPlant(newRow, newCol)) {
        perimeter++;

        const key = `${newRow},${newCol},${d}`;
        edgeCount++;
        edges.add(key);

        const borders = getNeighbors(newRow, newCol);
        for (const [borderRow, borderCol] of borders) {
          const borderKey = `${borderRow},${borderCol},${d}`;
          if (edges.has(borderKey)) {
            edgeCount--;
          }
        }
      } else if (!visited[newRow][newCol]) {
        visited[newRow][newCol] = true;
        queue.push([newRow, newCol]);
      }
    }
  }
  return [area, perimeter, edgeCount];

  function isValidPlant(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols && map[row][col] === plant;
  }

  function getNeighbors(row, col) {
    const neighbors = [];
    for (let d = 0; d < 4; d++) {
      const newRow = row + directions[d];
      const newCol = col + directions[d + 1];
      neighbors.push([newRow, newCol]);
    }
    return neighbors;
  }
}

function part1(map, debug = false) {
  return calculateTotalPrice(map, false, debug);
}

function part2(map, debug = false) {
  return calculateTotalPrice(map, true, debug);
}

const filename = 'Day12';
const map = readInput(filename);
const mapDemo = readInput(`${filename}_demo`);
const mapTest = readInput(`${filename}_test`);

console.log('Part 1 Demo:', part1(mapDemo, true)); // 140
console.log('Part 1:', part1(map)); // 1930
console.time('Part 1');
console.log('Part 1 Test:', part1(mapTest)); // 1549354
console.timeEnd('Part 1');

console.log('Part 2 Demo:', part2(mapDemo, true)); // 80
console.log('Part 2:', part2(map)); // 1206
console.time('Part 2');
console.log('Part 2 Test:', part2(mapTest)); // 937032
console.timeEnd('Part 2');
