/**
 * Created by galen on 16/11/15.
 */

import assert from 'assert';
import views from 'koa-views';

/**
 * 封装koa-views中间件
 * @param config
 */
export default function memo_views(config = {}) {
    assert(!!config.root, 'views中间参数path不能为空！');
    return views(config.root, config.options);
}
