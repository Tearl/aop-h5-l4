<template>
    <div class="detail-design">
        <aside class="detail-design__sidebar">
            <div class="detail-design__sidebar-title">文档目录</div>
            <template v-for="chapter in sections">
                <button
                    :key="chapter.id"
                    :class="['detail-design__toc-item', { active: currentSection === chapter.id }]"
                    type="button"
                    @click="scrollToSection(chapter.id)"
                >
                    {{ chapter.title }}
                </button>
                <button
                    v-for="child in chapter.children || []"
                    :key="child.id"
                    :class="['detail-design__toc-item', 'level-2', { active: currentSection === child.id }]"
                    type="button"
                    @click="scrollToSection(child.id)"
                >
                    {{ child.title }}
                </button>
            </template>
        </aside>

        <main ref="preview" class="detail-design__content" @scroll="syncCurrentSection">
            <div class="detail-design__document-title">FM 平台总体设计文档</div>
            <div class="detail-design__meta">
                <span><strong>版本：</strong>V1.10</span>
                <span><strong>日期：</strong>2026-04-21</span>
                <span>基于 FM 平台资产复用和标准化理念，结合 Agent 实战经验构建</span>
            </div>

            <template v-for="chapter in sections">
                <article :id="chapter.id" :key="chapter.id" class="detail-design__section doc-section">
                    <h2>{{ chapter.title }}</h2>
                    <p>{{ chapter.description }}</p>
                    <ul v-if="chapter.points && chapter.points.length">
                        <li v-for="point in chapter.points" :key="point">{{ point }}</li>
                    </ul>
                </article>

                <article
                    v-for="child in chapter.children || []"
                    :id="child.id"
                    :key="child.id"
                    class="detail-design__section doc-section doc-section--child"
                >
                    <h3>{{ child.title }}</h3>
                    <blockquote v-if="child.highlight">{{ child.highlight }}</blockquote>
                    <p>{{ child.description }}</p>
                    <ul v-if="child.points && child.points.length">
                        <li v-for="point in child.points" :key="point">{{ point }}</li>
                    </ul>
                    <pre v-if="child.diagram"><code>{{ child.diagram }}</code></pre>
                    <table v-if="child.rows && child.rows.length">
                        <thead>
                            <tr>
                                <th v-for="column in child.columns" :key="column.key">{{ column.label }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rowIndex) in child.rows" :key="rowIndex">
                                <td v-for="column in child.columns" :key="column.key">{{ row[column.key] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </template>
        </main>
    </div>
</template>

<script>
const architectureColumns = [
    { key: 'layer', label: '层级' },
    { key: 'question', label: '必须回答' },
    { key: 'output', label: '主要产出' }
]

const sections = [
    {
        id: 'ch1',
        title: '第一章 文档信息',
        description: '本文档是 FM 平台后端设计的统一标准蓝本，用于统一设计语言、降低沟通成本并保障跨团队设计一致性。',
        points: ['适用对象：后端开发工程师、架构师、技术负责人', '使用场景：新服务设计、设计评审、问题排查'],
        children: [
            {
                id: 'sec-1-1',
                title: '1.1 两层文档体系',
                highlight: '总体设计定义规则，接口设计完成规则的实例化。',
                description: 'FM 平台采用“总体设计_架构设计”与“总体设计_接口设计规范”两层体系。',
                diagram: '总体设计_架构设计\n  ├─ 业务架构\n  ├─ 应用架构\n  ├─ 技术架构\n  └─ 部署架构\n          ↓ 服务边界确定\n总体设计_接口设计规范\n  ├─ 报文格式\n  └─ 出参入参数据标准'
            },
            { id: 'sec-1-2', title: '1.2 本文档定位', description: '本文档属于架构决策层，回答“做什么、怎么分、用什么、怎么部署”，不展开字段级接口定义与数据库表结构。' },
            { id: 'sec-1-3', title: '1.3 与接口设计规范文档的关系', description: '总体设计输出服务边界、服务职责和调用关系；接口设计规范必须在服务边界确定后输出，并遵循总体设计约束。' },
            { id: 'sec-1-4', title: '1.4 章节总览', description: '全文由架构设计、非功能性设计、接口设计规范、报文格式、数据标准和附录组成。' },
            {
                id: 'sec-1-5',
                title: '1.5 架构设计各层边界',
                description: '每一层只回答本层问题，避免职责越界。',
                columns: architectureColumns,
                rows: [
                    { layer: '业务架构', question: '做什么、有哪些域、域之间什么关系', output: '业务能力与业务域' },
                    { layer: '应用架构', question: '有哪些服务、各自负责什么、怎么调用', output: '工程与服务关系' },
                    { layer: '技术架构', question: '用什么中间件、什么版本、协议是什么', output: '技术组件清单' },
                    { layer: '部署架构', question: '部署在哪些节点、多少副本、什么配置', output: '部署拓扑与配置' }
                ]
            },
            {
                id: 'sec-1-6',
                title: '1.6 约束原则全景图',
                highlight: '上层约束优先：业务层约束 > 应用层约束 > 技术层约束 > 部署层约束。',
                description: '约束从业务域边界向服务边界、技术选型、部署节点和接口契约逐层传递。',
                diagram: '业务层约束（2.4）\n  ↓ 约束服务边界与调用关系\n应用架构约束（3.x）\n  ↓ 约束技术组件选型\n技术架构约束（4.x）\n  ↓ 约束部署节点分配\n部署边界约束（5.4）\n  ↓ 约束服务间契约\n接口边界约束（8.4）'
            }
        ]
    },
    {
        id: 'ch2',
        title: '第二章 业务架构设计',
        description: '回答业务是什么、业务如何划分、业务如何运转，并将业务边界传递到应用架构。',
        children: [
            { id: 'sec-2-1', title: '2.1 业务能力全景图', description: 'FM 平台覆盖工程管理、业务设计、技术设计、公共支撑、测试、部署和用户七个业务域。', points: ['技术设计域贯穿 L1-L5 与 END 端交付', '公共支撑域提供文件、审批、授权和运营能力'] },
            { id: 'sec-2-2', title: '2.2 业务域划分及关系', description: '工程管理与业务设计进入技术设计，技术设计产出触发部署；公共支撑域和用户域为所有业务域提供基础能力。' },
            { id: 'sec-2-3', title: '2.3 核心业务流程概览', description: '核心方案设计链路由工序配置、SOW 导入、方案生成、L1-L5 设计、END 端开发、部署编排和部署记录组成。' },
            { id: 'sec-2-4', title: '2.4 域间依赖关系约束原则', description: '业务流向保持单向，跨域调用使用正式 Feign 接口，通用能力统一由 aop-service-common 提供，认证由 aop-web 统一完成。' }
        ]
    },
    {
        id: 'ch3',
        title: '第三章 应用架构设计',
        description: '明确前置层、后台服务域和公共库的职责，建立业务能力到工程的可追踪映射。',
        children: [
            { id: 'sec-3-1', title: '3.1 应用架构图', description: 'aop-web 负责前端聚合、路由编排与认证鉴权；后台由 design、common、test、devops、user 等服务承载；aop-public-module 提供公共库能力。' },
            { id: 'sec-3-2', title: '3.2 工程职责划分', description: '各后台工程按设计域、公共域、测试域、部署域和用户域分工，并由相应团队负责独立演进。' },
            { id: 'sec-3-3', title: '3.3 功能→工程映射', description: '工程管理、业务模型、架构设计、UI 设计和开发工作台主要由 aop-service-design 承载；测试、部署、运营和系统管理分别路由到对应服务。' },
            { id: 'sec-3-4', title: '3.4 服务调用关系', description: '前置层通过 HTTP/Feign 路由到各业务服务；后台服务之间通过正式 Feign 契约同步协作。' },
            { id: 'sec-3-5', title: '3.5 工程结构说明', description: '聚合工程按设计阶段或业务域拆分模块，单体 DDD 工程按业务能力内聚，公共库不独立部署。' }
        ]
    },
    {
        id: 'ch4',
        title: '第四章 技术架构设计',
        description: '说明接入、网关、前置、微服务与基础设施五层技术架构及端到端调用链路。',
        children: [
            { id: 'sec-4-1', title: '4.1 技术架构图', description: 'Web 前端经 Nginx 进入 aop-web，再按业务请求路由至微服务；MySQL、Redis、RocketMQ、Nacos、Apollo、MinIO 和 Elasticsearch 提供基础设施能力。' },
            { id: 'sec-4-2', title: '4.2 调用链路', description: '标准链路为 Web 前端 → Nginx → aop-web → 对应后台服务，并在网关和前置层完成 SSL、路由与认证。' },
            { id: 'sec-4-3', title: '4.3 技术组件清单', description: '组件版本以 Nginx 1.20+、Nacos 2.x、Apollo 2.0.x、Redis 6.x、RocketMQ 4.x、MySQL 5.7/8.0、Elasticsearch 7.x 为基线。' },
            { id: 'sec-4-4', title: '4.4 软件清单', description: '运行环境使用 OpenJDK 1.8/11、内嵌 Tomcat/Undertow、Docker 20.x 与 Kubernetes 1.24+。' }
        ]
    },
    {
        id: 'ch5',
        title: '第五章 部署架构设计',
        description: '定义负载均衡、应用集群和独立基础设施节点的部署拓扑、资源规格与环境隔离要求。',
        children: [
            { id: 'sec-5-1', title: '5.1 部署架构图', description: 'Nginx/Ingress 作为入口；aop-web 前置集群与两组服务节点部署于 K8s；Nacos、Apollo、RocketMQ、MySQL、Redis、MinIO 独立部署。' },
            { id: 'sec-5-2', title: '5.2 部署配置', description: 'aop-web 默认 3 副本 2C4G；design 默认 3 副本 4C8G；其余核心服务不少于 2 副本。' },
            { id: 'sec-5-3', title: '5.3 环境规划', description: 'DEV、SIT、UAT、PROD 完全隔离；生产环境全量高可用并定期备份。' },
            { id: 'sec-5-4', title: '5.4 部署边界约束原则', description: '不同业务域服务分离部署，核心服务跨节点高可用，中间件与应用服务禁止混部。' }
        ]
    },
    {
        id: 'ch6',
        title: '第六章 非功能性设计',
        description: '规定系统在性能、安全、可靠性、可观测性和层间依赖方向方面必须达到的基线。',
        children: [
            { id: 'sec-6-1', title: '6.1 性能设计', description: '关键接口设置明确的响应时间与吞吐目标，缓存、异步化和水平扩容策略须与业务负载匹配。' },
            { id: 'sec-6-2', title: '6.2 安全设计', description: '统一身份认证、最小权限、传输加密、敏感数据保护与审计留痕贯穿全链路。' },
            { id: 'sec-6-3', title: '6.3 层间边界约束原则', description: '上层依赖下层，禁止下层反向依赖上层；禁止跨层直连，并评估上层变更对下层的传播影响。' }
        ]
    },
    {
        id: 'ch7',
        title: '第七章 接口设计文档定位',
        description: '接口设计规范是总体设计的第二层，用于定义具体接口的输入输出、校验规则、报文结构和错误处理。'
    },
    {
        id: 'ch8',
        title: '第八章 接口设计原则',
        description: '所有接口遵循统一通信协议、安全、错误处理和边界约束。',
        children: [
            { id: 'sec-8-1', title: '8.1 通信协议规范', description: '服务间调用采用标准 HTTP/JSON 或正式 Feign 契约，明确超时、重试和幂等策略。' },
            { id: 'sec-8-2', title: '8.2 安全规范', description: '外部请求使用 JWT 与 Session，服务间使用 AppKey+Secret，并对敏感字段执行加密或脱敏。' },
            { id: 'sec-8-3', title: '8.3 错误处理规范', description: '错误码、错误信息和异常映射统一管理，禁止将内部堆栈直接暴露给调用方。' },
            { id: 'sec-8-4', title: '8.4 接口边界约束原则', description: '接口契约保持稳定和向后兼容，禁止循环依赖；所有服务调用必须设置超时和降级策略。' }
        ]
    },
    {
        id: 'ch9',
        title: '第九章 报文格式规范',
        description: '规范前置报文、后台标准报文及二者之间的转换链路。',
        children: [
            { id: 'sec-9-1', title: '9.1 前置工程应用报文结构', description: '前置报文由 header 与 body 组成，携带交易码、渠道、流水号、用户会话和业务数据。' },
            { id: 'sec-9-2', title: '9.2 后台工程应用报文结构', description: '后台标准报文由 reqHeaderData、commonData、bodyData 及可选渠道/安全信息组成，响应统一返回 resHeaderData 与 bodyOutData。' },
            {
                id: 'sec-9-3',
                title: '9.3 报文转换链路',
                description: 'aop-web 负责前置格式与平台标准格式之间的包装、字段注入、会话填充以及响应解包装。',
                diagram: '前端请求（HTTP/JSON）\n  ↓ 前置报文：header + body\naop-web\n  ↓ 转换并注入流水号/系统标识/会话\n后台服务（平台标准报文）\n  ↓ 业务处理与统一响应\naop-web\n  ↓ 转换为前置响应\n前端响应'
            }
        ]
    },
    {
        id: 'ch10',
        title: '第十章 出参入参数据标准',
        description: '统一字段命名、类型映射、校验规则和基础数据标准，保证跨服务数据一致性。',
        children: [
            { id: 'sec-10-1', title: '10.1 命名规范', description: '接口字段统一使用 camelCase 和英文语义；列表使用复数，时间字段统一使用 createTime、updateTime、startTime、endTime。' },
            { id: 'sec-10-2', title: '10.2 类型规范', description: '金额使用 BigDecimal 并以 String 传输；日期时间使用 ISO 8601 字符串；文件上传使用 form-data。' },
            { id: 'sec-10-3', title: '10.3 校验规则标准', description: 'DTO 使用 JSR303 注解完成非空、长度、格式、范围和跨字段校验，校验失败统一返回标准错误码。' },
            { id: 'sec-10-4', title: '10.4 数据标准', description: '状态值、逻辑删除和乐观锁采用统一字段与枚举；逻辑删除使用 deleted，乐观锁使用 version。' }
        ]
    },
    {
        id: 'appendix',
        title: '附录',
        description: '提供 HTTP 状态码、平台错误码、术语和参考文档的统一定义。',
        children: [
            { id: 'app-a', title: 'A. HTTP状态码定义', description: '统一使用 200、400、401、403、404、409、429、500 等标准状态码表达请求结果。' },
            { id: 'app-b', title: 'B. 错误码定义', description: '错误码按参数、资源、权限、业务冲突和系统异常分类管理。' },
            { id: 'app-c', title: 'C. 术语表', description: '定义前置、Feign、DDD、RBAC、FM、SOW、END 端和 L1-L5 等核心术语。' },
            { id: 'app-d', title: 'D. 参考文档', description: '参考第一层总体设计_架构设计与第二层总体设计_接口设计规范。' }
        ]
    }
]

export default {
    name: 'DetailDesign',
    data() {
        return {
            currentSection: 'ch1',
            sections,
            sectionPositions: []
        }
    },
    mounted() {
        this.$nextTick(this.collectSectionPositions)
    },
    methods: {
        getDocumentHtml() {
            return this.$refs.preview ? this.$refs.preview.innerHTML : ''
        },
        collectSectionPositions() {
            const preview = this.$refs.preview
            if (!preview) return
            this.sectionPositions = Array.from(preview.querySelectorAll('.doc-section')).map(element => ({
                id: element.id,
                top: element.offsetTop
            }))
        },
        scrollToSection(sectionId) {
            const preview = this.$refs.preview
            const element = preview && preview.querySelector(`#${sectionId}`)
            if (!element) return
            this.currentSection = sectionId
            preview.scrollTo({
                top: Math.max(0, element.offsetTop - 18),
                behavior: 'smooth'
            })
        },
        syncCurrentSection() {
            const preview = this.$refs.preview
            if (!preview || !this.sectionPositions.length) return
            const currentTop = preview.scrollTop + 80
            let current = this.sectionPositions[0]
            this.sectionPositions.forEach(section => {
                if (section.top <= currentTop) current = section
            })
            this.currentSection = current.id
        }
    }
}
</script>

<style scoped>
.detail-design {
    display: flex;
    height: calc(100vh - 240px);
    min-height: 560px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.detail-design__sidebar {
    width: 260px;
    flex-shrink: 0;
    padding: 18px 0;
    border-right: 1px solid #e8ecf1;
    overflow-y: auto;
}

.detail-design__sidebar-title {
    margin: 0 20px 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e8ecf1;
    color: #262626;
    font-size: 14px;
    font-weight: 600;
}

.detail-design__toc-item {
    display: block;
    width: 100%;
    padding: 8px 20px;
    border: 0;
    border-left: 3px solid transparent;
    background: transparent;
    color: #8c8c8c;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    text-align: left;
    transition: all 0.2s;
}

.detail-design__toc-item.level-2 {
    padding-left: 36px;
    font-size: 12px;
}

.detail-design__toc-item:hover,
.detail-design__toc-item.active {
    border-left-color: #2b5fd7;
    background: rgba(43, 95, 215, 0.06);
    color: #2b5fd7;
}

.detail-design__toc-item.active {
    font-weight: 500;
}

.detail-design__content {
    position: relative;
    flex: 1;
    min-width: 0;
    padding: 24px 32px 40px;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.detail-design__document-title {
    padding-bottom: 12px;
    border-bottom: 2px solid #e8ecf1;
    color: #262626;
    font-size: 22px;
    font-weight: 600;
}

.detail-design__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    padding: 12px 16px;
    margin: 16px 0 24px;
    border-left: 3px solid #2b5fd7;
    background: rgba(43, 95, 215, 0.05);
    color: #595959;
    font-size: 13px;
}

.detail-design__section {
    scroll-margin-top: 20px;
}

.detail-design__section h2 {
    margin: 28px 0 12px;
    color: #262626;
    font-size: 18px;
    font-weight: 600;
}

.detail-design__section h3 {
    margin: 22px 0 10px;
    color: #262626;
    font-size: 15px;
    font-weight: 600;
}

.detail-design__section p,
.detail-design__section ul {
    margin: 0 0 12px;
    color: #262626;
    font-size: 13px;
    line-height: 1.8;
}

.detail-design__section ul {
    padding-left: 20px;
}

.detail-design__section li {
    margin-bottom: 4px;
}

.detail-design__section blockquote {
    padding: 8px 16px;
    margin: 0 0 12px;
    border-left: 3px solid #2b5fd7;
    background: rgba(43, 95, 215, 0.05);
    color: #595959;
    font-size: 13px;
    line-height: 1.7;
}

.detail-design__section pre {
    padding: 16px;
    margin: 0 0 16px;
    border-radius: 6px;
    background: #1e2430;
    color: #d9e2f2;
    font-size: 12px;
    line-height: 1.6;
    overflow-x: auto;
}

.detail-design__section table {
    width: 100%;
    margin-bottom: 16px;
    border-collapse: collapse;
    font-size: 13px;
}

.detail-design__section th,
.detail-design__section td {
    padding: 8px 12px;
    border: 1px solid #e8ecf1;
    text-align: left;
}

.detail-design__section th {
    background: #f5f7fa;
    color: #8c8c8c;
    font-weight: 500;
}

.detail-design__section td {
    color: #262626;
}

@media (max-width: 1100px) {
    .detail-design__sidebar {
        width: 220px;
    }
}
</style>
