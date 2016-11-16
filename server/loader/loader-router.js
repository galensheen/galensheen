/**
 * Created by galen on 16/11/14.
 */

import path from 'path';
import assert from 'assert';
import globby from 'globby';
import Debug from 'debug';
import Router from '../lib/Router';

const debug = new Debug('memo:lib:memo-router');

/**
 *
 * @param config
 * @param controllers
 * @returns {Array}
 */
export default function (config, controllers) {
    assert(!!config.appDir, '加载 routers 失败，appDir不能为空');
    debug('================= loading routers: start =================');

    let routesDir = path.resolve(config.appDir, 'server/routes');

    let routers = [];

    let files = globby.sync('**/*.js', {cwd: routesDir});

    files.forEach(file => {
        file = path.resolve(routesDir, file);
        const router = new Router({controllers: controllers});
        require(file)(router);
        routers.push(router);
    });

    debug('================= loading routers: end ===================');
    return routers;
}
