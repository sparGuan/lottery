"use strict";
//用户登录
let { MD5 } = require("../utils/libs");
const moment = require('moment')
module.exports = app => {
  class UserController extends app.Controller {
    *index() {
      this.ctx.body = "index";
    }
    *authenticate() {
      // 初始化用户调用
      console.log("UserController authorize");
      console.log('登录中')
      const name = this.ctx.request.body.username;
      const pass = this.ctx.request.body.password;
      const result = yield this.service.users.login({ name });
      // this.ctx.headers["Access-Control-Allow-Origin"] = "*";
      // this.ctx.headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      // this.ctx.headers["Access-Control-Allow-Credentials"] = false;
      // this.ctx.headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      // this.ctx.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      const response = { success: false, message: "" };
      if (result) {
        if (result.pass == MD5(pass)) {
          response.message = "登录成功";
          yield this.service.users.update(
            "web_admin",
            result.uid,
            {
              update_time: moment().unix()
            }
          )
          response.success = true;
          response.user = result;
        } else {
          response.message = "密码不正确";
        }
      } else {
        response.message = "用户不存在";
      }
      this.ctx.body = response;
      this.ctx.status = 200;
    }
    /**
     * 验签动作
     */
    *checkReal() {
      const text = this.ctx.request.body.text;
      let response = {}
      response.code = 1;
      response.message = "验签不成功！";
      const checkVal = yield this.service.users.checkReal(text)
      response.data = { checkReal:  checkVal };
      if (Boolean(checkVal)) {
        const {uId, uN, ts} = text
        const Basic = 'Basic ' + new Buffer("appClient: "+ JSON.stringify({uId, uN, ts})).toString('base64');
        response.code = 0;
        response.message = "验签成功！";
        response.data = { checkReal:  checkVal, Basic };
      }
      this.ctx.body = response
    }
    /**
     * 通过user
     * 获取授权码
     */
    // *getPrivateKey() {
    //   const result = yield this.service.users.getPrivateKey();
    //   return result
    // }
  }
  return UserController;
};
