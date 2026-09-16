export default [
    {
        path: 'assetALLList',
        component: () => import('@m/views/assetList/index'),
        children: [
          {
            path: "lowerDevelop",
            meta: {
              title: "后端开发"
            },
            component: () => import("@m/views/assetList/lowerDevelop"),
          },
          {
            path: "connectFitter",
            meta: {
              title: "直连适配"
            },
            component: () => import("@m/views/assetList/connectFitter"),
          },{
            path:"viewConfigtion",
            meta: {
              title: "配置详情"
            },
            component: () => import("@m/views/assetList/viewConfigtion"),
          },{
            path:"headerTemplateManager",
            meta: {
              title: "报文模版管理"
            },
            component: () => import("@m/views/assetList/headerTemplateManager"),
          },{
            path:"headerTemplateDetail",
            meta: {
              title: "报文模板详情"
            },
            component: () => import("@m/views/assetList/headerTemplateDetail"),
          }
        ]
    }
]
