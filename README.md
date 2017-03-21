# jfObject [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Class to easily manipulate objects.
Can be used as base class for event-oriented libraries. 

## Usage

[![npm install jfObject](https://nodei.co/npm/jf-object.png?mini=true)](https://npmjs.org/package/jf-object/)

### Objects as parameters

You can pass several objects to constructor and will be
merged recursively.

```js
const obj = new jfObject(
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
);
console.log(obj.toJSON()); // { a : { b : 1, c : 3 }, d : { e : { f : 5 } } }
```

### Dot notation

You can use dot notation for to assign/retrieve/test nested objects.

```js
const obj = new jfObject();
obj.set('d.e.f', 5);
console.log(obj.toJSON()); // { e : { f : 5 } }
console.log(obj.get('d.e')); // { f : 5 }
console.log(obj.has('d.e.f')); // true
```

### Merging objects

Objects can be merged in 2 ways:

* **Recursively**: Use `obj.assign(...)`.
* **Overwrite existing keys**: Use `Object.assign(obj, ...)`

Using `obj.assign` will convert all objects into `jfObject` instances.

```js
const obj = new jfObject(
    {
        a : {
            b : 0
        }
    }
);
// Recursive merge
obj.assign(
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
for (let prop of obj)
{
    console.log('%s = %s', prop, obj[prop]);    
}
// a = 1
// c = 2
// f = 3
// h = 4
```

### Keys & values

If you need split object into keys and values, you can use `toArray` or `toObject` methods.


```js
const obj = new jfObject(
    {
        a : 1,
        c : 2,
        f : 3,
        h : 4
    }
);
console.log(obj.toArray());  // [ [ 'a', 1 ], [ 'c', 2 ], [ 'f', 3 ], [ 'h', 4 ] ]
console.log(obj.toObject()); // { keys: [ 'a', 'c', 'f', 'h' ], values: [ 1, 2, 3, 4 ] }
```

### Events

`jfObject` instances can emit/listen events because they extend node `Events` class:

```js
const obj = new jfObject();
obj.on(data => console.log(data));
obj.emit('test-event', { a : 1 });
```

### Singleton

If you need to share the same instance between differents external modules,
you can use static method `i()` for to retrieve the same instance anywhere
in the app.

```js
class User extends jfObject {
    // User class methods
}
// Initialize the User instance on ajax response using external library:
function onAjaxResponse(data)
{
    //...
    User.i().assign(data);
    //...
}
// In UI, using external framework
<user-info data="{{User.i()}}" />
```
