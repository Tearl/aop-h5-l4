export const APP_VERSIONS = [
    { prefix: 'FM平台', suffix: '升级版', version: '4.2.0', full: 'FM平台升级版4.2.0' },
    { prefix: '企业网银', suffix: '标准版', version: '2.0.0', full: '企业网银标准版2.0.0' },
    { prefix: '企业网银', suffix: '标准版', version: '1.0.0', full: '企业网银标准版1.0.0' },
    { prefix: '企业手机', suffix: '标准版', version: '1.0.0', full: '企业手机标准版1.0.0' },
    { prefix: '个人手机银行', suffix: '标准版', version: '1.0.0', full: '个人手机银行标准版1.0.0' }
]

export const APP_VERSION_DATA = {
    'FM平台升级版4.2.0': {
        appName: 'FM平台升级版',
        appCode: 'FM-PLATFORM',
        appType: '平台应用',
        tenant: '总行信息科技部',
        owner: '张明 / 李华',
        desc: '面向全行的金融管理平台，统一提供产品、功能、接口、服务资产的盘点与管理能力，支撑业务中台与前台应用的快速组装。',
        version: '4.2.0',
        status: '已发布',
        releaseDate: '2025-03-15',
        versionDesc: '本次版本新增应用全景与架构管理能力，完善资产盘点与产品树模型，优化服务编排性能。',
        changelog: '1. 新增应用全景页面；2. 新增架构管理（业务/应用/技术/部署架构）；3. 服务编排性能提升40%；4. 修复12个已知缺陷。'
    },
    '企业网银标准版2.0.0': {
        appName: '企业网银标准版',
        appCode: 'CBS-CORP',
        appType: '渠道应用',
        tenant: '公司业务部',
        owner: '王芳 / 陈强',
        desc: '面向企业客户的网上银行标准版，提供账户管理、转账汇款、票据、国际结算等对公金融服务。',
        version: '2.0.0',
        status: '已发布',
        releaseDate: '2024-11-20',
        versionDesc: '重构前端工程，升级为微前端架构，新增智能审批流与风控规则引擎。',
        changelog: '1. 前端微前端化改造；2. 新增智能审批流；3. 接入风控规则引擎；4. 优化转账性能。'
    },
    '企业网银标准版1.0.0': {
        appName: '企业网银标准版',
        appCode: 'CBS-CORP',
        appType: '渠道应用',
        tenant: '公司业务部',
        owner: '王芳',
        desc: '面向企业客户的网上银行标准版首版，提供基础对公金融服务。',
        version: '1.0.0',
        status: '已停用',
        releaseDate: '2023-06-10',
        versionDesc: '企业网银标准版首版发布，提供账户查询、转账汇款、代发工资等基础功能。',
        changelog: '1. 首版发布；2. 提供账户、转账、代发工资功能；3. 完成与核心系统对接。'
    },
    '企业手机标准版1.0.0': {
        appName: '企业手机标准版',
        appCode: 'CBS-MOBILE',
        appType: '渠道应用',
        tenant: '公司业务部',
        owner: '刘伟 / 赵静',
        desc: '面向企业客户的手机银行标准版，提供移动端对公金融服务，支持审批、授权、查询等场景。',
        version: '1.0.0',
        status: '已发布',
        releaseDate: '2024-08-05',
        versionDesc: '企业手机银行首版，覆盖高频对公场景，支持指纹/人脸登录与审批。',
        changelog: '1. 首版发布；2. 支持生物识别登录；3. 提供移动审批与授权；4. 账户与转账基础功能。'
    },
    '个人手机银行标准版1.0.0': {
        appName: '个人手机银行标准版',
        appCode: 'PBS-MOBILE',
        appType: '渠道应用',
        tenant: '零售业务部',
        owner: '孙磊 / 周婷',
        desc: '面向个人客户的手机银行标准版，提供账户、理财、贷款、生活缴费等零售金融服务。',
        version: '1.0.0',
        status: '已发布',
        releaseDate: '2024-05-18',
        versionDesc: '个人手机银行标准版首版，覆盖零售高频场景，集成智能客服与营销活动中心。',
        changelog: '1. 首版发布；2. 账户、理财、贷款模块；3. 集成智能客服；4. 营销活动中心。'
    }
}

