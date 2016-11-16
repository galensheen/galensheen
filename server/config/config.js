/**
 * 默认配置
 * Created by galen on 16/11/7.
 */

import * as pkg from '../../package.json';

/**
 * 默认配置
 */
export default function init(appDir) {

    return {

        app: {
            name: pkg.name,
            version: pkg.version,
            keywords: pkg.keywords,
            description: pkg.description,
            logo: 'public/img/logo.png',
            favicon: '/public/img/favicon.ico'
        },

        appDir: appDir

    }
};
