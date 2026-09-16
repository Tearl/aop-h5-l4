export const SYSTEMS = [
    {
        key: 'mobile', name: '个人手机银行', id: '0103_MBS', shortName: '个手银', englishName: 'MBS', code: 'MBS',
        domain: '渠道场景层 / 线上渠道', category: '系统', attribute: '交易系统-动账类', audience: '面向客户-对私',
        status: '已投产', level: '重要', launchDate: '2024-09-27',
        overview: '个人手机银行是面向服务的数字化延伸，通过手机端提供全面的金融服务，涵盖查询、转账、理财、保险、基金、存款与贷款等功能。'
    },
    {
        key: 'corp', name: '企业网银', id: '0103_EBS', shortName: '企网银', englishName: 'EBS', code: 'EBS',
        domain: '渠道场景层 / 线上渠道', category: '系统', attribute: '交易系统-动账类', audience: '面向客户-对公',
        status: '已投产', level: '重要', launchDate: '2023-06-30',
        overview: '企业网银面向企业客户提供账户管理、转账汇款、现金管理、融资服务和企业授权等综合金融服务。'
    },
    {
        key: 'enterprise', name: '企业手机银行', id: '0103_EMB', shortName: '企手银', englishName: 'EMB', code: 'EMB',
        domain: '渠道场景层 / 线上渠道', category: '系统', attribute: '交易系统-动账类', audience: '面向客户-对公',
        status: '已投产', level: '重要', launchDate: '2024-03-18',
        overview: '企业手机银行为企业客户提供移动化账户查询、支付结算、审批授权和经营管理服务。'
    }
]

export const MAIN_TABS = [
    { key: 'info', label: '系统信息' },
    { key: 'integration', label: '集成架构' },
    { key: 'tech', label: '技术架构' },
    { key: 'deployment', label: '部署架构' },
    { key: 'functional', label: '功能架构' },
    { key: 'report', label: '系统设计报告' }
]

export const TECH_STACKS = [
    ['应用支撑层', '后端开发框架', 'Spring Boot', 'V2.7.18', 'V3.2.5', '框架', '是', '是'],
    ['应用支撑层', '后端开发框架', 'Spring Cloud', 'V2021.0.9', 'V2023.0.1', '框架', '是', '是'],
    ['基础软件层', '数据库', 'Oracle', 'V19c', '—', '数据库', '否', '否'],
    ['展现层', '前端开发框架', 'Vue.js', 'V2.6.14', 'V3.4.21', '框架', '是', '是'],
    ['展现层', '前端开发框架', 'jQuery', 'V3.6.0', 'V3.7.1', '框架', '是', '是'],
    ['展现层', '前端开发语言', 'HTML', 'V5', '—', '语言', '是', '是'],
    ['展现层', '前端开发语言', 'JavaScript', 'ES6', 'ES2023', '语言', '是', '是'],
    ['展现层', '前端开发语言', 'CSS', 'V3', '—', '语言', '是', '是'],
    ['展现层', '前端组件库', 'Element UI', 'V2.15.14', '—', '组件库', '是', '是'],
    ['展现层', '前端组件库', 'Axios', 'V1.6.8', '—', '组件库', '是', '是'],
    ['展现层', '前端组件库', 'Webpack', 'V5.91.0', '—', '构建工具', '是', '是'],
    ['应用支撑层', '任务调度', 'Spring Cloud Task', 'V2.4.6', '—', '框架', '是', '是'],
    ['应用支撑层', '应用服务器', 'Tomcat', 'V9.0.86', 'V10.1.20', '服务器', '是', '是'],
    ['应用支撑层', '搜索引擎', 'Elasticsearch', 'V7.17.18', 'V8.12.2', '中间件', '是', '否'],
    ['应用支撑层', '文件传输', 'SFTP', 'V3', '—', '协议', '是', '是']
].map((item, index) => ({
    id: index + 1, layer: item[0], domain: item[1], name: item[2], version: item[3], recommended: item[4],
    category: item[5], status: '1', openSource: item[6], innovation: item[7]
}))

