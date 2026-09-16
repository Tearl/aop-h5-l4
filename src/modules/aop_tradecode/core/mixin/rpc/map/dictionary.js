import { proxy, proxyUrl } from '../proxy'

export default {
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
}