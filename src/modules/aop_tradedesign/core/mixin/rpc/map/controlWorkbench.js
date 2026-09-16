import { proxy, proxyUrl } from "../proxy";
export default {
    qryPageSysBizObjectInfoListFilter: proxy(
        "L5/sysBizObjectInfoServiceI/qryPageSysBizObjectInfoListFilter"
    ), //创建业务对象分析
    saveBizObjectInfoV2: proxy("bizmodel/saveBizObjectInfoV2"), // 保存业务对象信息
    qryBizObjectV2InfoList: proxy("bizmodel/qryBizObjectV2InfoList"), // 业务域下业务对象列表不分页查询
    qryBizObjectV2BaseInfoList: proxy("bizmodel/qryBizObjectV2BaseInfoList"),
    qryPageSysBizObjectInfoList: proxy(
        "L5/sysBizObjectInfoServiceI/qryPageSysBizObjectInfoList"
    ), //创建业务对象分析
    qryPageSysBizObjectInfoListFilterAttr: proxy(
        "L5/sysBizObjectInfoServiceI/qryPageSysBizObjectInfoListFilterAttr"
    ), //创建业务对象分析
    qryObjBizObjectInfoV2: proxy("bizmodel/qryBizObjectInfoV2"), //查询业务对象集详情
    dataDictionaryFieldAddApply: proxy(
        "dataDictionaryService/dataDictionaryFieldAddApply"
    ), // 数据字典项申请添加
    dataDictionaryFieldListQuery: proxy(
        "dataDictionaryService/dataDictionaryFieldListQuery"
    ), // 数据字典项列表查询
    qryHomeApprovalStatistic: proxy(
        "controlWorkbench/qryHomeApprovalStatistic"
    ), // 首页审批统计
    qryApprovalFlowPageList: proxy("controlWorkbench/qryApprovalFlowPageList"), // 审批流列表查询
    qryApprovalDetail: proxy("controlWorkbench/qryApprovalDetail"), // 审批详情查询
    qryBizD1ObjectListV2: proxy("bizmodel/qryBizD1ObjectListV2"), // 业务域下业务对象列表分页查询
    // qryApprovalDetail: proxy("controlWorkbench/qryApprovalDetail"), // 审批详情查询
    submitApproval: proxy("controlWorkbench/submitApproval"), // 审批提交
    qryBehaviorInfoDetail: proxy("bizmodel/qryBehaviorInfoDetail"), // 查询行为详情
    qryObeAllList: proxy("bizmodel/qryObeAllList"), // 查询对象行为列表
    qryApplySource: proxy("controlWorkbench/qryApplySource"), // 查询申请来源
    qrySysBizObjectInfo: proxy(
        "L5/sysBizObjectInfoServiceI/qrySysBizObjectInfo"
    ),
    qrySysObjBizObjRel: proxy("bizmodel/qrySysObjBizObjRel"),
    saveSysBizObjectInfo: proxy(
        "L5/sysBizObjectInfoServiceI/saveSysBizObjectInfo"
    ),
    qrySysBizObjectInfo: proxy(
        "L5/sysBizObjectInfoServiceI/qrySysBizObjectInfo"
    ),
    queryL5ProjectGroupList: proxy("l5GroupServiceI/queryL5ProjectGroupList"),
    saveS6ServiceInfo: proxy("businessModelService/saveS6ServiceInfo"),
    qryS6ServiceInfoPage: proxy("businessModelService/qryS6ServiceInfoPage"),
    queryBizDomainList: proxy("fm1/business/queryBizDomainList"),
    qryBizObjectBaseList: proxy("finMallBizObjectService/qryBizObjectBaseList"), // 查询业务对象基础信息列表
    dataDictionaryFieldDetailQuery: proxy(
        "dataDictionaryService/dataDictionaryFieldDetailQuery"
    ), // 数据字典-数据字典项详情查询
    addDataDictionaryItemApplyApproval: proxy(
        "dataDictionaryService/addDataDictionaryItemApplyApproval"
    ),
    addDataDictionaryItemAndResponse: proxy(
        "dataDictionaryService/addDataDictionaryItemAndResponse"
    ),
    queryAppAndBlgClsList: proxy("L5/centerServiceI/queryAppAndBlgClsList"),
    qryApplySourceExtend: proxy("controlWorkbench/qryApplySourceExtend"), // 查询申请来源扩展
    qryCurBizObjectV2FieldList: proxy(
        "bizModelFlowServiceI/qryCurBizObjectV2FieldList"
    ), // 查询当前业务对象V2字段
    // qryDatasetList: proxy("bizmodel/"), //查询业务模型下的数据集分页列表
    saveAggregationBizObjRel: proxy(
        "finMallBizObjectService/saveAggregationBizObjRel"
    ),
    qryPageSysBizObjectInfoList: proxy(
        "L5/sysBizObjectInfoServiceI/qryPageSysBizObjectInfoList"
    ), //创建业务对象分析
    qryBizObjectV2FieldList: proxy("bizModelFlowServiceI/qryBizObjectV2FieldList"),  // 关键业务的业务对象属性列表
    qryBizObjectV2Field: proxy("bizModelFlowServiceI/qryBizObjectV2Field"),  // 查询对象属性列表
    qryApprovalFlowPageList:proxy('controlWorkbench/qryApprovalFlowPageList'),
    updateBizObjectSysObjRel: proxy("bizModelFlowServiceI/updateBizObjectSysObjRel"),
};
