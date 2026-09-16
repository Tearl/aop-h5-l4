import rpc from "@m/core/mixin/rpc";
export const sourceActionType = ["D4bAction", "D5SelfAction", "D5LinkAction", "loopAction", "cacheSessionAction", "getSessionAction", "uploadAction", "assignAction", "getCacheAction", "setCacheAction", "updateCacheAction", 'listAction', 'autoAction', 'setMenuAction', 'setHeaderAction', "spliceAction", 'keyMapAction', 'timeAction', 'transferStateAction', 'listSetValAction',
  'signCustAddAction',
  'setAcctLimitAction',
  'setRoleAction',
  'menuRoleSetAction',
  'corpCustMenuSetAction',
  'authJobDGAction',
  'desensitizationAction',
  'getDesensitizationAction',
  'getFlowNumAction',
]
// 00-当前4B交易，01-平台系统, 10-固定值，20-L5服务，30-拼接组件，40-循环组件，50-缓存会话组件，60-获取会话组件，70-文件上传组件, 80-赋值组件, 90-设置缓存组件, 100-获取缓存组件
export const actionTypeToApSource = {
  // "system": "01",
  // "constantValue": "10",
  // "D4bAction": "20",
  // "D5SelfAction": "20",
  // "D5LinkAction": "20",
  // "spliceAction": "30",
  // "loopAction": "40",
  // "cacheSessionAction": "50",
  // "getSessionAction": "60",
  // "uploadAction": "70",
  // // "assignAction": "80",
  // "setCacheAction": "90",
	// "getCacheAction": "100",
	// // "decisionAction": "110",
	// // "judgeAction": "111",
	// // "addAction": "112",
	// // "deleteAction": "113",
	// // "queryAction": "114",
	// // "modifyAction": "115",
	// // "exceptionAction": "116",
  // "updateCacheAction": '117',
  // "updateSessionAction": "118",
  // "listAction": "119",
  // 'complex': '120',
  // 'autoAction': '121',
  // 'setMenuAction': '122',
  // 'setHeaderAction': '123',
  // 'keyMapAction': '124',
  // 'timeAction': '125', //时间组件
  // 'transferStateAction': '126', //交易转化组件
  // 'listSetValAction': '127',
  // 'signCustAddAction': '128',
  // 'setAcctLimitAction': '129',
  // 'setRoleAction': '130',
  // 'menuRoleSetAction': '131',
  // 'corpCustMenuSetAction': '132',
  // 'authJobDGAction': '133',
}
// 参数来源为 当前4b交易、平台系统、固定值之一时，actionId为空
export const actionNameToNoActionId = ["当前4b交易", "平台系统", "固定值",]

/* 
  主流程图的组件类型：
  00-输入
  01-解密
  02-验签
  03-参数校验
  04-会话校验
  05-校验文件安全
  06-校验文件大小
  07-上传文件
  08-生成文件路径
  09-校验验证码
  10-校验验证码是否正确
  50-执行4b
  97-脱敏
  98-加密
  99-输出
*/
export const typeEnumObj = {
  "00": "inputAction",
  "01": "decodeAction",
  "02": "verifySignaturesAction",
  "03": "verifyParamsAction",
  "04": "verifySessionAction",
  "05": "verifyFileSecurityAction",
  "06": "verifyFileSizeAction",
  "07": "uploadAction",
  "08": "createFilePathAction",
  "09": "verifyCodeAction",
  "10": "verifyCodeCorrectnessAction",
  "50": "execute4BAction",
  "97": "desensitizeAction",
  "98": "encryptAction",
  "99": "outputAction",
}
export const actionTypToArrangeEnum = {}

// 交易编排数据中，组件类型对应的枚举值
const fetchEnum = async function() {
  const data = await rpc.d4.queryCompositeTypeList()
  const compositeTypeList = data.compositeTypeList
  const compositeSourceTypeList = data.compositeSourceTypeList
  for (let i = 0; i < compositeTypeList.length; i++) {
    const item = compositeTypeList[i];
    actionTypToArrangeEnum[item.cpntType] = item.cpntTypeVal
  }
  for (let i = 0; i < compositeSourceTypeList.length; i++) {
    const item = compositeSourceTypeList[i];
    actionTypeToApSource[item.cpntType] = item.cpntTypeVal
  }
}
export const compositeDirList = []

const fetchCompositeList = async function() {
  const res = await rpc.transactionDesign.queryCompositeList({
  })
  for (let i = 0; i < res.compositeDirList.length; i++) {
    const item = res.compositeDirList[i];
    compositeDirList.push(item)
  }
}
fetchCompositeList()
fetchEnum()