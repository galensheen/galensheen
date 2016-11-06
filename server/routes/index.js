/**
 * Created by galen on 16/11/6.
 */

const router = require('koa-router')();

router.get('/', async function (ctx, next) {
    "use strict";
    ctx.state = {
        title: 'koa2 title'
    };

    await ctx.render('index', {});
});

export default router;
