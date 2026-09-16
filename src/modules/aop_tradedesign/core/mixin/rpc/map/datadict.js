import { proxy, proxyUrl } from "../proxy";

export default {
    // 数据字典
    dataDictionaryFieldListQuery: proxy("dataDictionaryService/dataDictionaryFieldListQuery"), // 数据字典项列表查询
    dataDictionaryFieldApplyQuery: proxy("dataDictionaryService/dataDictionaryFieldApplyQuery"), // 数据字典-字段申请列表查询
    fieldNameAnalyse: proxy("dataDictionaryService/fieldNameAnalyse"), // 数据字典-字段名称分析
    dataDictionaryFieldAdd: proxy("dataDictionaryService/dataDictionaryFieldAdd"), // 数据字典-新增字段/补充字段
    dataDictionaryFieldUpdate: proxy("dataDictionaryService/dataDictionaryFieldUpdate"), // 数据字典-审批通过/拒绝
    dataDictionaryFieldDetailQuery: proxy("dataDictionaryService/dataDictionaryFieldDetailQuery"), // 数据字典-数据字典项详情查询
    qryDataDictionaryListTopic: proxy("dataDictionaryService/qryDataDictionaryListTopic"), // 查询标准主题列表
    delDataDictionaryTopic: proxy("dataDictionaryService/delDataDictionaryTopic"),
    saveDataDictionaryTopic: proxy("dataDictionaryService/saveDataDictionaryTopic"),
    updateDataDictionaryTopic: proxy("dataDictionaryService/updateDataDictionaryTopic"),
    qryDataDictionaryTopicDetail: proxy("dataDictionaryService/qryDataDictionaryTopicDetail"),
    qryDataDictionaryCategoryList: proxy("dataDictionaryService/qryDataDictionaryCategoryList"),
    delDataDictionaryCategory: proxy("dataDictionaryService/delDataDictionaryCategory"),
    saveDataDictionaryCategory: proxy("dataDictionaryService/saveDataDictionaryCategory"),
    updateDataDictionaryCategory: proxy("dataDictionaryService/updateDataDictionaryCategory"),
    qryDataDictionaryCategoryDetail: proxy("dataDictionaryService/qryDataDictionaryCategoryDetail"),
    qryDataDictionaryCategoryDetail: proxy("dataDictionaryService/qryDataDictionaryCategoryDetail"),
    saveDataDictionaryRoot: proxy("dataDictionaryService/saveDataDictionaryRoot"), // 新增词根
    updateDataDictionaryRoot: proxy("dataDictionaryService/updateDataDictionaryRoot"), // 编辑词根
    qryDataDictionaryRootDetail: proxy("dataDictionaryService/qryDataDictionaryRootDetail"), // 查看词根详情
    qryDataDictionaryRootList: proxy("dataDictionaryService/qryDataDictionaryRootList"),
    queryEnumParamDetail: proxy("enumDictionaryService/queryEnumParamDetail"),
    qryEnumDictionaryList: proxy("enumDictionaryService/qryEnumDictionaryList"),
    updateEnumParam: proxy("enumDictionaryService/updateEnumParam"),
    deleteEnumDictByCode: proxy("enumDictionaryService/deleteEnumDictByCode"),
    addEnumDictionary: proxy('enumDictionaryService/addEnumDictionary'),
    queryOwnL5ProjectPageList: proxy("l5ProjectServiceI/queryOwnL5ProjectPageList"),
    queryAllStandardSystemList: proxy("fm1/L5/standardSystemServiceI/queryAllStandardSystemList"),
    qryRootSourceList: proxy("dataDictionaryService/qryRootSourceList"),
    delDataDictionaryRoot: proxy("dataDictionaryService/delDataDictionaryRoot"),




    dataDictionaryReport: proxy("dataDictionaryService/dataDictionaryReport"),


    //对标管理
    qryFinaBranchList: proxy("finaBranchDataDictionaryService/qryFinaBranchList"), //查询客户列表
    qryDataDictionaryFieldPageList: proxy("finaBranchDataDictionaryService/qryDataDictionaryFieldPageList"), //查询数据字典分页列表
    qryDataDictionaryFieldRecommendList: proxy("finaBranchDataDictionaryService/qryDataDictionaryFieldRecommendList"), //数据字段推荐字段列表
    qryDataDictionaryFieldMappingdList: proxy("finaBranchDataDictionaryService/qryDataDictionaryFieldMappingdList"), //查询映射字段列表
    addDataDictionaryFieldMapping: proxy("finaBranchDataDictionaryService/addDataDictionaryFieldMapping"), //新增字段映射
    delDataDictionaryFieldMapping: proxy("finaBranchDataDictionaryService/delDataDictionaryFieldMapping"), //删除字段映射
    qryBenchMarkingDictionaryListTopic: proxy("finaBranchDataDictionaryService/qryDataDictionaryListTopic"), //查询标准主题列表
    qryBenchMarkingDictionaryCategoryList: proxy("finaBranchDataDictionaryService/qryDataDictionaryCategoryList"), //查询标准主题列表
    qryDataDictionaryFieldDetail: proxy("finaBranchDataDictionaryService/qryDataDictionaryFieldDetail"), //数据字典项详情查询
    addDataDictionaryField: proxy("finaBranchDataDictionaryService/addDataDictionaryField"), //新增数据字典项
    updateDataDictionaryField: proxy("finaBranchDataDictionaryService/updateDataDictionaryField"), //修改数据字典项
    importFinaBranchDataFile: proxyUrl("finaBranchDataDictionaryService/importFinaBranchDataFile"), //导入文件



};
