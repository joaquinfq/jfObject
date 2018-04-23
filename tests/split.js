const jfObject = require('../jf-object');
require('./assert').assert(
    'deepStrictEqual',
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
