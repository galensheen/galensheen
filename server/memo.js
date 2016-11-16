/**
 * Created by galen on 16/11/16.
 */

import path from 'path';
import Koa from 'koa';
import http from 'http';

// 导入loader
import loaderConfig from './loader/loader-config';
import loaderMiddleware from './loader/loader-middleware';
import loaderController from './loader/loader-controller';
import loaderRouter from './loader/loader-router';

const app = new Koa();

const appDir = path.resolve(__dirname, '..');

const config = loaderConfig(appDir);
const middlewares = loaderMiddleware(config);
const controllers = loaderController(config);
const routers = loaderRouter(config, controllers);

// 应用中间件
middlewares.forEach(middleware => {
    app.use(middleware);
});

routers.forEach(router => {
    app.use(router.routes());
});

// 启动应用
listen();

/**
 * 应用启动
 */
function listen() {
    const server = http.createServer(app.callback());

    server.listen(config.port);

    server.on('error', (error) => {
        console.log(error);
    });

    server.on('listening', () => {
        console.log(`server listening on port: ${config.port}`);
    });
}

