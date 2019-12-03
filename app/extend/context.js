/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-01 12:26:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\extend\context.js
 */
// exports.returnJson = ({ code = 0, message = '操作成功', success = true, data = {} }) => {
//   console.log(this.body)
//   this.body = {
//     code,
//     success, 
//     message,
//     data,
//   };
// }
// const _ = require('lodash');
const _  = require('lodash')
const moment = require('moment')
const MATCH = require('../utils/Match')()
const Match = new MATCH()
module.exports = {
   //加法函数
  accAdd(...list) {
    return Match.add(...list)
  }, 
  //减法函数
  Subtr(...list) {
    return  Match.subtract(...list)
  },
  
  //乘法函数
  accMul(...list) {
    return  Match.multiply(...list)
  }, 
  //除法函数
  accDiv(...list) {
    return  Match.divide(...list)
  }, 
  * getContextUser(response, isAdmin=false) {
    const { authorization } = this.header
    const token = this.Trim(authorization.replace('Bearer', ''))
    let user
    if (!isAdmin) {
      user = yield this.getUserByToken(token)
    } else {
      user = yield this.getAdminByToken(token)
    }
    if (!user) {
      return response
    }
    
    return user
  },
  _: _,
  getAdminByToken(token) {
    const result = this.app.mysql.get("web_admin", {
      accessToken: token
    })
    return result
  },
  getUserByToken(token) {
    const result = this.app.mysql.get("games_user", {
      accessToken: token
    })
    return result
  },
  Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
  },  // 去掉左右空格
	returnJson({ code = 0, message = '操作成功', success = true, data = {} }) {
    this.status = 200;
    return this.body = {
      code,
      success, 
      message,
      data,
    };
  },
  BackJson({ code = 0, message = '操作成功', success = true, data = {} }) {
    return {
      code,
      success, 
      message,
      data,
    };
  }
};

