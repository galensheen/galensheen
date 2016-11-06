/**
 * Created by galen on 16/11/6.
 */

const path = require('path');

const Koa = require('koa');
const router = require('koa-router');
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const serve = require('koa-static2');

const app = new Koa();

onerror(app);

app.use(bodyparser({
    onerror: (err,ctx) => {
        ctx.throw('body parse error', 422)
    }
}));

app.use(convert(json({pretty: false, param: 'pretty'})));
app.use(logger());

app.use(serve('public', path.resolve(__dirname, '../public')));
app.use(serve('docs', path.resolve(__dirname, '../docs')));
app.use(serve('frontend', path.resolve(__dirname, '../client')));

app.use(views(path.resolve(__dirname, '/views'), {
    map: {html: 'dot'},
    extension: 'html'
}));

app.use(async (ctx, next) => {ctx.body = {test: 'test111'}});

app.listen(3000, () => {
    "use strict";
    console.log('listen on port: 3000');
});
