const assert   = require('./assert');
const jfObject = require('../jf-object');
/**
 * Verifica que se devuelva la referencia correcta en las llamadas al método estático `i`.
 */
let instance   = jfObject.i();
//@formatter:off
//-------------------------------------------------------------------------
assert.assert('ok',       instance instanceof jfObject);
assert.assert('equal',    instance, jfObject.i());
//-------------------------------------------------------------------------
class jfObjectChild extends jfObject {};
instance = jfObjectChild.i();
assert.assert('ok',       instance instanceof jfObject);
assert.assert('ok',       instance instanceof jfObjectChild);
assert.assert('equal',    instance, jfObjectChild.i());
assert.assert('notEqual', instance, jfObject.i());
//-------------------------------------------------------------------------
class jfObjectChildChild extends jfObjectChild {};
instance = jfObjectChildChild.i();
assert.assert('ok',       instance instanceof jfObject);
assert.assert('ok',       instance instanceof jfObjectChild);
assert.assert('ok',       instance instanceof jfObjectChildChild);
assert.assert('equal',    instance, jfObjectChildChild.i());
assert.assert('notEqual', instance, jfObjectChild.i());
assert.assert('notEqual', instance, jfObject.i());
//-------------------------------------------------------------------------
// AVISO: Si no tiene nombre la clase, se devolverá la misma instancia
// aunque el contexto sea otro.
assert.assert('equal', jfObject.i.call(function(){}), jfObject.i.call(function(){}));
//-------------------------------------------------------------------------
//@formatter:on
