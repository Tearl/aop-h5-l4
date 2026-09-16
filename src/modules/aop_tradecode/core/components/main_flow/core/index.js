import processConf from "./conf";

const processUtil = {
  //渲染线条
  getLineList(lineList, dataList, itemWidth, itemHeight, isTest) {
    // console.log("getLineList", JSON.parse(JSON.stringify(lineList)), dataList, itemWidth, itemHeight, isTest)
    lineList.length = 0
    for (let i = 0; i < dataList.length; i++) {
      let children = dataList[i].children
      let tempDelLine = []
      if (children && children.length > 0) {
        children.forEach((childInfo, index, arr) => {
          let child = processUtil.getChild(childInfo, dataList, dataList[i])
          // console.log("childInfo,child",childInfo,child)
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
              lineObj = processUtil.newLineObj(dataList[i], childInfo.begin, "polyline", itemWidth, itemHeight)

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
              processUtil.setLineObj(dataList[i], lineObj, childInfo.begin, child, childInfo.end, x2, y2, itemWidth, itemHeight)
              lineList.push(lineObj)
            } else {
              if (child.actionType == "sbsectAction") {
                const childFieldList = processUtil.getSbsectFieldList(child)
                const childIndex = childFieldList.findIndex(item => item.actionId == childInfo.targetId)
                let _child = {}
                if (childInfo.end == "left") {
                  _child = Object.assign(childFieldList[childIndex], {
                    actionX: child.actionX,
                    actionY: processUtil.getFieldLeftCircleY(child, childIndex),
                    actionType: "fieldAction",
                    drection: "left"
                  })
                  x2 = _child.actionX
                  y2 = processUtil.getFieldLeftCircleY(_child, childIndex)
                } else if (childInfo.end == "right") {
                  _child = Object.assign(childFieldList[childIndex], {
                    actionX: child.actionX + processConf.itemOptions.fieldActionWidth,
                    actionY: processUtil.getFieldRightCircleY(child, childIndex),
                    actionType: "fieldAction",
                    drection: "right"
                  })
                  x2 = _child.actionX + processConf.itemOptions.fieldActionWidth
                  y2 = processUtil.getFieldRightCircleY(_child, childIndex)
                }
                const fieldList = processUtil.getSbsectFieldList(dataList[i])
                const fieldIndex = fieldList.findIndex(field => field.actionId == childInfo.sourceId)
                const fieldItem = fieldList[fieldIndex]
                // console.log("getLineList-fieldList", fieldList, childIndex, fieldIndex)
                lineObj = processUtil.newLineObj(dataList[i], childInfo.begin, "line", itemWidth, itemHeight, fieldItem, fieldIndex)
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
                processUtil.setLineObj(dataList[i], lineObj, childInfo.begin, _child, childInfo.end, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
                lineList.push(lineObj)
                // console.log("lineList.push(lineObj)", lineList)
              } else {
                x2 = processUtil.getChild(childInfo, dataList).actionX + itemWidth / 2
                y2 = processUtil.getChild(childInfo, dataList).actionY + itemHeight / 2
                lineObj = processUtil.newLineObj(dataList[i], childInfo.begin, "line", itemWidth, itemHeight, childInfo)
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
                processUtil.setLineObj(dataList[i], lineObj, childInfo.begin, child, childInfo.end, x2, y2, itemWidth, itemHeight)
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
      // const fieldList = processUtil.getSbsectFieldList(item)
      // const child = fieldList.find(field => field.actionId == childInfo.targetId)
      // console.log("getChild-if", fieldList, child, childInfo)
      // return child
    } else {
      return dataList.find(data => {
        return data.actionId === childInfo.targetId
      })
    }
  },
  //移动完成后的连接线的终点坐标以及在终点对象的上的方位
  getEndPos(item, x2, y2, width, height) {
    // console.log("getEndPos",item, x2, y2, width, height)
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
  //创建新的连接线
  newLineObj(item, begindDrection, type, itemWidth, itemHeight, fieldItem, fieldIndex) {
    // console.log("newLineObj", item, begindDrection, type, itemWidth, itemHeight, fieldItem, fieldIndex)
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
          x1: begindDrection == "left" ? item.actionX : item.actionX + processConf.itemOptions.fieldActionWidth,
          y1: begindDrection == "right" ? processUtil.getFieldLeftCircleY(item, fieldIndex) : processUtil.getFieldRightCircleY(item, fieldIndex),
          polyline: [],
          checked: false,
          drection: "",
          condition: {}
        }
      } else {
        return {
          x1: item.actionX + (itemWidth / 2),
          y1: item.actionY + (itemHeight / 2),
          polyline: [],
          checked: false,
          drection: "",
          condition: {}
        }
      }
    }
  },
  //设置移动中的连接线
  setMoveLineObj(beginItem, lineObj, drection, x2, y2, itemWidth, itemHeight) {
    if (lineObj.lineType === "polyline") {
      processUtil.getMovePolyline(lineObj, drection, x2, y2, itemWidth, itemHeight)
    } else {
      processUtil.getMovePolyline(lineObj, drection, x2, y2, itemWidth, itemHeight)
    }
  },
  //设置移动完成后的连接线
  setLineObj(beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex) {
    // console.log("setLineObj",beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    // console.log("getLineList-lineObj2",beginItem, JSON.parse(JSON.stringify(lineObj)), begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    if (lineObj.lineType === "polyline") {
      processUtil.getPolyline(beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    } else {
      processUtil.getPolyline(beginItem, lineObj, begin, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    }
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
      if (drection === "left") {
        lineObj.polyline = [x1, y1, x2, y2].join(" ")
        return "left"
      } else if (drection === "right") {
        lineObj.polyline = [x1, y1, x2, y2].join(" ")
        return "right"
      } else if (drection === "top") {
        lineObj.polyline = [x1, y1, x2, y2].join(" ")
        return "top"
      } else if (drection === "bottom") {
        lineObj.polyline = [x1, y1, x2, y2].join(" ")
        return "bottom"
      }
    }

  },
  //获取移动完成后的连接线
  getPolyline(beginItem, lineObj, beginDrection, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex) {
    // console.log("getPolyline", beginItem, JSON.parse(JSON.stringify(lineObj)), beginDrection, endItem, endDrection, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
    let x1 = lineObj.x1
    let y1 = lineObj.y1
    let h = itemHeight
    let w = itemWidth
    let xm = beginItem.actionType == "sbsectAction" && fieldItem ? endItem.actionX : processUtil.getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight, beginItem, endItem).x
    let ym = beginItem.actionType == "sbsectAction" && fieldItem ? endItem.actionY : processUtil.getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight, beginItem, endItem).y
    // console.log("xm ym", xm, ym)
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
        // lineObj.polyline = [x1, y1, xm, ym,].join(" ")
        return "right"
      } else if (endDrection === "right") {
        // lineObj.polyline = [x1, y1, xm, ym,].join(" ")
        return "left"
      } else if (endDrection === "top") {
        // lineObj.polyline = [x1, y1, xm, ym,].join(" ")
        return "bottom"
      } else if (endDrection === "bottom") {
        // lineObj.polyline = [x1, y1, xm, ym,].join(" ")
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
    itemHeight = (endItem.actionName == "开始" || endItem.actionName == "结束") ? itemHeight - 8 : itemHeight
    const child = beginItem.children.find(item => item.targetId == endItem.actionId)
    const polyline = child && child.polyline && child.polyline.split(" ")
    if (polyline && polyline.length > 4) {
      x1 = polyline[polyline.length - 4] * 1
      y1 = polyline[polyline.length - 3] * 1
    }
    const y = Math.abs(y2 - y1) // y轴
    const x = Math.abs(x2 - x1) // x轴
    const tan = y / x // tan角度
    const threshold = itemHeight / itemWidth // tan的阈值
    const coefficientY = y2 > y1 ? 1 : y2 == y1 ? 0 : -1 // Y轴偏移量的系数
    const coefficientX = x2 > x1 ? 1 : x2 == x1 ? 0 : -1 // X轴偏移量的系数
    const data = { x: 0, y: 0 }

    if (x2 != x1 && y2 != y1) {
      if (tan >= threshold) {
        data.y = y2 - (itemHeight / 2) * coefficientY
        data.x = x2 - (itemHeight / 2 / tan) * coefficientX
      } else {
        data.y = y2 - (itemWidth / 2) * tan * coefficientY
        data.x = x2 - (itemWidth / 2) * coefficientX
      }
    } else {
      data.y = y2 - (itemHeight / 2) * coefficientY
      data.x = x2 - (itemWidth / 2) * coefficientX
    }
    // 涉及到带圆角图形的情况
    // if (endItem.actionName == "开始" || endItem.actionName == "结束") {
    //   // console.log("有圆角")
    //   // 阈值下限(圆角半径20的情况下)
    //   const rThresholdLow = ((itemHeight / 2) - 20) / (itemWidth / 2)
    //   // 阈值上限(圆角半径20的情况下)
    //   const rThresholdHight = (itemHeight / 2) / ((itemWidth / 2) - 20)
    //   // 需要补偿圆角偏移量的情况
    //   if (tan > rThresholdLow && tan < threshold) {
    //     const offsetX = (20 - Math.sqrt(400 / (1 + Math.pow(tan, 2)))) * coefficientX
    //     console.log("需要补偿圆角x偏移量", offsetX)
    //     data.x = data.x + offsetX
    //   }
    //   if (tan > threshold && tan < rThresholdHight) {
    //     const offsetY = (20 - (Math.sqrt(400 * Math.pow(tan, 2) / (1 + Math.pow(tan, 2))))) * coefficientY
    //     console.log("需要补偿圆角y偏移量", offsetY)
    //     data.y = data.y + offsetY
    //   }
    // }
    return data
  },
  //获取三角坐标(原函数，先注释)
  // getArrowPos(x1, y1, x2, y2, itemWidth, itemHeight) {
  //   let a = 0
  //   let b = 0
  //   let c = 0
  //   let data = { x: 0, y: 0 }
  //   if (x2 - x1 == 0 || x1 - x2 == 0) {
  //     data.x = x2
  //     data.y = y2 > y1 ? (y2 - itemHeight / 2) : (y2 + itemHeight / 2)
  //     return data
  //   } else if (y2 - y1 == 0 || y1 - y2 == 0) {
  //     data.x = x2 > x1 ? (x2 - itemWidth / 2) : (x2 + itemWidth / 2)
  //     data.y = y2
  //     return data
  //   } else {
  //     a = y2 - y1 > 0 ? y2 - y1 : y1 - y2 //y轴
  //     b = x2 - x1 > 0 ? x2 - x1 : x1 - x2 //x轴
  //     c = a / b //tan角度
  //     if (x2 - x1 > 0 && y2 - y1 > 0) {
  //       if (c < 1) {
  //         data.y = y2 - c * (itemWidth / 2)
  //         data.x = x2 - itemWidth / 2
  //       } else if (c > 1) {
  //         data.y = y2 - itemHeight / 2
  //         data.x = x2 - ((itemHeight / 2) / c)
  //       } else {
  //         data.y = y2 - itemHeight / 2
  //         data.x = x2 - itemWidth / 2
  //       }
  //     } else if (x2 - x1 < 0 && y2 - y1 > 0) {
  //       if (c < 1) {
  //         data.y = y2 - c * (itemWidth / 2)
  //         data.x = x2 + itemWidth / 2
  //       } else if (c > 1) {
  //         data.y = y2 - itemHeight / 2
  //         data.x = ((itemHeight / 2) / c) + x2
  //       } else {
  //         data.y = y2 - itemHeight / 2
  //         data.x = x2 + itemWidth / 2
  //       }
  //     } else if (x2 - x1 > 0 && y2 - y1 < 0) {
  //       if (c < 1) {
  //         data.y = c * (itemWidth / 2) + y2
  //         data.x = x2 - itemWidth / 2
  //       } else if (c > 1) {
  //         data.y = y2 + itemHeight / 2
  //         data.x = x2 - ((itemHeight / 2) / c)
  //       } else {
  //         data.y = y2 - itemHeight / 2
  //         data.x = x2 - itemWidth / 2
  //       }
  //     } else {
  //       if (c < 1) {
  //         data.y = y2 + c * (itemWidth / 2)
  //         data.x = x2 + itemWidth / 2
  //       } else if (c > 1) {
  //         data.y = y2 + itemHeight / 2
  //         data.x = x2 + ((itemHeight / 2) / c)
  //       } else {
  //         data.y = y2 + itemHeight / 2
  //         data.x = x2 + itemWidth / 2
  //       }
  //     }
  //     return data
  //   }
  // },
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
      const fieldList = processUtil.getSbsectFieldList(item)
      // console.log("分段组件testImpactMoveMouse", item, x2, y2, itemWidth, itemHeight, fieldItem, fieldIndex)
      let result
      for (let i in fieldList) {
        const leftX = item.actionX
        const leftY = processUtil.getFieldLeftCircleY(item, i)
        const rightX = item.actionX + processConf.itemOptions.fieldActionWidth
        const rightY = processUtil.getFieldRightCircleY(item, i)
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
}

export default processUtil