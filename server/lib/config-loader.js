/**
 * Created by galen on 16/11/7.
 */
'use strict';

const path = require('path');

const globby = require('globby');
const extend = require('extend');

/**
 * 加载配置
 */
module.exports = function configLoader() {

    let configs = [];

    let configFiles = getConfigFiles();

    for (let file of configFiles) {
        let config = require(path.resolve('../config', file))();
        configs.push(config);
    }

    return extend(true, ...configs);
};


/**
 * 获取配置文件list
 * @returns {string[]|Array.<string>}
 */
function getConfigFiles() {

    var env = process.env.NODE_ENV || 'dev';
    var envFile = globby.sync(`config.${env}.js`, {cwd: '../config'});

    if (!envFile.length) {
        throw new Error(`Not found config file: config.${env}.js`);
    }

    return ['config.js', ...envFile]
        .map(file => path.resolve('../config', file));
}
