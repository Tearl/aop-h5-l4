import { proxy, proxyUrl } from '../proxy'

export default {
    //字典定义
    getDataSetCount: proxy("AOP060150"), //数据字典总数查询
    //服务列表
    getServiceList:proxy("AOP070401"),  //服务列表
    get4bTransactionList:proxy("AOP070403"),  //4b交易列表

    //数据集
    getMyDicList: proxy("AOP060151"), //字典管理列表
    getDataSetList: proxy("AOP070402"), //数据集列表
    getMyDataSetDetail: proxy("AOP060152"), //数据集详情
    addMydataSet: proxy("AOP060153"), //新增数据集
    editMydataSet: proxy("AOP060154"), //编辑数据集
    delMydataSet: proxy("AOP060155"), //删除数据集

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
    getParamsList: proxy("AOP060177"),

    //后端设计添加服务——弹框选择服务
    checkService: proxy("AOP080102"),   //选择服务
    checkServiceDel: proxy("AOP080103"),   //选择服务删除
    addDownloadService:proxy("AOP060167"),   //新增L5服务

    //交易定义
    getDataParamsList:proxy("AOP060176") //编辑---添加参数 ---数据集选择
}
