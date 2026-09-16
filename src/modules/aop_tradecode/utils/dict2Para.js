/**
 * 数据字典映射参数
 * @param {*} dictObj 数据字典对象
 * @param {*} paraPosition 参数位置(0输入，1输出)
 * @return {*}
 */
export function dict2Para(dictObj, paraPosition) {
  const paramObj = {
    paraDescr: dictObj.dictDescr,
    paraDfltVal: "",
    paraHeadFlg: "",
    paraId: dictObj.dictId,
    paraMapgNo: "",
    paraNed: "",
    paraNm: dictObj.dictNm,
    paraNo: dictObj.dictNo,
    paraPareId: dictObj.dictPid,
    paraPosition,
    paraSort: "",
    paraTyp: dictObj.dictTyp,
    paraVal: "",
    paraNed: "0",
    paraVlidtFlg: "0",
    paraEncrponFlg: "0",
    paraEncrponMapg: "",
    // paraVlidtRuleId: dictObj.dictRule,
    paraVlidtRuleId: dictObj.dictRuleNo,
    chkComnt: dictObj.dictRuleTip,
    paraVlidtRuleType: dictObj.dictRuleType,
    paraVlidtExps: dictObj.dictRuleExps,
    paraFliterFlg: "0",
    paraMaxLength: dictObj.dictLength,
    children: dictObj.children || [],
    paraKeyWord: dictObj.dictryKeyWord,
    paraEngFullName: dictObj.dictryEnglishFullName
  }
  return paramObj
}

