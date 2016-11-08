/**
 * 基于koa-router实现的memo路由扩展
 * - 支持使用 HTTP verbs 定义路由(koa-router支持的都支持), 例如:
 *    - app.get('articles', '/articles', app.controllers.articles.index);
 *    - app.post('new', '/articles', 'articles.create');
 *    - app.put('update', '/articles/:id', 'articles.update');
 *    - app.delete('delete', '/articles/:id', 'articles.delete');
 * - 支持 resources 动词,为资源配置默认路由
 *    - app.resources('articles', '/articles', app.controllers.articles);
 *    - app.resources('articles', '/articles', app.controllers.articles);
 * - 可以为路由添加命名
 *   - app.get('articles', '/articles', app.controllers.articles.index);
 *   - app.get('/articles', app.controllers.articles.index);
 * - 支持设置路由中间件
 *   - app.resources('posts', '/posts', app.role.can('user'), app.controllers.posts)
 * - 支持使用方法名字符串或者function对象设置路由
 *   - app.get('articles', '/articles', app.controllers.articles.index); // 直接使用 function 对象
 *   - app.get('articles', '/articles', 'articles.index');  // 使用方法名字符串
 * - 其它
 *   - 支持app/controllers下的多级目录  // app/controllers/user/common-controller.js
 *   - 支持controller中的对象方法   // exports.user = {index: function * {}};
 *
 * Created by galen on 16/11/8.
 */
'use strict';

const KoaRouter = require('koa-router');
const join = require('path').join;
const utility = require('utility');
const inflection = require('inflection');
const methods = require('methods');
const debug = require('debug')('memo:router');

const REST_MAP = {
    index: {
        suffix: '',
        method: 'GET'
    },
    new: {
        namePrefix: 'new_',
        member: true,
        suffix: 'new',
        method: 'GET'
    },
    create: {
        suffix: '',
        method: 'POST'
    },
    show: {
        member: true,
        suffix: ':id',
        method: 'GET'
    },
    edit: {
        member: true,
        namePrefix: 'edit_',
        suffix: ':id/edit',
        method: 'GET'
    },
    update: {
        member: true,
        namePrefix: '',
        suffix: ':id',
        method: 'PUT'
    },
    destroy: {
        member: true,
        namePrefix: 'destroy_',
        suffix: ':id',
        method: 'DELETE'
    }
};

const slice = Array.prototype.slice;

/**
 * Class extends koaRouter
 */
class MemoRouter extends KoaRouter {

    /**
     * @constructor
     * @param {Object} options - Router options
     * @param {Application} app - Application object.
     */
    constructor(options, app) {
        super(options);
        this.app = app;
        this.controllers = options.controllers;
        this.logger = options.logger;

        const router = this;
        this.app.url = this.url.bind(this);
        this.app.router = this;

        ['all', 'redirect', 'register', 'del', 'param', 'resources']
            .concat(methods)
            .forEach(method => {
                this.app[method] = function () {
                    router[method].apply(router, arguments);
                };
            });
    }


    /**
     * RESTful风格路由
     * @param {String} name - Router name
     * @param {String} prefix - URL路径前缀
     * @param {Function | String} middleware - Controller或Role或字符串的Controller.Action
     * @example
     * ```js
     * app.resource('/channels', 'channels');
     * app.resource('channels', '/channels', 'channels')
     * app.resource('channels', '/channels', authMiddleware(), app.controller.channels)
     * ```
     *
     * * 例如:
     *
     * ```js
     * app.resources('/posts', 'posts')
     * ```
     *
     * 将会直接对应成:
     *
     * Method | Path            | Route Name     | Controller.Action
     * -------|-----------------|----------------|-----------------------------
     * GET    | /posts          | posts          | app.controller.posts.index
     * GET    | /posts/new      | new_post       | app.controller.posts.new
     * GET    | /posts/:id      | post           | app.controller.posts.show
     * GET    | /posts/:id/edit | edit_post      | app.controller.posts.edit
     * POST   | /posts          | posts          | app.controller.posts.create
     * PUT    | /posts/:id      | post           | app.controller.posts.update
     * DELETE | /posts/:id      | post           | app.controller.posts.destroy
     *
     * app.router.url 生成 URL 路径参考:
     * ```js
     * app.router.url('posts')
     * => /posts
     * app.router.url('post', { id: 1 })
     * => /posts/1
     * app.router.url('new_post')
     * => /posts/new
     * app.router.url('edit_post', { id: 1 })
     * => /posts/1/edit
     * ```
     * @returns {MemoRouter}
     */
    resources(name, prefix, middleware) {
        const route = this;

        // 根据参数个数重新赋值
        if (arguments.length === 3) {
            middleware = slice.call(arguments, 2);
        } else {
            middleware = slice.call(arguments, 1);
            prefix = name;
            name = null;
        }

        // 最后一个参数是controller
        const controller = middleware.pop();

        for (let key of REST_MAP) {

            let action = '';

            if (typeof controller === 'string') {
                action = `${controller}.${key}`;
            } else {
                action = controller[key];
            }

            const options = REST_MAP[key];

            // 处理 Route name 单复数， 以及前缀
            let formatName;
            if (name !== null) {
                if (options.member) {
                    formatName = inflection.singularize(name);
                } else {
                    formatName = inflection.pluralize(name);
                }
                if (options.namePrefix) {
                    formatName = options.namePrefix + formatName;
                }
            }

            route.register.call(this, join(prefix, options.suffix), [options.method], middleware.concat(action), {name: formatName});
        }

        return route;
    }


