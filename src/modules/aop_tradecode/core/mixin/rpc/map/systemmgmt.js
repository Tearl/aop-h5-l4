import { proxy, proxyUrl } from '../proxy'

export default {
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
}