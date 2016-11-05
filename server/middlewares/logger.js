/**
 * Created by galen on 16/11/5.
 */
'use strict';

/**
 * 日志中间件
 * @param {string} [format] - 日志格式
 * @returns {Function}
 */
export default function (format) {

    format = format || ':method ":url"';

    return async function (ctx, next) {

        const start = new Date();

        await next();

        const ms = new Date() - start;
        console.log(format.replace(':method', ctx.method).replace(':url', ctx.url) + ` - ${ms}ms`);
    }
}
