"use strict";
//用户登录
let { MD5 } = require("../utils/libs");
exports.index = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const res = this.params.res;
  let { page, pageSize } = this.query
  if (this._.isEmpty(page)) {
    page = 1
  }
  if (this._.isEmpty(pageSize)) {
    pageSize = 10
  }
  const result = yield this.service.users.index(res, {page, pageSize});
  if (result) {
    response.message = "操作成功";
    response.success = true;
    response.data = result;
  }
  this.body = response;
  this.status = 200;
};
// 2 根据ID获取内容信息
exports.show = function*() {
  const response = { success: false, message: "操作失败" };
  const res = this.params.res;
  delete this.params.res;
  const result = yield this.service.banner.show(res, this.params);
  const preOne = yield this.service.banner.preOne(res, this.params);
  const nextOne = yield this.service.banner.nextOne(res, this.params);
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
  const response = { success: false, message: "操作失败", code: 1 };
  var res = this.params.res;
  const user = yield this.getContextUser(response, true)
  if (user.code && user.code === 1) {
    return  this.returnJson(user)
  }
  let {name, pass, level} = this.request.body
  if (this._.isEmpty(name)) {
    response.message = '请输入账号'
    return  this.returnJson(response)
  }
  if (this._.isEmpty(pass)) {
    response.message = '请输入密码'
    return  this.returnJson(response)
  }
  const admin = yield this.app.mysql.get(res,{name} );
  if (admin) {
    response.message = '用户已存在!'
    return  this.returnJson(response)
  }
  pass = MD5(pass)
  if (res) {
    const result = yield this.service.users.create(res, {name, pass, level});
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
  const response = { success: false, message: "操作失败", code: 1 };
      var res = this.params.res;
      const user = yield this.getContextUser(response)
      if (user.code && user.code === 1) {
        response.message = '获取授权用户失败'
        return  this.returnJson(user)
      }
      let {pass} = this.request.body
      if (this._.isEmpty(pass)) {
        response.message = '请输入密码'
        return  this.returnJson(response)
      }
      pass = MD5(pass)
      const result = yield this.service.users.update(
        res,
        this.params.id,
        {pass}
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
  const response = { success: false, message: "操作失败", code: 1 };
      var res = this.params.res;
      const tableList = yield this.service.tableinfo.index();
      if (this.params.id && this.params.id.indexOf('1') > -1) {
        response.message = '超级管理员不能被删除！'
        return this.returnJson(response)
      }
      if (res && this.helper.inarray(tableList, res)) {
        const result = yield this.service.restql.users(res, this.params);
        if (result.affectedRows) {
          response.message = "操作成功";
          response.success = true;
          response.data = result.affectedRows; //删除的条数
        }
      }
      this.body = response;
      this.status = 200;
};
