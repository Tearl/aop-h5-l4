/**zhangyandong copy */
import { proxy, proxyUrl } from '../proxy'

export default {
    getNewRelationServList: proxy("devopsEditor/queryBindServiceList"), //接口列表
    // 111
    newuploadAssetImageUrl: proxyUrl("devops/uploadFunctionFile"), // 上传流程描述地图图片
    // 查询功能流程图基本信息 初始化查询
    qryBizFunlowDetail: proxy(
        "fnctBizFlowChartManageServiceI/queryFnctFlowChartBaseInfo"
    ),
    // 查询功能流程图明细信息
    queryFnctFlowChartDetailInfo: proxy(
        "fnctBizFlowChartManageServiceI/queryFnctFlowChartDetailInfo"
    ),
    // 保存功能流程图基本信息
    commitFnctFlowChartBaseInfo: proxy(
        "fnctBizFlowChartManageServiceI/commitFnctFlowChartBaseInfo"
    ),
    // 保存功能流程图明细信息
    commitFnctFlowChartDetailInfo: proxy(
        "fnctBizFlowChartManageServiceI/commitFnctFlowChartDetailInfo"
    ),
    // stop

    // 功能-交易列表查询
    queryFunctionBizTradeList: proxy(
        "bizTradeManageServiceI/queryFunctionBizTradeList"
    ),
    // 功能-交易实现情况保存
    saveTradeAchieveSituation: proxy(
        "bizTradeManageServiceI/saveTradeAchieveSituation"
    ),
    // 功能-接口状态修改
    apiInfoStateModify: proxy("bizmodel/devops/apiInfoStateModify"),
    // 功能-接口和交易关系删除
    removeInterfaceAndTradeRel: proxy(
        "bizTradeManageServiceI/removeInterfaceAndTradeRel"
    ),
    // 功能-接口关联交易列表查询
    queryInterfaceRelTradeList: proxy(
        "bizTradeManageServiceI/queryInterfaceRelTradeList"
    ),
    // 功能-业务交易实现情况
    queryBizTradeAchieveSituation: proxy(
        "bizTradeManageServiceI/queryBizTradeAchieveSituation"
    ),
    // 系统设计提交
    submitSystemDesign: proxy("systemDesignReviewServiceI/submitSystemDesign"),
    // 接口查询交互
    queryServiceEvents: proxy(
        "bizTradeManageServiceI/queryInterfaceBindEventList"
    ),
    // 接口下的业务规则查询
    queryInterfaceRuleListS4: proxy(
        "s5RuleManageServiceI/queryInterfaceRuleList"
    ),
    // 查询功能下规则列表
    queryFunctionRuleListS5: proxy(
        "s5RuleManageServiceI/queryFunctionRuleList"
    ),
    // / 查询接口规则服务列表
    queryInterfaceRuleServiceListS5: proxy(
        "s5RuleManageServiceI/queryInterfaceRuleServiceList"
    ),
    // 查询规则详情接口
    queryTreeBaseInfo: proxy("fm1/queryTreeBaseInfo"),
    // 服务关联规则列表查询
    queryRulesByServicesS5: proxy(
        "L5/ownBindRulesController/queryRulesByServices"
    ),
    // 系统设计状态查询
    querySystemDesignStatus: proxy(
        "systemDesignReviewServiceI/querySystemDesignStatus"
    ),

    //=== 业务流程 ===
    saveFlowChart: proxy("bizmodel/saveFlowNodeList"), // 保存流程图
    getFlowCahrt: proxy("bizmodel/getFlowNodeList"), // 查询流程图
    getFlowNodeCode: proxy("bizmodel/getFlowNodeCode"), //获取流程节点Id
    qryVoucherList: proxy("bizmodel/qryVoucherList"), //查询凭证列表
    qryVoucherByNodeList: proxy("bizmodel/qryVoucherByNodeList"), //查询节点凭证列表
    insertVoucher: proxy("bizmodel/insertVoucher"), //新增凭证
    updateVoucher: proxy("bizmodel/updateVoucher"), //修改凭证
    delVoucher: proxy("bizmodel/delVoucher"), //删除凭证
    getVoucherInfo: proxy("bizmodel/getVoucherInfo"), //凭证详情
    qryBizRuleInfoListV2: proxy("bizmodel/qryBizRuleInfoListV2"), //规则详情
    qryBizObjectListV2: proxy("bizmodel/qryBizObjectListV2"), //对象列表
    delBizObject: proxy("bizmodel/delBizObjectV2"), //对象删除
    qryFlowList: proxy("bizmodel/qryFlowList"), //节点关联流程
    //=== 业务流程 ===

    //=== 业务流程关系 ===
    saveRelationChart: proxy("bizmodel/saveFlowNodeList"),
    queryRelationChart: proxy("bizmodel/getFlowNodeList"),
    queryRelationChartList: proxy("bizmodel/getFlowNodeCodeList"),
    //=== 业务流程关系 ===

    //=== 领域模型设计 ===
    saveBatchObject: proxy("bizmodel/saveBizObjectListV2"), //对象批量保存
    getBizObjectList: proxy("bizmodel/qryBizObjectInfoListV2"), //对象批量获取

    qrySysBizObjectInfoList: proxy(
        "L5/sysBizObjectInfoServiceI/qrySysBizObjectInfoList"
    ), //自有L5研发对象批量获取
    saveSysBizObjectRelLocationList: proxy(
        "L5/sysBizObjectInfoServiceI/saveSysBizObjectRelLocationList"
    ), //自有L5研发对象批量获取

    //S4系统设计结果校验 2024年1月11日
    checkS4SystemDesignResult: proxy(
        "systemDesignReviewServiceI/checkS4SystemDesignResult"
    ), //S4系统设计结果校验
    // S5系统设计结果校验
    checkS5SystemDesignResult: proxy(
        "systemDesignReviewServiceI/checkS5SystemDesignResult"
    ),
    // 新增消息记录
    addMessageRecord: proxy("systemDesignReviewServiceI/addMessageRecord"),
    // 读取消息记录
    readMessage: proxy("systemDesignReviewServiceI/readMessage"),
    // 查询最新消息
    queryLastMessage: proxy("systemDesignReviewServiceI/queryLastMessage"),
    // 根据活动，功能，交易，服务编码或名称查询服务列表
    pageApiInfo: proxy("businessAppServiceI/pageApiInfo"),
    // 查询活动的功能列表
    getAssetsFunctionInfoList: proxy(
        "bizmodel/devops/queryAuthAssetsFunctionInfoList"
    ),
    addFuntionJobCommitFlow: proxy("addFuntionJobCommitFlow"), //记录流水
    submitFunctionIntoTest: proxy(
        "assetStusManageServiceI/submitFunctionIntoTest"
    ), //提交开发完成

    processPicUpload: proxy("devops/uploadFile"),
    queryFunctionWorkInfoPageList: proxy(
        "functionDevelopWorkServiceI/queryFunctionWorkInfoPageList"
    ),
    queryFunctionHistoryVersionList: proxy("dataCopyServiceI/queryFunctionHistoryVersionList"),
    copyFunctionJobData: proxy("dataCopyServiceI/copyFunctionJobData"),

     queryS4ExtendInfo: proxy("standard/s4/queryS4ExtendInfo"),   //S4服务扩展信息查询
    queryInterfaceAttributeList: proxy("interfaceAttributeManageServiceI/queryInterfaceAttributeList"),    //接口属性新增接口
        queryBizDomainList: proxy("fm1/business/queryBizDomainList"),
};
