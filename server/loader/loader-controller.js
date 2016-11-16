/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
import Debug from 'debug';
import assert from 'assert';
import * as fs from 'fs';

import globby from 'globby';
import * as inflection from 'inflection';

import * as me from '../utils';

const debug = new Debug('memo:lib:memo-controller');


/**
 * 加载controllers保存对象中，供路由中使用
 * @param {Object} config
 * @returns {Object}
 */
export default function (config = {}) {
    assert(!!config.appDir, '加载controllers失败，appDir不能为空');
    debug('========== loading controller: start ===========');

    // 解析controllers的绝对路径
    const controllerDir = path.resolve(config.appDir, 'server/controllers');
    assert(fs.existsSync(controllerDir), '加载controllers失败，server/controllers不存在');

    let controllers = {};

    let files = globby.sync('**/*.js', {cwd: controllerDir});

    const reg = /^[a-z][\.a-z0-9_-]*$/i;

    files.forEach(name => {
        const file = path.resolve(controllerDir, name);

        debug(`controller => [${name}]: will load`);
        let result = require(file);

        // 将路径以小驼峰的形式，解析为数组
      let properties = name.replace(/\.js$/, '')
            .split('/')
            .map(property => {
                if (!reg.test(property)) {
                    throw new Error(`${property} does not match ${reg} in ${name}`);
                }

                return inflection.camelize(property.replace('-', '_'), true);
            });

        if (properties && properties.length) {
            me.inject(controllers, properties, result);
        }
        debug(`controller => [${name}]: load success`);
    });


    debug('========== loading controller: end ===========');
    return controllers;
}
