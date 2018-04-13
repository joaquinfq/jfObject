'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys2 = require('babel-runtime/core-js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _iterator6 = require('babel-runtime/core-js/symbol/iterator');

var _iterator7 = _interopRequireDefault(_iterator6);

var _newArrowCheck2 = require('babel-runtime/helpers/newArrowCheck');

var _newArrowCheck3 = _interopRequireDefault(_newArrowCheck2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get4 = require('babel-runtime/helpers/get');

var _get5 = _interopRequireDefault(_get4);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propSep = require('prop-sep');

var _propSep2 = _interopRequireDefault(_propSep);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Listado de singletons instanciados.
 *
 * @type {Object}
 */
var singletons = {};
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

var jfObject = function (_Events) {
    (0, _inherits3.default)(jfObject, _Events);

    /**
     * Constructor de la clase.
     *
     * @param {...Object} objs Listado de objetos a aplicar a la instancia.
     *
     * @constructor
     */
    function jfObject() {
        var _this2 = this;

        (0, _classCallCheck3.default)(this, jfObject);

        // El módulo `domain` está obsoleto en NodeJS, así que eliminamos la propiedad.
        var _this = (0, _possibleConstructorReturn3.default)(this, (jfObject.__proto__ || (0, _getPrototypeOf2.default)(jfObject)).call(this));

        delete _this.domain;

        for (var _len = arguments.length, objs = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
            objs[_key2] = arguments[_key2];
        }

        objs.forEach(function (obj) {
            (0, _newArrowCheck3.default)(this, _this2);
            return _this.setProperties(obj);
        }.bind(this));
        return _this;
    }

    /**
     * Iterador que permite usar un bucle for..of
     * para iterar sobre la instancia.
     *
     * @return {Object} Configuración a usar por el iterador.
     */


    (0, _createClass3.default)(jfObject, [{
        key: _iterator7.default,
        value: function value() {
            var _current = 0;
            var _keys = [];
            for (var _property in this) {
                // Eliminamos las propiedades privadas y protegidas.
                // noinspection JSUnfilteredForInLoop
                if (_property[0] !== '_' && typeof this[_property] !== 'function' && this[_property] !== undefined) {
                    // noinspection JSUnfilteredForInLoop
                    _keys.push(_property);
                }
            }

            return {
                next: function next() {
                    var _key = _keys[_current++];
                    return {
                        done: _key === undefined,
                        value: _key
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

    }, {
        key: 'assign',
        value: function assign() {
            var _isObject = jfObject.isObject;

            for (var _len2 = arguments.length, objs = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
                objs[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(objs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _obj = _step.value;

                    if (_isObject(_obj)) {
                        for (var _prop in _obj) {
                            if (_obj.hasOwnProperty(_prop)) {
                                var _value = _obj[_prop];
                                if (typeof _value !== 'function') {
                                    if (_isObject(_value)) {
                                        var _current = this[_prop];
                                        if (_isObject(_current)) {
                                            if (_current instanceof jfObject) {
                                                _current.assign(_value);
                                            } else {
                                                this[_prop] = new jfObject(_current, _value);
                                            }
                                        } else if (_value.constructor === Object) {
                                            this[_prop] = new jfObject(_value);
                                        } else {
                                            this[_prop] = _value;
                                        }
                                    } else {
                                        this[_prop] = _value;
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
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

    }, {
        key: 'emit',
        value: function emit(name) {
            var _get2, _get3;

            for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
                params[_key4 - 1] = arguments[_key4];
            }

            (_get2 = (0, _get5.default)(jfObject.prototype.__proto__ || (0, _getPrototypeOf2.default)(jfObject.prototype), 'emit', this)).call.apply(_get2, [this, name].concat(params));
            (_get3 = (0, _get5.default)(jfObject.prototype.__proto__ || (0, _getPrototypeOf2.default)(jfObject.prototype), 'emit', this)).call.apply(_get3, [this, '*', name].concat(params));

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

    }, {
        key: 'get',
        value: function get(path, defValue) {
            return _propSep2.default.get(this, path, defValue);
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

    }, {
        key: 'has',
        value: function has(path) {
            return _propSep2.default.has(this, path);
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

    }, {
        key: 'remove',
        value: function remove(path) {
            return _propSep2.default.remove(this, path);
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

    }, {
        key: 'set',
        value: function set(path, value) {
            _propSep2.default.set(this, path, value);

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

    }, {
        key: 'setProperties',
        value: function setProperties(values) {
            if (values && (typeof values === 'undefined' ? 'undefined' : (0, _typeof3.default)(values)) === 'object') {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)((0, _keys3.default)(values)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _property = _step2.value;

                        if (this[_property] !== undefined) {
                            this[_property] = values[_property];
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
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

    }, {
        key: 'split',
        value: function split() {
            var _keys = [];
            var _values = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _prop = _step3.value;

                    _keys.push(_prop);
                    _values.push(this[_prop]);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return {
                keys: _keys,
                values: _values
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

    }, {
        key: 'toArray',
        value: function toArray() {
            var _items = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(this), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _prop = _step4.value;

                    _items.push([_prop, this[_prop]]);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
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

    }, {
        key: 'toJSON',
        value: function toJSON(filter) {
            var _this3 = this;

            if (typeof filter !== 'function') {
                filter = function () {
                    (0, _newArrowCheck3.default)(this, _this3);
                    return true;
                }.bind(this);
            }
            var _result = {};
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(this), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _property = _step5.value;

                    var _value = this[_property];
                    if (_value !== undefined && filter(_property, _value)) {
                        _result[_property] = _value instanceof jfObject ? _value.toJSON(filter) : _value;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return _result;
        }

        /**
         * Devuelve una cadena que representa el nombre de la clase.
         *
         * @method toString
         *
         * @return {String} Nombre de la clase.
         */

    }, {
        key: 'toString',
        value: function toString() {
            return '[class ' + String(this.constructor.name) + ']';
        }

        /**
         * Devuelve una instancia de la clase para poder usarla como un singleton.
         *
         * AVISO: Todas las clases anónimas compartirán el mismo singleton.
         *
         * @return {jf.Object} Instancia a usar.
         */

    }], [{
        key: 'i',
        value: function i() {
            var _name = this.name || 'AnonymousClass';
            if (!(_name in singletons)) {
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

    }, {
        key: 'isObject',
        value: function isObject(obj) {
            return Boolean(obj) && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && !Array.isArray(obj);
        }
    }]);
    return jfObject;
}(_events2.default);

exports.default = jfObject;
