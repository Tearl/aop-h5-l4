# 使用规则

## 传入变量
- breadcrumbs           左侧面包屑信息的数组。label： 导航栏文字，operate： 导航栏点击的标识
- labelList             右侧按钮信息的数组。 label： 按钮文字， type： 按钮颜色， isDisable： 按钮是否禁用（布尔值）
- routerTpye            路由type（如果为空点击返回上一个页面，不为空则调用goRoute方法）

## 方法
- itemClick             右侧按钮点击。参数：当前点击的label
- goRoute               如果routerTpye为空返回上一个页面，不为空则调用goRoute方法
- labelClick            左侧面包屑导航栏文字点。参数： 当前点击的operate
