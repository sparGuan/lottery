exports.keys = "znkey";
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
    '*',
    'http://120.78.141.142:7001',
    'http://192.168.0.139:7001',
    'http://127.0.0.1:7001',
    'http://localhost:7001',
    'http://192.168.0.101:8080',
    'http://localhost:8080',
    'http://192.168.1.21:8080',
    'http://localhost:8099',
    'http://192.168.1.21:8099',
    'http://192.168.0.101:8099'
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
  grants: ["password"],
  expires: 60
};
