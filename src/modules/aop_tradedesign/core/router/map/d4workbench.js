export default [
  {
    path: "d4workbench",
    component: () => import("@m/views/d4workbench/workbench/index"),
    children: [
      {
        path: "design",
        meta: {
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/design"),
      },
      {
        path: "downloadDesign",
        meta: {
          onlyNavScreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/downloadDesign"),
      },
      {
        path: "L5Detail",
        meta: {
          onlyNavScreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/components/download_design/components/l5_info"),
      },
      {
        path: "confirmTwoDesign",
        meta: {
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/confirmTwoDesign"),
      },
      // 上装设计进服务详情页面
      {
        path: "transDetail",
        meta: {
          onlyNavScreen: false,
          title: "交易预览",
          fullscreen: true,
        },
        component: () => import("@m/views/d4workbench/workbench/transDetail"),
      },
      // 上装设计进编辑服务页面
      {
        path: "transEdit",
        meta: {
          onlyNavScreen: true,
          // title: "T2工作台",
          // fullscreen: true,
        },
        component: () => import("@m/views/d4workbench/workbench/transEdit"),
      },
      {
        path: "assetConfirmList",
        meta: {
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/assetConfirmList"),
      },
      // 上装设计进服务详情页面
      // {
      //   path: "transDetail",
      //   meta: {
      //     onlyNavScreen: true,
      //     // title: "T2工作台"
      //   },
      //   component: () => import("@m/views/d4workbench/workbench/transDetail"),
      // },
      // 编排添加服务页面
      {
        path: "addServicePage",
        meta: {
          // onlyNavScreen: true,
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/addServicePage"),
      },
      // 一确页面
      {
        path: "transConfirm",
        meta: {
          onlyNavScreen: false,
          // title: "T2工作台",
          fullscreen: true,
        },
        component: () => import("@m/views/d4workbench/workbench/oneConfirm"),
      },
      // 评审页面
      {
        path: "transReview",
        meta: {
          onlyNavScreen: false,
          // title: "T2工作台",
          fullscreen: true,
        },
        component: () => import("@m/views/d4workbench/workbench/transReview"),
      },
      {
        path: "directL5Detail",
        meta: {
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/d4workbench/workbench/L5Detail"),
      },
    ]
  }
]