<template>
    <div class="s4-review-block">
        <el-divider></el-divider>
        <div class="review-content-block">
            <!-- D2 -->
            <el-container class="d2">
                <el-header
                    style="
                        height: 40px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    "
                >
                    <div class="left-header">
                        <i class="el-icon-arrow-left" @click="goBack"></i>
                        <span>业务需求</span>
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="showAllConfirmDialog = true"
                            >一键确认</el-button
                        >
                        <el-button
                            type="primary"
                            size="mini"
                            :disabled="activeComponentD2 != 'eventD2'"
                            @click="openReview"
                            >设计确认</el-button
                        >
                        <el-button
                            type="primary"
                            size="mini"
                            @click="finalSubmit"
                            >提交</el-button
                        >
                    </div>
                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <div class="side-tree">
                            <el-tree
                                class="tree-list"
                                :data="treeDataD2"
                                :props="defaultProps"
                                ref="d2Tree"
                                node-key="id"
                                :indent="10"
                                :highlight-current="true"
                                :expand-on-click-node="false"
                                @node-click="clickNode"
                                :default-expanded-keys="firstExpendNodeIds"
                            >
                                <span
                                    class="custom-tree-node"
                                    slot-scope="{ node, data }"
                                >
                                    <template
                                        v-if="
                                            checkNodeStatus(node, data) === '0'
                                        "
                                    >
                                        <i
                                            class="el-icon-success"
                                            style="color: #67c23a"
                                        ></i>
                                    </template>
                                    <template
                                        v-if="
                                            checkNodeStatus(node, data) === '1'
                                        "
                                    >
                                        <i
                                            class="el-icon-error"
                                            style="color: #f56c6c"
                                        ></i>
                                    </template>
                                    <template
                                        v-if="
                                            checkNodeStatus(node, data) === '2'
                                        "
                                    >
                                        <i
                                            class="el-icon-warning"
                                            style="color: #e6a23c"
                                        ></i>
                                    </template>
                                    <Tag :dataType="data.dataType" />
                                    <span class="label-block">
                                        <span>{{ node.label }}</span>
                                    </span>
                                </span>
                            </el-tree>
                        </div>
                    </el-aside>
                    <el-main>
                        <!-- D2 页面-要素-事件 -->
                        <component
                            class="content-wrapper"
                            :is="activeComponentD2"
                            :ref="activeComponentD2"
                            :attrs="d2ComponentProps"
                        ></component>
                    </el-main>
                </el-container>
            </el-container>

            <!-- C3 -->
            <el-container>
                <el-header style="height: 40px">
                    <span class="c3-title">设计实现</span>
                    <el-select
                        v-model="modelVersionC3"
                        size="mini"
                        class="hide-input-select"
                        @change="modelVersionC3Change"
                    >
                        <el-option
                            v-for="item in chnlAppInfoList"
                            :key="item.jobNo"
                            :label="item.appNm"
                            :value="item.jobNo"
                        >
                        </el-option>
                    </el-select>
                    <div class="check-result">
                        规范检测结果：<span
                            class="success"
                            v-if="checkResult == '1'"
                            >通过</span
                        ><span class="error" v-else-if="checkResult == '0'"
                            >不通过</span
                        ><el-button
                            type="text"
                            @click="checkVisible = true"
                            :disabled="!checkItemList.length"
                            >查看</el-button
                        >
                    </div>
                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <div class="side-tree">
                            <el-tree
                                class="tree-list"
                                :data="treeDataC3"
                                :props="defaultProps"
                                ref="c3Tree"
                                node-key="id"
                                :indent="10"
                                :load="loadNodeC3"
                                lazy
                                :highlight-current="true"
                                :expand-on-click-node="false"
                                @node-click="clickNodeC3"
                                :default-expanded-keys="firstExpendNodeIdsC3"
                            >
                                <span
                                    class="custom-tree-node"
                                    slot-scope="{ node, data }"
                                >
                                    <Tag :dataType="data.dataType" />
                                    <span class="label-block">
                                        <span>{{ node.label }}</span>
                                    </span>
                                </span>
                            </el-tree>
                        </div>
                    </el-aside>
                    <el-main>
                        <!-- C3 页面 要素 事件 接口 服务 -->
                        <component
                            class="content-wrapper"
                            :is="activeComponentC3"
                            :ref="activeComponentC3"
                            :attrs="c3ComponentProps"
                        ></component>
                    </el-main>
                </el-container>
            </el-container>
        </div>

        <submitDialog
            v-if="visibleSubmitDialog"
            @closeSubmitDialog="hideSubmitDialog"
            @finishSubmit="finishSubmit"
            :showSubmitDialog="visibleSubmitDialog"
            :examId="examId"
            :fnctId="fnctId"
            :fnctNm="fnctNm"
        ></submitDialog>

        <DesignDialog
            v-if="visibleReviewDialog"
            @checkSystemDesign="handleReviewCommit"
            ref="designDialog"
            :dialogVisible="visibleReviewDialog"
            :nodeData="activeD2Event"
            @closeReview="closeReview"
        >
        </DesignDialog>

        <!-- 规范检测结果 -->
        <checkDetail
            v-if="checkVisible"
            :checkVisible="checkVisible"
            :checkResult="checkResult"
            :checkItemList="checkItemList"
            @close="checkVisible = false"
        />
        <!-- 一键评审 -->
        <template v-if="showAllConfirmDialog">
            <allConfirmDialog
                :showAllConfirmDialog="showAllConfirmDialog"
                :fnctId="fnctId"
                :examId="examId"
                @closeDialog="closeAllConfirm"
            />
        </template>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Tag from "../Tag.vue";

