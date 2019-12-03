/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-02 11:18:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\config\config.default.js
 */
exports.keys = "znkey";
exports.private_key = "-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----";
exports.view = {
  defaultViewEngine: "nunjucks",
  mapping: {
    ".tpl": "nunjucks"
  }
};
// mount middleware
exports.middleware = ["robot", "errorHandler", "apiWrapper"];
(exports.errorHandler = {
  games: "/api"
}),
  // middleware config
  (exports.robot = {
    ua: [/curl/i, /Baiduspider/i]
  });

exports.security = {
  ignore: "/api/",
  domainWhiteList: [
    'http://120.78.141.142:7001',
    'http://192.168.0.139:7001',
    'http://127.0.0.1:7001',
    'http://localhost:7001',
    'http://192.168.1.178:8081',
    'http://localhost:8080',
    'http://192.168.1.21:8080',
    'http://localhost:8099',
    'http://192.168.1.21:7001',
    'http://192.168.1.21:8099',
    'http://192.168.1.178:8080',
    'http://192.168.1.178:7001',
    'http://192.168.1.28:8080',
  ],
  methodnoallow: { enable: false },
  csrf: {
    enable: false,
    ignoreJSON: true // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
  }
};

exports.cors = {
  allowMethods: "GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH"
};

exports.multipart = {
  fileExtensions: [".xls", ".doc", ".ppt", ".docx", ".xlsx", ".pptx"]
};

exports.oAuth2Server = {
  grants: ["password", "client_credentials"],
  expires: 60000,
  accessTokenLifetime: 72 * 60 * 60
};
exports.logger = {
  // consoleLevel: 'NONE',
};
exports.customLogger = {
  scheduleLogger: {
    // consoleLevel: 'DEBUG',
    // consoleLevel: 'NONE',
    // file: path.join(appInfo.root, 'logs', appInfo.name, 'egg-schedule.log'),
  },
};
