/**
 * Created by galen on 16/11/5.
 */

'use strict';

import Koa from 'koa';

import logger from './middlewares/logger';

const app = new Koa();

app.use(logger());

// response
app.use(async (ctx, next) => {
    ctx.body = 'async middleware'
});

app.listen(3000, function () {
    console.log('listen on port: 3000');
});
