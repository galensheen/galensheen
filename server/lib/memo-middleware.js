/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
import assert from 'assert';
import livereload from 'koa-livereload';
import Debug from 'debug';
import * as me from '../utils';

const debug = new Debug('memo:lib:memo-middleware');

/**
 * 加载中间件
 * @param config
 * @returns {Array}
 */
export default function (config = {}) {
    debug(`=============== loading middleware: start ===============`);

    const mdwPath = path.resolve(__dirname, '../middlewares');

    let mdws = config.middlewares || [];
    let middlewares = [];

    for (let mdw of mdws) {
        debug(`loading middleware ${mdw}`);
        let derive = require(`${mdwPath}/memo-${mdw}`);
        assert(me.isFunction(derive), `failed to load middleware ${mdw}, which must be a function`);

        if (me.isArray(config[mdw])) {
            config[mdw].forEach(foo => {
                let action = derive(foo);
                assert(me.isFunction(action), `failed to load middleware ${mdw}, which should return a function`);
                middlewares.push(action);
            })
        } else {
            let action = derive(config[mdw] || {});
            assert(me.isFunction(action), `failed to load middleware ${mdw}, which should return a function`);
            middlewares.push(action);
        }
    }

    // dev环境需要单独配置的中间件
    // console.log('------------------------: ', config.env);
    // if (config.env === 'dev') {
    //     middlewares.unshift(livereload());
    // }


    debug(`=============== loading middleware: end ===============`);
    return middlewares;
};