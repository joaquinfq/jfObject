const assert   = require('./assert');
const jfObject = require('../jf-object');
/**
 * Verifica que se hayan adjuntado los métodos provistos por prop-sep.
 * La prueba del funcionamiento de estos métodos se hacen en el módulo prop-sep así
 * que no somos exhaustivos en este punto.
 */
const names = ['a', 'b', 'c', 'd'];
const a = {
    b : {
        c : {
            d : Date.now()
        }
    }
};
const instance = new jfObject();
assert.assert('deepStrictEqual', instance.has('a'), false);
instance.set('a.b.c.d', a.b.c.d);
assert.assert('deepStrictEqual', instance.get('a'), a);
assert.assert('deepStrictEqual', instance.get('a.b'), a.b);
assert.assert('deepStrictEqual', instance.get('a.b.c'), a.b.c);
assert.assert('deepStrictEqual', instance.get('a.b.c.d'), a.b.c.d);
while (names.length)
{
    const path = names.join('.');
    assert.assert('deepStrictEqual', instance.has(path), true);
    instance.remove(path);
    assert.assert('deepStrictEqual', instance.has(path), false);
    names.pop();
}
assert.assert('deepStrictEqual', Object.keys(instance.toJSON()), []);
