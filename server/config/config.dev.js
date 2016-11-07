/**
 * 开发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';


module.exports = function dev() {

    return {

        env: 'dev',

        livereload: true,

        // 日志配置
        log: {
            level: 'debug'
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
