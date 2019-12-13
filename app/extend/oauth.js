let co = require("co");
let { MD5 } = require("../utils/libs");
let moment = require('moment')
module.exports = app => {
  class Model {
    constructor(ctx) {
      this.ctx = ctx;
    }

    *revokeToken(token) {
      console.log("revokeToken");
    }
    *getAuthorizationCode(authorizationCode) {
      console.log("getAuthorizationCode");
    }
    *saveAuthorizationCode(code, client, user) {
      console.log("saveAuthorizationCode");
    }
    *revokeAuthorizationCode(code) {
      console.log("revokeAuthorizationCode");
    }

    *getClient(clientId, clientSecret) {
      // 确认是我的app进来
      if ( // pc端进来
        clientId === "eggClient" &&
        clientSecret === "SD123dfjhgiy28dsjkfbi12hu3ui"
      ) {
        return { clientId, clientSecret, grants: ["password"] };
      } else if (clientId === "appClient" &&
      clientSecret.indexOf("uN") > -1 ) { // app端进来
       return { clientId, clientSecret, grants: ["client_credentials"] };
      }
      return;
    }
    *grantTypeAllowed(clientId, grantType) {
      let allowed = false;
      if (grantType === "password" && clientId === "eggClient") {
        allowed = true;
      } else if (grantType === "client_credentials" && clientId === "appClient") {
        allowed = true;
      }
      return allowed;
    }
    *getUserFromClient(client, clientSecret) {
      const clientSec = JSON.parse(client.clientSecret)
      const ret = yield app.mysql.get("games_user", {
        uId: clientSec.uId
      })
      
      if (!ret) {
        // 没有用户往里面插入用户
        const ret = yield app.mysql.insert("games_user", clientSec)
        return ret;
      } else {
        // 有用户直接返回
        return ret;
      }
    }
    *getUser(username, password) {
      return co(
        app.mysql.get("web_admin", {
          name: username
        }) 
      ).then(
        function(data) {
          if (!data) {
            return;
          }
          if (MD5(password) == data.pass) {
            return { id: data.uid };
          } else {
            return;
          }
        },
        function(err) {
          console.error(err.stack);
          return;
        }
      );
      
    }
    *saveToken(token, client, user) {
      const _token = Object.assign({}, token, { user }, { client });
      if (_token.client.grants[0] === 'client_credentials') {
        const json = JSON.parse(_token.client.clientSecret)
        co(
          app.mysql.update(
            "games_user",
            {
              accessToken: _token.accessToken,
              expires: _token.accessTokenExpiresAt,
              update_time: moment().unix()
            },
            {
              where: {
                uId: json.uId
              }
            }
          )
        ).then(
          function(data) {
            console.error(data);
            return _token;
          },
          function(err) {
            console.error(err.stack);
            return;
          }
        );
      } else {
        co(
          app.mysql.update(
            "web_admin",
            {
              accessToken: token.accessToken,
              expires: token.accessTokenExpiresAt,
              clientId: client.clientId
            },
            {
              where: {
                uid: user.id
              }
            }
          )
        ).then(
          function(data) {
            console.error(data);
            return _token;
          },
          function(err) {
            console.error(err.stack);
            return;
          }
        );
      }
      return _token;
    }
    *getAccessToken(bearerToken) {
      try {
        let token = {};
        const ret = yield app.mysql.get("games_user", {
          accessToken: bearerToken
        })
        if (ret) {
        const { uId, uN, ts } = ret
          token.user = {uId, uN, ts}
          const clientSecret = new Buffer(JSON.stringify(token.user)).toString('base64');
          token.client = {
            clientId: "appClient",
            clientSecret,
            grants: ["client_credentials"]
          };
          token.accessTokenExpiresAt = new Date(ret.expires);
          token.refreshTokenExpiresAt = new Date(ret.expires);
          return token;
        } else {
          return co(
            app.mysql.get("web_admin", {
              accessToken: bearerToken
            })
          ).then(function(data) {
            if (data) {
              const user = { name: data.name, id: data.uid };
              const client = {};
              token.user = user;
              token.client = {
                clientId: "eggClient",
                clientSecret: "SD123dfjhgiy28dsjkfbi12hu3ui",
                grants: ["password"]
              };
              token.accessTokenExpiresAt = new Date(data.expires);
              token.refreshTokenExpiresAt = new Date(data.expires);
              return token;
            } else {
              return false;
            }
          });
        }
      } catch (error) {
        throw error
      }
      
    }
  }

  return Model;
};
