const path     = require('path');
const testsDir = path.join(__dirname, 'tests');

require('fs')
    .readdirSync(testsDir)
    .filter(file => file.endsWith('.js') && file !== 'assert.js')
    .forEach(file => require(path.join(testsDir, file)));

console.log('Total aserciones: %s', require('./tests/assert').numAssertions);
