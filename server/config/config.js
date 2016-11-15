/**
 * 默认配置
 * Created by galen on 16/11/7.
 */

import path from 'path';

/**
 * @param {Object} appInfo - app基本信息
 */
export default function init(appInfo) {

    return {

        // app基本信息
        app: {
            name: appInfo.name,
            description: appInfo.description,
            version: appInfo.version,
            keywords: appInfo.keywords
        },

        // 启动端口
        port: process.env.PORT || 3000,

        // app logo
        logo: 'public/img/logo.png',

        // 浏览器tab图标
        favicon: 'public/img/favicon.ico',

        // 启用的中间件
        middlewares: [
            'logger',
            'bodyparser',
            'json',
            'static',
            'views',
            'context'
        ],

        // ============= 中间件的配置 ============
        // logger中间件配置
        logger: {
            name: appInfo.name
        },
        // bodyparser中间件配置
        bodyparser: {
            formLimit: '200kb',
            jsonLimit: '2mb',
            textLimit: '2mb',
            strict: false
        },
        // json中间件配置
        json: {
            pretty: false,
            param: 'pretty'
        },
        // static中间件，同一个中间件使用多次，使用数组配置
        static: [
            {route: 'public', path: path.join(appInfo.appDir, 'public')}
        ],
        // views中间件
        views: {
            root: path.join(appInfo.appDir, 'server/views'),
            options: {
                map: {
                    'server.html': 'handlebars'
                },
                extension: 'server.html'
            }
        }
    }
};
