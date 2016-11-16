/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';

import path from 'path';

/**
 * prod环境配置
 */
export default function prod(appDir) {

    return {

        app: {
            logo: '===='
        },

        env: 'prod',

        // 启动端口
        port: process.env.PORT || 80,

        redis: {
            db: 1
        },

        mysql: {
            username: 'prod',
            password: 'prod-password'
        }
    }
};
