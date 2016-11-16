/**
 * Created by galen on 16/11/16.
 */


/**
 * 将config配置绑定到context.config
 * @param options
 * @returns {Function}
 */
export default function mdw_info(options = {}) {

    return async function info(ctx, next) {

        ctx.config = options.config || {};

        await next();
    }
}
