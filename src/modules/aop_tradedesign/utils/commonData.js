let obj = {
    ruleType: {
        // 规则类型
        "00": "顺序逻辑",
        "01": "条件逻辑",
        "02": "迭代逻辑",
        "03": "计算逻辑",
        "04": "复杂逻辑",
        "05": "数据处理",
        "06": "数据循环",
        "07": "数据判断",
    },
};

export let dataObject = obj;

export function getOptionsFn(key, isAll = false) {
    //研发标签 options
    let tmp = obj[key];
    let arr = isAll ? [{ value: "", type: "全部" }] : [];
    for (let k in tmp) {
        arr.push({ value: k, type: tmp[k] });
    }
    return arr;
}

export let options = {
    // select options
    ruleType: getOptionsFn("ruleType"), //规则类型
};

// 数据字典

// 数据字典-字段类型
export const fieldTypeOption = [
    {
        label: "String",
        value: "String",
    },
    {
        label: "Short",
        value: "Short",
    },
    {
        label: "Integer",
        value: "Integer",
    },
    {
        label: "Long",
        value: "Long",
    },
    {
        label: "Float",
        value: "Float",
    },
    {
        label: "Double",
        value: "Double",
    },
    {
        label: "BigDecimal",
        value: "BigDecimal",
    },
    {
        label: "Byte",
        value: "Byte",
    },
    {
        label: "Character",
        value: "Character",
    },
    {
        label: "File",
        value: "File",
    },
    {
        label: "Date",
        value: "Date",
    },

    {
        label: "LocalDate",
        value: "LocalDate",
    },
    {
        label: "LocalTime",
        value: "LocalTime",
    },
    {
        label: "LocalDateTime",
        value: "LocalDateTime",
    },
];
// 数据字典-词根类别 01:基本词;02:类词
export const rootTypeOption = [
    {
        label: "基本词",
        value: "01",
    },
    {
        label: "类词",
        value: "02",
    },
];
// 数据字典-类别阈值 01:编码类;02:数值类;03:文本类;04:比例类;05:代码类;06:金额类;07:日期类;08:标志类
export const rootTypeThresholdOption = [
    {
        label: "编码类",
        value: "01",
    },
    {
        label: "数值类",
        value: "02",
    },
    {
        label: "文本类",
        value: "03",
    },
    {
        label: "比例类",
        value: "04",
    },
    {
        label: "代码类",
        value: "05",
    },
    {
        label: "金额类",
        value: "06",
    },
    {
        label: "日期类",
        value: "07",
    },
    {
        label: "标志类",
        value: "08",
    },
];
// 数据字典-申请来源
export const applySourceOption = [
    {
        label: "开发工作台",
        value: "develop",
    },
    {
        label: "商业建模工作台",
        value: "design",
    },
    {
        label: "数据字典工作台",
        value: "common",
    },
    {
        label: "测试工作台",
        value: "test",
    },
    {
        label: "架构设计工作台",
        value: "framework",
    },
    {
        label: "SYS_INIT",
        value: "SYS_INIT",
    },
];
