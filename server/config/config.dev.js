/**
 * 开发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';

/**
 * dev环境配置
 */
export default function dev(appDir) {

    return {

        env: 'dev',

        // 启动端口
        port: process.env.PORT || 3000,

        redis: {
            db: 1
        },

        mysql: {
            username: 'dev',
            password: 'dev-password'
        }

    }
};
