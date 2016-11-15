/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';

import path from 'path';

/**
 *
 * @param {Object} appInfo - app基本信息
 */
export default function prod(appInfo) {

    return {

        env: 'prod',

        // 日志配置
        logger: {
            name: appInfo.name,
            streams: [{
                level: 'error',
                type: 'rotating-file',
                period: '1d',
                count: 10,
                path: appInfo.appDir + '/logs/error.log',
            }]
        },

        redis: {
            db: 1
        },

        mysql: {
            username: 'prod',
            password: 'prod-password'
        },


        // views中间件
        views: {
            root: path.join(appInfo.appDir, 'server/views'),
            options: {
                map: {
                    'server.html': 'dot'
                },
                extension: 'server.html',
                cache: true
            }
        }
    }
};
