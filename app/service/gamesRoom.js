const moment = require('moment');

module.exports = app => {
  class RestqlService extends app.Service {
    *index(modal, query, condition = {}, isLike = false) {
      let skip = parseInt((query.page) - 1); // 2-1
      const pageSize = parseInt(query.pageSize); // 10
      skip *= pageSize
      const { games_point_id, uId } = query
      let conditionstr = this.service.tableinfo.toCondition(condition, isLike);
      const record = yield this.app.mysql.query(`
      SELECT
      a.*, b.master_count,
      b.slave_count,
      c.name AS games_name,
      d.master_consult,
      d.slave_consult,
      d.flat_consult,
      d.amount AS max_bets,
      d.master_full_amount,
      d.slave_full_amount,
      d.flat_full_amount,
      if(e.sum_variance > (d.master_full_amount + d.slave_full_amount + d.flat_full_amount),0,-1) as is_full

      FROM games_room as a 
      LEFT JOIN games_point AS b ON a.games_point_id = b.id
      LEFT JOIN games AS c ON b.games_id = c.id

      LEFT JOIN (
        SELECT
          *, 
          (amount / master_consult) AS master_full_amount,
          (amount / slave_consult) AS slave_full_amount,
          (amount / flat_consult) AS flat_full_amount
        FROM
          banker_disc
        WHERE
          rule = 0
      ) AS d ON d.games_room_id = a.id

      left JOIN award_pool f on  f.banker_disc_id = d.id

      LEFT JOIN ( select sum(CONVERT(variance,DECIMAL)) as sum_variance, award_pool_id from award_pool_record where CONVERT(variance,DECIMAL) > 0 and status = 0 group by award_pool_id) AS e ON e.award_pool_id = f.id

      ${conditionstr}
      ${conditionstr === '' ? ` WHERE a.games_point_id = ${games_point_id} ${uId? 'AND a.created_by != '+uId+' ' : ' '} ` :` AND a.games_point_id = ${games_point_id} ${uId? 'AND a.created_by != '+uId+' ' : ' '} `}
          ORDER BY ${uId ?' is_full,  max_bets, a.id ': ' a.id ' } ${query.sortOrder || 'DESC'} LIMIT ${skip}, ${pageSize};
      `)
      
      const cond = conditionstr.replace('a.status', 'status')
      const totalsql = "select count(id) as total from " + modal + ' as a ' + cond + `${conditionstr === '' ? `WHERE a.games_point_id = ${games_point_id}` :` AND a.games_point_id = ${games_point_id} ${uId? 'AND a.created_by != '+uId+' ' : ' '}`}`;
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }

    /**
     * 
     * @param {*} query 
     * @param {*} query.id
     */
    *loadGamesPoint( query ) {
      const record = yield this.app.mysql.query(`select 
          a1.*, a2.name as gameName, a2.img_url as logo 
          FROM games_point 
          as a1 LEFT JOIN gamesRoom as a2 
          ON a1.games_id = a2.id where a1.id = ${query.id}
      `)
     
      return { record }
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
    /**
     * 建庄盘
     * @param {*} modal 
     * @param {*} request 
     */
    *create(modal, request, response, conn) {
      request = this.service.tableinfo.toTimestamp(request);
      let result = {}
      const { id } = request
       // 没有房间创建房间
       // 查找是否有相同玩法的庄盘， 如果有相同玩法的庄盘就提示
       // 建房间
        const order = yield this.app.mysql.get('banker_order_record',{id} )
        if (!order) {
          this.logger.info('miss id===================>'+ moment().unix() + 'data==========>' + id);
          response.message = "订单不存在"
          return response
        }
        const {created_by, games_point_id, consult, amount} = order
        result = yield conn.insert(modal, {created_by, games_point_id});
        // 建庄盘
        if (!result) {
          this.logger.info('fail room===================>'+ moment().unix() + 'data==========>' + JSON.stringify({created_by, games_point_id}));
          response.message = "建房间失败"
          return response
        }
        const arr = consult.split(',')
        const master_consult = arr[0]
        const slave_consult = arr[1]
        const flat_consult = arr[2]
        // 最终返回庄盘
        result = yield conn.insert('banker_disc', { games_point_id, master_consult, slave_consult, flat_consult, games_room_id: result.insertId , amount, created_by });
        this.logger.info('success create ROOM AND DISC ===================>', JSON.stringify(result) + '==============>' + moment().unix());
        if (!result) {
          this.logger.info('fail disc===================>'+ moment().unix() + 'data==========>' + JSON.stringify({created_by, games_point_id}));
          response.message = "建房间失败"
          return response
        }
        result.amount = amount
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
  }
  return RestqlService;
};
