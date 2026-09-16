<template>
    <div class="system-report">
        <aside class="system-report__outline">
            <h3>文档目录</h3>
            <a
                v-for="item in outline"
                :key="item.id"
                :class="{ sub: item.sub }"
                :href="`#${item.id}`"
                >{{ item.label }}</a
            >
        </aside>
        <main class="system-report__content">
            <article>
                <h1>{{ system.name }}系统总体设计报告</h1>
                <div class="report-meta">
                    <b>版本：</b
                    >V1.0.0　　<b>状态：</b>已发布　　<b>更新日期：</b>2026-08-04
                </div>
                <h2 id="doc1">第一章 文档信息</h2>
                <h3 id="doc11">1.1 文档定位</h3>
                <p>
                    本文档为{{
                        system.name
                    }}系统的总体设计报告，统一描述系统信息、集成架构、功能架构、技术架构与部署架构，为研发、测试、运维和架构评审提供依据。
                </p>
                <h3 id="doc12">1.2 设计目标</h3>
                <ul>
                    <li>统一系统架构语言和资产口径，保持架构信息可追溯。</li>
                    <li>清晰呈现系统边界、上下游依赖与核心技术选型。</li>
                    <li>为后续详细设计、开发实施和变更评审提供基准。</li>
                </ul>
                <h2 id="doc2">第二章 系统架构设计</h2>
                <h3 id="doc21">2.1 系统概览</h3>
                <p>{{ system.overview }}</p>
                <h3 id="doc22">2.2 集成架构</h3>
                <p>
                    系统采用客户接触层、渠道交互层、业务应用层、内联网关与业务支撑层的分层集成模式。渠道侧采用
                    HTTP(S)，应用间主要采用 RPC 与 HTTP 协议。
                </p>
                <div class="report-callout">
                    核心原则：渠道解耦、服务复用、接口标准化、调用链路可观测。
                </div>
                <h2 id="doc3">第三章 功能架构设计</h2>
                <h3 id="doc31">3.1 应用架构</h3>
                <p>
                    应用能力按照前端应用层、核心应用层和支撑应用层组织，形成从渠道触点到核心服务的完整能力视图。
                </p>
                <h3 id="doc32">3.2 系统功能</h3>
                <p>
                    系统功能由用户、交互设备、前置系统、业务应用与业务支撑能力构成，覆盖典型端到端业务链路。
                </p>
                <h2 id="doc4">第四章 技术架构设计</h2>
                <p>
                    技术架构采用分层设计，包括展现层、应用支撑层、技术支撑层、基础软件层和管理支撑层。核心技术栈包括
                    Vue.js、Spring Cloud、RabbitMQ、Tomcat、Oracle、Redis、ELK
                    与 Prometheus。
                </p>
                <h2 id="doc5">第五章 部署架构设计</h2>
                <p>
                    当前系统采用双活数据中心与物理机部署方式，通过逻辑部署、物理部署和网络设计三个视图统一呈现部署资产。
                </p>
            </article>
        </main>
    </div>
</template>

<script>
import rpcMixins from "../../../core/mixin";

export default {
    name: "SystemReport",
    mixins: [rpcMixins],
    props: { system: { type: Object, required: true } },
    data() {
        return {
            outline: [
                { id: "doc1", label: "第一章 文档信息" },
                { id: "doc11", label: "1.1 文档定位", sub: true },
                { id: "doc12", label: "1.2 设计目标", sub: true },
                { id: "doc2", label: "第二章 系统架构设计" },
                { id: "doc21", label: "2.1 系统概览", sub: true },
                { id: "doc22", label: "2.2 集成架构", sub: true },
                { id: "doc3", label: "第三章 功能架构设计" },
                { id: "doc31", label: "3.1 应用架构", sub: true },
                { id: "doc32", label: "3.2 系统功能", sub: true },
                { id: "doc4", label: "第四章 技术架构设计" },
                { id: "doc5", label: "第五章 部署架构设计" },
            ],
        };
    },
    methods: {
        // 接口预留：当前报告仍展示 Mock 内容，暂不主动调用。
        getReportOutline(params = {}) {
            return this.rpc.assetcenter.getReportOutline(params);
        },
        getDesignReport(params = {}) {
            return this.rpc.assetcenter.getDesignReport(params);
        },
    },
};
</script>

<style scoped>
.system-report {
    display: grid;
    grid-template-columns: 270px 1fr;
    overflow: hidden;
    height: calc(100vh - 178px);
    min-height: 560px;
    border: 1px solid #e5eaf1;
    border-radius: 10px;
    background: #fff;
}
.system-report__outline {
    overflow: auto;
    border-right: 1px solid #e2e8f0;
}
.system-report__outline h3 {
    margin: 0;
    padding: 18px;
    border-bottom: 1px solid #e2e8f0;
}
.system-report__outline a {
    display: block;
    padding: 10px 20px;
    border-left: 3px solid transparent;
    color: #657287;
    text-decoration: none;
}
.system-report__outline a:hover {
    border-left-color: #2f63dc;
    background: #f1f5ff;
    color: #2f63dc;
}
.system-report__outline a.sub {
    padding-left: 36px;
}
.system-report__content {
    overflow: auto;
    padding: 28px 40px;
    scroll-behavior: smooth;
}
.system-report__content article {
    max-width: 1050px;
    margin: auto;
    color: #334155;
    line-height: 1.8;
}
.system-report__content h1 {
    padding-bottom: 18px;
    border-bottom: 1px solid #dfe6ef;
    color: #1f2937;
    font-size: 28px;
}
.system-report__content h2 {
    margin-top: 36px;
}
.system-report__content h3 {
    margin-top: 28px;
}
.system-report__content li {
    margin: 8px 0;
}
.report-meta,
.report-callout {
    margin: 16px 0;
    padding: 14px 18px;
    border-left: 4px solid #3678ef;
    background: #f4f6ff;
}
@media (max-width: 1000px) {
    .system-report {
        grid-template-columns: 220px 1fr;
    }
}
</style>
