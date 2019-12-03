/*
 * @Author: your name
 * @Date: 2019-11-28 11:03:05
 * @LastEditTime: 2019-11-28 19:59:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\senceType.js
 */

module.exports = app => {
  class RestqlService extends app.Service {
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
      const totalsql = "select count(id) as total from " + modal + conditionstr;
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
    *show(modal, params) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      let condition = {};
      condition[modalId] = params.id;
      let record = yield this.app.mysql.get(modal, condition);
      return record;
    }
    *update(modal, id, request) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      let upstr = `update ${modal} set `;
      let upEscape = [];
      request = this.service.tableinfo.toUpdateTimestamp(request);
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
      request = this.service.tableinfo.toTimestamp(request);
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
    *preOne(modal, params) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      let queryStr = `select * from ${modal} where ${modalId} < ?  order by ${modalId} desc limit 1 `;
      let sqlEscape = [params.id];
      let result = yield app.mysql.query(queryStr, sqlEscape);
      return result;
    }
    *nextOne(modal, params) {
      const modalId = yield this.service.tableinfo.primaryKey(modal);
      let queryStr = `select * from ${modal} where ${modalId} > ?  order by ${modalId} asc limit 1 `;
      let sqlEscape = [params.id];
      let result = yield app.mysql.query(queryStr, sqlEscape);
      return result;
    }
  }
  return RestqlService;
};
