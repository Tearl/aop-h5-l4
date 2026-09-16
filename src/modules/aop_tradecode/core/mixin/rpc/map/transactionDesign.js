import { proxy, proxyUrl } from '../proxy'

export default {
  // 我的消息页面接口
  getHomeInfo: proxy("AOP030001"), // D4工作台首页信息查询
  getMessageList: proxy("AOP030002"), // 消息列表分页查询

  // 我的任务页面接口
  getTaskList: proxy("AOP030003"), // 任务列表分页查询
  getTaskStatusCount: proxy("AOP004072"), // 任务状态统计
  getTaskInfo: proxy("AOP030005"), // 任务详情查询

  // D4b设计列表页接口
  releaseFunction: proxy("AOP030010"), // 功能发布
  getFunctionStatusCount: proxy("AOP030008"), // 功能状态统计
  getFunctionInfo: proxy("AOP030020"), // 功能详情查询
  getWorkInfo: proxy("AOP008405"), // 工作台详情查询
  getFunctionList: proxy("AOP030007"), // 功能列表分页查询
  getFunctionReleaseLogList: proxy("AOP030097"), // 功能发布日志列表分页查询

  checkServiceParamsValue: proxy("AOP030105"), // D4b服务参数值检测
  checkServiceParamsQuote: proxy("AOP030106"), // D4b服务参数引用情况检测

  // D4b管理列表页接口
  deleteService: proxy("AOP030014"), // D4b服务删除
  cancelService: proxy("AOP030013"), // D4b服务作废
  getD4bManageList: proxy("AOP030011"), // D4b服务列表分页查询
  checkServiceInnerReleaseStatus: proxy("AOP030100"), // D4b服务内部服务发布情况检测
  checkServiceStandardization: proxy("AOP030101"), // D4b服务参数贯标情况检测
  checkServiceCaseData: proxy("AOP030102"), // D4b服务案例数据情况检测
  checkServiceExcuteStatus: proxy("AOP030103"), // D4b服务案例执行情况检测
  releaseService: proxy("AOP030015"), // D4b服务发布
  getServiceBaseInfo: proxy("AOP030090"), // D4b服务基本信息查询
  getServiceReleaseLogList: proxy("AOP030095"), // D4b服务发布日志列表分页查询
  editD4ServiceSts: proxy("AOP030123"), // 修改状态

  // 编辑器服务定义页接口
  getR4bServiceList: proxy("AOP030030"), // R4b服务列表查询
  getD4bServiceList: proxy("AOP030016"), // D4b服务列表查询
  getD4bServiceInfo: proxy("d2/queryD4bDealInfo"), // D4b服务详情查询
  getD4bServiceRuleList: proxy("AOP030042"), // D4b服务分析业务规则列表查询
  associateFunctionWithD4bService: proxy("AOP030022"), // 功能与D4b服务绑定
  disassociateFunctionWithD4bService: proxy("AOP030023"), // 功能与D4b服务取消绑定
  associateD4bWithR4b: proxy("AOP030032"), // D4b服务与R4b服务绑定
  disassociateD4bWithR4b: proxy("AOP030033"), // D4b服务与R4b服务取消绑定
  getServiceDesignDetail: proxy("AOP030044"), // D4b服务设计详情查询
  getR4bServiceDetail: proxy("AOP030031"), // R4b服务详情查询
  editD4bService: proxy("AOP030120"), // D4b服务定义编辑保存
  addD4bServ: proxy("AOP030021"), // D4b服务创建
  getR4bSelectList: proxy("AOP030150"), // R4b服务下拉框
  getD4bRuleList: proxy("AOP030118"), // D4b服务业务规则分页查询
  getD4bRelatedServiceList: proxy("AOP030127"), // D4b服务的关联服务列表
  getD4bInfoByR4bId: proxy("AOP030126"), // 根据R4bid查询D4b服务详情

  // 编辑器服务设计页接口
  saveD4bSeriveProcess: proxy("AOP030094"), // D4b服务设计流程图保存
  getFlowInfo: proxy("AOP030091",),
  getServiceCpnDefaultParams: proxy("AOP030049",), // 服务组件选定服务后默认参数查询
  saveServiceCpnParams: proxy("AOP030050",), // 组件配置信息保存
  getServiceCpnParams: proxy("AOP030051",), // 服务组件参数查询
  queryL5ParamAndRuleDefinitions: proxy("queryL5ParamAndRuleDefinitions",), // 服务组件参数查询
  queryDecisionTreeParamAndRuleDefinitions: proxy("queryDecisionTreeParamAndRuleDefinitions"), // 查询规则组件信息

  addFunc: proxy("MK030032"),

  getD4MyCreatedList: proxy("AOP070001"),//D4工作台-应用列表-我负责的
  getD4MyJoinList: proxy("AOP070002"),//D4工作台-应用列表-我参与的
  getD4DesignInfos: proxy("FN00000002"),//D4工作台-应用查看
  getD4bDesignList: proxy("AOP070009"),//D4工作台-应用设计-D4b设计-工作台列表/模块列表

  getD4bDesignListLook: proxy("MK050120"),//D4工作台-应用设计- 应用查看

  getD4bModulListLook: proxy("MK050233"),//D4工作台-应用设计-D4b设计-模块列表-查看

  getd4AppLeftModuleList: proxy("AOP011025"),//D4工作台-应用设计-M1输入-模块列表（左侧菜单栏）
  getd4AppModuleList: proxy("AOP011007"),//D4工作台-应用设计-M1输入-模块列表
  getM1DemandList: proxy("AOP010025"),//D4工作台-应用设计-M1输入-需求凭证
  getM1DemandListInfo: proxy("AOP010026"),//D4工作台-应用设计-M1输入-需求凭证-查看
  getM1UserStroyList: proxy("AOP010027"),//D4工作台-应用设计-M1输入-用户故事
  getM1UserStroyListInfo: proxy("AOP010028"),//D4工作台-应用设计-M1输入-用户故事-查看


  getM1ListD4: proxy("AOP070024"),//D4工作台-应用设计-M1输入-列表

  getD4bM1ModulList: proxy("AOP060047"),//D4工作台-应用设计-M1输入-D4b服务-列表（模块）
  getD4bM1DesignList: proxy("AOP060048"),//D4工作台-应用设计-M1输入-D4b服务-列表（工作台）
  getD4bM1ServerListInfo: proxy("FN00000091"),//D4工作台-应用设计-M1输入-D4b服务-D4b服务详情查看
  getD5M1ServerList: proxy("AOP060046"),//D4工作台-应用设计-M1输入-D5服务-列表
  getD5M1ServerListInfo: proxy("FN00000093"),//D4工作台-应用设计-M1输入-D5服务-D5服务详情查看
  getD4AdminList: proxy("AOP070023"),//D4工作台-应用设计-D4b设计-工作台管理/模块管理
  submitD4AdminInfo: proxy("AOP070012"),//D4工作台-应用设计-D4b设计-工作台管理/模块管理登记申请

  getD4PermissUserInfo: proxy("AOP070005"),//D4工作台-应用权限-人员详情列表
  getD4PermissUserList: proxy("AOP070006"),//D4工作台-应用权限-人员添加列表
  addD4PermissUser: proxy("AOP070003"),//D4工作台-应用权限-人员添加
  delD4PermissUser: proxy("AOP070004"),//D4工作台-应用权限-人员删除
  submitD4Accept: proxy("AOP070010"),//D4工作台-提交验收
  lookD4Fail: proxy("AOP070011"),//D4工作台-失败原因查看
  getTatolAll: proxy("AOP070022"),//D4工作台-条数
  getD4NoCheckList: proxy("AOP070007"),////D4工作台-待验收列表/验收列表
  submitD4bNpCheckInfo: proxy("AOP070008"),////D4工作台-待验收列表-验收提交
  revokeD4Accept: proxy("AOP070021"),//D4工作台-撤销/重新提交

  getModFunctionList: proxy("AOP070014"),//D4工作台-应用设计-D4b设计-模块-功能列表
  getModD4bServiceList: proxy("AOP070013"), //设计-服务设计-D4b列表视图(工作台)
  getFnctD4bServiceList: proxy("AOP070016"), //设计-服务设计-D4b列表视图(功能)
  addD4Rule: proxy("AOP070020"), //设计-服务定义-新增业务规则
  getD4RuleList: proxy("AOP070017"), //设计-服务定义-新增业务规则
  delD4Rule: proxy("AOP070019"), //设计-服务定义-删除业务规则
  editD4Rule: proxy("AOP070018"), //设计-服务定义-编辑业务规则
  toStartDesign: proxy("AOP030045"), //设计-服务设计-开始设计
  toCompleteDesign: proxy("AOP030046"), //设计-服务设计-设计完成

  //服务划分
  getWorkBenchDivisionApiList: proxy("AOP070025"), //工作台-服务划分-服务列表
  getFnctDivisionApiList: proxy("AOP070026"), //功能-服务划分-服务列表
  divisionService: proxy("AOP070027"), //服务划分--按服务划分确认事件
  getFlowdata: proxy("AOP030147"), //获取流程图flow信息
  toSave4RAction: proxy("AOP030148"), //保存4R子流程图

  saveAction: proxy("d2DataViewParam/update"), //保存组件后再存储一次
  getDataViewList: proxy("AOP030054"), //获取数据视图已用/已赋值列表
  getAstRgNo: proxy("AOP070039"), //查询活动登记流水号
  getCheckResult: proxy("AOP070040"), //查询执行检测结果

  getCheckResultInfo: proxy("AOP070041"), //查询验收详情
  getCheckResultList: proxy("AOP070042"), //查询验收历史列表

  //后端设计
  getFuncDetail: proxy("AOP020017"), //查询功能详情
  getFuncServList: proxy("AOP070206"), //查询功能下的所有服务列表
  commitDownDeisgn: proxy("AOP009211"), //后端设计-功能提交
  revokeDownDeisgn: proxy("AOP009213"), //后端设计-功能撤销
  reviewDownDeisgn: proxy("AOP009212"), //后端设计-功能审批
  getAssociatedSelfServiceList: proxy("AOP03203"), //后端设计-已关联的自有服务列表
  addBusinessRule: proxy("MK001039"), //新增业务规则
  editBusinessRule: proxy("MK001040"), //修改业务规则
  getBusinessRuleInfo: proxy("MK001041"), //查询业务规则
  getServiceArrangeList: proxy("AOP03205"), //查询编排列表
  saveServiceArrangeList: proxy("AOP03206"), //保存编排流程
  saveD4bTranDesignFlow: proxy("saveD4bTranDesignFlow"), //保存流程图及编排流程
  generateCompositeId: proxy("generateCompositeId "), //生成组件id
  updateD4Param: proxy("updateD4Param "), //设置交易的输出参数

  getElementList: proxy("AOP020014"), //查询要素列表
  getElementServList: proxy("AOP020019"), //查询要素下服务列表

  getL5ServField: proxy("MK001042"), //查询L5服务下字段

  addDownLoadTrans: proxy("d2/addDeal"), //新增交易
  getDownLoadTransList: proxy("AOP03202"), //查询交易列表
  delDownLoadTrans: proxy("d2/deleteDeal"), //删除交易
  getRelationServList: proxy("AOP020052"), //查询已关联交易列表

  addProblemRecord: proxy("AOP020040"), //新增问题记录
  getProblemRecord: proxy("AOP020045"), //查询问题记录
  getTransConfirm: proxy("AOP020042"), //查询问题记录
  assetQuestionRecord: proxy("bizmodel/assetQuestionRecord"), //活动问题记录(原AOP020040)
  querySingleQuestionRecord: proxy("bizmodel/querySingleQuestionRecord"), //活动查询单种类型问题记录列表(原AOP020045)
  queryAssetQuestionRecord: proxy("bizmodel/queryAssetQuestionRecord"), //活动查询问题记录列表(原AOP020042)
  editD4Trans: proxy("d2/updateDealInfo"), //保存D4交易

  querySessionParam: proxy("querySessionParam"), //查询会话的接口
  //新版交易列表有是否校验
  getNewRelationServList: proxy("queryBindServiceList"), //查询已关联交易列表
  getDessitizaList: proxy("desensitizationType/list"),   //脱敏列表
  queryCacheIndexList: proxy("devopsEditor/cacheIndexList/query"), //查询缓存索引下拉选项列表
  queryCacheModuleParamList: proxy("cacheModuleParam/query "), //查询缓存数据结构列表
  getTransRelation:proxy("AOP020054"),          //判断当前交易是否和其他活动关联
  // 查询字典
  getDictionaryList: proxy("AOP003055"),
  duplicateChenck: proxy("AOP003265"),
  getDataRuleList: proxy("AOP003066"),  // 获取校验规则
  addPublicDictionary: proxy("AOP003057"),
  //元数据编辑
  editPublicDictionary: proxy("AOP003054"),
  modSysDic: proxy("AOP204002"),
  agreeStandardDic: proxy("MK207009"),
  //元数据详情
  editList: proxy("AOP003056"),
  getSysDicDetail: proxy("AOP103101"),
  getDecisionParam: proxy("MK001004"),     //规则参数
  //获取已关联规则列表
  getRuleRelationList: proxy("transUseDecisionTree/query"),
  getServiceList:proxy("fm1/l5TreeService/query"),      //服务列表
  checkService: proxy("l5DecisionTreeServiceChoice"),   //选择服务
  addDecision: proxy("fm1/l5/l5DecisionTreeService/addL5TreeService"),  //新增规则
  getDecisionDetail: proxy("fm1/queryTreeBaseInfo"),   //查询规则详情
  getDecisionRule: proxy("fm1/selectTreeRuleDefinitionInfo"),  //规则表图
  editDecision: proxy("fm1/updateDecisionTreeService"), //编辑规则
  deleteDecision: proxy("fm1/l5TreeService/remove"), //删除规则
  getServiceList:proxy("fm1/l5TreeService/query"),      //服务列表
  getServiceListD2: proxy("AOP020065"), //
  getServiceDetailListD2: proxy("AOP008465"),
  getBusinessList: proxy("l1/d2/getObjectByTaskId"),   //根据业务id查询对象 规则输出参数
  getObjAttrList: proxy("l1/d2/getObjectAttributeByObjId"),  //根据对象id查询对象属性
  getDecisionTreeBodyParamPage: proxy("decisionTreeBodyParamPage/query"),  //输入参数
  getParamPage: proxy('decisionTreeBodyParamPage/query'), //规则分页
  getDesensitizationType: proxy("desensitizationType/list"), //规则类型
  get4BList: proxy("l4ParamPage/query"),   //输入参数当前交易
  editRule: proxy("fm1/l5DecisionTreeService/updateTreeRuleDefinitionInfo"), //更新业务规则说明
  qryFunctionInfo: proxy("bizmodel/assetService/qryAsset"), // 查询首页、节点页基础信息
  delD4transaction: proxy("l4/deleteTransL5DecisionTreeRel"),  // 删除交易列表关联关系
  checkTrans: proxy("checkTranActionParam"), //校验交易

  /* 规则设计相关接口 */
  saveRuleDesignFlow: proxy("bizmodel/decisionTree/designFlow/save"), // 保存规则设计流程图
  getRuleDesignCpnInfo: proxy("bizmodel/decisionTree/processComposite/query"), // 查询规则设计下的组件信息
  saveRuleDesignCpnInfo: proxy("bizmodel/decisionTree/processComposite/save"), // 保存规则设计下的组件信息
  getRuleDesignSubFlowInfo: proxy("bizmodel/decisionTree/sonFlow/query"), // 查询规则设计下的子流程图信息
  getRuleDesignSubFlowInfo: proxy("bizmodel/decisionTree/sonFlow/query"), // 查询规则设计下的子流程图信息
  queryCompositeList: proxy("devopsEditor/queryCompositeList"), // 查询组件列表
}
