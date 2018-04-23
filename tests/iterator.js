const jfObject = require('../jf-object');
/**
 * Verifica que se pueda iterar usando for..of.
 */
const actual   = {};
const expected = {
    a : 1,
    c : 2,
    f : 3,
    h : 4
};
const instance = new jfObject().assign(expected);
for (let property of instance)
{
    actual[property] = instance[property];
}
require('./assert').assert('deepStrictEqual', actual, expected);
