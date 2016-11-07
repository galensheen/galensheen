/**
 * 文件加载
 * Created by galen on 16/11/7.
 */
'use strict';

const debug = require('debug')('shuyar:loading');
const is = require('is-type-of');
const globby = require('globby');
const extend = require('extend');
const path = require('path');
const fs = require('fs');

const inject = require('../inject');

/**
 * 文件加载
 * @param files
 * @param options
 * @returns {Array}
 */
module.exports = function loading(files, options) {

    if (!options.dirs) {
        throw new Error('options.dirs is required');
    }

    // 补全options
    options = Object.assign({
        call: true,
        ignore: function (exports, file, dir) {
            return false;
        },
        resultHandler: function (result, file, dir, exports) {
            return result;
        },
        propertyHandler: function (properties, name, file) {
            return properties;
        }
    }, options);

    files = [].concat(files);

    const into = is.object(options.into) && options.into;
    const flatten = !!options.flatten;

    let results = [];
    let dirs = [].concat(options.dirs);

    dirs.forEach((dir) => {
        let fileResults = globby.sync(files, {cwd: dir});
        debug(`fileResults => [${fileResults}] checked`);

        fileResults.forEach((name) => {
            const file = path.join(dir, name);

            debug(`LoadFiles => [${file}]: will load`);
            let exports = require(file);

            // 如果符合忽略规则跳过
            if (options.ignore(exports, file, dir)) {
                return;
            }

            let result = exports;
            if (options.call && is.function(exports) && !is.class(exports)) {
                result = exports.apply(null, [].concat(options.inject));
            }
            result = options.resultHandler(result, file, dir, exports);
            results.push(result);

            if (into) {
                const reg = /^[a-z][\.a-z0-9_-]*$/i;
                let properties = name.replace(/\.js$/, '')
                    .split('/')
                    .map(property => {
                        if (!reg.test(property)) {
                            throw new Error(`${property} does not match ${reg} in ${name}`);
                        }
                        return property.replace(/[_-][a-z]/ig, function (s) {
                            return s.substring(1).toUpperCase();
                        });
                    });

                properties = options.propertyHandler(properties, name, file);

                if (properties && properties.length) {
                    if (flatten) {
                        into[properties.join('.')] = result;
                    } else {
                        inject(into, properties, result);
                    }
                }
            }

            debug(`LoadFiles => [${file}]: load success`);
            if (options.target) {
                extend(true, options.target, result);
            }
        });
    });

    return results;
};
