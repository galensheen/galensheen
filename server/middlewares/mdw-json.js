/**
 * Created by galen on 16/11/9.
 */

import extend from 'extend';
import json from 'koa-json';
import convert from 'koa-convert';

/**
 * 封装koa-json的memo-json中间件
 * @param {Object} options - koa-json中间件的配置
 * @returns {GeneratorFunction}
 */
export default function mdw_json(options = {}) {

    options = extend(true, {
        pretty: false, param: 'pretty'
    }, options);

    return convert(json(options));
}
