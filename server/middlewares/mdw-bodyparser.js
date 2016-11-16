/**
 * Created by galen on 16/11/9.
 */

import extend from 'extend';
import bodyparser from 'koa-bodyparser';

/**
 * 封装koa-bodyparser的memo-bodyparser
 * @param {Object} options - koa-bodyparser的配置
 */
export default function mdw_bodyparser(options = {}) {

    options = extend(true, {
        // 支持的类型
        enableTypes: ['json', 'form'],
        encode: 'utf-8',
        formLimit: '100kb',
        jsonLimit: '1mb',
        textLimit: '1mb',
        strict: true,
        // detectJSON: function (ctx) {
        //     return /\.json$/i.test(ctx.path);
        // },
        detectJSON: null,
        extendTypes: {
            json: ['application/x-javascript']
        },
        onerror: function (err, ctx) {
            ctx.throw('body parse error', 422);
        }
    }, options);

    return bodyparser(options);
};
