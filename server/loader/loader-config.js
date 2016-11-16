/**
 * Created by galen on 16/11/9.
 */
'use strict';

import path from 'path';
import assert from 'assert';

import globby from 'globby';
import extend from 'extend';
import Debug from 'debug';

const debug = new Debug('memo:lib:memo-config');

/**
 * 加载配置
 */
export default function config(appDir) {
    debug('======== loading config: start ========');

    let configs = [];

    let env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


    debug(`======== loading config: env => ${env} ========`);

    let envFile = globby.sync(`**/config.${env}.js`, {cwd: path.resolve(appDir, 'server/config')});
    assert(!!envFile.length, `Not found config file: config.${env}.js`);

    let configFiles = ['config.js', ...envFile]
        .map(file => path.resolve(appDir, 'server/config', file));

    for (let file of configFiles) {
        let config = require(file)(appDir);
        configs.push(config);
    }

    debug('======== loading config: end ========');
    return extend(true, ...configs);
};