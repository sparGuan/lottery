const moment = require('moment');

module.exports = app => {
  class RestqlService extends app.Service {
    *index(modal, query, condition = {}) {
      let skip = parseInt((query.page) - 1); // 2-1
      const pageSize = parseInt(query.pageSize); // 10
      skip *= pageSize
      const record = yield this.app.mysql.query(`
          SELECT a.*,b.name as type_name, c.name as level_name FROM games as a
          LEFT JOIN games_types as b ON a.games_types_id = b.id
          LEFT JOIN games_level as c ON a.games_level_id = c.id
          ORDER BY  a.${query.sortField || 'id'} ${query.sortOrder || 'DESC'} LIMIT ${skip}, ${pageSize};
      `)
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
      const totalsql = "select count(id) as total from " + modal + conditionstr;
      const totalRecord = yield this.app.mysql.query(totalsql);
      return { record, totalRecord: totalRecord[0].total };
    }
    // 获取赛场和比赛数据
    /**
     * 
     * @param {*} query 
     * @param {*} query.create_time
     * @param {*} query.games_level
     */
    *loadGamesAndPoints( query ) {
      // 大于开始时间， 少于结束时间
      let start_time
      let end_time
      if (!query.create_time) {
        start_time = moment().startOf('day').unix();
        end_time = moment().endOf('day').unix();
      } else {
        start_time = moment.unix(query.create_time ).startOf('day').unix()
        end_time = moment.unix(start_time).endOf('day').unix()
      }
      // 暂时先写死篮球
      let type_cond = ''
      // if (query.type_id) {
      //   type_cond = `AND c.id = ${type_id}`
      // } else {
      //   type_cond = `AND c.name = '每日赛事'`
      // }
      // 统计有多少房间
      const record = yield this.app.mysql.query(`
      SELECT a.name as games_name,a.img_url as games_img_url, a.id as games_id ,d.create_time as point_create_time, b.name as type_name, d.*, 
      e.real_room_nums FROM games as a
          LEFT JOIN games_types as b ON a.games_types_id = b.id
          LEFT JOIN games_point as d ON d.games_id = a.id
          left join (select count(id) as real_room_nums, games_point_id from games_room GROUP BY games_point_id) as e on e.games_point_id = d.id 
          WHERE b.name = '足球' ${type_cond}
          AND d.status = 0
          AND a.status = 0
          AND unix_timestamp(d.master_start_time) < ${end_time} AND  unix_timestamp(d.master_start_time) >= ${start_time}
          ORDER BY d.create_time DESC;
      `)
     console.log(`
     SELECT a.name as games_name,a.img_url as games_img_url, a.id as games_id ,d.create_time as point_create_time, b.name as type_name, d.*, 
     e.real_room_nums FROM games as a
         LEFT JOIN games_types as b ON a.games_types_id = b.id
         LEFT JOIN games_point as d ON d.games_id = a.id
         left join (select count(id) as real_room_nums, games_point_id from games_room GROUP BY games_point_id) as e on e.games_point_id = d.id 
         WHERE b.name = '足球' ${type_cond}
         AND d.status = 0
         AND a.status = 0
         AND unix_timestamp(d.master_start_time) < ${end_time} AND  unix_timestamp(d.master_start_time) >= ${start_time}
         ORDER BY d.create_time DESC;
     `)
      return { record }
    }

    /**
     * 筛选每日 顶级 其他
     * @param {*} query 
     * @param {*} query.create_time
     * @param {*} query.games_level
     */
    *loadGamesAndPointsFilter( query ) {
      // 大于开始时间， 少于结束时间
      const { games_level_id } = query
      const record = yield this.app.mysql.query(`SELECT a.name as games_name,a.img_url as games_img_url, a.id as games_id ,d.create_time as point_create_time, b.name as type_name, c.name as level_name, d.* FROM games as a
      LEFT JOIN games_types as b ON a.games_types_id = b.id
      LEFT JOIN games_level as c ON a.games_level_id = c.id
      LEFT JOIN games_point as d ON d.games_id = a.id
      WHERE b.name = '足球' AND c.id = ${games_level_id} And d.status = 0
      ORDER BY d.create_time DESC;
      `)
      return { record }
    }

    /**
     * app获取一条赛点
     * @param {*} query 
     * @param {*} query.id
     */
    *loadGamesPoint( query ) {
      const record = yield this.app.mysql.query(`select 
          a1.*, a2.name as gameName, a2.img_url as logo 
          FROM games_point 
          as a1 LEFT JOIN games as a2 
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
    *create(modal, request) {
      request = this.service.tableinfo.toTimestamp(request);
      const result = yield this.app.mysql.insert(modal, request);
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
