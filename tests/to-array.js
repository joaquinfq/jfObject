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
        .toArray(),
    [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4]
    ]
);
