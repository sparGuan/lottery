/*
 * @Author: your name
 * @Date: 2019-11-21 11:13:29
 * @LastEditTime: 2019-11-28 20:28:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\bankerDisc.js
 */
const moment = require('moment');

// 庄盘业务
exports.index = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const res = this.params.res;
  const { games_room_id } = this.request.body
  if (this._.isEmpty(games_room_id)) {
    this.response.message = '缺少房间ID'
    this.returnJson(response)
  }
  const result = yield this.service.bankerDisc.index({games_room_id}, response);
  if (!result || result.code !== 0) {
    this.returnJson(response)
  }
  this.returnJson({ data: result})
};


