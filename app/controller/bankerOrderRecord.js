/*
 * @Author: spar
 * @Date: 2019-11-25 10:01:20
 * @LastEditTime: 2019-12-01 13:54:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\playerOrderRecord.js
 */
const moment = require('moment');
const uuid = require('uuid');
const co = require('co')
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
// 庄家领取
/**
 * 出金业务 ===> 生成奖金池出金记录待确认 ==> 更新奖金池 获得你可领取的奖金
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
  if (user.code && user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  // 上锁 -- 返回request.body
  return yield lock.acquire('createBankerOrderRecord',  async () => {

    const res_1 = await co(
           this.app.mysql.query(
        `
          SELECT b.*  FROM banker_order_record as a
          LEFT JOIN award_pool as b ON a.banker_disc_id = b.banker_disc_id
          LEFT JOIN award_pool_record as c ON c.award_pool_id = b.id
          WHERE b.status = 0 AND c.banker_order_record_id = ${id}
      `
      )
        ).then( data => data);
     if (!res_1[0] && !res_1[0].id) {
      response.message = "该奖金池不存在！"
      this.logger.info('=================>该奖金池不存在！player_order_record_id:' + id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }   
    const res_2 = await co( this.app.mysql.get('banker_order_record', {
      id,
      status: 0,
      is_receive: 0,
      collect_time: 0,
      created_by: user.uId
    })).then(data => data)

    if (!res_2) {
      response.message = "该订单不存在或者已被领取！"
      this.logger.info('=================>banker_order_record_id:' + id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }

    // 算法重新计算
    // 奖金池总金额 - 所有获奖用户的金额 * 手续费
    const res_3 = await co(  this.app.mysql.get('award_pool_record', {
      banker_order_record_id: id,
    })).then(data => data)
    if (!res_3) {
      response.message = "该订单出入金记录不存在！"
      this.logger.info('=================> banker_order_record_id:' + id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }

    // 获取所有入金总额
    const res_4 = await co( this.app.mysql.get('award_pool', {
      id: res_3.award_pool_id,
    })).then(data => data)
    if (!res_4) {
      response.message = "该订单奖金池不存在！"
      this.logger.info('=================> award_pool_id:' + res_3.award_pool_id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }

    // 池里面的钱 -（（总入金 - 赢场） - （（总入金 - 赢场金额） x 手续费率 ） = 庄家应得的 ） = 剩余
    // 池里面的钱 -（（总入金 - 赢场） - （（总入金 - 赢场金额） x 手续费率 ） = 庄家应得的 ） = 剩余
    // 计算总入金
    const res_8 = await co(this.app.mysql.query(
      `
      select sum(CONVERT(variance,DECIMAL)) as award_pool_add from award_pool_record where CONVERT(variance,DECIMAL) > 0 and status =0  and award_pool_id = ${res_3.award_pool_id}
    `
    )).then(data => data)
    if (!res_8) {
      response.message = "该订单奖金池不存在！"
      this.logger.info('=================> award_pool_id:' + res_3.award_pool_id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }
    
    // 计算赢家金额
    const res_5 = await co(this.app.mysql.query(
      `
      SELECT sum(amount * consult) as player_order_amount from player_order_record where is_win = 1 and rule = 0 and status = 0 and banker_disc_id = ${res_2.banker_disc_id}
    `
    )).then(data => data)
    if (!res_5) {
      response.message = "计算失败！"
      this.logger.info('获取获奖玩家总金额失败=================>games_point_id:' + res_2.games_point_id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }

    const res_6 = await co(this.app.mysql.query(`select count(id) as total, commission  from games_point where id=${res_2.games_point_id} and result is not null`)).then(data => data)
    if (!res_6 || res_6[0].total <= 0) {
      response.message = "该赛事不存在或还没开奖！"
      this.logger.info('=================>games_point_id:' + res_2.games_point_id + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }

    const current_pool_amount =  res_8[0].award_pool_add // 当前入金总额
    let player_order_amount = (res_5.length > 0 && res_5[0].player_order_amount) || 0// 获取所有获奖用户的获奖总额
    const commission =  this.accDiv(res_6[0].commission, 100) // 手续费
    player_order_amount = this.Subtr(player_order_amount,this.accMul(player_order_amount, commission))
    // const enable_val =  current_pool_amount - ( player_order_amount - player_order_amount * commission )
    const fee = this.accMul(this.Subtr(current_pool_amount, player_order_amount ), commission) // 待减手续费
    const enable_val =  this.Subtr(this.Subtr(current_pool_amount, player_order_amount ), fee)// 庄家可领取金额 this.Subtr(current_pool_amount, this.Subtr(player_order_amount, this.accMul(player_order_amount,commission) ))
    const relase_val =  this.Subtr(res_4.amount, enable_val)  // 奖金池剩余金额
    
    // 计算奖金池里面的总金额
    if (relase_val <= 0) {
      response.message = "奖金池余额不足！, 请联系管理员。"
      this.logger.info('=================>可领取金额:' + enable_val, '当前奖金池金额：' + current_pool_amount + `time: ${moment().unix()}`)
      return this.returnJson(response)
    }
    this.request.body.enable_current_pool_amount = parseFloat(enable_val) // 可领取的金额
    this.request.body.current_pool_amount = res_4.amount // 当前金额
    this.request.body.after_pool_amount = parseFloat(relase_val) // 池里剩下的金额
    this.request.body.award_pool_id = res_4.id // 奖金池id
    this.request.body.banker_disc_id = res_2.banker_disc_id // 庄盘id
    this.request.body.fee = fee // 庄盘id
    const conn =  await co(this.app.mysql.beginTransaction()).then(data => data)
    // 资金充足的情况下进入领取奖金！
    const result = await co( this.service.bankerOrderRecord.createDiffOrder(this.request.body, response, conn)).then(data => data);
    if (result.code && result.code !== 0) {
      await co(conn.rollback()).then(data => data) 
      return  this.returnJson(result)
    }
    await co(conn.commit()).then(data => data)  // 提交事务
    return  this.returnJson({ data: result})
  })
  
};
// 1 获取内容列表，分页，每页几个
exports.index = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  let { page, pageSize, status } = this.request.body
  if (this._.isEmpty(page)) {
    page = 1
  }
  if (this._.isEmpty(pageSize)) {
    pageSize = 10
  }
  
  const user = yield this.getContextUser(response)
  if (user.code && user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  const result = yield this.service.bankerOrderRecord.index({ page, pageSize, status, uId: user.uId });
  return  this.returnJson({ data: result})
};


