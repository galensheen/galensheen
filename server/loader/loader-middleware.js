/**
 * Created by galen on 16/11/9.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

import Debug from 'debug';
import * as me from '../utils';
import mdwsConfig from '../config/middleware';

const debug = new Debug('memo:lib:memo-middleware');

/**
 * 加载中间件
 * @param {object} config
 * @returns {Array}
 */
export default function (config = {}) {
    assert(!!config.appDir, '加载middleware失败，appDir不能为空');
    debug(`=============== loading middleware: start ===============`);

    const mdwDir = path.resolve(config.appDir, 'server/middlewares');
    assert(fs.existsSync(mdwDir), '加载中间件失败，server/middlewares');

    let mdwConfig = mdwsConfig(config);

    let mdws = [].concat(mdwConfig.middleware);

    let middlewares = [];

    for (let mdw of mdws) {

        // 如果中间配置不在该env下运行则跳过
        if (mdw.env !== 'all' && mdw.env !== config.env) {
            continue;
        }

        debug(`loading middleware: ${mdw.name} for env: ${mdw.env}`);
        let derive = require(`${mdwDir}/mdw-${mdw.name}`);
        assert(me.isFunction(derive), `failed to load middleware: ${mdw.name} for env: ${mdw.env}, must be a function`);

        let all = mdwConfig[mdw.name] && mdwConfig[mdw.name]['all'];
        let env = mdwConfig[mdw.name] && mdwConfig[mdw.name][config.env];

        // 确认使用的配置
        let configs = env || all;

        if (me.isArray(configs)) {
            configs.forEach(cfg => {
                let action = derive(cfg || {});
                assert(me.isFunction(action), `failed to load middleware ${mdw.name}, should return a function`);
                middlewares.push(action);
            })
        } else {
            let action = derive(configs || {});
            assert(me.isFunction(action), `failed to load middleware ${mdw.name}, which should return a function`);
            middlewares.push(action);
        }
    }

    debug(`=============== loading middleware: end ===============`);
    return middlewares;
};