export const INTEGRATION_LAYERS = [
    { name: '客户接触层', tone: 'green', protocol: 'http(s)', groups: [{ name: '', items: ['柜面系统', '网银内管', '企业手机', '企业PC'] }] },
    { name: '渠道交互层', tone: 'yellow', protocol: 'rpc', groups: [{ name: '', items: ['网点智能服务平台', '内管前置', '渠道前置'] }] },
    { name: '业务应用层', tone: 'blue', protocol: 'rpc / http', groups: [{ name: '', items: ['转账汇款应用', '现金管理应用', '融资贷款应用', 'B2B应用', '国际应用', '票据应用', '理财应用', '批量应用', '基础应用', '消息应用', '审批应用', '安全应用'] }] },
    { name: '内联网关', groups: [{ name: '', items: ['SOFA API Gateway / 内联网关'] }], protocol: 'http' },
    { name: '业务支撑层', tone: 'orange', groups: [{ name: '', items: ['核心系统', '贷款系统', 'ECIF', '理财系统', '统一支付', '票据系统', '收单系统', '国结系统', 'CRM', '收费平台', '反欺诈', '数据仓库'] }] }
]

export const TECH_LAYERS = [
    { name: '展现层', groups: [{ name: '前端开发语言', items: ['HTML', 'JavaScript', 'CSS'] }, { name: '前端开发框架', items: ['Vue.js', 'jQuery'] }, { name: '前端构建', items: ['Webpack', 'Electron'] }] },
    { name: '应用支撑层', groups: [{ name: '任务调度与流控', items: ['Spring Cloud Task', 'Hystrix'] }, { name: '消息与应用服务器', items: ['RabbitMQ', 'Tomcat'] }, { name: '文件与搜索', items: ['SFTP', 'Elasticsearch'] }] },
    { name: '技术支撑层', groups: [{ name: '开发工具', items: ['Feign'] }, { name: '业务服务', items: ['Spring Boot', 'Spring Cloud'] }, { name: '接口治理', items: ['OpenAPI'] }] },
    { name: '基础软件层', groups: [{ name: '数据库', items: ['Oracle'] }, { name: '数据缓存', items: ['Redis'] }, { name: '容器平台', items: ['Kubernetes'] }] },
    { name: '管理支撑层', groups: [{ name: '日志管理', items: ['ELK', 'Logstash', 'Filebeat'] }, { name: '监控管理', items: ['Prometheus', 'Zipkin'] }, { name: '版本管理', items: ['GitLab'] }] }
]

export const DEPLOYMENT_VIEWS = {
    logical: [
        { name: '接入区', groups: [{ name: '互联网接入', items: ['移动客户端', 'Web客户端', 'F5负载均衡'] }] },
        { name: '应用区', groups: [{ name: '渠道集群', items: ['渠道前置 × 2', '内管前置 × 2'] }, { name: '业务集群', items: ['业务应用 × 4', '审批应用 × 2'] }] },
        { name: '数据区', groups: [{ name: '数据服务', items: ['Oracle RAC', 'Redis集群', '文件存储'] }] }
    ],
    physical: [
        { name: '主数据中心', groups: [{ name: '应用节点', items: ['APP-01', 'APP-02', 'APP-03'] }, { name: '数据节点', items: ['DB-01', 'DB-02'] }] },
        { name: '同城灾备中心', groups: [{ name: '灾备节点', items: ['DR-APP-01', 'DR-DB-01'] }] }
    ],
    network: [
        { name: '互联网区', groups: [{ name: '安全接入', items: ['WAF', '外部防火墙', 'F5'] }] },
        { name: 'DMZ区', groups: [{ name: '渠道服务', items: ['Web服务器', 'API网关'] }] },
        { name: '应用与数据区', groups: [{ name: '内部服务', items: ['应用集群', '数据库集群', '监控平台'] }] }
    ]
}

export const FUNCTION_LAYERS = [
    { name: '用户', groups: [{ name: '', items: ['企业录入员', '企业审批员', '柜员', '授权柜员', '运营人员'] }] },
    { name: '交互设备', groups: [{ name: '', items: ['企业手机', '企业PC', '内管', '柜面'] }] },
    { name: '前置系统', groups: [{ name: '', items: ['渠道前置', '内管前置', '网点智能服务平台'] }] },
    { name: '业务应用', groups: [{ name: '', items: ['B2B支付', '融资贷款', '国际结算', '理财产品', '转账汇款', '现金管理', '票据承兑', '特色应用', '用户管理', '基础应用', '安全应用', '消息应用', '审批应用', '内管应用'] }] },
    { name: '业务支撑能力', groups: [{ name: '', items: ['ESB', '核心系统', '贷款系统', 'ECIF', '理财系统', '统一支付', '票据系统', '收单系统', '国结系统', '员工中心', '影像平台', '电子印章', '账户管理', 'CA中心', 'CRM', '密码平台', '数据仓库', '短信平台', '报表系统', '反欺诈'] }] }
]

