/**
 * Created by galen on 16/11/13.
 */

import path from 'path';

import Debug from 'debug';
import bunyan from 'bunyan';
import uuid from 'uuid';
import mkdirp from 'mkdirp';
import onFinished from 'on-finished';

const debug = new Debug('memo:lib:loader-logger');

/**
 * 封装koa-bunyan-logger
 * @param {Object} logConfig - 日志配置
 * @returns {Function}
 * @desc 可以参考koa-bunyan-logger，后面如果需要可以添加request和response的logger信息。
 * TODO: 后面自己实现集群日志形式，worker发送信息到master, master负责写日志到file
 */
export default function memo_logger(logConfig = {}) {
    debug('============= loading logger: start ==============');

    if (logConfig.streams && logConfig.streams[0] && logConfig.streams[0].path) {
        mkdirp(path.dirname(logConfig.streams[0].path));
    }

    let header = 'X-Request_Id';
    let ctxProp = 'reqId';
    let requestProp = 'reqId';

    logConfig.serializers = bunyan.stdSerializers;
    let loggerInstance = bunyan.createLogger(logConfig);

    debug('============= loading logger: end ==============');
    return async function logger(ctx, next) {
        let reqId = ctx.request.get(header) || uuid.v4();

        ctx[ctxProp] = reqId;
        ctx.request[requestProp] = reqId;

        ctx.logger = loggerInstance.child({req_id: reqId});

        await next();

        onFinished(ctx.res, () => {
            ctx.logger = null;
        });
    };
}
