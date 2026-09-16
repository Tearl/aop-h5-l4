export const PRODUCT_LEVELS = [
    { key: 'product-line', label: '产品线', color: '#2b5fd7' },
    { key: 'product-main', label: '产品组', color: '#3c78cf' },
    { key: 'product-catalog', label: '产品目录', color: '#4a90d9' },
    { key: 'basic-product', label: '基础产品', color: '#5ba3e6' },
    { key: 'sellable-product', label: '可售产品', color: '#7ec8e3' },
    { key: 'product-component', label: '产品组件', color: '#a8d8ea' }
]

export const PRODUCT_VERSIONS = ['V3.5.0', 'V3.0.0', 'V2.5.0', 'V2.0.0']

const PRODUCT_MODEL_DATA_SOURCE = [
    {
        name: '对公产品线', type: 'product-line', children: [
            {
                name: '支付结算', type: 'product-group', children: [
                    {
                        name: '信用卡', type: 'basic-product', children: [
                            {
                                name: '标准信用卡金卡', type: 'sellable-product', children: [
                                    { name: '分期还款', type: 'product-component' },
                                    { name: '额度管控', type: 'product-component' },
                                    { name: '账单管理', type: 'product-component' },
                                    { name: '积分兑换', type: 'product-component' },
                                    { name: '自动还款', type: 'product-component' }
                                ]
                            },
                            {
                                name: '标准信用卡白金卡', type: 'sellable-product', children: [
                                    { name: '分期还款', type: 'product-component' },
                                    { name: '积分兑换', type: 'product-component' },
                                    { name: '机场贵宾厅', type: 'product-component' },
                                    { name: '高额保险', type: 'product-component' }
                                ]
                            },
                            {
                                name: '标准信用卡钻石卡', type: 'sellable-product', children: [
                                    { name: '分期还款', type: 'product-component' },
                                    { name: '机场贵宾厅', type: 'product-component' },
                                    { name: '高尔夫预订', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '借记卡', type: 'basic-product', children: [
                            {
                                name: '联名借记卡', type: 'sellable-product', children: [
                                    { name: '联名权益', type: 'product-component' },
                                    { name: '存取款', type: 'product-component' }
                                ]
                            },
                            {
                                name: '贵宾借记卡', type: 'sellable-product', children: [
                                    { name: '贵宾通道', type: 'product-component' },
                                    { name: '免手续费', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '预付卡', type: 'basic-product', children: [
                            {
                                name: '联名预付卡', type: 'sellable-product', children: [
                                    { name: '充值管理', type: 'product-component' }
                                ]
                            },
                            {
                                name: '礼品预付卡', type: 'sellable-product', children: [
                                    { name: '余额查询', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '电子账户', type: 'basic-product', children: [
                            {
                                name: '二类电子账户', type: 'sellable-product', children: [
                                    { name: '在线开户', type: 'product-component' }
                                ]
                            },
                            {
                                name: '三类电子账户', type: 'sellable-product', children: [
                                    { name: '小额支付', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '贸易融资', type: 'product-group', children: [
                    {
                        name: '信用证', type: 'basic-product', children: [
                            {
                                name: '即期信用证', type: 'sellable-product', children: [
                                    { name: '开证管理', type: 'product-component' },
                                    { name: '单据审核', type: 'product-component' }
                                ]
                            },
                            {
                                name: '远期信用证', type: 'sellable-product', children: [
                                    { name: '承兑管理', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '保函', type: 'basic-product', children: [
                            {
                                name: '履约保函', type: 'sellable-product', children: [
                                    { name: '保函开立', type: 'product-component' }
                                ]
                            },
                            {
                                name: '预付款保函', type: 'sellable-product', children: [
                                    { name: '保函通知', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '押汇', type: 'basic-product', children: [
                            {
                                name: '出口押汇', type: 'sellable-product', children: [
                                    { name: '融资放款', type: 'product-component' }
                                ]
                            },
                            {
                                name: '进口押汇', type: 'sellable-product', children: [
                                    { name: '到期还款', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '现金管理', type: 'product-group', children: [
                    {
                        name: '资金池', type: 'basic-product', children: [
                            {
                                name: '资金池标准版', type: 'sellable-product', children: [
                                    { name: '资金归集', type: 'product-component' },
                                    { name: '资金下拨', type: 'product-component' }
                                ]
                            },
                            {
                                name: '资金池增强版', type: 'sellable-product', children: [
                                    { name: '智能调拨', type: 'product-component' },
                                    { name: '利率协商', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '集中支付', type: 'basic-product', children: [
                            {
                                name: '批量支付', type: 'sellable-product', children: [
                                    { name: '批量导入', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '现金归集', type: 'basic-product', children: [
                            {
                                name: '自动归集', type: 'sellable-product', children: [
                                    { name: '定时归集', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: '零售产品线', type: 'product-line', children: [
            {
                name: '信用卡业务', type: 'product-group', children: [
                    {
                        name: '标准信用卡', type: 'basic-product', children: [
                            {
                                name: '标准信用卡普卡', type: 'sellable-product', children: [
                                    { name: '分期还款', type: 'product-component' },
                                    { name: '积分兑换', type: 'product-component' }
                                ]
                            },
                            {
                                name: '标准信用卡金卡', type: 'sellable-product', children: [
                                    { name: '分期还款', type: 'product-component' },
                                    { name: '额度管控', type: 'product-component' },
                                    { name: '积分兑换', type: 'product-component' },
                                    { name: '自动还款', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '公务卡', type: 'basic-product', children: [
                            {
                                name: '企业公务卡', type: 'sellable-product', children: [
                                    { name: '额度管控', type: 'product-component' },
                                    { name: '报销关联', type: 'product-component' },
                                    { name: '账单管理', type: 'product-component' }
                                ]
                            },
                            {
                                name: '政府公务卡', type: 'sellable-product', children: [
                                    { name: '预算管控', type: 'product-component' },
                                    { name: '报销关联', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '大额分期卡', type: 'basic-product', children: [
                            {
                                name: '大额分期12期', type: 'sellable-product', children: [
                                    { name: '分期管理', type: 'product-component' },
                                    { name: '自动还款', type: 'product-component' },
                                    { name: '提前结清', type: 'product-component' }
                                ]
                            },
                            {
                                name: '大额分期24期', type: 'sellable-product', children: [
                                    { name: '分期管理', type: 'product-component' },
                                    { name: '自动还款', type: 'product-component' },
                                    { name: '提前结清', type: 'product-component' }
                                ]
                            },
                            {
                                name: '大额分期36期', type: 'sellable-product', children: [
                                    { name: '分期管理', type: 'product-component' },
                                    { name: '提前结清', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '消费信贷', type: 'product-group', children: [
                    {
                        name: '个人消费贷', type: 'basic-product', children: [
                            {
                                name: '信用消费贷', type: 'sellable-product', children: [
                                    { name: '额度审批', type: 'product-component' },
                                    { name: '用途监控', type: 'product-component' },
                                    { name: '自动放款', type: 'product-component' }
                                ]
                            },
                            {
                                name: '抵押消费贷', type: 'sellable-product', children: [
                                    { name: '抵押评估', type: 'product-component' },
                                    { name: '额度审批', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '住房按揭', type: 'basic-product', children: [
                            {
                                name: '首套房贷', type: 'sellable-product', children: [
                                    { name: '等额本息', type: 'product-component' },
                                    { name: '等额本金', type: 'product-component' },
                                    { name: '提前还款', type: 'product-component' }
                                ]
                            },
                            {
                                name: '二套房贷', type: 'sellable-product', children: [
                                    { name: '利率定价', type: 'product-component' },
                                    { name: '等额本息', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '汽车贷款', type: 'basic-product', children: [
                            {
                                name: '新车贷款', type: 'sellable-product', children: [
                                    { name: '车辆评估', type: 'product-component' },
                                    { name: 'GPS安装', type: 'product-component' }
                                ]
                            },
                            {
                                name: '二手车贷款', type: 'sellable-product', children: [
                                    { name: '车况评估', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '财富管理', type: 'product-group', children: [
                    {
                        name: '理财产品', type: 'basic-product', children: [
                            {
                                name: '固收类理财', type: 'sellable-product', children: [
                                    { name: '风险评估', type: 'product-component' },
                                    { name: '收益计算', type: 'product-component' },
                                    { name: '到期赎回', type: 'product-component' }
                                ]
                            },
                            {
                                name: '权益类理财', type: 'sellable-product', children: [
                                    { name: '净值查询', type: 'product-component' },
                                    { name: '风险评估', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '基金代销', type: 'basic-product', children: [
                            {
                                name: '货币基金', type: 'sellable-product', children: [
                                    { name: '申赎管理', type: 'product-component' },
                                    { name: '收益分配', type: 'product-component' }
                                ]
                            },
                            {
                                name: '股票基金', type: 'sellable-product', children: [
                                    { name: '定投管理', type: 'product-component' },
                                    { name: '申赎管理', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '贵金属交易', type: 'basic-product', children: [
                            {
                                name: '黄金积存', type: 'sellable-product', children: [
                                    { name: '定期积存', type: 'product-component' }
                                ]
                            },
                            {
                                name: '实物黄金', type: 'sellable-product', children: [
                                    { name: '提货管理', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: '同业产品线', type: 'product-line', children: [
            {
                name: '同业存放', type: 'product-group', children: [
                    {
                        name: '活期存放', type: 'basic-product', children: [
                            {
                                name: '同业活期', type: 'sellable-product', children: [
                                    { name: '计结息', type: 'product-component' },
                                    { name: '账户管理', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '定期存放', type: 'basic-product', children: [
                            {
                                name: '同业定期', type: 'sellable-product', children: [
                                    { name: '到期自动转存', type: 'product-component' },
                                    { name: '部分提前支取', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '同业拆借', type: 'product-group', children: [
                    {
                        name: '隔夜拆借', type: 'basic-product', children: [
                            {
                                name: '隔夜拆借标准', type: 'sellable-product', children: [
                                    { name: '额度管理', type: 'product-component' },
                                    { name: '利息清算', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '7天拆借', type: 'basic-product', children: [
                            {
                                name: '7天拆借标准', type: 'sellable-product', children: [
                                    { name: '额度管理', type: 'product-component' },
                                    { name: '利息清算', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: '票据转贴现', type: 'product-group', children: [
                    {
                        name: '银票转贴', type: 'basic-product', children: [
                            {
                                name: '买断式转贴', type: 'sellable-product', children: [
                                    { name: '票据验真', type: 'product-component' },
                                    { name: '资金清算', type: 'product-component' }
                                ]
                            },
                            {
                                name: '回购式转贴', type: 'sellable-product', children: [
                                    { name: '回购管理', type: 'product-component' }
                                ]
                            }
                        ]
                    },
                    {
                        name: '商票转贴', type: 'basic-product', children: [
                            {
                                name: '商票买断', type: 'sellable-product', children: [
                                    { name: '信用评估', type: 'product-component' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

// 最新原型统一为六级结构：产品线 → 产品组 → 产品目录 → 基础产品 → 可售产品 → 产品组件。
export const PRODUCT_MODEL_DATA = PRODUCT_MODEL_DATA_SOURCE.map(line => ({
    ...line,
    children: [
        {
            name: `${line.name.replace(/产品线$/, '')}产品组`,
            type: 'product-main',
            children: (line.children || []).map(catalog => ({
                ...catalog,
                type: 'product-catalog'
            }))
        }
    ]
}))
