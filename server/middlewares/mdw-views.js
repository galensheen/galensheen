/**
 * Created by galen on 16/11/15.
 */

import assert from 'assert';
import views from 'koa-views';

/**
 * 封装koa-views中间件
 * @param options
 */
export default function mdw_views(options = {}) {
    assert(!!options.root, 'views中间参数path不能为空！');
    return views(options.root, options.options);
}
