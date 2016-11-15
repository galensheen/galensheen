/**
 * Created by galen on 16/11/13.
 */

export async function check(ctx, next) {
    // ctx.body = {restful: 'restful.checkController.check'};
    ctx.success({restful: 'restful.checkController.check'});
}
