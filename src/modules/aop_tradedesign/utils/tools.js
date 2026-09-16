// 数组转json

export const arrayToJson = (
    arr = [],
    labelName = "label",
    valueName = "value"
) => {
    let obj = {};
    arr.forEach((item) => {
        obj[item[valueName]] = item[labelName];
    });
    return obj;
};
