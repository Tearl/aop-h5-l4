export default [
  {
    path: "editorDesign",
    component: () => import("@m/views/workbench/index"),
    children: [
      {
        path: "design",
        meta: {
          fullscreen: true,
          // title: 'D2工作台-交易设计编辑器'
        },
        component: () => import("@m/views/workbench/design"),
      },
      {
        path: "interfaceDetail",
        meta: {
          // onlyNavScreen: true,
          fullscreen: true,
          // title: "T2工作台"
        },
        component: () => import("@m/views/workbench/interfaceDetail"),
      },
    ]
  }
]