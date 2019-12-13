/*
 * @Author: spar
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-02 17:43:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\gamesPoint.js
 */
const _ = require('lodash')
module.exports = app => {
  class RestqlService extends app.Service {
    *index(modal, query, condition = {}) {
      let skip = parseInt((query.page) - 1); // 2-1
      const pageSize = parseInt(query.pageSize); // 10
      skip *= pageSize
      const record = yield this.app.mysql.query(`
          SELECT a.*,b.name as games_name, case when a.status = 2 then 0 when a.status = 0 then 1 when a.status = 1 then 4 else '3' end as ord  FROM games_point as a
          LEFT JOIN games as b ON b.id = a.games_id
          ORDER BY ord, a.${query.sortField || 'id'} ${query.sortOrder || 'DESC'} LIMIT ${skip}, ${pageSize};
      `)
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
    /**
     * 实现所有比赛在两小时前提醒用户
     */
    *updateComingIntoGame() {
      // 找到所有的快到时的比赛, 修改状态为2
      // 显示通知
      const find_all_sql = 'select id from games_point where ( ( unix_timestamp(CURRENT_TIMESTAMP()) + 7200) - unix_timestamp(master_start_time) ) > 0 and status = 0'
      const find_all_data = yield this.app.mysql.query(find_all_sql)
      const ids = _.map(find_all_data, 'id')
      if (ids.length > 1) {
        yield this.app.mysql.query(' UPDATE games_point as a SET a.`status` = 2, a.remarks = "待开奖，不可终止" ' +
                  'WHERE a.id IN ( '+
                  ' '+ids.join(',')+' '+
                  ')')
      } else if (ids.length == 1) {
        yield this.app.mysql.query(' UPDATE games_point as a SET a.`status` = 2, a.remarks = "待开奖，不可终止" ' +
                  'WHERE a.id IN ( '+
                  ' '+ids.join(',')+' '+
                  ')')
      }
      
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
    /**
     * 查出所有赢家并更新状态
     * @param {*} modal 
     * @param {*} params 
     * @param {*} response 
     */
    *findWinerAndUpdate(params, response, conn) {
      const { result, id } = params
      // 这些人是赢球了的 ==> 胜平负
      try {
        const findsql = 'SELECT '+
          ' a.id'+
        ' FROM '+
          ' player_order_record AS a '+
        ' LEFT JOIN games_point AS b ON a.games_point_id = b.id '+
        ' WHERE '+
          ' a.`status` = '+result+' AND a.bet_to = 0 and rule = 0 and b.id = ' + id;
          let ret = yield this.app.mysql.query(
          findsql
          );
          if (!ret) {
            response.message = '查找赢球玩家失败'
            this.logger.info('查找赢球玩家失败=============>' + findsql)
            return response
          }
          const retArr = _.map(ret, "id")
          const toWinIds = retArr.join(',')
          if (toWinIds !== '') {
            const toWinSql = 
            ' UPDATE player_order_record '+
              ' SET is_win = 1 '+
            ' WHERE id IN ('+toWinIds+')';
            const ret1 = yield conn.query(toWinSql)
            return  ret1
          } else {
            response.message = '没有获胜玩家'
            this.logger.info('没有获胜玩家=============>')
            return response
          }
          
         
      } catch (error) {
        // yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw error
      }
    }
  }
  return RestqlService;
};
