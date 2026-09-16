export default {
  // 服务流程类型
  servTyp(value) {
    switch (value) {
      case "01":
      return "服务组件"
      case "02":
      return "服务资产"
      default:
      return value
    }
  },
  // 授权类型
  authType(value) {
    switch (value) {
      case "SJR3CP":
      return "R3产品设计";
      case "ZY0.6ZC":
      return "作业0.6资产";
      case "ZY0.7ZC":
      return "作业0.7资产";
      case "ZY0.8ZC":
      return "作业0.8资产";
      case "ZY0.9ZC":
      return "作业0.9资产";
      case "ZY1.0ZC":
      return "作业1.0资产";
      default:
      return value;
    }
  },
  // 资料类型
  dataType(value) {
    switch (value) {
      case "1":
      return "产品可研报告";
      case "2":
      return "产品功能清单";
      case "3":
      return "调研竞品材料";
      case "4":
      return "其他材料";
      default:
      return value;
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
      return "否"
      case "1":
      return "是"
      default:
      return value
    }
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
  // 创建时间 格式:yyyy-MM-dd hh:mm:ss
  crtTm_yyyyMMddhhmmss(value) {
    if (!!value) {
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
  // 服务资产详情 开发详情， 服务组件详情 工单详情
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
  //验收结果
  chkRsltCd(value) {
    switch (value) {
      case "01":
      return "验收失败"
      case "00":
      return "验收成功"
      default:
      return value
    }
  },
  // 服务资产开发状态
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
  // 服务资产设计-状态
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
  // 服务资产设计创建-状态
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
  // 服务资产服务组件判断测试成功失败
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
  // 工单类型
  orderType(value) {
    switch (value) {
      case "1001":
      return "端资产设计工单"
      case "1002":
      return "原子交互设计工单"
      case "1003":
      return "端资产开发工单"
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
      case "02":
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
      case "30":
      return "数据集"
      default:
      return value
    }
  },
  // 参数来源
  fourRApSource(value) {
    switch (value) {
      case "00":
      return "服务输入参数"
      case "10":
      return "服务输出参数"
      case "20":
      return "服务临时参数"
      case "99":
      return "固定值"
      case "30":
      return "组件输出参数"
      default:
      return value
    }
  },
  // 规则类型
  ruleTpCd(value) {
    switch (value) {
      // case "0":
      //   return "文本"
      // case "1":
      //   return "引用"
      // case "2":
      //   return "赋值"
      // case "3":
      //   return "判断"
      // case "4":
      //   return "服务调用"
      // case "5":
      //   return "公式"
      case "00":
        return "顺序逻辑"
      case "01":
        return "条件逻辑"
      case "02":
        return "迭代逻辑"
      case "03":
        return "计算逻辑"
      case "04":
        return "复杂逻辑"
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
  //研发标签
  developLabelCd(value) {
    switch (value) {
      case "0":
      return "对公业务"
      case "1":
      return "个人业务"
      case "2":
      return "销售业务"
      default:
      return value
    }
  },
  //业务标签
  businessLabelCd(value) {
    switch (value) {
      case "1":
      return "用户"
      case "2":
      return "账户"
      case "3":
      return "转账"
      case "4":
      return "收款"
      case "5":
      return "理财"
      case "6":
      return "营销"
      case "7":
      return "融资"
      default:
      return value
    }
  },
  //所属部
  beltLineType(value) {
    switch (value) {
      case "0":
      return "对公"
      case "1":
      return "对私"
      case "2":
      return "营销"
      default:
      return value
    }
  },
  newBeltLineType(value) {
    switch (value) {
      case "FM-YWY-2022-000001":
      return "对公"
      case "FM-YWY-2022-000002":
      return "对私"
      case "FM-YWY-2022-000003":
      return "营销"
      default:
      return value
    }
  },
  //分段关系
  substnAttrType(value) {
    switch (value) {
      case "01":
      return "一对一"
      case "02":
      return "一对多"
      default:
      return value
    }
  },
  // 数据集本身状态
  dataStatus(value) {
    switch (value) {
      case "0":
      return "新增"
      case "1":
      return "已登记"
      case "2":
      return "已变更"
      default:
      return value
    }
  },
  // 字段状态 
  fieldStatus(value) {
    switch (value) {
      case "0":
      return "新增"
      case "1":
      return "已登记"
      case "2":
      return "变更"
      default:
      return value
    }
  },
  // 数据集本身状态
  desiStusCd(value) {
    switch (value) {
      case "00":
      return "设计中"
      case "01":
      return "待评审"
      case "02":
      return "评审驳回"
      case "03":
      return "待登记"
      case "20":
      return "已登记"
      default:
      return value
    }
  },
  dataSetStusCd(value){
    switch(value){
      case "0":
      return "新增"
      case "1":
      return "变更"
      case "2":
      return "已登记"
    }
  },
  // 关联关系
  relation(value) {
    switch (value) {
      case "01":
        return "1:1"
      case "02":
        return "1:n"
      case "03":
        return "n:1"
      case "04":
        return "n:n"
      default:
        return value
    }
  },
  // 所属册
  classifyIdSt(value) {
    switch (value) {
      case "1":
      return "用户"
      case "2":
      return "机构"
      case "3":
      return "渠道"
      case "4":
      return "产品"
      case "5":
      return "合约"
      case "6":
      return "系统"
      default:
      return value
    }
  },
  actionType(value) {
    switch (value) {
      case "0":
        return "开始结束组件"
      case "1":
        return "服务"
      case "2":
        return "异步组件"
      case "3":
        return "并发组件"
      case "4":
        return "容器组件"
      case "5":
        return "循环组件"
      case "6":
        return "break组件"
      case "7":
        return "continue组件"  
      case "8":
        return "运算组件"  
      case "9":
        return "拼接组件"  
      case "10":
        return "设置会话组件"  
      case "11":
        return "获取会话组件"  
      case "12":
        return "文件上传组件"  
      case "13":
        return "设置缓存组件"  
      case "14":
        return "获取缓存组件"  
      default:
      return value
    }
  },
  serType(value){
    switch(value){
      case "D5自有服务":
        return "自有服务"
      case "D5直连服务":
        return "直连服务"
    }
  },
  apiStatusType(value){
    switch(value){
      case "0":
        return "新增"
      case "2":
        return "已登记"
    }
  },
  detailType(value){
    switch(value){
      case "32":
        return "基于业务规则形成的业务主流程是否正确"
      case "33":
        return "基于业务规则定义的分支逻辑是否正确"
      case "34":
        return "基于分支逻辑形成的业务处理链路是否齐备"
      case "35":
        return "基于业务规则定义的规则处理是否正确"
      default:
      return value
    }
  },
  transState(value){
    switch(value){
      case "0":
        return "新增"
      case "2":
        return "已登记"
    }
  },
  svcUpdtType(value){
    switch(value){
      case "0":
        return "新增"
      case "2":
        return "登记"
      default:
        return value;
    }
  },
  twoConfirm(value){
    switch(value){
      case "1":
        return "是"
      default:
        return  "否"
    }
  },
  actionErrorType(value) {
    switch(value) {
      case "1":
        return "组件未保存"
      case "2":
        return "组件参数未引用"
      default:
        return  value;
    }
  }
}
