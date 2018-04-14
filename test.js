const assert = require('assert');
/**
 * Verifica que los objetos sean fusionados con la instancia.
 */
function checkAssign()
{
    runAssert(
        'deepEqual',
        {
            a : {
                b : 1,
                c : 3
            }
        },
        new jfObject()
            .assign(
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
            )
            .toJSON()
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
    runAssert(
        'deepEqual',
        _instance.a,
        {
            b : {
                c : {
                    d : 10
                }
            }
        }
    );
    runAssert(
        'deepEqual',
        _instance.get('a'),
        {
            b : {
                c : {
                    d : 10
                }
            }
        }
    );
    runAssert(
        'deepEqual',
        _instance.get('a.b'),
        {
            c : {
                d : 10
            }
        }
    );
    runAssert(
        'deepEqual',
        _instance.get('a.b.c'),
        {
            d : 10
        }
    );
    runAssert('equal', _instance.get('a.b.c.d'), 10);
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
    _instance.once('done', () => _isCalled = true);
    _instance.emit('done');
    runAssert('ok', _isCalled);
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
    const _instance = new jfObject().assign(_expected);
    for (let _p of _instance)
    {
        _actual[_p] = _instance[_p];
    }
    runAssert('deepEqual', _actual, _expected);
}
/**
 * Verifica que solamente se asignen las propiedades ya existentes.
 */
function checkSetProperties()
{
    runAssert(
        'deepEqual',
        {
            a : 6,
            b : 2
        },
        new jfObject()
            .assign(
                {
                    a : 1,
                    b : 2
                }
            )
            .setProperties(
                {
                    a : 6,
                    c : 7, // Se debe ignorar ya que no está definida en la clase
                    d : 8  // Se debe ignorar ya que no está definida en la clase
                }
            )
            .toJSON()
    );
}
/**
 * Verifica que se devuelva la referencia correcta en las llamadas al método estático `i`.
 */
function checkSingleton()
{
    let _instance = jfObject.i();
    runAssert('ok', _instance instanceof jfObject);
    runAssert('equal', _instance, jfObject.i());
    //-------------------------------------------------------------------------
    //@formatter:off
    class jfObjectChild extends jfObject {};
    _instance = jfObjectChild.i();
    runAssert('ok', _instance instanceof jfObject);
    runAssert('ok', _instance instanceof jfObjectChild);
    runAssert('equal', _instance, jfObjectChild.i());
    runAssert('notEqual', _instance, jfObject.i());
    //-------------------------------------------------------------------------
    class jfObjectChildChild extends jfObjectChild {};
    _instance = jfObjectChildChild.i();
    runAssert('ok', _instance instanceof jfObject);
    runAssert('ok', _instance instanceof jfObjectChild);
    runAssert('ok', _instance instanceof jfObjectChildChild);
    runAssert('equal', _instance, jfObjectChildChild.i());
    runAssert('notEqual', _instance, jfObjectChild.i());
    runAssert('notEqual', _instance, jfObject.i());
    //@formatter:on
}
/**
 * Verifica que se divida en un objeto con las claves keys y values.
 */
function checkSplit()
{
    runAssert(
        'deepEqual',
        new jfObject()
            .assign(
                {
                    a : 1,
                    b : 2,
                    c : 3,
                    d : 4
                }
            )
            .split(),
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
    runAssert(
        'deepEqual',
        new jfObject()
            .assign(
                {
                    a : 1,
                    b : 2,
                    c : 3,
                    d : 4
                }
            )
            .toArray(),
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
    runAssert(
        'deepEqual',
        new jfObject()
            .assign(
                {
                    property1  : 1,
                    property2  : 2,
                    _protected : 3,
                    __private  : 4
                }
            )
            .toJSON(),
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
    runAssert('equal', _instance.toString(), '[class jfObject]');
    //@formatter:off
    class jfObjectChild extends jfObject {};
    _instance = new jfObjectChild();
    runAssert('equal', _instance.toString(), '[class jfObjectChild]');
    //
    class jfObjectChildChild extends jfObjectChild {};
    _instance = new jfObjectChildChild();
    runAssert('equal', _instance.toString(), '[class jfObjectChildChild]');
    //@formatter:on
}
function runAssert(fn, ...args)
{
    assert[fn](...args);
    ++numAssertions;
}
//------------------------------------------------------------------------------
// Inicio de las pruebas
//------------------------------------------------------------------------------
let jfObject, numAssertions = 0;

[ './jf-object', './jf-object.min'].forEach(
    file => {
        jfObject = require(file).default;
        checkAssign();
        checkDotProp();
        checkEvents();
        checkIterator();
        checkSetProperties();
        checkSingleton();
        checkSplit();
        checkToArray();
        checkToJson();
        checkToString();
    }
);
console.log('Total aserciones: %d', numAssertions);

jfObject = require('./jf-object').default;
const obj = new jfObject().assign(
    {
        x : new jfObject().assign(
            {
                y : new jfObject().assign(
                    {
                        z : [
                            new jfObject().assign(
                                {
                                    aa : 1
                                }
                            ),
                            new jfObject().assign(
                                {
                                    bb : 2
                                }
                            )
                        ]
                    }
                )
            }
        )
    }
);
obj.a = [
    1,
    false,
    null,
    undefined,
    {},
    new jfObject().assign({ x : 1, y  : 2 })
];
obj.o = {
    aa : 1,
    bb : new jfObject().assign({ r : false, s : true })
};
obj.n = 1;
obj.f = 0.25;
obj.b = true;
console.log(obj.toJSON());
console.log(obj.x.y.toJSON());
