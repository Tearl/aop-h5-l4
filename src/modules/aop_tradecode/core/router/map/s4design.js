export default [
    {
      path: "s4Design",
      component: () => import("@m/views/s4workdesign/index"),
      children: [
        {
          path: "design",
          meta: {
            fullscreen: true,
            // title: 'D2工作台-交易设计编辑器'
          },
          component: () => import("@m/views/s4workdesign/design"),
        },
        {
          path: "interfaceDetail",
          meta: {
            // onlyNavScreen: true,
            fullscreen: true,
            // title: "T2工作台"
          },
          component: () => import("@m/views/s4workdesign/interfaceDetail"),
        },
        {
          path: "checkFunction",
          meta: {
            fullscreen: true,
            // title: 'D2工作台-交易设计编辑器'
          },
          component: () => import("@m/views/s4workdesign/checkFunction"),
        },
      ]
    }
  ]
