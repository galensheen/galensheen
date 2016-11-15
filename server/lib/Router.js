/**
 * Created by galen on 16/11/14.
 */

import KoaRouter from 'koa-router';
import utility from 'utility';
import inflection from 'inflection';
import Debug from 'debug';

import * as me from '../utils';

const join = require('path').join;
const slice = Array.prototype.slice;
const debug = new Debug('memo:Router');

const REST_MAP = {
    index: {
        suffix: '',
        method: 'GET'
    },
    new: {
        namePrefix: 'new_',
        member: true, // 对单个resource的处理
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
    delete: {
        member: true,
        namePrefix: 'delete_',
        suffix: ':id',
        method: 'DELETE'
    }
};


export default class Router extends KoaRouter {

    constructor(options) {
        super(options);
        this.controllers = options.controllers;
    }

    /**
     * 统一RESTFul路由配置
     * @param name
     * @param prefix
     * @param middleware
     */
    resources(name, prefix, middleware) {

        const route = this;

        // 根据参数个数重新赋值
        if (arguments.length >= 3) {
            middleware = slice.call(arguments, 2);
        } else {
            middleware = slice.call(arguments, 1);
            prefix = name;
            name = null;
        }

        const controller = middleware.pop();

        for(let key of REST_MAP) {
            let action = '';

            if (me.isString(controller)) {
                action = `${controller}.${key}`;
            } else {
                action = controller[key];
            }

            const options = REST_MAP[key];

            // 处理Route name单复数，以及前缀
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


    }

    /**
     * 注册路由
     * @param path
     * @param methods
     * @param middleware
     * @param options
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

        // 解析字符串controller
        middleware.forEach(action => {
            const _action = action;

            if (typeof action === 'string') {
                const actions = action.split('.');
                const func = actions.pop();
                action = this._getController(this.controllers, actions, func);
            }

            if (!me.isFunction(action)) {
                let error = new Error(`${_action}不是一个有效的controller，请检查后重新尝试。`);
                error.name = 'RouterLoadError';
                throw error;
            }

            middlewares.push(action);
        });

        if (!middlewares.length) {
            return null;
        }

        return super.register.call(this, path, methods, middlewares, options);
    }

    /**
     * 生成url
     * @param name
     * @param params
     */
    url(name, params) {
        const route = this.route(name);

        if (!route) {
            return;
        }

        let url = route.path;
        const querys = [];

        if (me.isObject(params) && !me.isNull(params)) {
            const replacedParams = [];

            url = url.replace(/:([a-zA-Z_]\w*)/g, function ($0, key) {
                if (utility.has(params, key)) {
                    const values = params[key];
                    replacedParams.push(key);
                    return utility.encodeURIComponent(me.isArray(values) ? values[0] : values);
                }
                return $0;
            });

            for (let key of params) {

                if (replacedParams.indexOf(params[key]) !== -1) {
                    continue;
                }

                const values = [].concat(params[key]);
                const encodedKey = utility.encodeURIComponent(key);

                for (let val of values) {
                    querys.push(`${encodedKey}=${utility.encodeURIComponent(val)}`);
                }
            }
        }

        if (querys.length > 0) {
            const queryStr = querys.join('&');
            url = url.indexOf('?') > -1 ? `${url}&${queryStr}` : `${url}?${queryStr}`;
        }

        return url;
    }


    /**
     * 获取controller
     * @param controllers
     * @param actions
     * @param func
     * @returns {*}
     * @private
     */
    _getController(controllers, actions, func) {
        let result = null;

        if (actions.length === 0) {
            if (func in controllers) {
                return controllers[func];
            }
        } else {
            const _index = actions[0];

            if (_index in controllers) {
                const controllers_next = controllers[_index];
                const actions_next = actions.slice(1, actions.length);
                result = this._getController(controllers_next, actions_next, func);
            } else {
                if (actions.length > 1) {
                    const controllers_next = controllers;
                    const actions_next = actions.slice(1, actions.length);
                    actions_next[0] = _index + '.' + actions.next[0];
                    result = this._getController(controllers_next, actions_next, func);
                }
            }
        }

        return result;
    }
}

