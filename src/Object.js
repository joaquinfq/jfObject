import propsep from '@jf/prop-sep';

/**
 * Listado de singletons instanciados.
 *
 * @type {object}
 */
const singletons = {};

/**
 * Clase que aporta las siguientes funcionalidades:
 *
 * - Acceso a propiedades mediante rutas separadas por '.'.
 * - Creación de singletons.
 * - Iteración usando for..of
 *
 * @namespace jf
 * @class     jf.Object
 */
export default class jfObject
{
    /**
     * Iterador que permite usar un bucle for..of para iterar sobre la instancia.
     *
     * @return {object} Configuración a usar por el iterador.
     */
    [Symbol.iterator]()
    {
        let _current = 0;
        const _keys = this.constructor.keys(this);

        return {
            next()
            {
                const _key = _keys[_current++];
                return {
                    done : _key === undefined, value : _key
                };
            }
        };
    }

    /**
     * Constructor de la clase.
     *
     * @param {object[]} args Listado de objetos a fusionar con el actual.
     */
    constructor(...args)
    {
        this.merge(...args);
    }

    /**
     * Asigna las propiedades especificadas a la instancia.
     * Solamente se asignan las propiedades que están definidas en la clase.
     *
     * @param {object} values Objecto con las propiedades a aplicar a la instancia.
     *
     * @return {this} La instancia actual.
     */
    assign(values)
    {
        for (const _property of this.constructor.keys(values))
        {
            if (_property in this && typeof this[_property] !== 'function')
            {
                let _value = values[_property];
                const setter = 'set' + _property[0].toUpperCase() + _property.substring(1);
                if (typeof this[setter] === 'function')
                {
                    _value = this[setter](_value, _property, values);
                }
                if (_value !== undefined)
                {
                    this[_property] = _value;
                }
            }
        }

        return this;
    }

    /**
     * Devuelve el valor correspondiente a la ruta especificada.
     *
     * @param {string} path     Ruta de la propiedad a obtener usando `.` para separar las claves.
     * @param {*}      defValue Valor por defecto a devolver si la ruta no está definida.
     *
     * @return {*} Valor de la ruta.
     *
     * @see https://github.com/joaquinfq/prop-sep
     */
    get(path, defValue = null)
    {
        return propsep.get(this, path, defValue);
    }

    /**
     * Verifica si la ruta a una propiedad está definida.
     *
     * @param {string} path Ruta de la propiedad a verificar usando `.` para separar las claves.
     *
     * @return {boolean} `true` si la ruta existe.
     *
     * @see https://github.com/joaquinfq/prop-sep
     */
    has(path)
    {
        return propsep.has(this, path);
    }

    /**
     * Fusiona los objetos con la instancia.
     *
     * @param {object[]} objs Listado de objetos a fusionar.
     *
     * @return {this} La instancia actual.
     */
    merge(...objs)
    {
        const _constructor = this.constructor;
        const _isObject = _constructor.isObject;
        for (const _obj of objs)
        {
            if (_isObject(_obj))
            {
                for (const _prop of _constructor.keys(_obj))
                {
                    let _value = _obj[_prop];
                    if (_isObject(_value))
                    {
                        let _current = this[_prop];
                        if (_isObject(_current))
                        {
                            if (_current instanceof jfObject)
                            {
                                _current.merge(_value);
                            }
                            else
                            {
                                _constructor.merge(_current, _value);
                            }
                            _value = undefined;
                        }
                    }
                    if (_value !== undefined)
                    {
                        this[_prop] = _value;
                    }
                }
            }
        }

        return this;
    }

    /**
     * Elimina una propiedad de la clase.
     *
     * @param {string} path Ruta de la propiedad a eliminar usando `.` para separar las claves.
     *
     * @return {boolean} `true` si la clave se ha eliminado.
     *
     * @see https://github.com/joaquinfq/prop-sep
     */
    remove(path)
    {
        return propsep.remove(this, path);
    }

    /**
     * Serializa la instancia.
     *
     * @return {object} Instancia serializado.
     */
    serialize()
    {
        return this.constructor.serialize(this);
    }