export const APP_LAYERS = [
    { name: '前端应用层', groups: [{ name: '个人手机银行门户', items: ['账户总览', '转账汇款', '信用卡', '投资理财', '生活缴费', '安全中心'] }, { name: '个人网银门户', items: ['账户查询', '跨行转账', '基金理财', '贷款服务'] }] },
    { name: '核心应用层', groups: [{ name: '账户核心应用', items: ['客户账户', '账务处理', '余额管理'] }, { name: '支付结算应用', items: ['支付指令', '清算处理', '交易查询'] }, { name: '风险控制应用', items: ['风险识别', '反欺诈'] }] },
    { name: '支撑应用层', groups: [{ name: '消息中心', items: ['站内信', '短信通知', '推送通知'] }, { name: '客户中心', items: ['客户信息', '客户标签', '客户画像'] }] }
]

export const APPLICATION_ARCH_DATA = [
    {
        layer: '前端应用层',
        apps: [
            {
                name: '个人手机银行门户', line: '零售业务',
                modules: [
                    ['账户总览', '账户查询服务', 'GET /api/account/summary'],
                    ['转账汇款', '转账服务', 'POST /api/transfer'],
                    ['信用卡', '信用卡服务', 'GET /api/card/list'],
                    ['投资理财', '理财查询服务', 'GET /api/wealth/products'],
                    ['生活缴费', '缴费服务', 'POST /api/payment'],
                    ['安全中心', '安全认证服务', 'POST /api/auth/verify']
                ]
            },
            {
                name: '个人网银门户', line: '零售业务',
                modules: [
                    ['账户查询', '账户服务', 'GET /api/accounts'],
                    ['跨行转账', '支付服务', 'POST /api/cross-bank'],
                    ['基金理财', '基金服务', 'GET /api/fund'],
                    ['贷款服务', '贷款查询服务', 'GET /api/loan']
                ]
            }
        ]
    },
    {
        layer: '核心应用层',
        apps: [
            { name: '账户核心应用', line: '核心业务', modules: [['客户账户', '开户服务', 'POST /api/account/open'], ['账务处理', '记账服务', 'RPC ledger.post'], ['余额管理', '余额服务', 'GET /api/balance']] },
            { name: '支付结算应用', line: '支付结算', modules: [['支付指令', '支付服务', 'POST /api/pay'], ['清算处理', '清算服务', 'MQ clearing.topic'], ['交易查询', '查询服务', 'GET /api/transaction']] },
            { name: '风险控制应用', line: '风险管理', modules: [['风险识别', '风险评估服务', 'RPC risk.evaluate'], ['反欺诈', '反欺诈服务', 'POST /api/anti-fraud']] }
        ]
    },
    {
        layer: '支撑应用层',
        apps: [
            { name: '消息中心', line: '运营支撑', modules: [['站内信', '消息服务', 'MQ message.topic'], ['短信通知', '短信服务', 'POST /api/sms'], ['推送通知', '推送服务', 'POST /api/push']] },
            { name: '客户中心', line: '客户管理', modules: [['客户信息', '客户查询服务', 'GET /api/customer'], ['客户标签', '标签服务', 'RPC tag.query'], ['客户画像', '画像服务', 'GET /api/profile']] }
        ]
    }
]

export const DATA_FLOW_LAYERS = [
    { name: '数据输入', groups: [{ name: '外部实体', items: ['客户', '柜员'] }] },
    { name: '业务处理', groups: [{ name: '开户流程', items: ['1.0 身份验证', '2.0 开户受理', '3.0 账户建立', '4.0 结果通知'] }] },
    { name: '数据存储', groups: [{ name: '核心数据', items: ['D1 客户主数据', 'D2 账户数据'] }] }
]
