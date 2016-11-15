/**
 * Created by galen on 16/11/14.
 */


import * as is from './is-type';

/**
 * 调用Object的toString
 */
function objectToString(arg) {
    return Object.prototype.toString.call(arg);
}

/**
 * 向对象中注入属性和值
 */
function inject(obj, properties, result) {

    if (!is.isObject(obj)) {
        return new Error('obj is required and should be object');
    }

    if (!properties || properties.length === 0) {
        return;
    }

    const property = properties.shift();

    if (properties.length === 0) {
        obj[property] = result;
        return;
    }

    is.isObject(obj[property]) || (obj[property] = {});

    inject(obj[property], properties, result);
}

/**
 * 数组去重
 * @param a
 */
function distinct(a) {
    if (!is.isArray(a)) {
        return new Error('distinct的参数必须为数组或者类数组')
    }
    return [...new Set(a)];
}

export {
    objectToString,
    inject,
    distinct
}
