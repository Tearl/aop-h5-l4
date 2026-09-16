/**
 * 判断是否为json
 * @param {*} value 值
 */
const isJson = (value) => {
  if (value != "") {
    if (typeof value == "string") {
      try {
        const obj = JSON.parse(value);
        if (typeof obj == "object" && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
}
/**
 * 判断是否为正整数
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
const isInteger = (rule, value, callback) => {
  if (value != "") {
    let reg = /(^[1-9]\d*$)/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "请输入正整数" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};
/**
 * 判断是否为字母
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
const isLetters = (rule, value, callback) => {
  if (value != "") {
    let reg = /^[a-zA-Z]+$/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "不能为空且只能英文字母" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};
/**
 * 判断是否为路径
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
const isPathId = (rule, value, callback) => {
  if (value != "") {
    let reg = /^\/[\w\-]+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "输入正确的ID" : rule.message;
      callback(new Error(errorMsg));
    }
  } else {
    let errorMsg = '请输入服务资产ID'
    callback(new Error(errorMsg));
  }
  callback()
};
/**
 * 判断是否为中文
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
const isChinese = (rule, value, callback) => {
  if (value != "") {
    let reg = /^[\u4e00-\u9fa5]+$/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "输入正确的中文" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};

/**
 * 判断是否包含中文
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
 const containChinese = (rule, value, callback) => {
  if (value != "") {
    let reg = /[\u4e00-\u9fa5]/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "请输入包含中文的内容" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};

/**
 * 判断是否为英文
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
 const isEnglish = (rule, value, callback) => {
  if (value != "") {
    let reg = /^[a-zA-Z]+$/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "输入正确的英文" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};

/**
 * 判断是否包含英文
 * @param {*} rule 规则
 * @param {*} value 值
 * @param {*} callback 回调
 */
 const containEnglish = (rule, value, callback) => {
  if (value != "") {
    let reg = /[a-zA-Z]/;
    if (!reg.test(value)) {
      let errorMsg = rule.message == undefined ? "请输入包含英文的内容" : rule.message;
      callback(new Error(errorMsg));
    }
  }
  callback();
};

/**
 * 日期格式处理
 * @param {*} date
 * @return {*}
 */
const dateFormat = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // 对月, 日进行特殊处理
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return `${year}${month}${day}`
}

// 判断版本号格式
const validateVersion = function (rule, value, callback) {
  const reg = /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/;
  if (!value) {
    callback(new Error("请输入版本号"));
  } else if (!reg.test(value)) {
    callback(new Error("版本号的格式为1.0.0"));
  } else {
    callback();
  }
}

// 判断应用名格式
const appName = function(rule, value, callback) {
  const reg = /.+?-.+?/;
  if (!value) {
    callback(new Error("请输入应用名称"));
  } else if (!reg.test(value)) {
    callback(new Error("格式错误"));
  } else {
    callback();
  }
}

// 判断领域名格式
const domainName = function(rule, value, callback) {
  const reg = /domain$/;
  if (!value) {
    callback(new Error("请输入领域名称"));
  } else if (!reg.test(value)) {
    console.log("领域名称格式不正确")
    callback(new Error("命名规范：xxx-domain，如 user-domain"));
  } else {
    callback();
  }
}

//判断只能输入英文字母和符号-
const usgNo = function(rule, value, callback) {
  const reg = /^[\w\d_-]*$/;
  if (!value) {
    callback(new Error("请输入用法编号"));
  } else if (!reg.test(value)) {
    callback(new Error("只能输入英文、数字、-"));
  } else {
    callback();
  }
}
export default {
  isJson,
  isLetters,
  isInteger,
  isPathId,
  isChinese,
  containChinese,
  isEnglish,
  containEnglish,
  validateVersion,
  appName,
  domainName,
  usgNo
}