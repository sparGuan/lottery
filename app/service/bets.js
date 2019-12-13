/*
 * @Author: spar
 * @Date: 2019-11-22 14:47:51
 * @LastEditTime: 2019-12-03 09:57:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\bets.js
 */
const moment = require('moment')
const CALC = require('../extend/context')
module.exports = app => {
  class RestqlService extends app.Service {
    /**
     * 获取我的庄
     * @param {*} query 
     * @param {*} user 
     * @param {*} response 
     */
    *doBetsOrder(query, user, response, conn) {
      query = this.service.tableinfo.toTimestamp(query);
      let { banker_disc_id, amount, games_point_id, update_time, bet_to, rule } =  query
      const award_pool = yield this.app.mysql.get('award_pool',{banker_disc_id} );
      const banker_disc = yield this.app.mysql.get('banker_disc',{id: banker_disc_id} );
      if (!award_pool) {
        response.message = '奖金池不存在'
        this.logger.info(`奖金池不存在===================>id:${banker_disc_id} time:'+ ${moment().unix()}`  );
        return response
      }
      if (!banker_disc) {
        response.message = '该庄盘不存在'
        this.logger.info(`该庄盘不存在===================>id:${banker_disc_id} time:'+ ${moment().unix()}`  );
        return response
      }
      amount = parseFloat(amount)
      const award_pool_id = award_pool.id
      const banker_amount = banker_disc.amount // 预备金最高金额
      const disc_amount = award_pool.amount // 当前奖金池金额 5000
      let consult = null
      if (bet_to == 0) {
        // 主赢
        consult = banker_disc.master_consult
      } else if (bet_to == 1) {
        consult = banker_disc.slave_consult
      } else {
        consult = banker_disc.flat_consult
      }
      const player_bet_amount = parseFloat(CALC.accMul(amount, consult))  // 计算用户下注金额 * 赔率
      // const balance = parseFloat(CALC.accAdd(CALC.Subtr(disc_amount, banker_amount), player_bet_amount))  // 可用库存
      // 算法是查询出该bet_to的总金额数是否大于庄家下单的总金额数，如果大于则不能入金
      // select sum(amount * consult) as bet_amount from player_order_record where bet_to = 0 and banker_disc_id = 100
      const rest1 = yield this.app.mysql.query(`select sum(amount * consult) as bet_amount from player_order_record where bet_to = ${bet_to} and status = 0 and banker_disc_id = ${banker_disc_id}`)
      if (!rest1) {
        response.message = '查询可投注总额失败!'
        return response
      }
      
      if (rest1[0] && ( CALC.accAdd(rest1[0].bet_amount, amount) > banker_amount )) {
        response.message = '庄盘预备金不足!'
        return response
      } else if (rest1.length === 0 && ( CALC.accMul(amount, consult)   > banker_amount )) {
        response.message = '庄盘预备金不足!'
        return response
      }
      // 先扣除库存， 如果该订单长时间未响应，再把库存加回去，取消订单
      // 建立出入金记录，更新奖金池库存
      
      const ret1 = yield conn.update(
        "award_pool",
        {
          update_time, 
          amount: disc_amount + amount
        },
        {
          where: {
            banker_disc_id
          }
        }
      )
      if (!ret1 || ret1.changedRows !== 1) {
        response.message = '更新奖金池金额失败'
        this.logger.info('=================>更新奖金池金额失败' + JSON.stringify({
          update_time, 
          amount: disc_amount + amount
        }) + `time: ${moment().unix()}`)
        return response
      }
      // 下单
      // 创建订单
      const order = yield this.service.gamesUserOrderRecord.create('player_order_record', {
        amount,
        created_by: user.uId,
        games_point_id,
        consult,
        banker_disc_id,
        rule,
        bet_to
      }, response, conn);

      if (order.code && order.code !== 0) {
        response.message = '生成订单失败!'
        this.logger.info(`create order fail===================>${JSON.stringify({
          amount,
          created_by: user.uId,
          games_point_id,
          banker_disc_id,
          consult,
        })} time:'+ ${moment().unix()}`  );
        return response
      }
      // 生成出入金记录
      const ret2 = yield conn.insert(
        "award_pool_record",
        {
          before_balance: disc_amount, // 变动前的库存
          after_balance: disc_amount + amount, // 变动后的库存
          award_pool_id, // 奖金池id
          variance: amount, // 变动值
          player_order_record_id: order.insertId,
        }
      )
      if (!ret2 || !ret2.insertId) {
        response.message = '创建出玩家入金记录失败'
        this.logger.info('=================>创建玩家出入金记录失败' + JSON.stringify({
          before_balance: disc_amount, // 变动前的库存
          after_balance: disc_amount + amount, // 变动后的库存
          award_pool_id, // 奖金池id
          variance: amount // 变动值
        }) + `time: ${moment().unix()}`)
        return response
      }
      return order
    }
    /**
     * * award_pool_record => status=已完成
     * player_order_record => status=0 待开奖
     */
    *joinBankerGames (query, response, conn) {
      query = this.service.tableinfo.toTimestamp(query);
      const { id, tx, update_time } =  query
      
      const ret = yield this.app.mysql.query(
        `
          SELECT c.award_pool_id, c.id as award_pool_record_id  FROM player_order_record as a
          LEFT JOIN award_pool as b ON a.banker_disc_id = b.banker_disc_id
          LEFT JOIN award_pool_record as c ON c.award_pool_id = b.id
          WHERE a.status = 2 AND c.player_order_record_id = ${id}
      `
      )
      if (!ret[0] || !ret[0].award_pool_record_id) {
        response.message = '查询玩家入金记录失败！'
        this.logger.info('=================>查询玩家入金记录失败！订单id:' + id + `time: ${moment().unix()}`);
        return response
      }
      const ret2 = yield conn.update(
        "award_pool_record",
        {
          status: 0,
          tx
        },
        {
          where: {
            id: ret[0].award_pool_record_id
          }
        }
      )
      if (!ret2 || ret2.changedRows !== 1) {
        response.message = '更新玩家入金失败'
        this.logger.info('=================>更新玩家入金失败:出入金记录id' + ret[0].award_pool_id + `time: ${moment().unix()}`);
        return response
      }
      // 更新订单
      const ret1 = yield conn.update(
        "player_order_record",
        {
          update_time, 
          status: 0,
        },
        {
          where: {
            id
          }
        }
      )
      if (!ret1 || ret1.changedRows !== 1) {
        response.message = '回调玩家加入庄盘失败'
        this.logger.info('=================>回调玩家加入庄盘失败id:' + id + `time: ${moment().unix()}`);
        return response
      }
      return ret1
    }

     /**
     * 投注管理
     */
    *index (query, response, condition) {
      let skip = parseInt((query.page) - 1); // 2-1
      const pageSize = parseInt(query.pageSize); // 10
      skip *= pageSize
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
      const record = yield this.app.mysql.query(`SELECT
        a.*, b.id as  games_room_id, c.master_count, CONCAT(c.master_count,'vs', c.slave_count)as againster 
        FROM
          player_order_record AS a
          LEFT JOIN banker_disc AS b ON b.id = a.banker_disc_id
          Left JOIN games_point  as c on  c.id = c.id
        ${conditionstr}
        ORDER BY  a.${query.sortField || 'a.id'} ${query.sortOrder || 'DESC'} LIMIT ${skip}, ${pageSize};
      `)

      const totalsql = "select count(id) as total from " + ' player_order_record ' + conditionstr;
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
  }

  return RestqlService;
};
