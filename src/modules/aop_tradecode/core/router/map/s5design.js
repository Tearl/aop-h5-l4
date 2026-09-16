export default [
    {
      path: "s5Design",
      component: () => import("@m/views/s5workdesign/index"),
      children: [
        {
          path: "design",
          meta: {
            fullscreen: true,
            // title: '开发工作台-S5设计编辑器'
          },
          component: () => import("@m/views/s5workdesign/ruleServiceList"),
        },
        {
            path: "interfaceDetail",
            meta: {
                // onlyNavScreen: true,
                fullscreen: true,
                // title: "开发工作台-S5设计编辑器"
            },
            component: () => import("@m/views/s5workdesign/interfaceDetail"),
        },
      ]
    }
  ]
