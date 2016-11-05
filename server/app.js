/**
 * Created by galen on 16/11/5.
 */

'use strict';

import Koa from 'koa';

import koaBunyanLogger from 'koa-bunyan-logger';

const app = new Koa();

app.use(koaBunyanLogger());
app.use(async (ctx, next) => {
    ctx.log.info(`Got a request form ${ctx.request.ip} for ${ctx.path}`);
    await next();
});

// response
app.use(async (ctx, next) => {
    ctx.body = 'async middleware'
});

app.listen(3000, function () {
    console.log('listen on port: 3000');
});
