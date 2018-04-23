const assert      = require('assert');
let numAssertions = 0;
module.exports    = {
    get numAssertions()
    {
        return numAssertions;
    },
    assert(name, ...args)
    {
        try
        {
            assert[name](...args);
            ++numAssertions;
        }
        catch (e)
        {
            console.log('ERROR: %s', e.message);
        }
    }
};
