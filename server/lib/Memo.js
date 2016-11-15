/**
 * Created by galen on 16/11/9.
 */

import Koa from 'koa';
import Debug from 'debug';
import extend from 'extend';

import Loader from './Loader';

const debug = new Debug('memo:lib:memo');

/**
 * 扩展Koa对象，可以在此处添加订制化的功能
 */
export default class Memo extends Koa {

    /**
     * @constructor
     * @param {Object} options - 创建app的配置
     */
    constructor(options = {}) {

        super();

        this.loader = new Loader(this);

        this.context.appInfo = {
            name: this.loader.appInfo.name,
            description: this.loader.appInfo.description,
            version: this.loader.appInfo.version,
            keywords: this.loader.appInfo.keywords
        };
        // 初始化中间件和路由
        this.init();

        // // 将loader的方法代理到app上
        // delegate(this.context, 'loader')
        //     .method('getConfig')
        //     .getter('config')
        //     .getter('appInfo');
    }

    // 调用loader的init初始化middleware和router
    init() {
        this.loader.init();
    }
}
