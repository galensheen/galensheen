/**
 * Created by galen on 16/11/16.
 */

import path from 'path';

export default function (config) {

    return {

        // 启用的中间件
        middleware: [
            {name: 'info', env: 'all'},
            {name: 'logger', env: 'all'},
            {name: 'bodyparser', env: 'all'},
            {name: 'json', env: 'all'},
            {name: 'static', env: 'all'},
            {name: 'views', env: 'all'},
            {name: 'context', env: 'all'},
            //{name: 'livereload', env: 'dev'}
        ],

        // ============= 中间件的配置(如果中间件需要配置) ============
        // info中间件
        info: {
            all: {
                config: config
            }
        },
        // logger中间件配置
        logger: {
            dev: {
                name: config.app.name
            },
            pre: {
                name: config.app.name,
                streams: [{
                    level: 'warn',
                    type: 'rotating-file',
                    period: '1d',
                    count: 10,
                    path: config.appDir + '/logs/warn.log',
                }]
            },
            prod: {
                name: config.app.name,
                streams: [{
                    level: 'error',
                    type: 'rotating-file',
                    period: '1d',
                    count: 10,
                    path: config.appDir + '/logs/error.log',
                }]
            }
        },

        // bodyparser中间件配置
        bodyparser: {
            all: {
                formLimit: '200kb',
                jsonLimit: '2mb',
                textLimit: '2mb',
                strict: false
            }
        },

        // json中间件配置
        json: {
            all: {
                pretty: false,
                param: 'pretty'
            }
        },

        // static中间件，同一个中间件使用多次，使用数组配置
        static: {
            all: [{
                route: 'public',
                path: path.resolve(config.appDir, 'public')
            }]
        },

        // views中间件
        views: {
            all: {
                root: path.join(config.appDir, 'server/views'),
                options: {
                    map: {
                        'server.html': 'handlebars'
                    },
                    extension: 'server.html'
                }
            }
        },

        // context中间件
        context: {
            // 默认不需要配置
        },

        // livereload
        livereload: {
            // 默认不需要配置
        }

    };
}
