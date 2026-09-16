# SOW管理 - 业务验收测试方案

## 1. 基线信息

| 属性 | 值 |
|---|---|
| 需求 Run ID | run-20260916-3d8e72b4 |
| 需求基线编号 | BASELINE-SOW-MGT-001 |
| 需求标识 | sow-management |
| 需求版本 | 1.0.0 |
| 需求模型哈希 | `sha256:9551ba6959086b35d7bee39ae46d42d81c3e8071bc824984fe8f99ca018ab6c0` |

> 本文档定义业务验收口径和逻辑测试数据，不包含 URL、DTO、数据库脚本、真实生产数据或可执行测试代码。技术测试由后续详细设计和开发阶段基于本基线派生。

## 2. 覆盖总览

| 用例编号 | 用例名称 | 功能 | 场景 | 类型 | 优先级 | 验收标准 | 数据集 |
|---|---|---|---|---|---|---|---|
| TEST-SCN-SOW-HOME-001 | 查看SOW列表 | SOW管理首页 | 查看SOW列表 | 正常 | P2 | AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004 | 无 |
| TEST-SCN-SOW-HOME-002 | 搜索筛选SOW | SOW管理首页 | 搜索筛选SOW | 正常 | P2 | AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004 | 无 |
| TEST-SCN-SOW-HOME-003 | 搜索无结果 | SOW管理首页 | 搜索无结果 | 备选 | P2 | AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004 | 无 |
| TEST-SCN-SOW-CREATE-001 | 仅创建SOW | 新建SOW | 仅创建SOW | 正常 | P2 | AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006 | DATA-001 |
| TEST-SCN-SOW-CREATE-002 | 创建并继续设计 | 新建SOW | 创建并继续设计 | 正常 | P2 | AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006 | 无 |
| TEST-SCN-SOW-CREATE-003 | 取消创建 | 新建SOW | 取消创建 | 备选 | P2 | AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006 | 无 |
| TEST-SCN-SOW-CREATE-004 | 必填字段未填 | 新建SOW | 必填字段未填 | 业务异常 | P1 | AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006 | 无 |
| TEST-SCN-SOW-EDIT-001 | 修改基本信息 | 编辑SOW | 修改基本信息 | 正常 | P2 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-EDIT-002 | 首次导入SOW清单 | 编辑SOW | 首次导入SOW清单 | 正常 | P2 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-EDIT-003 | 重新导入 | 编辑SOW | 重新导入 | 正常 | P2 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-EDIT-004 | 删除未匹配功能 | 编辑SOW | 删除未匹配功能 | 正常 | P2 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-EDIT-005 | 删除已匹配功能 | 编辑SOW | 删除已匹配功能 | 正常 | P2 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-EDIT-006 | 导入非xlsx文件 | 编辑SOW | 导入非xlsx文件 | 业务异常 | P1 | AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006 | 无 |
| TEST-SCN-SOW-DELETE-001 | 删除无关联SOW | 删除SOW | 删除无关联SOW | 正常 | P2 | AC-REQ-SOW-DELETE-001 | 无 |
| TEST-SCN-SOW-DELETE-002 | 删除已关联SOW被阻断 | 删除SOW | 删除已关联SOW被阻断 | 业务异常 | P1 | AC-REQ-SOW-DELETE-001 | DATA-002 |
| TEST-SCN-SOW-SUBMIT-001 | 提交完成 | 提交完成 | 提交完成 | 正常 | P2 | AC-REQ-SOW-SUBMIT-001 | 无 |
| TEST-SCN-SOW-SUBMIT-002 | 提交时清单未完成 | 提交完成 | 提交时清单未完成 | 业务异常 | P1 | AC-REQ-SOW-SUBMIT-001 | 无 |
| TEST-SCN-SOW-VIEW-001 | 查看基本信息 | 查看SOW详情 | 查看基本信息 | 正常 | P2 | AC-REQ-SOW-VIEW-001、AC-REQ-SOW-VIEW-002 | 无 |
| TEST-SCN-SOW-VIEW-002 | 查看关联方案 | 查看SOW详情 | 查看关联方案 | 正常 | P2 | AC-REQ-SOW-VIEW-001、AC-REQ-SOW-VIEW-002 | 无 |

