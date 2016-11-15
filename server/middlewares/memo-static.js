/**
 * Created by galen on 16/11/15.
 */

import serve from 'koa-static2';
import * as me from '../utils';

/**
 * 静态文件服务
 * @param config
 */
export default function memo_static(config = {}) {

    if (!me.isObject(config)) {
        return;
    }

    return serve(config.route, config.path);
}
