# 使用规则

- tableType:    有selection和index两个值 （可传可不传）
- rowK:         为row-key的字段（可传可不传）若有children嵌套数组则必须传,selection多选框必须传
- hideCheckbox  是否隐藏多选框， 隐藏传字符串 hide_checkbox
- radioModel    传入单选按钮的model

## table为一个数组对象；里面有：

- label:        表格label属性
- prop:         表格prop属性
- filter:       过滤器方法名
- width:        column 宽度 （可传可不传） 
- minWidth:     column 最小宽度 （可传可不传） 
- type:         显示类型 input,select,text,enum,html,switch, button, checkbox(有true与false两个属性对应true-label，false-label), textClick(文字可点击触发事件,有默认样式),textClassList(通过表格的属性值判断文字样式),radio,inputBtn（输入框和按钮显示其一,通过传入inputBtn函数判断）
- textClassList 数组,有class属性以及val属性。（两个属性都必须有否则无效） 当表格值为val时显示class类名。class类名自定义
- textClass     自定义类名。可自定义样式(如果不传则默认样式)
- operate       当type为textClick时。通过operate的值判断点击那个值(如果type为其他则没用)
- tooltip:      文字提示 true, false; 当tooltip为true时, type只能是text （可传可不传）不传默认false
- selectVal:    如果type为select, selectVal为值里面有type和value
- inputStyle:   可以设置input输入框的宽度，如： width: 76px （可传可不传）
- buttonList:   当type为button时,有buttonList数组, 内有属性icon：按钮图片, desc: 为该按钮描述，operate标识值（当点击该按钮会通过operate属性判断点击的是哪个钮）;  （可传可不传）属性relation(scope,table)方法，判断按钮显示与隐藏(不传默认显示),table为当前传进去的参数
- enumObj: 当type为enum时使用，类型为Object，key为枚举值，value为枚举类型的名字。

## 通过table传进去的方法

- input:     当input输入框内容改变时触发方法。两个参数（e,scope) e为输入框的值
- disabled   输入框不可填。两个参数（scope，table） table为传进去的table参数
- templateIf template有无？

## 方法

- handleSelectionChange     多选框发生变化时
- switchChange              switch状态变化时
- textClick                 点击文字触发
- selectChange              下拉框变化时触发
- radioChange               单选按钮变化时触发（第一个参数e是选择label的值，第二个参数是scope.row）
- descfun                   操作按钮的tooltip的content属性方法
- stylefun                  操作按钮的style属性方法
- selectable               控制多选框能否勾选

## 父组件可调用方法（在父组件调用该方法即可）

- radioSelection            单选框处理，只能单选
- clearSelection            清空选中状态
- toggleRowSelection        默认选中数据，传入参数选中的数据