/**
 * Created by galen on 16/11/14.
 */


export default function (router, app) {

    router.prefix('/rest');
    // 主播信息
    router.get( '/check', 'restful.checkController.check');
};

