/*
 * @Author: your name
 * @Date: 2019-11-27 14:18:28
 * @LastEditTime: 2019-11-27 14:19:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\gamesType.js
 */
// 1 获取内容列表，分页，每页几个
exports.index = function*() {
  const response = { success: false, message: "操作失败" };
  // const { context } = this;
  const res = this.params.res;
  const result = yield this.service.gamesType.index(res, this.query);
    if (result) {
      this.returnJson({ data: result})
      this.status = 200;
    }
};
// 2 根据ID获取内容信息
exports.show = function*() {
  const response = { success: false, message: "操作失败" };
  const res = this.params.res;
  delete this.params.res;
  const result = yield this.service.gamesType.show(res, this.params);
  const preOne = yield this.service.gamesType.preOne(res, this.params);
  const nextOne = yield this.service.gamesType.nextOne(res, this.params);
  if (result) {
    result.preOne = preOne[0] ? preOne[0] : "没有上一个了";
    result.nextOne = nextOne[0] ? nextOne[0] : "没有下一个了";
    response.message = "操作成功";
    response.success = true;
    response.data = result;
  }
  this.body = response;
  this.status = 200;
};

// 3 创建内容
exports.create = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  if (res) {
    const result = yield this.service.gamesType.create(res, this.request.body);
    if (result.affectedRows) {
      let returnBody = this.request.body;
      returnBody.uid = result.insertId;
      response.message = "操作成功";
      response.success = true;
      response.data = returnBody;
    }
  }
  this.body = response;
  this.status = 200;
};
// 4 更新内容信息
exports.update = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  const result = yield this.service.gamesType.update(
    res,
    this.params.id,
    this.request.body
  );
  if (result.affectedRows) {
    response.message = "操作成功";
    response.success = true;
    response.data = result;
  }
  this.body = response;
  this.status = 200;
};

// 5 删除内容信息
exports.destroy = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  const result = yield this.service.gamesType.destroy(res, this.params);
  if (result.affectedRows) {
    response.message = "操作成功";
    response.success = true;
    response.data = result.affectedRows; //删除的条数
  }
  this.body = response;
  this.status = 200;
};
