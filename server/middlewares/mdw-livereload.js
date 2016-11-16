/**
 * Created by galen on 16/11/10.
 */

import livereload from 'koa-livereload';
import convert from 'koa-convert';

/**
 *
 * @param options
 * @returns {*}
 */
export default function (options = {}) {
    return convert(livereload());
}
