/*
 * @Author: your name
 * @Date: 2019-11-24 21:20:27
 * @LastEditTime: 2019-12-02 17:37:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\playerOrderRecord.js
 */
const moment = require('moment')
module.exports = app => {
  class RestqlService extends app.Service {
    // 获取我的装
    // 出金业务 ===> 先创建出金订单 ==> 生成奖金池出金记录待确认 ==> 更新奖金池
    *createDiffOrder(query, response, conn) {
      query = this.service.tableinfo.toTimestamp(query);
      const { id, tx, update_time, res_1, new_amount, variance, fee } =  query
      const { amount , banker_disc_id} = res_1
      const totalsql = "select count(id) as total from player_order_record where id="+id+" AND is_win = 1 AND `status` = 0 AND is_receive = 0 AND collect_time = 0";
      const totalRecord = yield this.app.mysql.query(totalsql);
      if (totalRecord[0].total <= 0) {
        response.message = '该订单没有获胜或者该订单不可领取！'
        this.logger.info('该订单没有获胜或者该订单不可领取！==============> id:' + id)
        return response
      }
      // 获取奖金池信息
      // 减掉库存
      // 先去判断库存是否充足
      // 查看该用户下该玩法是否已经存在
      
      // res_1.amount
      // update订单
      const ret1 = yield conn.update(
        "player_order_record",
        {
          is_receive: 1,
          collect_time: update_time,
          update_time
        },
        {
          where: {
            id
          }
        }
      )
      if (!ret1 || ret1.changedRows !== 1) {
        response.message = '领取获胜订单失败'
        this.logger.info('=================>领取获胜订单失败id:' + id + `time: ${moment().unix()}`)
        return response
      }
      // 生成出入金记录确认
      const ret2 = yield conn.insert(
        "award_pool_record",
        {
          after_balance: new_amount,
          before_balance: amount,
          variance,
          award_pool_id: res_1.id,
          player_order_record_id: id,
          status: 0,
          fee,
          tx
        },
      )
      if (!ret2 || !ret2.insertId) {
        response.message = '创建领奖记录失败'
        this.logger.info('=================>创建领奖记录失败' + JSON.stringify({
          after_balance: new_amount,
          before_balance: amount,
          variance,
          award_pool_id: res_1.id,
          player_order_record_id: id,
          tx
        },) + `time: ${moment().unix()}`)
        return response
      }
      
      const ret3 = yield conn.update(
        "award_pool",
        {
          update_time, 
          banker_disc_id,
          amount: new_amount,
        },
        {
          where: {
            id: res_1.id,
          }
        }
      )
      if (!ret3 || ret3.changedRows !== 1) {
        response.message = '更新奖金池失败'
        this.logger.info('=================>更新奖金池失败' + JSON.stringify({
          update_time, 
          banker_disc_id,
          amount: new_amount,
        },) + `time: ${moment().unix()}`)
        return response
      }
      return ret1
    }
    /**
     * 获取订单记录
     * @param {*} query 
     * @param {*} condition 
     */
    *index( query, condition) {
      // const offset = (parseInt(query.page) - 1) * parseInt(query.pageSize);
      let skip = parseInt((query.page) - 1); // 2-1
      const pageSize = parseInt(query.pageSize); // 10
      skip *= pageSize
      const status = query.status
      let conditionstr = ''
      if (JSON.stringify(condition) != "{}") {
        conditionstr = "  ";
        for (const key in condition) {
          conditionstr = conditionstr + key + " = " + condition[key] + " and ";
        }
        conditionstr = conditionstr.substring(
          0,
          conditionstr.lastIndexOf(" and ")
        );
      }
      let kj_sql = ''
      
      if (status == '' && query.is_win == '') {
        
        kj_sql += ' and a.status != 2 ' // 未开奖
      } else {
        if (status == 0) {
          kj_sql += 'and b.result is  null and a.status = 0' // 未开奖
        } 
        else if (status == 1){
          kj_sql += 'and b.result is not null and a.status = 0' // 开奖了
        } else if (status == 2) {
          kj_sql += 'and a.`status` = 1 '
        }
      }

      const sql =  
      'SELECT '+
      'a.id, '+
      'b.id AS games_point_id, ' +
	    'd.games_room_id AS games_room_id, ' +
      'a.amount, '+
      'a.`status`, '+
      'a.create_time, '+
      'b.commission, '+
      'a.is_win, '+
      'a.is_receive, '+
      'a.collect_time, '+
      'a.consult, '+
      'a.rule, '+
      'a.bet_to, '+
      'b.master_img_url, '+
      'b.master_count, '+
      'b.slave_count, '+
      'b.slave_img_url, '+
      'b.result, '+
      'b.score '+
    'FROM '+
      'player_order_record AS a '+
    'left join banker_disc as d on d.id = a.banker_disc_id LEFT JOIN games_point AS b ON a.games_point_id = b.id WHERE '+conditionstr+' '+kj_sql+' order by a.id DESC ' 
      const limit_sql = sql + ' LIMIT '+skip+', '+ pageSize
      const record = yield this.app.mysql.query(limit_sql)
      const totalsql = "select count(a.id) as total FROM "+
      'player_order_record AS a '+
      'LEFT JOIN games_point AS b ON a.games_point_id = b.id WHERE  '+conditionstr+' '+kj_sql+' order by a.id DESC'
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
  }
  return RestqlService;
};
