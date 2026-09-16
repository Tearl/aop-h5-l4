export const ARCHITECTURE_CONFIG = {
    application: {
        title: '应用模型',
        english: 'Application Architecture',
        icon: '应',
        toolbarTitle: '应用架构图',
        initialZoom: 1,
        minZoom: 0.55,
        maxZoom: 1.3,
        levels: [
            { key: 'app-layer', label: '应用层' },
            { key: 'app-domain', label: '应用域' },
            { key: 'app-system', label: '应用系统' },
            { key: 'app-component', label: '应用组件' },
            { key: 'app-service', label: '服务' },
            { key: 'app-interface', label: '接口' }
        ]
    },
    technology: {
        title: '技术模型',
        english: 'Technology Architecture',
        icon: '技',
        toolbarTitle: '技术架构图',
        initialZoom: 0.9,
        minZoom: 0.55,
        maxZoom: 1.5,
        levels: [
            { key: 'layer', label: '技术层' },
            { key: 'domain', label: '技术域' },
            { key: 'stack', label: '技术栈' },
            { key: 'component', label: '技术组件' },
            { key: 'logical', label: '逻辑设备' },
            { key: 'physical', label: '物理设备' }
        ]
    },
    deployment: {
        title: '部署架构',
        english: 'Deployment Architecture',
        icon: '◈',
        toolbarTitle: '部署架构图',
        initialZoom: 1,
        minZoom: 0.6,
        maxZoom: 1.5,
        levels: [
            { key: 'dc', label: '数据中心' },
            { key: 'zone', label: '网络分区' },
            { key: 'cluster', label: '集群' }
        ]
    }
}

export const APPLICATION_SYSTEMS = [
    { id: 'corp-web', domain: '对公业务', name: '企业网银' },
    { id: 'corp-mobile', domain: '对公业务', name: '企业手机' },
    { id: 'personal-mobile', domain: '零售业务', name: '个人手机' },
    { id: 'personal-web', domain: '零售业务', name: '个人网银' },
    { id: 'wechat-bank', domain: '零售业务', name: '微信银行' }
]

const PERSONAL_MOBILE_CATEGORIES = [
    {
        name: '产品运营层',
        groups: [
            { name: '信用卡', items: ['自动还款设置', '信用卡挂失', '积分查询', '明细查询', '提前还款', '灵活分期', '账单分期', '我的信用卡'] },
            { name: '理财', items: ['风险评估', '我的理财产品', '理财赎回', '理财产品认购'] },
            { name: '基金', items: ['基金撤单', '我的基金', '基金风险评估', '基金产品购买'] },
            { name: '保险', items: ['保险撤单', '保险购买', '保单查询', '保险公司查询'] },
            { name: '手机号转账', items: ['跨行手机转账签约变更', '跨行手机转账', '行内手机号转账'] },
            { name: '个人贷款', items: ['重新还款', '自助还款', '我的贷款'] },
            { name: '赛享存', items: ['交易明细查询', '赛享存支取', '赛享存存入'] },
            { name: '通知存款', items: ['通知存款交易明细查询', '通知存款支取', '活期转通知存款'] },
            { name: '定活互转', items: ['交易明细查询', '定期转活期', '活期转定期'] }
        ]
    },
    {
        name: '基础服务层',
        groups: [
            { name: '账户管理', items: ['账户挂失', '借记卡解挂', '设置默认账户', '账户余额查询', '账户交易明细查询', '账户列表查询'] },
            { name: '转账', items: ['收款人删除', '自动保存收款人', '收款人列表查询', '跨行转账', '行内转账'] }
        ]
    },
    {
        name: '基础支撑层',
        groups: [
            { name: '退出', items: ['退出APP'] },
            { name: '微信银行', items: ['跳转微信'] },
            { name: '消息中心', items: ['消息列表'] }
        ]
    },
    {
        name: '用户渠道层',
        groups: [
            { name: '登录页面', items: ['登录', '记住登录名', '忘记密码', '自助注册'] },
            { name: '扫一扫', items: ['扫码付款', '云闪付'] },
            { name: '轮播广告', items: ['营销广告链接'] }
        ]
    },
    {
        name: '业务管理层',
        groups: [
            { name: '金融助手', items: ['存贷款利率查询', '交易安全锁', '非税缴费', '无卡取款', '预留信息修改', '网点地图', '理财计算器', '回单验证', '银行公告'] },
            { name: '安全中心', items: ['登录密码修改', '数字证书管理', '指纹登录管理', '手势密码管理'] }
        ]
    },
    {
        name: '客户服务层',
        groups: [
            { name: '其他缴费', items: ['缴费回单', '灵活就业社保缴费', '账单分类查询', '生育保险', '失业保险', '更多险种待遇查询', '工伤保险', '养老保险', '医疗保险', '账单统计', '其他缴费', '住宿费'] },
            { name: '证明和权益', items: ['零币兑', '电子发票', '企业年金', '职工个人权益', '居民个人权益', '养老待遇证明'] },
            { name: '补贴查询', items: ['供暖费补贴', '补贴查询全部', '政府补贴', '社会保险补贴'] },
            { name: '智能客服', items: ['智能客服'] },
            { name: '云缴费', items: ['云缴费列表', '云缴费缴费', '云缴费明细'] },
            { name: '生活缴费', items: ['生活缴费电费', '生活缴费固话', '生活缴费百项新', '生活缴费水费'] }
        ]
    }
]

