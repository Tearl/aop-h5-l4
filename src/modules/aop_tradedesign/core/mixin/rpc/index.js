import { proxy, proxyUrl } from "./proxy"
import  d1interation  from "./d1interation"
import  d1workspace  from "./d1workspace"
import  d4product  from "./d4product"
import  datadict  from "./map/datadict"
import  controlWorkbench  from "./map/controlWorkbench"


const headers = {
  headers: {
    apiVersion: "1.0.0-RC",
    // apiVersion: "1.0.0",
    frontEndFlag: "1"
  }
}
const headersNoFlag = {
  headers: {
    apiVersion: "1.0.0-RC",
    // apiVersion: "1.0.0",
  }
}

export default {
  cpn: {
    // 获取服务组件列表(工具栏)
    getServiceCpnData: proxy("AOP003010"),
    // 获取服务组件列表
    getServiceCpnList: proxy("AOP003001"),
    // 创建服务需求
    addServiceDemand: proxy("AOP003013"),
    // 获取服务组件需求详情
    getServiceCpnDetail: proxy("AOP003030"),
    // 修改服务组件
    editServiceCpnDetail: proxy("AOP003031"),
    // 完成服务需求
    completeServiceDemand: proxy("AOP003038"),
    // 根据服务组件查询关联服务资产
    getRelatedAssets: proxy("AOP003044"),
    // 服务组件设计提交验收接口
    submitCpnservice: proxy("AOP003110"),
    // 服务组件设计验收完成接口
    passCpnservice: proxy("AOP003111"),
    // 服务组件设计拒绝接口
    refuseCpnservice: proxy("AOP003216"),
    // 服务组件管理 提交验收
    submitCpnMgmt: proxy("AOP003224"),
    // 服务组件管理 验收通过
    passCpnMgmt: proxy("AOP003225"),
    // 组件管理列表所属应用下拉框
    getApplyList: proxy("AOP003206"),
    // 组件管理列表所属分组数据
    getGrpgList: proxy("AOP003205"),
    // 分组下的关联系统服务列表
    getSerByGrpg: proxy("AOP003223"),
    //服务组件设计列表
    getCpnDesignList: proxy("AOP003001"),
    //作废服务组件设计
    delCpnDesign: proxy("AOP003176"),
    // 资产视图中服务组件设计信息
    getCpnDesignInfo: proxy("AOP003114"),
    // 服务组件设计流程图保存
    saveCpndesignProcess: proxy("AOP003113"),
    // 组件名称查重
    cpnCheckDuplicate: proxy("AOP003233")
  },
  assets: {
    //查看详情信息
    getBasicInfo: proxy("AOP003095"),
    // 获取服务资产列表
    getServiceAssetsList: proxy("AOP003018"),
    // 获取服务资产编排信息
    getServiceAssets: proxy("AOP003011"),
    // 保存服务资产编排信息
    saveServiceAssets: proxy("AOP003012"),
    // 创建服务资产
    createServiceAssets: proxy("AOP003017"), // 后端没用到
    // 服务资产ID查询业务资产列表
    getAssetsByServId: proxy("AOP003048"),
    // 服务资产开发完成
    completeServiceAssets: proxy("AOP003045"),
    // 通过服务资产创建服务组件
    newServiceDemand: proxy("AOP003049"),
    // 服务定义
    defineServiceAssets: proxy("AOP003050"),
    // 原子交互要求查看详情
    getAtomInteractionInfo: proxy("AOP003108"),
    // 服务资产定义编辑保存
    saveDefinition: proxy("AOP003103"),
    // 资产管理-查看-服务组件设计列表
    getCpnInfoList: proxy("AOP003227"),
    // 资产管理-查看-服务组件设计列表关联领域服务
    cpnGetDomainList: proxy("AOP003229"),
    // 资产管理-查看-领域服务设计列表
    getDomainInfoList: proxy("AOP003228"),
    // 服务资产设计-作废
    cancellationAssets: proxy("AOP003162"),
    // 服务资产设计-提交验收
    submitAssetsDesign: proxy("AOP003160"),
    // 服务资产设计-验收通过
    passAssetsDesign: proxy("AOP003161"),
    // 服务资产开发 重置
    resetAssets: proxy("AOP003230"),
    // 服务资产开发-提交验收
    submitAssetsDev: proxy("AOP003163"),
    // 服务资产开发-验收通过
    passAssetsDev: proxy("AOP003116"),
    // 服务资产开发-部署
    deployAssetsDev: proxy("AOP003050"),
    // 服务资产管理列表-业务类型
    assetsmgmtBusinessList: proxy("AOP003235"),
    //发布服务资产
    pulishAssets: proxy('AOP003236'),
    // 服务资产管理-提交验收
    submitAssetsTest: proxy("AOP003258"),
    // 服务资产管理-验收通过
    passAssetsTest: proxy("AOP003259"),
  },
  dictionary: {
    // 获取字典参数列表(分页)
    getParamsList: proxy("AOP003022"),
    // 获取字典类型列表
    getParamsTypeList: proxy("AOP003023"),
    // 删除字典
    deleteDictionary: proxy("AOP003053"),
    // 编辑保存
    editDictionary: proxy("AOP003054"),
    // 查询字典
    getDictionaryList: proxy("AOP003055"),
    // 查询编辑
    editList: proxy("AOP003056"),
    // 新增字典
    addDictionary: proxy("AOP003057"),
    // 数据分类列表查询
    queryClassifyList: proxy("AOP003070"),
    // 创建数据分类
    createClassify: proxy("AOP003071"),
    // 获取数据分类类型列表
    getClassifyTypeList: proxy("AOP003072"),
    // 数据分类迁移
    classifyTransfer: proxy("AOP003073"),
    // 根据ID查询单个数据分类信息
    getClassifyDetail: proxy("AOP003074"),
    // 编辑数据分类
    editClassifyDetail: proxy("AOP003075"),
    // 删除数据分类
    deleteClassifyDetail: proxy("AOP003076"),
    // 数据字典模板下载、导出
    exportDictionaryList: proxy("AOP003098"),
    // 查询数据字典已配置的验证规则列表
    alreadyConfiguredList: proxy("AOP003061"),
    // 查询该数据字典未配置的验证规则列表
    notConfiguredList: proxy("AOP003062"),
    // 绑定数据字典和验证规则的关系
    bindingRule: proxy("AOP003260"),
    // 删除数据字典与验证规则的关联关系
    deleteRuleRelation: proxy("AOP003261"),
    // 创建、编辑数据字典时根据名称和所属分类进行查重
    duplicateChenck: proxy("AOP003265"),
    // 数据字典英文缩写标准列表查询
    getDictryAbbreviationList: proxy("AOP003266"),
    // 数据字典英文缩写导入
    importDictryAbbreviation: proxy("AOP003267"),
    // 新增/编辑数据字典缩写
    editDictryAbbreviation: proxy("AOP003268"),
    // 删除数据字典缩写
    deleteDictryAbbreviation: proxy("AOP003269"),
    // 查询服务系统下的字典
    getSysDictionaryList: proxy("AOP003272"),
    //参数设置-临时参数-从数据字典选择
    getSysDictionaryListInfo: proxy("AOP003055"),
    // 检查字典中文名称是否在公共字典存在
    dicNameCheck: proxy("AOP003287"),
    // 数据字典示例
    getDictExampleList: proxy("AOP003130"),
    addDictExample: proxy("AOP003131"),
    modDictExample: proxy("AOP003132"),
    delDictExample: proxy("AOP003133"),
    sortDictExample: proxy("AOP003134"),
    // 系统数据字典查询详情
    getSysDicDetail: proxy("AOP103101"),
    getPublicDictionaryExampleByVerifyRule: proxy("AOP050028"), // 公共数据字典示例值根据验证规则随机生成
    getDictionaryExampleByVerifyRule: proxy("AOP050029"), // 系统数据子弹示例值根据验证规则随机生成
  },
  rule: {
    // 获取验证规则列表
    getSelectRuleList: proxy("AOP003021"),
    // 创建规则分类
    addRuleClassification: proxy("AOP003058"),
    // 查询规则分类 （无分页）
    getRuleClassification: proxy("AOP003059"),
    // 查询规则分类 （分页）
    pageGetRuleClassification: proxy("AOP003060"),
    // 创建验证规则
    addRule: proxy("AOP003064"),
    // 查询验证规则(分页)
    getRuleList: proxy("AOP003066"),
    // 查询验证规则(根据id)
    idGetRuleList: proxy("AOP003067"),
    // 编辑验证规则
    editRule: proxy("AOP003068"),
    // 删除验证规则
    deleteRule: proxy("AOP003069"),
    // 规则分类迁移
    ruleClassifyTransfer: proxy("AOP003087"),
    // 模板下载，导出
    templateDownload: proxy("AOP003092"),
    // 编辑规则分类信息
    editRuleClassification: proxy("AOP003093"),
    // 规则分类删除
    deleteRuleClassification: proxy("AOP003094"),
    // 关联数据字典列表
    relevanceDictionaryList: proxy("AOP003263"),
  },
  atom: {
    // 原子交互要求查看列表查询接口
    getAtomInteractionList: proxy("AOP003100"),
    //原子交互要求详情交流信息接口
    getAtomInteractionCom: proxy("AOP003165"),
    // 原子交互发布
    releaseAtomInteraction: proxy("AOP003170"),
    // 原子交互发布查询业务资产列表
    queryAssetsList: proxy("AOP003171"),
    // 原子交互关联服务资产列表
    getRelevanceAssetsList: proxy("AOP003172"),
    // 获取原子交互信息
    getAtomInteractionInfoById: proxy("AOP003173"),
    // 原子交互管理编辑保存
    editAtomInteractionInfo: proxy("AOP003174"),
    // 原子交互管理mock查询
    getMockDataById: proxy("AOP003175"),
    // 原子交互关联服务资产
    saveRelevanceAssets: proxy("AOP003196"),
    // 原子交互管理显示状态按钮
    getAtomInteractionBtnRightById: proxy("AOP003198"),
    // 原子交互管理mock编辑
    editMockData: proxy("AOP003226"),
    // 原子交互设计-关联服务资产（创建服务资产）
    addRelevanceAssets: proxy("AOP003199"),
    // 发布原子交互时查询服务资产列表
    getServiceAssetsListForRelease: proxy("AOP003019"),
  },
  domain: {
    // 作废领域服务
    delDomaindesign: proxy("AOP003184"),
    // 领域服务设计查询分页
    getDomaindesignList: proxy("AOP003122"),
    // 领域服务设计查询关联服务组件
    getRelatedCpn: proxy("AOP003185"),
    // 查看领域服务设计基本信息详情
    getDomaindesignDetail: proxy("AOP003119"),
    // 查看领域服务流程图
    getDomaindesignProcess: proxy("AOP003183"),
    // 领域服务设计提交评审
    doSubmitDomain: proxy("AOP003186"),
    // 领域服务设计基本信息修改
    saveDomaindesignInfo: proxy("AOP003121"),
    // 领域服务设计流程图保存
    saveDomaindesignProcess: proxy("AOP003182"),
    // 领域服务设计新增
    addDomaindesign: proxy("AOP003118"),
    // 领域服务设计参数设置保存
    saveDomaindesignParams: proxy("AOP003208"),
    // 领域服务设计参数删除
    delDomaindesignParams: proxy("AOP003209"),
    // 领域管理列表（分页）
    getDomainManagementList: proxy("AOP003250"),
    // 新增领域
    addDomainInfo: proxy("AOP003251"),
    // 查看领域信息
    getDomainInfoByDomainId: proxy("AOP003252"),
    // 编辑领域信息
    editDomainInfo: proxy("AOP003253"),
    // 删除领域
    deleteDomainInfoByDomainId: proxy("AOP003254"),
    // 关联应用列表(分页)
    getRelatedAppList: proxy("AOP003255"),
    // 关联应用列表(分页)
    getDomainInfoListByAppId: proxy("AOP003264"),
  },
  app: {
    // 应用管理列表分页
    getAppManagementList: proxy("AOP003237"),
    // 查看应用详情
    getAppInfoByAppId: proxy("AOP003238"),
    // 新增或编辑应用
    editAppInfo: proxy("AOP003239"),
    // 删除应用
    deleteAppInfoByAppId: proxy("AOP003240"),
    // 应用分组管理列表分页
    getGroupManagementList: proxy("AOP003241"),
    // 查看分组详情
    getGroupInfoByGroupId: proxy("AOP003242"),
    // 新增分组
    addGroupInfo: proxy("AOP003243"),
    // 编辑保存分组
    editGroupInfo: proxy("AOP003244"),
    // 删除分组
    deleteGroupInfoByAppId: proxy("AOP003245"),
    // 删除分组
    deleteGroupInfoByAppId: proxy("AOP003245"),
    // 应用管理表-分组数
    getGroupCountListByAppId: proxy("AOP003249"),
    // 应用管理表-领域数
    getDomainCountListByAppId: proxy("AOP003256"),
  },
  d4: {
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
    getD4bServiceInfo: proxy("AOP030026"), // D4b服务详情查询    
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
    
    saveAction: proxy("AOP030052"), //保存组件后再存储一次
    getDataViewList: proxy("AOP030054"), //获取数据视图已用/已赋值列表
    getAstRgNo: proxy("AOP070039"), //查询资产登记流水号
    getCheckResult: proxy("AOP070040"), //查询执行检测结果

    getCheckResultInfo: proxy("AOP070041"), //查询验收详情
    getCheckResultList: proxy("AOP070042"), //查询验收历史列表

    //下装设计
    getFuncDetail: proxy("AOP020017"), //查询功能详情
    getFuncServList: proxy("AOP070206"), //查询功能下的所有服务列表
    commitDownDeisgn: proxy("AOP009211"), //下装设计-功能提交
    revokeDownDeisgn: proxy("AOP009213"), //下装设计-功能撤销
    reviewDownDeisgn: proxy("AOP009212"), //下装设计-功能审批
    getAssociatedSelfServiceList: proxy("AOP03203"), //下装设计-已关联的自有服务列表
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

    addDownLoadTrans: proxy("AOP03201"), //新增交易
    getDownLoadTransList: proxy("AOP03202"), //查询交易列表
    delDownLoadTrans: proxy("AOP03204"), //删除交易
    getRelationServList: proxy("AOP020052"), //查询已关联交易列表

    addProblemRecord: proxy("AOP020040"), //新增问题记录
    getProblemRecord: proxy("AOP020045"), //查询问题记录
    getTransConfirm: proxy("AOP020042"), //查询问题记录
    editD4Trans: proxy("updateFnctSvc"), //保存D4交易

    querySessionParam: proxy("querySessionParam"), //查询会话的接口
    //新版交易列表有是否校验
    getNewRelationServList: proxy("queryBindServiceList"), //查询已关联交易列表
    getDessitizaList: proxy("desensitizationType/list"),   //脱敏列表
  },
  d5: {
    getD5WorkbenchInfo: proxy("AOP030053"),
    getServiceSysDetail: proxy("MK002004"), // 系统基本信息查询
    // 消息列表分页查询
    getMessageList: proxy("AOP030002"),
    // 任务状态统计
    getTaskStatusCount: proxy("AOP004072"),
    getD5designList: proxy("AOP030063"),
    getD5DesignStatusCount: proxy("AOP030125"),
    cancelD5design: proxy("AOP030065",),
    delD5design: proxy("AOP030066",),
    upD5design: proxy("AOP030067",),
    editD5ServiceSts: proxy("AOP030123"),
    getD5ServiceBaseInfo: proxy("AOP030092",),
    getUpSrlInfoList: proxy("AOP030096"),
    getFlowInfo: proxy("AOP030070",),
    getD5MgmtList: proxy("MK002014"),
    editD5Service: proxy("AOP030121",),
    taskContinue: proxy("AOP030059",),
    addR5Serv: proxy("MK008006"),
    delR5Serv: proxy("MK001017"),
    editR5Serv: proxy("MK001006"),
    
    // 服务定义页面相关接口
    getServGrpgList: proxy("MK005008"),
    getD5ServList: proxy("AOP030068",),
    getGateServiceList: proxy("MK030024"),
    addD5Serv: proxy("AOP030064"),
    getApiManageList: proxy("MK001001"),
    getHeaderInfo: proxy("MK008009"), //获取报文头信息
    // 需求列表查询
    getR5ServiceList: proxy("AOP030030"),
    getR5ServInfo: proxy("AOP030071"),
    getR5Detail: proxy("MK001004"),
    
    // 案例设计
    pageGetServList: proxy("AOP030088"), // 不分页
    getCaseList: proxy("AOP030082"),
    addServCase: proxy("AOP030083"),
    modServCase: proxy("AOP030084"),
    getCaseDetail: proxy("AOP030086"),
    changeLevel: proxy("AOP030122"),
    getLevelList: proxy("AOP030124"),  // 获取优先级
    handleRpc: proxy("MK001011"),
    getServCaseList: proxy("AOP030130"),
    getApiMessage: proxy("AOP030129"),
    
    checkServiceStandardization: proxy("AOP030101"),// 规范检查
    checkServiceParamsValue: proxy("AOP030105"), // D5服务参数值检测
    checkServiceParamsQuote: proxy("AOP030117"),
    
    getDomainBankInfo: proxy("MK002016"),// 查询领域信息（银行）
    
    // 编辑器服务设计页接口    
    getServiceDesignDetail: proxy("AOP030070"), // D5服务设计详情查询
    saveD5SeriveProcess: proxy("AOP030080"), // D5服务设计流程图保存
    getServiceCpnDefaultParams: proxy("AOP030049",), // 服务组件选定服务后默认参数查询
    saveServiceCpnParams: proxy("AOP030050",), // 组件配置信息保存
    getServiceCpnParams: proxy("AOP030051",), // 服务组件参数查询
    
    d5ReleaseService: proxy("AOP030067"),
    associateD5WithR5: proxy("AOP030112"),
    disassociateD5WithR5: proxy("AOP030113"),
    
    // 数据集
    getDataList: proxy("AOP060008"),
    getPageDataList: proxy("AOP060009"), // 获取数据集里面的数据不分页
    getD4PermissUserInfo: proxy("AOP070105"),//D5工作台-应用权限-人员详情列表
    getD4NoCheckList: proxy("AOP070107"),//D5工作台-待验收列表/验收列表
    getM1ListD4: proxy("AOP070124"),//D5工作台-应用设计-M1输入-列表
    getTatolAll: proxy("AOP070122"),//D5工作台-条数
    getD4MyCreatedList: proxy("AOP070101"),//D5工作台-应用列表-我负责的
    getD4MyJoinList: proxy("AOP070102"),//D5工作台-应用列表-我参与的
    getModD5ServiceList: proxy("AOP070108"), //设计-服务设计-D4b列表视图(应用)
    getFnctD5ServiceList: proxy("AOP070109"), //设计-服务设计-D4b列表视图(模块)


    // D5设计-数据模型
    getDomainDataSet: proxy("AOP104006"),// 获取领域下的数据集
    getDataSetInfo: proxy("AOP104007"),// 查询数据集详情
    setDomainForDataSet: proxy("AOP104012"),// 数据集划分领域
    getDataSetFlowInfo: proxy("AOP104020"),// 查询数据集图
    saveDataSetFlowInfo: proxy("AOP104013"),// 数据集设计图保存
    getLogicModelInfo: proxy("AOP104021"),// 查询逻辑模型
    getEntityInfo: proxy("AOP104022"),// 查询实体属性
    saveLogicModalInfo: proxy("AOP104023"),// 保存逻辑模型
    mergeSubsection: proxy("AOP104024"),// 合并分段
    splitSubsection: proxy("AOP104025"),// 拆分分段
    editEntity: proxy("AOP104026"),// 修改实体
    editEntityRelation: proxy("AOP104027"),// 修改实体关系
    getPhysicalModelInfo: proxy("AOP104028"),// 查询物理模型
    downloadPhysicalModel: proxy("AOP104029"),// 下载物理模型
  },
  c5:{ 
    queryD1Matrix: proxy('AOP009994'), //C5M1 价值流矩阵
    queryModList:proxy("AOP070124"),  //C5M1输入项
    queryDataSetList:proxy("AOP060070"),       //数据集
    queryServiceSetList:proxy("AOP060050"),    //服务集
    queryD1ModuleDetail:proxy("AOP010016"),    // C5D1 查询模块信息 
    queryD1AppDetail: proxy('AOP009993'),      // C5D1 查询应用信息
    queryDataSetDetail:proxy("AOP060071"),    //数据集详情 
    queryDataSetTableDetail:proxy("AOP060072"),    //数据集表格详情详情

    //D5设计领域定义
    getDomainList:proxy("MK002001"),   //领域设计列表
    domainAdd:proxy("MK002002"),      //添加领域
    domainCheck:proxy("MK002004"),      //查看领域
    domainMod:proxy("MK002003"),    //编辑领域
    domainDelete:proxy("MK002005"),    //删除领域
    domainServiceList:proxy("AOP104017"),      //领域下服务

    //D5设计服务设计
    addClassify:proxy("MK005001"),    //创建分类
    getClassifyList:proxy("MK005002"),    //分类列表
    divisionClassify:proxy("AOP104016"),    //分类划分
    getServiceList:proxy("AOP104017"),    //服务列表
    serviceMod:proxy("AOP104016"),    //服务编辑

  },
  apimgmt: {
    handleAllUpState: proxy("MK001014"),
    handleAllDownState: proxy("MK001015"),
    delApi: proxy("MK001010"),
    handleApiState: proxy("MK001017"), //新处理API状态（删除 -1）
    handleApiAble: proxy("MK001018"), //新处理API启用禁用
    handleApiPublish: proxy("MK001002"),
    handleSimpleApiPublish: proxy("MK008006"),
    handleApiMod: proxy("MK001006"),
    getApiDetail: proxy("MK001004"),
    getCaseMod: proxy("MK006017"),

    pageGetApiCaseList: proxy("MK006011"), // 集合嵌套列表
    getUpApiCaseList: proxy("MK006015"),
    delApiCase: proxy("AOP030085"),
    getApiCaseDetail: proxy("MK006006"),
    getLevelList: proxy("MK006013"),
    changeLevel: proxy("MK006014"),
    addApiCase: proxy("MK006001"),
    modApiCase: proxy("MK006003"),
    getApiMessage: proxy("MK006008"),
    getSceneList: proxy("MK007001"), // 场景管理列表查询
    addSceneInfo: proxy("MK007002"), // 场景管理新增
    getSceneDetail: proxy("MK007003"), // 场景管理详情
    editScene: proxy("MK007004"), // 场景管理编辑保存
    delScene: proxy("MK007005"), // 场景管理删除
    getRuleList: proxy("MK008003"),
    addModRule: proxy("MK008004"),
    deleteRule: proxy("MK008005"),
    sceneRelaCase: proxy("MK007007"), // 场景关联案例
    getApiObj: proxy("AOP003290"), // 查询api下面的业务对象
    deleteApiObj: proxy("AOP003292"),
    apiRelaObj: proxy("AOP003291"), // api关联业务对象
    checkApi: proxy("MK001021"), // api检查案例，检查贯标
    publishApi: proxy("MK001022"), // api发布 新
    getServList: proxy("MK001024"),
    releServ: proxy("MK001023"),
    delSceneRelaCase: proxy("MK007008"), // 删除场景下面的案例
    getTypeSelectList: proxy("MK104009"), // 查询系统下面的大类下拉框
    
    getDictryNoExampleList: proxy("AOP003135"), // 根据数据字典编号查询示例列表
    
    getServiceTypeSysList: proxy("MK008014"),
    checkApiUpNum: proxy("MK001025"),
    
    changeApiId: proxy("AOP060043"), //转换服务ID
    divisionService:proxy("MK001027"), //作业太网关服务划分--按服务划分确认事件
    getFlowChartList:proxy("MK001028"), //作业太网关流程图
    toStartDesign:proxy("MK001031"), //作业太网关流程图设计开始
    toCompleteDesign:proxy("MK001032"), //作业太网关流程图完成
    saveD4bSeriveProcess:proxy("MK001029"), //作业太网关流程图保存
    saveServiceCpnParams: proxy("MK001030",), // 组件配置信息保存
    getServiceCpnParams: proxy("MK001036",), // 服务组件参数查询
    addDicpParams: proxy("MK001035"),   //4R添加参数
    getFlowdata: proxy("MK001034"), //获取流程图flow信息
    toSave4RAction: proxy("MK001033"), //保存4R子流程图
    updateServiceParams: proxy("MK001037"),  //参数配置保存

  },
  public: {
    // 获取开发配置分类下拉框 
    getDevConfigClassification: proxy("AOP030133"),
    // 获取开发配置列表
    getDevConfigList: proxy("AOP030134"),
    // 开发配置列表保存
    devConfigSave: proxy("AOP030135"),
    // api编辑时，新增规则自动生成规则id
    getApiRuleId: proxy("AOP030132"),
    // 创建数据组
    addTestDataGroup: proxy("AOP003078"),
    // 获取入参报文
    getInputMessage: proxy("AOP003079"),
    // 编辑测试数据接口
    editTestData: proxy("AOP003080"),
    // 测试数据组查询列表(分页)
    getTestList: proxy("AOP003081"),
    // 测试数据组查询列表(无分页)
    getTestsList: proxy("AOP003115"),
    // 查看测试数据
    getTestData: proxy("AOP003082"),
    // 删除测试数据组
    deleteTestDataGroup: proxy("AOP003085"),
    // 执行测试
    executeTest: proxy("AOP003040"),
    // 测试记录——查看详情
    getDetails: proxy("AOP003086"),
    // 查询业务类型
    getBusinessList: proxy("AOP003099"),
    // 根据工单的ID和类型获取详情信息
    getOrderInfoByIdAndType: proxy("AOP004005"),
    // 获取领域
    getDomainAreaList: proxy("AOP003009"),
    // 服务组件获取领域服务列表不分页
    getDomainServiceList: proxy("AOP003181"),
    // 所属类型 1服务资产2服务组件3领域服务 参数列表分页获取
    getAllParamsList: proxy("AOP003210"),
    // 参数设置参数来源下的交易服务
    getSerByDomain: proxy("AOP003212"),
    // 流程内参数
    getParamsByProcess: proxy("AOP003211"),
    // 删除参数
    delParamsIn: proxy("AOP003209"),
    // 保存参数
    saveParamsIn: proxy("AOP003208"),
    // 服务参数更新
    updateServiceParams: proxy("AOP030035"),
    // 交易网关关联系统列表
    getTransSys: proxy("AOP007008"),
    // 交易网关服务列表
    getTransSer: proxy("AOP007007"),
    // 验收测试-执行测试
    excuteCheckTest: proxy("AOP003202"),
    // 验收测试新增批次
    addTbc: proxy("AOP003157"),
    // 验收测试删除批次
    deleteTbc: proxy("AOP003201"),
    // 验收测试测试案例总数
    getTestCaseInfoList: proxy("AOP003217"),
    // 验收测试服务组件（资产）总数
    getServiceList: proxy("AOP003215"),
    // 验收测试服务组件（资产）总数弹框 提交验收
    submitList: proxy("AOP003221"),
    // 验收测试服务组件（资产）总数弹框 验收通过
    passList: proxy("AOP003222"),
    // 验收测试修改保存
    editTbc: proxy("AOP003159"),
    // 新增批次校验
    tbcNmCheckout: proxy("AOP003218"),
    // 服务组件验收测试-所有日志-删除
    deleteTestBatchLogInfo: proxy("AOP003204"),
    // 服务组件验收测试-所有日志
    getTestBatchLogInfoList: proxy("AOP003203"),
    // 服务组件验收测试-所有日志-查看详情
    getTestBatchLogInfo: proxy("AOP003158"),
    // 服务组件验收测试-列表
    getCompositeServiceTestBatchInfoList: proxy("AOP003156"),
    // 批量测试-选择资产/组件列表
    getPickListInTestBatch: proxy("AOP003234"),
    // 组件管理列表所属应用下拉框
    getApplyList: proxy("AOP003206"),
    // 服务资产、服务组件管理设置mock值
    setMock: proxy("AOP003189"),
    // 查询消息列表
    getMessageList: proxy('AOP004023'),
    // 查询任务列表
    getTaskList: proxy('AOP004004'),
    // 任务承接
    undertakeOrder: proxy('AOP004003'),
    getTypeSelectList: proxy("MK104009"), // 查询系统下面的大类下拉框
    getBankList: proxy("MK003006"),
    getServiceSysList: proxy("MK002006"), // 查询服务系统下拉框
    getReleaseServiceSysList: proxy("MK002013"), // 查询已发布服务系统列表
    getServTypeList: proxy("MK008007"), // 查询服务类型
    addServiceSys: proxy("MK002002"),
    addType: proxy("MK104007"), // 新增服务大类
    getApiDetail: proxy("MK001004"),
    getRuleList: proxy("AOP030118"), // 服务业务规则分页查询
    getDomainList: proxy("AOP003286"),
    getApiObj: proxy("AOP003290"), // 查询api下面的业务对象
    getServList: proxy("MK001024"),
    getUpApiGroupList: proxy("MK005007"),
    getApiGroupList: proxy("MK005006"),
    getReleaseApiGroupList: proxy("MK005007"), // 已发布分组列表
    getApiManageList: proxy("MK001001"),
    // 案例设计
    getJson: proxy("MK001012"),
    getTestPuApiParams: proxy("MK001013"),
    getGateServiceList: proxy("MK030024"), // 网关服务列表查询
    // 新增字典 
    addPublicDictionary: proxy("AOP003057"),
    // 查询验证规则(分页)
    getDataRuleList: proxy("AOP003066"),
    getSceneIdList: proxy("MK008002"),
    // 新增分组
    addApiGroup: proxy("MK005001"),
    changeSysIsCenter: proxy("MK002015"),
    
    getSysList: proxy("MK002001"), //获取系统列表
    
    
    getGroupDetail:proxy("MK005005"),  //作业太网关进入设计，分组详情
    getApiCaseSelect:proxy("MK006010"),
    getGroupList: proxy("MK005002"), //获取分组列表
    addDicpParams: proxy("AOP030137"), //4R组件数据字典选择的参数进行参数匹配
  },
  file: {
    // 字典xls上传
    upUrl: proxyUrl("AOP003063"),
    // 规则xls上传
    ruleUpUrl: proxyUrl("AOP003091"),
    // 公共资源上传
    pUp: proxyUrl("filenamager/uploadFile"),
    // 组件上传
    cpnUp: proxyUrl('AOP003180'),
    // 数据字典缩写xls上传
    abbreviationUp: proxyUrl('AOP003267'),
    // D5D4工作台案例导出
    caseExport: proxy("MK006012"),
    //数据字典审批批次导入
    batchUpUrl: proxyUrl("fm1/AOP060035"),
    //元数据导入
    importMetaDataUrl: proxyUrl("metaData/import"),
  },
  gatewaymanage: {
    // 新增网关服务
    addGatewayService: proxy('AOP007001'),
    
    //修改网关服务
    modifyGatewayService: proxy('AOP007002'),
    
    //查询网关服务详情
    queryGatewayServiceDetail: proxy('AOP007003'),
    
    //查询网关服务列表
    queryGatewayServiceList: proxy('AOP007004'),
    
    //查询接口列表
    queryGatewayInterfaceList: proxy('AOP007005'),
    
    //查询服务涉及资产工单列表
    queryGatewayServiceAssetWokerOrderList: proxy('AOP007006'),
    
    // 查询业务参数列表
    queryBusinessParamList: proxy('AOP007009'),
    
    // 查询系统列表
    queryAllRelationSystemList: proxy('AOP007008'),
    
    // 查询系统接口列表
    queryRelationInterfaceList: proxy('AOP007010'),
    
    // 更新系统接口列表
    updateGatewayServiceState: proxy('AOP007011'),
    
    // 查询系统接口列表
    queryGatewayServiceAssetList: proxy('AOP007012'),
    
    // 查询系统接口列表
    addGatewayServiceAssetRel: proxy('AOP007013'),
    
    //各种枚举值接口
    quertEnumType: proxy("AOP005000"),
    
    //业务资产列表
    queryAssetsList: proxy('AOP004021'),
  },
  sessiondesign: {
    // 修改会话数据
    updateSessionInfo: proxy('AOP004034'),
    
    // 创建会话数据
    // addSessionInfo: proxy('AOP004030'),
    
    // 删除会话参数
    deleteSessionInfo: proxy('AOP004031'),
    
    // 查询会话参数
    querySessionInfo: proxy('AOP004032'),
    
    //底座列表
    quertTerminalList: proxy("AOP001013"),
    
    // 上传
    uploadUrl: proxyUrl("AOP004035"),
    
    // 下载
    exportSessionList: proxy("AOP004036", { responseType: "blob" }),
    
    // 创建会话 编辑会话
    createSession: proxy("AOP004080"),
    // 删除会话
    delSession: proxy("AOP004081"),
    // 会话 版本列表
    querySessionList: proxy("AOP004084"),
    // 创建版本 修改版本
    createVersionn: proxy("AOP004082"),
    // 删除版本
    delVersion: proxy("AOP004083"),
    //2.0
    queryHomeList: proxy('AOP004085'), // 查询数据源
    addSessionInfo: proxy('AOP004080'), // 添加/编辑类型
    queryOriginTypeList: proxy('AOP004084'), //查询类型列表
    delOriginType: proxy('AOP004081'), //删除类型
    addVersion: proxy('AOP004082'), //添加/编辑版本
    addDataInfo: proxy('AOP004030'), // 添加会话参数
    delVersion: proxy('AOP004083') //删除版本
  },
  dicmgmt:{
    //这里的字段后期需要更改，暂时无效
    addDataSet: proxy('AOP060158'), //新增数据集
    addSubsection: proxy('AOP060160'), //新增数据分段
    addField: proxy('AOP060162'), //新增数据字段
    addService: proxy('AOP060164'), //新增服务
    editList: proxy("AOP003056"),
    editDataSet: proxy('AOP060159'), //编辑数据集
    editSubsection: proxy('AOP060160'), //编辑数据分段
    editField: proxy('AOP060162'), //编辑数据字段
    editService: proxy('AOP060164'), //编辑服务

    
    //字典管理
    //数据集
    getDataSetCount: proxy("AOP060150"), //数据字典总数查询
    getMyDicList: proxy("AOP060151"), //字典管理列表
    getMyDataSetDetail: proxy("AOP060152"), //数据集详情
    addMydataSet: proxy("AOP060153"), //新增数据集
    editMydataSet: proxy("AOP060154"), //编辑数据集
    submitReview: proxy("AOP060171"), //提交评审
    revocaDataSet: proxy("AOP060173"), //撤回
    approDataSet: proxy("AOP060172"), //审批
    reDesignDataSet: proxy("AOP060175"), //重新设计

    //分段
    getSubStnList: proxy("AOP060156"), //分段列表
    addSubStn: proxy("AOP060158"), //新增分段
    editSubStn: proxy("AOP060159"), //编辑分段
    delSubStn: proxy("AOP060160"), //删除分段
    getSubStnDetail: proxy("AOP060157"), //分段详情
    //字段
    getMyFieldList: proxy("AOP060161"), //字典管理列表
    addMyField: proxy("AOP060163"), //新增字段
    editMyField: proxy("AOP060164"), //编辑字段
    getMyFieldDetail: proxy("AOP060162"), //字段详情
    delMyField: proxy("AOP060165"), //删除字段
    //服务
    getL5ServList: proxy("AOP060166"), //服务列表
    getServList: proxy("AOP060170"), //服务列表
    addL5Serv: proxy("AOP060167"), //新增服务
    editL5Serv: proxy("AOP060168"), //编辑服务
    delL5Serv: proxy("AOP060169"), //删除服务
    getApiDetail: proxy("MK001004"),

    getSysId: proxy("MK001038"), //D5直连服务 D5自有服务，根据服务类型查服务ID
    //获取报文头信息
    getHeaderInfo: proxy("MK008009"),
    // 获取格式列表
    getFormatList: proxy("MK008013"),

    addBusinessRule: proxy("AOP03203"), //新增业务规则
    addBusinessRule: proxy("MK001039"), //新增业务规则
    editBusinessRule: proxy("MK001040"), //修改业务规则
    getBusinessRuleInfo: proxy("MK001041"), //查询业务规则

    getParamsList: proxy("AOP060177"), //查询关联L5服务的paramsId数组

    //新版字典管理
    getDictCount: proxy("dataSetSubsecDictCount"), //查数量 集、字段、分段数量
    getSubFieldPage:proxy("selectDataSetSubFieldPage"), //数据集分段分页查询
    getFieldInfoBeanPage: proxy("selectDataFieldInfoBeanPage"),    //查询字段分页列表
    getDataSetCountStatcd: proxy("dataSetCoutWithStatCd"), //左侧菜单数量
    dataSetSubmitForApproval:proxy("dictionariesDataSetService/dataSetSubmitForApproval"), //提交评审
    dataSetApproval:proxy("dictionariesDataSetService/dataSetApproval"),    //审批
    dataSetApprovalCancel:proxy("dictionariesDataSetService/dataSetApprovalCancel"),   //撤销
    getDataSerList:proxy("dataSet/l5Service/query"),  //数据集服务列表
    getApiDetail: proxy("MK001004"),   //api详情
    getBusinessRuleInfo: proxy("MK001041"), //查询业务规则
    getPublicDictionaryExampleByVerifyRule: proxy("AOP050028"), // 公共数据字典示例值根据验证规则随机生成
    getDictionaryExampleByVerifyRule: proxy("AOP050029"), // 系统数据子弹示例值根据验证规则随机生成
    getDataSetList: proxy("selectDataSetInfoPage"),  //新版字典管理集列表
    getQueryList: proxy("fm1/l5Service/queryDict"), // 获得L5服务
    checkService: proxy("fm1/checkServiceParamAndDataSetRel"), // 校验数据集和L5服务
    addDataField: proxy("fm1/serviceParamAddDataField"), //关联数据集 L5服务信息
    exportMetaData: proxy("metaData/export"), // 元数据导出
    getObjectList: proxy("bizmodel/qryBizD1ObjectListV2"), // 查询D1下的所有对象列表
    qryBizObjectInfo: proxy("bizmodel/qryBizObjectInfoV2"), // 对象详情
    queryObjCountByBizDomainNo: proxy("bizmodel/objCountByBizDomainNo"), // 查询D1下各业务域对应的对象数量
    queryObjCountByObjClass: proxy("bizmodel/objCountByObjClass"), // 查询D1下各种分类的对象数量
  },
  dicmgmtDefine:{
    //字典定义
    getDataSetCount: proxy("AOP060150"), //数据字典总数查询
    //服务列表
    getServiceList:proxy("AOP070401"),  //服务列表
    get4bTransactionList:proxy("AOP070403"),  //4b交易列表

    //数据集
    getMyDicList: proxy("AOP060151"), //字典管理列表
    getDataSetList: proxy("AOP070402"), //数据集列表
    getMyDataSetDetail: proxy("AOP060152"), //数据集详情
    addMydataSet: proxy("AOP060153"), //新增数据集
    editMydataSet: proxy("AOP060154"), //编辑数据集
    delMydataSet: proxy("AOP060155"), //删除数据集

    //分段
    getSubStnList: proxy("AOP060156"), //分段列表
    addSubStn: proxy("AOP060158"), //新增分段
    editSubStn: proxy("AOP060159"), //编辑分段
    delSubStn: proxy("AOP060160"), //删除分段
    getSubStnDetail: proxy("AOP060157"), //分段详情
    //字段
    getMyFieldList: proxy("AOP060161"), //字典管理列表
    addMyField: proxy("AOP060163"), //新增字段
    editMyField: proxy("AOP060164"), //编辑字段
    getMyFieldDetail: proxy("AOP060162"), //字段详情
    delMyField: proxy("AOP060165"), //删除字段

    //服务
    getL5ServList: proxy("AOP060166"), //服务列表
    getServList: proxy("AOP060170"), //服务列表
    addL5Serv: proxy("AOP060167"), //新增服务
    editL5Serv: proxy("AOP060168"), //编辑服务
    delL5Serv: proxy("AOP060169"), //删除服务
    getApiDetail: proxy("MK001004"),
    getParamsList: proxy("AOP060177"),

    //下装设计添加服务——弹框选择服务
    checkService: proxy("AOP080102"),   //选择服务
    checkServiceDel: proxy("AOP080103"),   //选择服务删除
    addDownloadService:proxy("AOP060167"),   //新增L5服务

    //交易定义
    getDataParamsList:proxy("AOP060176") //编辑---添加参数 ---数据集选择
  },
  downloadDesign:{
    designConfirm:proxy("service/confirm"),   //待二确 --设计确认
    getServDetail:proxy("service/dataset/query"),   //待二确 --设计确认详情信息
    getTwoConfirmedServiceList:proxy("twoConfirmedServiceList/query"),  //待二确服务列表
    getOrderDetail:proxy("AOP020044"),    //待二确订单详情
    addL5Serv:proxy("AOP060167"),   //新增服务
    getSystemList:proxy("queryAllRelationShipSystemList"),      //获取直连系统列表
    checkSerUser:proxy("fieldUseCondition/check"), //检查字段是否被用
    getServiceList:proxy("l5Service/query"),      //服务列表
    getDataSerList:proxy("dataSet/l5Service/query"),  //数据集服务列表
    getAddLabel:proxy("addLabel"),       //直连服务新增
    getPersonList:proxy("IM06002"),    //二确页面获取人员
    getL5servList: proxy("queryApiListPageByBeltLine"), //获取L5服务列表
    // queryBizDomainList:proxy("business/queryBizDomainList"),  //获取业务线
    queryBizDomainList:proxy("business/queryBizDomainList"),  //获取业务线
    getQuoteNum:proxy("service/quoteNum/query"),             //获取被调用次数
    getPlatformFlg:proxy("AOP020050"),          //一确基本信息
    getTransRelation:proxy("AOP020054"),          //判断当前交易是否和其他资产关联
    delSer:proxy("l5Service/remove"),        //按服务列表删除服务
    getCustomerList:proxy("qryListByBranches"),  // 二确获取客户
    checkTrans: proxy("checkTranActionParam"), //校验交易

    
    getDataRuleList: proxy("AOP003066"),  // 获取校验规则
  },
  systemmgmt: {
    getBatchParmasDetail: proxy("AOP060101"), //审批参数详情查询
    getBatchDetailList: proxy("AOP060038"), //批次参数详情列表
    // 系统数据字典查询详情
    getSysDicDetail: proxy("AOP103101"),
    // 查询字典 
    getDictionaryList: proxy("AOP003055"),
    // 查询服务系统下的字典
    getSysDictionaryList: proxy("AOP003272"),
    // 数据字典模板下载、导出
    exportDictionaryList: proxy("AOP003098"),
    addDictionary: proxy("AOP003271"),
    // 创建、编辑数据字典时根据名称和所属分类进行查重
    duplicateChenck: proxy("AOP003265"),
    // 检查字典中文名称是否在公共字典存在
    dicNameCheck: proxy("AOP003287"),
    // 查询编辑
    editList: proxy("AOP003056"),
    // 删除数据字典与验证规则的关联关系
    deleteRuleRelation: proxy("AOP003261"),
    // 查询数据字典已配置的验证规则列表
    alreadyConfiguredList: proxy("AOP003061"),
    // 查询该数据字典未配置的验证规则列表
    notConfiguredList: proxy("AOP003062"),
    // 绑定数据字典和验证规则的关系
    bindingRule: proxy("AOP003260"),
    // 关联数据字典列表
    relevanceDictionaryList: proxy("AOP003263"),
    bindDictionary: proxy("AOP003273"),
    getTermsList: proxy("AOP003275"),
    addTerms: proxy("AOP003276"),
    editTerms: proxy("AOP003268"),
    deleTerms: proxy("AOP003278"),

    // 升级数据字典分类
    upgradeClassify: proxy("AOP003288"),
    // 检查升级数据字典dictno
    upgradeCheck: proxy("AOP003289"),

    // 业务对象
    getBussinessobjList: proxy("AOP003280"),
    addBussinessobj: proxy("AOP003282"),
    modBussinessobj: proxy("AOP003285"),
    getBussinessobjDetail: proxy("AOP003283"),
    deleteBussinessobj: proxy("AOP003284"),
    getDomainList: proxy("AOP003286"),

    //系统上传关系流程图
    handleObjUrl: proxy("MK008010"),

    //获取报文头信息
    // getHeaderInfo: proxy("MK008009"),
    getHeaderInfo: proxy("MK0080091"),
    //编辑报文头信息
    modHeaderInfo: proxy("MK008008"),
    // 获取格式列表
    getFormatList: proxy("MK008013"),

    //API分组
    getApiGroupList: proxy("MK005002"),
    addApiGroup: proxy("MK005001"),
    modApiGroup: proxy("MK005003"),
    delApiGroup: proxy("MK005004"),
    getApiGroupDetail: proxy("MK005005"),

    //分类
    // 数据分类列表查询
    queryClassifyList: proxy("AOP003070"),
    // 创建数据分类
    createClassify: proxy("AOP003071"),
    // 获取数据分类类型列表
    getClassifyTypeList: proxy("AOP003072"),
    // 数据分类迁移
    classifyTransfer: proxy("AOP003073"),
    // 根据ID查询单个数据分类信息
    getClassifyDetail: proxy("AOP003074"),
    // 编辑数据分类
    editClassifyDetail: proxy("AOP003075"),
    // 删除数据分类
    deleteClassifyDetail: proxy("AOP003076"),

    //规则
    // 创建规则分类 
    addRuleClassification: proxy("AOP003058"),
    // 查询规则分类 （无分页）
    getRuleClassification: proxy("AOP003059"),
    // 查询规则分类 （分页）
    pageGetRuleClassification: proxy("AOP003060"),
    // 创建验证规则
    addRule: proxy("AOP003064"),
    // 查询验证规则(分页)
    getRuleList: proxy("AOP003066"),
    // 查询验证规则(根据id)
    idGetRuleList: proxy("AOP003067"),
    // 编辑验证规则
    editRule: proxy("AOP003068"),
    // 删除验证规则
    deleteRule: proxy("AOP003069"),
    // 规则分类迁移
    ruleClassifyTransfer: proxy("AOP003087"),
    // 模板下载，导出
    templateDownload: proxy("AOP003092"),
    // 编辑规则分类信息
    editRuleClassification: proxy("AOP003093"),
    // 规则分类删除
    deleteRuleClassification: proxy("AOP003094"),
    // 系统导出数据字典
    exportSysDic: proxy("AOP003295"),

    // 类别接口
    getTypeList: proxy("MK104010"),
    addType: proxy("MK104007"),
    modType: proxy("MK104011"),
    delType: proxy("MK104008"),

    // 领域管理列表（分页）
    getDomainManagementList: proxy("AOP003250"),
    // 新增领域
    addDomainInfo: proxy("AOP003251"),
    // 查看领域信息
    getDomainInfoByDomainId: proxy("AOP003252"),
    // 编辑领域信息
    editDomainInfo: proxy("AOP003253"),
    // 删除领域
    deleteDomainInfoByDomainId: proxy("AOP003254"),
    // 关联应用列表(分页)
    getRelatedAppList: proxy("AOP003255"),
    // 关联应用列表(分页)
    getDomainInfoListByAppId: proxy("AOP003264"),
    // 数据字典示例
    getDictExampleList: proxy("AOP003130"),
    addDictExample: proxy("AOP003131"),
    modDictExample: proxy("AOP003132"),
    delDictExample: proxy("AOP003133"),
    sortDictExample: proxy("AOP003134"),

    // 领域管理列表（分页）
    getDomainManagementList: proxy("MK206001"),
    // 新增领域
    addDomainInfo: proxy("AOP003251"),
    // 查看领域信息
    getDomainInfoByDomainId: proxy("AOP003252"),
    // 编辑领域信息
    editDomainInfo: proxy("AOP003253"),
    // 删除领域
    deleteDomainInfoByDomainId: proxy("AOP003254"),
    // 绑定领域和api
    bindDomainApi: proxy("AOP206003"),
    delBindDomainApi: proxy("AOP206002"),

    // 系统数据字典页签下
    // 字典查询
    getSysDicList: proxy("AOP204001"),
    modSysDic: proxy("AOP204002"),
    delSysDic: proxy("AOP204003"),
    upgradeSysDic: proxy("AOP204004"),
    addSysDic: proxy("AOP204005"),

    // 新增字典 
    addPublicDictionary: proxy("AOP003057"),
    // 编辑保存
    editPublicDictionary: proxy("AOP003054"),
    // 删除字典
    deletePublicDictionary: proxy("AOP003053"),

    getStandardDicList: proxy("MK207008"),
    agreeStandardDic: proxy("MK207009"),

    // 数据集
    addDataList: proxy("AOP060001"),
    delDataDic: proxy("AOP060002"),
    delDataList: proxy("AOP060003"),
    addDataDic: proxy("AOP060005"),
    modDataList: proxy("AOP060004"),
    getDataListDetail: proxy("AOP060007"),  // 数据集基本信息查询
    getDataListDetailList: proxy("AOP060006"), // 数据集数据分页查询
    getDataList: proxy("AOP060008"),
  },
  d1interation,
  d1workspace,
  d4product,
  datadict,
  controlWorkbench,

}
