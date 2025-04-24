import jfTestsUnit from '@jf/tests/src/type/Unit.js';
import jfObject    from '../src/Object.js';

const params = [
    { a : 10 },
    { b : 20 },
    { c : 30 }
];

/**
 * Pruebas unitarias de la clase `jf.Object`.
 */
export default class jfObjectTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.Object';
    }

    buildDefaults(...data)
    {
        const _defaults = {};
        data.forEach(
            obj => Object.keys(obj).forEach(name => _defaults[name] = null)
        );
        return _defaults;
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfObject();
    }

    /**
     * Pruebas del método `assign`.
     */
    testAssign()
    {
        class _Class extends jfObject
        {
            constructor(...values)
            {
                super();
                Object.assign(this, _defaults);
                values.forEach(v => this.assign(v));
            }
        }

        const _defaults = this.buildDefaults(...params);
        [ _defaults, null, undefined ].forEach(
            value => this._assert('', new _Class().assign(value).toJSON(), _defaults)
        );
        this._assert(
            '',
            new _Class({ dd : 4, ee : 20 }, ...params).toJSON(),
            Object.assign({}, ...params)
        );
    }

    /**
     * Pruebas del método `assign` usando los setters.
     */
    testAssignWithSetter()
    {
        class _Class extends jfObject
        {
            constructor(...values)
            {
                super();
                Object.assign(this, _defaults);
                values.forEach(v => this.assign(v));
            }

            setB(value)
            {
            }

            setA(value, property, values)
            {
                _self._assert('', value, _values.a);
                _self._assert('', property, 'a');
                _self._assert('', values, _values);
                return value === null
                    ? null
                    : 2 * value;
            }
        }

        const _self     = this,
              _defaults = this.buildDefaults(...params),
              _values   = Object.assign({}, ...params),
              _class    = new _Class(_values);
        // setA lo duplica.
        _values.a *= 2;
        //  setB devuelve undefined por lo tanto nunca se modifica.
        _values.b = null;
        this._assert('', _class.toJSON(), _values);
    }

    /**
     * Pruebas del constructor.
     */
    testConstructor()
    {
        const _sut = this.sut;
        this._assert('', Object.keys(_sut), []);
        this._assert('', new jfObject(...params).toJSON(), Object.assign({}, ...params));
    }

    /**
     * Pruebas de los métodos `get`, `has`, `remove` y `set`.
     */
    testGetHasRemoveSet()
    {
        const _n = [ 'a', 'b', 'c', 'd' ];
        const _a = {
            b : {
                c : {
                    d : Math.random()
                }
            }
        };
        const _sut = this.sut;
        this._assert('', _sut.has('a'), false);
        _sut.set(_n.join('.'), _a.b.c.d);
        this._assert('', _sut.get('a'), _a);
        this._assert('', _sut.get('a.b'), _a.b);
        this._assert('', _sut.get('a.b.c'), _a.b.c);
        this._assert('', _sut.get('a.b.c.d'), _a.b.c.d);
        while (_n.length)
        {
            const path = _n.join('.');
            this._assert('', _sut.has(path), true);
            _sut.remove(path);
            this._assert('', _sut.has(path), false);
            _n.pop();
        }
        this._assert('', Object.keys(_sut), []);
    }

    /**
     * Pruebas el iterador de la instancia.
     */
    testIterator()
    {
        const _length = 10;
        const _sut = this.sut;
        const _keys = Array.from({ length : _length }).map((_, index) => String.fromCharCode(65 + index));
        _keys.forEach((v, i) => _sut[v] = i);
        let _count = 0;
        for (const _prop of _sut)
        {
            this._assert('', _prop, _keys[_count]);
            this._assert('', _sut[_prop], _count);
            ++_count;
        }
        this._assert('', _count, _length);
    }

    /**
     * Pruebas del método `merge`.
     */
    testMerge()
    {
        const _sut = this.sut;
        _sut.merge(...params);
        this._assert('', _sut.toJSON(), Object.assign({}, ...params));
        _sut.merge(
            {
                d : {
                    e : {
                        f : {
                            x : 0,
                            z : 'z'
                        },
                        g : 0
                    }
                },
                h : new jfObject({ m : -1 })
            },
            {
                a : -1,
                d : {
                    e : {
                        f : {
                            x : 4,
                            y : 5
                        }
                    }
                },
                h : {
                    n : -2
                }
            },
            null
        );
        this._assert(
            '',
            _sut.toJSON(),
            {
                a : -1,
                b : 20,
                c : 30,
                d : {
                    e : {
                        f : {
                            x : 4,
                            y : 5,
                            z : 'z'
                        },
                        g : 0
                    }
                },
                h : {
                    m : -1,
                    n : -2
                }
            }
        );
    }

    /**
     * Pruebas del método `serialize`.
     */
    testSerialize()
    {
        let _value;

        class _Class extends jfObject
        {
            static serialize(value)
            {
                _value = value;
            }
        }

        // Verificamos que se llame al método estático con el sut como parámetro
        // ya que toda la lógica de serialización se encuentra en ese método.
        const _sut = new _Class();
        _sut.serialize();
        this._assert('', _value, _sut);
    }

    /**
     * Pruebas del método `split`.
     */
    testSplit()
    {
        this._assert(
            '',
            Object.assign(
                this.sut,
                {
                    a : 1,
                    b : 2,
                    c : 3,
                    d : 4
                }
            )
                .split(),
            {
                keys   : [ 'a', 'b', 'c', 'd' ],
                values : [ 1, 2, 3, 4 ]
            }
        );
    }

    /**
     * Pruebas del método estático `i`.
     */
    testStaticI()
    {
        let _instance = jfObject.i();
        //@formatter:off
        //-------------------------------------------------------------------------
        this._assert('ok',       _instance instanceof jfObject);
        this._assert('equal',    _instance, jfObject.i());
        //-------------------------------------------------------------------------
        class jfObjectChild extends jfObject {};
        _instance = jfObjectChild.i();
        this._assert('ok',       _instance instanceof jfObject);
        this._assert('ok',       _instance instanceof jfObjectChild);
        this._assert('equal',    _instance, jfObjectChild.i());
        this._assert('notEqual', _instance, jfObject.i());
        //-------------------------------------------------------------------------
        class jfObjectChildChild extends jfObjectChild {};
        _instance = jfObjectChildChild.i();
        this._assert('ok',       _instance instanceof jfObject);
        this._assert('ok',       _instance instanceof jfObjectChild);
        this._assert('ok',       _instance instanceof jfObjectChildChild);
        this._assert('equal',    _instance, jfObjectChildChild.i());
        this._assert('notEqual', _instance, jfObjectChild.i());
        this._assert('notEqual', _instance, jfObject.i());
        //-------------------------------------------------------------------------
        // AVISO: Si no tiene nombre la clase, se devolverá la misma instancia
        // aunque el contexto sea otro.
        this._assert('equal', jfObject.i.call(function(){}), jfObject.i.call(function(){}));
        //-------------------------------------------------------------------------
        //@formatter:on
    }

    /**
     * Pruebas del método estático `isObject`.
     */
    testStaticIsObject()
    {
        const _isObject = jfObject.isObject;
        [ '', 'abc', 0, 1, false, true, [], null, () => null ].forEach(
            value => this._assert('', _isObject(value), false)
        );
        [ {}, new Date(), new jfObject() ].forEach(
            value => this._assert('', _isObject(value), true)
        );
    }

    /**
     * Pruebas del método estático `keys`.
     */
    testStaticKeys()
    {
        this._assert(
            '',
            jfObject.keys(
                {
                    a   : 1,
                    b   : 2,
                    c   : 3,
                    d   : 4,
                    $5  : 5,
                    $$6 : 6,
                    _7  : 7,
                    __8 : 8,
                    u   : undefined,
                    fn  : () => null
                }
            ),
            [ 'a', 'b', 'c', 'd' ]
        );
    }

    /**
     * Pruebas del método estático `merge`.
     */
    testStaticMerge()
    {
        this.constructor.getAllTypes().forEach(
            type =>
            {
                this._assert('', jfObject.merge(null, type), null);
                this._assert('', jfObject.merge(type, null), type);
            }
        );
        this._assert(
            '',
            jfObject.merge(
                {
                    a : 1,
                    b : 2,
                    c : {
                        d : 3,
                        e : {
                            f : 4
                        }
                    },
                    g : {
                        h : 10
                    },
                    i : -2
                },
                {
                    a : 10,
                    c : {
                        d : 11,
                        g : 12,
                        e : {
                            g : 13
                        }
                    },
                    g : -1,
                    i : {
                        j : -3
                    }
                }
            ),
            {
                a : 10,
                b : 2,
                c : {
                    d : 11,
                    e : {
                        f : 4,
                        g : 13
                    },
                    g : 12
                },
                g : -1,
                i : {
                    j : -3
                }
            }
        );
    }

    /**
     * Pruebas del método estático `serialize`.
     */
    testStaticSerialize()
    {
        const _sut = this.sut;
        const _data = {
            array  : [
                1,
                true,
                Object.assign(new jfObject(), { a : 1, _b : 2 })
            ],
            bool   : false,
            number : 1,
            sut    : _sut,
            string : 'hola'
        };
        Object.assign(_sut, { _x : 'x', $y : 'y', z : 'z' });
        this._assert(
            '',
            jfObject.serialize(_data),
            {
                array  : [
                    1,
                    true,
                    {
                        a : 1
                    }
                ],
                bool   : false,
                number : 1,
                sut    : {
                    z : 'z'
                },
                string : 'hola'
            }
        );
    }

    /**
     * Pruebas del método `toArray`.
     */
    testToArray()
    {
        this._assert(
            '',
            Object.assign(
                this.sut,
                {
                    a : 1,
                    b : 2,
                    c : 3,
                    d : 4
                }
            )
                .toArray(),
            [
                [ 'a', 1 ],
                [ 'b', 2 ],
                [ 'c', 3 ],
                [ 'd', 4 ]
            ]
        );
    }

    /**
     * Pruebas del método `toJSON`.
     */
    testToJSON()
    {
        this._assert(
            '',
            Object.assign(
                this.sut,
                {
                    property1  : 1,
                    property2  : [ 2, 22 ],
                    _protected : 3,
                    __private  : 4
                }
            )
                .toJSON(),
            {
                property1 : 1,
                property2 : [ 2, 22 ]
            }
        );
    }

    /**
     * Pruebas del método `toString`.
     * Verifica que se devuelva el nombre de la clase.
     */
    testToString()
    {
        let _sut = this.sut;
        this._assert('equal', _sut.toString(), '[class jfObject]');

        //@formatter:off
        class jfObjectChild extends jfObject {};
        _sut = new jfObjectChild();
        this._assert('equal', _sut.toString(), '[class jfObjectChild]');

        class jfObjectChildChild extends jfObjectChild {};
        _sut = new jfObjectChildChild();
        this._assert('equal', _sut.toString(), '[class jfObjectChildChild]');

        this._assert('equal', _sut.toString.call({ constructor : {} }), '[class <jf.Object>]');
        //@formatter:on
    }
};
