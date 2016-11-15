/**
 * Created by galen on 16/11/9.
 */

import extend from 'extend';
import json from 'koa-json';
import convert from 'koa-convert';

/**
 * 封装koa-json的memo-json中间件
 * @param {Object} config - koa-json中间件的配置
 * @returns {GeneratorFunction}
 */
export default function memoJson(config = {}) {

    config = extend(true, {
        pretty: false, param: 'pretty'
    }, config);

    return convert(json(config));
}
