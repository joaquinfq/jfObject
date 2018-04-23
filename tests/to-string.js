const assert   = require('./assert');
const jfObject = require('../jf-object');
/**
 * Verifica que el método toString devuelva el nombre de la clase.
 */
let instance   = new jfObject();
assert.assert('equal', instance.toString(), '[class jfObject]');

//@formatter:off
class jfObjectChild extends jfObject {};
instance = new jfObjectChild();
assert.assert('equal', instance.toString(), '[class jfObjectChild]');

class jfObjectChildChild extends jfObjectChild {};
instance = new jfObjectChildChild();
assert.assert('equal', instance.toString(), '[class jfObjectChildChild]');
//@formatter:on
