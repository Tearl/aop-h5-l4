import { proxy } from '../proxy'

export default {
    // 架构管理 - 系统全景
    getSystemList: proxy('fm1/arch/archSystemService/getSystemList'),
    getSystemDetail: proxy('fm1/arch/archSystemService/getSystemDetail'),
    getSystemVersionListByOrg: proxy('fm1/arch/archSystemService/getSystemVersionListByOrg'),
    getArchitectureDiagram: proxy('fm1/arch/archSystemService/getArchitectureDiagram'),
    getIntegrationArch: proxy('fm1/arch/archSystemService/getIntegrationArch'),
    getFuncArch: proxy('fm1/arch/archSystemService/getFuncArch'),
    getTechArchDiagram: proxy('fm1/arch/archSystemService/getTechArchDiagram'),
    getTechStackList: proxy('fm1/arch/archTechService/getTechStackList'),
    getTechStackDetail: proxy('fm1/arch/archSystemService/getTechStackDetail'),
    getTechStackLogicalResources: proxy('fm1/arch/archSystemService/getTechStackLogicalResources'),
    getReportOutline: proxy('fm1/arch/archSystemService/getReportOutline'),
    getDesignReport: proxy('fm1/arch/archSystemService/getDesignReport'),

    // 架构管理 - 产品模型
    getProductModelTree: proxy('fm1/arch/archProductService/getProductModelTree'),
    getProductNodeDetail: proxy('fm1/arch/archProductService/getProductNodeDetail'),

    // 架构管理 - 流程模型
    getBizDomainPanorama: proxy('fm1/arch/archProcessService/getBizDomainPanorama'),
    getProcessModelTree: proxy('fm1/arch/archProcessService/getProcessModelTree'),
    getProcessNodeDetail: proxy('fm1/arch/archProcessService/getProcessNodeDetail'),
    qryModelDesignFlow: proxy('businessModelDesignService/qryModelDesignFlow'),

    // 架构管理 - 能力模型
    getCapabilityModelTree: proxy('fm1/arch/archCapabilityService/getCapabilityModelTree'),
    getCapabilityNodeDetail: proxy('fm1/arch/archCapabilityService/getCapabilityNodeDetail'),
    getBusinessFunctionTree: proxy('fm1/arch/archCapabilityService/getBusinessFunctionTree'),

    // 架构管理 - 应用架构
    getAppModelTree: proxy('fm1/arch/archAppService/getAppModelTree'),
    getAppNodeDetail: proxy('fm1/arch/archAppService/getAppNodeDetail'),
    getAppModeDetail: proxy('fm1/arch/archAppService/getAppModeDetail'),
    getAppModeApiList: proxy('fm1/arch/archAppService/getAppModeApiList'),
    getServiceList: proxy('fm1/arch/archAppService/getServiceList'),

    // 架构管理 - 数据架构
    queryBizDomainList: proxy('fm1/business/queryBizDomainList'),
    queryAppAndBlgClsList: proxy('L5/centerServiceI/queryAppAndBlgClsList'),
    queryOwnL5ProjectPageList: proxy('L5/centerServiceI/queryAppAndBlgClsList'),
    qryBizObjectEditList: proxy('finMallBizObjectService/qryBizObjectEditList'),
    qrySysBizObjectInfoList: proxy('L5/sysBizObjectInfoServiceI/qrySysBizObjectInfoList'),
    dataDictionaryFieldListQuery: proxy('dataDictionaryService/dataDictionaryFieldListQuery'),
    saveSysBizObjectInfo: proxy('L5/sysBizObjectInfoServiceI/saveSysBizObjectInfo'),
    qrySysBizObjectInfo: proxy('L5/sysBizObjectInfoServiceI/qrySysBizObjectInfo'),
    saveS6ServiceInfo: proxy('businessModelService/saveS6ServiceInfo'),
    saveBizObjectInfoV2: proxy('bizmodel/saveBizObjectInfoV2'),
    qryBizObjectBaseList: proxy('finMallBizObjectService/qryBizObjectBaseList'),
    delBizObjectV2: proxy('bizmodel/delBizObjectV2'),
    qryBizObjectInfoV2: proxy('bizmodel/qryBizObjectInfoV2'),
    qrySysBizObjAttributeList: proxy('L5/sysBizObjectInfoServiceI/qrySysBizObjAttributeList'),
    qryBizObjAbePageByObjId: proxy('finMallBizObjectService/qryBizObjAbePageByObjId'),
    qryPageSysBizObjectInfoList: proxy('L5/sysBizObjectInfoServiceI/qryPageSysBizObjectInfoList'),
    qryS6ServiceInfoPage: proxy('businessModelService/qryS6ServiceInfoPage'),
    saveObjLocationInfo: proxy('finMallBizObjectService/saveObjLocationInfo'),
    updateBizAggregationInfo: proxy('finMallBizObjectService/updateBizAggregationInfo'),
    qryAggObjRelList: proxy('finMallBizObjectService/qryAggObjRelList'),
    saveAggregationBizObjRel: proxy('finMallBizObjectService/saveAggregationBizObjRel'),
    delAggregationObjRel: proxy('finMallBizObjectService/delAggregationObjRel'),
    delBizObjRel: proxy('finMallBizObjectService/delBizObjRel'),
    updateBizObjRelEdgeProps: proxy('finMallBizObjectService/updateBizObjRelEdgeProps'),
    batchDelBizObj: proxy('finMallBizObjectService/batchDelBizObj'),
    qryBizObjectBasePage: proxy('finMallBizObjectService/qryBizObjectBasePage'),
    saveQuoteBizObj: proxy('finMallBizObjectService/saveQuoteBizObj'),
    delQuoteBizObj: proxy('finMallBizObjectService/delQuoteBizObj'),
    qryBizObjAppFunPage: proxy('finMallBizObjectService/qryBizObjAppFunPage'),
    qryFunCtPtStList: proxy('finMallBizObjectService/qryFunCtPtStList'),
    qryCtrPtSouData: proxy('businessModelDesignService/qryCtrPtSouData'),
    getDataEntityTree: proxy('fm1/arch/archDataService/getDataEntityTree'),
    getDataEntityDetail: proxy('fm1/arch/archDataService/getDataEntityDetail'),
    getDataEntityAttrs: proxy('fm1/arch/archDataService/getDataEntityAttrs'),

    // 架构管理 - 技术架构
    getTechModelTree: proxy('fm1/arch/archTechService/getTechModelTree'),
    getTechInstanceMatrix: proxy('fm1/arch/archTechService/getTechInstanceMatrix'),
    getTechNodeDetail: proxy('fm1/arch/archTechService/getTechNodeDetail'),
    getTechStackNodeDetail: proxy('fm1/arch/archTechService/getTechStackNodeDetail'),
    getTechLogicalResourcesDetail: proxy('fm1/arch/archTechService/getTechLogicalResourcesDetail')
}
