export default {

  // 关系重数
  actionValue(value) {
    switch (value) {
      case "0-N":
        return "1:0..*";
      case "1-N":
        return "1:1..*"; //作业中/设计中/开发中
      case "0-1":
        return "1:0..1";
      case "1-1":
        return "1:1";
      default:
        return value;
    }
  },
  // 参数类型
  paraTyp(value) {
    if (typeof value == 'number') {
      value = String(value)
    }
    switch (value) {
      case "0":
        return "String"
      case "1":
        return "List"
      default:
        return value
    }
  },
  voucherType(value) {

    switch (value) {
      case "00":
        return "业务凭证"
      case "01":
        return "系统凭证"
      default:
        return value
    }

  },
  objClass(value) {

    switch (value) {
      case "1":
        return "用户"
      case "2":
        return "机构"

      case "3":
        return "渠道"
      case "4":
        return '产品'
      case "5":
        return "合约"
      case "6":
        return "系统"
      default:
        return value
    }
  },
  objType(value) {

    switch (value) {
      case "00":
        return "实体对象"
      case "01":
        return "值对象"
      default:
        return value
    }
  },
  fcLevel(value) {

    switch (value) {
      case "1":
        return "一级流程"
      case "2":
        return "二级流程"

      case "3":
        return "三级流程"
      case "4":
        return '四级流程'
      case "5":
        return "五级流程"
      default:
        return value
    }
  },

}


