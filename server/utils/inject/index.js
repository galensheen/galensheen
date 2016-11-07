/**
 * Created by galen on 16/11/7.
 */
'use strict';

const is = require('is-type-of');
const assert = require('assert');

/**
 * 注入函数
 * @param {object} obj - 被注入对象
 * @param {Array} properties - 注入的key
 * @param {*} result - 被注入的值
 */
module.exports = function inject(obj, properties, result) {

    if (!is.object(obj)) {
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

    is.object(obj[property]) || (obj[property] = {});

    inject(obj[property], properties, result);
};

