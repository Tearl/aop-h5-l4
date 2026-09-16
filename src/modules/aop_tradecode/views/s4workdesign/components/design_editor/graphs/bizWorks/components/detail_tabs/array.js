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
      setSerialNumber(item[key], item.serialNumber);
      return item
    } else {
      item.serialNumber = serialNumber ? `${serialNumber}.${i + 1}` : `${i + 1}`;
      // delete item[key];
      return item
    }
  })
}
