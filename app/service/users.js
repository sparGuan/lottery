/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-11-30 13:29:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\users.js
 */
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const NodeRSA = require('node-rsa');
const crypto = require("crypto");
const key = new NodeRSA({ b: 1024 }); //生成2048位的密钥
key.setOptions({encryptionScheme: 'pkcs1'});
function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort();
　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}
module.exports = app => {
  class UsersService extends app.Service {
    *login(request) {
      let condition = { name: request.name };
      let record = yield this.app.mysql.get("web_admin", condition);
      return record;
    }
    /**
	 * 获取公钥 & 私钥
   * 验真
	 */
    *checkReal(text) {
      const key_obj = yield this.app.mysql.query("SELECT private_key FROM private_key");
      const private_key = decoder.write(key_obj[0].private_key);
      const { s } = text
      const {uId, uN, ts} = text
      key.importKey(private_key)
      key.setOptions({signingScheme: 'sha1'});
      // 加签并加密
      const sortedObjKeys = JSON.stringify(objKeySort({uId, uN, ts}))
      const obj = crypto.createHash('sha256');
      obj.update(sortedObjKeys);
      const str = obj.digest('hex');//hex是十六进制
      // 解密并验签
      const decrypted = s // "iQqEBhfa7X2hvUsWHTbMy1NXo+ax6laBHnv0VQEFVtLYseZoFGcSjfMxUMckLMINd1zuVPtUjl5UBBszhr1MNaS+rVGXbwKQK2Bx3AiW/2JSoiT21bdEs8xosfIbQdM8pkhyPpnh+9RlSaWo4y6R5rDJZpZwgnfZw6YiyIXe3Z0=";
      const verify = key.verify(str, decrypted, "utf8", "base64");
      return verify
    }
    *index(modal, query, condition = {}) {
      const offset = (parseInt(query.page) - 1) * parseInt(query.pageSize);
      const record = yield this.app.mysql.select(modal, {
        where: condition,
        limit: parseInt(query.pageSize),
        offset: offset
      });
      let conditionstr = "";
      if (JSON.stringify(condition) != "{}") {
        conditionstr = " where ";
        for (const key in condition) {
          conditionstr = conditionstr + key + " = " + condition[key] + " and ";
        }
        conditionstr = conditionstr.substring(
          0,
          conditionstr.lastIndexOf(" and ")
        );
      }
      const totalsql = "select count(*) as total from " + modal + conditionstr;
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
    *update(modal, id, request) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      let upstr = `update ${modal} set `;
      let upEscape = [];
      for (const key in request) {
        if (upEscape.length != 0) {
          upstr += ", ";
        }
        upstr += `${key} = ?`;
        upEscape.push(request[key]);
      }
      upstr += ` where ${modalId} = ?`;
      upEscape.push(id);
      let result = yield app.mysql.query(upstr, upEscape);
      return result;
    }
    *create(modal, request) {
      const result = yield this.app.mysql.insert(modal, request);
      return result;
    }
    *destroy(modal, params) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      const ids = params.id.split(",");
      let condition = {};
      condition[modalId] = ids;
      const result = yield this.app.mysql.delete(modal, condition);
      return result;
    }
  }
  return UsersService;
};