export const MAIN_TABS = [
    { key: 'app-info', label: '应用信息' },
    { key: 'biz-arch', label: '业务架构' },
    { key: 'app-arch', label: '应用架构' },
    { key: 'tech-arch', label: '技术架构' },
    { key: 'deploy-arch', label: '部署架构' },
    { key: 'detail-design', label: '文档预览' }
]

export const SUB_TABS = {
    'biz-arch': [
        { key: 'biz-capability', label: '业务能力全景图' },
        { key: 'biz-domain', label: '业务域划分及关系' },
        { key: 'biz-flow', label: '核心业务流程概览' },
        { key: 'biz-constraint', label: '域间依赖关系约束原则' }
    ],
    'app-arch': [
        { key: 'app-arch-diagram', label: '应用架构图' },
        { key: 'app-engineering', label: '工程职责划分' },
        { key: 'app-mapping', label: '功能→工程映射' },
        { key: 'app-call-relation', label: '服务调用关系' },
        { key: 'app-structure', label: '工程结构说明' }
    ],
    'tech-arch': [
        { key: 'tech-diagram', label: '技术架构图' },
        { key: 'tech-chain', label: '调用链路' },
        { key: 'tech-components', label: '技术组件清单' },
        { key: 'tech-software', label: '软件清单' }
    ],
    'deploy-arch': [
        { key: 'deploy-diagram', label: '部署架构图' },
        { key: 'deploy-config', label: '部署配置' },
        { key: 'deploy-env', label: '环境规划' },
        { key: 'deploy-constraint', label: '部署边界约束原则' }
    ]
}

const domainCards = [
    { name: '工程管理域', desc: '方案启动、工序/模板/岗位/SOW/方案全生命周期', items: ['工序管理（定义/模板/分组）', '岗位管理（基准成本/执行配置）', 'SOW管理（工作说明书管理）', '方案管理（FM模式/传统模式）'].map(name => ({ name })), tone: 'blue' },
    { name: '业务设计域', desc: '需求分析、业务规划、业务规则定义', items: ['需求管理（需求池/评审）', '业务规划（业务分析产出）', '业务规则（校验规则/业务约束）'].map(name => ({ name })), tone: 'green' },
    { name: '技术设计域', desc: 'L1-L5设计链路及END端交付', items: ['L1总体技术设计', 'L2需求分析与业务设计', 'L3原型设计', 'L4接口设计', 'L5服务设计', 'END端前端开发'].map(name => ({ name })), tone: 'purple' },
    { name: '公共支撑域', desc: '跨业务通用能力', items: ['文件服务', '审批管控', '销售授权', '公共运营'].map(name => ({ name })), tone: 'cyan' },
    { name: '测试域', desc: '用例设计与测试执行', items: ['用例设计（功能/接口/UI）', '测试执行（计划/执行/报告）'].map(name => ({ name })), tone: 'orange' },
    { name: '部署域', desc: '流水线与部署全过程', items: ['流水线编排', '部署执行', '部署记录'].map(name => ({ name })), tone: 'red' },
    { name: '用户域', desc: '用户、角色、部门及认证授权', items: ['用户管理', '角色权限', '部门组织'].map(name => ({ name })), tone: 'gray' }
]

const techNode = (name, layer, duty, tone) => ({
    name,
    tone,
    detail: { name, layer, duty }
})

