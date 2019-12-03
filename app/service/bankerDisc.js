/*
 * @Author: your name
 * @Date: 2019-11-21 11:12:06
 * @LastEditTime: 2019-12-03 11:33:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\service\bankerDisc.js
 */
const _ = require('lodash')
module.exports = app => {
  class RestqlService extends app.Service {
    // 获取我的装
    *index( query, response) {
      const { games_room_id } = query
      if (_.isEmpty(games_room_id)) {
        response.message = '缺少房间ID'
        return response
      }
      const sql = 
      'SELECT ' +
        'a.*, b.people, IFNULL(((a.amount - d.master_bet_amount ) / a.master_consult ), a.amount / a.master_consult)  as master_bet_amount, IFNULL(((a.amount - e.slave_bet_amount) / a.slave_consult), a.amount / a.slave_consult) as slave_bet_amount, IFNULL(((a.amount - f.flat_bet_amount) / a.flat_consult),a.amount / a.flat_consult) as flat_bet_amount '+
      'FROM '+
        'banker_disc AS a '+
      'LEFT JOIN ( '+
        'SELECT '+
          '`status`, '+
          'count(DISTINCT created_by) AS people, '+
          'banker_disc_id '+
        'FROM '+
          'player_order_record '+
          'GROUP BY banker_disc_id'+
      ') AS b ON a.id = b.banker_disc_id '+
      'LEFT JOIN award_pool AS c ON a.id = c.banker_disc_id '+
      
      'LEFT JOIN ( '+
        'SELECT '+
          'sum(amount * consult) as master_bet_amount, '+
          ' banker_disc_id, '+
          '`status` ' +
        'FROM '+
          'player_order_record '+
        'where  bet_to = 0 '+
        'and rule = 0 '+
        'and `status` != 1 ' +
        'GROUP BY banker_disc_id '+
      ') AS d ON d.banker_disc_id = a.id '+
      
      'LEFT JOIN ( '+
        'SELECT '+
          'sum(amount * consult) as slave_bet_amount, '+
          'banker_disc_id, '+
          '`status` ' +
        'FROM '+
          'player_order_record '+
        'where  bet_to = 1 '+
        'and rule = 0 '+
        'and `status` != 1 ' +
        'GROUP BY banker_disc_id '+
      ') AS e ON e.banker_disc_id = a.id '+
      
      'LEFT JOIN ( '+
        'SELECT '+
          'sum(amount * consult) as flat_bet_amount, '+
          'banker_disc_id, '+
          '`status` ' +
        'FROM '+
          'player_order_record '+
        'where  bet_to = 2 '+
        'and rule = 0 '+
        'and `status` != 1 ' +
        'GROUP BY banker_disc_id '+
      ') AS f ON f.banker_disc_id = a.id '+
      
      'WHERE '+
        'a.`status` = 0 '+
      'AND a.games_room_id = '+games_room_id+' '+
      'ORDER BY '+
        'a.id DESC '
      const record = yield this.app.mysql.query(sql);
      return { record };
    }
    
  }
  return RestqlService;
};
