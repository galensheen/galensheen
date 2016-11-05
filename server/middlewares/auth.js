/**
 * Created by galen on 16/11/5.
 */
'use strict';

/**
 * 如果未登录则重定向至user路由
 * @param ctx
 * @param  next
 * @returns {*}
 */
export const checkIfLogin = async (ctx, next) => {
    const user = ctx.session.user;
    const token = ctx.session.token;

    if (!user || !token) {
        return ctx.redirect('/user');
    }

    await next();
};


/**
 * 如果登录则重定向至user路由
 * @param ctx
 * @param next
 * @returns {*}
 */
export const checkIfNotLogin = async (ctx, next) => {
    const user = ctx.session.user;
    const token = ctx.session.token;

    if (user && token) {
        return ctx.redirect('/user');
    }

    await next();
};
