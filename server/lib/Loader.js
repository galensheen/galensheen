/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
const pkg = require('../../package.json');
import loaderConfig from './memo-config';
import loaderMdw from './memo-middleware';
import loaderCtrl from './memo-controller';
import loaderRoutes from './memo-router';


/**
 * 加载配置、中间件、控制器和路由
 */
export default class Loader {

    /**
     * @constructor
     */
    constructor(app) {
        this.app = app;
        this.appDir = path.resolve(__dirname, '../../');
        this.appInfo = {};
        this.config = {};
        this.middlewares = [];
        this.controllers = {};
        this.routers = [];

        this.loadAppInfo();
        this.loadConfig();
        this.loadMiddlewares();
        this.loadControllers();
        this.loadRoutes();
    }

    /**
     * 载入app信息
     */
    loadAppInfo() {
        this.appInfo = {
            name: pkg.name,
            description: pkg.description,
            appDir: path.resolve(__dirname, '../../'),
            version: pkg.version,
            keywords: pkg.keywords ? pkg.keywords.join(',') : ''
        };
    }

    /**
     * 加载配置文件
     */
    loadConfig() {
        this.config = loaderConfig(this.appInfo);
    }

    /**
     * 加载中间件
     */
    loadMiddlewares() {
        this.middlewares = [].concat(loaderMdw(this.config));
    }

    /**
     * 加载controllers
     */
    loadControllers() {
        this.controllers = loaderCtrl(this.appDir);
    }

    /**
     * 加载路由
     */
    loadRoutes() {
        this.routers = loaderRoutes(this.appDir, this.controllers);
    }

    /**
     * getter config
     * @returns {{}|*}
     */
    getConfig() {
        return this.config;
    }

    /**
     * 初始化中间件和路由到app
     */
    init() {
        this.middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
        this.routers.forEach(router => {
            this.app.use(router.routes());
        });
    }
}
