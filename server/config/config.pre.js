/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';


/**
 * pre环境配置
 */
export default function pre(appDir) {

    return {

        env: 'pre',

        // 启动端口
        port: process.env.PORT || 3000,

        redis: {
            db: 1
        },

        mysql: {
            username: 'pre',
            password: 'pre-password'
        }
    }
};
