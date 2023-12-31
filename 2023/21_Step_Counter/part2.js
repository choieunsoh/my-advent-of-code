// Day 21: Step Counter - Part 2
// https://adventofcode.com/2023/day/21

var stepCounter = function (input, todaySteps) {
  return solvePart2(input);

  function wrapped(i, j, size) {
    i %= size;
    j %= size;
    return {
      wi: i >= 0 ? i : size + i,
      wj: j >= 0 ? j : size + j,
    };
  }

  function getNextSteps(grid, i, j, remaining) {
    const k = key(i, j);
    const { wi, wj } = wrapped(i, j, grid.size);
    const wk = key(wi, wj);

    if (grid.walls[wk] || grid.plots[k] >= remaining) {
      return [];
    }

    grid.plots[k] = remaining;
    if (remaining > 0) {
      return [
        { i: i + 1, j: j, remaining: remaining - 1 },
        { i: i - 1, j: j, remaining: remaining - 1 },
        { i: i, j: j + 1, remaining: remaining - 1 },
        { i: i, j: j - 1, remaining: remaining - 1 },
      ];
    }
    return [];
  }

  function solvePart1(input, steps = 64) {
    const grid = parse(input);
    const queue = [
      {
        i: grid.start.i,
        j: grid.start.j,
        remaining: steps,
      },
    ];

    while (queue.length > 0) {
      const step = queue.shift();
      queue.push(...getNextSteps(grid, step.i, step.j, step.remaining));
    }

    return Object.values(grid.plots).filter((e) => e % 2 == 0).length;
  }

  function solvePart2(input) {
    const values = [solvePart1(input, 65), solvePart1(input, 65 + 131), solvePart1(input, 65 + 131 * 2)];
    const poly = simplifiedLagrange(values);
    const target = (26_501_365 - 65) / 131;
    return poly.a * target * target + poly.b * target + poly.c;
  }

  /**
   * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
   *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
   * so the coefficients are:
   * a = y0/2 - y1 + y2/2
   * b = -3*y0/2 + 2*y1 - y2/2
   * c = y0
   */
  function simplifiedLagrange(values) {
    return {
      a: values[0] / 2 - values[1] + values[2] / 2,
      b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
      c: values[0],
    };
  }

  function key(i, j) {
    return `${i},${j}`;
  }

  function parse(input) {
    const grid = input.split(/\n/).map((e) => e.trim().split(''));
    const walls = {};
    const plots = {};
    let start = { i: 0, j: 0 };
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const value = grid[i][j];
        if (value == '#') {
          walls[key(i, j)] = true;
        }
        if (value == 'S') {
          plots[key(i, j)] = -1;
          start = { i: i, j: j };
        }
      }
    }
    return {
      walls: walls,
      plots: plots,
      start: start,
      size: grid.length,
    };
  }
};

console.time('day-21_part-2');

var input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;
var expected = 468903824793172;
var result = stepCounter(input);
console.log(result, result === expected);

