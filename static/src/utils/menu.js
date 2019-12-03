module.exports = [
  // {
  //   key: "tableManager",
  //   name: "模块管理", //模块
  //   icon: "database",
  //   child: [
  //     {
  //       key: "create",
  //       name: "新建模块",
  //       icon: "file",
  //       isMenuTab: false,
  //       clickable: false
  //     },
  //     {
  //       key: "edit",
  //       name: "修改模块",
  //       icon: "laptop",
  //       isMenuTab: false,
  //       clickable: false
  //     },
  //     {
  //       key: "info",
  //       name: "模块详情",
  //       icon: "setting",
  //       isMenuTab: false,
  //       clickable: false
  //     }
  //   ]
  // },
  {
    key: "home",
    name: "数据大盘", //模块
    icon: "pie-chart",
  },
  {
    key: "games",
    name: "赛事", //模块
    icon: "file-jpg",
    child: [
      {
        key: "gamesType",
        name: "赛事类别", //模块
        icon: "file-jpg",
        child: [
          {
            key: "create",
            name: "新建赛事类别",
            icon: "file",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "edit",
            name: "修改赛事类别",
            icon: "laptop",
            isMenuTab: false,
            clickable: false
          }
        ]
      },
      {
        key: "banner",
        name: "轮播图管理", //模块
        icon: "file-jpg",
        child: [
          {
            key: "create",
            name: "新建轮播图",
            icon: "file",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "edit",
            name: "修改轮播图",
            icon: "laptop",
            isMenuTab: false,
            clickable: false
          }
        ]
      },
      {
        key: "gamesLevel",
        name: "赛事级别", // 模块
        icon: "trophy",
        child: [
          {
            key: "create",
            name: "新建级别",
            icon: "file",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "edit",
            name: "修改级别",
            icon: "laptop",
            isMenuTab: false,
            clickable: false
          }
        ]
      },
      {
        key: "gamesManager",
        name: "联赛管理", // 模块
        icon: "bars",
        child: [
          {
            key: "create",
            name: "新建赛事",
            icon: "file",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "edit",
            name: "修改赛事",
            icon: "laptop",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "info",
            name: "赛事详情",
            icon: "setting",
            isMenuTab: false,
            clickable: false
          }
        ]
      },
      {
        key: "gamesPoint",
        name: "赛事管理", // 模块
        icon: "bulb",
        child: [
          {
            key: "create",
            name: "新建赛事",
            icon: "file",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "edit",
            name: "修改赛事",
            icon: "laptop",
            isMenuTab: false,
            clickable: false
          },
          {
            key: "info",
            name: "赛事详情",
            icon: "setting",
            isMenuTab: false,
            clickable: false
          }
        ]
      },
      // 场次管理
      // {
      //   key: "senceType",
      //   name: "场次管理", // 模块
      //   icon: "bulb",
      //   child: [
      //     {
      //       key: "create",
      //       name: "新建类型",
      //       icon: "file",
      //       isMenuTab: false,
      //       clickable: false
      //     },
      //     {
      //       key: "edit",
      //       name: "修改类型",
      //       icon: "laptop",
      //       isMenuTab: false,
      //       clickable: false
      //     },
      //   ]
      // },
    ]
  },
  

  // {
  //   key: "room",
  //   name: "房间管理", // 模块
  //   icon: "hourglass",
  //   child: [
  //     {
  //       key: "info",
  //       name: "房间详情",
  //       icon: "setting",
  //       isMenuTab: false,
  //       clickable: false
  //     }
  //   ]
  // },

  {
    key: "betManager",
    name: "投注管理", // 模块
    icon: "hourglass",
    child: [
     
    ]
  },

  {
    key: "customer",
    name: "客户管理", // 模块
    icon: "hourglass",
    child: [
     
    ]
  },

  {
    key: "finance",
    name: "财务管理", // 模块
    icon: "hourglass",
    child: [
     
    ]
  },
  {
    key: "system",
    name: "系统设置", // 模块
    icon: "setting",
    child: [
      {
        key: "user",
        name: "管理人员",
        icon: "file",
        isMenuTab: true,
        clickable: false
      },
      {
        key: "logs",
        name: "操作日志",
        icon: "file",
        isMenuTab: true,
        clickable: false
      },
    ]
  },
  // {
  //   key: "showApi",
  //   name: "接口管理",
  //   icon: "api",
  //   child: [
  //     {
  //       key: "info",
  //       name: "接口详情",
  //       icon: "code-o",
  //       isMenuTab: false,
  //       clickable: false
  //     }
  //   ]
  // }
];
// icon: 'laptop',
// icon: 'user',
// icon: 'shopping-cart',
// icon: 'api',
// icon: 'camera-o',
// icon: 'heart-o',
// icon: 'database',
// icon: 'bars',
// icon: 'search',
// icon: 'edit',
// icon: 'credit-card',
// icon: 'code-o',
// icon: 'line-chart',
// icon: 'bar-chart',
// icon: 'area-chart',
// icon: 'setting',
