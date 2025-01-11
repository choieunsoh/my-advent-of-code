// Day 22: Wizard Simulator 20XX
// https://adventofcode.com/2015/day/22

var bossStats = {
  hp: 55,
  damageAmt: 8,
};

class Player {
  constructor(initial, isWizard) {
    this.history = [];
    this.initial = initial;
    this.isWizard = !!isWizard;

    if (this.isWizard) {
      this.spells = [
        {
          name: 'Magic Missile',
          cost: 53,
          effect: (m, o) => o.damage(4),
        },
        {
          name: 'Drain',
          cost: 73,
          effect: (m, o) => {
            o.damage(2);
            m.hp += 2;
          },
        },
        {
          name: 'Shield',
          cost: 113,
          start: (m, o) => (m.armor += 7),
          effect: (m, o) => {},
          end: (m, o) => (m.armor -= 7),
          duration: 6,
        },
        {
          name: 'Poison',
          cost: 173,
          effect: (m, o) => o.damage(3),
          duration: 6,
        },
        {
          name: 'Recharge',
          cost: 229,
          effect: (m, o) => (m.mana += 101),
          duration: 5,
        },
      ];
    }

    this.start();
  }

  attack(opponent, spellIdx) {
    if (!this.isWizard) {
      opponent.damage(this.damageAmt);
    } else {
      this.history.push(spellIdx);
      const spell = this.spells[spellIdx];
      this.spent += spell.cost;
      this.mana -= spell.cost;

      if (spell.duration) {
        const newSpell = {
          idx: spellIdx,
          effect: spell.effect,
          duration: spell.duration,
        };
        if (spell.start) {
          spell.start(this, opponent);
        }
        if (spell.end) {
          newSpell.end = spell.end;
        }
        this.activeSpells.push(newSpell);
      } else {
        spell.effect(this, opponent);
      }
    }
  }

  damage(n) {
    this.hp -= Math.max(1, n - this.armor);
  }

  duplicate() {
    const newPlayer = new Player(this.initial, this.isWizard);
    newPlayer.hp = this.hp;
    newPlayer.spent = this.spent;
    newPlayer.armor = this.armor;
    newPlayer.turn = this.turn;
    for (let i = 0; i < this.activeSpells.length; i++) {
      newPlayer.activeSpells.push(Object.assign({}, this.activeSpells[i]));
    }
    for (let i = 0; i < this.history.length; i++) {
      newPlayer.history.push(this.history[i]);
    }

    if (this.isWizard) newPlayer.mana = this.mana;
    else newPlayer.damageAmt = this.damageAmt;

    return newPlayer;
  }

  takeTurn(opponent) {
    this.turn++;

    for (let i = 0; i < this.activeSpells.length; i++) {
      const spell = this.activeSpells[i];

      if (spell.duration > 0) {
        spell.effect(this, opponent);
        spell.duration--;

        if (spell.duration === 0 && spell.end) {
          spell.end(this, opponent);
        }
      }
    }
  }

  start() {
    this.hp = this.initial.hp;
    this.spent = 0;
    this.armor = 0;
    this.turn = 0;
    this.activeSpells = [];
    if (this.isWizard) this.mana = this.initial.mana;
    else this.damageAmt = this.initial.damageAmt;
  }
}

const wizard = new Player({ hp: 50, mana: 500 }, true);
const boss = new Player(bossStats);
let cheapestSpent = Infinity;

function playAllGames(wizard, boss, loseHpEveryTurn = 0, depth = 0) {
  for (let i = 0; i < wizard.spells.length; i++) {
    let spellMatch = false;
    for (let j = 0; j < wizard.activeSpells.length; j++) {
      if (wizard.activeSpells[j].duration > 1 && i === wizard.activeSpells[j].idx) {
        spellMatch = true;
      }
    }
    if (spellMatch) continue;
    if (wizard.spells[i].cost > wizard.mana) {
      continue;
    }

    const newWizard = wizard.duplicate();
    const newBoss = boss.duplicate();

    newWizard.hp -= loseHpEveryTurn;

    newWizard.takeTurn(newBoss);
    newBoss.takeTurn(newWizard);
    newWizard.attack(newBoss, i);

    newWizard.takeTurn(newBoss);
    newBoss.takeTurn(newWizard);
    newBoss.attack(newWizard);

    if (newBoss.hp <= 0) {
      cheapestSpent = Math.min(cheapestSpent, newWizard.spent);
    }

    if (newWizard.hp > loseHpEveryTurn && newBoss.hp > 0 && newWizard.spent < cheapestSpent) {
      playAllGames(newWizard, newBoss, loseHpEveryTurn, depth + 1);
    }
  }
}

function part1() {
  cheapestSpent = Infinity;
  playAllGames(wizard, boss);
  return cheapestSpent;
}

function part2() {
  cheapestSpent = Infinity;
  playAllGames(wizard, boss, 1);
  return cheapestSpent;
}

console.time('Part 1');
console.log('Part 1:', part1()); // 953
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2:', part2()); // 1289
console.timeEnd('Part 2');
