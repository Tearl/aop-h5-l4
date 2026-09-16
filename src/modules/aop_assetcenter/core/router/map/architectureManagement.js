export default [
    // 系统全景
    {
        path: 'applicationPanorama',
        name: 'aopAssetcenterApplicationPanorama',
        meta: {
            title: '系统全景'
        },
        component: () => import('@m/views/applicationPanorama')
    },
    {
        path: 'applicationPanorama/editor',
        name: 'aopAssetcenterApplicationPanoramaEditor',
        meta: {
            title: '架构图编辑器',
            hidden: true
        },
        component: () => import('@m/views/applicationPanorama/editor')
    },
    {
        path: 'applicationPanorama/model-editor',
        name: 'aopAssetcenterApplicationPanoramaModelEditor',
        meta: {
            title: '架构模型编辑器',
            hidden: true
        },
        component: () => import('@m/views/applicationPanorama/modelEditor')
    },

    // 架构全景
    {
        path: 'architecturePanorama',
        name: 'aopAssetcenterArchitecturePanorama',
        meta: {
            title: '架构全景'
        },
        component: () => import('@m/views/architecturePanorama')
    },

    // 业务架构
    {
        path: 'productModel',
        name: 'aopAssetcenterProductModel',
        meta: {
            title: '产品模型'
        },
        component: () => import('@m/views/productModel')
    },
    {
        path: 'processModel',
        name: 'aopAssetcenterProcessModel',
        meta: {
            title: '流程模型'
        },
        component: () => import('@m/views/processModel')
    },
    {
        path: 'capabilityModel',
        name: 'aopAssetcenterCapabilityModel',
        meta: {
            title: '能力模型'
        },
        component: () => import('@m/views/capabilityModel')
    },
    {
        path: 'entityModel',
        name: 'aopAssetcenterEntityModel',
        meta: {
            title: '实体模型'
        },
        component: () => import('@m/views/entityModel')
    },

    // 数据管理
    {
        path: 'dataManagement',
        name: 'aopAssetcenterDataManagement',
        meta: {
            title: '数据管理'
        },
        component: () => import('@m/views/dataManagement/index.vue'),
        children: [
            {
                path: 'dataEntity',
                name: 'aopAssetcenterDataEntity',
                meta: {
                    title: '数据实体'
                },
                component: () => import('@m/views/dataManagement/dataEntity/index.vue')
            },
            {
                path: 'dataDistribution',
                name: 'aopAssetcenterDataDistribution',
                meta: {
                    title: '数据分布'
                },
                component: () => import('@m/views/dataManagement/dataDistribution/index.vue')
            },
            {
                path: 'dataFlow',
                name: 'aopAssetcenterDataFlow',
                meta: {
                    title: '数据流转'
                },
                component: () => import('@m/views/dataManagement/dataFlow/index.vue')
            }
        ]
    },

    // 应用架构
    {
        path: 'applicationArchitecture',
        name: 'aopAssetcenterApplicationArchitecture',
        meta: {
            title: '应用架构'
        },
        component: () => import('@m/views/applicationArchitecture')
    },

    // 技术架构
    {
        path: 'technologyArchitecture',
        name: 'aopAssetcenterTechnologyArchitecture',
        meta: {
            title: '技术架构'
        },
        component: () => import('@m/views/technologyArchitecture')
    },

    // 部署架构
    {
        path: 'deploymentArchitecture',
        name: 'aopAssetcenterDeploymentArchitecture',
        meta: {
            title: '部署架构'
        },
        component: () => import('@m/views/deploymentArchitecture')
    }
]
