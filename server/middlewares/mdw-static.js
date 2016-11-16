/**
 * Created by galen on 16/11/15.
 */

import serve from 'koa-static2';
import * as me from '../utils';

/**
 * 静态文件服务
 * @param options
 */
export default function mdw_static(options = {}) {

    if (!me.isObject(options)) {
        return;
    }

    return serve(options.route, options.path);
}
