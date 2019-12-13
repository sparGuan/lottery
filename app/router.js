/*
 * @Author: spar
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-03 09:30:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\router.js
 */

module.exports = app => {
  const {  controller } = app;
  app.get('/', 'client.index');
  app.post('/api/upload',app.oAuth2Server.authenticate(), 'uploadfile');

  app.get('/api/restql/:res','restql.index'); // 修改密码
  app.get('/api/restql/:res/:id','restql.show');
  app.post('/api/restql/:res',app.oAuth2Server.authenticate(), 'restql.create');
  app.put('/api/restql/:res/:id',app.oAuth2Server.authenticate(), 'restql.update');
  app.del('/api/restql/:res/:id',app.oAuth2Server.authenticate(), 'restql.destroy');

  // 赛事级别
  app.get('/api/gamesLevel/:res','gamesLevel.index');
  app.get('/api/gamesLevel/:res/:id','gamesLevel.show');
  app.post('/api/gamesLevel/:res',app.oAuth2Server.authenticate(), 'gamesLevel.create');
  app.put('/api/gamesLevel/:res/:id',app.oAuth2Server.authenticate(), 'gamesLevel.update');
  app.del('/api/gamesLevel/:res/:id',app.oAuth2Server.authenticate(), 'gamesLevel.destroy');

  // 赛事信息
  app.get('/api/games/:res','games.index');
  app.get('/api/games/:res/:id','games.show');
  app.post('/api/games/:res',app.oAuth2Server.authenticate(), 'games.create');
  app.put('/api/games/:res/:id',app.oAuth2Server.authenticate(), 'games.update');
  app.del('/api/games/:res/:id',app.oAuth2Server.authenticate(), 'games.destroy');
  // 前端APP
  app.get('/api/v1/get_games_points_all',  controller.games.get_games_points_all);
  app.get('/api/v1/get_games_points_id',  controller.games.get_games_points_id);
  app.get('/api/v1/get_games_points_filter', controller.games.get_games_points_filter);
  app.post('/api/v1/create_bets_order',  controller.bets.createBetsOrder); // 下注
  app.post('/api/v1/create_bets', controller.bets.create); // 下注确认
  app.post('/api/v1/player_order_record', app.oAuth2Server.authenticate(),controller.playerOrderRecord.createOrder); // 领取奖金 ==> 出金
  app.post('/api/v1/banker_order_record', app.oAuth2Server.authenticate(),controller.bankerOrderRecord.createOrder); // 领取奖金 ==> 出金
  app.post('/api/playerOrderRecord/:res', app.oAuth2Server.authenticate(),controller.playerOrderRecord.index); // 玩家下单记录
  app.post('/api/bankerOrderRecord/:res', app.oAuth2Server.authenticate(),controller.bankerOrderRecord.index); //庄家下单记录
  app.post('/api/v1/do_destroy_games_point', app.oAuth2Server.authenticate(),"gamesPoint.doDestroyGamesPoint"); // 管理人员取消比赛
  app.post('/api/v1/do_destroy_games_point', app.oAuth2Server.authenticate(),"gamesPoint.doDestroyGamesPoint"); // 管理人员取消比赛
  app.get('/api/bets/loadBets', app.oAuth2Server.authenticate(), "bets.index"); // 管理人员取消比赛
  
  
  // do_destroy_games_point
  
  // 赛点管理
  app.get('/api/gamesPoint/:res','gamesPoint.index');
  app.get('/api/gamesPoint/:res/:id','gamesPoint.show');
  app.post('/api/gamesPoint/:res',app.oAuth2Server.authenticate(), 'gamesPoint.create');
  app.put('/api/gamesPoint/:res/:id',app.oAuth2Server.authenticate(), 'gamesPoint.update');
  app.del('/api/gamesPoint/:res/:id',app.oAuth2Server.authenticate(), 'gamesPoint.destroy');
  app.post('/api/v1/publishGames',app.oAuth2Server.authenticate(), 'gamesPoint.publishGames');
  
  // banner管理
  app.get('/api/banner/:res','banner.index');
  app.get('/api/banner/:res/:id','banner.show');
  app.post('/api/banner/:res',app.oAuth2Server.authenticate(), 'banner.create');
  app.put('/api/banner/:res/:id',app.oAuth2Server.authenticate(), 'banner.update');
  app.del('/api/banner/:res/:id',app.oAuth2Server.authenticate(), 'banner.destroy');

   // 赛事类别管理
   app.get('/api/gamesType/:res','gamesType.index');
   app.get('/api/gamesType/:res/:id','gamesType.show');
   app.post('/api/gamesType/:res',app.oAuth2Server.authenticate(), 'gamesType.create');
   app.put('/api/gamesType/:res/:id',app.oAuth2Server.authenticate(), 'gamesType.update');
   app.del('/api/gamesType/:res/:id',app.oAuth2Server.authenticate(), 'gamesType.destroy');

    // 场次类型管理
    app.get('/api/senceType/:res','senceType.index');
    app.get('/api/senceType/:res/:id','senceType.show');
    app.post('/api/senceType/:res',app.oAuth2Server.authenticate(), 'senceType.create');
    app.put('/api/senceType/:res/:id',app.oAuth2Server.authenticate(), 'senceType.update');
    app.del('/api/senceType/:res/:id',app.oAuth2Server.authenticate(), 'senceType.destroy');

    app.get('/api/admin/:res','admin.index'); // 修改密码
    app.post('/api/admin/:res',app.oAuth2Server.authenticate(), 'admin.create');
    app.put('/api/admin/:res/:id',app.oAuth2Server.authenticate(), 'admin.update');
    app.del('/api/admin/:res/:id',app.oAuth2Server.authenticate(), 'admin.destroy');
    
  // 房间管理
  app.get('/api/room/:res',app.oAuth2Server.authenticate(),'gamesRoom.index');
  app.post('/api/room/:res/search',app.oAuth2Server.authenticate(), 'gamesRoom.search');
  app.get('/api/room/:res/:id',app.oAuth2Server.authenticate(),'gamesRoom.show');
  
  app.post('/api/room/create_order',app.oAuth2Server.authenticate(), 'gamesRoom.createOrder'); // 创建订单
  app.post('/api/create_room','gamesRoom.create'); // 创建房间庄盘
  // app.del('/api/banner/:res/:id',app.oAuth2Server.authenticate(), 'banner.destroy');
  app.post('/api/disc/:res',app.oAuth2Server.authenticate(), 'bankerDisc.index');
  
  app.get('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.index');
  app.get('/api/table/:res',app.oAuth2Server.authenticate(), 'tableinfo.show');
  app.post('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.create');
  app.put('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.update');
  app.del('/api/table/:res',app.oAuth2Server.authenticate(), 'tableinfo.destroy');

  // 获取用户信息，返回token认证
  app.all('/oauth2/access_token', app.oAuth2Server.token()); 
  // app.post('/oauth2/access_token', app.oauth.grant());
  app.post('/user/authorize', app.oAuth2Server.authenticate(), 'user.authenticate'); // pc登录 ===> 获取授权码
  app.post('/user/checkReal', 'user.checkReal'); // 验真
  // app.post('/user/authorization', app.oAuth2Server.authenticate(), 'user.authenticate'); // 获取给app上授权码

  // app.get('/user/authenticate', app.oAuth2Server.authenticate(), 'user.authenticate');


};