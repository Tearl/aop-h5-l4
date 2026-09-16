export default [
    {
        path: "controlWorkbench",
        component: () => import("@m/views/controlWorkbench/index.vue"),
        children: [
            {
                path: "list",
                meta: {
                    title: "管控工作台",
                },
                component: () => import("@m/views/controlWorkbench/home.vue"),
            },
            {
                path: "addObjectBehavior", // 对象行为
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/objectBehaviorList/components/addObjectBehavior.vue"
                    ),
            },
            {
                path: "lookObjectBehavior", // 对象行为
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/objectBehaviorList/components/lookObjectBehavior.vue"
                    ),
            },
            {
                path: "lookBusinessObject", // 业务对象
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/businessObjectList/components/lookBusinessObject.vue"
                    ),
            },
            {
                path: "addBusinessObject", // 业务对象
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/businessObjectList/components/addBusinessObject.vue"
                    ),
            },
            {
                path: "addFieldData", // 数据字段
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/fieldDataList/components/addFieldData.vue"
                    ),
            },
            {
                path: "lookFieldData", // 数据字段
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/fieldDataList/components/lookFieldData.vue"
                    ),
            },
            {
                path: "addObjectAttribute", // 对象属性
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/objectAttributeList/components/addObjectAttribute.vue"
                    ),
            },
            {
                path: "lookObjectAttribute", // 对象属性
                meta: {
                    onlyNavScreen: true,
                    title: "管控工作台",
                },
                component: () =>
                    import(
                        "@m/views/controlWorkbench/objectAttributeList/components/lookObjectAttribute.vue"
                    ),
            },
        ],
    },
];
