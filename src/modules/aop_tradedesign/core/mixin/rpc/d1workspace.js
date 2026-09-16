import { proxy, proxyUrl } from './proxy'

export default { 
    // 导入功能Excel模板
    importFuncExcel: proxyUrl('AOP008996'),
    d1AppBeInfoLists: proxy('AOP010001'),
    d1CreateModuleFunc: proxy('AOP010002'),
    d1ModuleList: proxy('AOP010006'),
    d1ModuleFuncList: proxy('AOP010007'),
    //渠道数据获取
    quertEnumType: proxy("AOP005000"),
    // 应用权限列表
    d1PermissList: proxy('AOP010005'),
    // 新增应用管理员
    addD1PermissAdmin: proxy('AOP010003'),
    // 删除应用管理员
    delD1PermissAdmin: proxy('AOP010004'),
    // 新增模块用户权限（单个）
    addD1ModulePermissUser: proxy('AOP010008'),
    // 删除模块用户权限（单个）
    delD1ModulePermissUser: proxy('AOP010009'),
    // 模块下用户批量编辑
    d1ModuleUserEdit: proxy('AOP010010'),
    // 模块用户权限列表
    moduleUserInfos: proxy('AOP010011'),

    d1AppJionInfoLists: proxy('AOP010012'),
    d1FuncDetail: proxy('AOP010013'),
    belongMatrix: proxy('AOP010014'),
    queryBelongMatrix: proxy('AOP010015'),
    d1ModuleDetail: proxy('AOP010016'),
    d1ModuleSubmitCheck: proxy('AOP010017'),
    d1ModuleSubmitRecord: proxy('AOP010018'),
    d1ManageCheckList: proxy('AOP010019'),
    d1ModuleCheck: proxy('AOP010020'),
    moduleSubmitRevoke: proxy('AOP010021'),
    delD1func: proxy('AOP010023'),
    d1AppSubmitCheck: proxy('AOP010024'),
    d1FuncImport: proxyUrl('AOP008994'),
    d1FuncImportList: proxy('AOP010022'),
    //模块数据集导入
    moduleDataImport: proxy('AOP060011'),
    moduleServiceImport: proxy('AOP060013'),
    //应用服务集导入
    appSeerviceImport: proxy('AOP060023'),
    //应用数据集导入
    appDataImport: proxy('AOP060016'),
    // 模块数据集列表
    moduleSetDateList: proxy('AOP060033'),
    moduleServiceList: proxy('MK060009'),
    appSetDateList: proxy('AOP060032'),
    appServiceList: proxy('MK060007'),
    //需求评估列表
    demandVoucherList: proxy('AOP010025'),
    queryDemandVouchInfo: proxy('AOP010026'),
    userStoryList: proxy('AOP010027'),
    queryUserStoryInfo: proxy('AOP010028'),
    d1M3Eintragungantrag: proxy('AOP010000'),
    d1AppInfo: proxy('AOP009991'),
    d1RecallDesign: proxy('AOP010029'),
    d1rejectReason: proxy('AOP009992'),
    d1AppInfos: proxy('AOP009993'),
    d1AppServiceDel: proxy('AOP060029'),
    d1ModuleServiceDel: proxy('AOP060027'),
    d1SetDataDel: proxy('AOP060026'),
    d1ServiceApiDetail: proxy('MK001004'),
    choseUsersList: proxy('IM03008'),
    funcListSearch: proxy('AOP009995'),
    appHistoryVersion: proxy('AOP010091'),
    moduleHistoryVersion: proxy('AOP010092'),
    queryMaxInfo: proxy('AOP009994'),
    queryVersionFuncs: proxy('AOP010093'),
    historyVersionChose: proxy('AOP010094'),
    queryDataDictionary: proxy('AOP003055')
}
