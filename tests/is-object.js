const assert   = require('./assert');
const jfObject = require('../jf-object');

[ '', 'abc', 0, 1, false, true, [], null, () => null ].forEach(
    value => assert.assert('deepStrictEqual', jfObject.isObject(value), false)
);
[ {}, new Date(), new jfObject() ].forEach(
    value => assert.assert('deepStrictEqual', jfObject.isObject(value), true)
);
