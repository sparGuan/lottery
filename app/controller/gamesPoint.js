/*
 * @Author: spar
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-01 14:59:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\controller\gamesPoint.js
 */
// 1 获取内容列表，分页，每页几个
exports.index = function*() {
  const response = { success: false, message: "操作失败" };
  const res = this.params.res;
  const result = yield this.service.gamesPoint.index(res, this.query);
    if (result) {
      response.message = "操作成功";
      response.success = true;
      response.data = result;
    }
    this.body = response;
    this.status = 200;
};
// 2 根据ID获取内容信息
exports.show = function*() {
  const response = { success: false, message: "操作失败" };
  const res = this.params.res;
  delete this.params.res;
  const result = yield this.service.gamesPoint.show(res, this.params);
  const preOne = yield this.service.gamesPoint.preOne(res, this.params);
  const nextOne = yield this.service.gamesPoint.nextOne(res, this.params);
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

// 3 创建内容
exports.create = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  if (res) {
    const result = yield this.service.gamesPoint.create(res, this.request.body);
    if (result.affectedRows) {
      let returnBody = this.request.body;
      returnBody.uid = result.insertId;
      response.message = "操作成功";
      response.success = true;
      response.data = returnBody;
    }
  }
  this.body = response;
  this.status = 200;
};
// 4 更新内容信息
exports.update = function*() {
  const response = { success: false, message: "操作失败" };
  var res = this.params.res;
  const result = yield this.service.gamesPoint.update(
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
  const result = yield this.service.gamesPoint.destroy(res, this.params);
  if (result.affectedRows) {
    response.message = "操作成功";
    response.success = true;
    response.data = result.affectedRows; //删除的条数
  }
  this.body = response;
  this.status = 200;
};
/**
 * 取消比赛
 */
exports.doDestroyGamesPoint = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const user = yield this.getContextUser(response, true)
  
  if (user.code && user.code === 1) {
    response.message = '获取授权用户失败'
    return  this.returnJson(user)
  }
  
  const { id } = this.request.body
  if (this._.isEmpty(String(id))) {
    response.message = '缺少赛事id'
    return  this.returnJson(response)
  }
  
  const result = yield this.service.gamesUserOrderRecord.destroyGamesPointAndBack(this.request.body, response); // 取消所有比赛并且退回所有资金
  return  this.returnJson(result)
};
// 运营人员公布比赛结果
/**
 * @param score
 * @param result 
 * @param id
 */
exports.publishGames = function*() {
  const response = { success: false, message: "操作失败", code: 1 };
  const { result, id, score  } = this.request.body
  const res = yield this.app.mysql.get('games_point', {
    id,
    status: 2
  })
  if (!res) {
    response.message = "该场次不存在！"
    return this.returnJson(response)
  }


  const conn = yield this.app.mysql.beginTransaction()
  const ret1 = yield conn.update(
    'games_point',
    {
      result,
      score,
      status: 3, // 已经开
      remarks: '已开赛'
    },
    {
      where: {
        id
      }
    }
  )
  if (ret1.changedRows !== 1) {
    yield conn.rollback();
    return this.returnJson(response)
  }
  yield conn.commit(); // 提交事务
  // 查找出所有赢的玩家
  const connn = yield this.app.mysql.beginTransaction()
  const ret = yield this.service.gamesPoint.findWinerAndUpdate({ result, id  }, response, connn);
  if (ret.code && ret.code !== 0) {
    yield connn.rollback(); 
    return this.returnJson(ret)
  }
  yield connn.commit(); // 提交事务
  return this.returnJson({data: ret, message: `本场赛事共有${ret.changedRows}名玩家赢取了比赛`})
};