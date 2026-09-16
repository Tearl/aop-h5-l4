import { proxy } from "../proxy";

export default {
    // 活动功能详情
    queryFuncAssetDetail: proxy("fm1/asset/queryFuncAssetDetail"),
    // 直连系统详情
    queryAllStandardSystemList: proxy(
        "L5/standardSystemServiceI/queryAllStandardSystemList"
    ),
    // 后端开发-交易列表
    queryApplicationTransferList: proxy("authTradeInfoQuery"),
    // 下装开发-工程应用列表
    queryApplicationFunctionList: proxy(
        "functionDevelopWorkServiceI/queryFunctionRelInfo"
    ),
    // 下装开发-开发代码分支列表
    queryDevelopBranchList: proxy("fnctApplyInfoBranchQuery"),
    // 后端开发-开发部署申请提交
    queryApplyDevelopSubmit: proxy("applyDevelopDeploy"),
    // 后端开发-生成代码信息列表查询
    queryApplicationSaveCodeList: proxy("tradeListByAppId"),
    // 后端开发-生成代码信息保存
    queryApplicationSaveCode: proxy("updateEngNm"),
    // 后端开发-代码历史列表查询
    queryAppyBranchCodeHistoryList: proxy("applyInfoBranchQuery"),
    // 后端开发-代码生成
    queryAppyBranchCodeSave: proxy("genCode"),
    // 后端开发-代码下载
    queryAppyBranchCodeDownLoad: proxy("downUrl"),
    // 后端开发-部署历史列表查询
    queryApplyDeploymentHistoryList: proxy("developDeployHistory"),
    // 查看配置-工程应用基本信息
    queryLookDisposeDetailInfo: proxy("TCJY000003"),
    // 查看配置-工程应用配置中心顶部申请列表
    queryLookDisposeList: proxy("TCJY000004"),
    // 查看配置-配置中心地址信息
    queryLookDisposeUrlInfo: proxy("TCJY000005"),
    // 查看配置-配置中心配置列表
    queryLookDisposeUrlInfoList: proxy("TCJY000006"),
    // 查看配置-配置中心会话数据列表
    queryLookDisposeSessiondata: proxy("TCJY000020"),
    // 查看配置-代码仓库基础分支信息
    queryLookDisposeBranchInfo: proxy("TCJY000009"),
    // 查看配置-代码仓库基础分支列表
    queryLookDisposeBranchList: proxy("TCJY000010"),
    // 查看配置-环境资源配置列表
    queryLookDisposeConfigurationList: proxy("TCJY000012"),
    // 直连适配-服务列表查询
    queryConnectServiceList: proxy("adaptAllocationQuery"),
    // 直连适配-基本信息查询
    queryConnectApplyInfo: proxy("adaptApplyInfoQuery"), // applyInfoQuery
    // 直连适配-开发部署分支详细信息查询
    queryConnectGitInfo: proxy("directAppGitInfo"),
    //代码生成
    submitAppyBranchCodeSave: proxy("genCode"),
    queryDataDictionary: proxy("fm1/dataSetSubField/query"), //查询数据字典
    querySplitWord: proxy("getSplitWord"), //查询中文名称
    queryCodeGenerationHistory: proxy(
        "L5/autoGenerateServiceI/queryAutoGenerateFileList"
    ), //代码生成历史记录查询
    // 活动导入设计
    queryAssetImportDesign: proxy("assetImportDesign"),
    // 申请配置
    queryApplyConfiguration: proxy("applyConfiguration"),
    // 申请配置查询
    queryApplyConfigurationQuery: proxy("applyConfigurationQuery"),
    // 活动状态查询
    queryAssetStatusQuery: proxy("assetStatusQuery"),
    // 后端交易列表-重新设计
    queryBackUpTran: proxy("backUpTran"),
    // 后端交易列表-设计完成
    queryRegisterTran: proxy("registerTran"),
    // 查询活动设计产物信息
    queryDesignInfo: proxy("AOP020048"),
    // 生成代码交易重复校验
    checkCodeGenerateRecord: proxy("checkCodeGenerateRecord"),
    // 查询要素列表
    getElementList: proxy("AOP020014"),
    // 查询布局列表
    getLyoutList: proxy("AOP020021"),
    // 查询交互
    eventList: proxy("AOP020018"),
    // 新增4i和接口的关系
    connectNew4BList: proxy("AOP008501"),
    // 删除4i和接口的关系
    delConnectNew4BList: proxy("AOP008502"),
    // 查询返回关联的交互处理列表
    queryConnect4BtList: proxy("AOP008503"),
    // 查询返回关联的接口列表
    queryConnect4BServicetList: proxy("AOP008504"),
    // 查询后端的交易关联接口
    queryApiInfoListByPageList: proxy("bizmodel/devops/queryApiInfoListByPage"),
    // 新增d4接口保存
    intAddFnctD4ApiInfo: proxy("bizmodel/devops/addFnctD4ApiInfo"),
    // 新增接口时查询业务域后端接口列表
    intQueryBeltLineApiInfoListByPage: proxy(
        "bizmodel/devops/queryBeltLineApiInfoListByPage"
    ),
    // 新增接口时查询工程应用名称
    intQueryProjectIdNameInfo: proxy("bizmodel/devops/queryProjectIdNameInfo"),
    // 删除d4接口
    deleteFnctD4ApiInfo: proxy("bizmodel/devops/deleteFnctD4ApiInfo"),
    // 新建接口选择列表保存
    chooseD4ApiInfoCommit: proxy("bizmodel/devops/chooseD4ApiInfoCommit"),
    //查询主流程
    queryMainFlow: proxy("devopsEditor/queryMainFlow"),
    //接口状态修改
    apiInfoStateModify: proxy("bizmodel/devops/apiInfoStateModify"),
    addOrCopyMessageTemplate: proxy(
        "messageTemplateManageServiceI/addOrCopyMessageTemplate"
    ),
    queryMessageTemplatePageList: proxy(
        "messageTemplateManageServiceI/queryMessageTemplatePageList"
    ),
    removeMessageTemplate: proxy(
        "messageTemplateManageServiceI/removeMessageTemplate"
    ),
    queryMessageTemplateBaseInfo: proxy(
        "messageTemplateManageServiceI/queryMessageTemplateBaseInfo"
    ),
    queryMessageTemplateParamList: proxy(
        "messageTemplateManageServiceI/queryMessageTemplateParamList"
    ),
    queryMessageTemplateRelAppPageList: proxy(
        "messageTemplateManageServiceI/queryMessageTemplateRelAppPageList"
    ),
    commitMessageTemplateDetailInfo: proxy(
        "messageTemplateManageServiceI/commitMessageTemplateDetailInfo"
    ),
    getBizAppList: proxy("business/queryBizAppList"),
    queryFunctionDemandAchieveInterfaceInfoList: proxy(
        "functionDemandAchieveServiceI/queryFunctionDemandAchieveInterfaceInfoList"
    ),
    addFunctionDemandAchieveRel: proxy(
        "functionDemandAchieveServiceI/addFunctionDemandAchieveRel"
    ),
    queryInterfaceRelFunctionDemandList: proxy(
        "functionDemandAchieveServiceI/queryInterfaceRelFunctionDemandList"
    ),
    updateFunctionTaskStatus: proxy(
        "functionDevelopWorkServiceI/updateFunctionTaskStatus"
    ),
    commonVariableQuery: proxy("devops/commonVariableQuery"),
    submitSingleContentReviewResult: proxy(
        "systemDesignReviewServiceI/submitSingleContentReviewResult"
    ),
    submitFinalReviewResult: proxy(
        "systemDesignReviewServiceI/submitFinalReviewResult"
    ),
    querySingleContentReviewResult: proxy(
        "systemDesignReviewServiceI/querySingleContentReviewResult"
    ),
    queryRuleCheckResult: proxy("ruleCheckServiceI/queryRuleCheckResult"),
    queryBizDomainList: proxy("fm1/business/queryBizDomainList"),
    confirmAll: proxy(
        "systemDesignReviewServiceI/oneKeySubmitSytemDesignReviewResult"
    ),
};
