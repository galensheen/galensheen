/**
 * Created by galen on 16/11/9.
 */

import Memo from './lib/Memo';

const app = new Memo();

// app.use(async (ctx, next) => {
//     console.log('----------------------');
//     ctx.logger.error('test it!!');
//     ctx.body = {test: 'Just a test!'};
// });

app.listen(3000, function () {
    console.log('listen on port: 3000');
});
