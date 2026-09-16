export const PROCESS_LEVELS = [
    { key: 'biz-domain', label: '业务领域', color: '#2B5FD7' },
    { key: 'value-stream', label: '价值流', color: '#4A90D9' },
    { key: 'key-business', label: '关键业务', color: '#5BA3E6' },
    { key: 'process-segment', label: '流程段', color: '#7EC8E3' }
]

export const PROCESS_TYPE_META = {
    'biz-domain': { label: '业务领域', icon: '业务领域', color: '#2B5FD7' },
    'value-stream': { label: '价值流', icon: '价值流', color: '#4A90D9' },
    'key-business': { label: '关键业务', icon: '关键业务', color: '#5BA3E6' },
    'process-segment': { label: '流程段', icon: '流程段', color: '#7EC8E3' },
    interface: { label: '接口', icon: '接口', color: '#667eea' },
    service: { label: '服务', icon: '服务', color: '#56a973' },
    'backend-rule': { label: '后端规则', icon: '规则', color: '#86b98f' }
}

export const BUSINESS_DOMAIN_DATA = [
    {
        name: '业务支撑',
        count: 12,
        items: ['演示领域', '机构管理', '人员管理', '综合办公', '非金融资产管理', '采购管理', '档案管理', '法律事务', '科技管理', '数据管理', '安全保障', '运营管理']
    },
    {
        name: '风险合规管理',
        count: 14,
        items: ['全面风险管理', '信用风险管理', '市场风险管理', '操作风险管理', '流动性风险管理', '集中度风险管理', '银行账户利率风险管理', '其他专业风险管理', '内控合规管理', '业务连续性管理', '监督审计', '反洗钱管理', '合规检查', '风险计量']
    },
    {
        name: '报告与决策',
        count: 8,
        items: ['定价管理', '资产负债结构管理', '资本管理', '预算管理', '管理会计', '会计核算', '信息披露', '投资者关系管理']
    },
    {
        name: '运营支撑',
        count: 3,
        items: ['清算管理', '现金与重要物品管理', '集中运营管理']
    },
    {
        name: '客户与市场营销管理',
        count: 9,
        items: ['个人客户管理', '公司客户管理', '同业客户管理', '公司营销管理', '个人营销管理', '客户服务与体验管理', '人工及物理渠道管理', '电子及远程渠道管理', '客户洞察']
    },
    {
        name: '产品与服务',
        count: 26,
        items: ['产品管理', '公司存款', '个人存款', '财富管理', '公司信贷', '普惠小微贷款', '消费信贷', '信用卡', '收单', '代收付', '对公支付结算', '资金监管', '机构结算', '国际结算', '存管与托管', '债券承分销', '贸易融资', '票据业务', '金融市场交易', '同业投融资业务', '资管业务', '贵金属交易', '代理业务', '数字人民币', '投资理财', '养老金业务']
    }
]

const node = (id, type, name, desc, children = []) => ({
    id,
    type,
    name,
    desc,
    children
})

const makeExtraBusiness = (code, name, desc) => node(
    `business-${code}`,
    'key-business',
    name,
    desc,
    [
        node(`segment-${code}-1`, 'process-segment', '业务准备', '完成数据采集与前置校验', [
            node(`interface-${code}-1`, 'interface', `${name}申请接口`, `接收并校验${name}申请`, [
                node(`service-${code}-1`, 'service', `${name}编排服务`, '编排核心处理步骤', [
                    node(`rule-${code}-1`, 'backend-rule', `${name}准入规则`, '判定业务准入与处理路径')
                ])
            ])
        ]),
        node(`segment-${code}-2`, 'process-segment', '结果确认', '生成结果并完成通知', [
            node(`interface-${code}-2`, 'interface', `${name}结果接口`, '返回业务处理结果', [
                node(`service-${code}-2`, 'service', `${name}结果服务`, '完成状态登记与消息通知', [
                    node(`rule-${code}-2`, 'backend-rule', `${name}通知规则`, '按业务结果选择通知渠道')
                ])
            ])
        ])
    ]
)

export const makeProcessBranch = (code, domainName, streamName, businessName) => {
    const branch = node(`domain-${code}`, 'biz-domain', domainName, `${domainName}的端到端业务流程管理`, [
        node(`stream-${code}`, 'value-stream', streamName, '从客户诉求到价值交付的完整链路', [
            node(`business-${code}`, 'key-business', businessName, '价值流中的核心业务活动', [
                node(`segment-${code}-1`, 'process-segment', '申请受理', '接收、校验并建立业务申请', [
                    node(`interface-${code}-1`, 'interface', '受理申请接口', '接收前端或渠道提交的业务申请', [
                        node(`service-${code}-1`, 'service', '申请受理服务', '编排申请登记、资料校验与状态流转', [
                            node(`rule-${code}-1`, 'backend-rule', '客户准入规则', '根据客户等级、风险标签与业务参数判定准入'),
                            node(`rule-${code}-2`, 'backend-rule', '资料完整性规则', '校验必填资料、格式与有效期')
                        ])
                    ])
                ]),
                node(`segment-${code}-2`, 'process-segment', '业务审核', '执行业务审核、风险评估与结果确认', [
                    node(`interface-${code}-2`, 'interface', '审核结果接口', '返回审核结果与风险评级', [
                        node(`service-${code}-2`, 'service', '风险评估服务', '聚合风险特征并输出评估结果', [
                            node(`rule-${code}-3`, 'backend-rule', '风险阈值规则', '依照产品和客户分层适用差异化阈值')
                        ])
                    ])
                ]),
                node(`segment-${code}-3`, 'process-segment', '结果交付', '完成结果登记、通知与档案留存', [
                    node(`interface-${code}-3`, 'interface', '结果通知接口', '向渠道和客户发送处理结果', [
                        node(`service-${code}-3`, 'service', '结果交付服务', '登记最终结果并触发消息通知', [
                            node(`rule-${code}-4`, 'backend-rule', '通知渠道选择规则', '根据客户偏好与消息等级选择通知渠道')
                        ])
                    ])
                ])
            ]),
            makeExtraBusiness(`${code}-extra-1`, '资料审核', '审核客户提交资料的完整性与有效性'),
            makeExtraBusiness(`${code}-extra-2`, '风险评估', '综合多维特征生成风险评级与建议'),
            makeExtraBusiness(`${code}-extra-3`, '结果通知', '将业务结果准确交付给客户与渠道'),
            makeExtraBusiness(`${code}-extra-4`, '档案归集', '归集业务过程资料并形成可追溯档案')
        ]),
        node(`stream-${code}-2`, 'value-stream', `${domainName}运营优化价值流`, '运营监测与持续优化链路')
    ])

    return branch
}

export const PROCESS_TREE_DATA = [
    makeProcessBranch('demo', '演示领域', '客户申请交付价值流', '客户申请处理'),
    makeProcessBranch('org', '机构管理', '机构全生命周期价值流', '机构设立与变更'),
    makeProcessBranch('customer', '个人客户管理', '个人客户服务价值流', '客户建档与维护')
]
