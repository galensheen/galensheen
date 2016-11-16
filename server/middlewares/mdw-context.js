/**
 * Created by galen on 16/11/15.
 */

import extend from 'extend';

/**
 * 用来扩展上下文context
 * @param options
 */
export default function mdw_context(options = {}) {

    return async function context(ctx, next) {

        /**
         * 扩展ctx.render，默认包含appInfo的信息
         */
        const render = ctx.render;
        ctx.render = function (relPath, locals = {}) {
            // 将应用信息绑定locals.app, 方便在模板中渲染
            locals.app = ctx.config.app;
            return render.apply(ctx, [relPath, locals]);
        };

        /**
         * 封装restful的成功方法，返回success: true, code: 200
         */
        ctx.success = function (body = {}) {
            extend(body, {success: true, code: 200});
            return ctx.body = body;
        };

        /**
         * 封装restful的失败风发，返回success: false, code: 500
         */
        ctx.fail = function (body = {}) {
            extend(body, {success: false, code: 500});
            return ctx.body = body;
        };

        await next();
    }
}
