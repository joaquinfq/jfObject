const assert   = require('assert');
const Events   = require('events');
const jfObject = require('./index');
/**
 * Verifica que los objetos pasados al constructor sean fusionados con la instancia.
 */
function checkConstructor()
{
    assert.deepEqual(
        {
            a : {
                b : 1,
                c : 3
            }
        },
        new jfObject(
            {
                a : {
                    b : 0
                }
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
                }
            }
        ).toJSON()
    );
}
/**
 * Verifica que se hayan adjuntado los métodos provistos por dot-prop.
 * La prueba del funcionamiento de estos métodos se hacen en el módulo dot-prop así
 * que no somos exhaustivos en este punto.
 */
function checkDotProp()
{
    const _instance = new jfObject();
    _instance.set('a.b.c.d', 10);
    assert.deepEqual(
        _instance.a,
        {
            b : {
                c : {
                    d : 10
                }
            }
        }
    );
    assert.deepEqual(
        _instance.get('a'),
        {
            b : {
                c : {
                    d : 10
                }
            }
        }
    );
    assert.deepEqual(
        _instance.get('a.b'),
        {
            c : {
                d : 10
            }
        }
    );
    assert.deepEqual(
        _instance.get('a.b.c'),
        {
            d : 10
        }
    );
    assert.equal(_instance.get('a.b.c.d'), 10);
}
/**
 * Verifica que se haya extendido de Events.
 * La prueba del funcionamiento de los eventos como tal se hace en la clase Events
 * de NodeJS así que no somos exhaustivos en este punto.
 */
function checkEvents()
{
    let _isCalled   = false;
    const _instance = new jfObject();
    assert.ok(_instance instanceof Events);
    _instance.once('done', () => _isCalled = true);
    _instance.emit('done');
    assert.ok(_isCalled);
}
/**
 * Verifica que se pueda iterar usando for..of.
 */
function checkIterator()
{
    const _actual   = {};
    const _expected = {
        a : 1,
        c : 2,
        f : 3,
        h : 4
    };
    const _instance = new jfObject(_expected);
    for (let _p of _instance)
    {
        _actual[_p] = _instance[_p];
    }
    assert.deepEqual(_actual, _expected);
}
/**
 * Verifica que solamente se asignen las propiedades ya existentes.
 */
function checkSetProperties()
{
    const _instance = new jfObject(
        {
            a : 1,
            b : 2
        }
    );
    _instance.setProperties(
        {
            a : 6,
            c : 7, // Se debe ignorar ya que no está definida en la clase
            d : 8  // Se debe ignorar ya que no está definida en la clase
        }
    );
    assert.deepEqual(
        {
            a : 6,
            b : 2
        },
        _instance.toJSON()
    );
}
/**
 * Verifica que se devuelva la referencia correcta en las llamadas al método estático `i`.
 */
function checkSingleton()
{
    let _instance = jfObject.i();
    assert.ok(_instance instanceof jfObject);
    assert.equal(_instance, jfObject.i());
    //-------------------------------------------------------------------------
    //@formatter:off
    class jfObjectChild extends jfObject {};
    _instance = jfObjectChild.i();
    assert.ok(_instance instanceof jfObject);
    assert.ok(_instance instanceof jfObjectChild);
    assert.equal(_instance, jfObjectChild.i());
    assert.notEqual(_instance, jfObject.i());
    //-------------------------------------------------------------------------
    class jfObjectChildChild extends jfObjectChild {};
    _instance = jfObjectChildChild.i();
    assert.ok(_instance instanceof jfObject);
    assert.ok(_instance instanceof jfObjectChild);
    assert.ok(_instance instanceof jfObjectChildChild);
    assert.equal(_instance, jfObjectChildChild.i());
    assert.notEqual(_instance, jfObjectChild.i());
    assert.notEqual(_instance, jfObject.i());
    //@formatter:on
}
/**
 * Verifica que se divida en un objeto con las claves keys y values.
 */
function checkSplit()
{
    assert.deepEqual(
        new jfObject(
            {
                a : 1,
                b : 2,
                c : 3,
                d : 4
            }
        ).split(),
        {
            keys   : ['a', 'b', 'c', 'd'],
            values : [1, 2, 3, 4]
        }
    );
}
/**
 * Verifica que se convierta en un array teniendo en el índice 0 la clave y en el 1 su valor.
 */
function checkToArray()
{
    assert.deepEqual(
        new jfObject(
            {
                a : 1,
                b : 2,
                c : 3,
                d : 4
            }
        ).toArray(),
        [
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4]
        ]
    );
}
/**
 * Verifica que las propiedades protegidas y privadas no se exporten en JSON y que el paso de un filtro funcione.
 */
function checkToJson()
{
    assert.deepEqual(
        new jfObject(
            {
                property1  : 1,
                property2  : 2,
                _protected : 3,
                __private  : 4
            }
        ).toJSON(),
        {
            property1 : 1,
            property2 : 2
        }
    );
}
/**
 * Verifica que el método toString devuelva el nombre de la clase.
 */
function checkToString()
{
    let _instance = new jfObject();
    assert.equal(_instance.toString(), '[class jfObject]');
    //@formatter:off
    class jfObjectChild extends jfObject {};
    _instance = new jfObjectChild();
    assert.equal(_instance.toString(), '[class jfObjectChild]');
    //
    class jfObjectChildChild extends jfObjectChild {};
    _instance = new jfObjectChildChild();
    assert.equal(_instance.toString(), '[class jfObjectChildChild]');
    //@formatter:on
}
//------------------------------------------------------------------------------
// Inicio de las pruebas
//------------------------------------------------------------------------------
checkConstructor();
checkDotProp();
checkEvents();
checkIterator();
checkSetProperties();
checkSingleton();
checkSplit();
checkToArray();
checkToJson();
checkToString();
