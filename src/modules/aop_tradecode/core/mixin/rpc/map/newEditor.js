import { proxy, proxyUrl } from '../proxy'

export default {
   //新版编辑器
   getNewRelationServList: proxy("devopsEditor/queryBindServiceList"), //接口列表
   //AOP030026
   getD4bServiceInfo: proxy("devopsEditor/queryD4bInfo"), // 服务详情查训
   //AOP030044
   getServiceDesignDetail: proxy("devopsEditor/queryD4bDesignInfo"), // D4b服务设计详情查询
   //AOP03205
   getServiceArrangeList: proxy("devopsEditor/queryD4bLayoutList"), //查询编排列表

   getDessitizaList: proxy("devopsEditor/desensitizationType/list"),   //脱敏列表
   queryMainFlow: proxy("devopsEditor/queryMainFlow"),   //查询主流程
   getBusinessList: proxy("bizmodel/devops/queryDecisionTreeInfoByPage"),  //4b业务实现查询列表
   getQueryD4bLayoutList: proxy("devopsEditor/queryD4bLayoutList"),   //查询编排列表
   decisionTreeInfoModify: proxy("bizmodel/devops/decisionTreeInfoModify"), //接口实现
   getInterfaceList: proxy("bizmodel/devops/queryApiInfoListByPage"),     //接口列表
   delService: proxy("bizmodel/devops/deleteFnctD4ApiInfo"),  //删除接口
   editD4Trans: proxy("devopsEditor/updateFnctSvc"), //保存D4交易
   updateFncEdittSvc: proxy("devopsEditor/updateFncEdittSvc"), //保存D4交易
   qryCnNameListByWord: proxy("wordsMatchServiceI/qryCnNameListByWord"),   //接口定义-接口列表-基本详情-接口名称模糊搜索
   qryEnName: proxy("wordsMatchServiceI/qryEnName"),   //接口定义-接口列表-基本详情-接口名称模糊搜索-反显对应的接口编号

   //业务4b列表接口
   get4BRelationServList: proxy("queryBindServiceList"),   //业务4b列表接口
   get4BServiceInfo: proxy("d2/queryD4bDealInfo"),    //业务4b服务详情接口主要
   get4BServiceDesignDetail: proxy("AOP030044"),   //业务4b服务设计详情查询
   get4BServiceArrangeList: proxy("AOP03205"),   //查询编排列表

   //接口设计
   getL5ServList: proxy("bizmodel/L5/queryApiInfoMessage"),     //L5服务列表
   getCenterList: proxy("l5GroupServiceI/queryL5ProjectGroupList"),     //所属中心下拉框
   getGroupList: proxy("l5GroupServiceI/queryL5GroupList"),      //通过所属中心查询分组
   chooseL5serv: proxy("devopsEditor/l5ServiceChoice"),     //选择L5
   checkTrans: proxy("devopsEditor/checkTranActionParam"),   //规范检测
   delectTransL5ServiceRel: proxy("devopsEditor/delectTransL5ServiceRel"),   //删除服务
   checkBindDecisionList: proxy("bizmodel/L5/queryL5AndDecisionTree"), //查看绑定决策树
   queryAssetFnctListByProjectId: proxy("appConfigServiceI/queryAssetFnctListByProjectId"),  //获取活动列表
   getGitListInfo: proxy("TCJY000009"), //获取git详情列表
   getAssetDetail: proxy("bizmodel/assetService/qryAsset"), //获取活动详情跳转前端页面（商业建模前端）
   querySessionParam: proxy("TCJY000020"),    //获取会话、设置会话组件接口
   queryNoticeServiceParamDetail: proxy("L5/noticeService/queryNoticeServiceParamDetail"),
   queryBranchListByProId: proxy("appGitServiceI/queryBranchListByProId"),    //获得分支列表
   queryBranchDirectoryList: proxy("appGitServiceI/queryBranchDirectoryList"),    //获得分支列表
   queryFileText: proxy("appGitServiceI/queryFileText"),    //获得文件内容
   commits: proxy("appGitServiceI/commits"),    //提交
   commitsList: proxy("appGitServiceI/commitsList"),    //提交
   merge: proxy("appGitServiceI/merge"),    //提交
   mergePut: proxy("appGitServiceI/mergePut"),    //提交
   mergeChangeList: proxy("appGitServiceI/mergeChangeList"),    //
   mergeConflictsList: proxy("appGitServiceI/mergeConflictsList"),    //冲突列表
   refreshSourceCode: proxy("appGitServiceI/refreshSourceCode"),    //刷新源码
   loginGit: proxy("appGitServiceI/loginGit"),    //刷新源码
   deleteBranch: proxy("appGitServiceI/deleteBranch"),    //删除分支
   deployApp: proxy("developAppDeploy/deployApp"),    //部署工程
   getAppLog: proxy("developAppDeploy/getAppLog"),    //获取工程日志
   downloadAppLog: proxy("developAppDeploy/downloadAppLog"),    //下载工程
   getLastAppLogId: proxy("developAppDeploy/getLastAppLogId"),    //下载工程
   loginOutGit: proxy("appGitServiceI/loginOutGit"),    //登出接口
   
   addInterfaceAttribute: proxy("interfaceAttributeManageServiceI/addInterfaceAttribute"),    //接口属性新增接口
   queryInterfaceAttributeList: proxy("interfaceAttributeManageServiceI/queryInterfaceAttributeList"),    //接口属性新增接口
   queryAppConfExamVersionPageList: proxy("functionDevelopWorkServiceI/queryAppConfExamVersionPageList"),    //工程信息
   queryFunctionRelInfo: proxy("functionDevelopWorkServiceI/queryFunctionRelInfo"),    //工程信息
   queryBizDomainList: proxy("fm1/business/queryBizDomainList"),
   queryInterfaceProcessLayoutInfo: proxy("processLayoutServiceI/queryInterfaceProcessLayoutInfo"), //查询接口流程编排信息
   addWaitUseService: proxy("processLayoutServiceI/addWaitUseService"),
   removeWaitUseService: proxy("processLayoutServiceI/removeWaitUseService")
}
