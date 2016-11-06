/**
 * Created by galen on 16/11/6.
 */

var router = require('koa-router')();

router.get('/', function (ctx, next) {
    "use strict";

    ctx.body = 'this a users response!';
});

export default router;
