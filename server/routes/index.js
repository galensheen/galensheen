/**
 * Created by galen on 16/11/9.
 */


export default function (router, app) {

    //router.prefix('/rest/anchorman');
    // 主播信息
    router.get( '/', 'index.index');
};
