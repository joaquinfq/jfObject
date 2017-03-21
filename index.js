const dotProp    = require('dot-prop');
const Events     = require('events');
const singletons = {};
/**
 * Clase que aporta las siguientes funcionalidades:
 *
 * - Acceso a propiedades mediante rutas separadas por '.'.
 * - Creación de singletons.
 * - Iteración usando for..of
 * - Manejo de eventos.
 *
 * @namespace jf
 * @class     jf.Object
 * @extends   Events
 * @see       https://nodejs.org/api/events.html
 * @see       https://github.com/sindresorhus/deep-assign
 */
module.exports = class jfObject extends Events {
    /**
     * Iterador que permite usar un bucle for..of
     * para iterar sobre la instancia.
     *
     * @return {Object}
     */
    [Symbol.iterator]()
    {
        let _current = 0;
        let _keys    = [];
        for (let _property in this)
        {
            // Eliminamos las propiedades privadas y protegidas.
            if (_property[0] !== '_' && typeof this[_property] !== 'function')
            {
                _keys.push(_property);
            }
        }
        let _length = _keys.length;
        return {
            next()
            {
                const _value = _keys[_current++];
                return {
                    done  : _current >= _length,
                    value : _value
                }
            }
        }
    }

    /**
     * Constructor de la clase.
     *
     * @param {...Object} objs Listado de objetos a aplicar a la instancia.
     *
     * @constructor
     */
    constructor(...objs)
    {
        super();
        // El módulo `domain` está obsoleto en NodeJS, así que eliminamos la propiedad.
        delete this.domain;
        this.assign(...objs);
    }

    /**
     * Asigna de manera recursiva las propiedades de los objetos pasados como parámetros.
     *
     * @method assign
     *
     * @param {...Object} objs Listado de objetos a aplicar a la instancia.
     */
    assign(...objs)
    {
        const _isObject = jfObject.isObject;
        for (let _obj of objs)
        {
            if (jfObject.isObject(_obj))
            {
                for (let _prop in _obj)
                {
                    let _value = _obj[_prop];
                    if (_obj.hasOwnProperty(_prop) && typeof _value !== 'function')
                    {
                        if (_isObject(_value))
                        {
                            const _current = this[_prop];
                            if (_isObject(_current))
                            {
                                if (_current instanceof jfObject)
                                {
                                    _current.assign(_value);
                                }
                                else
                                {
                                    this[_prop] = new jfObject(_current, _value);
                                }
                            }
                            else
                            {
                                this[_prop] = new jfObject(_value);
                            }
                        }
                        else
                        {
                            this[_prop] = _value;
                        }
                    }
                }
            }
        }
    }

    /**
     * Devuelve el valor correspondiente a la ruta especificada.
     *
     * @method get
     *
     * @param {String} path     Ruta de la propiedad a obtener usando `.` para separar las claves.
     * @param {*}      defValue Valor por defecto a devolver si la ruta no está definida.
     *
     * @return {*} Valor de la ruta.
     *
     * @see https://github.com/sindresorhus/dot-prop
     */
    get(path, defValue)
    {
        return dotProp.get(this, path, defValue);
    }

    /**
     * Verifica si la ruta a una propiedad está definida.
     *
     * @method has
     *
     * @param {String} path Ruta de la propiedad a obtener usando `.` para separar las claves.
     *
     * @return {Boolean} `true` si la ruta existe.
     *
     * @see https://github.com/sindresorhus/dot-prop
     */
    has(path)
    {
        return dotProp.has(this, path);
    }

    /**
     * Asigna el valor a la ruta especificada.
     *
     * @method set
     *
     * @param {String} path  Ruta de la propiedad a obtener usando `.` para separar las claves.
     * @param {*}      value Valor a asignar.
     *
     * @see https://github.com/sindresorhus/dot-prop
     */
    set(path, value)
    {
        dotProp.set(this, path, value);
    }

    /**
     * Asigna las propiedades especificadas a la instancia.
     * Solamente se asignan las propiedades que están definidas en la clase,
     * es decir, aquellas que tienen un valor definido.
     *
     * @method setProperties
     *
     * @param {Object} values Objecto con las propiedades a aplicar a la instancia.
     */
    setProperties(values)
    {
        if (values && typeof values === 'object')
        {
            for (let _property of Object.keys(values))
            {
                if (this[_property] !== undefined)
                {
                    this[_property] = values[_property];
                }
            }
        }
    }

    /**
     * Convierte el objeto en un array.
     * El índice 0 de cada elemento es la clave y el índice 1 es su valor..
     *
     * @method toArray
     *
     * @return {Array[]} Objeto convertido.
     */
    toArray()
    {
        const _items = [];
        for (let _prop of this)
        {
            _items.push([_prop, this[_prop]]);
        }
        return _items
    }

    /**
     * Serializa el objeto.
     * Si se usa `JSON.stringify` este método será llamado.
     *
     * @method toJSON
     *
     * @param {Function?} filter Función que permite filtrar el resultado.
     *
     * @return {Object} Objeto serializado.
     */
    toJSON(filter = () => true)
    {
        let _result = {};
        for (let _property of this)
        {
            const _value = this[_property];
            if (_value !== undefined && filter(_property, _value))
            {
                _result[_property] = _value instanceof jfObject
                    ? _value.toJSON(filter)
                    : _value;
            }
        }
        return _result;
    }

    /**
     * Separa el objeto en 2 elementos, claves y valores.
     * El objeto devuelto tiene una clave `keys` con el listado de claves
     * presentes en la instancia y otra clave `values` con sus respectivos
     * valores el mismo orden.
     *
     * @method toObject
     *
     * @return {Object} Objeto convertido.
     */
    toObject()
    {
        const _keys   = [];
        const _values = [];
        for (let _prop of this)
        {
            _keys.push(_prop);
            _values.push(this[_prop]);
        }
        return {
            keys   : _keys,
            values : _values
        }
    }

    /**
     * Devuelve una cadena que representa el nombre de la clase.
     *
     * @method toString
     *
     * @return {String} Nombre de la clase.
     */
    toString()
    {
        return `[class ${this.constructor.name}]`;
    }

    /**
     * Devuelve una instancia de la clase para poder usarla como un singleton.
     *
     * AVISO: Todas las clases anónimas compartirán el mismo singleton.
     *
     * @return {jf.Object}
     */
    static i()
    {
        const _name = this.name || 'AnonymousClass';
        if (!(_name in singletons))
        {
            singletons[_name] = new this();
        }
        return singletons[_name];
    }

    static isObject(obj)
    {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
};
