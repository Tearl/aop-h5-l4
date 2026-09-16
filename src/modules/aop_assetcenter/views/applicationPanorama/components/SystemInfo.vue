<template>
    <div class="system-info card-panel">
        <el-tabs
            v-model="activeTab"
            class="system-info__tabs"
            @tab-click="handleInfoTabClick"
        >
            <el-tab-pane label="基本信息" name="basic" />
            <el-tab-pane label="技术栈清单" name="stack" />
        </el-tabs>

        <div v-if="activeTab === 'basic'" class="system-info__content">
            <section
                v-for="section in infoSections"
                :key="section.title"
                class="info-section"
            >
                <h3>{{ section.title }}</h3>
                <div class="info-grid">
                    <div
                        v-for="(item, index) in section.items"
                        :key="`${item.label}-${index}`"
                        :class="['info-row', { 'info-row--full': item.full }]"
                    >
                        <span class="info-label">{{ item.label }}</span>
                        <span
                            :class="[
                                'info-value',
                                { 'info-value--status': item.status },
                            ]"
                            >{{ item.value }}</span
                        >
                    </div>
                </div>
            </section>

            <section class="info-section">
                <h3>附件</h3>
                <el-table
                    class="system-table attachment-table"
                    :data="attachments"
                    border
                >
                    <el-table-column
                        prop="name"
                        label="附件名称"
                        min-width="220"
                    />
                    <el-table-column prop="type" label="类型" />
                    <el-table-column prop="uploader" label="上传人" />
                    <el-table-column
                        prop="time"
                        label="上传时间"
                        min-width="170"
                    />
                    <el-table-column label="操作" width="120">
                        <template>
                            <el-button
                                type="text"
                                @click="$message.info('正在预览附件')"
                                >查看</el-button
                            >
                            <el-button
                                type="text"
                                @click="$message.success('附件下载已开始')"
                                >下载</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </section>
        </div>

        <div v-else class="system-info__content">
            <div class="stack-filter">
                <el-input
                    v-model.trim="keyword"
                    clearable
                    placeholder="请输入技术栈名称"
                    @keyup.enter.native="search"
                />
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </div>
            <el-table
                v-loading="stackLoading"
                class="system-table stack-table"
                :data="pagedStacks"
            >
                <el-table-column prop="layer" label="技术层" min-width="120" />
                <el-table-column prop="domain" label="技术域" min-width="130" />
                <el-table-column
                    prop="name"
                    label="技术栈名称"
                    min-width="145"
                />
                <el-table-column
                    prop="version"
                    label="版本号"
                    min-width="110"
                />
                <el-table-column
                    prop="recommended"
                    label="建议升级版本号"
                    min-width="130"
                />
                <el-table-column prop="category" label="类别" min-width="90" />
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span
                            :class="[
                                'status-tag',
                                { 'status-tag--disabled': scope.row.status === '停用' },
                            ]"
                            >{{ scope.row.status }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="openSource"
                    label="是否开源"
                    width="90"
                />
                <el-table-column
                    prop="innovation"
                    label="是否信创"
                    width="90"
                />
                <el-table-column label="操作" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openStack(scope.row)"
                            >查看</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-pagination">
                <el-pagination
                    :current-page.sync="stackPage"
                    :page-size="stackPageSize"
                    :page-sizes="[10, 20, 30, 50]"
                    :total="filteredStacks.length"
                    layout="total, sizes, prev, pager, next"
                    @size-change="onStackPageSizeChange"
                />
            </div>
        </div>

        <el-drawer
            :visible.sync="stackDrawerVisible"
            title="技术栈详情"
            direction="rtl"
            size="700px"
            append-to-body
            class="system-stack-detail-drawer"
            @closed="handleStackDrawerClosed"
        >
            <div
                v-if="selectedStack"
                v-loading="stackDetailLoading"
                class="stack-drawer system-info"
            >
                <el-tabs
                    v-model="detailTab"
                    class="stack-drawer__tabs"
                    @tab-click="handleDetailTabClick"
                >
                    <el-tab-pane label="基本信息" name="basic" />
                    <el-tab-pane label="包含逻辑资源" name="resource" />
                </el-tabs>
                <div v-if="detailTab === 'basic'" class="stack-drawer__body">
                    <section class="drawer-section">
                        <h3>基本信息</h3>
                        <div class="stack-detail">
                            <span>技术栈名称</span
                            ><b>{{ stackDetailData.name }}</b> <span>类别</span
                            ><b>{{ stackDetailData.category }}</b>
                            <span>所属技术域</span
                            ><b>{{ stackDetailData.domainPath }}</b>
                            <span>状态</span
                            ><b
                                ><i
                                    :class="[
                                        'status-tag',
                                        {
                                            'status-tag--disabled':
                                                stackDetailData.status === '停用',
                                        },
                                    ]"
                                    >{{ stackDetailData.status }}</i
                                ></b
                            >
                            <span>是否开源</span
                            ><b>{{ stackDetailData.isOpen }}</b>
                            <span>是否信创</span
                            ><b>{{ stackDetailData.isXinchuang }}</b>
                            <span>通信协议</span
                            ><b>{{ stackDetailData.protocol }}</b>
                            <span>字符集</span
                            ><b>{{ stackDetailData.charSet }}</b>
                            <span>技术栈说明</span
                            ><b>{{ stackDetailData.desc }}</b>
                        </div>
                    </section>
                    <section class="drawer-section">
                        <h3>版本信息</h3>
                        <el-table
                            class="system-table"
                            :data="versionRows"
                            border
                        >
                            <el-table-column prop="version" label="版本号" />
                            <el-table-column
                                prop="description"
                                label="版本说明"
                            />
                            <el-table-column
                                prop="recommended"
                                label="建议升级版本"
                            />
                        </el-table>
                    </section>
                </div>
                <div v-else class="stack-drawer__body">
                    <div class="resource-filter">
                        <el-input
                            v-model.trim="resourceKeyword"
                            size="small"
                            clearable
                            placeholder="请输入资源名称"
                            @keyup.enter.native="applyResourceFilter"
                        />
                        <el-select
                            v-model="resourceType"
                            size="small"
                            clearable
                            placeholder="全部类别"
                        >
                            <el-option label="服务" value="0" />
                            <el-option label="组件" value="1" />
                        </el-select>
                        <el-button
                            type="primary"
                            size="small"
                            @click="applyResourceFilter"
                            >搜索</el-button
                        >
                        <el-button size="small" @click="resetResourceFilter"
                            >重置</el-button
                        >
                    </div>
                    <el-table
                        v-loading="resourceLoading"
                        class="system-table"
                        :data="filteredResources"
                        border
                    >
                        <el-table-column
                            prop="name"
                            label="逻辑资源名称"
                            min-width="220"
                        />
                        <el-table-column
                            prop="type"
                            label="逻辑资源类别"
                            min-width="130"
                        />
                        <el-table-column label="状态" width="90">
                            <template slot-scope="scope">
                                <span class="status-tag">{{
                                    scope.row.status
                                }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-pagination table-pagination--drawer">
                        <el-pagination
                            :current-page="resourcePagination.currentPage"
                            :page-size="resourcePagination.pageSize"
                            :total="resourcePagination.total"
                            layout="total, sizes, prev, pager, next"
                        />
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import mixins from "@m/core/mixin";

const EMPTY_VALUE = "—";

function hasValue(value) {
    return value !== undefined && value !== null && value !== "";
}

function firstValue(...values) {
    const value = values.find(hasValue);
    return hasValue(value) ? value : EMPTY_VALUE;
}

function booleanText(value) {
    if (!hasValue(value)) return EMPTY_VALUE;
    if (["1", 1, true, "Y", "y", "是"].includes(value)) return "是";
    if (["0", 0, false, "N", "n", "否"].includes(value)) return "否";
    return value;
}

function normalizeTechStackRow(item = {}) {
    return {
        ...item,
        id: firstValue(item.techStackId, item.id),
        layer: firstValue(
            item.techLevelName,
            item.techLayerName,
            item.techLevelId
        ),
        domain: firstValue(item.techDomainName, item.techDomainId),
        name: firstValue(item.techStackName, item.name),
        version: firstValue(item.techStackVersion, item.version),
        recommended: firstValue(
            item.techStackVersionUp,
            item.recommended
        ),
        category: firstValue(item.techStackType, item.category),
        openSource: booleanText(
            hasValue(item.isOpen) ? item.isOpen : item.openSource
        ),
        innovation: booleanText(
            hasValue(item.isXinchuang)
                ? item.isXinchuang
                : item.innovation
        ),
        status: statusText(item.status),
    };
}

function statusText(value) {
    if (String(value) === "0") return "在用";
    if (String(value) === "1") return "停用";
    return firstValue(value);
}

function systemStatusText(value) {
    if (String(value) === "0") return "已投产";
    if (String(value) === "1") return "未投产";
    return firstValue(value);
}

function systemLevelText(value) {
    const levelMap = {
        L1: "重要",
        L2: "一般",
        L3: "次要",
    };
    if (!hasValue(value)) return EMPTY_VALUE;
    return levelMap[String(value).toUpperCase()] || value;
}

function normalizeLogicalResource(item = {}) {
    return {
        ...item,
        name: firstValue(item.logicDeviceName, item.name),
        type:
            {
                0: "服务",
                1: "组件",
            }[String(item.logicDeviceType)] ||
            firstValue(item.logicDeviceType, item.type),
        status:
            String(item.status) === "0"
                ? "正常"
                : firstValue(item.status),
    };
}

export default {
    name: "SystemInfo",
    mixins: [mixins],
    props: {
        system: { type: Object, required: true },
        stacks: { type: Array, required: true },
        belongId: { type: String, default: "" },
    },
    data() {
        return {
            activeTab: "basic",
            keyword: "",
            appliedKeyword: "",
            stackPage: 1,
            stackPageSize: 10,
            stackRows: [],
            stackLoaded: false,
            stackLoading: false,
            stackRequestId: 0,
            selectedStack: null,
            stackDetail: null,
            stackDetailLoading: false,
            stackDetailRequestId: 0,
            stackDrawerVisible: false,
            detailTab: "basic",
            resourceResult: null,
            resourceLoading: false,
            resourceRequestId: 0,
            resourceKeyword: "",
            appliedResourceKeyword: "",
            resourceType: "",
            appliedResourceType: "",
        };
    },
    computed: {
        basicItems() {
            const s = this.system;
            return [
                { label: "系统标识", value: firstValue(s.sysId, s.id) },
                {
                    label: "所属应用域",
                    value: firstValue(s.appDomain, s.domain),
                },
                { label: "系统名称", value: firstValue(s.sysChiName, s.name) },
                {
                    label: "系统简称",
                    value: firstValue(s.sysShortName, s.shortName),
                },
                {
                    label: "英文名称",
                    value: firstValue(s.sysEngName, s.englishName),
                },
                { label: "系统代码", value: firstValue(s.sysCode, s.code) },
                { label: "系统类别", value: firstValue(s.sysType, s.category) },
                {
                    label: "系统属性",
                    value: firstValue(s.systemAttribute, s.attribute),
                },
                {
                    label: "用户范围",
                    value: firstValue(s.userScope, s.audience),
                },
                {
                    label: "当前状态",
                    value: systemStatusText(s.status),
                    status: true,
                },
                {
                    label: "系统等级",
                    value: systemLevelText(
                        hasValue(s.sysLevel) ? s.sysLevel : s.level
                    ),
                },
                { label: "上线日期", value: firstValue(s.launchDate) },
                {
                    label: "系统概述",
                    value: firstValue(s.sysDesc, s.remark, s.overview),
                    full: true,
                },
            ];
        },
        infoSections() {
            return [
                { title: "基本信息", items: this.basicItems },
                { title: "应用部署架构", items: this.deploymentItems },
                { title: "信创信息", items: this.innovationItems },
                { title: "管理属性", items: this.managementItems },
                { title: "安全属性", items: this.securityItems },
                { title: "开发情况", items: this.developmentItems },
            ];
        },
        deploymentItems() {
            const s = this.system;
            return [
                {
                    label: "数据中心",
                    value: firstValue(s.dataCenter, s.deployArchDesc),
                },
                {
                    label: "应用高可用方案",
                    value: firstValue(
                        s.highAvailabilityPlan,
                        s.deployArchDesc
                    ),
                },
                {
                    label: "部署方式",
                    value: firstValue(s.deployArchType),
                    full: true,
                },
            ];
        },
        innovationItems() {
            const s = this.system;
            return [
                {
                    label: "是否需要完成信创",
                    value: booleanText(s.isXinchuang),
                    full: true,
                },
            ];
        },
        managementItems() {
            const s = this.system;
            return [
                {
                    label: "牵头部门",
                    value: firstValue(s.leadDeptName, s.leadDept),
                },
                {
                    label: "配合部门",
                    value: firstValue(s.coordDeptName, s.coordDept),
                },
                {
                    label: "业务负责人A角",
                    value: firstValue(s.roleAName, s.roleA),
                },
                {
                    label: "业务负责人B角",
                    value: firstValue(s.roleBName, s.roleB),
                },
                {
                    label: "应用负责中心",
                    value: firstValue(
                        s.appCenterName,
                        s.appCenter,
                        s.appResponsibleCenterName,
                        s.appResponsibleCenter
                    ),
                },
                {
                    label: "应用负责人A角",
                    value: firstValue(s.appRoleAName, s.appRoleA),
                },
                {
                    label: "运维负责人A角",
                    value: firstValue(s.opsRoleAName, s.opsRoleA),
                },
                {
                    label: "运维负责人B角",
                    value: firstValue(s.opsRoleBName, s.opsRoleB),
                },
            ];
        },
        securityItems() {
            const s = this.system;
            return [
                {
                    label: "是否含敏感信息",
                    value: booleanText(s.sensitiveInfo),
                },
                { label: "等保等级", value: firstValue(s.securityLevel) },
                {
                    label: "是否接入互联网",
                    value: booleanText(s.isInternet),
                },
                {
                    label: "是否有第三方接入",
                    value: booleanText(s.hasThirdPartyAccess),
                },
            ];
        },
        developmentItems() {
            const s = this.system;
            return [
                {
                    label: "开发模式",
                    value: firstValue(s.devMode, s.devStatus),
                },
                {
                    label: "供应商",
                    value: firstValue(s.supplierName, s.supplier, s.devTeam),
                },
                {
                    label: "供应商备注",
                    value: firstValue(s.supplierRemark),
                    full: true,
                },
            ];
        },
        attachments() {
            if (!Array.isArray(this.system.attachments)) return [];
            return this.system.attachments.map((item) => ({
                ...item,
                name: firstValue(item.name, item.fileName, item.attachName),
                type: firstValue(item.type, item.fileType),
                uploader: firstValue(item.uploader, item.crtNm),
                time: firstValue(item.time, item.crtTm),
            }));
        },
        filteredStacks() {
            const keyword = this.appliedKeyword.toLowerCase();
            const stacks = this.stackLoaded ? this.stackRows : this.stacks;
            return keyword
                ? stacks.filter((item) =>
                      String(item.name || "")
                          .toLowerCase()
                          .includes(keyword)
                  )
                : stacks;
        },
        pagedStacks() {
            const start = (this.stackPage - 1) * this.stackPageSize;
            return this.filteredStacks.slice(start, start + this.stackPageSize);
        },
        versionRows() {
            if (!this.selectedStack) return [];
            return [
                {
                    version: this.stackDetailData.version,
                    description: this.stackDetailData.versionDesc,
                    recommended: this.stackDetailData.versionUp,
                },
            ];
        },
        stackDetailData() {
            const detail = this.stackDetail || {};
            const info = detail.techStackInfo || {};
            const version = detail.versionInfo || {};
            const selected = this.selectedStack || {};
            const domainPath = [selected.layer, selected.domain]
                .filter((value) => hasValue(value) && value !== EMPTY_VALUE)
                .join(" / ");
            return {
                name: firstValue(info.techStackName),
                category: firstValue(info.techStackType),
                domainPath: domainPath || firstValue(info.techDomainId),
                status: statusText(info.status),
                isOpen: booleanText(info.isOpen),
                isXinchuang: booleanText(info.isXinchuang),
                protocol: firstValue(info.protocol),
                charSet: firstValue(info.charSet),
                desc: firstValue(info.techStackDesc),
                version: firstValue(version.techStackVersion),
                versionDesc: firstValue(version.versionDesc),
                versionUp: firstValue(version.techStackVersionUp),
            };
        },
        logicalResources() {
            const result = this.resourceResult || {};
            return Array.isArray(result.list)
                ? result.list.map(normalizeLogicalResource)
                : [];
        },
        filteredResources() {
            return this.logicalResources;
        },
        resourcePagination() {
            const result = this.resourceResult || {};
            return {
                currentPage: Number(result.currentPage) || 1,
                pageSize: Number(result.turnPageShowNum) || 10,
                total: Number(result.turnPageTotalNum) || 0,
            };
        },
    },
    watch: {
        belongId(value, previousValue) {
            if (value === previousValue) return;
            this.stackRows = [];
            this.stackLoaded = false;
            if (this.activeTab === "stack") {
                this.getTechStackList();
            }
        },
    },
    methods: {
        // 系统详情由父页面加载；技术栈相关接口在本组件内维护。
        handleInfoTabClick(tab) {
            if (tab && tab.name === "stack") {
                this.getTechStackList();
            }
        },
        getSystemDetail(params = {}) {
            return this.rpc.assetcenter.getSystemDetail(params);
        },
        buildTechStackListParams(params = {}) {
            return {
                techStackName:
                    params.techStackName !== undefined
                        ? params.techStackName
                        : this.appliedKeyword,
                belongId:
                    params.belongId ||
                    this.belongId ||
                    this.system.sysVersionId ||
                    "",
                fcType: params.fcType || "flow",
            };
        },
        async getTechStackList(params = {}) {
            const requestParams = this.buildTechStackListParams(params);
            const requestId = ++this.stackRequestId;
            this.stackRows = [];
            this.stackLoaded = false;

            this.stackLoading = true;
            try {
                const response = await this.rpc.assetcenter.getTechStackList(
                    requestParams
                );
                const result = (response && response.body) || response || {};
                const rows = Array.isArray(result.list) ? result.list : [];
                if (requestId !== this.stackRequestId) return [];
                this.stackRows = rows.map(normalizeTechStackRow);
                this.stackLoaded = true;
                this.stackPage = 1;
                return this.stackRows;
            } catch (error) {
                if (requestId === this.stackRequestId) {
                    this.stackRows = [];
                    this.stackLoaded = true;
                }
                return [];
            } finally {
                if (requestId === this.stackRequestId) {
                    this.stackLoading = false;
                }
            }
        },
        getSelectedTechStackId(stack = this.selectedStack || {}) {
            return stack.techStackId || stack.nodeId || stack.id || "";
        },
        async getTechStackNodeDetail(techStackId) {
            const requestId = ++this.stackDetailRequestId;
            this.stackDetail = null;
            if (!techStackId) return null;
            this.stackDetailLoading = true;
            try {
                const response =
                    await this.rpc.assetcenter.getTechStackNodeDetail({
                        techStackId,
                    });
                const result = (response && response.body) || response || null;
                if (requestId === this.stackDetailRequestId) {
                    this.stackDetail = result;
                }
                return result;
            } catch (error) {
                if (requestId === this.stackDetailRequestId) {
                    this.stackDetail = null;
                }
                return null;
            } finally {
                if (requestId === this.stackDetailRequestId) {
                    this.stackDetailLoading = false;
                }
            }
        },
        async getTechLogicalResourcesDetail(params = {}) {
            const requestId = ++this.resourceRequestId;
            this.resourceResult = null;
            this.resourceLoading = true;
            try {
                const response =
                    await this.rpc.assetcenter.getTechLogicalResourcesDetail({
                        resourceName: params.resourceName || "",
                        resourceType: params.resourceType || "",
                        techStackId: params.techStackId || "",
                    });
                const result = (response && response.body) || response || {};
                if (requestId === this.resourceRequestId) {
                    this.resourceResult = result;
                }
                return result;
            } catch (error) {
                if (requestId === this.resourceRequestId) {
                    this.resourceResult = null;
                }
                return null;
            } finally {
                if (requestId === this.resourceRequestId) {
                    this.resourceLoading = false;
                }
            }
        },
        search() {
            this.appliedKeyword = this.keyword;
            this.stackPage = 1;
            this.getTechStackList({
                techStackName: this.appliedKeyword,
            });
        },
        reset() {
            this.keyword = "";
            this.appliedKeyword = "";
            this.stackPage = 1;
            this.getTechStackList({ techStackName: "" });
        },
        onStackPageSizeChange(size) {
            this.stackPageSize = size;
            this.stackPage = 1;
        },
        openStack(stack) {
            this.selectedStack = stack;
            this.stackDetail = null;
            this.resourceResult = null;
            this.detailTab = "basic";
            this.clearResourceFilter();
            this.stackDrawerVisible = true;
            this.getTechStackNodeDetail(this.getSelectedTechStackId(stack));
        },
        handleDetailTabClick(tab) {
            if (tab && tab.name === "resource") {
                this.queryLogicalResources();
            }
        },
        queryLogicalResources() {
            const techStackId = this.getSelectedTechStackId();
            if (!techStackId) return null;
            return this.getTechLogicalResourcesDetail({
                resourceName: this.resourceKeyword,
                resourceType: this.resourceType,
                techStackId,
            });
        },
        handleStackDrawerClosed() {
            this.stackDetailRequestId += 1;
            this.resourceRequestId += 1;
            this.selectedStack = null;
            this.stackDetail = null;
            this.resourceResult = null;
            this.stackDetailLoading = false;
            this.resourceLoading = false;
            this.detailTab = "basic";
            this.clearResourceFilter();
        },
        applyResourceFilter() {
            this.appliedResourceKeyword = this.resourceKeyword;
            this.appliedResourceType = this.resourceType;
            this.queryLogicalResources();
        },
        resetResourceFilter() {
            this.clearResourceFilter();
            this.queryLogicalResources();
        },
        clearResourceFilter() {
            this.resourceKeyword = "";
            this.appliedResourceKeyword = "";
            this.resourceType = "";
            this.appliedResourceType = "";
        },
    },
};
</script>

<style scoped>
.card-panel {
    overflow: hidden;
    border: 1px solid #e5eaf1;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(31, 41, 55, 0.04);
}
.system-info__tabs {
    padding: 0 24px;
    border-bottom: 1px solid #e5eaf1;
}
.system-info__tabs ::v-deep .el-tabs__header {
    margin: 0;
}
.system-info__tabs ::v-deep .el-tabs__nav-wrap::after {
    display: none;
}
.system-info__tabs ::v-deep .el-tabs__item {
    height: 52px;
    padding: 0 28px;
    line-height: 52px;
}
.system-info__content {
    padding: 18px;
}
.info-section {
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid #e4eaf2;
    border-radius: 9px;
}
.info-section:last-child {
    margin-bottom: 0;
}
.info-section h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 14px 18px;
    border-bottom: 1px solid #e8edf4;
    font-size: 16px;
    font-weight: 700;
}
.info-section h3::before {
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: #3981ef;
    content: "";
}
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}
.info-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    min-height: 48px;
    border-bottom: 1px solid #edf1f6;
}
.info-row:nth-child(odd) {
    border-right: 1px solid #edf1f6;
}
.info-row--full {
    grid-column: 1 / -1;
    border-right: 0 !important;
}
.info-label,
.info-value {
    padding: 13px 16px;
    line-height: 1.7;
}
.info-label {
    background: #fafbfc;
    color: #7c8798;
}
.info-value--status {
    color: #159b62;
}
.stack-filter {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 14px;
}
.stack-filter .el-input {
    width: 260px;
    margin-right: auto;
}
.table-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 2px 0;
}
.table-pagination--drawer {
    padding-top: 14px;
}
.status-tag {
    display: inline-flex;
    padding: 2px 9px;
    border-radius: 999px;
    background: #eaf8f1;
    color: #159b62;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
}
.status-tag--disabled {
    background: #fef0f0;
    color: #f04438;
}
.stack-drawer {
    min-height: 100%;
    background: #fff;
}
.stack-drawer__tabs {
    padding: 0 20px;
    border-bottom: 1px solid #e2e8f0;
}
.stack-drawer__tabs ::v-deep .el-tabs__header {
    margin: 0;
}
.stack-drawer__tabs ::v-deep .el-tabs__nav-wrap::after {
    display: none;
}
.stack-drawer__tabs ::v-deep .el-tabs__item {
    height: 50px;
    padding: 0 20px;
    line-height: 50px;
}
.stack-drawer__body {
    padding: 20px;
}
.drawer-section {
    margin-bottom: 20px;
}
.drawer-section h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 15px;
}
.drawer-section h3::before {
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: #3981ef;
    content: "";
}
.stack-detail {
    display: grid;
    grid-template-columns: 140px 1fr 140px 1fr;
    overflow: hidden;
    border: 1px solid #e5eaf1;
    border-radius: 7px;
}
.stack-detail span,
.stack-detail b {
    min-height: 44px;
    padding: 11px 14px;
    border-bottom: 1px solid #edf0f4;
    box-sizing: border-box;
    line-height: 22px;
}
.stack-detail span {
    background: #f7f9fc;
    color: #8a94a3;
    font-weight: 400;
}
.stack-detail b {
    color: #344256;
    font-weight: 400;
}
.stack-detail span:last-of-type {
    grid-column: 1 / 2;
}
.stack-detail b:last-of-type {
    grid-column: 2 / -1;
}
.resource-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
}
.resource-filter .el-input {
    width: 210px;
}
.resource-filter .el-select {
    width: 150px;
}
.system-info ::v-deep .system-table.el-table {
    overflow: hidden;
    border-color: #e1e7ef;
    border-radius: 8px;
    color: #3f4d61;
    font-size: 14px;
}
.system-info ::v-deep .system-table.el-table::before,
.system-info ::v-deep .system-table.el-table--border::after {
    background-color: #e1e7ef;
}
.system-info ::v-deep .system-table.el-table th {
    height: 48px;
    padding: 0;
    border-color: #e1e7ef;
    background: #f7f9fc;
    color: #536077;
    font-weight: 600;
}
.system-info ::v-deep .system-table.el-table td {
    height: 48px;
    padding: 0;
    border-color: #e7ecf3;
    background: #fff;
}
.system-info ::v-deep .system-table.el-table th > .cell,
.system-info ::v-deep .system-table.el-table td > .cell {
    padding: 0 14px;
    line-height: 22px;
}
.system-info ::v-deep .system-table.el-table .el-table__body tr:hover > td {
    background: #f6f9fe;
}
.system-info ::v-deep .system-table.el-table .el-button--text {
    padding: 5px 0;
    color: #2f6bdb;
}
.system-info
    ::v-deep
    .system-table.el-table
    .el-button--text
    + .el-button--text {
    margin-left: 12px;
}
.system-info ::v-deep .system-table.el-table .el-table__empty-block {
    min-height: 120px;
}
.system-info ::v-deep .system-table.el-table .el-table__fixed-right::before {
    background-color: #e1e7ef;
}
.system-info ::v-deep .table-pagination .el-pagination {
    display: flex;
    align-items: center;
    padding: 0;
    color: #687588;
}
.system-info ::v-deep .table-pagination .el-pagination__total {
    margin-right: 14px;
    color: #7b8798;
}
.system-info ::v-deep .table-pagination .el-pagination__sizes {
    margin-right: 10px;
}
.system-info ::v-deep .table-pagination .btn-prev,
.system-info ::v-deep .table-pagination .btn-next,
.system-info ::v-deep .table-pagination .el-pager li {
    min-width: 32px;
    height: 32px;
    margin: 0 3px;
    border: 1px solid #dce3ed;
    border-radius: 6px;
    background: #fff;
    color: #607086;
    line-height: 30px;
}
.system-info ::v-deep .table-pagination .el-pager li.active {
    border-color: #2f63dc;
    background: #2f63dc;
    color: #fff;
}
.system-info ::v-deep .table-pagination .btn-prev:disabled,
.system-info ::v-deep .table-pagination .btn-next:disabled {
    color: #c0c7d2;
}
@media (max-width: 1100px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
    .info-row:nth-child(odd) {
        border-right: 0;
    }
}
</style>

<style>
.system-stack-detail-drawer .el-drawer {
    max-width: calc(100vw - 40px);
}

.system-stack-detail-drawer .el-drawer__header {
    padding: 18px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #e2e8f0;
    color: #252b35;
    font-size: 18px;
    font-weight: 600;
}

.system-stack-detail-drawer .el-drawer__body {
    overflow: auto;
}
</style>
