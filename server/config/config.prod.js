/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';


module.exports = function prod() {

    return {

        env: 'prod',

        livereload: false,

        // 日志配置
        log: {
            level: 'error'
        },

        redis: {
            db: 1
        },

        mysql: {
            username: 'prod',
            password: 'prod-password'
        }
    }
};
