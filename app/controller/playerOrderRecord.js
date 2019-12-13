/*
 * @Author: spar
 * @Date: 2019-11-25 10:01:20
 * @LastEditTime: 2019-12-02 16:44:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\playerOrderRecord.js
 */
const moment = require('moment');
const uuid = require('uuid');
const co = require('co')
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
// 玩家领取
/**
 * 出金业务 ===> 生成奖金池出金记录待确认 ==> 更新奖金池
 * @param orderId
 * 
 */
exports.createOrder = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const { id } = this.request.body
  if (this._.isEmpty(id)) {
    response.message = "请输入订单id"
    return  this.returnJson(response)
  }
  const user = yield this.getContextUser(response)
  if (!user) {
    response.message = "获取用户信息失败";
    this.logger.info('获取用户信息失败===================>', 'token:  ' +  token +'time:'+ moment().unix()  );
    return  this.returnJson(response)
  }
  
  return yield lock.acquire('createPlayerOrderRecord',  async () => {
        const res_1 = await co(this.app.mysql.query(
          `
            SELECT b.*  FROM player_order_record as a
            LEFT JOIN award_pool as b ON a.banker_disc_id = b.banker_disc_id
            LEFT JOIN award_pool_record as c ON c.award_pool_id = b.id
            WHERE b.status = 0 AND c.player_order_record_id = ${id}
        `
        )) 
        
        if (!res_1[0] || !res_1[0].id) {
          response.message = "该奖金池不存在！"
          this.logger.info('=================>该奖金池不存在！player_order_record_id:' + id + `time: ${moment().unix()}`)
          return this.returnJson(response)
        }
        const res_2 = await co(this.app.mysql.get('player_order_record', {
          id,
          is_win: 1,
          status: 0,
          is_receive: 0,
          collect_time: 0,
          created_by: user.uId
        })) 
        if (!res_2) {
          response.message = "该订单不存在或者已被领取！"
          this.logger.info('=================>该订单不存在！player_order_record_id:' + id + `time: ${moment().unix()}`)
          return this.returnJson(response)
        }
        /**
         * 获取赛点
         */
        const res_3 = await co(this.app.mysql.get('games_point', {
          id: res_2.games_point_id,
        })) 
        if (!res_3) {
          response.message = "该赛事不存在！"
          this.logger.info('=================>games_point_id:' + games_point_id + `time: ${moment().unix()}`)
          return this.returnJson(response)
        }
        
        const { consult, amount } = res_2
        const bonus_pool_amount = res_1[0].amount // 奖金池金额
        const commission = this.accDiv(res_3.commission, 100);
        // 扣除手续费率
        // const enableGetAmount = consult * amount - (consult * amount * commission)// 用户允许获得的金额
        const fee = this.accMul(this.accMul(consult, amount), commission)
        const enableGetAmount = parseFloat(this.Subtr(this.accMul(consult,amount), fee) )  
        const new_amount = this.Subtr(bonus_pool_amount, enableGetAmount)  // 奖金池即将更新的金额
        if (new_amount < 0) {
          // 不可领取
          response.message = "庄盘余额不足，请联系管理员！"
          this.logger.info('=================>庄盘余额不足，请联系管理员！:' + bonus_pool_amount + ':'+ enableGetAmount + `time: ${moment().unix()}`)
          return this.returnJson(response)
        }
        this.request.body.new_amount = parseFloat(new_amount) 
        this.request.body.res_1 = res_1[0]
        this.request.body.variance = parseFloat(- enableGetAmount)
        this.request.body.fee = parseFloat(fee)
        
        const conn = await co(this.app.mysql.beginTransaction()) 
        const result = await co(this.service.playerOrderRecord.createDiffOrder(this.request.body, response, conn)) ;
        if (result.code && result.code !== 0) {
          await co(conn.rollback()) 
          return  this.returnJson(result)
        }
        await co(conn.commit()) ; // 提交事务
        return  this.returnJson({ data: result})
  })
};
// 1 获取内容列表，分页，每页几个
exports.index = function*() {
  let { page, pageSize, status, is_win } = this.request.body
  const response = { success: false, message: "操作失败", code: 1 };
  if (this._.isEmpty(page)) {
    page = 1
  }
  if (this._.isEmpty(pageSize)) {
    pageSize = 10
  }
  const user = yield this.getContextUser(response)
  const con = {
    'a.created_by': user.uId,
  }
  if (user.code && user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  
  if (is_win && this._.isNumber(parseInt(is_win))) {
    con.is_win = is_win
  }
  const result = yield this.service.playerOrderRecord.index({ page, pageSize, status, is_win }, con);
  return  this.returnJson({ data: result})
};


