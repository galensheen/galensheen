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
module.exports = function config() {

    let configs = [];

    var env = process.env.NODE_ENV || 'dev';
    var envFile = globby.sync(`config.${env}.js`, {cwd: '../config'});

    if (!envFile.length) {
        throw new Error(`Not found config file: config.${env}.js`);
    }

    let configFiles = ['config.js', ...envFile]
        .map(file => path.resolve(__dirname, file));

    for (let file of configFiles) {
        let config = require(file)();
        configs.push(config);
    }

    return extend(true, ...configs);
};