export const ARCH_CONTENT = {
    'biz-capability': {
        type: 'capability-tree',
        description: 'FM平台业务能力按照“模块分类—模块—功能”自上而下展示：FM平台为模块分类，各业务域为模块，域内能力项为功能。',
        root: 'FM平台',
        modules: domainCards
    },
    'biz-domain': {
        type: 'tables',
        sections: [
            {
                columns: [
                    { prop: 'domain', label: '业务域' }, { prop: 'duty', label: '核心职责' },
                    { prop: 'type', label: '域类型' }, { prop: 'team', label: '团队归属' }
                ],
                rows: [
                    { domain: '工程管理域', duty: '方案启动、工序/模板/岗位/SOW/方案全生命周期', type: '核心业务域', team: '设计域组' },
                    { domain: '业务设计域', duty: '需求分析、业务规划、业务规则定义', type: '核心业务域', team: '设计域组' },
                    { domain: '技术设计域', duty: 'L1-L5设计链路、END端', type: '核心业务域', team: '设计域组' },
                    { domain: '公共支撑域', duty: '文件/审批/销售授权/公共运营', type: '支撑业务域', team: '平台组' },
                    { domain: '测试域', duty: '用例设计、测试执行', type: '支撑业务域', team: '测试组' },
                    { domain: '部署域', duty: '流水线/部署/记录', type: '支撑业务域', team: 'DevOps组' },
                    { domain: '用户域', duty: '用户/角色/部门/认证授权', type: '基础支撑域', team: '用户域组' }
                ]
            },
            {
                title: '域间依赖关系',
                columns: [
                    { prop: 'source', label: '上游域' }, { prop: 'target', label: '下游域' },
                    { prop: 'description', label: '依赖说明' }
                ],
                rows: [
                    { source: '工程管理域', target: '技术设计域', description: '方案确定后启动技术设计' },
                    { source: '业务设计域', target: '技术设计域', description: '业务分析完成后进入技术设计' },
                    { source: '技术设计域', target: '部署域', description: '设计完成后触发部署编排' },
                    { source: '公共支撑域', target: '所有业务域', description: '提供文件/审批/授权等通用能力' },
                    { source: '用户域', target: '所有业务域', description: '鉴权授权，操作需用户身份' }
                ]
            }
        ]
    },
    'biz-flow': {
        type: 'flows',
        flows: [
            {
                title: '方案设计链路', tag: '核心链路', tagTone: 'blue',
                rows: [[
                    { name: '工序/模板/岗位配置', tone: 'blue' }, { name: 'SOW导入', tone: 'blue' },
                    { name: '方案生成', desc: 'FM模式/传统模式', tone: 'purple' }, { name: '业务规则定义', tone: 'blue' },
                    { name: 'L1总体技术设计', tone: 'blue' }, { name: 'L2需求分析', tone: 'blue' },
                    { name: 'L3原型设计', tone: 'blue' }, { name: 'L4接口架构设计', tone: 'blue' },
                    { name: 'L5服务设计', tone: 'blue' }, { name: 'END端前端开发', tone: 'blue' },
                    { name: '部署编排', tone: 'blue' }, { name: '流水线执行', tone: 'blue' },
                    { name: '部署记录', tone: 'blue' }
                ]]
            },
            {
                title: '测试链路', tag: '测试', tagTone: 'green',
                rows: [[
                    { name: '用例设计', desc: '功能/接口/UI', tone: 'green' }, { name: '测试计划', tone: 'blue' },
                    { name: '测试执行', tone: 'blue' }, { name: '测试报告', tone: 'blue' }
                ]]
            },
            {
                title: '通用流程', tag: '通用', tagTone: 'cyan',
                rows: [[
                    { name: '文件上传/下载', tone: 'cyan' }, { name: '审批流程（可选）', tone: 'blue' },
                    { name: '销售授权（可选）', tone: 'blue' }
                ]]
            }
        ]
    },
    'biz-constraint': {
        type: 'table',
        description: '业务域边界约束规则，防止域间职责混乱和循环依赖。',
        columns: [
            { prop: 'name', label: '约束类型' }, { prop: 'rule', label: '约束规则' }, { prop: 'desc', label: '说明' }
        ],
        rows: [
            { name: '域际流向原则', rule: '业务流向单向，但服务调用采用网状模式', desc: '工程管理→技术设计→部署；服务间允许按需调用' },
            { name: '边界内聚原则', rule: '核心业务域可直接调用；业务域不直接调用用户域', desc: '用户域由aop-web前置层统一转发' },
            { name: '公共依赖原则', rule: '通用能力统一由aop-service-common提供', desc: '所有业务域通过Feign调用' },
            { name: '认证穿透原则', rule: 'aop-web统一完成JWT校验与Session构建', desc: '服务间采用AppKey+Secret认证' },
            { name: '变更隔离原则', rule: '跨域调用必须使用正式Feign接口', desc: '禁止引用其他域内部实现类' }
        ]
    },
    'app-arch-diagram': {
        type: 'layers',
        layers: [
            { title: '前置层', tag: '前置', nodes: [{ name: 'aop-web', desc: '前端聚合 / 路由编排 / 少量业务编排 / 认证鉴权', tone: 'blue' }] },
            { title: '后台服务域', tag: '服务', nodes: ['aop-service-design', 'finmall-user-service', 'aop-service-common', 'aop-service-test', 'aop-service-devops'].map(name => ({ name, tone: 'purple' })) },
            { title: '公共库', tag: '公共', nodes: [{ name: 'aop-public-module', desc: '工具类 / 常量枚举 / 公共DTO / Prompt', tone: 'gray' }] }
        ]
    },
    'app-engineering': {
        type: 'table',
        columns: [
            { prop: 'name', label: '工程名称' }, { prop: 'type', label: '工程类型' },
            { prop: 'duty', label: '核心职责' }, { prop: 'team', label: '团队归属' }
        ],
        rows: [
            { name: 'aop-web', type: '前置层', duty: '前端页面聚合、路由、状态管理、少量编排', team: '前端组' },
            { name: 'aop-service-design', type: '后台服务', duty: '业务规划、蓝图、L1-L5设计链路、END端', team: '设计域组' },
            { name: 'aop-service-common', type: '后台服务', duty: '文件服务、审批管控、销售授权、公共运营', team: '平台组' },
            { name: 'aop-service-devops', type: '后台服务', duty: '前端/接口/服务统一部署、流水线', team: 'DevOps组' },
            { name: 'aop-service-test', type: '后台服务', duty: '功能用例、接口用例、UI用例、测试执行', team: '测试组' },
            { name: 'finmall-user-service', type: '后台服务', duty: '用户管理、认证授权', team: '用户域组' },
            { name: 'aop-public-module', type: '公共库', duty: '工具类、常量、枚举、公共DTO；不独立部署', team: '架构组' }
        ]
    },
    'app-mapping': {
        type: 'table',
        columns: [
            { prop: 'module', label: '一级模块' }, { prop: 'feature', label: '功能点' },
            { prop: 'front', label: '前置层' }, { prop: 'backend', label: '后台服务' }
        ],
        rows: [
            { module: '工程管理', feature: '工序管理/工序模板/岗位管理/SOW管理/方案管理', front: 'aop-web', backend: 'aop-service-design' },
            { module: '业务模型', feature: '需求池/业务规划/业务分析', front: 'aop-web', backend: 'aop-service-design' },
            { module: '架构设计', feature: '总体技术设计/版本管理', front: 'aop-web', backend: 'aop-service-design' },
            { module: 'UI设计', feature: '产品管理/总体UI/功能UI', front: 'aop-web', backend: 'aop-service-design' },
            { module: '中台运营', feature: '业务对象/数据字典/服务管理', front: 'aop-web', backend: 'aop-service-common' },
            { module: '开发工作台', feature: '任务分配/系统开发/智能开发', front: 'aop-web', backend: 'aop-service-design' },
            { module: '测试工作台', feature: '测试管理/测试设计/执行测试', front: 'aop-web', backend: 'aop-service-test' },
            { module: '部署工作台', feature: '部署工作台/部署记录', front: 'aop-web', backend: 'aop-service-devops' },
            { module: '设计态网关', feature: 'S5服务列表/用户管理', front: 'aop-web', backend: 'aop-service-design' },
            { module: '资产库', feature: '功能资产/模块树', front: 'aop-web', backend: 'aop-service-design' },
            { module: '平台运营', feature: '公告/文档/学习中心', front: 'aop-web', backend: 'aop-service-common' },
            { module: '底座运营', feature: '前端配置/铺底/平台配置', front: 'aop-web', backend: 'aop-service-common' },
            { module: '系统管理', feature: '用户/角色/部门/菜单/日志', front: 'aop-web', backend: 'finmall-user-service' },
            { module: '工具管理', feature: '前端工具/后端工具/服务工具', front: 'aop-web', backend: 'aop-service-design' }
        ]
    },
    'app-call-relation': {
        type: 'table',
        columns: [
            { prop: 'source', label: '调用方' }, { prop: 'target', label: '被调用方' },
            { prop: 'type', label: '调用类型' }, { prop: 'desc', label: '说明' }
        ],
        rows: [
            { source: 'aop-web（前置）', target: 'aop-service-design', type: 'HTTP/Feign', desc: '设计域业务请求' },
            { source: 'aop-web（前置）', target: 'aop-service-common', type: 'HTTP/Feign', desc: '公共域业务请求' },
            { source: 'aop-web（前置）', target: 'aop-service-devops', type: 'HTTP/Feign', desc: '部署域业务请求' },
            { source: 'aop-web（前置）', target: 'aop-service-test', type: 'HTTP/Feign', desc: '测试域业务请求' },
            { source: 'aop-web（前置）', target: 'finmall-user-service', type: 'HTTP/Feign', desc: '用户域业务请求' },
            { source: 'aop-service-design', target: 'aop-service-devops', type: 'Feign同步', desc: '设计完成后触发部署编排' },
            { source: 'aop-service-devops', target: 'aop-service-common', type: 'Feign同步', desc: '部署记录写入文件服务' },
            { source: 'aop-service-common', target: 'aop-service-design', type: 'Feign同步', desc: '公共服务查询设计元数据' },
            { source: 'aop-service-common', target: 'finmall-user-service', type: 'Feign同步', desc: '公共服务鉴权校验' }
        ]
    },
    'app-structure': {
        type: 'table',
        columns: [
            { prop: 'name', label: '工程名称' }, { prop: 'structure', label: '工程结构' },
            { prop: 'modules', label: '模块划分' }, { prop: 'duty', label: '核心职责' }
        ],
        rows: [
            { name: 'aop-service-design', structure: '聚合工程', modules: 'blueprint / L1 / L2 / L3 / L4 / L5 / END / boot', duty: '按设计阶段划分，阶段独立演进' },
            { name: 'aop-service-common', structure: '聚合工程', modules: 'file / platform / sale / 公共运营 / boot', duty: '按业务域划分，域独立闭环' },
            { name: 'aop-service-test', structure: '单工程DDD', modules: 'service / data / exec / testexport-import', duty: '业务内聚，流量可控' },
            { name: 'aop-service-devops', structure: '单工程DDD', modules: 'pipeline / deploy / record / trigger', duty: '业务链路紧密' },
            { name: 'finmall-user-service', structure: '单工程DDD', modules: 'user / role / dept / menu / auth', duty: '多对多关系，不宜拆分' }
        ]
    },
    'tech-diagram': {
        type: 'layers',
        layers: [
            { title: '接入层', tag: '接入', nodes: [techNode('Web前端（PC）', '接入层', '提供PC端页面交互，采用Vue/React', 'blue')] },
            { title: '网关层', tag: '网关', nodes: [techNode('Nginx', '网关层', '反向代理、负载均衡、SSL终止、静态资源与限流', 'cyan')] },
            { title: '前置层', tag: '聚合', nodes: [techNode('aop-web', '前置层', '前端聚合、路由编排与认证鉴权', 'green')] },
            {
                title: '服务层（微服务）', tag: '服务',
                nodes: [
                    techNode('aop-service-design', '服务层', '承载业务规划、蓝图及L1-L5设计链路', 'purple'),
                    techNode('aop-service-devops', '服务层', '承载流水线编排、部署执行与部署记录', 'purple'),
                    techNode('aop-service-common', '服务层', '提供文件、审批、授权和公共运营能力', 'purple'),
                    techNode('aop-service-test', '服务层', '承载用例设计、测试执行与报告', 'purple'),
                    techNode('finmall-user-service', '服务层', '提供用户管理与认证授权', 'purple'),
                    techNode('aop-public-module', '服务层', '提供工具类、常量枚举和公共DTO', 'purple')
                ]
            },
            {
                title: '基础设施层', tag: '基础设施',
                nodes: [
                    techNode('MySQL', '基础设施层', '提供业务数据存储', 'orange'),
                    techNode('Redis', '基础设施层', '提供缓存、会话与分布式锁', 'orange'),
                    techNode('RocketMQ', '基础设施层', '提供异步消息与事件驱动能力', 'orange'),
                    techNode('Nacos', '基础设施层', '提供服务注册与发现', 'orange'),
                    techNode('Apollo', '基础设施层', '配置管理、热更新与灰度发布', 'orange'),
                    techNode('MinIO', '基础设施层', '提供对象与文件存储', 'orange'),
                    techNode('Elasticsearch', '基础设施层', '日志收集、全文检索与查询', 'orange')
                ]
            }
        ]
    },
    'tech-chain': {
        type: 'flows',
        flows: [{
            title: 'FM平台请求调用链路', tag: '端到端链路', tagTone: 'blue',
            rows: [[
                { name: 'Web前端（PC）', tone: 'blue' }, { name: 'Nginx', desc: '反向代理/SSL', tone: 'cyan' },
                { name: 'aop-web', desc: '前置层', tone: 'green' },
                { name: 'design / common / devops / test / user', desc: '按业务请求路由', tone: 'purple' }
            ]]
        }]
    },
    'tech-components': {
        type: 'table',
        columns: [
            { prop: 'type', label: '组件类型' }, { prop: 'name', label: '组件名称' },
            { prop: 'version', label: '版本' }, { prop: 'usage', label: '用途' }
        ],
        rows: [
            { type: '反向代理', name: 'Nginx', version: '1.20+', usage: '反向代理/负载均衡/SSL' },
            { type: '注册中心', name: 'Nacos', version: '2.x', usage: '服务注册/发现' },
            { type: '配置中心', name: 'Apollo', version: '2.0.x', usage: '配置管理、热更新、灰度发布' },
            { type: '缓存', name: 'Redis', version: '6.x', usage: '缓存/会话/分布式锁' },
            { type: '消息队列', name: 'RocketMQ', version: '4.x', usage: '异步消息/事件驱动' },
            { type: '数据库', name: 'MySQL', version: '5.7/8.0', usage: '业务数据存储' },
            { type: '连接池', name: 'Druid', version: '1.2.x', usage: '数据库连接管理' },
            { type: 'ORM框架', name: 'MyBatis', version: '3.5.x', usage: '数据访问层' },
            { type: '分布式协调', name: 'Zookeeper + Curator', version: '3.x', usage: '分布式锁/选举' },
            { type: '对象存储', name: 'MinIO', version: '最新', usage: '文件存储' },
            { type: '日志搜索', name: 'Elasticsearch', version: '7.x', usage: '日志收集/检索' },
            { type: '监控', name: 'Prometheus + Grafana', version: '-', usage: '指标监控/告警' }
        ]
    },
    'tech-software': {
        type: 'table',
        columns: [
            { prop: 'type', label: '软件类别' }, { prop: 'name', label: '软件名称' },
            { prop: 'version', label: '版本' }, { prop: 'deploy', label: '部署方式' }
        ],
        rows: [
            { type: 'JDK', name: 'OpenJDK', version: '1.8/11', deploy: '容器/物理机' },
            { type: '应用容器', name: 'Tomcat/Undertow', version: '内嵌', deploy: '内嵌于Spring Boot' },
            { type: '容器化', name: 'Docker', version: '20.x', deploy: '物理机' },
            { type: '编排', name: 'Kubernetes', version: '1.24+', deploy: 'K8s集群' }
        ]
    },
    'deploy-diagram': {
        type: 'layers',
        description: '部署拓扑严格对应总体设计文档第五章：负载均衡层、前置集群、两个服务节点及独立基础设施节点。',
        layers: [
            { title: '负载均衡层', tag: '入口', nodes: [{ name: 'Nginx / Ingress Controller', tone: 'blue' }] },
            {
                title: '应用集群', tag: 'K8s',
                nodes: [
                    { name: '前置集群：aop-web', desc: '3副本 2C4G', tone: 'purple' },
                    { name: 'K8s-SVC-01', desc: 'design / devops / user', tone: 'purple' },
                    { name: 'K8s-SVC-02', desc: 'test / common', tone: 'purple' }
                ]
            },
            {
                title: '基础设施节点', tag: '独立部署',
                nodes: [
                    { name: 'K8s-INFRA-01', desc: 'Nacos / Apollo / RocketMQ', tone: 'orange' },
                    { name: 'K8s-DB-CACHE', desc: 'MySQL / Redis / MinIO', tone: 'orange' }
                ]
            }
        ]
    },
    'deploy-config': {
        type: 'table',
        columns: [
            { prop: 'project', label: '工程' }, { prop: 'node', label: '部署节点' },
            { prop: 'spec', label: '容器规格' }, { prop: 'count', label: '副本数' }
        ],
        rows: [
            { project: 'aop-web', node: 'K8s-前置-node', spec: '2C4G', count: '3' },
            { project: 'aop-service-design', node: 'K8s-SVC-01', spec: '4C8G', count: '3' },
            { project: 'aop-service-devops', node: 'K8s-SVC-01', spec: '4C8G', count: '2' },
            { project: 'finmall-user-service', node: 'K8s-SVC-01', spec: '2C4G', count: '2' },
            { project: 'aop-service-common', node: 'K8s-SVC-02', spec: '2C4G', count: '2' },
            { project: 'aop-service-test', node: 'K8s-SVC-02', spec: '2C4G', count: '2' },
            { project: 'Nacos', node: 'K8s-INFRA-01', spec: '2C4G', count: '3' },
            { project: 'Apollo', node: 'K8s-INFRA-01', spec: '2C4G', count: '2' },
            { project: 'RocketMQ', node: 'K8s-INFRA-01', spec: '4C8G', count: '2主2从' },
            { project: 'MySQL', node: 'K8s-DB-CACHE', spec: '8C16G', count: '主1从2' },
            { project: 'Redis', node: 'K8s-DB-CACHE', spec: '4C8G', count: '3主3从' },
            { project: 'MinIO', node: 'K8s-DB-CACHE', spec: '2C4G', count: '3' }
        ]
    },
    'deploy-env': {
        type: 'table',
        columns: [
            { prop: 'env', label: '环境' }, { prop: 'usage', label: '用途' },
            { prop: 'scope', label: '部署范围' }, { prop: 'data', label: '数据策略' }
        ],
        rows: [
            { env: 'DEV', usage: '开发联调', scope: '单副本', data: 'mock数据' },
            { env: 'SIT', usage: '集成测试', scope: '全量部署', data: '测试数据' },
            { env: 'UAT', usage: '用户验收', scope: '全量部署', data: '生产镜像数据' },
            { env: 'PROD', usage: '生产环境', scope: '全量高可用', data: '生产数据，定期备份' }
        ]
    },
    'deploy-constraint': {
        type: 'table',
        description: '部署节点划分约束规则，保证扩展性和可维护性。',
        columns: [
            { prop: 'name', label: '约束原则' }, { prop: 'rule', label: '约束规则' }, { prop: 'desc', label: '说明' }
        ],
        rows: [
            { name: '隔离部署原则', rule: '不同业务域的服务禁止混部在同一节点', desc: '设计域与公共域必须分离部署' },
            { name: '高可用原则', rule: '核心服务必须高可用部署', desc: '副本数≥2，跨节点分布' },
            { name: '规格匹配原则', rule: '服务规格必须与业务负载匹配', desc: '设计域4C8G > 公共域2C4G' },
            { name: '依赖独立原则', rule: 'MySQL/Redis/Nacos等中间件独立部署', desc: '禁止与应用服务混部' },
            { name: '环境隔离原则', rule: 'DEV/SIT/UAT/PROD必须完全隔离', desc: '网络隔离、存储隔离' }
        ]
    }
}
