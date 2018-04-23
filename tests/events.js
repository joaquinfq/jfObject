const jfObject = require('../jf-object');
/**
 * Verifica que se haya extendido de Events.
 * La prueba del funcionamiento de los eventos como tal se hace en la clase Events
 * de NodeJS así que no somos exhaustivos en este punto.
 */
let isCalled   = false;
const instance = new jfObject();
instance.once('done', () => isCalled = true);
instance.emit('done');
require('./assert').assert('ok', isCalled);