    /**
     * 覆盖router.url的原生方法，用来实现queryString的生成
     * @param {String} name - 路由名字
     * @param {Object} params - 路由参数
     * @example
     * ```js
     * router.url('edit_channel', {id: 1, name: 'foo', page: 2})
     * => channels/1/edit?name=foo&page=2
     * ```
     * @returns {String} url
     */
    url(name, params) {

        const route = this.route(name);

        // 如果没有路由注册信息则直接返回
        if (!route) {
            return;
        }

        let url = route.path;
        const querys = [];

        // 如果params有值，则更新Path的params和query
        if (typeof params === 'object' && params !== null) {

            // 匹配路由的params
            const replacedParams = [];
            url = url.replace(/:([a-zA-Z_]\w*)/g, function ($0, key) {
                if (utility.has(params, key)) {
                    const values = params[key];
                    replacedParams.push(key);
                    return utility.encodeURIComponent(Array.isArray(values) ? values[0]: values);
                }
                return $0;
            });

            // 如果匹配路由的param后，params仍有值则作为query string
            for (let key of params) {
                if (replacedParams.indexOf(key) !== -1) {
                    continue;
                }
                const values = [].concat(params[key]);
                const encodedKey = utility.encodeURIComponent(key);
                for (let val of values) {
                    querys.push(`${encodedKey}=${utility.encodeURIComponent(val)}`)
                }
            }
        }

        // 根据path是否有？拼装url
        if (querys.length > 0) {
            const queryStr = querys.join('&');
            url = url.indexOf('?') > -1 ? `${url}&${queryStr}` : `${url}?${queryStr}`;
        }

        return url;
    }


    /**
     * 覆盖原始的register函数，实现让最后一个controller可以写成字符串的形式，例如：'rest.channel.add'
     * @param {String | RegExp} path - 路由path，字符串或者正则表达式
     * @param {String[]} methods - Http请求verbs
     * @param {Function} middleware - 路由的中间件，包括controller
     * @param {Object} options
     * @returns {*}
     */
    register(path, methods, middleware, options) {

        if (middleware.length === 0) {
            middleware.push(path);
            path = options.name;
            options.name = '';
        }

        debug(`register router path(${path}) and methods(${methods})`);

        const middlewares = [];

        // 检查路由
        middleware.forEach(action => {

            if (typeof action === 'string') {
                const _action = action;
                const actions = action.split('.');
                const func = actions.pop();
                const obj = this.controllers;
                action = _getController(obj, actions, func);

                // 如果获取到的controller不是函数，则抛出异常
                if (typeof action !== 'function') {
                    let error = new Error(`${_action}不是一个有效的路由设置，请检查后再重新尝试。`);
                    error.name = 'RouterLoadError';
                    throw error;
                }
            }

            if (typeof action === 'function') {
                middlewares.push(action);
            }
        });

        if (!middlewares.length) {
            return null;
        }

        return super.register.call(this, path, methods, middlewares, options);
    }
}


/**
 * 递归从controllers集合中查找相应的controller
 * @param controllers
 * @param actions
 * @param func
 * @returns {*}
 * @private
 */
function _getController(controllers, actions, func) {

    let result = null;

    if (actions.length === 0) {
        if (func in controllers) {
            return controllers[func];
        }
    } else {
        const _index = actions[0];

        if (_index in controllers) {
            const controllers_next = controllers[_index];
            const actions_next = actions.slice(1, action.length);
            result = _getController(controllers_next, actions_next, func);
        } else {
            if (action.length > 1) {
                const controllers_next = controllers;
                const actions_next = actions.slice(1, actions.length);
                actions.next[0] = _index + '.' + actions.next[0];
                result = _getController(controllers_next, actions_next, func);
            }
        }
    }

    return result;
}

