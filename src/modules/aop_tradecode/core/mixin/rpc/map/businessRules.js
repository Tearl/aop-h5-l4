import { proxy } from "../proxy";

export default {
    layoutList: proxy("AOP020021"), // 布局列表
    eleList: proxy("AOP020033"), // 页面下要素
    // 查事件
    eventList: proxy("AOP020018"),
    interfaceList: proxy("AOP020019"), // 事件接口列表
    getSchema: proxy("AOP020031"), // 获取事件对应的 schema
    getLayoutSchema: proxy("AOP010055"),
    getTreeData: proxy("AOP009825"), // 改版树接口
    getRulesInterfaceList: proxy(
        "functionDemandAchieveServiceI/queryFunctionDemandAchieveInterfaceInfoList"
    ),
    addInterface: proxy(
        "functionDemandAchieveServiceI/addFunctionDemandAchieveRel"
    ),
    deleteInterface: proxy(
        "functionDemandAchieveServiceI/removeFunctionDemandAchieveRel"
    ),
    layoutList: proxy("AOP020021"), // 布局列表
    eleList: proxy("AOP020033"), // 页面下要素
    // 查询4b列表
    eventList: proxy("AOP020018"),
    // 查询服务列表
    interfaceList: proxy("AOP020019"),
    queryD4UseL5SvcPage: proxy("devopsEditor/queryD4UseL5SvcPage"),
    // 系统设计评审内容查询
    querySystemDesignReviewContent: proxy(
        "systemDesignReviewServiceI/querySystemDesignReviewContent"
    ),
    queryFunctionRelInfo: proxy(
        "functionDevelopWorkServiceI/queryFunctionRelInfo"
    ),
    // 服务信息
    queryS5: proxy("bizmodel/L5/queryApiInfoAndParam"),
    // 规则
    getRuleList: proxy("bizmodel/L5/queryL5AndDecisionTree"),
    querySingleContentReviewResult: proxy(
        "systemDesignReviewServiceI/querySingleContentReviewResult"
    ),

    // 查询事件下的服务列表
    queryServiceList: proxy(
        "L5/ownBindRulesController/queryServiceListByRulesOrApis"
    ),
    // 查询服务数据统计
    queryServiceCount: proxy(
        "L5/ownBindRulesController/countServicesByBusinessCodes"
    ),
    // 查询事件关系
    serachEventConnect: proxy(
        "AOP009826"
    ),
    queryUserList: proxy("IM06002"), // 人员权限列表查询接口
    // 查询系统设计评审内容分页列表
    querySystemDesignReviewContentPageList: proxy(
        "systemDesignReviewServiceI/querySystemDesignReviewContentPageList"
    ),
    // 最终结果提交
    submitFinalReviewResult: proxy(
        "systemDesignReviewServiceI/submitFinalReviewResult"
    ),
};