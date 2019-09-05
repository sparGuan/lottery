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
    {
      path: "/gamesManager",
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
      path: "/gamesPoint",
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
      path: "/gamesLevel",
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

    // banner图信息
    {
      path: "/banner",
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
  ];

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/tableManager" />}
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
