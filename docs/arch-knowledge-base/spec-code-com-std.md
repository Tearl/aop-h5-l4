<details>
<summary>历史生成资料（未复核，不作为现行工程事实）</summary>

# 客户端工程规范

## 平台目录边界

| 平台 | 类型 | 扫描根 | 技术变体 | 证据 |
| --- | --- | --- | --- | --- |
| web | web | `.` | vue | `package.json`<br>`src/modules/aop_tradedesign/package.json`<br>`src/modules/aop_tradecode/package.json` |

## 强制约束

- Web、Android、iOS、HarmonyOS Harness 只能扫描各自的 `scanRoot`。
- Android 目录中的 Java/Kotlin 是客户端证据，不得据此推断后端框架。
- 不得创建扫描证据中不存在的目录、页面、组件、接口或代码模板。

## 前端项目形态检测

| 检测项 | 结论 |
| --- | --- |
| 前端技术栈 | Vue |
| 页面组织形态 | 待确认（证据不足或多页面证据不完整） |
| 模块配置数 | 0 |
| 有效多页面入口数 | 0 |
| 单页根入口 | - |

### 判定规则

- 多页面：模块存在 `src/modules/*/conf.json`，且页面同时存在 `{pageName}/index/index.vue` 与 `main.js`。
- jQuery + Bootstrap：`package.json` 同时声明 jQuery/Bootstrap，或 HTML/JSP 模板同时存在两者的可定位引用。
- jQuery + Bootstrap 页面形态：实际 HTML/JSP 入口超过一个判为多页面，仅一个判为单页面。
- 单页面：未命中多页面证据，且存在 `src/main.js|ts|jsx|tsx` 根入口。
- 待确认：存在不完整多页面证据或未发现可定位的前端入口；不得自行套用单页或多页骨架。

## 多页面入口清单

| 技术形态 | 模块 | 页面名 | 配置文件 | 视图/模板 | 脚本入口 | 证据状态 |
| --- | --- | --- | --- | --- | --- | --- |
| not_applicable | not_applicable | not_applicable | - | - | - | 未识别到完整多页面入口 |

### 多页面异常与缺口

| 模块 | 页面名 | index.vue | main.js | 原因 |
| --- | --- | --- | --- | --- |
| - | - | - | - | 无 |

## 平台命名与测试

| 平台 | 命名和测试依据 |
| --- | --- |
| Web/H5 | 服从真实 package、lint、路由和现有测试配置 |
| Android | 服从 Manifest、Gradle、源码包和现有测试目录 |
| iOS | 服从 Xcode target、模块、资源和现有测试 target |
| HarmonyOS | 服从 module、bundleName、hvigor 与现有测试配置 |

---

*此报告由 skill_init-frontend-project-scan 自动生成*

</details>

<!-- frontend-engineering:begin -->
# 工程接入与验证命令

命令仅表示配置声明，执行结果另行记录。

| 命令 | 工作目录（webSourceRoot） | 脚本 | 声明状态 | 执行状态 |
| --- | --- | --- | --- | --- |
| build:develop | . | ynet-spa-build --cmd=release --env=develop --bundle | verified | not-run |
| build:develop2 | . | ynet-spa-build --cmd=release --env=develop2 --bundle | verified | not-run |
| build:prod | . | ynet-spa-build --cmd=release --env=prod --bundle | verified | not-run |
| build:prod2 | . | ynet-spa-build --cmd=release --env=prod2 --bundle | verified | not-run |
| build:sit | . | ynet-spa-build --cmd=release --env=sit --bundle | verified | not-run |
| build:sit2 | . | ynet-spa-build --cmd=release --env=sit2 --bundle | verified | not-run |
| build:uat | . | ynet-spa-build --cmd=release --env=uat --bundle | verified | not-run |
| build:uat2 | . | ynet-spa-build --cmd=release --env=uat2 --bundle | verified | not-run |
| clean | . | rimraf dist | verified | not-run |
| dev | . | ynet-spa-build --cmd=dev --env=dev --bundle | verified | not-run |
| test | src/modules/aop_assetcenter | echo "Error: no test specified" && exit 1 | unresolved | not-run |
| test | src/modules/aop_tradecode | echo "Error: no test specified" && exit 1 | unresolved | not-run |
| test | src/modules/aop_tradedesign | echo "Error: no test specified" && exit 1 | unresolved | not-run |
<!-- frontend-engineering:end -->
