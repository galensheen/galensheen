/**
 * Created by galen on 16/11/14.
 */

import {objectToString} from './common';
import * as stream from 'stream';

/**
 * 是否为数组
 * @param arg
 * @returns {boolean}
 */
function isArray(arg) {
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return objectToString(arg) === '[object array]';
}

/**
 * 是否布尔值
 * @param arg
 * @returns {boolean}
 */
function isBoolean(arg) {
    return typeof arg === 'boolean';
}

/**
 * 是否为null
 * @param arg
 * @returns {boolean}
 */
function isNull(arg) {
    return arg === null;
}

/**
 * 是否为undefined
 * @param arg
 * @returns {boolean}
 */
function isUndefined(arg) {
    return typeof arg === 'undefined';
}

/**
 * 是否null或者undefined
 * @param arg
 * @returns {boolean}
 */
function isNullOrUndefined(arg) {
    return arg == null;
}

/**
 * 是否为数字
 * @param arg
 * @returns {boolean}
 */
function isNumber(arg) {
    return typeof arg === 'number';
}

/**
 * 是否为字符串
 * @param arg
 * @returns {boolean}
 */
function isString(arg) {
    return typeof arg === 'string';
}

/**
 * 是否symbol
 * @param arg
 * @returns {boolean}
 */
function isSymbol(arg) {
    return typeof arg === 'symbol';
}

/**
 * 是否为RegExp
 * @param arg
 * @returns {boolean}
 */
function isRegExp(arg) {
    return objectToString(arg) === '[object RegExp]';
}

/**
 * 是否对象
 * @param arg
 * @returns {boolean}
 */
function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

/**
 * 是否为日期
 * @param arg
 * @returns {boolean}
 */
function isDate(arg) {
    return objectToString(arg) == '[object Date]';
}

/**
 * 是否为Error
 * @param arg
 * @returns {boolean}
 */
function isError(arg) {
    return objectToString(arg) === '[object Error]' || arg instanceof Error;
}

/**
 * 是否为函数
 * @param arg
 * @returns {boolean}
 */
function isFunction(arg) {
    return typeof arg === 'function';
}

/**
 * 是否原子类型
 * @param arg
 * @returns {boolean}
 */
function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'symbol' || typeof arg === 'undefined';
}

/**
 * 是否为stream
 * @param obj
 * @returns {boolean}
 */
function isStream (obj) {
    return obj instanceof stream.Stream
}

/**
 * 是否为readable的stream
 * @param obj
 * @returns {boolean}
 */
function isReadable (obj) {
    return isStream(obj) && typeof obj._read == 'function' && typeof obj._readableState == 'object'
}

/**
 * 是否为writable的stream
 * @param obj
 * @returns {boolean}
 */
function isWritable (obj) {
    return isStream(obj) && typeof obj._write == 'function' && typeof obj._writableState == 'object'
}

/**
 * 是否为可读和可写stream
 * @param obj
 * @returns {boolean}
 */
function isDuplexStream(obj) {
    return isReadable(obj) && isWritable(obj)
}

/**
 * 是否为无穷
 * @param arg
 * @returns {boolean}
 */
function isFinite(arg) {
    return Number.isFinite(arg);
}

/**
 * 是否为NaN
 * @param arg
 * @returns {boolean}
 */
function isNaN(arg) {
    return Number.isNaN(arg);
}

/**
 * 是否为generator
 * @param arg
 * @returns {*|boolean}
 */
function isGenerator(arg) {
    return arg && typeof arg.next === 'function' && typeof arg.throw === 'function';
}

/**
 * 是否为promise
 * @param arg
 * @returns {*|boolean}
 */
function isPromise(arg) {
    return arg && typeof arg.then === 'function';
}

const MAX_INT_31 = Math.pow(2, 31);

/**
 * 是否为整数
 * @param arg
 * @returns {boolean}
 */
function isInt(arg) {
    return isNumber(arg) && (arg % 1 === 0);
}

/**
 * 是否为32位整数
 * @param arg
 * @returns {boolean}
 */
function isInt32(arg) {
    return isInt(arg) && arg < MAX_INT_31 && arg >= -MAX_INT_31;
}

/**
 * 是否为长整形整数
 * @param arg
 * @returns {boolean}
 */
function isLong(arg) {
    return isInt(arg) && (arg >= MAX_INT_31 || arg < -MAX_INT_31);
}

/**
 * 是否为浮点数字
 * @param arg
 * @returns {boolean}
 */
function isDouble(arg) {
    return isNumber(arg) && !isNaN(arg) && arg % 1 !== 0;
}

export {
    isArray,
    isBoolean,
    isNull,
    isUndefined,
    isNullOrUndefined,
    isNumber,
    isString,
    isSymbol,
    isRegExp,
    isObject,
    isDate,
    isError,
    isFunction,
    isPrimitive,
    isStream,
    isReadable,
    isWritable,
    isDuplexStream,
    isFinite,
    isNaN,
    isGenerator,
    isPromise,
    isInt,
    isInt32,
    isLong,
    isDouble
}
