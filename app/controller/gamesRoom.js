const moment = require('moment');
const uuid = require('uuid');

// 1 获取内容列表，分页，每页几个
exports.index = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const user = yield this.getContextUser(response)
  if (!user) {
    response.message = '获取用户授权失败'
    return this.returnJson(response)
  }
  const res = this.params.res;
  let { games_point_id, page, pageSize } = this.query 
  if (this._.isEmpty(games_point_id)) {
    response.message = '赛事Id不能为空'
    return this.returnJson(response)
  }
  if (!page) {
    page = 1
  }
  if (!pageSize) {
    pageSize = 10
  }
  this.query.uId = user.uId
  let result = yield this.service.gamesRoom.index(res, this.query);
  
  if (!result) {
    return this.returnJson(response)
}

  // result = result.record.map( item => {
  //   if (item.created_by == user.uId) {
  //     item.isActive = 0
  //   }
  //   return item
  // })
  return this.returnJson({ data: result})
};
/**
 * 获取10条属于自己的房间
 */
exports.search = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const res = this.params.res;
  const user = yield this.getContextUser(response)
  if (user.code || user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  const { games_point_id, games_room_id, page, pageSize} = this.request.body
  if (!page) {
    this.request.body.page = 1
  }
  if (!pageSize) {
    this.request.body.pageSize = 10
  }
  if (this._.isEmpty(games_point_id)) {
    response.message = '赛事Id不能为空'
    return this.returnJson(response)
  }
  const condition = {}
  if (games_room_id) {
    condition['a.id'] = games_room_id
  } else {
    condition['a.created_by'] = user.uId
  }
  const result = yield this.service.gamesRoom.index(res, this.request.body, condition, true);
  if (!result) {
    return this.returnJson(response)
  }

  result.record.forEach ( item =>{
    if (user.uId == item.created_by) {
      item.isActive = 0
    }
  })
  return this.returnJson({ data: result})
};


// 2 根据ID获取内容信息
exports.show = function*() {
  const response = { success: false, message: "操作失败" };
  const res = this.params.res;
  delete this.params.res;
  const result = yield this.service.gamesRoom.show(res, this.params);
  const preOne = yield this.service.gamesRoom.preOne(res, this.params);
  const nextOne = yield this.service.gamesRoom.nextOne(res, this.params);
  if (result) {
    result.preOne = preOne[0] ? preOne[0] : "没有上一个了";
    result.nextOne = nextOne[0] ? nextOne[0] : "没有下一个了";
    response.message = "操作成功";
    response.success = true;
    response.data = result;
  }
  this.body = response;
  this.status = 200;
};

/**
 * @param 
 * master_consult, slave_consult, flat_consult, amount, rule, amount, games_point_id
 */
// 3 创建内容
// 创建房间
// 用户进入系统 ==> before create ==> create ==> end create
exports.createOrder = function*() {
  const { authorization } = this.header
  const response = { success: false, message: "操作失败", code: 1 };
  this.logger.info('before create===================>', 'authorization:  ' +  authorization + moment().unix() );
  // var res = this.params.res;
  const { master_consult, slave_consult, flat_consult, amount, rule, games_point_id } = this.request.body
  if (!this._.isNumber(parseFloat(master_consult))) {
    response.message = "请输入主场赔率"
    return this.returnJson(response)
  } else if (!this._.isNumber(parseFloat(slave_consult))) {
    response.message = "请输入客场赔率"
    return this.returnJson(response)
  } else if (!this._.isNumber(parseFloat(flat_consult))) {
    response.message = "请输入平场赔率"
    return this.returnJson(response)
  } else if (!this._.isNumber(parseFloat(amount)) || parseFloat(amount) <= 100) {
    response.message = "请输入大于一百的金额!"
    return this.returnJson(response)
  }else if (!this._.isNumber(parseInt(rule))) {
    response.message = "请选择庄盘玩法!"
    return this.returnJson(response)
  }
  else if (this._.isEmpty(games_point_id)) {
    response.message = "丢失比赛id!"
    return this.returnJson(response)
  }
  // rule=0
  const token = this.Trim(authorization.replace('Bearer', ''))
  const user = yield this.getUserByToken(token)
  // TODO： 将授权跟时间存日志
  // 在contorller里面做一次befroecreate
  // TODO: 输入到庄家订单记录
  // 先去找
  if (!user) {
    response.message = "获取用户信息失败";
    this.logger.info('获取用户信息失败===================>', 'token:  ' +  token +'time:'+ moment().unix()  );
    return this.returnJson(response)
  }
  // 查看该用户下该玩法是否已经存在
  // const ret = yield this.app.mysql.get('banker_disc', {
  //   created_by: user.uId,
  //   rule,
  //   games_point_id
  // })
  // if (ret) {
  //   response.message = "该玩法的庄盘已经存在！"
  //   return this.returnJson(response)
  // }

  // 查看该用户下该玩法是否已经存在
  const res = yield this.app.mysql.get('games_point', {
    id: games_point_id,
    status: 0
  })
  if (!res) {
    response.message = "该场次不存在！"
    return this.returnJson(response)
  }



  // 创建订单
  const conn = yield this.app.mysql.beginTransaction()
  const resp = yield this.service.gamesUserOrderRecord.create('banker_order_record', {
    amount,
    rule,
    created_by: user.uId,
    games_point_id,
    consult: `${master_consult},${slave_consult}, ${flat_consult}`
  }, response, conn);
  if (resp.code && resp.code !== 0) {
    yield conn.rollback()
    return this.returnJson(resp)
  }
  yield conn.commit(); // 提交事务
  return this.returnJson({ data: resp})
};

/**
 * 回调接口进入
 * @param id 订单Id
 * @returns code = 0
 */
exports.create = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  this.logger.info('before update===================>'+ moment().unix() );
  const { id, tx } = this.request.body
  if (!id) {
    this.logger.info('miss id===================>'+ moment().unix() );
    response.message = "miss id";
    return this.returnJson(response)
  }
  // TODO： 将授权跟时间存日志
  // 在contorller里面做一次befroecreate
  // TODO: 输入到庄家订单记录
  const conn = yield this.app.mysql.beginTransaction()
  const resp = yield this.service.gamesRoom.create('games_room', { id }, response, conn);
  if (resp.code && resp.code !== 0) {
    yield conn.rollback()
    return this.returnJson(resp)
  }
  // 更新订单
  // 创建奖金池
  // 创建奖金池进出记录
  const ret = yield this.service.gamesUserOrderRecord.update({ id, banker_disc_id: resp.insertId, tx, amount: resp.amount }, response, conn);
  if (ret.code && ret.code !== 0) {
    yield conn.rollback()
    return this.returnJson(ret)
  }
  yield conn.commit(); // 提交事务
  // 返回奖金池记录单号
  this.logger.info('end update===================>'+ moment().unix() );
  return this.returnJson({ data: ret})
};
// 4 更新内容信息
exports.update = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  const result = yield this.service.gamesRoom.update(
    res,
    this.params.id,
    this.request.body
  );
  if (result.affectedRows) {
    response.message = "操作成功";
    response.success = true;
    response.data = result;
  }
  this.body = response;
  this.status = 200;
};

// 5 删除内容信息
exports.destroy = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  const result = yield this.service.gamesRoom.destroy(res, this.params);
  if (result.affectedRows) {
    response.message = "操作成功";
    response.success = true;
    response.data = result.affectedRows; //删除的条数
  }
  this.body = response;
  this.status = 200;
};