## 3. 业务验收用例

### TEST-SCN-SOW-HOME-001 查看SOW列表

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-HOME SOW管理首页
- **所属场景：** SCN-SOW-HOME-001 查看SOW列表
- **关联需求：** REQ-SOW-HOME-001、REQ-SOW-HOME-002、REQ-SOW-HOME-003、REQ-SOW-HOME-004
- **关联验收标准：** AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 用户成功浏览SOW列表
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户进入SOW管理首页 | 用户进入SOW管理首页 |
| 2 | FM平台用户 | 系统展示全部SOW列表（SOW ID/名称/类型/关联商机/期望完成时间/状态/创建人） | 系统展示全部SOW列表（SOW ID/名称/类型/关联商机/期望完成时间/状态/创建人） |
| 3 | FM平台用户 | 系统展示操作按钮列 | 系统展示操作按钮列 |
| 4 | FM平台用户 | 系统展示分页 | 系统展示分页 |

### TEST-SCN-SOW-HOME-002 搜索筛选SOW

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-HOME SOW管理首页
- **所属场景：** SCN-SOW-HOME-002 搜索筛选SOW
- **关联需求：** REQ-SOW-HOME-001、REQ-SOW-HOME-002、REQ-SOW-HOME-003、REQ-SOW-HOME-004
- **关联验收标准：** AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 用户获得筛选后的SOW列表
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户输入搜索条件 | 用户输入搜索条件 |
| 2 | FM平台用户 | 用户点击'搜索' | 用户点击'搜索' |
| 3 | FM平台用户 | 系统按条件筛选展示结果 | 系统按条件筛选展示结果 |

### TEST-SCN-SOW-HOME-003 搜索无结果

- **类型：** 备选
- **优先级：** P2
- **所属功能：** FUN-SOW-HOME SOW管理首页
- **所属场景：** SCN-SOW-HOME-003 搜索无结果
- **关联需求：** REQ-SOW-HOME-001、REQ-SOW-HOME-002、REQ-SOW-HOME-003、REQ-SOW-HOME-004
- **关联验收标准：** AC-REQ-SOW-HOME-001、AC-REQ-SOW-HOME-002、AC-REQ-SOW-HOME-003、AC-REQ-SOW-HOME-004
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 用户看到空搜索结果
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户输入搜索条件 | 用户输入搜索条件 |
| 2 | FM平台用户 | 系统查找无匹配 | 系统查找无匹配 |
| 3 | FM平台用户 | 系统展示空状态提示 | 系统展示空状态提示 |

### TEST-SCN-SOW-CREATE-001 仅创建SOW

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-CREATE 新建SOW
- **所属场景：** SCN-SOW-CREATE-001 仅创建SOW
- **关联需求：** REQ-SOW-CREATE-001、REQ-SOW-CREATE-002、REQ-SOW-CREATE-003、REQ-SOW-CREATE-004、REQ-SOW-CREATE-005、REQ-SOW-CREATE-006
- **关联验收标准：** AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** DATA-001
- **预期业务结果：** SOW创建成功
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击'+新增SOW' | 用户点击'+新增SOW' |
| 2 | FM平台用户 | 系统打开新建侧滑面板 | 系统打开新建侧滑面板 |
| 3 | FM平台用户 | 用户填写必填字段 | 用户填写必填字段 |
| 4 | FM平台用户 | 用户点击'仅创建' | 用户点击'仅创建' |
| 5 | FM平台用户 | 系统创建SOW并关闭弹窗 | 系统创建SOW并关闭弹窗 |

### TEST-SCN-SOW-CREATE-002 创建并继续设计

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-CREATE 新建SOW
- **所属场景：** SCN-SOW-CREATE-002 创建并继续设计
- **关联需求：** REQ-SOW-CREATE-001、REQ-SOW-CREATE-002、REQ-SOW-CREATE-003、REQ-SOW-CREATE-004、REQ-SOW-CREATE-005、REQ-SOW-CREATE-006
- **关联验收标准：** AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** SOW创建成功，进入编辑页
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户填写信息 | 用户填写信息 |
| 2 | FM平台用户 | 用户点击'创建并继续设计' | 用户点击'创建并继续设计' |
| 3 | FM平台用户 | 系统创建SOW并跳转编辑页 | 系统创建SOW并跳转编辑页 |

