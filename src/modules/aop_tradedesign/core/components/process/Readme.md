## 一、 渲染层 comps/index.vue

#### 1.画布空白处点击,handleSvgBgClick()。
	 调用index.js中clearAllLineCheck方法清除线条数据。

#### 2.线条点击 handleLineClick()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event  |  对象  |   是   |  事件对象  |
|  item  |  对象  |   是   |  线条数据lineList表单对象  |

#### 3.线条双击 handleLineDClick() 

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item  |  对象  |   是   |  线条数据lineList表单对象  |

#### 4.线条删除 handleDelLine()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item  |  对象  |   是   |  线条数据lineList表单对象  |

#### 5.组件点击操作 handleItemBtnClick()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  e     |  字符  |   是   |  传递一个字符串，判断是删除还是编辑操作  |
|  item  |  对象  |   是   |  线条数据lineList表单对象  |
 
#### 6.组件移动 handleMoveMD()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |
|  item  |  对象  |   是   |  线条数据dataList表单对象  |

#### 7.鼠标移入组件操作按钮 handleItemBtnMouseover()
	触发handleItemBtnMouseover事件

#### 8.鼠标移出组件操作按钮 handleItemBtnMouseout()
	触发handleItemBtnMouseout事件

#### 9.鼠标按下小圈圈 handleMoveLineMouseDown()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |
|  drection |  字符  |   是   |  判断小圈圈的方位  |
|  item  |  对象  |   是   |  小拳拳所在的表单对象  |

#### 10.拖入新组件 handleNewRectMousedown()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |

#### 11.组件点击 handleItemClick()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |

#### 12.更新画布 updateProcessMain()
	触发updateProcessMain事件, 更新画布

#### 13.更新画布坐标 getSvgPos()
	说明：更新画布左和上分别相对浏览器视窗的位置

#### 14.更新dateList updateDataParams()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |

#### 15.更新线条条件 updateCondition()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   是   |  事件对象  |

#### 16.点击编辑需求 editNeeds()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   否   |  事件对象  |

#### 17.点击查看需求 checkNeeds()

|  参数  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  event |  对象  |   否   |  事件对象  |

#### 18.组件配置 itemOptions

|  属性  |  说明  |  属性  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  itemWidth    |  x坐标              |   itemHeight    |  y坐标  |
|  itemEditClor |  组件编辑按钮填充色  |   itemDelClor   |  组件删除按钮填充色  |
|  circleR      |  小圈圈的半径        |   circleFill   |  小圈圈的填充色  |
|  circleStroke |  小圈圈的线条颜色    |   focusClor    |  焦点颜色  |
|  btnWidth     |  svg的宽度          |   btnHeight    |  svg的高度  |
|  coverBg      |  遮罩层的背景颜色   |  

#### 19.线条配置 lineOptions

|  属性  |  说明  |  属性  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  strokeColor       |  线条轮廓颜色       |   strokeWidth     |  线条的轮廓厚度  |
|  checkStrokeColor  |  轮廓颜色或者填充色  |   checkStrokeWidth   |  线条的轮廓厚度  |
|  startCircleColor  |  填充色             |   editStrokeWidth    |  轮廓厚度  |
|  focusClor         |  焦点颜色            |

#### 20.画布配置 svgOptions
    
|  属性  |  说明  |  属性  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  fillColor |  填充色          |   left     |  离页面左侧的距离  |
|  top       |  离页面上侧的距离 |   width    |  宽度  |
|  height    |  高度            | 

## 二、核心层，core/index.js，为渲染层提供核心方法

#### 1.渲染线条 getLineList()
    
|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  lineList |  数组  |   是   |  线条数据  |
|  dataList |  数组  |   是   |  完整数据  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

#### 2.获取对应dataList的id getChild()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  id    |  字符  |   是   |  id值  |
|  dataList |  数组  |   是   |  完整数据  |

|  出参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|       |  布尔值  |   是   |  是否有查到对应的id值  |

#### 2.线条横向坐标渲染和纵向坐标渲染 getPolylineX() getPolylineY ()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  e     |  数组  |   是   |  线条数据中polyline属性  |

|  出参  |  类型    |  说明  |
|  ----  |  ----    |  ----  |
|   x    |  数字    |  x坐标 / y坐标 |

#### 3.移动完成后的连接线的终点坐标以及在终点对象上的方位 getEndPos()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item     |  数组  |   是   |  完整数据dataList  |
|  x2     |  数字  |   是   |  鼠标相对于svg的left位置  |
|  y2     |  数字  |   是   |  鼠标相对于svg的top位置  |
|  y2     |  数字  |   是   |  鼠标相对于svg的top位置  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型   |  说明  |
|  ----  |  ----   |  ----  |
|   qqList[0]    |   是   |  移动完成后的连接线的终点坐标以及在终点对象的上的方位 |

