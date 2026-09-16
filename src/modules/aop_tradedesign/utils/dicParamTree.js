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
 * @description: 
 * @param {*} arr 嵌套形式的参数列表
 * @param {*} paramOrder 参数排序号
 * @param {*} key 参数排序号的key
 * @param {*} childKey 子参数数组的key
 * @return {*}
 */
export function dicSetParamOrder(arr, paramOrder, paramParentId = "", key = "paramOrder", childKey = "children") {
  if (arr.length == 0 || !arr) return []
  return arr.map((item, i) => {
    if (item[childKey] && item[childKey].length > 0) {
      item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
      item.paramParentId = paramParentId;
      dicSetParamOrder(item[childKey], item[key], item[key]);
      return item
    } else {
      item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
      item.paramParentId = paramParentId;
      return item;
    }
  })
}