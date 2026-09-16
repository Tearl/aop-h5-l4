import processConf from "../../core/conf";

const { itemOptions } = processConf

export default {
  data() {
    return {
      actionTypeToName: {
        "4RAction": "4R组件",
        "loopAction": "循环组件",
        "asyncAction": "异步组件",
        "cacheSessionAction": "缓存会话",
        "getSessionAction": "获取会话组件",
        "createGraphValidateCodeAction": "生成图形验证码组件",
        "verifyGraphValidateCodeAction": "校验图形验证码组件",
        "getCacheAction": "获取缓存组件",
        "setCacheAction": "设置缓存组件",
        "updateCacheAction": "更新缓存组件",
        "updateSessionAction": "更新会话组件",
        'listAction': "集合处理组件",
        "setHeaderAction": "报文头组件",
        'transferStateAction': '交易状态转换组件',
        'listSetValAction': '集合赋值组件',
        'getFlowNumAction': '全局流水号组件'
      },
      fourRTypeMap: {
        "4RAction": "4R组件",
        "loopAction": "循环组件",
        "asyncAction": "异步组件",
      },
      fourRTypeList: ["4RAction", "loopAction", "asyncAction"], // 4R类组件，带子逻辑
      containerTypeList: [ "containerAction", "concurrentAction"], // 容器类组件
      actionIdToWidth: {count: 0}, // 记录组件actionId和宽度的关系
      actionIdToHeight: {}, // 记录组件actionId和高度的关系
    }
  },
  methods: {
    // 获取组件的宽度(支持所有类型的组件)
    getItemWidth(item = {}) {
      // console.log("getItemWidth", this.actionIdToWidth)
      const { actionId, actionType } = item
      // if(this.actionIdToWidth[actionId]) {
      //   return this.actionIdToWidth[actionId]
      // } else if (this.fourRTypeList.includes(actionType)) {
      //   return this.actionIdToWidth[actionId] = this.get4RActionWidth(item)
      // } else if (this.containerTypeList.includes(actionType)) {
      //   return this.actionIdToWidth[actionId] = this.getContainerActionWidth(item)
      // } else {
      //   return this.actionIdToWidth[actionId] = itemOptions.itemWidth
      // }
      if (this.fourRTypeList.includes(actionType)) {
        return this.get4RActionWidth(item)
      } else if (this.containerTypeList.includes(actionType)) {
        return this.getContainerActionWidth(item)
      } else {
        return itemOptions.itemWidth
      }
    },
    // 获取组件的高度(支持所有类型的组件)
    getItemHeight(item = {}) {
      // console.log("getItemHeight", this.actionIdToHeight)
      const { actionId, actionType } = item
      // if (this.actionIdToHeight[actionId]) {
      //   return this.actionIdToHeight[actionId]
      // } else if (this.fourRTypeList.includes(actionType)) {
      //   return this.actionIdToHeight[actionId] = this.get4RActionHeight(item)
      // } else if (this.containerTypeList.includes(actionType)) {
      //   return this.actionIdToHeight[actionId] = this.getContainerActionHeight(item)
      // } else if (["throwExceptionAction", "transAction", "domainAction", "systemAction", "newD5Action", "D4bAction", "D5SelfAction", "D5LinkAction", "cacheSessionAction", "getSessionAction", "createGraphValidateCodeAction", "verifyGraphValidateCodeAction", "getCacheAction", "setCacheAction"].includes(item.actionType)) {
      //   return this.actionIdToHeight[actionId] = itemOptions.itemHeight + (itemOptions.itemHeight / 3) * 2
      // } else {
      //   return this.actionIdToHeight[actionId] = itemOptions.itemHeight
      // }
      if (this.fourRTypeList.includes(actionType)) {
        return this.get4RActionHeight(item)
      } else if (this.containerTypeList.includes(actionType)) {
        return this.getContainerActionHeight(item)
      } else if (["throwExceptionAction", "transAction", "domainAction", "systemAction", "newD5Action", "D4bAction", "D5SelfAction", "D5LinkAction", "cacheSessionAction", "getSessionAction", "createGraphValidateCodeAction", "verifyGraphValidateCodeAction", "getCacheAction", "setCacheAction", "decisionAction", "updateCacheAction", 'updateSessionAction', 'setHeaderAction'].includes(item.actionType)) {
        return itemOptions.itemHeight + (itemOptions.itemHeight / 3) * 2
      } else {
        return itemOptions.itemHeight
      }
    },
    // 获取4R组件的宽度
    get4RActionWidth(item) {
      if (item.actionDetailShow && this.fourRDataMap[item.actionId]) {
        const p = this.fourRDataMap[item.actionId].reduce((prev, item) => {
          prev.minX = Math.min(prev.minX, item.actionX)
          prev.minY = Math.min(prev.minY, item.actionY)
          prev.maxX = Math.max(prev.maxX, item.actionX)
          prev.maxY = Math.max(prev.maxY, item.actionY)
          return prev
        }, {
          minX: item.actionX,
          minY: item.actionY,
          maxX: item.actionX,
          maxY: item.actionY,
        })
        return p.maxX - p.minX + itemOptions.itemWidth * 2
      } else {
        return itemOptions.itemWidth
      }
    },
    // 获取4R组件的高度
    get4RActionHeight(item) {
      if (item.actionDetailShow && this.fourRDataMap[item.actionId]) {
        const p = this.fourRDataMap[item.actionId].reduce((prev, item) => {
          prev.minX = Math.min(prev.minX, item.actionX)
          prev.minY = Math.min(prev.minY, item.actionY)
          prev.maxX = Math.max(prev.maxX, item.actionX)
          prev.maxY = Math.max(prev.maxY, item.actionY)
          return prev
        }, {
          minX: item.actionX,
          minY: item.actionY,
          maxX: item.actionX,
          maxY: item.actionY,
        })
        return p.maxY - p.minY + itemOptions.itemHeight * 2
      } else {
        return itemOptions.itemHeight + (itemOptions.itemHeight / 3) * 2
      }
    },
    // 获取容器组件的宽度
    getContainerActionWidth(item) {
      const conf = this.getConfItem("subcomponent", item.actionId)
      const subcomponent = JSON.parse((conf.value || "[]"))
      if (subcomponent.length) {
        return (itemOptions.itemWidth + 20) * subcomponent.length + 20
      } else {
        return itemOptions.itemWidth + 40
      }
    },
    // 获取容器组件的高度
    getContainerActionHeight(item) {
      return itemOptions.itemHeight * 2.5
    },
    // 判断组件是否重叠
    isIntersection(item1, item2) {
      const startX = Math.max(item1.x[0], item2.x[0])
      const endX = Math.min(item1.x[1], item2.x[1])
      const startY = Math.max(item1.y[0], item2.y[0])
      const endY = Math.min(item1.y[1], item2.y[1])
      return startX <= endX && startY <= endY
    },
    getIntersectionContainer(item, containerAreaMap) {
      // 移动组件的坐标区间
      const cpnArea = {
        x: [item.actionX, item.actionX + this.getItemWidth(item)],
        y: [item.actionY, item.actionY + this.getItemHeight(item)],
      }
      return this.containerList.reduce((prev, container) => {
        container.isHover = false
        if (this.isIntersection(cpnArea, containerAreaMap[container.actionId])) {
          container.isHover = true
          prev = container.actionId
        }
        return prev
      }, "")
    },
    // 遮罩层背景Y坐标
    getProcessMoveY(item) {
      if (item.actionType == "sbsectAction") {
        return item.actionY + 25
      } else if (this.fourRTypeList.includes(item.actionType)) {
        return item.actionY + 25
        // return item.actionY
      } else {
        return item.actionY
      }
    },
    // 遮罩层背景宽度
    getProcessMoveWidth(item) {
      if (item.actionType == "sbsectAction") {
        return itemOptions.sbsectActionWidth - 35
      } else if (item.actionType == "fieldAction") {
        return 0
      } else {
        return this.getItemWidth(item)
      }
    },
    // 遮罩层背景高度
    getProcessMoveHeight(item) {
      if (item.actionType == 'startAction' || item.actionType == 'endAction') {
        return itemOptions.itemHeight - 8
      } else if(item.actionType == "sbsectAction") {
        return this.getSbsectActionHeight(item)
      } else if (this.fourRTypeList.includes(item.actionType)) {
        return this.getItemHeight(item) - 25
      } else {
        return this.getItemHeight(item)
      }
    },
    // 组件左方圆形x坐标
    getLeftCircleX(item) {
      return item.actionX
      // if (item.actionType == "loopAction") {
      //   return item.actionX + itemOptions.itemWidth / 2 - itemOptions.circleItemRadius
      // } else {
      //   return item.actionX
      // }
    },
    // 组件左方圆形y坐标
    getLeftCircleY(item) {
      if (item.actionType == 'startAction' || item.actionType == 'endAction') {
        return item.actionY + (itemOptions.itemHeight - 8) / 2
      } else if (item.actionType == "fieldAction") {
        return item.actionY + itemOptions.fieldActionHeight / 2
      } else {
        return item.actionY + this.getItemHeight(item) / 2
      }
    },
    // 组件右方圆形x坐标
    getRightCircleX(item) {
      // if (item.actionType == "loopAction") {
      //   return item.actionX + itemOptions.itemWidth / 2 + itemOptions.circleItemRadius
      // }
      if (item.actionType == "sbsectAction") {
        return item.actionX + itemOptions.sbsectActionWidth
      } else if (item.actionType == "fieldAction") {
        return item.actionX + itemOptions.fieldActionWidth
      } else {
        return item.actionX + this.getItemWidth(item)
      }
    },
    // 组件右方圆形y坐标
    getRightCircleY(item) {
      if (item.actionType == 'startAction' || item.actionType == 'endAction') {
        return item.actionY + (itemOptions.itemHeight - 8) / 2
      } else if (item.actionType == "fieldAction") {
        return item.actionY + itemOptions.fieldActionHeight / 2
      } else {
        return item.actionY + this.getItemHeight(item) / 2
      }
    },
    // 组件上方圆形x坐标
    getUpCircleX(item) {
      if (item.actionType == "sbsectAction") {
        return item.actionX + itemOptions.sbsectActionWidth / 2
      } else if (item.actionType == "fieldAction") {
        return item.actionX + itemOptions.fieldActionWidth / 2
      } else {
        return item.actionX + this.getItemWidth(item) / 2
      }
    },
    // 组件上方圆形y坐标
    getUpCircleY(item) {
      return item.actionY
      // if (item.actionType == "loopAction") {
      //   return item.actionY + itemOptions.itemHeight / 2 - itemOptions.circleItemRadius
      // } else {
      //   return item.actionY
      // }
    },
    // 组件下方圆形x坐标
    getDownCircleX(item) {
      if (item.actionType == "sbsectAction") {
        return item.actionX + itemOptions.sbsectActionWidth / 2
      } else if (item.actionType == "fieldAction") {
        return item.actionX + itemOptions.fieldActionWidth / 2
      } else {
        return item.actionX + this.getItemWidth(item) / 2
      }
    },
    //组件下方圆形y坐标
    getDownCircleY(item) {
      if (item.actionType == "sbsectAction") {
        return item.actionY + this.getSbsectActionHeight()
      } else if (item.actionType == "fieldAction") {
        return item.actionY + itemOptions.fieldActionHeight
      } else {
        return item.actionY + this.getItemHeight(item);
      }
    },
    // 获取组件边框的颜色
    getItemStrokeColor(item) {
      if (item.actionType == "containerAction") {
        return this.currentActionId == item.actionId || item.checkStroke || item.isHover ? itemOptions.themeColor : itemOptions.containerStroke
      } else if (item.actionType == "concurrentAction") {
        return this.currentActionId == item.actionId || item.checkStroke || item.isHover ? itemOptions.concurrentCheckStroke : itemOptions.concurrentStroke
      }
    },
    // 获取组件的展示文字
    getItemDisplayText(item) {
      if (this.containerTypeList.includes(item.actionType)) {
        const actionSeq = this.getConfItem("actionSeq", item.actionId).value
        return `${item.actionName}(${actionSeq})`
      } else {
        return item.actionName
      }
    },

    /* 
      原core文件里的方法
    */
    //渲染线条
    getLineList(lineList, dataList, itemWidth, itemHeight, isTest) {
      lineList.length = 0
      for (let i = 0; i < dataList.length; i++) {
        let children = dataList[i].children
        let tempDelLine = []
        if (children && children.length > 0) {
          children.forEach((childInfo, index, arr) => {
            let child = this.getChild(childInfo, dataList, dataList[i])
            if (child) {
              let x2 = 0
              let y2 = 0
              let lineObj = {}
              if (childInfo.lineType == "polyline") {
                if (childInfo.end === "left") {
                  x2 = child.actionX
                  y2 = child.actionY + itemHeight / 2
                } else if (childInfo.end === "right") {
                  x2 = child.actionX + itemWidth
                  y2 = child.actionY + itemHeight / 2
                } else if (childInfo.end === "top") {
                  x2 = child.actionX + itemWidth / 2
                  y2 = child.actionY
                } else {
                  x2 = child.actionX + itemWidth / 2
                  y2 = child.actionY + itemHeight
                }
                lineObj = this.newLineObj(dataList[i], childInfo.begin, "polyline", itemWidth, itemHeight)

                lineObj.drection = childInfo.begin
                lineObj.lineId = childInfo.lineId
                lineObj.condition = childInfo.condition ? childInfo.condition : {}
                lineObj.lineType = "polyline"
                lineObj.sourceId = childInfo.sourceId
                lineObj.targetId = childInfo.targetId
                if (isTest) {
                  dataList.forEach((item) => {
                    if (item.actionId == lineObj.targetId) {
                      lineObj.type = item.resultFlg ? false : true
                    }
                  })
                  dataList.forEach((item) => {
                    if (item.actionId == lineObj.sourceId) {
                      if (!!item.resultFlg) {
                        lineObj.type = false
                      }
                    }
                  })
                }
                this.setLineObj(dataList[i], lineObj, childInfo.begin, child, childInfo.end, x2, y2, itemWidth, itemHeight)
                lineList.push(lineObj)
              } else {
                if (child.actionType == "sbsectAction") {
                  const childFieldList = this.getSbsectFieldList(child)
                  const childIndex = childFieldList.findIndex(item => item.actionId == childInfo.targetId)
                  let _child = {}
                  if (childInfo.end == "left") {
                    _child = Object.assign(childFieldList[childIndex], {
                      actionX: child.actionX,
                      actionY: this.getFieldLeftCircleY(child, childIndex),
                      actionType: "fieldAction",
                      drection: "left"
                    })
                    x2 = _child.actionX
                    y2 = this.getFieldLeftCircleY(_child, childIndex)
                  } else if (childInfo.end == "right") {
                    _child = Object.assign(childFieldList[childIndex], {
                      actionX: child.actionX + this.itemOptions.fieldActionWidth,
                      actionY: this.getFieldRightCircleY(child, childIndex),
                      actionType: "fieldAction",
                      drection: "right"
                    })
                    x2 = _child.actionX + this.itemOptions.fieldActionWidth
                    y2 = this.getFieldRightCircleY(_child, childIndex)
                  }
                  const fieldList = this.getSbsectFieldList(dataList[i])
                  const fieldIndex = fieldList.findIndex(field => field.actionId == childInfo.sourceId)
                  const fieldItem = fieldList[fieldIndex]
                  // console.log("getLineList-fieldList", fieldList, childIndex, fieldIndex)
                  lineObj = this.newLineObj(dataList[i], childInfo.begin, "line", itemWidth, itemHeight, fieldItem, fieldIndex)
                  lineObj.drection = childInfo.begin
                  lineObj.lineId = childInfo.lineId
                  lineObj.condition = childInfo.condition ? childInfo.condition : {}
                  lineObj.lineType = "line"
                  lineObj.sourceId = childInfo.sourceId
                  lineObj.targetId = childInfo.targetId
                  lineObj.polyline = childInfo.polyline
                  // console.log("getLineList-lineObj0",lineObj)
                  // console.log("getLineList-lineObj1",JSON.parse(JSON.stringify(lineObj)))
                  // console.log("setLineObj0", JSON.parse(JSON.stringify(childInfo)))
                  this.setLineObj(dataList[i], lineObj, childInfo.begin, _child, childInfo.end, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
                  lineList.push(lineObj)
                  // console.log("lineList.push(lineObj)", lineList)
                } else {
                  x2 = child.actionX + this.getItemWidth(child, this.itemOptions) / 2
                  y2 = child.actionY + this.getItemHeight(child, this.itemOptions) / 2
                  // console.log("getLineList", dataList[i], this.getChild(childInfo, dataList), this.getChild(childInfo, dataList).actionName, child, x2, y2)
                  lineObj = this.newLineObj(dataList[i], childInfo.begin, "line", this.getItemWidth(dataList[i], this.itemOptions), this.getItemHeight(dataList[i], this.itemOptions))
                  lineObj.drection = childInfo.begin
                  lineObj.lineId = childInfo.lineId
                  lineObj.condition = childInfo.condition ? childInfo.condition : {}
                  lineObj.lineType = "line"
                  lineObj.sourceId = childInfo.sourceId
                  lineObj.targetId = childInfo.targetId
                  lineObj.polyline = childInfo.polyline
                  if (isTest) {
                    dataList.forEach((item) => {
                      if (item.actionId == lineObj.targetId) {
                        lineObj.type = item.resultFlg ? false : true
                      }
                    })
                    dataList.forEach((item) => {
                      if (item.actionId == lineObj.sourceId) {
                        if (!!item.resultFlg) {
                          lineObj.type = false
                        }
                      }
                    })
                  }
                  this.setLineObj(dataList[i], lineObj, childInfo.begin, child, childInfo.end, x2, y2, itemWidth, itemHeight)
                  lineList.push(lineObj)
                }
              }
            } else {
              tempDelLine.push(index)
            }
          })
          for (let i = tempDelLine.length - 1; i >= 0; i--) {
            children.splice(tempDelLine[i], 1)
          }
        }
      }
    },
    //线条横向坐标渲染
    getPolylineX(e) {
      if (e && e.length != 0) {
        let p = e.split(" ")
        let x = (p[p.length - 4]) * 1 + 10
        if (p.length > 4) {
          x = (p[p.length - 4]) * 1 + 10
        } else {
          x = (p[0] * 1 + p[p.length - 2] * 2) / 3
        }
        if (p[length - 1] > p[0]) {
          x + 10
        } else {
          x - 10
        }
        return x
      }
    },
    //线条纵向坐标渲染
    getPolylineY(e) {
      if (e && e.length != 0) {
        let p = e.split(" ")
        let y = 0
        if (p.length > 4) {
          y = (p[p.length - 3]) * 1 + 10
        } else {
          y = (p[1] * 1 + p[p.length - 1] * 2) / 3
        }
        if (p[length - 1] > p[0]) {
          y + 10
        } else {
          y - 10
        }
        return y
      }
    },
    //获取对应dataList的id
    getChild(childInfo, dataList, item) {
      // console.log("getChild", childInfo, dataList, item)
      if (item?.actionType == "sbsectAction") {
        const targetId = childInfo.targetId.split("-")[0]
        // console.log("getChild-if", targetId)
        return dataList.find(item => {
          return item.actionId === targetId
        })
      } else {
        return dataList.find(data => {
          return data.actionId === childInfo.targetId
        })
      }
    },
    //移动完成后的连接线的终点坐标以及在终点对象的上的方位
    getEndPos(item, x2, y2, width, height) {
      // console.log("getEndPos", item, x2, y2, width, height)
      let qqList = []
      if (item.actionType == "fieldAction") {
        if (item.drection == "left") {
          qqList = [
            {
              x: item.actionX,
              y: item.actionY,
              drection: "left"
            },
            {
              x: item.actionX + width,
              y: item.actionY,
              drection: "right"
            }
          ]
        } else if (item.drection == "right") {
          qqList = [
            {
              x: item.actionX - width,
              y: item.actionY,
              drection: "left"
            },
            {
              x: item.actionX,
              y: item.actionY,
              drection: "right"
            }
          ]
        }
      } else {
        qqList = [
          {
            x: item.actionX,
            y: item.actionY + height / 2,
            drection: "left"
          },
          {
            x: item.actionX + width,
            y: item.actionY + height / 2,
            drection: "right"
          },
          {
            x: item.actionX + width / 2,
            y: item.actionY,
            drection: "top"
          },
          {
            x: item.actionX + width / 2,
            y: item.actionY + height,
            drection: "bottom"
          }
        ]
      }
      // console.log("qqList1", JSON.parse(JSON.stringify(qqList)))
      qqList.sort((a, b) => {
        return Math.sqrt(Math.pow(x2 - a.x, 2) + Math.pow(y2 - a.y, 2)) - Math.sqrt(Math.pow(x2 - b.x, 2) + Math.pow(y2 - b.y, 2))
      })
      // console.log("qqList2", JSON.parse(JSON.stringify(qqList)))
      return qqList[0]
    },
    /**
     * 创建新的连接线
     * @param {*} item 起始组件
     * @param {*} begindDrection
     * @param {*} type 线段类型
     * @param {*} itemWidth 起始组件或目标组件的宽度
     * @return {*}
     */
    newLineObj(item, begindDrection, type, itemWidth, itemHeight, fieldItem, fieldIndex) {
      itemHeight = (item.actionName == "开始" || item.actionName == "结束") ? itemHeight - 8 : itemHeight
      if (type == "polyline") {
        switch (begindDrection) {
          case "left":
            return {
              x1: item.actionX - 4,
              y1: item.actionY + itemHeight / 2,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          case "right":
            return {
              x1: item.actionX + itemWidth + 4,
              y1: item.actionY + itemHeight / 2,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          case "top":
            return {
              x1: item.actionX + itemWidth / 2,
              y1: item.actionY - 4,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          case "bottom":
            return {
              x1: item.actionX + itemWidth / 2,
              y1: item.actionY + itemHeight + 4,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          default:
            break
        }
      } else {
        if (item.actionType == "sbsectAction" && fieldItem) {
          return {
            x1: begindDrection == "left" ? item.actionX : item.actionX + this.itemOptions.fieldActionWidth,
            y1: begindDrection == "right" ? this.getFieldLeftCircleY(item, fieldIndex) : this.getFieldRightCircleY(item, fieldIndex),
            polyline: [],
            checked: false,
            drection: "",
            condition: {}
          }
        } else {
          if (item.actionDetailShow) {
            return {
              x1: item.actionX + this.getItemWidth(item, this.itemOptions) / 2,
              y1: item.actionY + this.getItemHeight(item, this.itemOptions) / 2,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          } else {
            return {
              x1: item.actionX + this.getItemWidth(item, this.itemOptions) / 2,
              y1: item.actionY + this.getItemHeight(item, this.itemOptions) / 2,
              polyline: [],
              checked: false,
              drection: "",
              condition: {}
            }
          }
        }
      }
    },
    //设置移动中的连接线
    setMoveLineObj(beginItem, lineObj, drection, x2, y2, itemWidth, itemHeight) {
      this.getMovePolyline(lineObj, drection, x2, y2, itemWidth, itemHeight)
    },
    //设置移动完成后的连接线
    setLineObj(beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex) {
      // console.log("getLineList-lineObj2",beginItem, JSON.parse(JSON.stringify(lineObj)), begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
      this.getPolyline(beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    },
    /** 获取移动中的连接线
        --------------------
        params:
        beginItem 连接线起始表单项
        lineObj 连接线对象
        drection 连接线起始表单项的小圈圈方位
        x2 y2 当前鼠标相对于svg的坐标
    */
    getMovePolyline(lineObj, drection, x2, y2, itemWidth, itemHeight) {
      let x1 = lineObj.x1
      let y1 = lineObj.y1
      let h = itemHeight
      let w = itemWidth
      if (lineObj.lineType === "polyline") {
        if (drection === "left") {
          if (x2 < x1) { // 当起始点在表单项左边 并且鼠标在起始点左边的时候
            if (y2 < y1 - itemHeight) {
              lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              return "top"
            } else if (y2 > (y1 + itemHeight)) {
              lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              return "bottom"
            } else {
              lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              return "left"
            }
          } else if (x2 >= x1 && x2 <= x1 + w) { // 当起始点在表单项左边 并且鼠标在起始点右边的时候
            if (y2 === y1) {
              lineObj.polyline = [x1, y1, x2, y2].join(" ")
              return "right"
            } else if (y2 < y1 - h) {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else if (y2 > (y1 + h)) {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2, x2, y2].join(" ")
              return "right"
            }
          } else {
            if (y2 > y1 && y2 <= y1 + h / 2) {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 + h / 2 + 20, x2 - 20, y1 + h / 2 + 20, x2 - 20, y2, x2, y2].join(" ")
              return "right"
            } else if (y2 < y1 && y2 > y1 - h / 2) {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 - h / 2 - 20, x2 - 20, y1 - h / 2 - 20, x2 - 20, y2, x2, y2].join(" ")
              return "right"
            } else {
              lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2, x2, y2].join(" ")
              return "right"
            }
          }
        } else if (drection === "right") {
          if (x2 > x1) {
            if (y2 < y1 - h) {
              lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              return "top"
            } else if (y2 > (y1 + h)) {
              lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              return "bottom"
            } else {
              lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              return "right"
            }
          } else if (x2 <= x1 && x2 >= x1 - w) {
            if (y2 === y1) {
              lineObj.polyline = [x1, y1, x2, y2].join(" ")
              return "left"
            } else if (y2 < y1 - h) {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else if (y2 > (y1 + h)) {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2, x2, y2].join(" ")
              return "left"
            }
          } else {
            if (y2 < y1 && y2 > y1 - h / 2) {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 - h / 2 - 20, x2 + 20, y1 - h / 2 - 20, x2 + 20, y2, x2, y2].join(" ")
              return "left"
            } else if (y2 > y1 && y2 <= y1 + h / 2) {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 + h / 2 + 20, x2 + 20, y1 + h / 2 + 20, x2 + 20, y2, x2, y2].join(" ")
              return "left"
            } else {
              lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2, x2, y2].join(" ")
              return "left"
            }
          }
        } else if (drection === "top") {
          if (y2 < y1) {
            if (x2 < x1 - itemWidth) {
              lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              return "left"
            } else if (x2 > (x1 + itemWidth)) {
              lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              return "right"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 + (y2 - y1) / 2, x2, y1 + (y2 - y1) / 2, x2, y2].join(" ")
              return "top"
            }
          } else if (y2 >= y1 && y2 <= y1 + h) {
            if (x2 === x1) {
              lineObj.polyline = [x1, y1, x2, y2].join(" ")
              return "right"
            } else if (x2 < x1 - w) {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              return "left"
            } else if (x2 > (x1 + w)) {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              return "right"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              return "bottom"
            }
          } else {
            if (x2 > x1 && x2 <= x1 + w / 2) {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x1 + w / 2 + 20, y1 - 20, x1 + w / 2 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else if (x2 < x1 && x2 > x1 - w / 2) {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x1 - w / 2 - 20, y1 - 20, x1 - w / 2 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              return "bottom"
            }
          }
        } else if (drection === "bottom") {
          if (y2 > y1) {
            if (x2 < x1 - itemWidth) {
              lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              return "left"
            } else if (x2 > (x1 + itemWidth)) {
              lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              return "right"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 + (y2 - y1) / 2, x2, y1 + (y2 - y1) / 2, x2, y2].join(" ")
              return "bottom"
            }
          } else if (y2 <= y1 && y2 >= y1 - h) {
            if (x2 === x1) {
              lineObj.polyline = [x1, y1, x2, y2].join(" ")
              return "top"
            } else if (x2 < x1 - w) {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              return "left"
            } else if (x2 > (x1 + w)) {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - 20, y1 + 20, x2 - 20, y2, x2, y2].join(" ")
              return "right"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              return "top"
            }
          } else {
            if (x2 > x1 && x2 <= x1 + w / 2) {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + w / 2 + 20, y1 + 20, x1 + w / 2 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else if (x2 < x1 && x2 > x1 - w / 2) {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x1 - w / 2 - 20, y1 + 20, x1 - w / 2 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              return "top"
            }
          }
        }
      } else {
        lineObj.polyline = [x1, y1, x2, y2].join(" ")
      }
    },
    //获取移动完成后的连接线
    getPolyline(beginItem, lineObj, beginDrection, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex) {
      // console.log("getPolyline-pos", beginItem, JSON.parse(JSON.stringify(lineObj)), beginDrection, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
      let x1 = lineObj.x1 // 线段起点x坐标
      let y1 = lineObj.y1 // 线段起点y坐标
      if (beginItem.actionDetailShow) {
        // console.log("beginItem", beginItem)
        // 当前组件返显了子流程图的内容时，需要重新计算起点位置
        const upSide = {
          x: [beginItem.actionX, beginItem.actionX + this.getItemWidth(beginItem)],
          y: [beginItem.actionY, beginItem.actionY],
        }
        const rightSide = {
          x: [beginItem.actionX + this.getItemWidth(beginItem), beginItem.actionX + this.getItemWidth(beginItem)],
          y: [beginItem.actionY, beginItem.actionY + this.getItemHeight(beginItem)],
        }
        const downSide = {
          x: [beginItem.actionX, beginItem.actionX + this.getItemWidth(beginItem)],
          y: [beginItem.actionY + this.getItemHeight(beginItem), beginItem.actionY + this.getItemHeight(beginItem)]
        }
        const leftSide = {
          x: [beginItem.actionX, beginItem.actionX],
          y: [beginItem.actionY, beginItem.actionY + this.getItemHeight(beginItem)]
        }
        const endPosition = this.getArrowPos(lineObj.x1, lineObj.y1, x2, y2, itemWidth, itemHeight, beginItem, endItem)
        const connectingLine = {
          x1: beginItem.actionX + this.getItemWidth(beginItem) / 2,
          y1: beginItem.actionY + this.getItemHeight(beginItem) / 2,
          x2: endPosition.x,
          y2: endPosition.y,
        }
        const tan = Math.abs(connectingLine.y1 - connectingLine.y2) / Math.abs(connectingLine.x1 - connectingLine.x2)
        // 线段与底边相交点的X坐标
        const downSideCrosspointX = connectingLine.x2 + ((connectingLine.y2 - downSide.y[0]) / tan) * (connectingLine.x2 <= connectingLine.x1 ? 1 : -1)
        // 线段终点到线段与底边相交点的垂直距离
        const downSideToCrosspointDistanceY = connectingLine.y2 - downSide.y[0]
        // console.log("计算4条边的坐标范围",endPosition, connectingLine, Math.abs(connectingLine.y1 - downSide.y[0]), Math.abs(connectingLine.x1 - downSide.x[0]), Math.abs(connectingLine.x1 - downSide.x[1]))
        if (downSideCrosspointX >= downSide.x[0] && downSideCrosspointX <= downSide.x[1] && downSideToCrosspointDistanceY >= 0) {
          // 相交点在底边
          // console.log("计算4条边的坐标范围----相交点在底边", downSideCrosspointX, downSide.y[0])
          x1 = downSideCrosspointX
          y1 = downSide.y[0]
        }

        // 线段与顶边相交点的X坐标
        const upSideCrosspointX = connectingLine.x2 + ((connectingLine.y2 - upSide.y[0]) / tan) * (connectingLine.x2 <= connectingLine.x1 ? -1 : 1)
        // 线段终点到线段与顶边相交点的垂直距离
        const upSideToCrosspointDistanceY = upSide.y[0] - connectingLine.y2
        // console.log("计算4条边的坐标范围1", upSideCrosspointX, upSideToCrosspointDistanceY, upSide)
        if (upSideCrosspointX >= upSide.x[0] && upSideCrosspointX <= upSide.x[1] && upSideToCrosspointDistanceY >= 0) {
          // 相交点在顶边
          // console.log("计算4条边的坐标范围----相交点在顶边", upSideCrosspointX, upSide.y[0])
          x1 = upSideCrosspointX
          y1 = upSide.y[0]
        }

        // 线段与左边相交点的y坐标
        const leftSideCrosspointY = connectingLine.y2 + ((leftSide.x[0] - connectingLine.x2) * tan) * (connectingLine.y2 <= connectingLine.y1 ? 1 : -1)
        // 线段终点到线段与左边相交点的水平距离
        const leftSideToCrosspointDistanceX = leftSide.x[0] - connectingLine.x2
        // console.log("计算4条边的坐标范围1", leftSideCrosspointY, leftSideToCrosspointDistanceX, leftSide)
        if (leftSideCrosspointY >= leftSide.y[0] && leftSideCrosspointY <= leftSide.y[1] && leftSideToCrosspointDistanceX >= 0) {
          // 相交点在左边
          // console.log("计算4条边的坐标范围----相交点在左边", leftSideCrosspointY, leftSide.x[0])
          x1 = leftSide.x[0]
          y1 = leftSideCrosspointY
        }

        // 线段与左边相交点的y坐标
        const rightSideCrosspointY = connectingLine.y2 + ((connectingLine.x2 - rightSide.x[0]) * tan) * (connectingLine.y2 <= connectingLine.y1 ? 1 : -1)
        // 线段终点到线段与右边相交点的水平距离
        const rightSideToCrosspointDistanceX = connectingLine.x2 - rightSide.x[0]
        // console.log("计算4条边的坐标范围1", rightSideCrosspointY, rightSideToCrosspointDistanceX, rightSide)
        if (rightSideCrosspointY >= rightSide.y[0] && rightSideCrosspointY <= rightSide.y[1] && rightSideToCrosspointDistanceX >= 0) {
          // 相交点在左边
          // console.log("计算4条边的坐标范围----相交点在左边", rightSideCrosspointY, rightSide.x[0])
          x1 = rightSide.x[0]
          y1 = rightSideCrosspointY
        }
      } else {
        
      }
      let h = itemHeight
      let w = itemWidth
      let xm = beginItem.actionType == "sbsectAction" && fieldItem ? endItem.actionX : this.getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight, beginItem, endItem).x // 线段终点x坐标
      let ym = beginItem.actionType == "sbsectAction" && fieldItem ? endItem.actionY : this.getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight, beginItem, endItem).y // 线段终点y坐标
      lineObj.sourceId = beginItem.actionType == "sbsectAction" && fieldItem ? fieldItem.actionId : beginItem.actionId
      lineObj.targetId = endItem.actionId
      if (lineObj.lineType === "polyline") {
        if (beginItem.actionY + itemHeight < endItem.actionY) { // 当终点表单在起始表单下面的时候
          if (beginDrection === "bottom") {
            if (endDrection === "top") {
              lineObj.polyline = [x1, y1, x1, y1 + (y2 - y1) / 2, x2, y1 + (y2 - y1) / 2, x2, y2].join(" ")
              return "bottom"
            } else if (endDrection === "left") {
              if (x2 < x1) {
                lineObj.polyline = [x1, y1, x1, y1 + (y2 - h / 2 - y1) / 2, x2 - 20, y1 + (y2 - h / 2 - y1) / 2, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 <= x1) {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 + w / 2 + 20 >= x1 && x2 < x1) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + w / 2 + 20, y1 + 20, x2 + w / 2 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 - w / 2 - 20 <= x1 && x2 >= x1) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - w / 2 - 20, y1 + 20, x2 - w / 2 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            }
          } else if (beginDrection === "left") {
            if (endDrection === "top") {
              if (x2 < x1) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "left") {
              if (x2 <= x1) {
                lineObj.polyline = [x1, y1, x2 - 20, y1, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 < x1) {
                lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 + (y2 - y1) / 2, x2 + 20, y1 + (y2 - y1) / 2, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 + w / 2 < x1) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 - w / 2 <= x1 && x2 + w / 2 >= x1) {
                lineObj.polyline = [x1, y1, x2 - w / 2 - 20, y1, x2 - w / 2 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            }
          } else if (beginDrection === "right") {
            if (endDrection === "top") {
              if (x2 > x1) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "left") {
              if (x2 > x1) {
                lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 + (y2 - y1) / 2, x2 - 20, y1 + (y2 - y1) / 2, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 > x1) {
                lineObj.polyline = [x1, y1, x2 + 20, y1, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 + w / 2 < x1) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 + w / 2 >= x1 && x2 - w / 2 <= x1) {
                lineObj.polyline = [x1, y1, x2 + w / 2 + 20, y1, x2 + w / 2 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            }
          } else {
            if (endDrection === "top") {
              if (x2 < x1 - w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              } else if (x2 >= x1 - w / 2 - 20 && x2 <= x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 - w / 2 - 20, y1 - 20, x1 - w / 2 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 <= x1 + w / 2 + 20 && x2 > x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 + w / 2 + 20, y1 - 20, x1 + w / 2 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "left") {
              if (x2 <= x1 - w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else if (x2 > x1 - w / 2 && x2 < x1 + w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 - w / 2 - 20, y1 - 20, x1 - w / 2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 <= x1 - w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else if (x2 > x1 - w / 2 && x2 < x1 + w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 + w / 2 + 20, y1 - 20, x1 + w / 2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 <= x1 - w) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 - (x1 - x2) / 2, y1 - 20, x1 - (x1 - x2) / 2, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 > x1 - w && x2 < x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - w / 2 - 20, y1 - 20, x2 - w / 2 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 >= x1 && x2 < x1 + w) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + w / 2 + 20, y1 - 20, x2 + w / 2 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x1 + (x2 - x1) / 2, y1 - 20, x1 + (x2 - x1) / 2, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            }
          }
        } else if (beginItem.actionY > endItem.actionY + itemHeight) {
          if (beginDrection === "top") {
            if (endDrection === "bottom") {
              lineObj.polyline = [x1, y1, x1, y1 - (y1 - y2) / 2, x2, y1 - (y1 - y2) / 2, x2, y2].join(" ")
              return "top"
            } else if (endDrection === "left") {
              if (x2 <= x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 < x1) {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 + w / 2 <= x1 - 20) {
                lineObj.polyline = [x1, y1, x1, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 + w / 2 + 20 > x1 && x2 <= x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + w / 2 + 20, y1 - 20, x2 + w / 2 + 20, y2 - 20, x2, y2 - 20, x2, y2].join()
              } else if (x2 > x1 && x2 - w / 2 - 20 < x1) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - w / 2 - 20, y1 - 20, x2 - w / 2 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            }
          } else if (beginDrection === "left") {
            if (endDrection === "bottom") {
              if (x2 < x1) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            } else if (endDrection === "left") {
              if (x2 >= x1) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x2 - 20, y1, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 >= x1) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + (y1 - y2) / 2, x2 + 20, y2 + (y1 - y2) / 2, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x2 + (x1 - x2) / 2, y1, x2 + (x1 - x2) / 2, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 - w / 2 >= x1) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 - w / 2 < x1 && x2 + w / 2 > x1) {
                lineObj.polyline = [x1, y1, x2 - w / 2 - 20, y1, x2 - w / 2 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            }
          } else if (beginDrection === "right") {
            if (endDrection === "bottom") {
              if (x2 > x1) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              }
              return "top"
            } else if (endDrection === "left") {
              if (x2 > x1) {
                lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + (y1 - y2) / 2, x2 - 20, y2 + (y1 - y2) / 2, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 >= x1) {
                lineObj.polyline = [x1, y1, x2 + 20, y1, x2 + 20, y2, x2, y2].join(" ")
              } else if (x2 < x1) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 - w / 2 > x1) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 - w / 2 <= x1 && x2 + w / 2 >= x1) {
                lineObj.polyline = [x1, y1, x2 + w / 2 + 20, y1, x2 + w / 2 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            }
          } else {
            if (endDrection === "bottom") {
              if (x2 > x1 + w / 2 + 20) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              } else if (x2 < x1 + w / 2 + 20 && x2 >= x1) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + w / 2 + 20, y1 + 20, x1 + w / 2 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else if (x2 < x1 && x2 >= x1 - w / 2 - 20) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 - w / 2 - 20, y1 + 20, x1 - w / 2 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              }
              return "top"
            } else if (endDrection === "left") {
              if (x2 > x1 + w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - 20, y1 + 20, x2 - 20, y2, x2, y2].join(" ")
              } else if (x2 <= x1 + w / 2 && x2 >= x1 - w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 - w / 2 - 20, y1 + 20, x1 - w / 2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - 20, y1 + 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "right") {
              if (x2 >= x1 + w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              } else if (x2 < x1 + w / 2 && x2 > x1 - w / 2) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + w / 2 + 20, y1 + 20, x1 + w / 2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else {
              if (x2 > x1 + w) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + (x2 - x1) / 2, y1 + 20, x1 + (x2 - x1) / 2, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 <= x1 + w && x2 > x1) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 - w / 2 - 20, y1 + 20, x1 - w / 2 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else if (x2 <= x1 && x2 > x1 - w) {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + w / 2 + 20, y1 + 20, x1 + w / 2 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + (x1 - x2) / 2, y1 + 20, x2 + (x1 - x2) / 2, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            }
          }
        } else if (beginItem.actionX + itemWidth < endItem.actionX) {
          if (beginDrection === "right") {
            if (endDrection === "left") {
              lineObj.polyline = [x1, y1, x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2].join(" ")
              return "right"
            } else if (endDrection === "top") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2 - h / 2 - 20 || y1 > y2 + h / 2 + 20) {
                lineObj.polyline = [x1, y1, x2 + 20, y1, x2 + 20, y2, x2, y2].join(" ")
              } else if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - h / 2 - 20, x2 + 20, y2 - h / 2 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + h / 2 + 20, x2 + 20, y2 + h / 2 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            }
          } else if (beginDrection === "top") {
            if (endDrection === "left") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "top") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x1 + (x2 - x1) / 2, y1 - 20, x1 + (x2 - x1) / 2, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else {
              if (y1 < y2 - h / 2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2 - h / 2 - 20, x2 + 20, y2 - h / 2 - 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            }
          } else if (beginDrection === "bottom") {
            if (endDrection === "left") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - 20, y1 + 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "top") {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x1 + (x2 - x1) / 2, y1 + 20, x1 + (x2 - x1) / 2, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2 + h / 2) {
                lineObj.polyline = [x1, y1, x1, y2 + h / 2 + 20, x2 + 20, y2 + h / 2 + 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            }
          } else {
            if (endDrection === "left") {
              if (y2 > y1 && y1 + h / 2 + 20 >= y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 + h / 2 + 20, x2 - 20, y1 + h / 2 + 20, x2 - 20, y2, x2, y2].join(" ")
              } else if (y2 <= y1 && y1 - h / 2 - 20 <= y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 - h / 2 - 20, x2 - 20, y1 - h / 2 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            } else if (endDrection === "top") {
              if (y1 - h / 2 < y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 - h / 2 - 20, x2, y1 - h / 2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 + h / 2 < y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 + h / 2 + 20, x2, y1 + h / 2 + 20, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 - h / 2 - 20, x2 + 20, y1 - h / 2 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y1 + h / 2 + 20, x2 + 20, y1 + h / 2 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            }
          }
        } else if (beginItem.actionX > endItem.actionX + itemWidth) {
          if (beginDrection === "left") {
            if (endDrection === "right") {
              lineObj.polyline = [x1, y1, x2 + (x1 - x2) / 2, y1, x2 + (x1 - x2) / 2, y2, x2, y2].join(" ")
              return "left"
            } else if (endDrection === "top") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x2, y1, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2 - h / 2 - 20 || y1 > y2 + h / 2 + 20) {
                lineObj.polyline = [x1, y1, x2 - 20, y1, x2 - 20, y2, x2, y2].join(" ")
              } else if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 - h / 2 - 20, x2 - 20, y2 - h / 2 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 - 20, y1, x1 - 20, y2 + h / 2 + 20, x2 - 20, y2 + h / 2 + 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            }
          } else if (beginDrection === "top") {
            if (endDrection === "right") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + 20, y1 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              }
              return "left"
            } else if (endDrection === "top") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2, y1 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              lineObj.polyline = [x1, y1, x1, y1 - 20, x2 + (x1 - x2) / 2, y1 - 20, x2 + (x1 - x2) / 2, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              return "top"
            } else {
              if (y1 > y2 - h / 2) {
                lineObj.polyline = [x1, y1, x1, y2 - h / 2 - 20, x2 - 20, y2 - h / 2 - 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 - 20, x2 - 20, y1 - 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            }
          } else if (beginDrection === "bottom") {
            if (endDrection === "right") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + 20, y1 + 20, x2 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else if (endDrection === "top") {
              lineObj.polyline = [x1, y1, x1, y1 + 20, x2 + (x1 - x2) / 2, y1 + 20, x2 + (x1 - x2) / 2, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2, y1 + 20, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2 + h / 2) {
                lineObj.polyline = [x1, y1, x1, y2 + h / 2 + 20, x2 - 20, y2 + h / 2 + 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1, y1 + 20, x2 - 20, y1 + 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            }
          } else {
            if (endDrection === "right") {
              if (y2 > y1 && y1 + h / 2 + 20 >= y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 + h / 2 + 20, x2 + 20, y1 + h / 2 + 20, x2 + 20, y2, x2, y2].join(" ")
              } else if (y2 <= y1 && y1 - h / 2 - 20 <= y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 - h / 2 - 20, x2 + 20, y1 - h / 2 - 20, x2 + 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2, x2, y2].join(" ")
              }
              return "left"
            } else if (endDrection === "top") {
              if (y1 - h / 2 < y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 - h / 2 - 20, x2, y1 - h / 2 - 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - 20, x2, y2 - 20, x2, y2].join(" ")
              }
              return "bottom"
            } else if (endDrection === "bottom") {
              if (y1 + h / 2 < y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + 20, x2, y2 + 20, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y1 + h / 2 + 20, x2, y1 + h / 2 + 20, x2, y2].join(" ")
              }
              return "top"
            } else {
              if (y1 < y2) {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 + h / 2 + 20, x2 - 20, y2 + h / 2 + 20, x2 - 20, y2, x2, y2].join(" ")
              } else {
                lineObj.polyline = [x1, y1, x1 + 20, y1, x1 + 20, y2 - h / 2 - 20, x2 - 20, y2 - h / 2 - 20, x2 - 20, y2, x2, y2].join(" ")
              }
              return "right"
            }
          }
        } else {
          lineObj.polyline = [x1, y1, x2, y2].join()
          return ""
        }
      } else {
        const polyLineArr = lineObj.polyline.split(" ")
        if (polyLineArr && polyLineArr.length >= 4) {
          polyLineArr[0] = x1
          polyLineArr[1] = y1
          polyLineArr[polyLineArr.length - 2] = xm
          polyLineArr[polyLineArr.length - 1] = ym
          lineObj.polyline = polyLineArr.join(" ")
        } else {
          lineObj.polyline = [x1, y1, xm, ym,].join(" ")
        }
        if (endDrection === "left") {
          return "right"
        } else if (endDrection === "right") {
          return "left"
        } else if (endDrection === "top") {
          return "bottom"
        } else if (endDrection === "bottom") {
          return "top"
        }
      }
    },
    //更新移动的连接线
    updataPolyline(e, dataList, itemWidth, itemHeight) {
      let item = e
      for (let i in dataList) {
        if (dataList[i].actionId == item.actionId) {
          if (dataList[i].children.length > 0) {
            for (let k in dataList[i].children) {
              for (let p in dataList) {
                if (dataList[i].children[k].actionId == dataList[p].actionId) {
                  if (dataList[p].actionX > (dataList[i].actionX + itemWidth)) {
                    dataList[i].children[k].begin = "right"
                    dataList[i].children[k].end = "left"
                  } else if (dataList[p].actionX < (dataList[i].actionX - itemWidth)) {
                    dataList[i].children[k].begin = "left"
                    dataList[i].children[k].end = "right"
                  } else {
                    if (dataList[p].actionY > (dataList[i].actionY - itemHeight)) {
                      dataList[i].children[k].begin = "bottom"
                      dataList[i].children[k].end = "top"
                    } else {
                      dataList[i].children[k].begin = "top"
                      dataList[i].children[k].end = "bottom"
                    }
                  }
                }
              }
            }
          }
        }
        if (dataList[i].children.length > 0) {
          for (let k in dataList[i].children) {
            if (item.actionId == dataList[i].children[k].actionId) {
              if (item.actionX > (dataList[i].actionX + itemWidth)) {
                dataList[i].children[k].begin = "right"
                dataList[i].children[k].end = "left"
              } else if (item.actionX < (dataList[i].actionX - itemWidth)) {
                dataList[i].children[k].begin = "left"
                dataList[i].children[k].end = "right"
              } else {
                if (item.actionY > (dataList[i].actionY - itemHeight)) {
                  dataList[i].children[k].begin = "bottom"
                  dataList[i].children[k].end = "top"
                } else {
                  dataList[i].children[k].begin = "top"
                  dataList[i].children[k].end = "bottom"
                }
              }
            }
          }
        }
      }
    },
    /**
     * 获取三角坐标
     * @param {*} x1 起点X坐标
     * @param {*} y1 起点Y坐标
     * @param {*} x2 终点X坐标
     * @param {*} y2 终点Y坐标
     * @param {*} itemWidth 元素宽度
     * @param {*} itemHeight 元素高度
     * @return {*} 包含生成箭头的X、Y坐标的对象
     */
    getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight, beginItem, endItem) {
      const endItemWidth = this.getItemWidth(endItem, this.itemOptions)
      const endItemHeight = this.getItemHeight(endItem, this.itemOptions)
      // console.log("getArrowPos", x1, y1, x2, y2, beginItem, endItem, endItemWidth, endItemHeight)
      // itemHeight = (endItem.actionName == "开始" || endItem.actionName == "结束") ? itemHeight - 8 : itemHeight
      const child = beginItem.children.find(item => item.targetId == endItem.actionId)
      const polyline = child && child.polyline && child.polyline.split(" ")
      if (polyline && polyline.length > 4) {
        x1 = polyline[polyline.length - 4] * 1
        y1 = polyline[polyline.length - 3] * 1
      }
      const y = Math.abs(y2 - y1) // y轴
      const x = Math.abs(x2 - x1) // x轴
      const tan = y / x // tan角度
      const threshold = endItemHeight / endItemWidth // tan的阈值
      const coefficientY = y2 > y1 ? 1 : y2 == y1 ? 0 : -1 // Y轴偏移量的系数
      const coefficientX = x2 > x1 ? 1 : x2 == x1 ? 0 : -1 // X轴偏移量的系数
      const data = { x: 0, y: 0 }

      if (x2 != x1 && y2 != y1) {
        if (tan >= threshold) {
          data.y = y2 - (endItemHeight / 2) * coefficientY
          data.x = x2 - (endItemHeight / 2 / tan) * coefficientX
        } else {
          data.y = y2 - (endItemWidth / 2) * tan * coefficientY
          data.x = x2 - (endItemWidth / 2) * coefficientX
        }
      } else {
        data.y = y2 - (endItemHeight / 2) * coefficientY
        data.x = x2 - (endItemWidth / 2) * coefficientX
      }
      return data
    },
    /** 移动箭头碰撞检测
        ---------------------
        item 表单元素
        x2 y2 鼠标当前坐标位置
    */
    testImpactMoveMouse(item, x2, y2, itemWidth, itemHeight) {
      if (x2 > item.actionX - 10 && x2 < item.actionX + itemWidth + 10 && y2 > item.actionY - 10 && y2 < item.actionY + itemHeight + 10) {
        item.actionCoverShow = true
        return true
      }

      return false
    },
    fieldTestImpactMoveMouse(item, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex) {
      if (item.actionType == "sbsectAction" && fieldItem) {
        const fieldList = this.getSbsectFieldList(item)
        // console.log("分段组件testImpactMoveMouse", item, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
        let result
        for (let i in fieldList) {
          const leftX = item.actionX
          const leftY = this.getFieldLeftCircleY(item, i)
          const rightX = item.actionX + this.itemOptions.fieldActionWidth
          const rightY = this.getFieldRightCircleY(item, i)
          const isLinkLeft = x2 > leftX - 10 && x2 < leftX + 10 && y2 > leftY - 10 && y2 < leftY + 10
          const isLinkRight = x2 > rightX - 10 && x2 < rightX + 10 && y2 > rightY - 10 && y2 < rightY + 10
          if (isLinkLeft) {
            result = {
              endItem: Object.assign(fieldList[i], {
                actionX: leftX,
                actionY: leftY,
                actionType: "fieldAction",
                drection: "left"
              })
            }
            break
          }
          if (isLinkRight) {
            result = {
              endItem: Object.assign(fieldList[i], {
                actionX: rightX,
                actionY: rightY,
                actionType: "fieldAction",
                drection: "right"
              })
            }
            break
          }
        }
        return result
      } else {
        return false
      }
    },
    //线条清除选择
    clearAllLineCheck(e) {
      for (let i = 0; i < e.length; i++) {
        e[i].checked = false
      }
    },
    //鼠标相对于svg的left位置
    getScrollLeft() {
      let scrollLeft = 0
      if (document.documentElement && document.documentElement.scrollLeft) {
        scrollLeft = document.documentElement.scrollLeft
      } else {
        scrollLeft = document.body.scrollLeft
      }
      return scrollLeft
    },
    //鼠标相对于svg的top位置
    getScrollTop() {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    //生成线条id
    getLineId() {
      return "line" + new Date().getTime()
    },
    //生成组件的id
    getNewRectId(e, item) {
      let mx = 0
      for (let i in item) {
        mx = mx > (item[i].actionId.split(e)[1] * 1) ? mx : (item[i].actionId.split(e)[1] * 1)
      }
      return mx + 1
    },
    // 获取分段组件下的字段列表
    getSbsectFieldList(item) {
      if (item.actionType == 'sbsectAction') {
        const fieldList = item.conf.find(item => item.name == "fieldList").value
        return JSON.parse(fieldList)
      } else {
        return []
      }
    },
    // 获取字段左侧点的Y坐标
    getFieldLeftCircleY(item, index) {
      return item.actionY + 42 + index * 21
    },
    // 获取字段右侧点的Y坐标
    getFieldRightCircleY(item, index) {
      return item.actionY + 42 + index * 21
    },
    // 获取分段组件下的l5服务列表
    getL5ServiceList(item) {
      if (item.actionType == 'sbsectAction') {
        const l5ServiceList = item.conf.find(item => item.name == "l5ServiceList")?.value || "[]"
        return JSON.parse(l5ServiceList)
      } else {
        return []
      }
    },
  },
}