import React from "react";
import PropTypes from "prop-types";
import { Router, Switch, Route, Redirect, routerRedux } from "dva/router";
import dynamic from "dva/dynamic";
import App from "./routes/app";

const { ConnectedRouter } = routerRedux;

const Routers = function({ history, app }) {
  const error = dynamic({
    app,
    component: () => import("./routes/error")
  });
  const routes = [
    {
      path: "/showApi",
      models: () => [import("./models/showApi")],
      component: () => import("./routes/showApi/index")
    },
    {
      path: "/tableManager",
      models: () => [import("./models/tableManager")],
      component: () => import("./routes/tableManager/index")
    },
    {
      path: "/tableManager/create",
      models: () => [import("./models/tableForm")],
      component: () => import("./routes/tableManager/TableForm")
    },
    {
      path: "/tableManager/edit/:id",
      models: () => [import("./models/tableForm")],
      component: () => import("./routes/tableManager/TableForm")
    },
    // 首页数据大盘
    {
      path: "/home",
      models: () => [import("./models/home")],
      component: () => import("./routes/home/index")
    },

    {
      path: "/games/gamesManager",
      models: () => [import("./models/gamesManager")],
      component: () => import("./routes/gamesManager/index")
    },
    {
      path: "/gamesManager/create",
      models: () => [import("./models/gamesForm")],
      component: () => import("./routes/gamesManager/GamesForm")
    },
    {
      path: "/gamesManager/edit/:id",
      models: () => [import("./models/gamesForm")],
      component: () => import("./routes/gamesManager/GamesForm")
    },
    // 赛点
    {
      path: "/games/gamesPoint",
      models: () => [import("./models/gamesPoint")],
      component: () => import("./routes/gamesPoint/index")
    },
    {
      path: "/gamesPoint/create",
      models: () => [import("./models/gamesPointForm")],
      component: () => import("./routes/gamesPoint/GamesPointForm")
    },
    {
      path: "/gamesPoint/edit/:id",
      models: () => [import("./models/gamesPointForm")],
      component: () => import("./routes/gamesPoint/GamesPointForm")
    },
    
    {
      path: "/games/gamesLevel",
      models: () => [import("./models/gamesLevel")],
      component: () => import("./routes/gamesLevel/index")
    },
    {
      path: "/gamesLevel/create",
      models: () => [import("./models/gamesLevelForm")],
      component: () => import("./routes/gamesLevel/GamesLevelForm")
    },
    {
      path: "/gamesLevel/edit/:id",
      models: () => [import("./models/gamesLevelForm")],
      component: () => import("./routes/gamesLevel/GamesLevelForm")
    },

    // 赛事类别
    {
      path: "/games/gamesType",
      models: () => [import("./models/gamesType")],
      component: () => import("./routes/gamesType/index")
    },
    {
      path: "/gamesType/create",
      models: () => [import("./models/gamesTypeForm")],
      component: () => import("./routes/gamesType/GamesTypeForm")
    },
    {
      path: "/gamesType/edit/:id",
      models: () => [import("./models/gamesTypeForm")],
      component: () => import("./routes/gamesType/GamesTypeForm")
    },

    // 投注管理
    {
      path: "/betManager",
      models: () => [import("./models/bet")],
      component: () => import("./routes/bets/index")
    },
    
    // {
    //   path: "/senceType/create",
    //   models: () => [import("./models/senceTypeForm")],
    //   component: () => import("./routes/senceType/SenceTypeForm")
    // },
    // {
    //   path: "/senceType/edit/:id",
    //   models: () => [import("./models/senceTypeForm")],
    //   component: () => import("./routes/senceType/SenceTypeForm")
    // },

    // 场次类型
    {
      path: "/games/senceType",
      models: () => [import("./models/senceType")],
      component: () => import("./routes/senceType/index")
    },
    {
      path: "/senceType/create",
      models: () => [import("./models/senceTypeForm")],
      component: () => import("./routes/senceType/SenceTypeForm")
    },
    {
      path: "/senceType/edit/:id",
      models: () => [import("./models/senceTypeForm")],
      component: () => import("./routes/senceType/SenceTypeForm")
    },

    // banner图信息
    {
      path: "/games/banner",
      models: () => [import("./models/banner")],
      component: () => import("./routes/banner/index")
    },
    {
      path: "/banner/create",
      models: () => [import("./models/bannerForm")],
      component: () => import("./routes/banner/BannerForm")
    },
    {
      path: "/banner/edit/:id",
      models: () => [import("./models/bannerForm")],
      component: () => import("./routes/banner/BannerForm")
    },

    // 系统设置
    {
      path: "/system/user",
      models: () => [import("./models/user")],
      component: () => import("./routes/user/index")
    },

    // 房间信息
    // {
    //   path: "/room",
    //   models: () => [import("./models/room")],
    //   component: () => import("./routes/room/index")
    // },
    // {
    //   path: "/room/edit/:id",
    //   models: () => [import("./models/roomForm")],
    //   component: () => import("./routes/room/roomForm")
    // },
  ];

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/home" />}
          />
          {routes.map(({ path, ...dynamics }, key) => (
            <Route
              key={key}
              exact
              path={path}
              component={dynamic({ app, ...dynamics })}
            />
          ))}
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  );
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
};

export default Routers;