### TEST-SCN-SOW-CREATE-003 取消创建

- **类型：** 备选
- **优先级：** P2
- **所属功能：** FUN-SOW-CREATE 新建SOW
- **所属场景：** SCN-SOW-CREATE-003 取消创建
- **关联需求：** REQ-SOW-CREATE-001、REQ-SOW-CREATE-002、REQ-SOW-CREATE-003、REQ-SOW-CREATE-004、REQ-SOW-CREATE-005、REQ-SOW-CREATE-006
- **关联验收标准：** AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 弹窗关闭
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击'取消' | 用户点击'取消' |
| 2 | FM平台用户 | 系统关闭弹窗不保存 | 系统关闭弹窗不保存 |

### TEST-SCN-SOW-CREATE-004 必填字段未填

- **类型：** 业务异常
- **优先级：** P1
- **所属功能：** FUN-SOW-CREATE 新建SOW
- **所属场景：** SCN-SOW-CREATE-004 必填字段未填
- **关联需求：** REQ-SOW-CREATE-001、REQ-SOW-CREATE-002、REQ-SOW-CREATE-003、REQ-SOW-CREATE-004、REQ-SOW-CREATE-005、REQ-SOW-CREATE-006
- **关联验收标准：** AC-REQ-SOW-CREATE-001、AC-REQ-SOW-CREATE-002、AC-REQ-SOW-CREATE-003、AC-REQ-SOW-CREATE-004、AC-REQ-SOW-CREATE-005、AC-REQ-SOW-CREATE-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 创建被阻止
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户未填全必填字段 | 用户未填全必填字段 |
| 2 | FM平台用户 | 用户点击创建 | 用户点击创建 |
| 3 | FM平台用户 | 系统提示校验错误 | 系统提示校验错误 |

### TEST-SCN-SOW-EDIT-001 修改基本信息

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-001 修改基本信息
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 信息更新成功
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户进入编辑页 | 用户进入编辑页 |
| 2 | FM平台用户 | 用户修改字段 | 用户修改字段 |
| 3 | FM平台用户 | 用户点击保存 | 用户点击保存 |
| 4 | FM平台用户 | 系统保存更新 | 系统保存更新 |

### TEST-SCN-SOW-EDIT-002 首次导入SOW清单

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-002 首次导入SOW清单
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** SOW清单导入成功
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户切换到SOW清单Tab | 用户切换到SOW清单Tab |
| 2 | FM平台用户 | 用户点击批量导入 | 用户点击批量导入 |
| 3 | FM平台用户 | 用户下载模板并上传xlsx | 用户下载模板并上传xlsx |
| 4 | FM平台用户 | 用户点击开始导入 | 用户点击开始导入 |
| 5 | FM平台用户 | 系统解析展示清单 | 系统解析展示清单 |

### TEST-SCN-SOW-EDIT-003 重新导入

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-003 重新导入
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录、SOW清单已有数据
- **逻辑测试数据：** 无
- **预期业务结果：** SOW清单更新成功
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户上传新xlsx | 用户上传新xlsx |
| 2 | FM平台用户 | 系统对比展示新增/删除差异 | 系统对比展示新增/删除差异 |
| 3 | FM平台用户 | 用户确认后导入 | 用户确认后导入 |
| 4 | FM平台用户 | 系统更新清单 | 系统更新清单 |

### TEST-SCN-SOW-EDIT-004 删除未匹配功能

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-004 删除未匹配功能
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录、功能未被方案匹配
- **逻辑测试数据：** 无
- **预期业务结果：** 功能被删除
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击删除 | 用户点击删除 |
| 2 | FM平台用户 | 系统确认未匹配 | 系统确认未匹配 |
| 3 | FM平台用户 | 用户确认后删除 | 用户确认后删除 |

