// Day 15: Science for Hungry People
// https://adventofcode.com/2015/day/15

const utils = require('../../utils');

const day = 15;
const input = utils.readInputByDay(day);
const inputTest = utils.readInputByDay(day, '_test');

class Ingredient {
  constructor(name, capacity, durability, flavor, texture, calories) {
    this.name = name;
    this.capacity = capacity;
    this.durability = durability;
    this.flavor = flavor;
    this.texture = texture;
    this.calories = calories;
  }
}

function prepareData(input) {
  // Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
  const pattern = /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/;
  return input.split('\r\n').map((line) => {
    const match = line.match(pattern);
    return new Ingredient(
      match[1],
      Number(match[2]),
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6])
    );
  });
}

function* combineQuantities(numIngredients, total = 100) {
  function* helper(arr, sum) {
    if (arr.length === numIngredients - 1) {
      arr.push(total - sum);
      yield [...arr];
      arr.pop();
      return;
    }

    for (let i = 0; i <= total - sum; i++) {
      arr.push(i);
      yield* helper(arr, sum + i);
      arr.pop();
    }
  }

  yield* helper([], 0);
}

function calculateMaxScore(input, targetCalories = 500) {
  const ingredients = prepareData(input);
  let maxScore = 0;
  let bestAmounts = [];
  let maxScoreAtCalories = 0;
  for (const quantities of combineQuantities(ingredients.length)) {
    const score = calculateScore(ingredients, quantities);
    const calories = calculateCalories(ingredients, quantities);
    if (calories === targetCalories) {
      maxScoreAtCalories = Math.max(maxScoreAtCalories, score);
    }
    if (score > maxScore) {
      maxScore = score;
      bestAmounts = quantities;
    }
  }
  return { maxScore, maxScoreOf500Calories: maxScoreAtCalories, bestAmounts };
}

function calculateByProperty(ingredients, quantities, property) {
  return Math.max(
    0,
    ingredients.reduce((sum, ingredient, index) => {
      return sum + ingredient[property] * quantities[index];
    }, 0)
  );
}

function calculateCalories(ingredients, quantities) {
  return calculateByProperty(ingredients, quantities, 'calories');
}

function calculateScore(ingredients, quantities) {
  const properties = ['capacity', 'durability', 'flavor', 'texture'];
  const scores = properties.map((property) => calculateByProperty(ingredients, quantities, property));
  return scores.reduce((product, score) => product * score, 1);
}

function part1(input) {
  return calculateMaxScore(input, 500).maxScore;
}

function part2(input) {
  return calculateMaxScore(input, 500).maxScoreOf500Calories;
}

console.log('Part 1:', part1(input)); // 62842880
console.time('Part 1');
console.log('Part 1:', part1(inputTest)); // 21367368
console.timeEnd('Part 1');

console.log('Part 2:', part2(input)); // 57600000
console.time('Part 2');
console.log('Part 2:', part2(inputTest)); // 1766400
console.timeEnd('Part 2');
