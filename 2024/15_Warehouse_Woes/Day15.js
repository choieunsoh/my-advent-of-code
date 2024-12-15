// Day 15: Warehouse Woes
// https://adventofcode.com/2024/day/15

const fs = require('fs');

function readInput(filename) {
  return fs.readFileSync(`${filename}.txt`, 'utf8').split('\r\n\r\n');
}

class WarehouseBase {
  #moveIndex = 0;
  #debug = false;

  constructor(map, moves, boxSymbol, debug = false) {
    this.map = map;
    this.moves = moves;
    this.#moveIndex = 0;
    this.boxSymbol = boxSymbol;
    this.#debug = debug;
  }

  canMove() {
    return this.#moveIndex < this.moves.length;
  }

  moveAll() {
    while (this.canMove()) {
      this.move();
    }
    this.printMap();
  }

  move() {
    const move = this.moves[this.#moveIndex++];
    if (this.#debug) console.log({ move });

    switch (move) {
      case '<':
        this.moveRobot(0, -1);
        break;
      case '>':
        this.moveRobot(0, 1);
        break;
      case '^':
        this.moveRobot(-1, 0);
        break;
      case 'v':
        this.moveRobot(1, 0);
        break;
    }

    if (this.#debug) this.printMap();
  }

  sumGPS() {
    const { map } = this;
    let sum = 0;
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const cell = map[row][col];
        if (cell === this.boxSymbol) sum += row * 100 + col;
      }
    }
    return sum;
  }

  findRobot() {
    const { map } = this;
    const row = map.findIndex((row) => row.includes('@'));
    const col = map[row].indexOf('@');
    return { row, col };
  }

  printMap() {
    const { map } = this;
    const result = map.map((row) => row.join('')).join('\n');
    console.log(result);
    console.log();
  }

  // Abstract method to be implemented by subclasses
  moveRobot(rowOffset, colOffset) {
    throw new Error('movePart method must be implemented in the subclass');
  }
}

class WarehousePart1 extends WarehouseBase {
  constructor(map, moves, debug = false) {
    super(map, moves, 'O', debug);
  }

  moveRobot(rowOffset, colOffset) {
    const { map } = this;
    const { row, col } = this.findRobot();
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    if (this.#canMoveRobot(newRow, newCol, rowOffset, colOffset)) {
      map[row][col] = '.';
      map[newRow][newCol] = '@';
    }
  }

  #canMoveRobot(row, col, rowOffset, colOffset) {
    const { map } = this;
    const newPos = map[row][col];
    if (newPos === '#') {
      return false;
    }

    if (newPos === '.') {
      return true;
    }

    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    if (this.#canMoveRobot(newRow, newCol, rowOffset, colOffset)) {
      map[newRow][newCol] = 'O';
      return true;
    }
    return false;
  }
}

class WarehousePart2 extends WarehouseBase {
  #changes = [];

  constructor(map, moves, debug = false) {
    super(map, moves, '[', debug);
    this.#doubleWide();
  }

  moveRobot(rowOffset, colOffset) {
    this.#changes = [];
    const { map } = this;
    const { row, col } = this.findRobot();
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    if (this.#canMoveRobot(newRow, newCol, rowOffset, colOffset)) {
      this.#sortChanges();
      this.#changes.forEach((box) => {
        map[box.r][box.c] = box.v;
      });

      map[row][col] = '.';
      map[newRow][newCol] = '@';
    }
  }

  #canMoveRobot(row, col, rowOffset, colOffset) {
    const { map } = this;
    const newPos = map[row][col];
    if (newPos === '#') {
      return false;
    }

    if (newPos === '.') {
      return true;
    }

    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    if (rowOffset === 0) {
      if (this.#canMoveRobot(newRow, newCol, rowOffset, colOffset)) {
        map[newRow][newCol] = newPos;
        return true;
      }
      return false;
    }

    if (newPos === '[') {
      if (
        this.#canMoveRobot(newRow, newCol, rowOffset, colOffset) &&
        this.#canMoveRobot(newRow, newCol + 1, rowOffset, colOffset)
      ) {
        this.#changes = this.#changes.concat([
          { r: newRow, c: newCol, v: '[' },
          { r: newRow, c: newCol + 1, v: ']' },
          { r: row, c: col, v: '.' },
          { r: row, c: col + 1, v: '.' },
        ]);
        return true;
      }
      return false;
    } else {
      if (
        this.#canMoveRobot(newRow, newCol, rowOffset, colOffset) &&
        this.#canMoveRobot(newRow, newCol - 1, rowOffset, colOffset)
      ) {
        this.#changes = this.#changes.concat([
          { r: newRow, c: newCol - 1, v: '[' },
          { r: newRow, c: newCol, v: ']' },
          { r: row, c: col - 1, v: '.' },
          { r: row, c: col, v: '.' },
        ]);
        return true;
      }
      return false;
    }
  }

  #sortChanges() {
    this.#changes.sort((a, b) => {
      if (a.v === '.' && b.v !== '.') return -1;
      if (a.v !== '.' && b.v === '.') return 1;
      return 0;
    });
  }

  #doubleWide() {
    this.originalMap = structuredClone(this.map);
    this.map = this.originalMap.map((row) => row.map(doubleWide).flat());

    function doubleWide(cell) {
      if (cell === '@') return ['@', '.'];
      if (cell === 'O') return ['[', ']'];
      if (cell === '.') return ['.', '.'];
      return ['#', '#'];
    }
  }
}

function WarehouseFactory(input, debug = false) {
  const [mapStr, movesStr] = input;
  const map = mapStr.split('\r\n').map((row) => row.split(''));
  const moves = movesStr
    .split('\r\n')
    .map((move) => move.split(''))
    .flat();

  return {
    create: ({ part1 }) => {
      return part1 ? new WarehousePart1(map, moves, debug) : new WarehousePart2(map, moves, debug);
    },
  };
}

function part1({ input, debug = false }) {
  const warehouse = WarehouseFactory(input, debug).create({ part1: true });
  warehouse.moveAll();
  return warehouse.sumGPS();
}

function part2({ input, debug = false }) {
  const warehouse = WarehouseFactory(input, debug).create({ part1: false });
  warehouse.moveAll();
  return warehouse.sumGPS();
}

const filename = 'Day15';
const input = readInput(filename);
const input2 = readInput(`${filename}-2`);
const inputDemo = readInput(`${filename}_demo`);
const inputTest = readInput(`${filename}_test`);

console.log('Part 1:', part1({ input, debug: true })); // 2028
console.log('Part 1:', part1({ input: inputDemo, debug: true })); // 10092
console.time('Part 1');
console.log('Part 1 Test:', part1({ input: inputTest })); // 1446158
console.timeEnd('Part 1');

console.log('Part 2:', part2({ input: input2, debug: true })); // 618
console.log('Part 2:', part2({ input: inputDemo, debug: true })); // 9021
console.time('Part 2');
console.log('Part 2 Test:', part2({ input: inputTest })); // 1446175
console.timeEnd('Part 2');
