/**
 * Created by galen on 16/11/14.
 */

import path from 'path';
import globby from 'globby';
import Debug from 'debug';
import Router from './Router';

const debug = new Debug('memo:lib:memo-router');

/**
 *
 * @param appDir
 * @param controllers
 * @returns {Array}
 */
export default function (appDir, controllers) {
    debug('================= loading routers: start =================');

    let routers = [];

    let files = globby.sync('routes/**/*.js', {cwd: path.resolve(appDir, 'server')});

    files.forEach(file => {
        file = path.resolve(appDir, 'server', file);
        const router = new Router({controllers: controllers});
        require(file)(router);
        routers.push(router);
    });

    debug('================= loading routers: end ===================');
    return routers;
}