import pagePreview from "../pagePreview.vue"; // 页面预览
import elePreview from "../elePreview.vue"; // 要素预览
import eventD2 from "./eventD2.vue"; // D2 事件
import eventC3 from "./eventC3.vue";
import interfaceDetail from "./interfaceDetail.vue";
import serviceConfirm from "../serviceConfirm.vue";
import submitDialog from "../submitDialog.vue";
import DesignDialog from "../../designDialog/index";
import checkDetail from "./checkDetail.vue";
import allConfirmDialog from "./allConfirmDialog.vue";

export default {
    name: "S4ReviewContent",
    mixins: [mixin],
    components: {
        Tag,
        pagePreview,
        elePreview,
        eventD2,
        eventC3,
        interfaceDetail,
        serviceConfirm,
        submitDialog,
        DesignDialog,
        checkDetail,
        allConfirmDialog,
    },
    data() {
        return {
            breadcrumbs: [
                {
                    label: "系统设计评审",
                    operate: "back",
                },
            ],
            fnctId: "", // 功能id
            examId: "", // 实例id
            functionId: "", // 功能编号
            modelVersionD2: "", // D2 作业号
            modelVersionC3: "", // C3 作业号
            fnctNm: "", // 功能名称
            chnlAppInfoList: [], // 工程列表

            // 树
            treeDataD2: [],
            treeDataC3: [],
            treeEventList: [],
            keyword: "",
            firstExpendNodeIds: [], // D2 展开节点
            firstExpendNodeIdsC3: [], // C3 展开节点
            currentSelectNode: null,
            defaultProps: {
                id: "id",
                children: "children",
                label: "label",
                dataType: "dataType",
                dataId: "dataId",
                status: "status",
                isLeaf: "isLeaf",
            },

            // 选中组件
            activeComponentD2: "", // D2
            activeComponentC3: "", // C3

            d2ComponentProps: {},
            c3ComponentProps: {},

            // 提交
            visibleSubmitDialog: false,
            visibleReviewDialog: false,
            activeD2Event: {},

            // 规范检测
            checkResult: "2",
            checkItemList: [],
            checkVisible: false,

            // 一键评审
            showAllConfirmDialog: false,
        };
    },
    async created() {
        this.init();
        await this.queryRuleCheckResult();
    },
    methods: {
        async closeAllConfirm(t) {
            this.showAllConfirmDialog = false;
            if (t) {
                this.init();
                await this.queryRuleCheckResult();
            }
        },
        async queryRuleCheckResult() {
            const { checkResult, checkItemList } =
                await this.rpc.assetList.queryRuleCheckResult({
                    fnctId: this.fnctId,
                    examId: this.examId,
                });
            this.checkResult = checkResult;
            this.checkItemList = checkItemList;
        },
        goBack() {
            this.$router.go(-1);
        },
        finalSubmit() {
            let status = false;
            this.treeEventList.forEach((item) => {
                if (item.rewReltCd == "2") {
                    status = true;
                }
            });
            if (status) {
                return this.$confirm(
                    "请将黄色感叹号标注的内容全部评审完成，再进行提交。",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        type: "warning",
                    }
                );
            } else {
                this.visibleSubmitDialog = true;
            }
        },
        hideSubmitDialog() {
            this.visibleSubmitDialog = false;
        },
        finishSubmit(names, userNos) {
            this.rpc.businessRules
                .submitFinalReviewResult({
                    examId: this.examId,
                    fnctId: this.fnctId,
                    rewrNm: names,
                    rewrNo: userNos,
                })
                .then(() => {
                    this.hideSubmitDialog = false;
                    this.$message({
                        type: "success",
                        message: "提交成功",
                    });
                    this.$router.push({
                        path: "/aop_endentry/systemDesign/home",
                    });
                });
        },
        openReview() {
            this.visibleReviewDialog = true;
        },
        closeReview() {
            this.visibleReviewDialog = false;
        },
        async handleReviewCommit(data) {
            let rewReltCd = "0";
            const list = data.map((item) => {
                if (!item.checkFlg) {
                    rewReltCd = "1";
                }
                return {
                    rewOpinion: item.inputText,
                    rewSectnCdTpCd: item.varTpCd || item.rewSectnCdTpCd,
                    rewSectnCd: item.varKey || item.rewSectnCd,
                    rewReltCd: item.checkFlg ? "0" : "1",
                };
            });
            await this.rpc.assetList.submitSingleContentReviewResult({
                examId: this.examId,
                fnctId: this.fnctId,
                contId: this.activeD2Event.dataId,
                parntContId: this.activeD2Event.parent.dataId,
                contNm: this.activeD2Event.label,
                rewReltCd: rewReltCd,
                contTpCd: "04",
                systemDesignReviewContentDetailRecordList: list,
            });
            this.$notify({
                title: "成功",
                message: "确认成功",
                duration: 2000,
                type: "success",
            });
            // rewReltCd 更改对应节点的状态
            this.closeReview();
            this.$set(this.activeD2Event, "list", data);
            this.$set(this.activeD2Event, "rewReltCd", rewReltCd);
            this.treeEventList.forEach((i) => {
                if (i.dataId == this.activeD2Event.dataId) {
                    this.$set(i, "rewReltCd", rewReltCd);
                }
            });
        },

        checkYSStatus(data) {
            if (data.dataType == "YS") {
                if (data.children.length) {
                    const un_reviews = data.children.filter(
                        (i) => i.rewReltCd == "2"
                    );
                    if (un_reviews.length) {
                        return "2";
                    }
                    const error_reviews = data.children.filter(
                        (i) => i.rewReltCd == "1"
                    );
                    if (error_reviews.length) {
                        return "1";
                    } else {
                        return "0";
                    }
                } else {
                    return "0";
                }
            } else {
                return "0";
            }
        },
        checkNodeStatus(node, data) {
            if (data.dataType == "SJ") {
                return data.rewReltCd;
            } else {
                if (data.dataType == "YM") {
                    // 如果没有子节点，success
                    if (data.children.length) {
                        const ys_status = data.children.map((i) =>
                            this.checkYSStatus(i)
                        );
                        const pending_status = ys_status.filter(
                            (i) => i == "2"
                        );
                        if (pending_status.length) {
                            return "2";
                        } else {
                            const err_status = ys_status.filter(
                                (i) => i == "1"
                            );
                            if (err_status.length) {
                                return "1";
                            } else {
                                return "0";
                            }
                        }
                    } else {
                        return "0";
                    }
                } else {
                    return this.checkYSStatus(data);
                }
            }
        },
        async init() {
            const query = this.$route.query;
            this.fnctId = query.fnctId;
            this.examId = query.examId;

            // 查基本数据
            await this.queryFunctionRelInfo();
            await this.getTree("C3");
            await this.getTree("D2");
            this.d2ComponentProps = {
                modelVersion: this.modelVersionD2,
                isolateWorkspace: "D2",
                functionId: this.functionId,
                fnctId: this.fnctId,
                examId: this.examId,
            };
            this.c3ComponentProps = {
                modelVersion: this.modelVersionC3,
                isolateWorkspace: "C3",
                functionId: this.functionId,
                fnctId: this.fnctId,
                examId: this.examId,
            };
        },
        async modelVersionC3Change() {
            await this.getTree("C3");
            this.c3ComponentProps.modelVersion = this.modelVersionC3;
        },
        // 通过功能 id 查功能详情
        async queryFunctionRelInfo() {
            const res = await this.rpc.businessRules.queryFunctionRelInfo({
                examId: this.examId,
                fnctId: this.fnctId,
                queryTpCd: "02",
            });
            this.functionId = res.fnctNo;
            this.modelVersionC3 = res.chnlAppInfoList[0].jobNo;
            this.modelVersionD2 = res.fnctVerNo;
            this.chnlAppInfoList = res.chnlAppInfoList;
            this.fnctNm = res.fnctNm;
        },

        // 查询 D2|C3 页面-要素-事件
        async getTree(isolateWorkspace) {
            const res = await this.rpc.businessRules.getTreeData({
                functionId: this.functionId,
                isolateWorkspace: isolateWorkspace,
                modelVersion:
                    isolateWorkspace == "D2"
                        ? this.modelVersionD2
                        : this.modelVersionC3,
                eventName: "",
            });
            if (res) {
                let {
                    treeLayoutList = [],
                    treeLayoutElementRelList = [],
                    treeEventList = [],
                } = res;

                // 页面
                if (Array.isArray(treeLayoutList) && treeLayoutList.length) {
                    treeLayoutList = treeLayoutList.map((l) => {
                        return {
                            label: l.layoutName,
                            dataType: "YM",
                            dataId: l.layoutId,
                            functionId: this.functionId,
                            children: [],
                            isLeaf: false,
                        };
                    });
                }
                // 要素
                if (
                    Array.isArray(treeLayoutElementRelList) &&
                    treeLayoutElementRelList.length
                ) {
                    treeLayoutElementRelList = treeLayoutElementRelList.map(
                        (ele) => {
                            return {
                                label: ele.elementName,
                                dataType: "YS",
                                dataId: ele.elementId,
                                layoutId: ele.layoutId,
                                children: [],
                                isLeaf: false,
                            };
                        }
                    );
                }
                // 事件
                if (Array.isArray(treeEventList) && treeEventList.length) {
                    if (isolateWorkspace == "D2") {
                        const review_res =
                            await this.rpc.businessRules.querySystemDesignReviewContent(
                                {
                                    examId: this.examId,
                                    fnctId: this.fnctId,
                                }
                            );
                        review_res.systemDesignReviewContentRecordList.forEach(
                            (item) => {
                                treeEventList.forEach((event) => {
                                    if (item.contId === event.d4iId) {
                                        event.list =
                                            item.systemDesignReviewContentDetailRecordList;
                                        event.rewReltCd = item.rewReltCd;
                                    }
                                });
                            }
                        );
                    }

                    treeEventList = treeEventList.map((eve) => {
                        return {
                            label: eve.d4iName,
                            dataType: "SJ",
                            dataId: eve.d4iId,
                            isLeaf: false, // C3 下级还有接口/服务
                            relType: eve.relType,
                            elementId: eve.elementId,
                            layoutId: eve.layoutId,
                            children: [],
                            eventName: eve.eventName,
                            d4iDesc: eve.d4iDesc,
                            componentId: eve.componentId,
                            componentName: eve.componentName,
                            componentTypeName: eve.componentTypeName,
                            rewReltCd: eve.rewReltCd || "2",
                            list: eve.list || [],
                        };
                    });
                }

                // 拼接树
                // 要素
                treeLayoutElementRelList.forEach((ele) => {
                    treeLayoutList.forEach((lay) => {
                        if (lay.dataId == ele.layoutId) {
                            lay.children.push(ele);
                        }
                    });
                });
                // 事件
                treeEventList.forEach((eve) => {
                    if (eve.relType == "00") {
                        // 要素下的事件
                        treeLayoutElementRelList.forEach((ele) => {
                            if (ele.dataId == eve.elementId) {
                                // 补全页面id
                                eve.layoutId = ele.layoutId;
                                ele.children.push(eve);
                            }
                        });
                    }
                    if (eve.relType == "01") {
                        // 页面下的事件
                        treeLayoutList.forEach((lay) => {
                            if (lay.dataId == eve.layoutId) {
                                lay.children.push(eve);
                            }
                        });
                    }
                });

                this.treeEventList = treeEventList;

                treeLayoutList = JSON.parse(JSON.stringify(treeLayoutList));
                treeLayoutList.forEach((lay) => {
                    lay.id = _.uniqueId();
                    if (Array.isArray(lay.children) && lay.children.length) {
                        lay.children.forEach((ele) => {
                            ele.id = _.uniqueId();
                            ele.parent = lay;
                            if (
                                Array.isArray(ele.children) &&
                                ele.children.length
                            ) {
                                ele.children.forEach((eve) => {
                                    eve.id = _.uniqueId();
                                    eve.parent = ele;
                                });
                            }
                        });
                    }
                });
                let treeData = treeLayoutList;
                console.log("treeLayoutList", treeLayoutList);
                // 展开 D2 第一个元素
                if (treeData.length && isolateWorkspace == "D2") {
                    this.firstExpendNodeIds.push(treeData[0].id);
                    let first_children = treeData[0].children;
                    if (
                        Array.isArray(first_children) &&
                        first_children.length
                    ) {
                        this.firstExpendNodeIds.push(first_children[0].id);
                        let second_children = first_children[0].children;
                        if (
                            Array.isArray(second_children) &&
                            second_children.length
                        ) {
                            this.firstExpendNodeIds.push(second_children[0].id);
                            this.setActive(second_children[0]);
                        } else {
                            this.setActive(first_children[0]);
                        }
                    } else {
                        this.setActive(treeData[0]);
                    }
                }
                if (isolateWorkspace == "D2") {
                    this.treeDataD2 = treeData;
                } else if (isolateWorkspace == "C3") {
                    this.treeDataC3 = treeData;
                }
            } else {
                if (isolateWorkspace == "D2") {
                    this.treeDataD2 = [];
                } else if (isolateWorkspace == "C3") {
                    this.treeDataC3 = [];
                }
                this.firstExpendNodeIds = [];
            }
        },
        // 通过事件查接口
        async getInterfaceList(type, eleLayId, componentId) {
            let list = [];
            const res = await this.rpc.businessRules.interfaceList({
                admiId: this.functionId,
                eleLayId: eleLayId,
                isolateWorkspace: "C3",
                modelVersion: this.modelVersionC3,
                type: type,
                currentPage: 1,
                turnPageShowNum: 999,
            });
            if (Array.isArray(res.apiInfoLists)) {
                list = res.apiInfoLists
                    .filter((i) => i.alsrCnptId == componentId)
                    .map((l) => {
                        return {
                            label: l.apiName,
                            dataType: "JK",
                            dataId: l.apiId,
                            id: l.apiId,
                            children: [],
                        };
                    });
            }
            return list;
        },
        // 通过接口查服务
        async getService(interfaceId) {
            let list = [];
            const res = await this.rpc.businessRules.queryD4UseL5SvcPage({
                apiId: interfaceId,
                content: "",
                turnPageShowNum: 999,
            });
            if (Array.isArray(res.apiInfoList)) {
                list = res.apiInfoList.map((l) => {
                    return {
                        label: l.apiName,
                        dataType: "FW",
                        dataId: l.apiId,
                        id: l.apiId,
                        children: [],
                        isLeaf: true,
                    };
                });
            }
            return list;
        },
        async loadNodeC3(node, resolve) {
            if (node.level === 0) {
                return resolve(this.treeDataC3);
            }
            if (node.data.dataType === "YM" || node.data.dataType == "YS") {
                return resolve(node.data.children);
            }
            if (node.data.dataType == "SJ") {
                // 查事件下的接口
                const type = node.parent.data.dataType == "YS" ? "00" : "01";
                const interfaceList = await this.getInterfaceList(
                    type,
                    node.parent.data.dataId,
                    node.data.componentId
                );
                return resolve(interfaceList);
            }
            if (node.data.dataType == "JK") {
                // 查接口下的服务
                const serviceList = await this.getService(node.data.dataId);
                return resolve(serviceList);
            }
        },

        // 点击 D2
        clickNode(data, node, ele) {
            this.setActive(data);
        },
        // 点击 C3
        clickNodeC3(data, node, ele) {
            this.setActiveC3(data);
        },

        // 选中 D2
        setActive(nodeData) {
            this.activeComponentD2 = "";
            this.$nextTick(() => {
                this.$refs.d2Tree.setCurrentKey(nodeData.id);
                this.setActiveComponent("D2", nodeData);

                this.setActiveC3ByD2(nodeData.dataType, nodeData.dataId);
            });
        },
        setActiveC3(nodeData) {
            this.activeComponentC3 = "";
            this.$nextTick(() => {
                this.$refs.c3Tree.setCurrentKey(nodeData.id);
                this.setActiveComponent("C3", nodeData);

                this.setActiveD2ByC3(nodeData.dataType, nodeData.dataId);
            });
        },
        setActiveComponent(isolateWorkspace, nodeData) {
            if (isolateWorkspace == "C3") {
                this.activeComponentC3 = "";
                this.$nextTick(() => {
                    switch (nodeData.dataType) {
                        case "YM":
                            Object.assign(this.c3ComponentProps, {
                                layoutId: nodeData.dataId,
                            });
                            this.activeComponentC3 = "pagePreview";
                            break;
                        case "YS":
                            Object.assign(this.c3ComponentProps, {
                                elementId: nodeData.dataId,
                            });
                            this.activeComponentC3 = "elePreview";
                            break;
                        case "SJ":
                            Object.assign(this.c3ComponentProps, {
                                ...this.c3ComponentProps,
                                layoutId: nodeData.layoutId,
                                eleLayId:
                                    nodeData.elementId || nodeData.layoutId,
                                d4iName: nodeData.label,
                                d4iId: nodeData.dataId,

                                relType: nodeData.relType,
                            });
                            this.activeComponentC3 = "eventC3";
                            break;
                        case "JK":
                            Object.assign(this.c3ComponentProps, {
                                ...this.c3ComponentProps,
                                apiId: nodeData.dataId,
                            });
                            this.activeComponentC3 = "interfaceDetail";
                            break;
                        case "FW":
                            Object.assign(this.c3ComponentProps, {
                                ...this.c3ComponentProps,
                                apiId: nodeData.dataId,
                            });
                            this.activeComponentC3 = "serviceConfirm";
                            break;
                    }
                });
            } else if (isolateWorkspace == "D2") {
                this.activeComponentD2 = "";
                this.$nextTick(() => {
                    switch (nodeData.dataType) {
                        case "YM":
                            Object.assign(this.d2ComponentProps, {
                                layoutId: nodeData.dataId,
                            });
                            this.activeComponentD2 = "pagePreview";
                            this.activeD2Event = {};
                            break;
                        case "YS":
                            Object.assign(this.d2ComponentProps, {
                                elementId: nodeData.dataId,
                            });
                            this.activeComponentD2 = "elePreview";
                            this.activeD2Event = {};
                            break;
                        case "SJ":
                            Object.assign(this.d2ComponentProps, {
                                ...this.d2ComponentProps,
                                layoutId: nodeData.layoutId,
                                eleLayId:
                                    nodeData.elementId || nodeData.layoutId,
                                d4iName: nodeData.label,
                                d4iId: nodeData.dataId,

                                d4iDesc: nodeData.d4iDesc,
                                componentId: nodeData.componentId,
                                componentName: nodeData.componentName,
                                componentTypeName: nodeData.componentTypeName,
                                eventName: nodeData.eventName,

                                relType: nodeData.relType,
                            });
                            this.activeD2Event = nodeData;
                            this.activeComponentD2 = "eventD2";
                    }
                });
            }
        },
        // 通过 C3 反选 D2
        setActiveD2ByC3(dataType, dataId) {
            // 在 treeDataD2 中找到对应的树节点
            const _node = this.findNode(dataType, dataId, this.treeDataD2);
            if (_node) {
                // 把 _node 的 parent 都展开
                if (_node.parent) {
                    this.firstExpendNodeIds.push(_node.parent.id);
                    if (_node.parent.parent) {
                        this.firstExpendNodeIds.push(_node.parent.parent.id);
                    }
                }
                this.$nextTick(() => {
                    this.$refs.d2Tree.setCurrentKey(_node.id);

                    this.setActiveComponent("D2", _node);
                });
            }
        },
        // 通过 D2 选中 C3
        setActiveC3ByD2(dataType, dataId) {
            // 在 treeDataC3 中找到对应的树节点
            const _node = this.findNode(dataType, dataId, this.treeDataC3);
            if (_node) {
                // 把 _node 的 parent 都展开
                if (_node.parent) {
                    this.firstExpendNodeIdsC3.push(_node.parent.id);
                    if (_node.parent.parent) {
                        this.firstExpendNodeIdsC3.push(_node.parent.parent.id);
                    }
                }
                this.$nextTick(() => {
                    this.$refs.c3Tree.setCurrentKey(_node.id);
                    this.setActiveComponent("C3", _node);
                });
            }
        },
        findNode(dataType, dataId, tree) {
            for (let node of tree) {
                if (node.dataType == dataType && node.dataId == dataId) {
                    return node;
                }
                if (Array.isArray(node.children) && node.children.length) {
                    const foundNode = this.findNode(
                        dataType,
                        dataId,
                        node.children
                    );
                    if (foundNode) {
                        return foundNode;
                    }
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "./index.scss";
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
</style>
