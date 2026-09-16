export const sourceActionType = ["D4bAction", "D5SelfAction", "D5LinkAction", "loopAction", "cacheSessionAction", "getSessionAction", "uploadAction", "getCacheAction", "setCacheAction"]

// 00-当前4B交易，01-平台系统, 10-固定值，20-L5服务，30-拼接组件，40-循环组件，50-缓存会话组件，60-获取会话组件，70-文件上传组件, 80-赋值组件, 90-设置缓存组件, 100-获取缓存组件
export const actionTypeToApSource = {
  "system": "01",
  "constantValue": "10",
  "D4bAction": "20",
  "D5SelfAction": "20",
  "D5LinkAction": "20",
  "spliceAction": "30",
  "loopAction": "40",
  "cacheSessionAction": "50",
  "getSessionAction": "60",
  "uploadAction": "70",
  "assignAction": "80",
  "setCacheAction": "90",
	"getCacheAction": "100",
}

// 参数来源为 当前4b交易、平台系统、固定值之一时，actionId为空
export const actionNameToNoActionId = ["当前4b交易", "平台系统", "固定值"]
