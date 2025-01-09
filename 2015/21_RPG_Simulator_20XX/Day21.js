// Day 21: RPG Simulator 20XX
// https://adventofcode.com/2015/day/21

const utils = require('../../utils');

const day = 21;
const input = utils.readInputByDay(day);

const EquipmentType = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  RING: 'ring',
};
class Equipment {
  constructor(name, type, cost, damage, armor) {
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.damage = damage;
    this.armor = armor;
  }
}

function prepareData(input) {
  const equipments = {};
  const types = [EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.RING];
  const sections = input.split('\r\n\r\n');
  for (let i = 0; i < sections.length; i++) {
    const [, ...lines] = sections[i].split('\r\n').map((line) => line.split(/\s+/g));
    const equips = lines.map((line) => {
      if (line.length === 4) {
        const [name, cost, damage, armor] = line;
        return new Equipment(name, types[i], +cost, +damage, +armor);
      } else {
        const [name, refined, cost, damage, armor] = line;
        return new Equipment(`${name} ${refined}`, types[i], +cost, +damage, +armor);
      }
    });
    equipments[`${types[i]}s`] = equips;
  }
  return equipments;
}

function combineEquipment(equipments) {
  const { weapons, armors, rings } = equipments;
  const combinations = [];
  for (const weapon of weapons) {
    for (const armor of [null, ...armors]) {
      for (let i = 0; i <= rings.length; i++) {
        for (let j = i + 1; j <= rings.length; j++) {
          const ring1 = rings[i] || null;
          const ring2 = rings[j] || null;
          combinations.push([weapon, armor, ring1, ring2].filter(Boolean));
        }
      }
    }
  }
  return combinations;
}

function calculateStats(combination) {
  return combination.reduce(
    (stats, equip) => {
      stats.cost += equip.cost;
      stats.damage += equip.damage;
      stats.armor += equip.armor;
      return stats;
    },
    { cost: 0, damage: 0, armor: 0, combination }
  );
}

function heroCanDefeatBoss(heroStats, bossStats) {
  const heroDamage = Math.max(1, heroStats.damage - bossStats.armor);
  const bossDamage = Math.max(1, bossStats.damage - heroStats.armor);

  const heroTurnsToWin = Math.ceil(bossStats.hp / heroDamage);
  const bossTurnsToWin = Math.ceil(heroStats.hp / bossDamage);

  return heroTurnsToWin <= bossTurnsToWin;
}

function part1(input) {
  const equipments = prepareData(input);
  const combinations = combineEquipment(equipments);
  const stats = combinations.map(calculateStats);

  const bossStats = { hp: 100, damage: 8, armor: 2 };
  const heroStats = { hp: 100 };

  let bestHeroStats = { ...heroStats };
  let minCost = Number.MAX_SAFE_INTEGER;
  for (const stat of stats) {
    if (heroCanDefeatBoss({ ...heroStats, ...stat }, bossStats)) {
      if (stat.cost < minCost) {
        minCost = stat.cost;
        bestHeroStats = { ...heroStats, ...stat };
      }
    }
  }
  console.log(bestHeroStats);
  return minCost;
}

function part2(input) {
  const equipments = prepareData(input);
  const combinations = combineEquipment(equipments);
  const stats = combinations.map(calculateStats);

  const bossStats = { hp: 100, damage: 8, armor: 2 };
  const heroStats = { hp: 100 };

  let worstHeroStatToLose = { ...heroStats };
  let maxCost = Number.MIN_SAFE_INTEGER;
  for (const stat of stats) {
    if (!heroCanDefeatBoss({ ...heroStats, ...stat }, bossStats)) {
      if (stat.cost > maxCost) {
        maxCost = stat.cost;
        worstHeroStatToLose = { ...heroStats, ...stat };
      }
    }
  }
  console.log(worstHeroStatToLose);
  return maxCost;
}

console.time('Part 1');
console.log('Part 1:', part1(input)); // 91
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2:', part2(input)); // 158
console.timeEnd('Part 2');