### TEST-SCN-SOW-EDIT-005 删除已匹配功能

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-005 删除已匹配功能
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录、功能已被方案匹配
- **逻辑测试数据：** 无
- **预期业务结果：** 功能及匹配关系被删除
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击删除 | 用户点击删除 |
| 2 | FM平台用户 | 系统提示关联方案名称 | 系统提示关联方案名称 |
| 3 | FM平台用户 | 用户确认后系统和方案匹配关系一并删除 | 用户确认后系统和方案匹配关系一并删除 |

### TEST-SCN-SOW-EDIT-006 导入非xlsx文件

- **类型：** 业务异常
- **优先级：** P1
- **所属功能：** FUN-SOW-EDIT 编辑SOW
- **所属场景：** SCN-SOW-EDIT-006 导入非xlsx文件
- **关联需求：** REQ-SOW-EDIT-001、REQ-SOW-EDIT-002、REQ-SOW-EDIT-003、REQ-SOW-EDIT-004、REQ-SOW-EDIT-005、REQ-SOW-EDIT-006
- **关联验收标准：** AC-REQ-SOW-EDIT-001、AC-REQ-SOW-EDIT-002、AC-REQ-SOW-EDIT-003、AC-REQ-SOW-EDIT-004、AC-REQ-SOW-EDIT-005、AC-REQ-SOW-EDIT-006
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 用户看到错误提示
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户上传非xlsx文件 | 用户上传非xlsx文件 |
| 2 | FM平台用户 | 系统提示格式错误 | 系统提示格式错误 |

### TEST-SCN-SOW-DELETE-001 删除无关联SOW

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-DELETE 删除SOW
- **所属场景：** SCN-SOW-DELETE-001 删除无关联SOW
- **关联需求：** REQ-SOW-DELETE-001
- **关联验收标准：** AC-REQ-SOW-DELETE-001
- **前置条件：** 用户已登录、SOW未关联方案
- **逻辑测试数据：** 无
- **预期业务结果：** SOW被删除
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击删除 | 用户点击删除 |
| 2 | FM平台用户 | 系统弹出确认弹窗 | 系统弹出确认弹窗 |
| 3 | FM平台用户 | 用户确认 | 用户确认 |
| 4 | FM平台用户 | 系统删除SOW | 系统删除SOW |

### TEST-SCN-SOW-DELETE-002 删除已关联SOW被阻断

- **类型：** 业务异常
- **优先级：** P1
- **所属功能：** FUN-SOW-DELETE 删除SOW
- **所属场景：** SCN-SOW-DELETE-002 删除已关联SOW被阻断
- **关联需求：** REQ-SOW-DELETE-001
- **关联验收标准：** AC-REQ-SOW-DELETE-001
- **前置条件：** 用户已登录、SOW已关联方案
- **逻辑测试数据：** DATA-002
- **预期业务结果：** 删除被阻断
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击删除 | 用户点击删除 |
| 2 | FM平台用户 | 系统检测到关联方案 | 系统检测到关联方案 |
| 3 | FM平台用户 | 系统提示方案名称并阻断 | 系统提示方案名称并阻断 |

### TEST-SCN-SOW-SUBMIT-001 提交完成

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-SUBMIT 提交完成
- **所属场景：** SCN-SOW-SUBMIT-001 提交完成
- **关联需求：** REQ-SOW-SUBMIT-001
- **关联验收标准：** AC-REQ-SOW-SUBMIT-001
- **前置条件：** 用户已登录、SOW清单已导入且合用评价完成
- **逻辑测试数据：** 无
- **预期业务结果：** SOW状态变更为已完成
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击提交完成 | 用户点击提交完成 |
| 2 | FM平台用户 | 系统校验通过 | 系统校验通过 |
| 3 | FM平台用户 | 用户确认 | 用户确认 |
| 4 | FM平台用户 | 系统更新状态为已完成 | 系统更新状态为已完成 |

### TEST-SCN-SOW-SUBMIT-002 提交时清单未完成