#### 4.创建新的连接线 newLineObj()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item        |  对象    |    是   |  完整数据dataList表单对象  |
|  begindDrection |  字符  |   是   |  小圈圈的方位    |
|  type       |  字符  |   是   |  线条样式  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|  x1    |  数字  |  x坐标 |
|  y1    |  数字  |  y坐标 |
|  polyline    |  数组  |   |
|  checked    |  布尔值  | false  |
|  drection    |  字符  |  方位 |
|  condition    |  字符  |   |


#### 5.设置移动中的连接线 setMoveLineObj()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  beginItem    |  对象    |    是   |  完整数据dataList表单对象  |
|  lineObj     |  对象    |   是   |  当前选中的连接线对象    |
|  drection       |  字符  |   是   |  小圈圈的方位  |
|  x2 |  数字  |   是   |  鼠标相对于svg的left位置 |
|  y2 |  数字  |   是   |  鼠标相对于svg的top位置  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

#### 6.设置移动完成后的连接线 setLineObj()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item    |  对象    |    是   |  完整数据dataList表单对象  |
|  lineObj     |  对象    |   是   |  当前选中的连接线对象    |
|  drection    |  字符  |   是   |  小圈圈的方位  |
|  endItem     |  数组  |   是   |  完整数据dataList  |
|  endDrection  |  字符  |   是   |  移动完成后的连接线的终点坐标对象上的方位的drection  |
|  x2 |  数字  |   是   |   x2是移动完成后的连接线的终点坐标对象上的方位的x |
|  y2 |  数字  |   是   |  是移动完成后的连接线的终点坐标对象上的方位的y  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

#### 7.获取移动中的连接线 getMovePolyline()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  lineObj     |  对象    |   是   |  当前选中的连接线对象    |
|  drection       |  字符  |   是   |  连接线起始表单项的小圈圈方位  |
|  x2 |  数字  |   是   |  鼠标相对于svg的left位置 |
|  y2 |  数字  |   是   |  鼠标相对于svg的top位置  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|  ""    |  字符  |  方位 |

	
#### 8.获取移动完成后的连接线 getPolyline()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  beginItem   |  对象    |   是   |  连接线起始表单项    |
|  lineObj     |  对象    |   是   |  当前选中的连接线对象    |
|  beginDrection |  字符  |   是   |  起始时小圈圈的方位  |
|  endItem     |  对象    |   是   |  连接线结束表单项    |
|  endDrection       |  字符  |   是   |  结束时小圈圈的方位  |
|  x2 |  数字  |   是   |  鼠标相对于svg的left位置 |
|  y2 |  数字  |   是   |  鼠标相对于svg的top位置  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|  ""    |  字符  |  方位 |

#### 9.更新移动的连接线  updataPolyline()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  e    |  对象    |   是   |  起始完整数据对象    |
|  lineObj     |  对象    |   是   |  结束完整数据对象    |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |


#### 10.获取三角坐标 getArrowPos()
	
|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  x1   |  数字    |   是   |      |
|  y1   |  数字    |   是   |      |
|  x2   |  数字    |   是   |      |
|  y2   |  数字    |   是   |      |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|  data  |  对象  |  里面有x坐标y坐标 |

#### 11.获取连接线的箭头 getlineArrows()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  x2   |  数字    |   是   |   连接线终点x坐标   |
|  y2   |  数字    |   是   |   连接线终点y坐标  |
|  direction|  字符    |   是   |   箭头方向    |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|  ""  |  字符串  |   把数组拼接成字符串 |

#### 12.移动箭头碰撞检测 testImpactMoveMouse()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  item   |  数组    |   是   |   表单元素   |
|  x2   |  数字    |   是   |   鼠标当前x坐标   |
|  y2   |  数字    |   是   |   鼠标当前y坐标  |
|  itemWidth |  数字  |   是   |  组件配置itemOptions.itemWidth  |
|  itemHeight |  数字  |   是   |  组件配置itemOptions.itemWidth  |

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
|      |  布尔型  |   返回一个布尔型 |
 
#### 13.线条清除选择 clearAllLineCheck() 
	clearAllLineCheck方法，参数传递 lineList线条数据
|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  e   |  数组    |   是   |   lineList线条数据   |

#### 14.鼠标相对于svg的left位置 getScrollLeft()

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
| scrollLeft |  数字 |  鼠标相对于svg的left位置  |

#### 15.鼠标相对于svg的top位置 getScrollTop()

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
| scrollTop |  数字 |  鼠标相对于svg的top位置  |

#### 16.生成线条id getLineId()

|  出参  |  类型  |  说明  |
|  ----  |  ---- |  ----  |
| ""   |  字符 |  用"line"拼接一串数字返回出去  |

#### 17. 生成组件的id getNewRectId()

|  入参  |  类型  |  必选  |  说明  |
|  ----  |  ----  |  ----  |  ----  |
|  e     |  字符串  |   是   |     |
|  item     |  数组  |   是   |   完整数据对象dataList  |
