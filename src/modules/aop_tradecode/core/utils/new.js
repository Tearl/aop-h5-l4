export default {
    // 日期转换
    crtTm_yyyyMMddhhmmss(value) {
        if (value) {
            const year = value.slice(0, 4)
            const month = value.slice(4, 6)
            const day = value.slice(6, 8)
            const hour = value.slice(8, 10)
            const minute = value.slice(10, 12)
            const second = value.slice(12, 14)
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`
        }
        return ""
    },
    // 创建时间 格式:yyyy-MM-dd
    crtTm(value) {
        if (!!value) {
            const year = value.slice(0, 4)
            const month = value.slice(4, 6)
            const day = value.slice(6, 8)
            return `${year}-${month}-${day}`
        }
        return ""
    },
    // 参数类型
    paraTyp(value) {
        switch (value) {
            case "0":
                return "String"
            case "1":
                return "List"
            default:
                return value
        }
    },
    abbreviationType(value) {
        switch (value) {
            case "vocabulary":
                return "词汇"
            case "category":
                return "类别"
            case "standard":
                return "标准化"
            case "array":
                return "数组"
            default:
                return value
        }
    },
    // 规则类型
    ruleType(value) {
        switch (value) {
            case "0":
                return "文本"
            case "1":
                return "引用"
            case "2":
                return "赋值"
            case "3":
                return "判断"
            case "4":
                return "服务调用"
            case "5":
                return "公式"
            default:
                return value
        }
    },
    // api参数是否必输
    isFilter(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
            default:
                return value
        }
    },
    // 属性来源
    propType(value) {
        switch (value) {
            case "0":
                return "数据字典"
            case "1":
                return "业务对象"
            default:
                return value
        }
    },
    // 短信状态
    smsState(value) {
        switch (value) {
            case "01":
                return "已发送"
            case "02":
                return "已检验"
            case "03":
                return "超时"
            default:
                return value
        }
    },
    // 短信类型
    smsType(value) {
        switch (value) {
            case "01":
                return "短信通知"
            case "02":
                return "短信验证码"
            default:
                return value
        }
    },
    // 币种
    cionVar(value) {
        switch (value) {
            case "CNY":
                return "人民币"
            default:
                return value
        }
    },
    // 证件类型
    cardVar(value) {
        switch (value) {
            case "1":
                return "营业执照"
            default:
                return value
        }
    },

    // 证件类型
    idCardVar(value) {
        switch (value) {
            case "1":
                return "身份证"
            default:
                return value
        }
    },
    // 卡类型
    cardType(value) {
        switch (value) {
            case "1":
                return "储蓄卡"
            default:
                return value
        }
    },
    // 汇钞标志
    cashFlag(value) {
        switch (value) {
            case "1":
                return "现钞"
            default:
                return value
        }
    },
    //报文定位
    paramPosition(value) {
        switch (value) {
            case "0":
                return "body"
            case "1":
                return "head"
            default:
                return value
        }
    },
    paramType(value) {
        switch (value) {
            case "0":
                return "field"
            case "1":
                return "list"
            default:
                return value
        }
    },
    paramIsCheck(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
            default:
                return value
        }
    },
    //正反案例
    positiveAndNegative(value) {
        switch (value) {
            case "0":
                return "正"
            case "1":
                return "反"
            default:
                return value
        }
    },
    // 服务流程类型
    servTyp(value) {
        switch (value) {
            case "01":
                return "服务组件"
            case "02":
                return "服务活动"
            default:
                return value
        }
    },
    // 参数类型
    paraTyp(value) {
        switch (value) {
            case "0":
                return "String"
            case "1":
                return "List"
            default:
                return value
        }
    },
    // 参数是否必输
    paraNed(value) {
        switch (value) {
            case "0":
                return "是"
            case "1":
                return "否"
            default:
                return value
        }
    },
    // 服务活动详情 开发详情， 服务组件详情 工单详情
    stusCd(value) {
        switch (value) {
            case "01":
                return "待开发"
            case "02":
                return "开发中"
            case "03":
                return "待验收"
            case "04":
                return "已完成"
            default:
                return value
        }
    },
    // 服务活动开发状态
    asdevStusCd(value) {
        switch (value) {
            case "31":
                return "待生产"
            case "32":
                return "生产中"
            case "33":
                return "待验收"
            case "34":
                return "已完成"
            case "35":
                return "已作废"
            default:
                return value
        }
    },
    // 服务活动设计-状态
    assetsDesignStusCd(value) {
        switch (value) {
            case "11":
                return "待生产"
            case "12":
                return "生产中"
            case "13":
                return "待验收"
            case "14":
                return "已完成"
            case "15":
                return "已作废"
            default:
                return value
        }
    },
    // 服务活动设计创建-状态
    assetsStusCd(value) {
        switch (value) {
            case "01":
                return "待生产"
            case "02":
                return "生产中"
            case "03":
                return "待验收"
            case "04":
                return "已完成"
            case "05":
                return "已作废"
            default:
                return value
        }
    },
    // 服务组件列表开发状态
    cpnStusCd(value) {
        switch (value) {
            case "00":
                return "待生产"
            case "01":
                return "待生产"
            case "02":
                return "生产中"
            case "03":
                return "待验收"
            case "04":
                return "已完成"
            case "05":
                return "已作废"
            case "06":
                return "已部署"
            case "11":
                return "设计-待生产"
            case "12":
                return "设计-生产中"
            case "13":
                return "设计-待验收"
            case "14":
                return "设计-已完成"
            case "21":
                return "UI-待生产"
            case "22":
                return "UI-生产中"
            case "23":
                return "UI-待验收"
            case "24":
                return "UI-已完成"
            case "31":
                return "开发-待生产"
            case "32":
                return "开发-生产中"
            case "33":
                return "开发-待验收"
            case "34":
                return "开发-已完成"
            case "41":
                return "测试-待生产"
            case "42":
                return "测试-生产中"
            case "43":
                return "测试-待验收"
            case "44":
                return "测试-已完成"
            default:
                return value
        }
    },
    // 服务组件设计状态
    cpnDesStusCd(value) {
        switch (value) {
            case "11":
                return "待生产"
            case "12":
                return "生产中"
            case "13":
                return "待验收"
            case "14":
                return "已完成"
            case "15":
                return "已作废"
            default:
                return value
        }
    },
    // 设计状态
    designStusCd(value) {
        switch (value) {
            case "01":
                return "待设计"
            case "02":
                return "设计中"
            case "03":
                return "待评审"
            case "04":
                return "已完成"
            default:
                return value
        }
    },
    // 领域服务状态
    domainStusCd(value) {
        switch (value) {
            case "01":
                return "待生产"
            case "02":
                return "生产中"
            case "03":
                return "待验收"
            case "04":
                return "已完成"
            case "05":
                return "已作废"
            default:
                return value
        }
    },
    //原子交互状态
    atomStusCd(value) {
        switch (value) {
            case "01":
                return "新建"
            case "02":
                return "解决"
            case "03":
                return "完成"
            case "04":
                return "激活"
            case "05":
                return "作废"
            default:
                return value
        }
    },
    //原子交互交流信息操作状态
    operTypeStatus(value) {
        switch (value) {
            case "New":
                return "新建"
            case "Edit":
                return "编辑"
            case "Resolved":
                return "解决"
            case "Active":
                return "激活"
            case "Closed":
                return "关闭"
            default:
                return value
        }
    },
    // 渠道
    suitScp(value) {
        switch (value) {
            case "PC":
                return "PC"
            case "MB":
                return "移动"
            case "MP":
                return "小程序"
            case "5G":
                return "5G消息"
            case "BM":
                return "柜面"
            default:
                return value
        }
    },
    // 应用
    bizScp(value) {
        switch (value) {
            case "CB":
                return "企业网银"
            case "PB":
                return "个人网银"
            case "MB":
                return "手机银行"
            case "QYM":
                return "企业手机银行"
            case "WXB":
                return "微信银行"
            case "GTB":
                return "交易银行"
            case "MP":
                return "小程序"
            case "CM":
                return "信用卡手机银行"
            case "OTS":
                return "其他"
            default:
                return value
        }
    },
    // 服务组件类型
    cpntTyp(value) {
        switch (value) {
            case "01":
                return "API服务组件"
            case "02":
                return "原子服务组件"
            default:
                return value
        }
    },
    // 字段分类
    dictryGateg(value) {
        switch (value) {
            case "001":
                return "用户";
            case "002":
                return "账号";
            case "003":
                return "付款";
            case "004":
                return "收款";
            case "005":
                return "理财";
            case "006":
                return "营销";
            default:
                return value;
        }
    },
    // 应用设计-查看-业务标签
    businessType(value) {
        switch (value) {
            case "1":
                return "用户";
            case "2":
                return "账户";
            case "3":
                return "转账";
            case "4":
                return "收款";
            case "5":
                return "理财";
            case "6":
                return "营销";
            case "7":
                return "融资";
            default:
                return value;
        }
    },
    // 测试耗时
    tblTimeLen(value) {
        return value ? `${value}s` : ""
    },
    // 条件匹配模式
    condAndOr(value) {
        switch (value) {
            case "or":
                return "或"
            case "AND":
                return "并且"
            default:
                return value
        }
    },
    // 条件匹配类型
    condType(value) {
        switch (value) {
            case ">":
                return "大于"
            case ">=":
                return "大于等于"
            case "==":
                return "等于"
            case "<":
                return "小于"
            case "<=":
                return "小于等于"
            case "!=":
                return "不等于"
            default:
                return value
        }
    },
    // 服务活动服务组件判断测试成功失败
    judge(value) {
        switch (value) {
            case "0":
                return "成功"
            case "1":
                return "失败"
            default:
                return value
        }
    },
    // 服务组件服务活动是否必输
    paraNed(value) {
        switch (value) {
            case "0":
                return "是"
            case "1":
                return "否"
            default:
                return value
        }
    },
    // 工单类型
    orderType(value) {
        switch (value) {
            case "1001":
                return "端活动设计工单"
            case "1002":
                return "原子交互设计工单"
            case "1003":
                return "端活动开发工单"
            case "1004":
                return "服务组件开发工单"
            default:
                return value
        }
    },
    // 工单状态
    orderStatus(value) {
        switch (value) {
            case "00":
                return "待接单"
            case "01":
                return "待接单"
            case "02":
                return "已接单"
            case "03":
                return "已完成"
            default:
                return value
        }
    },
    // 是否派单
    orderFlg(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
            default:
                return value
        }
    },
    // 步骤
    step(value) {
        if (!Number(value)) return value
        let e = String(value)
        let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
        if (e.length > 1) {
            e = e.split("");
            e[0] = chnNumChar[e[0]]
            e[1] = chnNumChar[e[1]]
            e = `第${e[0] == "一" ? "" : e[0]}十${e[1] == "零" ? "" : e[1]}步`
        } else {
            e = "第" + chnNumChar[e] + "步"
        }
        return e
    },
    // 测试枚举值
    testStusCd(value) {
        switch (value) {
            case "01":
                return "未测试"
            case "02":
                return "部分通过"
            case "03":
                return "不通过"
            case "04":
                return "完全通过"
            default:
                return value
        }
    },
    // 批次来源枚举值
    tbcSorc(value) {
        switch (value) {
            case "0":
                return "手工新增"
            case "1":
                return "系统导入"
            default:
                return value
        }
    },
    // 流程图组件枚举值
    processActionType(value) {
        switch (value) {
            // 1:开始组件、结束组件,2:创建组件,3:数据库组件,4:交易网关、领域服务、关联系统,5:判断组件,6:异常,7:为数据域赋值,8:复制数据域,9:流程组件、服务组件
            case "startAction":
                return "开始组件"
            case "endAction":
                return "结束组件"
            case "newAction":
                return "创建组件"
            case "sqlAction":
                return "数据库组件"
            case "transAction":
                return "交易网关组件"
            case "domainAction":
                return "领域服务组件"
            case "systemAction":
                return "关联系统组件"
            case "judgeAction":
                return "判断组件"
            case "throwExceptionAction":
                return "异常处理"
            case "setFieldValueAction":
                return "为数据域赋值"
            case "copyFieldValueAction":
                return "复制数据域"
            case "flowAction":
                return "流程组件"
            case "inputAction":
                return "input组件"
            case "outputAction":
                return "output组件"
            case "ruleAction":
                return "规则组件"
            case "dataDealAction":
                return "数据处理组件"
            case "dataListAction":
                return "数据集组件"
            case "loopAction":
                return "循环组件"
            case "D4bAction":
                return "D4b服务组件"
            case "D5SelfAction":
                return "D5自有服务组件"
            case "D5LinkAction":
                return "D5直连服务组件"
            case "newD5Action":
                return "新建D5组件"
            default:
                return "服务组件"
        }
    },
    // 测试案例 期望输出枚举值
    expectResultType(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
        }
    },
    // 测试案例 是否验收枚举
    isReviewType(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
        }
    },
    // 验证规则类型
    ruleType(value) {
        switch (value) {
            case "0":
                return "系统验证类"
            case "1":
                return "正则表达式"
        }
    },
    abbreviationType(value) {
        switch (value) {
            case "vocabulary":
                return "词汇"
            case "category":
                return "类别"
            case "standard":
                return "标准化"
            case "array":
                return "数组"
            default:
                return value
        }
    },
    // 功能状态
    fnctStsCd(value) {
        switch (value) {
            case "10":
                return "待生产"
            case "11":
                return "生产中"
            case "12":
                return "待验收"
            case "13":
                return "已完成"
            case "14":
                return "已过期"
            default:
                return value
        }
    },
    // 服务状态
    serviceSts(value) {
        switch (value) {
            case "00":
                return "待生产"
            case "01":
                return "生产中"
            case "01":
                return "待验收"
            case "03":
                return "已完成"
            case "04":
                return "已延期"
            case "10":
                return "已发布"
            case "98":
                return "已作废"
            case "99":
                return "已删除"
            default:
                return value
        }
    },
    //api状态
    apiState(value) {
        switch (value) {
            case "-1":
                return "已作废"
            case "1":
                return "已完成"
            case "2":
                return "已发布"
            case "3":
                return "已下架"
            case "0":
                return "未完成"
            default:
                return value
        }
    },
    // api参数是否必输
    isFilter(value) {
        switch (value) {
            case "0":
                return "否"
            case "1":
                return "是"
            default:
                return value
        }
    },
    // 内外标志
    inOutFlg(value) {
        switch (value) {
            case "0":
                return "内"
            case "1":
                return "外"
            default:
                return value
        }
    },
    // 参数来源
    apSource(value) {
        switch (value) {
            case "00":
                return "服务输入参数"
            case "10":
                return "临时参数"
            case "20":
                return "组件输出参数"
            case "99":
                return "固定值"
            default:
                return value
        }
    },
    // 规则类型
    ruleTpCd(value) {
        switch (value) {
            case "0":
                return "文本"
            case "1":
                return "引用"
            case "2":
                return "赋值"
            case "3":
                return "判断"
            case "4":
                return "服务调用"
            case "5":
                return "公式"
            default:
                return value
        }
    },
    // 远算符
    paramMark(value) {
        switch (value) {
            case "==":
                return "等于"
            case ">":
                return "大于"
            case "<":
                return "小于"
            case "<=":
                return "小于等于"
            case ">=":
                return "大于等于"
            case "!=":
                return "不等于"
            default:
                return value
        }
    },
    //相反操作符(value)
    opParamMark(value) {
        switch (value) {
            case "==":
                return "!="
            case ">":
                return "<="
            case "<":
                return ">="
            case "<=":
                return ">"
            case ">=":
                return "<"
            case "!=":
                return "=="
            default:
                return value
        }
    },
    // 发布标志
    deployFlg(value) {
        switch (value) {
            case "0":
                return "未发布"
            case "1":
                return "已发布"
            default:
                return value
        }
    },
    // 标的状态
    sbjStsState(value) {
        switch (value) {
            case "00":
                return "已作废"
            case "01":
                return "新建"
            case "02":
                return "招标中"
            case "03":
                return "已完成"
            case "04":
                return "已流标"
            default:
                return value
        }
    },
    // 订单管理-生产状态
    getFilters(porp) {
        switch (porp) {
            case "00":
                return "未接单"
            case "01":
                return "生产中"
            case "02":
                return "部署中"
            case "03":
                return "验收中"
            case "04":
                return "已完成"
            default:
                return porp
        }
    },
    // 订单管理-生产状态
    getFiltersOther(porp) {
        switch (porp) {
            case "31":
                return "待生产"
            case "32":
                return "生产中-开发中"
            case "33":
                return "生产中-待部署"
            case "34":
                return "生产中-部署中"
            case "35":
                return "生产中-验收中"
            case "36":
                return "已完成"
            case "37":
                return "已作废"
            default:
                return porp
        }
    },
    // 产线工作台-标的状态
    proSbjStsState(value) {
        switch (value) {
            case "1":
                return "申请中"
            case "2":
                return "已中标"
            case "3":
                return "未中标"
            case "4":
                return "已流标"
            case "5":
                return "已接单"
            case "02":
                return "未申请"
            default:
                return value
        }
    },
    // 工时单位（默认人/天）
    workTime(value) {
        switch (value) {
            default:
                return `${value}人/天`
        }
    },
    // 用户性别
    userSex(value) {
        switch (value) {
            case "API_HR_SEX_1":
                return "男"
            case "API_HR_SEX_2":
                return "女"
            default:
                return value
        }
    },
    // 标的基本信息-招标类型
    biddingTp(value) {
        switch (value) {
            case "design":
                return "设计"
            case "develop":
                return "开发"
            case "test":
                return "测试"
            default:
                return value
        }
    },
    // 订单配置状态  00-未配置；01-配置中；02-已配置
    listConfSts(value) {
        switch (value) {
            case "00":
                return "未配置"
            case "01":
                return "配置中"
            case "02":
                return "已配置"
            default:
                return value
        }
    },
    // 配置订单状态  00-未配置；01-已配置
    confSts(value) {
        switch (value) {
            case "00":
                return "未配置"
            case "01":
                return "已配置"
            default:
                return value
        }
    },
    // 产线工作台-订单状态
    proOrderSts(value) {
        switch (value) {
            case "00":
                return "未接单"
            case "01":
                return "生产中"
            case "02":
                return "部署中"
            case "03":
                return "验收中"
            case "02":
                return "已完成"
        }
    },
    // 消息类型
    notiTypNm(value) {
        switch (value) {
            case "21":
                return "招标公告"
            case "22":
                return "部署失败"
            case "23":
                return "部署成功"
            case "24":
                return "验收通过"
            case "25":
                return "部署申请"
            case "26":
                return "配置申请"
            case "27":
                return "配置完成"
            case "28":
                return "任务指派"
            case "29":
                return "标的申请"
            case "30":
                return "验收申请"
            case "31":
                return "订单指派"
            case "32":
                return "订单接单"
            case "33":
                return "工单指派"
            case "34":
                return "工单提前完工"
            case "35":
                return "任务提前关闭"
            default:
                return value
        }
    },
    // 产线工作台-订单详情-订单状态
    apiOrSatus(value) {
        switch (value) {
            case "API_OR_STATUS_1":
                return "正常"
            case "API_OR_STATUS_2":
                return "冻结"
            case "API_OR_STATUS_3":
                return "删除"
            case "API_OR_STATUS_4":
                return "未开始"
            case "API_OR_STATUS_5":
                return "执行中"
            case "API_OR_STATUS_6":
                return "已投产"
            case "API_OR_STATUS_7":
                return "客户确权"
            default:
                return value
        }
    },
    // 产线工作台-工单状态
    apiWoSatus(value) {
        switch (value) {
            case "API_WO_STATUS_1":
                return "正常"
            case "API_WO_STATUS_2":
                return "冻结"
            case "API_WO_STATUS_3":
                return "删除"
            case "API_WO_STATUS_4":
                return "未开始"
            case "API_WO_STATUS_5":
                return "执行中"
            case "API_WO_STATUS_6":
                return "已投产"
            default:
                return value
        }
    },
    // 产线工作台-工单类型
    apiWoType(value) {
        switch (value) {
            case "API_WO_TYPE_8":
                return "研发工单"
            default:
                return value
        }
    },
    // 产线工作台-任务状态
    apiMsStatus(value) {
        switch (value) {
            case "API_MS_STATUS_1":
                return "正常"
            case "API_MS_STATUS_2":
                return "冻结"
            case "API_WO_STATUS_3":
                return "删除"
            case "API_WO_STATUS_4":
                return "未开始"
            case "API_WO_STATUS_5":
                return "执行中"
            case "API_WO_STATUS_6":
                return "已完成"
            default:
                return value
        }
    },
    //系统类型
    systemType(value) {
        switch (value) {
            case "system":
                return "系统"
            case "center":
                return "中心"
        }
    },
    //系统类型 function和center
    fucType(value) {
        switch (value) {
            case "function":
                return "功能"
            case "center":
                return "中心"
        }
    },
    // 消息类型
    notiTyp(value) {
        switch (value) {
            case "21":
                return "招标公告"
            case "22":
                return "部署失败"
            case "23":
                return "部署成功"
            case "24":
                return "验收通过"
            case "25":
                return "部署申请"
            case "26":
                return "配置申请"
            case "27":
                return "配置完成"
            case "28":
                return "任务指派"
            case "29":
                return "标的申请"
            case "30":
                return "验收申请"
            case "31":
                return "订单指派"
            case "32":
                return "订单接单"
            case "33":
                return "工单指派"
            case "34":
                return "工单提前完工"
            case "35":
                return "任务提前关闭"
            default:
                return value
        }
    },
    // 开发工作台-任务状态
    devSts(value) {
        switch (value) {
            case "00":
                return "生产中"
            case "01":
                return "已完成"
            case "02":
                return "已废除"
            case "03":
                return "已超时"
            default:
                return value
        }
    },
    // 开发工作台-任务状态
    chkStsType(value) {
        switch (value) {
            case "01":
                return "新建"
            case "02":
                return "验收中"
            case "03":
                return "验收通过"
            case "04":
                return "验收拒绝"
            default:
                return value
        }
    },
    // 我的-成员管理-状态
    userStsCd(value) {
        switch (value) {
            case "1":
                return "试用期"
            case "2":
                return "实习期"
            case "3":
                return "正式员工"
            case "4":
                return "已离职"
            case "5":
                return "待离职"
            default:
                return value
        }
    },
    // 我的-成员管理-状态（修改版本）
    userManageSts(value) {
        switch (value) {
            case "API_HR_STATUS_1":
                return "试用期"
            case "API_HR_STATUS_2":
                return "实习期"
            case "API_HR_STATUS_3":
                return "正式员工"
            case "API_HR_STATUS_4":
                return "已离职"
            case "API_HR_STATUS_5":
                return "待离职"
            default:
                return value
        }
    },
    // 部署历史列表-状部署态
    deployHisState(value) {
        switch (value) {
            case "00":
                return "未申请"
            case "01":
                return "申请中"
            case "02":
                return "部署成功"
            case "03":
                return "部署失败"
            default:
                return value
        }
    },

    // 租户信息-租户类型
    memberUserType(value) {
        switch (value) {
            case "00":
                return "内部"
            case "01":
                return "外部"
            default:
                return value
        }
    },
    // 产线-部署申请-列表-部署长胎
    deployListStatus(value) {
        switch (value) {
            case "00":
                return "未申请"
            case "01":
                return "申请中"
            case "02":
                return "部署成功"
            case "03":
                return "部署失败"
            default:
                return value
        }
    },
    // 产线-部署申请-列表-部署长胎
    functionStatus(value) {
        switch (value) {
            case "00":
                return "初始状态"
            case "10":
                return "设计-招标中"
            case "11":
                return "设计-待生产"
            case "12":
                return "设计-生产中"
            case "13":
                return "设计-待验收"
            case "14":
                return "设计-已完成"
            case "20":
                return "开发-招标中"
            case "21":
                return "开发-待生产"
            case "22":
                return "开发-生产中"
            case "23":
                return "开发-待验收"
            case "24":
                return "开发-已完成"
            case "30":
                return "测试-招标中"
            case "31":
                return "测试-待生产"
            case "32":
                return "测试-生产中"
            case "33":
                return "测试-待验收"
            case "34":
                return "测试-已完成"
            default:
                return value
        }
    },
    // 产线状态
    beltlineSts(value) {
        switch (value) {
            case "API_LI_STATUS_1":
                return "正常(执行)"
            default:
                return value
        }
    },
    // 用户状态
    apiHrStatus(value) {
        switch (value) {
            case "API_HR_STATUS_1":
                return "试用期"
            case "API_HR_STATUS_2":
                return "实习期"
            case "API_HR_STATUS_3":
                return "正式员工"
            case "API_HR_STATUS_4":
                return "已离职"
            case "API_HR_STATUS_5":
                return "待离职"
            default:
                return value
        }
    },
    //部署状态
    deployStatus(value) {
        switch (value) {
            case "0":
                return "部署失败"
            case "1":
                return "部署成功"
            default:
                return value
        }
    },
    //4b交互接口状态
    business4BSt(value) {
        switch (value) {
            case "-1":
                return "已作废"
            case "0":
                return "设计中"
            case "1":
                return "已完成"
            case "2":
                return "已登记"
            default:
                return value
        }
    },
}
