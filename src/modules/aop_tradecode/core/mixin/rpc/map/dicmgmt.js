import { proxy, proxyUrl } from '../proxy'

export default {
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
}