- **类型：** 业务异常
- **优先级：** P1
- **所属功能：** FUN-SOW-SUBMIT 提交完成
- **所属场景：** SCN-SOW-SUBMIT-002 提交时清单未完成
- **关联需求：** REQ-SOW-SUBMIT-001
- **关联验收标准：** AC-REQ-SOW-SUBMIT-001
- **前置条件：** 用户已登录、SOW清单未完成
- **逻辑测试数据：** 无
- **预期业务结果：** 提交被阻止
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击提交完成 | 用户点击提交完成 |
| 2 | FM平台用户 | 系统校验发现未完成 | 系统校验发现未完成 |
| 3 | FM平台用户 | 系统提示错误信息 | 系统提示错误信息 |

### TEST-SCN-SOW-VIEW-001 查看基本信息

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-VIEW 查看SOW详情
- **所属场景：** SCN-SOW-VIEW-001 查看基本信息
- **关联需求：** REQ-SOW-VIEW-001、REQ-SOW-VIEW-002
- **关联验收标准：** AC-REQ-SOW-VIEW-001、AC-REQ-SOW-VIEW-002
- **前置条件：** 用户已登录
- **逻辑测试数据：** 无
- **预期业务结果：** 用户查看基本信息
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户点击查看 | 用户点击查看 |
| 2 | FM平台用户 | 系统进入详情页 | 系统进入详情页 |
| 3 | FM平台用户 | 系统展示基本信息 | 系统展示基本信息 |

### TEST-SCN-SOW-VIEW-002 查看关联方案

- **类型：** 正常
- **优先级：** P2
- **所属功能：** FUN-SOW-VIEW 查看SOW详情
- **所属场景：** SCN-SOW-VIEW-002 查看关联方案
- **关联需求：** REQ-SOW-VIEW-001、REQ-SOW-VIEW-002
- **关联验收标准：** AC-REQ-SOW-VIEW-001、AC-REQ-SOW-VIEW-002
- **前置条件：** 用户已登录、SOW有关联方案
- **逻辑测试数据：** 无
- **预期业务结果：** 用户查看方案详情
- **自动化判断：** 建议人工执行
- **判断依据：** 需求阶段仅判断自动化可行性

| 步骤 | 执行角色 | 操作 | 预期观察 |
|---|---|---|---|
| 1 | FM平台用户 | 用户切换到关联方案Tab | 用户切换到关联方案Tab |
| 2 | FM平台用户 | 系统展示关联方案 | 系统展示关联方案 |
| 3 | FM平台用户 | 用户点击方案名称 | 用户点击方案名称 |
| 4 | FM平台用户 | 系统新开页面跳转详情 | 系统新开页面跳转详情 |

## 4. 逻辑测试数据

### DATA-001 正常创建SOW

- **用途：** 验证SOW创建流程
- **类别：** 正常
- **关联场景：** SCN-SOW-CREATE-001
- **关联需求：** REQ-SOW-CREATE-001
- **前置条件：** 用户已登录
- **预期业务结果：** SOW创建成功，状态已注册
- **数据策略：** synthetic_only
- **生成规则：** 基于字段约束生成合成测试数据

| 业务语义 | 取值类别 | 示例 | 约束 |
|---|---|---|---|
| SOW名称 | 文本 | 企业网银渠道POC | ≤30字 |
| SOW类型 | 枚举 | POC | POC/交付/FM1/其他 |

### DATA-002 删除已关联SOW

- **用途：** 验证关联方案阻断删除
- **类别：** 异常
- **关联场景：** SCN-SOW-DELETE-002
- **关联需求：** REQ-SOW-DELETE-001
- **前置条件：** SOW已关联方案
- **预期业务结果：** 删除被阻断，提示方案名称
- **数据策略：** synthetic_only
- **生成规则：** 建立SOW与方案关联后触发删除

| 业务语义 | 取值类别 | 示例 | 约束 |
|---|---|---|---|
| 方案关联 | 布尔 | true | 已关联至少一个方案 |

## 5. 后续派生约束

- 详细设计阶段必须把逻辑测试数据映射为接口字段、枚举和错误码，并保留原用例编号。
- 开发阶段生成单元测试和接口测试时必须记录来源测试用例及需求基线哈希。
- 部署后的验收报告必须按用例编号回填执行结果，不得修改本需求基线中的预期业务结果。
