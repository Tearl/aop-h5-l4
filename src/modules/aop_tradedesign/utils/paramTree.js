/**
 * 遍历list多维数组转一维数组
 * @param {*} data
 */
 export function mixList(data, listItem = "paramList") {
  let result = [];
  function getLeaf(data) {
    data.forEach((item) => {
      if (!item[listItem]) {
        result.push(item);
      } else {
        let d = JSON.parse(JSON.stringify(item));
        delete d[listItem];
        result.push(d);
        getLeaf(item[listItem]);
      }
    });
  }
  getLeaf(data);
  return result;
}
/**
 * 获取list一维数组转多维数组
 * @param {*} data
 * @param {*} parentId  父ID
 * @param {*} paramsId  当前id
 * @param {*} listItem  多维数组嵌套key
 */
 export function reList(data, parentId = "paramParentId", paramsId = "paramOrder", listItem = "children") {
  if(!data || data.length == 0) return []
  let result = data.reduce((prev, item) => {
    prev[item[parentId]]
      ? prev[item[parentId]].push(item)
      : (prev[item[parentId]] = [item]);

    return prev;
  }, {});
  for (let prop in result) {
    result[prop].forEach((item, i) => {
      result[item[paramsId]] ? (item[listItem] = result[item[paramsId]]) : "";
    });
  }
  result = result[""] || result[null] || []
  return result
}

/**
 * @description: 把参数key组装成 parentKey.key的形式
 * @param {*} param 当前进行拼接的参数
 * @param {*} paramList 参数列表
 * @param {*} paramKey 累计拼接的paramKey
 * @return {*}
 */
export function packageParamKey(param, paramList, paramKey = "") {
  const { paramOrder, paramParentId, paramDirection } = param
  if (paramOrder != paramParentId && paramParentId) {
    const _param = paramList.find(item => item.paramOrder == paramParentId && item.paramDirection == paramDirection)
    const _paramKey = `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
    return packageParamKey(_param, paramList, _paramKey)
  } else {
    return `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
  }
}

/**
 * @description: 把parentKey.key的形式转成key
 * @param {*} paramKey
 * @return {*}
 */
export function getSimpleParmaKey(paramKey = "") {
  return paramKey.split(".").at(-1)
}

/**
 * @description: 根据参数对象获取最外层父级参数
 * @param {*} param
 * @return {*}
 */
export function getParamParent(param = {}, paramList = []) {
  const { paramOrder, paramDirection } = param
  const paramParentOrder = paramOrder.split(".")[0]
  return paramList.find(item => item.paramOrder == paramParentOrder && item.paramDirection == paramDirection)
}

/**
 * @description: 
 * @param {*} arr 嵌套形式的参数列表
 * @param {*} paramOrder 参数排序号
 * @param {*} key 参数排序号的key
 * @param {*} childKey 子参数数组的key
 * @return {*}
 */
export function setParamOrder(arr, paramOrder, paramParentId = "", key = "paramOrder", childKey = "children") {
  if (arr.length == 0 || !arr) return []
  return arr.map((item, i) => {
    if (item[childKey] && item[childKey].length > 0) {
      item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
      item.paramParentId = paramParentId;
      setParamOrder(item[childKey], item[key], item[key]);
      return item
    } else {
      item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
      item.paramParentId = paramParentId;
      return item;
    }
  })
}

/**
 * @description: 根据某个参数对象，获取它的全部子参数
 * @param {*} param 参数对象
 * @param {*} paramList 参数列表
 * @return {*}
 */
export function getAllChildByParamObj(param, paramList) {
  const { paramDirection } = param
  return paramList.reduce((prev, item) => {
    if (item.paramParentId == param.paramOrder && item.paramDirection == paramDirection) {
      prev.push(item); 
      if (["List", "Object"].includes(item.paramType)) {
        prev.push(...getAllChildByParamObj(item, paramList))
      }
    }
    return prev
  }, [])
}

/**
 * @description: 根据传入参数列表，获取与之相关的所有参数(包括原来传入的参数及对应父参数)
 * @param {*} partialParamList 部分参数列表
 * @param {*} paramList 全量参数列表
 * @return {*}
 */
export function getRelativeParamList(partialParamList, paramList) {
  return partialParamList.reduce((prev, item) => {
    prev.push(item)
    if (item.paramParentId) {
      const paramParent = paramList.filter(param => param.paramOrder == item.paramParentId && param.paramDirection == item.paramDirection)
      prev.push(...getRelativeParamList(paramParent, paramList))
    }
    return prev
  }, [])
}