    /**
     * Asigna el valor a la ruta especificada.
     *
     * @param {string} path  Ruta de la propiedad a asginar usando `.` para separar las claves.
     * @param {*}      value Valor a asignar.
     *
     * @return {this} La instancia actual.
     *
     * @see https://github.com/joaquinfq/prop-sep
     */
    set(path, value)
    {
        propsep.set(this, path, value);

        return this;
    }

    /**
     * Separa el objeto en 2 elementos, claves y valores.
     * El objeto devuelto tiene una clave `keys` con el listado de claves
     * presentes en la instancia y otra clave `values` con sus respectivos
     * valores en el mismo orden.
     *
     * @return {{keys: string[], values: array}} Objeto convertido.
     */
    split()
    {
        const _keys = [];
        const _values = [];
        for (const _prop of this)
        {
            _keys.push(_prop);
            _values.push(this[_prop]);
        }

        return {
            keys : _keys, values : _values
        };
    }

    /**
     * Convierte el objeto en un array.
     * El índice 0 de cada elemento es la clave y el índice 1 es su valor.
     * Útil si se quiere convertir en un `Map`.
     *
     * @return {array[]} Objeto convertido.
     */
    toArray()
    {
        const _items = [];
        for (const _prop of this)
        {
            _items.push([ _prop, this[_prop] ]);
        }

        return _items;
    }

    /**
     * @override
     */
    toJSON()
    {
        const _json = {};
        const _constructor = this.constructor;
        _constructor.keys(this).forEach(key => _json[key] = _constructor.serialize(this[key]));

        return _json;
    }

    /**
     * @override
     */
    toString()
    {
        return `[class ${ this.constructor.name || '<jf.Object>' }]`;
    }

    /**
     * Devuelve una instancia de la clase para poder usarla como un singleton.
     *
     * AVISO: Todas las clases anónimas compartirán el mismo singleton.
     *
     * @return {jf.Object} Instancia a usar.
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

    /**
     * Indica si el valor especificado es un `Object` excluyendo los `Array`.
     *
     * @param {*} obj Objeto a verificar.
     *
     * @return {boolean} `true` si el valor es un objeto.
     */
    static isObject(obj)
    {
        return Boolean(obj) && typeof obj === 'object' && !Array.isArray(obj);
    }

    /**
     * Devuelve un listado con las claves públicas y útiles presentes en el objeto.
     *
     * @param {*} object Objeto a analizar.
     *
     * @return {string[]} Listado de claves.
     */
    static keys(object)
    {
        return object && typeof object === 'object'
            ? Object.keys(object)
                .filter(key => key[0] !== '_' && key[0] !== '$' && object[key] !== undefined && typeof object[key] !== 'function')
            : [];
    }

    /**
     * Fusiona las claves del objeto `src` con las del objeto `dst`.
     *
     * @param {object} dst Objeto que recibe las claves.
     * @param {object} src Objeto que aporta las claves.
     *
     * @return {object} Objeto que ha recibido las claves.
     */
    static merge(dst, src)
    {
        const _isObject = this.isObject;
        if (_isObject(dst) && _isObject(src))
        {
            for (const _key of this.keys(src))
            {
                let _value = src[_key];
                if (_isObject(_value))
                {
                    const _current = dst[_key];
                    if (_isObject(_current))
                    {
                        _value = this.merge(_current, _value);
                    }
                }
                dst[_key] = _value;
            }
        }

        return dst;
    }

    /**
     * Analiza el valor y realiza las conversiones necesarias para poder serializarlo.
     *
     * @param {*} value Valor a convertir.
     *
     * @return {*} Valor convertido.
     *
     * @protected
     */
    static serialize(value)
    {
        if (value)
        {
            if (Array.isArray(value))
            {
                value = value.map(this.serialize, this);
            }
            else if (value instanceof jfObject)
            {
                value = value.toJSON();
            }
            else if (typeof value === 'object')
            {
                const _obj = {};
                this.keys(value).forEach(key => _obj[key] = this.serialize(value[key]));
                value = _obj;
            }
        }

        return value;
    }
};
