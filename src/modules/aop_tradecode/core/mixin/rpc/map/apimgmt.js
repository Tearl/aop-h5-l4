import { proxy, proxyUrl } from '../proxy'

export default {
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
}