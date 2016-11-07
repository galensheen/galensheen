/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';


module.exports = function pre() {

    return {

        env: 'pre',

        livereload: false,

        // 日志配置
        log: {
            level: 'info'
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
