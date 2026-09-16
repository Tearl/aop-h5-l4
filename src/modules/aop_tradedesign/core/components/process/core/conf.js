export default {
  // 组件配置
  itemOptions: {
    themeColor: "#358aff", // 主色调
    itemWidth: 100, // 组件宽度
    itemHeight: 48, // 组件高度
    circleItemRadius: 40, // 圆形半径
    startEndItemBgClor: "#358aff", // 开始、结束组件的背景色
    itemBgClor: "#fff", // 组件背景色
    itemStroke: "#999", // 组件边框颜色
    strokeWidth: "2px", // 组件边框粗细
    checkStrokeWidth: "2px", // 组件选中后边框粗细
    checkStroke: "#4995ff", // 组件选中后边框颜色
    circleR: "4", // 组件圆圈半径
    circleFill: "#fff", // 组件圆圈背景色
    circleStroke: "#4995ff", // 组件圆圈边框色
    checkCircleStroke: "#4995ff", // 组件圆圈选中后边框色
    newItemItemBgClor: "#ebf2ff", // 新建组件背景色
    newItemStroke: "#358aff", // 新建组件边框颜色
    newItemStrokeDasharray: "1,1", // 新建组件边框虚线样式
    successItemStroke: "#3fd6ae", // 成功组件边框颜色
    errorItemStroke: "#fe4758", // 错误组件边框颜色
    assetsDevStroke: "#36d542", // 资产开发边框颜色
    assetsDevBgClor: "#f3fdf4", // 资产开发背景色
    sbsectActionWidth: 220, // 分段组件宽度
    // sbsectActionHeight: 48, // 分段组件高度
    fieldActionWidth: 220, // 字段组件宽度
    fieldActionHeight: 25, // 字段组件高度
    containerStroke: "#b3d3ff", // 容器组件的边框色
    concurrentStroke: "rgba(54, 213, 66, 0.5)", // 并发组件的边框色
    concurrentCheckStroke: "#36d542", // 并发组件选中的边框色
  },
  // 线条配置
  lineOptions: {
    loseStrokeColor: "#ccc",
    strokeColor: "#9ac5ff", // 线条颜色
    strokeWidth: "2", // 线条粗细
    checkStrokeColor: "#4995ff", // 线条选中颜色
    checkStrokeWidth: "6", // 线条遮罩粗细
    startCircleColor: "#4995ff", // 线条开始位置颜色
  },
  // 画布配置
  svgOptions: {
    width: 2000, // 画布宽度
    height: 2000, // 画布高度
    fillColor: "#fff", // 画布背景色
    left: "", // 画布最左端
    top: "", // 画布最顶端
    // cursor: "grab", // 画布鼠标手势
    cursor: "default", // 画布鼠标手势
  },
  // 选中框配置
  checkBoxOptions: {
    strokeDasharray: "3", // 虚线
    fill: "rgb(0,0,255)", // 背景色
    strokeWidth: "1", // 边框的宽度
    stroke: "rgba(0,0,0,0.5)", // 边框的颜色，透明度
    fillDasharray: "0.03" // 背景色的透明度
  },
  // 泳道配置
  swimlaneOptions: {
    width: 180, // 基础宽度
    height: 700, // 高度
    shiftx: "0",// 横坐标偏移
    shifty: "0",// 纵坐标偏移
    // shifty: "128",// 纵坐标偏移
    stroke: "#c2c2c2", // 边框颜色
    strokeWidth: "0.5", // 边框粗细
    fill: "rgba(216,216,216,0.22)", // 背景色
    headFill: "#fff", // 头部背景色
    headHeight: "40",
  },
}