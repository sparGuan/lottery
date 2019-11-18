
// const cors = require('koa-cors');

module.exports = app => {
  const {  controller } = app;
  app.get('/', 'client.index');
  app.post('/api/upload',app.oAuth2Server.authenticate(), 'uploadfile');

  app.get('/api/restql/:res','restql.index');
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
  app.get('/api/v1/get_games_points_all', controller.games.get_games_points_all);
  app.get('/api/v1/get_games_points_id', controller.games.get_games_points_id);
  
  // 赛点管理
  app.get('/api/gamesPoint/:res','gamesPoint.index');
  app.get('/api/gamesPoint/:res/:id','gamesPoint.show');
  app.post('/api/gamesPoint/:res',app.oAuth2Server.authenticate(), 'gamesPoint.create');
  app.put('/api/gamesPoint/:res/:id',app.oAuth2Server.authenticate(), 'gamesPoint.update');
  app.del('/api/gamesPoint/:res/:id',app.oAuth2Server.authenticate(), 'gamesPoint.destroy');

  // banner管理
  app.get('/api/banner/:res','banner.index');
  app.get('/api/banner/:res/:id','banner.show');
  app.post('/api/banner/:res',app.oAuth2Server.authenticate(), 'banner.create');
  app.put('/api/banner/:res/:id',app.oAuth2Server.authenticate(), 'banner.update');
  app.del('/api/banner/:res/:id',app.oAuth2Server.authenticate(), 'banner.destroy');

  app.get('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.index');
  app.get('/api/table/:res',app.oAuth2Server.authenticate(), 'tableinfo.show');
  app.post('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.create');
  app.put('/api/table',app.oAuth2Server.authenticate(), 'tableinfo.update');
  app.del('/api/table/:res',app.oAuth2Server.authenticate(), 'tableinfo.destroy');


  app.all('/oauth2/access_token', app.oAuth2Server.token());
  app.post('/user/authorize', app.oAuth2Server.authenticate(), 'user.authenticate');
  app.get('/user/authenticate', app.oAuth2Server.authenticate(), 'user.authenticate');
};