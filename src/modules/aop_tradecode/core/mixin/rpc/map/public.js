import { proxy, proxyUrl } from '../proxy'

export default {
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
    // 所属类型 1服务活动2服务组件3领域服务 参数列表分页获取
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
    // 验收测试服务组件（活动）总数
    getServiceList: proxy("AOP003215"),
    // 验收测试服务组件（活动）总数弹框 提交验收
    submitList: proxy("AOP003221"),
    // 验收测试服务组件（活动）总数弹框 验收通过
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
    // 批量测试-选择活动/组件列表
    getPickListInTestBatch: proxy("AOP003234"),
    // 组件管理列表所属应用下拉框
    getApplyList: proxy("AOP003206"),
    // 服务活动、服务组件管理设置mock值
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
}