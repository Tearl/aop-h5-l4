const outputParamsTableColumn = [
    {
        prop: "paramKey",
        label: "参数Key",
        width: "220",
    },
    {
        prop: "paramCName",
        label: "参数名称",
        width: "220",
    },
    {
        prop: "paramValueType",
        label: "参数值类型",
        width: "120",
    },
    {
        prop: "paramLength",
        label: "参数长度",
        width: "80",
    },
    {
        prop: "actionName",
        label: "来源",
        width: "200",
    },
    {
        prop: "paraMapgNm",
        label: "来源值",
        width: "200",
    },
    {
        prop: "isNeed",
        label: "是否必填",
        width: "80",
    },
    {
        prop: "paramValue",
        label: "默认值",
        width: "80",
    },
    {
        prop: "paramDesc",
        label: "参数描述",
        width: "180",
    },
    {
        prop: "dictryEnum",
        label: "枚举值",
        width: "180",
    },
];

const inputParamsTableColumn = [
    {
        prop: "paramKey",
        label: "参数Key",
        width: "220",
    },
    {
        prop: "paramCName",
        label: "参数名称",
        width: "220",
    },
    {
        prop: "paramValueType",
        label: "参数值类型",
        width: "120",
    },
    {
        prop: "paramLength",
        label: "参数长度",
        width: "80",
    },
    {
        prop: "isNeed",
        label: "是否必填",
        width: "80",
    },
    {
        prop: "paramValue",
        label: "默认值",
        width: "80",
    },
    {
        prop: "paramDesc",
        label: "参数描述",
        width: "280",
    },
    {
        prop: "dictryEnum",
        label: "枚举值",
        width: "180",
    },
];

const ruleTableColumn = [
    {
        prop: "apiSeq",
        label: "规则编号",
        width: "220",
    },
    {
        prop: "decisionTreeName",
        label: "规则名称",
        width: "180",
    },
];

const ruleTableColumnWithS5 = [
    {
        prop: "ruleId",
        label: "规则编号",
        width: "220",
    },
    {
        prop: "ruleNm",
        label: "规则名称",
        width: "180",
    },
    {
        prop: "svcNm",
        label: "服务实现",
        width: "180",
    },
];

const transformTableColumn = [
    {
        prop: "txId",
        label: "交易编号",
        width: "180",
    },
    {
        prop: "txNm",
        label: "交易名称",
        width: "180",
    },
    {
        prop: "d4iName",
        label: "绑定交互事件",
        width: "180",
    },
];

export {
    outputParamsTableColumn,
    inputParamsTableColumn,
    ruleTableColumn,
    transformTableColumn,
    ruleTableColumnWithS5,
};
