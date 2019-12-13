/*
 * @Author: your name
 * @Date: 2019-11-26 09:14:24
 * @LastEditTime: 2019-12-01 14:07:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\schedule\cancel_order.js
 */
module.exports = {
  schedule: {
    interval: '30s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  *task(ctx) {
    // const res = await ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // ctx.app.cache = res.data;
    yield ctx.service.gamesUserOrderRecord.cancelExpiresOrders()
  },
};