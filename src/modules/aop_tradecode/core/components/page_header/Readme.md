# 使用规则
- 若含有path,优先使用url的rId和rName(覆盖原有label,并根据path跳转)
- 若含有operate,使用operate方法

## 传入变量

- breadcrumbs:      左侧面包屑信息的数组
- labelList:        按钮列表
- routerTpye:       是否使用默认后退

## 枚举

- label:            默认面包屑名称
- operate:          面包屑触发方法
- path:             面包屑跳转路径
- rId:              面包屑ID(如果有path,url上有rId)
- rName:            面包屑名称(如果有path,url上有rName)

## 方法

- labelClick        按钮点击
- pathClick         面包屑点击(如果有path)
- handleItemClick   面包屑点击
