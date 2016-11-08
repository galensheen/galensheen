/**
 * Created by galen on 16/11/8.
 */
'use strict';

const path = require('path');
const loading = require('../utils/loading');

/**
 * controller加载
 * @returns {{}}
 */
module.exports = function controllerLoader() {

    const controllersBase = path.resolve(__dirname, '../controllers');
    let controllers = {};

    loading('**/*.js', {
        call: false,
        into: controllers,
        dirs: controllersBase
    });

    return controllers;
};
