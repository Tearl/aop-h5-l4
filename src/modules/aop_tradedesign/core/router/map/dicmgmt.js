export default [
  {
    path: "dicmgmt",
    component: () => import("@m/views/dicmgmt/index"),
    children: [
      {
        path: "list",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/home"),
      },
      {
        path: "dicList",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/dicList"),
      },
      //数据集
      {
        path: "addDataSet",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/addDataset"),
      },
      {
        path: "editDataSet",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/editDataset"),
      },
      {
        path: "dataDetail",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/dataDetail"),
      },
      //分段
      {
        path: "addSubstn",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/addSubstn"),
      },
      {
        path: "editSubstn",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/editSubstn"),
      },
      {
        path: "piecewiseDetail",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/piecewiseDetail"),
      },
      //字段
      {
        path: "addField",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/addField"),
      },
      {
        path: "editField",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/editField"),
      },
      {
        path: "fieldDetail",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/fieldDetail"),
      },
      //服务
      {
        path: "addServ",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/addService"),
      },
      {
        path: "L5serviceDetail",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/L5serviceDetail"),
      },
      {
        path: "editServ",
        meta: {
          onlyNavScreen: true,
          title: "字典管理"
        },
        component: () => import("@m/views/dicmgmt/editService"),
      },
      //服务系统查看
      {
        path: "view",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/view"], resolve),
      },
      //业务对象新增
      {
        path: "addObj",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/addObj"], resolve),
      },
      //业务对象编辑
      {
        path: "modObj",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/modObj"], resolve),
      },
      //业务对象详情
      {
        path: "objDetail",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/objDetail"], resolve),
      },
      // 数据字典创建
      {
        path: "addDictionary",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/addDictionary"], resolve),
      },
      // 数据字典编辑
      {
        path: "modDictionary",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/modDictionary"], resolve),
      },
      // 数据字典验证规则
      {
        path: "rule",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/rule"], resolve),
      },
      // 数据字典详情
      {
        path: "dictionaryDetail",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/dictionaryDetail"], resolve),
      },
      // 公共数据字典
      // {
      //   path: "dictionaryList",
      //   meta: {
      //     onlyNavScreen: true
      //   },
      //   component: resolve => require(["@m/views/dicmgmt/dictionaryList"], resolve),
      // },
      // 分类
      {
        path: "classify",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/classify"], resolve),
      },
      //验证规则列表
      {
        path: "ruleList",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/ruleList"], resolve)
      },
      // 验证规则分类
      {
        path: "ruleClassification",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/ruleClassification"], resolve)
      },
      // 验证规则分类
      {
        path: "ruleAdd",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/ruleAdd"], resolve)
      },
      // 示例列表
      {
        path: "dicExampleList",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/dicExampleList"], resolve)
      },
      // 系统数据字典
      {
        path: "sysDictionary",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/sysDictionary"], resolve)
      },
      {
        path: "dicDetail",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/dicDetail"], resolve)
      },
      {
        path: "editServiceL5",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/editServiceL5"], resolve)
      },
      // 数据集详情
      {
        path: "datasetdetail",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/datasetdetail"], resolve),
      },
      // 字段详情
      {
        path: "fieldInfo",
        meta: {
          onlyNavScreen: true
        },
        component: resolve => require(["@m/views/dicmgmt/fieldInfo"], resolve),
      },
    ]
  }
]