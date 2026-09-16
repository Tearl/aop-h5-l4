<template>
    <div class="business-rules-container">
        <PageHeader :breadcrumbs="breadcrumbs" @labelClick="labelClick">
            <div slot="btn" name="btn" class="btn_all_list">
                <el-select
                    v-model="modelVersion"
                    size="mini"
                    class="hide-input-select"
                >
                    <el-option
                        v-for="item in chnlAppInfoList"
                        :key="item.jobNo"
                        :label="item.appNm"
                        :value="item.jobNo"
                    >
                    </el-option>
                </el-select>
                <el-button
                    type="primary"
                    :disabled="!(activeData.dataType === 'SJ')"
                    size="mini"
                    @click="handleDesignCommit"
                    >设计确认</el-button
                >
                <el-button type="primary" size="mini" @click="handleDesign"
                    >提交</el-button
                >
            </div>
        </PageHeader>
        <el-container v-loading="pageLoading">
            <!-- 【页面-要素-事件】树 -->
            <el-aside width="260px">
                <p>业务需求</p>
                <div class="side-tree">
                    <el-tree
                        class="tree-list"
                        :data="treeData"
                        :props="defaultProps"
                        ref="tree"
                        node-key="dataId"
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
                            <img
                                class="mgr6"
                                :src="require('@m/assets/images/icon_ok.png')"
                                alt=""
                                v-if="
                                    data.rewReltCd === '0' ||
                                    (!data.children.length &&
                                        data.dataType !== 'SJ') ||
                                    showOK(data)
                                "
                            />
                            <img
                                class="mgr6"
                                :src="require('@m/assets/images/icon_no.png')"
                                alt=""
                                v-else-if="
                                    data.rewReltCd == '1' || showNo(data)
                                "
                            />
                            <img
                                class="mgr6"
                                :src="
                                    require('@m/assets/images/icon_execute.png')
                                "
                                alt=""
                                v-else
                            />

                            <Tag :dataType="data.dataType" />
                            <span class="label-block">
                                <span>{{ node.label }}</span>
                            </span>
                        </span>
                    </el-tree>
                </div>
            </el-aside>
            <el-aside width="260px">
                <p>设计实现</p>
                <div class="side-tree">
                    <el-tree
                        class="tree-list"
                        :data="newTreeData"
                        :props="defaultProps"
                        node-key="dataId"
                        @node-click="clickNodeNew"
                        :indent="10"
                        lazy
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :load="loadNode"
                    >
                        <span
                            class="custom-tree-node"
                            slot-scope="{ node, data }"
                        >
                            <img
                                v-if="
                                    showTip(data) ||
                                    showTipYm(data) ||
                                    showTipYs(data)
                                "
                                :src="img"
                                class="custom-tree-node_icon"
                            />
                            <Tag :dataType="data.dataType" />
                            <span class="label-block">
                                <span>{{ node.label }}</span>
                            </span>
                        </span>
                    </el-tree>
                    <!-- <el-tree
                    :props="props"
                    :load="loadNode"
                    lazy
                    show-checkbox>
                    </el-tree> -->
                </div>
            </el-aside>
            <!-- 展示面板 -->
            <el-main
                v-loading="componentLoading"
                class="business-rules-container-main"
            >
                <!-- 页面、要素，预览面板 -->
                <component
                    class="content-wrapper"
                    :is="activeContentComponent"
                    :ref="activeContentComponent"
                    :attrs="contentComponentProps"
                    :eventInfoProps="eventInfoProps"
                    @removeComponentLoading="removeComponentLoading"
                    v-if="activeContentComponent !== 'interfaceConfirm'"
                ></component>
                <InterfaceDetail
                    :sendApiId="apiId"
                    v-if="activeContentComponent === 'interfaceConfirm'"
                    :showHeader="false"
                ></InterfaceDetail>
                <!-- 事件面板 -->
            </el-main>
            <DesignDialog
                @checkSystemDesign="handleCommit"
                ref="designDialog"
                :dialogVisible="dialogVisible"
            >
            </DesignDialog>
            <submitDialog
                v-if="visibleDialog"
                @closeSubmitDialog="hideSubmitDialog"
                @finishSubmit="finishSubmit"
                :showSubmitDialog="visibleDialog"
                :examId="orderDetail.examId"
                :fnctId="orderDetail.fnctId"
                :fnctNm="fnctNm"
            ></submitDialog>
        </el-container>
    </div>
