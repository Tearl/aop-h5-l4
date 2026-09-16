<details>
<summary>历史生成资料（未复核，不作为现行工程事实）</summary>

# 客户端业务规则

## 适用范围

| 平台 | 类型 | 扫描根 | 技术变体 | 证据 |
| --- | --- | --- | --- | --- |
| web | web | `.` | vue | `package.json`<br>`src/modules/aop_tradedesign/package.json`<br>`src/modules/aop_tradecode/package.json` |

## 角色与权限

| 规则 | 结论 | 证据 |
| --- | --- | --- |
| 角色体系 | 待人工确认 | 当前扫描未形成可验证的统一客户端角色证据 |
| 页面权限 | 待人工确认 | 应由各平台路由、菜单或原生权限配置继续提取 |
| 数据权限 | 待人工确认 | 严禁从名称或目录推测 |

## 跨端约束

- Web 与原生端共享的接口、Bridge 和路由规则必须保留来源路径。
- 未发现明确配置或源码证据的业务规则保持待确认，不生成默认规则。

---

*此报告由 skill_init-frontend-project-scan 自动生成*

</details>

<!-- frontend-engineering:begin -->
# 工程权限与状态机制

仅记录源码观察；本次业务角色、范围、REQ/BR/AC/DEC 留在 Run 需求基线。

权限机制：candidate；状态机制：not-found。

| 类别 | 源码（webSourceRoot） | 符号 | 位置 | 状态 |
| --- | --- | --- | --- | --- |
| storage-read | src/modules/aop_assetcenter/views/applicationPanorama/diagramStorage.js | localStorage.getItem | 30 | verified |
| storage-read | src/modules/aop_assetcenter/views/applicationPanorama/diagramStorage.js | localStorage.getItem | 35 | verified |
| storage-read | src/modules/aop_assetcenter/views/applicationPanorama/diagramStorage.js | localStorage.getItem | 36 | verified |
| storage-read | src/modules/aop_assetcenter/views/applicationPanorama/modelDiagramStorage.js | localStorage.getItem | 15 | verified |
| storage-read | src/modules/aop_tradedesign/views/d4workbench/workbench/components/workbench_design/confirmTwo_define/components/base_info/components/selcFromDataSet.vue | sessionStorage.getItem | 169 | verified |
| storage-read | src/modules/aop_tradedesign/views/d4workbench/workbench/components/workbench_design/confirmTwo_define/components/service_list/basic.vue | sessionStorage.getItem | 533 | verified |
| storage-read | src/modules/aop_tradedesign/views/d4workbench/workbench/components/workbench_design/confirmTwo_define/components/service_list/basic.vue | sessionStorage.getItem | 534 | verified |
| storage-read | src/modules/aop_tradedesign/views/dicmgmt/components/dic_view/index.vue | localStorage.getItem | 137 | verified |
| storage-read | src/modules/aop_tradedesign/views/dicmgmt/components/sideBar.vue | sessionStorage.getItem | 206 | verified |

公共机制分析：284 / 1651 个索引文件；1367 个文件留待 Design 按需求定向分析。not-found 仅适用于当前范围。
<!-- frontend-engineering:end -->
