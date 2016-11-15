/**
 * 开发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';

/**
 *
 * @param {Object} appInfo - app基本信息
 */
export default function dev(appInfo) {

    return {

        env: 'dev',

        // 日志配置
        logger: {
            name: appInfo.name
        },

        redis: {
            db: 1
        },

        mysql: {
            username: 'dev',
            password: 'dev-password'
        }

    }
};
