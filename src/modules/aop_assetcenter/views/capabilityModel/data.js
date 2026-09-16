export const CAPABILITY_LEVELS = [
    { key: 'domain', label: '业务能力域', color: '#2B5FD7' },
    { key: 'group', label: '业务能力组', color: '#4A90D9' },
    { key: 'cap', label: '业务能力', color: '#5BA3E6' },
    { key: 'func', label: '业务功能', color: '#7EC8E3' },
    { key: 'rule', label: '业务规则', color: '#A8D8EA' }
]

export const CAPABILITY_MODEL_DATA = {
    name: '能力模型',
    type: 'root',
    children: [
        {
            name: '客户管理',
            type: 'domain',
            children: [
                {
                    name: '个人手机银行基础版1.0.0',
                    type: 'group',
                    children: [
                        {
                            name: '客户开户',
                            type: 'cap',
                            children: [
                                {
                                    name: '身份验证',
                                    type: 'func',
                                    children: [
                                        { name: '证件校验规则', type: 'rule' },
                                        { name: '人脸识别规则', type: 'rule' }
                                    ]
                                },
                                {
                                    name: '信息录入',
                                    type: 'func',
                                    children: [
                                        { name: '必填项校验规则', type: 'rule' },
                                        { name: '格式校验规则', type: 'rule' }
                                    ]
                                }
                            ]
                        },
                        {
                            name: '客户信息维护',
                            type: 'cap',
                            children: [
                                {
                                    name: '信息更新',
                                    type: 'func',
                                    children: [{ name: '变更审批规则', type: 'rule' }]
                                },
                                {
                                    name: '信息查询',
                                    type: 'func',
                                    children: [{ name: '权限校验规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '客户等级管理',
                            type: 'cap',
                            children: [
                                {
                                    name: '等级评定',
                                    type: 'func',
                                    children: [{ name: '评级规则', type: 'rule' }]
                                },
                                {
                                    name: '等级权益',
                                    type: 'func',
                                    children: [{ name: '权益分配规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '企业网银升级版2.0.0',
                    type: 'group',
                    children: [
                        {
                            name: '投诉处理',
                            type: 'cap',
                            children: [
                                {
                                    name: '投诉受理',
                                    type: 'func',
                                    children: [{ name: '受理时效规则', type: 'rule' }]
                                },
                                {
                                    name: '投诉回访',
                                    type: 'func',
                                    children: [{ name: '回访时效规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '客户回馈',
                            type: 'cap',
                            children: [
                                {
                                    name: '积分规则',
                                    type: 'func',
                                    children: [{ name: '积分计算规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: '存款业务',
            type: 'domain',
            children: [
                {
                    name: '个人手机银行增强版1.2.0',
                    type: 'group',
                    children: [
                        {
                            name: '开户',
                            type: 'cap',
                            children: [
                                {
                                    name: '账户建立',
                                    type: 'func',
                                    children: [{ name: '账号生成规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '存取款',
                            type: 'cap',
                            children: [
                                {
                                    name: '交易处理',
                                    type: 'func',
                                    children: [{ name: '交易限额规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '企业网银标准版2.1.0',
                    type: 'group',
                    children: [
                        {
                            name: '产品管理',
                            type: 'cap',
                            children: [
                                {
                                    name: '利率设定',
                                    type: 'func',
                                    children: [{ name: '利率计算规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '到期处理',
                            type: 'cap',
                            children: [
                                {
                                    name: '自动转存',
                                    type: 'func',
                                    children: [{ name: '转存规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: '风险管理',
            type: 'domain',
            children: [
                {
                    name: '运营管理平台基础版1.0.0',
                    type: 'group',
                    children: [
                        {
                            name: '风险评估',
                            type: 'cap',
                            children: [
                                {
                                    name: '风险识别',
                                    type: 'func',
                                    children: [{ name: '风险阈值规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '风险管控',
                            type: 'cap',
                            children: [
                                {
                                    name: '风险预警',
                                    type: 'func',
                                    children: [{ name: '预警触发规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '运营管理平台升级版1.5.0',
                    type: 'group',
                    children: [
                        {
                            name: '内控合规',
                            type: 'cap',
                            children: [
                                {
                                    name: '合规检查',
                                    type: 'func',
                                    children: [{ name: '合规检查规则', type: 'rule' }]
                                }
                            ]
                        },
                        {
                            name: '审计监督',
                            type: 'cap',
                            children: [
                                {
                                    name: '审计跟踪',
                                    type: 'func',
                                    children: [{ name: '审计跟踪规则', type: 'rule' }]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
