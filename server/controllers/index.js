/**
 * Created by galen on 16/11/9.
 */

export async function index(ctx, next) {
    //ctx.body = {index: 'controller index'};
    await ctx.render('index', {test: '这是一个测试！！！'});
}

