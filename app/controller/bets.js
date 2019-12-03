/*
 * @Author: spar
 * @Date: 2019-11-22 14:47:25
 * @LastEditTime: 2019-12-03 09:31:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\bets.js
 */
const moment = require('moment');
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
const co = require('co')
// 用户下注业务
/**
 * 
 * @param Number rule 规则 0=胜平负
 * @param Number bet_to 下注方  0=主 1=客 2=平
 * @param Number amount 下注金额
 * @param String games_point_id 赛点id
 * @param String banker_disc_id 庄盘id
 * 先去查找对应的庄盘
 * 计算赔率 * 用户下注金额
 * 然后获取庄盘可用奖金
 * 庄盘可用奖金 - 用户下注金额
 * 更新庄盘剩余金额
 * 更新用户订单表
 */
exports.createBetsOrder = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const user = yield this.getContextUser(response)
  if (user.code && user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  let { banker_disc_id, bet_to,  amount, rule  } = this.request.body
  if (!this._.isNumber(parseInt(rule))) {
    response.message = '缺少参数rule或者输入数字不合法'
    return  this.returnJson(response)
  }
  if (!this._.isNumber(parseInt(bet_to))) {
    response.message = '缺少参数bet_to或者输入数字不合法'
    return  this.returnJson(response)
  }
  if (!banker_disc_id) {
    response.message = '缺少参数id'
    return  this.returnJson(response)
  }
  if (!this._.isNumber(parseFloat(amount))) {
    response.message = '缺少参数amount或者输入数字不合法'
    return  this.returnJson(response)
  }
  
  // 查看该用户下该玩法是否已经存在
  const res_1 = yield this.app.mysql.get('banker_disc', {
    id: banker_disc_id,
    status: 0
  })
  if (!res_1) {
    response.message = "该庄家不存在！"
    return this.returnJson(response)
  }

  this.request.body.games_point_id = res_1.games_point_id
  this.request.body.amount = parseFloat(amount) 
  console.log(bet_to)
  const conn = yield this.app.mysql.beginTransaction()
  const _this = this
  const result = yield lock.acquire('doBetsOrder',() => {
    return co(
            _this.service.bets.doBetsOrder(this.request.body, user, response, conn)
        );
  })
  // const result = yield this.service.bets.doBetsOrder(this.request.body, user, response, conn);
  if (result.code && result.code !== 0) {
    yield conn.rollback()
    return  this.returnJson(result)
  }
  yield conn.commit(); // 提交事务
  return  this.returnJson({ data: result})
};

/**
 * 加入庄盘
 * 需要更新
 * 回调接口接入
 * @param id 玩家订单id
 * award_pool_record => status=已完成
 * player_order_record => status=0 待开奖
 */
exports.create = function* () {
  const response = { success: false, message: "操作失败", code: 1 };
  const { id, tx } = this.request.body
  if (this._.isEmpty(id)) {
    response.message = '缺少参数id'
    return  this.returnJson(response)
  }
  if (this._.isEmpty(tx)) {
    response.message = '缺少参数tx'
    return  this.returnJson(response)
  }
  const conn = yield this.app.mysql.beginTransaction()
  const _this = this
  const result = yield lock.acquire('joinBankerGames',  function (){
      return co(
         _this.service.bets.joinBankerGames(_this.request.body, response, conn)
      ).then(data => data
      );
    });
  // const result = yield this.service.bets.joinBankerGames(this.request.body, response, conn);
  if (result.code && result.code !== 0) {
    yield conn.rollback()
    return  this.returnJson(result)
  }
  yield conn.commit(); // 提交事务
  return  this.returnJson({ data: result})
};

exports.index = function*() {
  const response = { success: false, message: "操作失败" };
  let {page, pageSize, id, created_by, games_point_id, } = this.query
  console.log(page, pageSize, id, created_by, games_point_id)
  if (!page) {
    this.query.page = 1
  }
  if (!pageSize) {
    this.query.pageSize = 10
  }
  const condition = {
    created_by,
    games_point_id,
    id
  }
  
  const result = yield this.service.bets.index(this.query, response, condition);
    if (result) {
      response.message = "操作成功";
      response.success = true;
      response.data = result;
    }
    this.body = response;
    this.status = 200;
};


