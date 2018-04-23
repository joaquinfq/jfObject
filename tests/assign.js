const assert   = require('./assert');
const jfObject = require('../jf-object');
/**
 * Verifica que los objetos sean fusionados con la instancia.
 */
const data     = {
    a : {
        b : 1,
        c : 3
    },
    x : false
};
assert.assert(
    'deepStrictEqual',
    new jfObject()
        .assign(
            {
                a : {
                    b : 0
                },
                x : true
            },
            {
                a : {
                    b : 1,
                    c : 2
                }
            },
            {
                a : {
                    c : 3
                },
                x : false
            }
        )
        .toJSON(),
    data
);
//------------------------------------------------------------------------------
// Valores que no se asignan porque no son objetos o son funciones.
//------------------------------------------------------------------------------
assert.assert(
    'deepStrictEqual',
    new jfObject()
        .assign(
            null,
            1,
            false,
            true,
            undefined,
            '',
            'abc',
            () => null,
            {
                u : undefined,
                a()
                {

                }
            }
        )
        .toJSON(),
    {}
);
let instance = new jfObject();
instance.a   = 123;
assert.assert('deepStrictEqual', instance.assign(data).toJSON(), data);
