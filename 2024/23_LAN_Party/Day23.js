// Day 23: RAM Party
// https://adventofcode.com/2024/day/23

const fs = require('fs');

function readInput(filename) {
  return fs
    .readFileSync(`${filename}.txt`, 'utf8')
    .split(/\s+/g)
    .map((line) => line.split('-'));
}

function findTriangles(connections) {
  const graph = new Map();
  for (const [node1, node2] of connections) {
    if (!graph.has(node1)) graph.set(node1, new Set());
    if (!graph.has(node2)) graph.set(node2, new Set());
    graph.get(node1).add(node2);
    graph.get(node2).add(node1);
  }

  const triangles = new Set();
  for (const [node1, node1Neighbors] of graph) {
    const neighbors = [...node1Neighbors];
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const node2 = neighbors[i];
        const node3 = neighbors[j];
        if (!graph.has(node2) || !graph.get(node2).has(node3)) continue;

        const triangle = [node1, node2, node3].sort().join('-');
        triangles.add(triangle);
      }
    }
  }

  return [...triangles].map((triangle) => triangle.split('-'));
}

function startsWith(groups, prefix) {
  return groups.some((node) => node.startsWith(prefix));
}

function findMaximumClique(connections) {
  const graph = new Map();
  for (const [node1, node2] of connections) {
    if (!graph.has(node1)) graph.set(node1, new Set());
    if (!graph.has(node2)) graph.set(node2, new Set());
    graph.get(node1).add(node2);
    graph.get(node2).add(node1);
  }

  const nodes = [...graph.keys()];
  const memo = new Map();
  return findClique([], nodes);

  function findClique(currentClique, candidates) {
    const key = `${currentClique.sort().join(',')}|${candidates.sort().join(',')}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    let maxClique = [...currentClique];
    for (let i = 0; i < candidates.length; i++) {
      const newClique = [...currentClique, candidates[i]];
      const newCandidates = candidates.filter((node) => graph.get(candidates[i])?.has(node));
      const candidateClique = findClique(newClique, newCandidates);
      if (candidateClique.length > maxClique.length) {
        maxClique = candidateClique;
      }
    }

    memo.set(key, maxClique);
    return maxClique;
  }
}

function part1({ input, debug = false }) {
  const triangles = findTriangles(input);
  const filtered = triangles.filter((group) => startsWith(group, 't'));
  if (debug) console.log(filtered);
  return filtered.length;
}

function part2({ input, debug = false }) {
  const maxClique = findMaximumClique(input);
  if (debug) console.log(maxClique);
  return maxClique.join(',');
}

const filename = 'Day23';
const input = readInput(filename);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 7
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 1352
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input, debug: true })); // co,de,ka,ta
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest, debug: true })); // dm,do,fr,gf,gh,gy,iq,jb,kt,on,rg,xf,ze
console.timeEnd('Part 2');