var input = `...................................................................................................................................
......#.....#.........#.....#.#...#.##.......#.#........#..#..................#.#...........#............#.#....##..#........#.....
...#.......#....#.#......#..#.......#.....#................................#...#......#.......................#...#........#.......
....#..#...#......................#............#........................#.#.............#.#....#........#...........#.#......##.#..
.......#.....#.......#.....#.........#....#...#......................................#...#.##....#.....................#...#.......
..#....................................#..........##..............#........#...#.........###................#........#....#...#..#.
....#.....................#.....#.#............#.#.................#.............#...........#..#..........##.............#........
..#..#...#..............##.........#...........#......#.........#.................................#...#.......#.#..#...............
..#....#..#...#.#.#.......##......#.#..#.....##.#................................###..#....#................#...........#..#....#..
..#......#...........#..........#..................#........#......#.#.............................#..#..............#...#.....#...
.............##.#............#....#.#....#.#.##.................#..#...#.......#.................#....#............#...#...........
.............##...............#...#.#..###....##..................#.................#..............#....#.#.......#..#.#........#..
..................................#...##.#.................#....................................##..................#.##.#.....#.#.
...#............#.....#....#.......#.#........#.........#..##..#....................###........................#....#........#.....
.................#.#......#.......#..#...#.#.......................#..#.............###...##.#...#...#.#..#...#....................
.................#..#..#.#........#.....#.............#.#...........#.......#.........#............................#....#.#........
....#.......#.....#....#.#..#....#...#..#............#.##.........#...#.....#........#...............#.................#.##....#...
..#....................##...#......###.................#....#.........#...............................#....##..........#........#..
...#.....#........#.....#.#.........#.##................#.#...#....#.#...#...#.................#...........#....#.#...#.....#....#.
..#...###.....#.......#......#..........#................................................#.......#.#.........#...#.................
......##...##...............#...##....................#.............#....................#........#.#..........................#.#.
...#.......#..##...#.....................................#..##......#.#..#........................#.#...................#....#.....
.....#...#...................#.....#.#..........#......#.......#....#....#..#...#..........#.....#...............#.................
..#.#...................#..#....................#....#..#......#....###.......#........................#.##.......#.......#.....#..
.#....#......#..#..#..............#................##...........#........#...#.#...............#.#....#....................#.......
.....#.....#..#............#......................#.........#...#...................................#...........###.......#......#.
.#.......................#...#................#....................#.............#..............#...#.#......#........#........#.#.
.....#.#.#.#......#..............#..............#.........#...........#.##.##...........#............#.............#...#....#.#....
.............#......#..........#.....................#...............#...........#..........................##....##...............
..#............#.........#...............#..##.#.......#....#.......###...............#.......................#..##..#...#.#...#...
..#...#....#.......................................#.................#.##..##....#..................##..........#.#.........#......
.#.......#..................###........#......#............#.................#...#.##..#....................#..................#...
.......#....#..........#.#...........#...#.#.....#....##.##..#.#...........##......#.#.................#....................#......
..#..#...#.........#....#.............#...#.#.....##..............##........#.#.......................#..............#...#....#.#..
.....................#..................#..####..........................#.#.....#...#...................................###...#...
..#.#....#........#......#..........#..................#...#...#..........#.##...........#....###.............#...........#....#...
.#.................#.....#...........#....#....#.....#....#.....#..##.#.............#.......#................#......#..............
...........#..##....##.......................#..#....#...#..............#.....#...##...#..#...#..............................#.....
.##...#..........#...#..........#......#.........#.#...............##............#......#..#.......#...........#.#.........#.......
..............#........................#......#...............#..........#.#...#.....##........................#........#...#......
..#.............#..............#....#....##..#...............#.#..........#....##.#.............................#........#......##.
.......................................#........#..........#..........#..#.#........#..............#..........#.......#.........#..
....#.......#.....#...............#....#..........#......##.........#.##.##..........##.##..#........#..................#...#......
...........................#................#............#...#...................#..###................#...........#.#.............
...#.#.......#.................##.#.........#..#.#............##.......#..................#..........#..#.................#.#..##..
......................................#.............#.......#.....#..#.........................#....#.....#..........#.............
......#..#...##..............#.....#.............#.........#.#.................#...#...#......#...#..................#...#....#....
..............................#.....#....#...#.#......#..............#..........#.#...........##..........##...............###.....
.....#.............................#................#.#...#.........#............#.......#......#...#....#.................#.#.....
........#............##......#..........#............................#.....#..................#...#.#.####.................#.......
.......#.###...............##...##.......##........#...............#.............#.#.............#......#..#...........#......#.#..
.#...#..#.#...............#..#.....#.........................#.......................#.....#.....#......#.................#...##...
......#................................#.......#...................................................................................
.#..#...#.......#.....#............#.#..#....#............#.............#..#.......#.#....#....#..#.....#........#.........#.......
..#.................#....##..#........#..........#.....#...#...#............#..#...#.......#....#.....#..#.....#...........#.......
......#...................#.##............#................#...#..#.#......#......................##......#.....#..................
........................#..#.........#.......#...........#...#.........##..##......................#........#.#..##..............#.
............#.#..#.....#.#.#.....#.....#......#...#..........................#..#............#.................#..#.#.........#....
............#.#..#..............................#...........##...........#...#...........#...........#.#..#....#.#.................
..#.......#.....#...............##.....#..........................#............#.#.##.....##....#....#......#....####............#.
...................................#.....#..#.#.#.........#....#..........................##....#.#.#.....#...........#............
...........#...............................................#.#..................#........#......#.......#...#..#....#..#...........
...........#.#........#....#.##.#..#.#.#....#..#.#.............#.................#...#.#...........#............#......#...........
...........#....##..##........##.......#..........#..........###....###..##...........#.#.........#.#...#..........................
.....#...#...##...#......#.........#..#.................#...............................#...............#....#.............##......
.................................................................S.................................................................
..............##....##.##...........#............#.#..#.....#..........#..#..#..#...##....#..................#......#......#.......
........#...........#...........#.#...#...#...........#...#...##...##..#......#.........#...#..#........#.......#..#....#..........
............#.#....#...##......#......#.........#...#.#..............#..#.#.........#.....#....#........#..........................
...........#...##..........#..##...#..#..........#...#..##..#.....#...............#.#............#.#.#..........#....##............
................#.......#.............#..#.........#.#...#...##.............##.........#......................#........#...........
.#................#.#................##...#....##.................#......#..#.#........#.........#.....#.#..#...##......#..........
............#...........#..#.....#....##..#.................................#...#.....#...#....#...##.....#......#...##.........##.
...#.....................#......#....##.......................#....#.#...............#........#..#......#............#.............
...#.#........#.....................#...........#..#.....#......#....#......##......................#..#..#..#.##..#.........#..#..
................#................#..#........#............##.#...................................#..#..............................
.................#..............#......................##............#......#..#..#...#.....................#..#.#.#.............#.
.#...#..#..............#.#.......#........#..#..........#......#...#....#.#....#.........#......#.....##......................#....
....#..#...........#.#..............#.........#..##.................#.#....#..........#..#.........##..........#............##..#..
..#.#.#............#.........#..#......##.....##..#...............#........#...........#...................#..#..................#.
....#....................#.##.....#...#......##.#.............#......#....#.........................#.........#....................
.....#......................#.#..#......#.......#.....#.............#.....#.............#.#.........#.#......#.............#.......
...#.#..#.................#.....#...........#........#....#...#........##.........#...#.....#..#.....#..#.#..................#.....
...##..#.##.#...........#.....................................#...............#...................##......#.#.........#......#..#..
....#..................#...#....#............#............#...#............#..#.........#...............#.#.........#..............
...........#..............#........#........#.#....................#..#....#..............................#........................
..#....#.#..#..#..........#.#.##..#..#..##....#.#..#....................#............#....#...#..................#...#......#......
.....####......#.#...............#.....#...........................#......#.............#.......#.............................#....
.....#.........................#............#.#......##.....##.........##...........###.....#......##.##.............#......#.#....
....#...............................##...#......#...#.......#................#...#..............#..............###.................
..........#.#.#......#.......#...##.....#....#.............#..##.........................#.........#..................#............
...........#.#......#.........#.......#.#..............#.#...........#................#...................................##.......
.#.....................................#.....#........#.#..#..........#...#..........#.#.......###..........#....#..#.#....#.#.....
.....#.....#.....................#..#.......#....#....###.#.#........##.........#.............##..#..............#....#......#.#...
.....#..#..###.#..#................#...##.......#.....#......##.............####.....#....#.............................#..........
....#.##.........##.......#.......#.......#.#.........##................##...#................#.........#......#.#.#......#........
.#.....#.............................#..............#...........#.#........#......#..#...................#.#.........#...#.........
..........#.###..#.....................#.......#...........#............##.........##.........#........#.........#......#....###...
........#....##.##........#..................#....##.#...#.........#......#...#............#...................#..#.............#..
.#..#.............................................#..................................#......................#...#............##.#..
........................#.....#.............#.....#..........#..#.......#...#...#..##..............#..........#...#............#.#.
.....#....#...#....#..#........................#....##.......#.#...#....###............#.#............#.........#..................
......#......#...#..#.......#...............##...#...........#..........#.........#...#...............##................#........#.
.................#.##...#.#...............#.......#..........#..#.........#...#..###.............#.........#.........##............
..#....#.........................#.#........#.#...........#..........#....#............#.................##....#...................
...........#....#.............#.....................#.....###.......#...#...#...#.......................#..#.##.......#.......#....
.#.............#....#....#........#...........#.......................#......#..................#..#.....#.#..#..#........##.......
.#.....#.....##...#........#.........#...............#.#..........#...#...#...........................##..##...#....#.......#......
....#..#......#.....#.###..#.##.......................###.....................#................##..................................
.................#.#.....##..##.......#.#........#........#........##........#....#..........#.....#......#.............#........#.
....................#.......#..#....................#..#........#.#.........................................#.##...................
.....#....#....#.......#....#....#........#................#....#....#........#............................#......#.#......#..#....
.............##....#...#................#..........#...........#...#....#.....##........#.#..#.......#..#....#....#..#.#.....##....
.......#......#..#...#....#..#.........#...............#...#.#..........................#.#.....#.....#.#.............#............
.....#................#..........#.#.##.#.#...............................#........................#.##..........#.........##.#.#..
.....#........#.....##...........#...#........................##........#.............#......#.................##..................
.........................#.....#.......#.#..#..#..........#.#..#........#.##......................#....................#...#.#.....
...........#..#.###........#...........#....#..#........#.......#.......#...........................#....#.....#..#....##...#......
....#..............................#.......................#.......#.#.......................#.......#..#.........#..............#.
......#.#......#..#..#...#.......#..............##.....................................#.............###.....#.......#..#.#......#.
.....#..#..............#.........#........#..#....................#..#.........#.........#.....#....#.....#......#.................
...#...........##...#.......##.#...#...#.....#...................................#.......#......###.....##............#..##........
.....#...........#................#....#...#...#.##..............................#.......#..#.........#.....#..#.....#..#...#...#..
...#..............#.....##.......#.....#.......................................##.......##.....#...................###.....#.......
......#..##..#...#........#.............##..#.......#.........................#.#..........#..............#......................#.
...............#.........#..##..........#...#.#...#.#.#....................#.....................#...#..##....#....#..#.........#..
.........#....#..#........#............................#....................#.#.........#.........................#...........#.#..
......#....................##......#....##................................#.....#...#...............#............#...#..#.#.....#..
......#.#.....#.........#.....................................................#......#................#............#..........#....
...............#..#......#....#............#..........##...#............#..................##......................................
...................................................................................................................................`;
var expected = 617565692567199;
var result = stepCounter(input);
console.log(result, result === expected);

console.timeEnd('day-21_part-2');
