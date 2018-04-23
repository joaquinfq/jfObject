const assert   = require('./assert');
const jfObject = require('../jf-object');

function buildDefaults(...data)
{
    const _defaults = {};
    data.forEach(
        obj => Object.keys(obj).forEach(name => _defaults[name] = null)
    );
    return _defaults;
}

function testCalls(...params)
{
    const _objs = [];

    class _Class extends jfObject
    {
        setProperties(values)
        {
            _objs.push(values);
        }
    }

    new _Class(...params);
    assert.assert('deepStrictEqual', _objs, params);
}

function testAssignment(...params)
{
    class _Class extends jfObject
    {
        constructor(...values)
        {
            super();
            Object.assign(this, _defaults);
            values.forEach(v => this.setProperties(v));
        }
    }

    const _defaults = buildDefaults(...params);
    assert.assert('deepStrictEqual', new _Class().toJSON(), _defaults);
    assert.assert('deepStrictEqual', new _Class(null).toJSON(), _defaults);
    assert.assert('deepStrictEqual', new _Class(undefined).toJSON(), _defaults);
    assert.assert(
        'deepStrictEqual',
        new _Class({ dd : 4, ee : 20 }, ...params).toJSON(),
        Object.assign({}, ...params)
    );
}

function testAssignmentWithParse()
{

    class _Class extends jfObject
    {
        constructor(...values)
        {
            super();
            Object.assign(this, _defaults);
            values.forEach(v => this.setProperties(v));
        }

        _parseA(value, property, values)
        {
            assert.assert('deepStrictEqual', value, _values.a);
            assert.assert('deepStrictEqual', property, 'a');
            assert.assert('deepStrictEqual', values, _values);

            return value === null
                ? null
                : 2 * value;
        }

        _parseB(value)
        {
        }
    }

    const _defaults = buildDefaults(...params);
    const _values   = Object.assign({}, ...params);
    const _class    = new _Class(_values);
    // _parseA lo duplica.
    _values.a *= 2;
    //  _parseB devuelve undefined por lo tanto nunca se modifica.
    _values.b  = null;
    assert.assert('deepStrictEqual', _class.toJSON(), _values);
}

const params = [
    { a : 10 },
    { b : 20 },
    { c : 30 }
];
//------------------------------------------------------------------------------
testAssignment(...params);
testAssignmentWithParse(...params);
testCalls(...params);
