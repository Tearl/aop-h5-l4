export const ARCHITECTURE_COLUMNS = [
    {
        key: 'business',
        title: '业务架构',
        models: [
            {
                name: '产品模型',
                routeName: 'aopAssetcenterProductModel',
                chain: [
                    { id: 'business.product.line', label: '产品线' },
                    { id: 'business.product.group', label: '产品组' },
                    { id: 'business.product.catalog', label: '产品目录' },
                    { id: 'business.product.base', label: '基础产品' },
                    { id: 'business.product.saleable', label: '可售产品' },
                    { id: 'business.product.component', label: '产品组件' }
                ]
            },
            {
                name: '流程模型',
                routeName: 'aopAssetcenterProcessModel',
                chain: [
                    { id: 'business.process.domain', label: '业务领域' },
                    { id: 'business.process.valueStream', label: '价值流' },
                    { id: 'business.process.keyBusiness', label: '关键业务' },
                    { id: 'business.process.segment', label: '流程段' }
                ]
            },
            {
                name: '能力模型',
                routeName: 'aopAssetcenterCapabilityModel',
                chain: [
                    { id: 'business.capability.domain', label: '业务能力域' },
                    { id: 'business.capability.group', label: '业务能力组' },
                    { id: 'business.capability.capability', label: '业务能力' },
                    { id: 'business.capability.function', label: '业务功能' },
                    { id: 'business.capability.rule', label: '业务规则' }
                ]
            }
        ]
    },
    {
        key: 'data',
        title: '数据架构',
        models: [
            {
                name: '实体模型',
                routeName: 'aopAssetcenterEntityModel',
                chain: [
                    { id: 'data.subjectDomain', label: '数据主题域' },
                    { id: 'data.entity', label: '数据实体（聚合根）' },
                    { id: 'data.attribute', label: '数据属性' },
                    { id: 'data.standard', label: '数据标准' }
                ]
            }
        ]
    },
    {
        key: 'application',
        title: '应用架构',
        models: [
            {
                name: '应用模型',
                routeName: 'aopAssetcenterApplicationArchitecture',
                chain: [
                    { id: 'application.line', label: '业务系统' },
                    { id: 'application.application', label: '应用' },
                    { id: 'application.module', label: '模块' },
                    { id: 'application.service', label: '服务' },
                    { id: 'application.interface', label: '接口' }
                ]
            }
        ]
    },
    {
        key: 'deployment',
        title: '部署架构',
        models: [
            {
                name: '部署模型',
                routeName: 'aopAssetcenterDeploymentArchitecture',
                chain: [
                    { id: 'deployment.dataCenter', label: '数据中心' },
                    { id: 'deployment.networkZone', label: '网络分区' },
                    { id: 'deployment.environment', label: '环境' },
                    { id: 'deployment.cluster', label: '集群' },
                    { id: 'deployment.node', label: '节点' }
                ]
            }
        ]
    },
    {
        key: 'technology',
        title: '技术架构',
        models: [
            {
                name: '技术模型',
                routeName: 'aopAssetcenterTechnologyArchitecture',
                chain: [
                    { id: 'technology.domain', label: '技术域' },
                    { id: 'technology.layer', label: '技术层' },
                    { id: 'technology.stack', label: '技术栈' },
                    { id: 'technology.component', label: '技术组件' },
                    { id: 'technology.logicalDevice', label: '逻辑设备' },
                    { id: 'technology.physicalDevice', label: '物理设备' }
                ]
            }
        ]
    }
]

export const ARCHITECTURE_RELATIONS = [
    { id: 'process-capability', sourceId: 'business.process.segment', targetId: 'business.capability.function', type: 'usedby', name: 'Used by（使用）', description: '流程段使用业务功能' },
    { id: 'application-capability', sourceId: 'application.application', targetId: 'business.capability.function', type: 'realization', name: 'Realization（实现）', description: '应用实现业务功能' },
    { id: 'deployment-application', sourceId: 'deployment.cluster', targetId: 'application.application', type: 'assignment', name: 'Assignment（承载）', description: '集群承载应用' },
    { id: 'technology-application', sourceId: 'technology.stack', targetId: 'application.application', type: 'realization', name: 'Realization（实现）', description: '技术栈实现应用' },
    { id: 'application-data', sourceId: 'application.application', targetId: 'data.entity', type: 'access', name: 'Access（访问）', description: '应用访问数据实体' },
    { id: 'product-process', sourceId: 'business.product.component', targetId: 'business.process.segment', type: 'triggering', name: 'Triggering（触发）', description: '产品组件触发业务流程' },
    { id: 'node-cluster', sourceId: 'deployment.node', targetId: 'deployment.cluster', type: 'composition', name: 'Composition（组合）', description: '节点组成集群' },
    { id: 'application-technology-component', sourceId: 'application.application', targetId: 'technology.component', type: 'usedby', name: 'Used by（使用）', description: '应用使用技术组件' },
    { id: 'logical-device-application', sourceId: 'technology.logicalDevice', targetId: 'application.application', type: 'assignment', name: 'Assignment（承载）', description: '逻辑设备承载应用' }
]
