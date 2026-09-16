# AGENTS.md — aop-h5-l4 前端项目

## 项目识别

```yaml
business_type: internal-management
channel_type: internal-web
product_type: internal-management
frontend_stack: vue
classification_evidence:
  - "路由定义（src/modules/aop_assetcenter/core/router/map/architectureManagement.js）涵盖架构管理类视图：系统全景、架构全景、产品模型、流程模型、能力模型、实体模型、数据管理、应用架构、技术架构、部署架构——全部为内部架构管理功能，无面向客户的银行业务页面。"
  - "模块命名与依赖：aop_assetcenter（资产中心）、aop_tradecode（交易编码）、aop_tradedesign（交易设计）三个模块均面向内部架构与开发设计场景；依赖 @antv/g6（图可视化）、@logicflow（流程图）、plantuml-encoder（图表编码），均为内部设计工具。路由中包含 s4Design/s5Design/d4workbench 等工作台编辑器，为服务/交易内部设计工具，未涉及账户、支付、转账或金融产品功能。"
```

## 角色

你是本工程的前端维护开发工程师，负责以下 Vue 模块的维护与开发：

- `src/modules/aop_assetcenter` — 架构资产中心（架构全景、业务建模、数据管理）
- `src/modules/aop_tradecode` — 交易编码（决策流程编排、资产列表）
- `src/modules/aop_tradedesign` — 交易设计（D4 工作台、字典管理、数据字典、管控工作台）

## 快速导航

| 文档 | 路径 | 用途 |
| --- | --- | --- |
| 架构总览 | `docs/arch-knowledge-base/doc-arch-com-overview.md` | 架构与技术选型、目录结构、工程规范 |
| UI 组件契约 | `docs/arch-knowledge-base/doc-ui-vue-components.md` | 组件 Props/Events/Slots/Methods 契约 |
| 代码样例 | `docs/arch-knowledge-base/doc-code-com-samples.md` | 开发指南、模板、代码片段与参考实现 |
| 业务规则 | `docs/arch-knowledge-base/doc-req-com-rules.md` | 业务规则、需求、角色权限、流程约束 |
| 代码白名单 | `docs/arch-knowledge-base/doc-code-com-whitelist.md` | 客户端代码能力白名单 |
| 工程规范 | `docs/arch-knowledge-base/spec-code-com-std.md` | 工程接入与验证命令 |
| 工程事实 | `docs/arch-knowledge-base/frontend-engineering-facts.json` | 工程事实数据 |
| 工程清单 | `docs/arch-knowledge-base/frontend-engineering-manifest.json` | 发布清单与摘要 |
| 平台配置 | `docs/arch-knowledge-base/platforms.yaml` | 平台识别与扫描配置 |
| 资产指纹 | `docs/arch-knowledge-base/frontend-asset-fingerprint.md` | 前端资产指纹 |
| 资产索引 | `docs/arch-knowledge-base/frontend-asset-index.md` | 前端资产索引 |

## 状态文件

- `harness-state.json` — FM 前端 Harness 状态（schema: `fm-frontend-harness-state/2.0`）；由 `skill_init-vue-harness` 管理，不得手动修改。
- `AGENTS.md` — 本文件；由 `skill_init-vue-harness` 生成，后续可通过 Design/Implement 阶段补充。

## 开发约束

- 开发前必须阅读 `docs/arch-knowledge-base/doc-arch-com-overview.md` 了解架构与规范。
- 开发前必须阅读 `docs/arch-knowledge-base/doc-ui-vue-components.md` 了解已有组件契约。
- 开发后必须执行已有 lint/test 命令（见 `spec-code-com-std.md`）。
- 禁止创建扫描证据中不存在的目录、页面、组件或接口。

## 技术摘要

| 项目 | 值 |
| --- | --- |
| 框架 | Vue（SFC + Vue Router + Vuex） |
| 构建工具 | ynet-spa-build（@ynet/h5-pc-terminal-cli ^0.0.33） |
| 模块化 | Yarn Workspaces（`src/modules/*`） |
| 多模块入口 | `src/modules/aop_assetcenter/main.js`、`src/modules/aop_tradecode/main.js`、`src/modules/aop_tradedesign/main.js` |
| 主要依赖 | @antv/g6 ^4.8.22、@logicflow/core 2.0.10、@logicflow/extension 2.0.14、plantuml-encoder ^1.4.0 |

### 模块路由

| 模块 | 路由前缀 | 主要页面 |
| --- | --- | --- |
| aop_assetcenter | `/{MODULE_NAME}` | 系统全景、架构全景、产品模型、流程模型、能力模型、实体模型、数据管理、应用架构、技术架构、部署架构 |
| aop_tradecode | `/{MODULE_NAME}` | 资产列表、编辑器、S4 工作台设计、S5 工作台设计 |
| aop_tradedesign | `/{MODULE_NAME}` | D4 工作台、字典管理、数据字典、管控工作台 |

## 原生 Harness 资料

无（当前工作区未检测到 Android/HarmonyOS/iOS 原生工程）。