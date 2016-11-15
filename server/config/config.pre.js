/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';


/**
 * @param {Object} appInfo - app基本信息
 */
export default function pre(appInfo) {

    return {

        env: 'pre',

        // 日志配置
        logger: {
            name: appInfo.name,
            streams: [{
                level: 'warn',
                type: 'rotating-file',
                period: '1d',
                count: 10,
                path: appInfo.appDir + '/logs/warn.log',
            }]
        },

        redis: {
            db: 1
        },

        mysql: {
            username: 'pre',
            password: 'pre-password'
        }
    }
};
