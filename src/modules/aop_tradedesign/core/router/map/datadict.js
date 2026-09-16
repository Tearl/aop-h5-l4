export default [
  {
    path: "datadict",
    component: () => import("@m/views/datadict/index.vue"),
    children: [
      {
        path: "datadictControl",
        meta: {
          title: "数据字典管控",
        },
        component: () =>
          import("@m/views/datadict/datadictControl/index.vue"),
      },
      {
        path: "dataFieldManage",
        meta: {
          title: "数据字段管理",
        },
        component: () =>
          import("@m/views/datadict/dataFieldManage/index.vue"),
      },
      {
        path: "themelist",
        meta: {
          onlyNavScreen: false,
          title: "标准主题管理"
        },
        component: () => import("@m/views/datadict/themeManage/index"),
      },
      {
        path: "sortlist",
        meta: {
          onlyNavScreen: false,
          title: "标准分类管理"
        },
        component: () => import("@m/views/datadict/sortManage/index"),
      },
      {
        path: "rootlist",
        meta: {
          onlyNavScreen: false,
          title: "词根管理"
        },
        component: () => import("@m/views/datadict/rootManage/index"),
      },
      {

        path: "neumlist",
        meta: {
          onlyNavScreen: false,
          title: "枚举字典管理"
        },
        component: () => import("@m/views/datadict/enumManage/index"),
      },
      {
        path: "neumEdit",
        meta: {
          onlyNavScreen: false,
          title: "枚举字典管理"
        },
        component: () => import("@m/views/datadict/enumManage/edit"),
      },
      {
        path: "approvalManagement",
        meta: {
          onlyNavScreen: false,
          title: "审批管理"
        },
        component: () => import("@m/views/datadict/approvalManagement/index"),
      },
      {
        path: "benchmarkingManage",
        meta: {
          onlyNavScreen: false,
          title: "对标管理"
        },
        component: () => import("@m/views/datadict/benchmarkingManage/index"),
      },
      {
        path: "benchmanage",
        meta: {
          onlyNavScreen: false,
          title: "对标管理"
        },
        component: () => import("@m/views/datadict/benchmarkingManage/benchmanage"),
      },
      {
        path: "intelligentBenchmarking",
        meta: {
          onlyNavScreen: false,
          title: "智能对标"
        },
        component: () => import("@m/views/datadict/intelligentBenchmarking/index"),
      },
    ],
  }
];
