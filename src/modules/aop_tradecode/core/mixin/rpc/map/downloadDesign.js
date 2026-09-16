import { proxy, proxyUrl } from '../proxy'

export default {
    designConfirm:proxy("service/confirm"),   //待二确 --设计确认
    getServDetail:proxy("service/dataset/query"),   //待二确 --设计确认详情信息
    getTwoConfirmedServiceList:proxy("twoConfirmedServiceList/query"),  //待二确服务列表
    getOrderDetail:proxy("AOP020044"),    //待二确订单详情
    addL5Serv:proxy("AOP060167"),   //新增服务
    getSystemList:proxy("queryAllRelationShipSystemList"),      //获取直连系统列表
    checkSerUser:proxy("fieldUseCondition/check"), //检查字段是否被用
    getServiceList:proxy("l5Service/query"),      //服务列表
    getDataSerList:proxy("dataSet/l5Service/query"),  //数据集服务列表
    getAddLabel:proxy("addLabel"),       //直连服务新增
    getPersonList:proxy("IM06002"),    //二确页面获取人员
    getL5servList: proxy("queryApiListPageByBeltLine"), //获取L5服务列表
    // queryBizDomainList:proxy("business/queryBizDomainList"),  //获取业务线
    queryBizDomainList:proxy("business/queryBizDomainList"),  //获取业务线
    getQuoteNum:proxy("service/quoteNum/query"),             //获取被调用次数
    getPlatformFlg:proxy("AOP020050"),          //一确基本信息
    //AOP020054
    getTransRelation:proxy("devopsEditor/isRelatedOtherAsset"),          //判断当前交易是否和其他活动关联
    delSer:proxy("l5Service/remove"),        //按服务列表删除服务
    getCustomerList:proxy("qryListByBranches"),  // 二确获取客户
    checkTrans: proxy("devopsEditor/checkTranActionParam"), //校验交易
}