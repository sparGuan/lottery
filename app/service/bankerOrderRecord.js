/*
 * @Author: your name
 * @Date: 2019-11-24 21:20:27
 * @LastEditTime: 2019-12-03 09:21:05
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
      const { id, tx, update_time, enable_current_pool_amount, current_pool_amount, after_pool_amount, award_pool_id, banker_disc_id, fee } =  query
      
      // 获取奖金池信息
      // 减掉库存
      // 先去判断库存是否充足
      // 查看该用户下该玩法是否已经存在
      
      // res_1.amount
      // update订单
      const ret1 = yield conn.update(
        "banker_order_record",
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
          after_balance: after_pool_amount,
          before_balance: current_pool_amount,
          variance: - enable_current_pool_amount,
          award_pool_id,
          status: 0,
          banker_order_record_id: id,
          fee,
          tx
        },
      )
      if (!ret2 || !ret2.insertId) {
        response.message = '创建领奖记录失败'
        this.logger.info('=================>创建领奖记录失败' + JSON.stringify({
          after_balance: after_pool_amount,
          before_balance: current_pool_amount,
          variance: - enable_current_pool_amount,
          award_pool_id,
          status: 0,
          banker_order_record_id: id,
          fee,
          tx
        }) + `time: ${moment().unix()}`)
        return response
      }
      
      const ret3 = yield conn.update(
        "award_pool",
        {
          update_time, 
          banker_disc_id,
          amount: after_pool_amount,
        },
        {
          where: {
            id: award_pool_id,
          }
        }
      )
      if (!ret3 || ret3.changedRows !== 1) {
        response.message = '更新奖金池失败'
        this.logger.info('=================>更新奖金池失败' + JSON.stringify({
          update_time, 
          banker_disc_id,
          amount: after_pool_amount,
        }) + `time: ${moment().unix()}`)
        return response
      }
      
      return ret1
    }

    /**
     * 获取订单记录
     * @param {*} query 
     * @param {*} condition 
     */
    *index( query) {
      // const offset = (parseInt(query.page) - 1) * parseInt(query.pageSize);
      const skip = parseInt((query.page) - 1);
      const pageSize = parseInt(query.pageSize);
      const { status , uId} = query
     let sqlstr = ''
     if (status == 1) {
      sqlstr = 'and e.result is  NULL  AND a.`status` = 0'
     } else if(status == 2){
      sqlstr = 'and e.result is not  NULL AND  a.`status` = 0'
     } else if (status == 3) {
      sqlstr = 'and a.`status` = 1'
     }
      // const sql = 
      // 'SELECT '+
      //   'a.created_by, '+
      //   'a.status, '+
      //   'd.pool_amount, '+
      //   'b.games_point_id as games_point_id, '+
      //   'h.id as games_room_id, '+
      //   'e.slave_count, '+
      //   'e.master_count, '+
      //   'e.master_img_url, '+
      //   'e.slave_img_url, '+
      //   'f.`name`, '+
      //   'a.rule, '+
      //   'a.is_receive, '+
      //   'a.collect_time, '+
      //   'e.result, '+
      //   'b.master_consult, '+
      //   'b.slave_consult, '+
      //   'b.flat_consult, '+
      //   'a.amount, '+
      //   'a.create_time, '+
      //   'a.id, '+
      //   'e.score, '+
      //   'e.commission, '+
      //   'IFNULL(g.bet_to_master_amount, 0) AS bet_to_master_amount, '+
      //   'IFNULL(h.bet_to_slave_amount, 0) AS bet_to_slave_amount, '+
      //   'IFNULL(i.bet_to_flag_amount, 0) AS bet_to_flag_amount '+
      // 'FROM '+
      //   'banker_order_record a '+
      //   'LEFT JOIN banker_disc b ON a.banker_disc_id = b.id '+

      //   'LEFT JOIN games_room h ON a.games_point_id = h.games_point_id '+
        
      //   'LEFT JOIN award_pool AS c ON c.banker_disc_id = a.banker_disc_id '+
      //   'LEFT JOIN (select sum(CONVERT(variance,DECIMAL)) as  pool_amount, award_pool_id from award_pool_record  where variance > 0 and status = 0 group by award_pool_id) AS d ON d.award_pool_id = c.id '+
      //   'LEFT JOIN games_point AS e ON e.id = a.games_point_id '+
      // 'LEFT JOIN games AS f ON f.id = e.games_id '+
      // 'LEFT JOIN ( '+
      //   'SELECT '+
      //     'sum(CONVERT(amount,DECIMAL)) AS bet_to_master_amount, '+
      //     'banker_disc_id '+
      //   'FROM '+
      //     'player_order_record '+
      //   'WHERE '+
      //     'bet_to = 0 '+
      //   'AND `status` = 0 '+
      //   ' GROUP BY banker_disc_id ' +
      // ') AS g ON g.banker_disc_id = b.id '+
      // 'LEFT JOIN ( '+
      //   'SELECT '+
      //     'sum(CONVERT(amount,DECIMAL)) AS bet_to_slave_amount, '+
      //     'banker_disc_id '+
      //   'FROM '+
      //     'player_order_record '+
      //   'WHERE '+
      //     'bet_to = 1 '+
      //   'AND `status` = 0 '+
      //   ' GROUP BY banker_disc_id ' +
      // ') AS h ON g.banker_disc_id = b.id '+
      // 'LEFT JOIN ( '+
      //   'SELECT '+
      //     'sum(CONVERT(amount,DECIMAL)) AS bet_to_flag_amount, '+
      //     'banker_disc_id '+
      //   'FROM '+
      //     'player_order_record '+
      //   'WHERE '+
      //     'bet_to = 2 '+
      //   'AND `status` = 0 '+
      //   ' GROUP BY banker_disc_id ' +
      // ') AS i ON g.banker_disc_id = b.id '+
      // 'WHERE '+
      // '  a.created_by = '+uId+' '
      // + sqlstr + ' '
      
      const sql =  
      'SELECT '+
          'a.created_by, '+
          'a. STATUS, '+
          'd.pool_amount, '+
          'b.games_point_id AS games_point_id, '+
          'h.id as games_room_id, '+
          'e.slave_count, '+
          ' e.master_count, '+
          'e.master_img_url, '+
          'e.slave_img_url, '+
          'f.`name`, '+
          'a.rule, '+
          'a.is_receive, '+
          'a.collect_time, '+
          ' e.result, '+
          'b.master_consult, '+
          'b.slave_consult, '+
          'b.flat_consult, '+
          'a.amount, '+
          'a.create_time, '+
          'a.id, '+
          'e.score, '+
          'e.commission, '+
          'IFNULL(g.bet_to_master_amount, 0) AS bet_to_master_amount, '+
          'IFNULL(h.bet_to_slave_amount, 0) AS bet_to_slave_amount, '+
          'IFNULL(i.bet_to_flag_amount, 0) AS bet_to_flag_amount '+
        'FROM '+
          'banker_order_record a '+
        
        'LEFT JOIN banker_disc b ON a.banker_disc_id = b.id '+
        
        'LEFT JOIN games_point AS e ON e.id = a.games_point_id '+
        
        'LEFT JOIN games_room h ON h.id = b.games_room_id '+
        
        
        'LEFT JOIN award_pool AS c ON c.banker_disc_id = a.banker_disc_id '+
        
        
        'LEFT JOIN ( '+
          'SELECT '+
            'sum(CONVERT(variance, DECIMAL)) AS pool_amount, '+
            'award_pool_id '+
          'FROM '+
            'award_pool_record '+
          'WHERE '+
            'variance > 0 '+
          'AND STATUS = 0 '+
          'GROUP BY '+
            'award_pool_id '+
        ') AS d ON d.award_pool_id = c.id '+
        
        
        'LEFT JOIN games AS f ON f.id = e.games_id '+
        'LEFT JOIN ( '+
          'SELECT '+
            'sum(CONVERT(amount, DECIMAL)) AS bet_to_master_amount, '+
            'banker_disc_id '+
          'FROM '+
            'player_order_record '+
          'WHERE '+
            'bet_to = 0 '+
          'AND `status` = 0 '+
          'GROUP BY '+
            'banker_disc_id '+
        ') AS g ON g.banker_disc_id = b.id '+
        
        'LEFT JOIN ( '+
          'SELECT '+
            'sum(CONVERT(amount, DECIMAL)) AS bet_to_slave_amount, '+
            'banker_disc_id '+
          'FROM '+
            'player_order_record '+
          'WHERE '+
            'bet_to = 1 '+
          'AND `status` = 0 '+
          'GROUP BY '+
            'banker_disc_id '+
        ') AS h ON h.banker_disc_id = b.id '+
        
        'LEFT JOIN ( '+
          'SELECT '+
            'sum(CONVERT(amount, DECIMAL)) AS bet_to_flag_amount, '+
            'banker_disc_id '+
          'FROM '+
            'player_order_record '+
          'WHERE '+
            'bet_to = 2 '+
          'AND `status` = 0 '+
          'GROUP BY '+
            'banker_disc_id '+
        ') AS i ON i.banker_disc_id = b.id '+
        'WHERE '+
          'a.created_by = '+uId+' '+
          ' '+ sqlstr 
      const limit_sql = sql + ' LIMIT '+skip+', '+ pageSize
      
      const record = yield this.app.mysql.query(limit_sql)
      const totalsql = "select count(a.id) as total FROM "+
      'banker_order_record AS a LEFT JOIN games_point AS e on a.games_point_id = e.id WHERE  a.created_by=' +uId + ' '+sqlstr +
      ' order by a.id DESC'
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
  }
  return RestqlService;
};
