/**
 * 数组去重
 * @param {*} arr 原数组
 * @param {*} key 字段标识
 * @return {*}
 */
export function unduplicated(arr, key = "paraId") {
  if (arr.length == 0 || !arr) return []
  const keys = []
  return arr.filter(item => keys.indexOf(item[key]) == -1 ? keys.push(item[key]) : false)
}

/**
 * 根据多个字段做数组去重
 * @param {*} arr 原数组
 * @param {*} keys 字段数组
 * @return {*}
 */
 export function unduplicatedByKeys(arr, keys) {
  if (arr.length == 0 || !arr) return []
  const cache = []
  return arr.filter(item => {
    const str = keys.reduce((pre, key) => {
      return `${pre}${item[key]}|`
    }, "")
    return cache.indexOf(str) == -1 ? cache.push(str) : false
  })
}

/**
 * 转嵌套数组
 * @param {*} arr 原数组
 * @param {*} key 字段标识
 * @param {*} child 嵌套字段名
 * @return {*}
 */
export function array2nested(arr, key = "paraPareId", child = "paramList") {
  if (arr.length == 0 || !arr) return []
  return arr.reduce((pre, param) => {
    if (param.paraTyp == "List"|| param.paraTyp == "Object") {
      param[child] = arr.filter(item => item[key] == param.paraId)
    }
    if (param[key] == "") {
      pre.push(param)
    }
    return pre
  }, [])
}

/**
 * 转非嵌套数组
 * @param {*} arr 原数组
 * @param {*} key 字段标识
 * @return {*}
 */
export function array2NonNested(arr, key = "paramList") {
  if (arr.length == 0 || !arr) return []
  return arr.reduce((pre, param) => {
    pre.push(param)
    if (param[key]) {
      param[key].forEach(item => pre.push(item))
    }
    return pre
  }, [])
}

/**
 * 转非嵌套数组(递归)
 * @param {*} arr 原数组
 * @param {*} key 字段标识
 * @return {*}
 */
 export function array2flat(arr, key = "children", pre) {
  if (arr.length == 0 || !arr) return []
  return arr.reduce((pre, param) => {
    pre.push(param)
    if (param[key] && param[key].length > 0) {
      array2flat(param[key], key, pre)
    }
    return pre
  }, pre ? pre : [])
}


/**
 * @param {*} arr 原数组
 * @param {*} key 排序依据的字段
 * @param {*} order 正数升序，负数降序
 * @return {*}
 */
export function arraySortByKey(arr, key, order = 1) {
  if (arr.length == 0 || !arr) return []
  return arr.sort((item1, item2) => {
    if (item1[key] * 1 > item2[key] * 1) return order
    else if (item1[key] * 1 < item2[key] * 1) return -order
    else return 0
  })
}

/**
 * @param {*} arr 原数组
 * @param {*} serialNumber 序列号
 * @param {*} key 子参数的字段
 * @return {*}
 */
export function setSerialNumber(arr, serialNumber, key = "children") {
  if (arr.length == 0 || !arr) return []
  return arr.map((item, i) => {
    if (item[key] && item[key].length > 0) {
      item.serialNumber = serialNumber ? `${serialNumber}.${i + 1}` : `${i + 1}`;
      setSerialNumber(item[key], item.serialNumber, key);
      return item
    } else {
      item.serialNumber = serialNumber ? `${serialNumber}.${i + 1}` : `${i + 1}`;
      // delete item[key];
      return item
    }
  })
}
