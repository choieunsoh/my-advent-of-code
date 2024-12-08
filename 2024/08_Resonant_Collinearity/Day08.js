// Day 8: Resonant Collinearity
// https://adventofcode.com/2024/day/8

const fs = require('fs');
function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8');
}

function parsedGrid(input) {
  return input
    .split('\n')
    .filter(Boolean)
    .map((row) => row.split(''));
}

function isInBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function computeAntennaNodes(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const antennaMap = new Map();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const antenna = grid[row][col];
      if (antenna !== '.') {
        if (!antennaMap.has(antenna)) {
          antennaMap.set(antenna, []);
        }
        antennaMap.get(antenna).push({ row, col });
      }
    }
  }
  return antennaMap;
}

function computeAntiNodes(grid, includeSelfNode = false, infiniteFrequency = false) {
  const antennaMap = computeAntennaNodes(grid);
  const antiNodeSet = new Set();
  for (const [, nodes] of antennaMap) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        if (includeSelfNode) {
          antiNodeSet.add(`${node1.row},${node1.col}`);
          antiNodeSet.add(`${node2.row},${node2.col}`);
        }

        const diffRow = node1.row - node2.row;
        const diffCol = node1.col - node2.col;

        generateAntiNodes(grid, node2, diffRow, diffCol, infiniteFrequency, antiNodeSet);
        generateAntiNodes(grid, node1, -diffRow, -diffCol, infiniteFrequency, antiNodeSet);
      }
    }
  }
  return antiNodeSet;
}

function generateAntiNodes(grid, startNode, diffRow, diffCol, infiniteFrequency, antiNodeSet) {
  let distanceFactor = 2;
  while (true) {
    const row = startNode.row + diffRow * distanceFactor;
    const col = startNode.col + diffCol * distanceFactor;

    if (!isInBounds(grid, row, col)) break;

    grid[row][col] = '#';
    antiNodeSet.add(`${row},${col}`);

    if (!infiniteFrequency) break;

    distanceFactor++;
  }
}

function part1(input) {
  const grid = parsedGrid(input);
  const antiNodes = computeAntiNodes(grid, false, false);
  grid.forEach((row) => console.log(row.join('')));
  return antiNodes.size;
}

function part2(input) {
  const grid = parsedGrid(input);
  const antiNodes = computeAntiNodes(grid, true, true);
  grid.forEach((row) => console.log(row.join('')));
  return antiNodes.size;
}

console.log(part1(readInput('Day08'))); // 14
console.time('Part 1');
console.log(part1(readInput('Day08_test'))); // 354
console.timeEnd('Part 1');

console.log(part2(readInput('Day08'))); // 34
console.time('Part 2');
console.log(part2(readInput('Day08_test'))); // 1263
console.timeEnd('Part 2');

/*
.....#..#...#..#..#...##.###.####.#.......#..#....
.#####..##.##..##.#.#.#.....##.#...#.#.#....#.#...
..#.#...###.#.....#.##...######..####C.#...#...#..
#.##.....###.#.##..###....##.#.####.###...##.##..#
.##...#.###.#b.#####.u.#.##.###w#......#.#.3...##.
.##......#.#.##..######.##.#........#...##.#.#.##.
#####..#...#K###.#..#..####....#y#.....#..##..#.##
....#.......#..##.######.#.#.#..#.P5..##.#..B#...#
#..U.#.....##.###.#.2##.#.###.#...#..###.#C..#....
#.....#...###.#######P.##.....w##.#.###C#...#.I#5#
.#.....###..####..###.##..#..##....##.#.x#..#....#
.#.#...###..#....#####...1.......##....#......u#..
#...#.#..###..#..##.#.##.#.####r.####....s.#..#...
##2##.###.#.#...t##T.#.###.#.r..#...###...#..#.I##
#.#....#####..#t##T...#.##.###.###..###....#5.##..
...#.#..#.#.####.#.#.#####..1.#..M.t##.#...####...
.#.V####U..#.##.###...###.#.##..N.S....###...I.#.#
...####.##..#####..###.#.#O.#..v#..#.#....#.S##.#.
.#.####..####.###.#####.s###.....#.#.#...##...3###
..#.6###.###C#..##..##..##Tf#3##.##...#.#..#.#....
#..##.#####F#..#.#.#..V.##.##.#..k#.#N...#..H#..#.
#.##.##.##.###.#..#U#.#.##..##.0#...#.H.y.......##
##.#..######.....#.#..##..#P..###.0.#....#.##...##
##....##.#U#...#.##.#.#R.##..#.#..##s#.....##.##..
###.#####..###.##.####O....##2..#.#.##.H###..B#...
.########..######..######..#...###.#.#.#.S.#.....#
...####.##..c.#...####.#.##...#...##..d....######.
########.###..##F.#.#.##m#..#......#.#.##.#7...#.#
.##.##.###.###..##..#.#..##..#....#.##.S##.##..###
####..j.k.###.#.##.....V#.#..#.##..###....#..#.#..
###.#.#...#.####.L##...K...#.#...#...##..#.#.###..
.#....#F...#..###.##...##..####..#.#M#.###.#...#..
##.....#..#..#..###.#.m1....a#R...#...####...#...#
..#...#4#...#.#####D.#......#.##......##.##.......
k...##.#...#.9##.#.####..#..#.####.###M...#.....#.
#..#.#b.#.#..#......#.##V...h#.###.#....#.###..#..
A##....###9#Xl###.#.#...##.##..R##.........##..##.
4.##....#.#...#..#.##....#D#..######....#.#..#.##.
.A.#.#.#...#..##.#...#..######.M.7##....#...#.##.#
....####..n.#.##..#.#...#.##.###.##.##...#.##.##..
..#j##..b#....#...##.###.p..#######..####.####..#.
...##.#..#.##k..##.#...p.##..#.#####.##.....####.#
.#.#.#.W4..######.##.##X#....###J##.##v#..##.##..#
.##.#...W#d..c.#.###A..#...#.#.###..#.###...#.#..#
.##.#..#.#l##.####..##.#..#o..#.##Y###h.##.......#
#..#.A....#.#.###.###.#.#.##.....##..####.##..#...
#.j..#....##.###.#...#.#.###...#..##..##.######...
a9.lX..##..##...#..#...Y.##...#....#.###....#.###.
..#...#a.###.#..#.#......Y#.##.#.##.#..#..#.##.###
.#.#...#l.#.#.#.###.#.##.###...##...##.###....###.
*/
