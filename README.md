# @jf/object [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Class providing dot path syntax for properties, JSON serialization, singletons and more.

## Usage

[![npm install @jf/object](https://nodei.co/npm/@jf/object.png?compact=true)](https://npmjs.org/package/@jf/object/)

### Objects as parameters

You can pass several objects and will be merged recursively.

```js
const obj = new jfObject(
    {
        a : {
            b : 0
            c : 2
        }
    },
    {
        a : {
            b : 1,
        }
    },
    {
        a : {
            c : 3
        }
    }
);
console.log(obj.toJSON()); // { a : { b : 1, c : 3 } }
```

### Dot notation

You can use dot notation in order to assign/retrieve/test nested objects.

```js
const obj = new jfObject();
obj.set('d.e.f', 5);
console.log(obj.toJSON()); // { d : { e : { f : 5 } } }
console.log(obj.get('d.e')); // { f : 5 }
console.log(obj.has('d.e.f')); // true
```

### Merging objects

Objects can be merged in 2 ways:

* **Recursively**: Use `obj.merge(...)`.
* **Overwrite existing keys**: Use `Object.assign(obj, ...)`

```js
const obj = new jfObject(
    {
        a : {
            b : 0
        }
    }
);
// Recursive merge
obj.merge(
    {
        a : {
            c : 1
        }
    }
);
console.log(obj.toJSON()); // { a : { b : 0, c : 1 } }
// Overwrite merge
Object.assign(
    obj,
    {
        a : {
            c : 2
        }
    }
);
console.log(obj.toJSON()); // { a : { c : 2 } }
```

### Iterating over properties

You can use new `ES6` loop `for..of`:

```js
const obj = new jfObject(
    {
        a : 1,
        c : 2,
        f : 3,
        h : 4
    }
);
for (const prop of obj)
{
    console.log('%s = %s', prop, obj[prop]);    
}
// a = 1
// c = 2
// f = 3
// h = 4
```

### Keys & values

If you need to split object into keys and values, you can use `split` or `toArray` methods.


```js
const obj = new jfObject(
    {
        a : 1,
        c : 2,
        f : 3,
        h : 4
    }
);
console.log(obj.split()); // { keys: [ 'a', 'c', 'f', 'h' ], values: [ 1, 2, 3, 4 ] }
console.log(obj.toArray());  // [ [ 'a', 1 ], [ 'c', 2 ], [ 'f', 3 ], [ 'h', 4 ] ]
```

### Singleton

If you need to share the same instance between differents external modules,
you can use static method `i()` in order to retrieve the same instance
anywhere in the app.

```js
class User extends jfObject
{
    // User class methods and properties
}
// Initialize the User instance on ajax response using external library:
function onAjaxResponse(data)
{
    //...
    User.i().setProperties(data);
    //...
}
// In UI, using external framework
<user-info data="{{User.i()}}" />
```