export const APPLICATION_CATEGORIES = {
    'personal-mobile': PERSONAL_MOBILE_CATEGORIES,
    'corp-web': [
        {
            name: '核心应用组件',
            groups: [
                { name: '企业金融', items: ['账户查询', '转账汇款', '代发工资', '电子票据'] },
                { name: '企业管理', items: ['操作员管理', '授权管理', '交易审核'] }
            ]
        }
    ],
    'corp-mobile': [
        {
            name: '核心应用组件',
            groups: [
                { name: '移动办公', items: ['账户总览', '移动审批', '转账复核'] },
                { name: '企业服务', items: ['融资申请', '回单查询', '消息提醒'] }
            ]
        }
    ],
    'personal-web': [
        {
            name: '核心应用组件',
            groups: [
                { name: '个人金融', items: ['账户查询', '转账汇款', '投资理财'] },
                { name: '安全服务', items: ['登录管理', '安全认证', '交易限额'] }
            ]
        }
    ],
    'wechat-bank': [
        {
            name: '核心应用组件',
            groups: [
                { name: '微信服务', items: ['账户提醒', '余额查询', '交易通知'] },
                { name: '便民服务', items: ['网点查询', '在线客服', '产品推荐'] }
            ]
        }
    ]
}

export const TECHNOLOGY_LAYERS = [
    {
        name: '展现层',
        domains: [
            { name: '前端组件库', stacks: ['Webpack', 'swagger-bootstrap-ui', 'OkHttp', 'Axios', 'Teller Web', 'Echarts', 'anti-design-vue', 'element-ui', 'jQuery Mobile'] },
            { name: '前端开发语言', stacks: ['JSP', 'CSS', 'ES6', 'ECMAScript', 'JavaScript', 'HTML', 'H5'] },
            { name: '前端开发框架', stacks: ['React.js', 'Bootstrap', 'angular.js', 'node.js', 'jQuery EasyUI', 'jQuery', 'Vue.js'] }
        ]
    },
    {
        name: '应用支撑层',
        domains: [
            { name: '消息框架', stacks: ['ssa', 'ali yun-sdk-oss', 'IBM-MessageBroker', 'IBM-MQ', 'kafka-clients', 'Kafka', 'ActiveMQ', 'rabbitmq'] },
            { name: '应用服务器', stacks: ['BEASAppServer', 'Jetty', 'tongweb', 'Tomcat', 'WebSphere', 'WebLogic'] },
            { name: '流程引擎', stacks: ['camunda', 'activiti', 'Easyflow', 'eChain'] }
        ]
    },
    {
        name: '基础软件层',
        domains: [
            { name: '文件管理', stacks: ['Gzip'] },
            { name: '数据缓存', stacks: ['memcache'] }
        ]
    },
    {
        name: '管理支撑层',
        domains: [
            { name: '日志管理', stacks: [] },
            { name: '监控管理', stacks: [] },
            { name: '安全权限', stacks: [] },
            { name: '审计管理', stacks: ['batik-all', 'P6Spy', 'aviator', 'Auditd'] },
            { name: '版本管理', stacks: ['SVN', 'Gitlab'] }
        ]
    }
]

export const TECHNOLOGY_STACK_COMPONENTS = {
    Webpack: [
        ['webpack-cli', 'V1.0.0', '命令行构建工具'],
        ['webpack-dev-server', 'V1.0.0', '本地开发与热更新'],
        ['loader体系', 'V1.0.0', '资源编译与转换']
    ],
    Axios: [
        ['axios-core', 'V1.0.0', 'HTTP请求核心'],
        ['interceptors', 'V1.0.0', '请求与响应拦截'],
        ['adapters', 'V1.0.0', '浏览器和Node适配']
    ],
    'Vue.js': [
        ['vue-core', 'V1.0.0', '响应式视图框架'],
        ['vue-router', 'V1.0.0', '前端路由'],
        ['pinia', 'V1.0.0', '状态管理']
    ],
    Kafka: [
        ['kafka-broker', 'V1.0.0', '消息代理服务'],
        ['kafka-clients', 'V1.0.0', '生产者与消费者客户端'],
        ['kafka-streams', 'V1.0.0', '流式处理']
    ],
    Tomcat: [
        ['tomcat-catalina', 'V1.0.0', 'Servlet容器'],
        ['tomcat-coyote', 'V1.0.0', 'HTTP连接器'],
        ['tomcat-jasper', 'V1.0.0', 'JSP引擎']
    ],
    camunda: [
        ['camunda-engine', 'V1.0.0', '流程执行引擎'],
        ['camunda-modeler', 'V1.0.0', '流程建模'],
        ['camunda-tasklist', 'V1.0.0', '人工任务管理']
    ],
    Gitlab: [
        ['GitLab Repository', 'V1.0.0', '代码仓库'],
        ['GitLab CI', 'V1.0.0', '持续集成'],
        ['Merge Request', 'V1.0.0', '代码评审']
    ]
}

export const DEPLOYMENT_LANES = [
    {
        dc: '北京数据中心',
        zone: '移动分区',
        cluster: '手机银行应用集群',
        code: 'BJ-DC-01'
    },
    {
        dc: '杭州数据中心',
        zone: 'WEB分区',
        cluster: '企业网银应用集群',
        code: 'HZ-DC-02'
    },
    {
        dc: '广州数据中心',
        zone: '业务中台分区',
        cluster: '中台服务集群',
        code: 'GZ-DC-03'
    }
]
