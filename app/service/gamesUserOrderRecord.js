/*
 * @Author: spar
 * @Date: 2019-11-21 10:38:28
 * @LastEditTime: 2019-12-02 19:34:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\gamesUserOrderRecord.js
 */
const moment = require('moment');
const _ = require('lodash')
const CALA = require('../extend/context')
module.exports = app => {
  class RestqlService extends app.Service {
    *create(modal, request, response, conn) {
      request = this.service.tableinfo.toTimestamp(request);
      const date = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      request.expires = date
      const result = yield conn.insert(modal, request);
      if (!result) {
        response.message = '生成订单失败'
        this.logger.info('生成订单失败=================>' + JSON.stringify(request))
        return response
      }
      return result;
    }
    
    /**
     * 更新订单
     * @param {*} modal 
     * @param {*} request 
     * @param {*} response
     * @returns String award_pool_record_id 
     */
    *update (request, response, conn) {
      request = this.service.tableinfo.toTimestamp(request);
      const { update_time, create_time, banker_disc_id, tx, amount} = request
      // 更新订单
      // 创建奖金池
      // 创建奖金池进出记录
      try {
        const ret = yield conn.update(
          "banker_order_record",
          {
            banker_disc_id,
            status: 0,
            update_time
          },
          {
            where: {
              id: request.id
            }
          }
        )
        if (!ret || ret.changedRows !== 1) {
          response.message = '更新庄订单失败'
          this.logger.info('=================>更新庄订单失败' + JSON.stringify({
            banker_disc_id,
            status: 0,
            tx,
            update_time: request.update_time
          }) + `id: ${request.id} ===========>time: ${moment().unix()}`)
          return response
        }

        // 更新出入金记录
        const ret1 = yield conn.insert(
          "award_pool",
          {
            update_time, 
            create_time, 
            banker_disc_id,
            amount
          },
        )
        if (!ret1 || !ret1.insertId) {
          response.message = '创建奖金池失败'
          this.logger.info('=================>创建奖金池失败' + JSON.stringify({
            update_time, 
            create_time, 
            banker_disc_id,
          }) + `time: ${moment().unix()}`)
          return response
        }
        const ret2 = yield conn.insert(
          "award_pool_record",
          {
            before_balance: 0,
            after_balance: amount,
            variance: amount,
            award_pool_id: ret1.insertId,
            status: 0,
            tx,
            banker_order_record_id: request.id,
          },
        )
        if (!ret2 || !ret2.insertId) {
          response.message = '创建庄盘入金记录失败'
          this.logger.info('=================>创建庄盘入金记录失败' + JSON.stringify({
            before_balance: 0,
            after_balance: amount,
            variance: amount,
            award_pool_id: ret1.insertId,
            status: 0,
            tx,
          }) + `time: ${moment().unix()}`)
          return response
        }
        return ret2
      } catch (error) {
        yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
      }
    }
    
    *destroyGamesPointAndBack (request, response) {
      // 先去查找出所有关于这场比赛所有的订单id
      // 把这些订单状态设置为1
      // 回滚所有的出金记录
      // 奖金池状态删除
      // 比赛删除
      // 庄盘删除
      // try {
      // } catch (error) {
      //   yield conn.rollback(); // 提交事务
      //   return response
      // }
       
      const { id } = request
      const conn = yield this.app.mysql.beginTransaction()
      
      const banker_sql = 'select id, amount from banker_order_record where games_point_id = ' +id
      const player_sql_1 = 'select id, amount from  player_order_record where games_point_id = ' +id
      const banker_orders = yield conn.query(banker_sql)
      const player_orders =  yield conn.query(player_sql_1)
      
      // 把价格跟id发送到java出金
      // 回调成功后
      const banker_orders_ids = _.map(banker_orders, 'id')
      const player_orders_ids = _.map(player_orders, 'id')
      let result = null
      if (player_orders_ids.length > 1) {
        result = yield conn.query(' UPDATE player_order_record as a SET a.`status` = 1, a.remarks = "用户终止比赛"  ' +
        'WHERE a.id IN ( '+
        ' '+player_orders_ids.join(',')+' '+
        ')')
        result =  yield conn.query(' UPDATE award_pool_record as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
        'WHERE a.player_order_record_id IN ( '+
        ' '+player_orders_ids.join(',')+' '+
        ')')
      } 
      else if (player_orders_ids.length == 1) {
        
        result = yield conn.query(' UPDATE player_order_record as a SET a.`status` = 1, a.remarks = "用户终止比赛"  ' +
        'WHERE a.id IN ( '+
        ' '+player_orders_ids[0]+' '+
        ')')
        result =  yield conn.query(' UPDATE award_pool_record as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
        'WHERE a.player_order_record_id IN ( '+
        ' '+player_orders_ids[0]+' '+
        ')')
      }

      if (banker_orders_ids.length > 1) {
        yield conn.query(' UPDATE banker_order_record as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
        'WHERE a.id IN ( '+
        ' '+banker_orders_ids.join(',')+' '+
        ')')

        yield conn.query(' UPDATE award_pool_record as a SET a.`status` = 1 , a.remarks = "用户终止比赛"' +
        'WHERE a.banker_order_record_id IN ( '+
        ' '+banker_orders_ids.join(',')+' '+
        ')')
      } 
      
      else if (banker_orders_ids.length == 1) {
        yield conn.query(' UPDATE banker_order_record as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
        'WHERE a.id IN ( '+
        ' '+banker_orders_ids[0]+' '+
        ')')
        yield conn.query(' UPDATE award_pool_record as a SET a.`status` = 1 , a.remarks = "用户终止比赛"' +
        'WHERE a.banker_order_record_id IN ( '+
        ' '+banker_orders_ids[0]+' '+
        ')')
      }



      let player_sql_1_c = ''
      if (player_orders_ids.length > 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where player_order_record_id in ('+player_orders_ids.join(',')+') '
      } else if (player_orders_ids.length  == 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where player_order_record_id in ('+player_orders_ids[0]+') '
      }
      if (banker_orders_ids.length > 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where banker_order_record_id in ('+banker_orders_ids.join(',')+') ) '
      } else if (banker_orders_ids.length == 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where banker_order_record_id in ('+banker_orders_ids[0]+') ) '
      }
      if (banker_orders_ids.length > 1 && player_orders_ids.length > 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where ( player_order_record_id in ('+player_orders_ids.join(',')+') or banker_order_record_id in ('+banker_orders_ids.join(',')+') ) '
      } else if (banker_orders_ids.length == 1 && player_orders_ids.length == 1) {
        player_sql_1_c = 'select distinct award_pool_id from award_pool_record where ( player_order_record_id in ('+player_orders_ids[0]+') or banker_order_record_id in ('+banker_orders_ids[0]+') ) '
      }
      // 销毁池
      if (player_sql_1_c) {
          const player_sql_1_c_obj = yield conn.query(player_sql_1_c)
          const award_pool_ids = _.map(player_sql_1_c_obj, 'award_pool_id')
          if (award_pool_ids.length > 1) {
            yield conn.query(' UPDATE award_pool as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
              'WHERE a.id IN ( '+
              ' '+award_pool_ids.join(',')+' '+
              ')')
          } else if (award_pool_ids.length  == 1) {
            yield conn.query(' UPDATE award_pool as a SET a.`status` = 1, a.remarks = "用户终止比赛" ' +
              'WHERE a.id IN ( '+
              ' '+award_pool_ids[0]+' '+
              ')')
          }
      }
      // 销毁比赛
      
      const banker_disc_sql = 'select id from banker_disc where games_point_id = ' + id
      const banker_disc = yield conn.query(banker_disc_sql)
      const banker_disc_ids =  _.map(banker_disc, 'id')
      if (banker_disc_ids.length > 1) {
        yield conn.query(' UPDATE banker_disc as a SET a.`status` = 1 ' +
        'WHERE a.id IN ( '+
        ' '+banker_disc_ids.join(',')+' '+
        ')')
      } else if(banker_disc_ids.length  == 1){
        yield conn.query(' UPDATE banker_disc as a SET a.`status` = 1 ' +
        'WHERE a.id IN ( '+
        ' '+banker_disc_ids[0]+' '+
        ')')
      }
      // 比赛删除
      yield conn.update(
        "games_point",
        {
          status: 1,
          remarks: '用户终止比赛'
        },
        {
          where: {
            id
          }
        }
      )
      response.code = 0
      response.message = '操作成功!'
      response.success = true
      this.logger.info('取消比赛成功：比赛id=================>' + id)
      yield conn.commit(); // 提交事务
      return response   
    }

    // 取消超时的庄和玩家订单
    *cancelExpiresOrders() {
      const response = { success: false, message: "操作失败", code: 1 };
      const player_ids_sql = 'select id from player_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires)'
      let player_ids = yield this.app.mysql.query(player_ids_sql)
      player_ids = _.map(player_ids, 'id')
      if (player_ids.length > 0) {
        const player_sql = 'select sum(a.variance) as  out_amount, a.award_pool_id from award_pool_record a left JOIN player_order_record b on a.player_order_record_id = b.id '+
        'where a.`status` = 2 and b.status = 2 and a.variance > 0 and unix_timestamp(current_timestamp()) > unix_timestamp(b.expires)' +
        'group by a.award_pool_id '
        const res_5 = yield this.app.mysql.query(player_sql)
        if (res_5.length >0) {
          const _this = this
          for (let i =0; i<res_5.length; i++) {
            try {
                const conn = yield _this.app.mysql.beginTransaction()
                let record = yield conn.get('award_pool', {
                  id: res_5[i].award_pool_id
                });
                if (!record) {
                  yield conn.rollback()
                  return true
                }
                const amount = parseFloat(record.amount)  
                const blance = CALA.Subtr(amount, parseFloat(res_5[i].out_amount) )
                record = yield conn.update("award_pool",
                {
                  amount: blance
                },
                {
                  where: {
                    id: res_5[i].award_pool_id
                  }
                });
                if (!record) {
                  yield conn.rollback()
                }
                yield conn.commit();
            } catch (error) {
              throw error
            }
          }
          // 更新完金额去更新状态
            const select_Sql = ' UPDATE player_order_record a SET a.`status` = 1 ' +
            'WHERE a.id IN ( '+
            ' '+player_ids.join(',')+' '+
            ')'
            const res_1 = yield this.app.mysql.query(select_Sql)
            if (!res_1) {
                response.message = '取消玩家超时订单失败'
                this.logger.info('=================>获取玩家超时订单失败select id from player_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires)' +  ` ===========>time: ${moment().unix()}`) 
                return response
            }
            if (player_ids.length > 0) {
              const select_Sql_1 = ' UPDATE award_pool_record a SET a.`status` = 1 ' +
              'WHERE a.player_order_record_id IN ( '+
              ' '+player_ids.join(',')+' '+
              ')'
              const res_2 = yield this.app.mysql.query(select_Sql_1)
              if (!res_2) {
                  response.message = '取消玩家超时订单失败'
                  this.logger.info('=================>获取玩家超时订单失败select id from player_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires)' +  ` ===========>time: ${moment().unix()}`) 
                  return response
              }
            }
            
        }
      }
      
      const select_Sql_1 = ' UPDATE banker_order_record a SET a.`status` = 1 ' +
      'WHERE a.id IN ( '+
      ' select id from banker_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires) '+
      ')'
      // const award_pool_record = ' UPDATE player_order_record a SET a.`status` = 1 ' +
      // 'WHERE a.id IN ( '+
      // ' '+player_ids.join(',')+' '+
      // ')'
      // 查询出所有状态为2的入金记录然后取消掉，并且相应去除对应奖金池入金额度
      // const select_Sql_2 = ' UPDATE award_pool_record a SET a.`status` = 1 ' +
      // 'WHERE a.id IN ( '+
      // ' select id from award_pool_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires) '+
      // ')'
      // 查询所有该奖池里面失效订单总额 然后减回去
      // const select_Sql_2 = ' UPDATE award_pool_record a SET a.`status` = 3 ' +
      // 'WHERE a.id IN ( '+
      // ' select id from player_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires) '+
      // ')'
      // const select_Sql_1_3 = ' UPDATE banker_order_record a SET a.`status` = 3 ' +
      // 'WHERE a.id IN ( '+
      // ' select id from banker_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires) '+
      // ')'
      const res_2 = yield this.app.mysql.query(select_Sql_1)
      if (!res_2) {
        response.message = '取消玩家超时订单失败'
        this.logger.info('=================>获取玩家超时订单失败select id from banker_order_record WHERE `status` = 2 and unix_timestamp(current_timestamp()) > unix_timestamp(expires)' +  ` ===========>time: ${moment().unix()}`) 
        return response
      }
      return { success: true, message: "操作成功", code: 0 };
    }
  }
  return RestqlService;
};