</template>
<script>
import PageHeader from "@m/core/components/page_header";
import mixin from "@m/core/mixin";
import Tag from "./Tag.vue";
import pagePreview from "./pagePreview.vue"; // 页面预览
import elePreview from "./elePreview.vue"; // 要素预览
import eventInfo from "./eventInfoDetail.vue";
import InterfaceDetail from "../../../interfaceDetail";
import DesignDialog from "../designDialog/index";
import serviceConfirm from "./serviceConfirm.vue";
import submitDialog from "./submitDialog.vue";
export default {
    mixins: [mixin],
    props: {
        functionId: "",
        isolateWorkspace: "",
        modelVersion: "",
        modelVersion2: "",
        assetId: "",
        projectId: "",
        // 选择接口参数
        formB: {
            type: Object,
            default: () => {
                return {};
            },
        },
        dialogVisible: false,
    },
    provide() {
        return {
            formB: this.formB,
        };
    },
    components: {
        Tag,
        pagePreview,
        elePreview,
        eventInfo,
        PageHeader,
        InterfaceDetail,
        DesignDialog,
        serviceConfirm,
        submitDialog,
    },
    data() {
        return {
            pageLoading: false,
            componentLoading: false,

            activeContentComponent: "",
            contentComponentProps: {},
            eventInfoProps: {},
            // tree
            keyword: "",
            treeData: [],
            newTreeData: [],
            firstExpendNodeIds: [],
            currentSelectNode: null,
            initFinish: false,
            props: {
                label: "name",
                children: "zones",
                isLeaf: "leaf",
            },
            defaultProps: {
                id: "id",
                children: "children",
                label: "label",
                dataType: "dataType",
                dataId: "dataId",
                status: "status",
                isLeaf: "isLeaf",
                rewReltCd: "rewReltCd",
            },
            breadcrumbs: [
                {
                    label: "系统设计评审",
                    operate: "back",
                },
            ],
            chnlAppInfoList: [],
            reviewProps: {},
            visibleDialog: false,
            apiId: "",
            activeData: {},
            treeEventList: [],
            dataMap: {},
            orderDetail: {},
            img: require("@m/assets/images/cc-arrow-circle-right.png"),
            fnctNm: "",
        };
    },
    async created() {
        // 通过功能id先查询功能编号+版本(作业号)
        const res = await this.rpc.businessRules.queryFunctionRelInfo({
            fnctId: this.$route.query.fnctId,
        });
        this.functionId = res.fnctNo;
        this.modelVersion = res.fnctVerNo;
        this.fnctNm = res.fnctNm;

        this.contentComponentProps = {
            modelVersion: this.modelVersion,
            isolateWorkspace: "D2",
            functionId: res.fnctNo,
            projectId: this.projectId,
            fnctId: this.$route.query.fnctId,
            examId: this.examId,
        };
        this.orderDetail = this.$route.query;
        await this.queryFunctionRelInfo();
    },
    watch: {
        modelVersion() {
            this.init();
        },
        async newTreeData() {
            const data = this.activeData;
            if (
                data &&
                this.dataMap[data?.parent?.dataId] &&
                this.newTreeData.length
            ) {
                const res = await this.rpc.businessRules.serachEventConnect({
                    functionId: this.$route.query.fnctNo,
                    isolateWorkspace: "C3",
                    modelVersion: this.modelVersion,
                    elementId: data.parent.dataId,
                });
                res.list.map((item) => {
                    this.dataMap[data.parent.dataId] =
                        item.d4BusinessRel + "|" + item.d4iId;
                });
            }
        },
    },
    methods: {
        showSubmitDialog() {
            this.visibleDialog = true;
        },
        hideSubmitDialog() {
            this.visibleDialog = false;
        },
        finishSubmit(names, userNos) {
            this.rpc.businessRules
                .submitFinalReviewResult({
                    // assetNo: this.assetId,
                    examId: this.orderDetail.examId,
                    fnctId: this.orderDetail.fnctId,
                    rewrNm: names,
                    rewrNo: userNos,
                })
                .then(() => {
                    this.$router.push({
                        path: "/aop_endentry/systemDesign/home",
                    });
                    this.$message({
                        type: "success",
                        message: "提交成功",
                    });
                    // this.visibleDialog = false;
                });
        },
        showNo(data) {
            if (data.dataType === "YM") {
                console.log(9999999999);

                console.log(data, "ssssssssss");
                if (data.children.length > 0) {
                    const children = data.children;
                    // 要素
                    for (let index = 0; index < children?.length; index++) {
                        const item = children[index];
                        if (item.children?.length > 0) {
                            for (let j = 0; j < item.children?.length; j++) {
                                const result = item.children[j];
                                if (
                                    result.rewReltCd === "0" ||
                                    !result.rewReltCd
                                ) {
                                    console.log(result, result);
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            } else if (data.dataType === "YS") {
                const children = data.children;
                console.log(232222);
                for (let j = 0; j < children?.length; j++) {
                    const result = children[j];
                    console.log(111111111, "11111111");
                    if (result.rewReltCd === "0" || !result.rewReltCd) {
                        console.log(result, result);
                        return false;
                    }
                }
                return true;
            }
        },
        showOK(data) {
            if (data.dataType === "YM") {
                if (data.children.length > 0) {
                    const children = data.children;
                    // 要素
                    for (let index = 0; index < children?.length; index++) {
                        const item = children[index];

                        if (item.children?.length > 0) {
                            for (let j = 0; j < item.children?.length; j++) {
                                const result = item.children[j];
                                if (
                                    result.rewReltCd === "1" ||
                                    !result.rewReltCd
                                ) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            } else if (data.dataType === "YS") {
                const children = data.children;
                for (let j = 0; j < children?.length; j++) {
                    const result = children[j];
                    if (result.rewReltCd === "1" || !result.rewReltCd) {
                        console.log(result, result);
                        return false;
                    }
                }
                return true;
            }
        },
        async init() {
            // this.contentComponentProps = {
            //     assetId: this.assetId,
            //     modelVersion: this.modelVersion,
            //     isolateWorkspace: this.isolateWorkspace,
            //     functionId: this.functionId,
            //     projectId: this.projectId,
            // };
            this.newTreeData = await this.getPages(this.$route.query.fnctNo);
            const res =
                await this.rpc.businessRules.querySystemDesignReviewContent({
                    examId: this.$route.query.examId,
                    fnctId: this.$route.query.fnctId,
                });
            res.systemDesignReviewContentRecordList.forEach((item) => {
                this.treeEventList.forEach((event) => {
                    if (item.contId === event.id) {
                        event.list =
                            item.systemDesignReviewContentDetailRecordList;
                        event.rewReltCd = item.rewReltCd;
                    }
                });
            });
            console.log(this.treeEventList, "Event");
        },
        async queryFunctionRelInfo() {
            const res = await this.rpc.businessRules.queryFunctionRelInfo({
                examId: this.$route.query.examId,
                fnctId: this.$route.query.fnctId,
                queryTpCd: "02",
            });
            this.modelVersion = res.chnlAppInfoList[0].jobNo;
            this.modelVersion2 = res.fnctVerNo;
            this.chnlAppInfoList = res.chnlAppInfoList;
            this.getTreeData("D2", "treeData");
            this.init();
        },
        async loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.treeData);
            }
            console.log(resolve);
            if (node.data.dataType === "GN") {
                // 查询功能下的页面
                const pages = await this.getPages(
                    node.data.dataId,
                    node.data.functionInfo
                );
                // 查功能下的页面的评审状态
                const list = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    pages
                );
                return resolve(list);
            }
            if (node.data.dataType === "YM") {
                // 查询页面下的要素
                const eleList = await this.getEleList(
                    node.data.dataId,
                    node.data.functionId,
                    node.data.functionInfo
                );
                // 查询页面下的事件
                const eventList = await this.getEventList(
                    "01",
                    node.data.dataId,
                    node.data.functionId,
                    node.data.dataId,
                    node.data.functionInfo
                );
                const list1 = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    eleList
                );
                const list2 = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    eventList
                );
                return resolve(list1.concat(list2));
            }
            if (node.data.dataType == "YS") {
                // 查要素下的事件
                const eventList = await this.getEventList(
                    "00",
                    node.data.dataId,
                    node.data.functionId,
                    node.data.layoutId,
                    node.data.functionInfo
                );

                const list = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    eventList
                );
                console.log(list, "listssss");
                return resolve(list);
            }
            if (node.data.dataType == "SJ") {
                // 查事件下的接口
                const type = node.parent.data.dataType == "YS" ? "00" : "01";
                const interfaceList = await this.getInterfaceList(
                    node.data.dataId,
                    type,
                    node.parent.data.dataId,
                    node.data.componentId,
                    node.data.functionId,
                    node.data.functionInfo
                );
                const list = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    interfaceList
                );
                console.log(list, "listsss");
                return resolve(list);
            }
            if (node.data.dataType == "JK") {
                // 查接口下的服务
                const serviceList = await this.getService(
                    node.data.dataId,
                    node.data.functionId
                );
                const list = await this.querySystemDesignReviewContentSub(
                    node.data.dataId,
                    serviceList
                );
                return resolve(list);
            }
            if (node.data.dataType == "FW") {
                return resolve([]);
            }
        },
        // 部分评审查询
        async querySystemDesignReviewContentSub(parntContId, contentList) {
            if (this.pageMode != "review") {
                return contentList;
            }
            const res =
                await this.rpc.businessRules.querySystemDesignReviewContent({
                    assetNo: this.assetId,
                    parntContId,
                });
            if (Array.isArray(res.systemDesignReviewContentRecordList)) {
                let statusList = new Map();
                res.systemDesignReviewContentRecordList.forEach((i) => {
                    statusList[i.contId] = i.rewReltCd;
                });
                let formatContentList = contentList.map((t) => {
                    let s = statusList[t.dataId];
                    return {
                        ...t,
                        status:
                            s == "1"
                                ? "error"
                                : s == "0"
                                ? "success"
                                : "warning",
                    };
                });
                return formatContentList;
            }
        },
        // 功能查页面
        async getPages(functionId, functionInfo) {
            const res = await this.rpc.businessRules.layoutList({
                admiId: functionId,
                isolateWorkspace: "C3",
                modelVersion: this.modelVersion,
                currentPage: 1,
                turnPageShowNum: 999,
            });
            if (Array.isArray(res.list)) {
                return res.list.map((l) => {
                    return {
                        label: l.layoutName,
                        dataType: "YM",
                        dataId: l.layoutId,
                        functionId: functionId,
                        functionInfo: functionInfo,
                        parentId: functionId,
                        id: l.layoutId,
                        status: "warning",
                        children: [],
                        // isLeaf: true,
                    };
                });
            } else {
                return [];
            }
        },
        // 页面查要素
        async getEleList(layoutId, functionId, functionInfo) {
            let eleList = [];
            const res = await this.rpc.businessRules.eleList({
                admiId: this.$route.query.fnctNo,
                isolateWorkspace: "C3",
                modelVersion: this.modelVersion,
                layoutId: layoutId,
            });
            console.log(4444444);
            if (res.content) {
                const content = JSON.parse(res.content);
                if (content.view && Array.isArray(content.view.components)) {
                    eleList = content.view.components
                        .filter((i) => i.kind == "YS")
                        .map((e) => {
                            return {
                                label: e.name,
                                dataType: "YS",
                                dataId: e.className,
                                layoutId: layoutId,
                                id: e.className,
                                componentId: e.componentId,
                                functionId: functionId,
                                functionInfo: functionInfo,
                                parentId: layoutId,
                                status: "warning",
                                children: [],
                            };
                        });
                }
            }
            return eleList;
        },
        // 页面 | 要素 查事件, type: 页面01, 要素00
        async getEventList(type, eleLayId, functionId, layoutId, functionInfo) {
            let eventList = [];
            const res = await this.rpc.businessRules.eventList({
                admiId: this.$route.query.fnctNo,
                eleLayId: eleLayId,
                isolateWorkspace: "C3",
                modelVersion: this.modelVersion,
                type: type,
                currentPage: 1,
                turnPageShowNum: 999,
                name: "",
            });
            if (Array.isArray(res.list)) {
                eventList = res.list.map((e) => {
                    return {
                        label: e.d4iName,
                        dataType: "SJ",
                        dataId: `${e.eventType}|${e.d4iId}`,
                        id: `${e.eventType}|${e.d4iId}`,
                        componentId: e.componentId,
                        functionId: functionId,
                        functionInfo: functionInfo,
                        layoutId: layoutId,
                        parentId: eleLayId,
                        status: "warning",
                        children: [],
                    };
                });
            }
            return eventList;
        },
        // 事件查接口
        async getInterfaceList(
            eventId,
            type,
            eleLayId,
            componentId,
            functionId,
            functionInfo
        ) {
            let list = [];
            const res = await this.rpc.businessRules.interfaceList({
                admiId: this.$route.query.fnctNo,
                eleLayId: eleLayId,
                isolateWorkspace: "C3",
                modelVersion: this.modelVersion,
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
                            functionId: functionId,
                            functionInfo: functionInfo,
                            parentId: eventId,
                            id: l.apiId,
                            status: "warning",
                            children: [],
                        };
                    });
            }
            return list;
        },
        // 接口查服务
        async getService(interfaceId, functionId) {
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
                        parentId: interfaceId,
                        functionId: functionId,
                        id: l.apiId,
                        status: "warning",
                        children: [],
                        isLeaf: true,
                    };
                });
            }
            return list;
        },
        async getSingleData() {
            const res = await this.rpc.assetList.querySingleContentReviewResult(
                {
                    examId: this.$route.query.examId,
                    fnctId: this.$route.query.fnctId,
                    contTpCd: "04",
                    // 内容类型代码
                    // 父内容ID	parntContId
                    // 内容ID	contId
                }
            );
        },
        // 检查是否全部处理
        checkAllFlg(arr) {
            let newArr = [];
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                for (let j = 0; j < item.children.length; j++) {
                    const data = item.children[j];
                    newArr.push(data);
                }
            }
            for (let i = 0; i < newArr.length; i++) {
                const item = newArr[i];
                if (!item.status) {
                    return true;
                }
            }
            return false;
        },
        async handleCommit(data) {
            // systemDesignReviewContentDetailRecordList:
            console.log(data, "datadata");
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
            const res =
                await this.rpc.assetList.submitSingleContentReviewResult({
                    examId: this.$route.query.examId,
                    fnctId: this.$route.query.fnctId,
                    contId: this.activeData.id,
                    parntContId: this.activeData.parent.id,
                    contNm: this.activeData.label,
                    rewReltCd: rewReltCd,
                    // contNm: this.activeData.
                    // 资产编号	assetNo
                    // 内容类型代码	contTpCd
                    // 父内容ID	parntContId
                    // 内容ID	contId
                    // 内容名称	contNm
                    // 评审结果代码	rewReltCd
                    // 系统设计评审内容明细记录列表-start	systemDesignReviewContentDetailRecordList
                    // 评审项代码类型代码	rewSectnCdTpCd
                    // 评审项代码	rewSectnCd
                    // 评审结果代码	rewReltCd
                    // 评审意见	rewOpinion
                    // 系统设计评审内容明细记录列表-end	systemDesignReviewContentDetailRecordList
                    contTpCd: "04",
                    systemDesignReviewContentDetailRecordList: list,
                });
            this.$notify({
                title: "成功",
                message: "保存成功",
                duration: 2000,
                type: "success",
            });
            this.activeData = {};
            this.getTreeData("D2", "treeData");
            this.init();
        },
        clickNewNode(data) {
            if (data.dataType === "SJ") {
                this.getInterfaceList({
                    functionId: this.$route.query.fnctId,
                    type: "00",
                    elelayId: data.parent.id,
                    componentId: data.id,
                    eventId: data.dataId,
                });
            }
        },
        // eventListByEle[0].dataId,
        // "00",
        // eleList[0].dataId,
        // eventListByEle[0].componentId,
        // eventListByEle[0].functionId,
        // eventListByEle[0].functionInfo
        // 事件查接口
        // eleLayId要素id
        open() {
            this.$confirm(
                "请将黄色感叹号标注的内容全部评审完成，再进行提交。",
                "提示",
                {
                    confirmButtonText: "确定",
                    type: "warning",
                }
            )
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        async handleDesign() {
            // console.log(this.treeEventList)
            // return
            let status = false;
            this.treeEventList.forEach((item) => {
                if (!item.rewReltCd) {
                    status = true;
                }
            });
            if (status) {
                this.$confirm(
                    "请将黄色感叹号标注的内容全部评审完成，再进行提交。",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        type: "warning",
                    }
                );
                return true;
            }
            this.showSubmitDialog();
        },
        async handleDesignCommit() {
            this.$refs.designDialog.showDialog(this.activeData.list);
            this.dialogVisible = true;
        },
        async getTreeData(type, key) {
            const res = await this.rpc.businessRules.getTreeData({
                functionId: this.$route.query.fnctNo,
                isolateWorkspace: type,
                modelVersion: this.modelVersion2,
            });
            const res2 =
                await this.rpc.businessRules.querySystemDesignReviewContent({
                    examId: this.$route.query.examId,
                    fnctId: this.$route.query.fnctId,
                });

            if (res) {
                let {
                    treeLayoutList = [],
                    treeLayoutElementRelList = [],
                    treeEventList = [],
                } = res;
                // 页面
                res2.systemDesignReviewContentRecordList.forEach((item) => {
                    treeEventList.forEach((event) => {
                        console.log(event, item, "event item");
                        if (item.contId === event.d4iId) {
                            event.list =
                                item.systemDesignReviewContentDetailRecordList;
                            event.rewReltCd = item.rewReltCd;
                        }
                    });
                });
                if (Array.isArray(treeLayoutList) && treeLayoutList.length) {
                    treeLayoutList = treeLayoutList.map((l) => {
                        return {
                            label: l.layoutName,
                            dataType: "YM",
                            dataId: l.layoutId,
                            functionId: this.functionId,
                            id: l.layoutId,
                            children: [],
                            status: false,
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
                                id: ele.elementId,
                                children: [],
                                isLeaf: false,
                            };
                        }
                    );
                }
                // 事件
                if (Array.isArray(treeEventList) && treeEventList.length) {
                    treeEventList = treeEventList.map((eve) => {
                        return {
                            label: eve.eventName,
                            dataType: "SJ",
                            dataId: eve.d4iId,
                            id: eve.d4iId,
                            relType: eve.relType,
                            elementId: eve.elementId,
                            layoutId: eve.layoutId,
                            children: [],
                            isLeaf: false,
                            status: false,
                            rewReltCd: eve.rewReltCd,
                            list: eve.list || [],
                            // 单独的event
                        };
                    });
                    console.log(
                        "--------------------------------",
                        treeEventList
                    );
                }

                // 拼接树
                // 事件
                treeEventList.forEach((eve) => {
                    if (eve.relType == "00") {
                        // 要素下的事件
                        treeLayoutElementRelList.forEach((ele) => {
                            if (ele.dataId == eve.elementId) {
                                // 补全页面id
                                eve.layoutId = ele.layoutId;
                                ele.children.push(eve);
                                eve.parent = ele;
                            }
                            // 看不懂，为什么写一个 ele.rewReltCd 在这啥也不干？
                            // ele.rewReltCd
                        });
                    }
                    if (eve.relType == "01") {
                        // 页面下的事件
                        treeLayoutList.forEach((lay) => {
                            if (lay.dataId == eve.layoutId) {
                                lay.children.push(eve);
                                eve.parent = lay;
                            }
                        });
                    }
                });

                // 要素
                treeLayoutElementRelList.forEach((ele) => {
                    treeLayoutList.forEach((lay) => {
                        if (lay.dataId == ele.layoutId) {
                            lay.children.push(ele);
                            ele.parent = lay;
                        }
                    });
                });
                this.treeData = treeLayoutList;
                console.log("sbbbbbb", this.treeData);
                // 展开第一个元素
                this.treeEventList = treeEventList;
                if (this.treeData.length) {
                    this.firstExpendNodeIds.push(this.treeData[0].id);
                    let first_children = this.treeData[0].children;
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
                        this.setActive(this.treeData[0]);
                    }
                }
            }
            console.log(this.treeEventList, "treeEventList");
        },

        setActive(nodeData, type, modelVersion) {
            console.log("active node ====> \n", nodeData);
            this.activeContentComponent = "";
            // this.componentLoading = true;

            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(nodeData.dataId);
                switch (nodeData.dataType) {
                    case "YM":
                        Object.assign(this.contentComponentProps, {
                            layoutId: nodeData.dataId,
                            isolateWorkspace: type,
                            modelVersion: modelVersion,
                        });
                        this.activeContentComponent = "pagePreview";
                        this.contentComponentProps = {
                            ...this.contentComponentProps,
                        };
                        break;
                    case "YS":
                        Object.assign(this.contentComponentProps, {
                            elementId: nodeData.dataId,
                            isolateWorkspace: type,
                            modelVersion: modelVersion,
                        });
                        this.activeContentComponent = "elePreview";
                        this.contentComponentProps = {
                            ...this.contentComponentProps,
                        };
                        break;
                    case "SJ":
                        Object.assign(this.eventInfoProps, {
                            layoutId: nodeData.layoutId,
                            eleLayId: nodeData.elementId || nodeData.layoutId,
                            d4iName: nodeData.label,
                            d4iId:
                                nodeData.dataId.split("click|")[1] ||
                                nodeData.dataId,
                            ...this.contentComponentProps,
                            isolateWorkspace: type,
                            modelVersion: modelVersion,
                        });
                        this.activeContentComponent = "eventInfo";
                        this.eventInfoProps = {
                            ...this.eventInfoProps,
                        };
                        console.log("eventInfoProps", this.eventInfoProps);
                        break;
                    case "FW":
                        this.apiId = "";
                        this.activeContentComponent = "serviceConfirm";
                        this.reviewProps.contTpCd = "06";
                        Object.assign(this.contentComponentProps, {
                            apiId: nodeData.dataId,
                            isolateWorkspace: type,
                            modelVersion: modelVersion,
                        });
                        this.contentComponentProps = {
                            ...this.contentComponentProps,
                        };
                        break;
                    case "JK":
                        this.activeContentComponent = "interfaceConfirm";
                        this.reviewProps.contTpCd = "05";
                        Object.assign(this.contentComponentProps, {
                            apiId: nodeData.dataId,
                            isolateWorkspace: type,
                            modelVersion: modelVersion,
                        });
                        this.apiId = nodeData.id;
                        break;
                }
            });
        },
        showTipYm(data) {
            const parent = this.activeData.parent;
            if (this.activeData.dataType === "SJ" && data.dataType === "YM") {
                const children = data.children;
                if (parent) {
                    const parentYm = parent.parent;
                    return parentYm.dataId === data.dataId;
                }
            }
        },
        showTipYs(data) {
            const parent = this.activeData.parent;
            if (this.activeData.dataType === "SJ" && data.dataType === "YS") {
                if (parent) {
                    return parent.dataId === data.dataId;
                }
            }
        },
        showTip(data) {
            const id = data.dataId.split("click|")[1] || data.dataId;
            const target = this.dataMap[id];

            console.log(id, target);
            if (target) {
                return target.includes(this.activeData.dataId);
            }
            return false;
        },
        async clickNodeNew(data, node, ele) {
            console.log(data.dataId, "  click");
            // console.log("node data 2222====> \n", this.dataMap, this.activeData.dataId, 'data.dataId, this.dataMap[data.dataId], this.activeData.dataId');
            this.setActive(data, "C3", this.modelVersion);
        },
        async clickNode(data, node, ele) {
            console.log("node data 2222====> \n", data);
            this.activeData = data;

            this.setActive(data, "D2", this.modelVersion2);
            if (data.dataType != "SJ") {
                // 展开该节点
                this.firstExpendNodeIds.push(data.dataId);
            } else {
                // console.log(data, "datata")
                // if (!this.dataMap[data.parent.dataId] && this.newTreeData.length) {
                const res = await this.rpc.businessRules.serachEventConnect({
                    functionId: this.$route.query.fnctNo,
                    isolateWorkspace: "C3",
                    modelVersion: this.modelVersion,
                    elementId: data.parent.dataId,
                });
                res.list.map((item, index) => {
                    this.dataMap[item.d4iId] =
                        item.d4iBusinessRel + "|" + item.d4iId;
                });
                this.dataMap = {
                    ...this.dataMap,
                };
                // }
                console.log(this.dataMap);
            }
        },
        removeComponentLoading() {
            this.componentLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
.business-rules-container {
    width: 100%;
    .btn_all_list {
        width: 100%;
    }
    .custom-tree-node_icon {
        position: absolute;
        left: 0px;
    }
    /deep/ .btn_class {
        align-items: center;
        flex: 1;
        display: flex;
    }
    .hide-input-select {
        // display: none;
        margin-left: 5px;
        margin-top: 2px;
    }
    /deep/ .el-button--primary {
        width: auto !important;
        float: right;
        margin-left: 16px;
        margin-right: 0px !important;
    }
    .business-rules-container-main {
        position: relative;
        /deep/ .el-tabs__item {
            height: auto;
            line-height: 40px;
        }
        /deep/ .content {
            margin-top: 0px;
        }
        /deep/ .aop_tradecode_comps_page_tabs {
            // margin-bottom: 0px;
        }
    }
    .el-container {
        height: 100%;
        background-color: #fff;
        .el-aside {
            height: calc(100vh - 92px);
            overflow-y: scroll;
            @include flex(column, flex-start, center);
            padding: 10px;
            border-right: 1px solid #dcdfe6;
            p {
                width: 100%;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .side-tree {
                width: 100%;
                height: calc(100% - 30px);
                overflow: auto;
                // padding: 10px 0;
                margin-left: -10px;
                /deep/ .el-tree {
                    padding-left: 10px;
                }
                /deep/ .el-tree-node__content {
                    height: 32px;
                    user-select: none;
                    margin-top: 4px;
                    width: 100%;
                    overflow: hidden;
                }
                .custom-tree-node {
                    @include flex(row, flex-start, center);
                    width: 100%;
                    overflow: hidden;
                    .label-block {
                        margin-left: 4px;
                    }
                    img {
                        width: 14px;
                        height: 14px;
                        margin-right: 5px;
                    }
                }
            }
        }
        .el-main {
            background-color: #fff;
            padding: 0;
            .content-wrapper {
                // padding: 20px;
                height: 100%;
                overflow-y: scroll;
            }
        }
    }
}
</style>
