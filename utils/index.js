const fs = require('fs');
const readInput = (name) => fs.readFileSync(`${name}.txt`, 'utf8');
const readInputByDay = (day, suffix = '') => readInput(`./Day${String(day).padStart(2, '0')}${suffix}`);

module.exports = { readInput, readInputByDay };
