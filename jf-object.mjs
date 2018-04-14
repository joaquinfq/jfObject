import propSep from 'prop-sep';
import Events  from 'events';
/**
 * Listado de singletons instanciados.
 *
 * @type {Object}
 */
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
 */
export default class jfObject extends Events
{
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
        objs.forEach(obj => this.setProperties(obj));
    }

    /**
     * Iterador que permite usar un bucle for..of
     * para iterar sobre la instancia.
     *
     * @return {Object} Configuración a usar por el iterador.
     */
    [Symbol.iterator]()
    {
        let _current = 0;
        const _keys  = [];
        for (const _property in this)
        {
            // Eliminamos las propiedades privadas y protegidas.
            // noinspection JSUnfilteredForInLoop
            if (_property[0] !== '_' && typeof this[_property] !== 'function' && this[_property] !== undefined)
            {
                // noinspection JSUnfilteredForInLoop
                _keys.push(_property);
            }
        }

        return {
            next()
            {
                const _key = _keys[_current++];
                return {
                    done  : _key === undefined,
                    value : _key
                };
            }
        };
    }

    /**
     * Asigna de manera recursiva las propiedades de los objetos pasados como parámetros.
     *
     * @method assign
     *
     * @param {...Object} objs Listado de objetos a aplicar a la instancia.
     *
     * @return {jfObject} La instancia actual.
     */
    assign(...objs)
    {
        const _isObject = jfObject.isObject;
        for (const _obj of objs)
        {
            if (_isObject(_obj))
            {
                for (const _prop in _obj)
                {
                    if (_obj.hasOwnProperty(_prop))
                    {
                        const _value = _obj[_prop];
                        if (typeof _value !== 'function')
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
                                else if (_value.constructor === Object)
                                {
                                    this[_prop] = new jfObject(_value);
                                }
                                else
                                {
                                    this[_prop] = _value;
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

        return this;
    }

    /**
     * Ejecuta de manera síncrona cada unos de los callbacks registrados para el evento
     * en el orden en que fueron registrados.
     * También se llama a todos los que se han registrado al evento `*`.
     *
     * @param {String} name   Nombre del evento.
     * @param {Array}  params Parámetros del evento.
     *
     * @return {jfObject} La instancia actual.
     */
    emit(name, ...params)
    {
        super.emit(name, ...params);
        super.emit('*', name, ...params);

        return this;
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
     * @see https://github.com/joaquinfq/prop-sep
     */
    get(path, defValue)
    {
        return propSep.get(this, path, defValue);
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
     * @see https://github.com/joaquinfq/prop-sep
     */
    has(path)
    {
        return propSep.has(this, path);
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
     * @see https://github.com/joaquinfq/prop-sep
     */
    remove(path)
    {
        return propSep.remove(this, path);
    }

    /**
     * Asigna el valor a la ruta especificada.
     *
     * @method set
     *
     * @param {String} path  Ruta de la propiedad a obtener usando `.` para separar las claves.
     * @param {*}      value Valor a asignar.
     *
     * @return {jfObject} La instancia actual.
     *
     * @see https://github.com/joaquinfq/prop-sep
     */
    set(path, value)
    {
        propSep.set(this, path, value);

        return this;
    }

    /**
     * Asigna las propiedades especificadas a la instancia.
     * Solamente se asignan las propiedades que están definidas en la clase,
     * es decir, aquellas que tienen un valor definido.
     *
     * @method setProperties
     *
     * @param {Object} values Objecto con las propiedades a aplicar a la instancia.
     *
     * @return {jfObject} La instancia actual.
     */
    setProperties(values)
    {
        if (values && typeof values === 'object')
        {
            for (const _property of Object.keys(values))
            {
                if (this[_property] !== undefined)
                {
                    this[_property] = values[_property];
                }
            }
        }

        return this;
    }

    /**
     * Separa el objeto en 2 elementos, claves y valores.
     * El objeto devuelto tiene una clave `keys` con el listado de claves
     * presentes en la instancia y otra clave `values` con sus respectivos
     * valores el mismo orden.
     *
     * @method split
     *
     * @return {{keys: Array, values: Array}} Objeto convertido.
     */
    split()
    {
        const _keys   = [];
        const _values = [];
        for (const _prop of this)
        {
            _keys.push(_prop);
            _values.push(this[_prop]);
        }

        return {
            keys   : _keys,
            values : _values
        };
    }

    /**
     * Convierte el objeto en un array.
     * El índice 0 de cada elemento es la clave y el índice 1 es su valor.
     * Útil si se quiere convertir en un `Map`.
     *
     * @method toArray
     *
     * @return {Array[]} Objeto convertido.
     */
    toArray()
    {
        const _items = [];
        for (const _prop of this)
        {
            _items.push([_prop, this[_prop]]);
        }

        return _items;
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
    toJSON(filter)
    {
        if (typeof filter !== 'function')
        {
            filter = (property, value) => property[0] !== '_' && value !== undefined;
        }
        const _transform = (property, value) => {
            const _type = typeof value;
            if (_type !== 'function' && filter(property, value))
            {
                if (value && _type === 'object')
                {
                    if (Array.isArray(value))
                    {
                        value = value.map(v => _transform(property, v));
                    }
                    else
                    {
                        const _result = {};
                        for (const _property in value)
                        {
                            const _value = _transform(_property, value[_property]);
                            if (_value !== undefined)
                            {
                                _result[_property] = _value;
                            }
                        }
                        value = _result;
                    }
                }
            }
            else
            {
                value = undefined;
            }

            return value;
        };

        return _transform('***************', this);
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
     * @return {Boolean} `true` si el valor es un objeto.
     */
    static isObject(obj)
    {
        return Boolean(obj) && typeof obj === 'object' && !Array.isArray(obj);
    }
}
