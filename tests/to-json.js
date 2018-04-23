const assert   = require('./assert');
const jfObject = require('../jf-object');
/**
 * Verifica que las propiedades protegidas y privadas no se
 * exporten en JSON y que el paso de un filtro funcione.
 */
assert.assert(
    'deepStrictEqual',
    new jfObject()
        .assign(
            {
                property1  : 1,
                property2  : [2, 22],
                _protected : 3,
                __private  : 4
            }
        )
        .toJSON(),
    {
        property1 : 1,
        property2 : [2, 22]
    }
);
assert.assert(
    'deepStrictEqual',
    new jfObject()
        .assign(
            {
                a : 1,
                b : 2,
                c : 3,
                d : 4
            }
        )
        .toJSON((property, value) => typeof value === 'number' && value % 2),
    {
        a : 1,
        c : 3
    }
);
