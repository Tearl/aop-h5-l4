<template>
    <div class="business-rules-container">
        <el-container v-loading="pageLoading">
            <!-- 【页面-要素-事件】树 -->
            <el-aside width="260px">
                <p>规则分析</p>
                <el-input
                    placeholder="输入事件名称"
                    prefix-icon="el-icon-search"
                    v-model="keyword"
                    clearable
                    size="small"
                >
                </el-input>
                <div class="side-tree">
                    <el-tree
                        class="tree-list"
                        :data="treeData"
                        :props="defaultProps"
                        ref="tree"
                        node-key="id"
                        :indent="10"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        @node-click="clickNode"
                        :default-expanded-keys="firstExpendNodeIds"
                        :filter-node-method="filterNode"
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
            <!-- 展示面板 -->
            <el-main v-loading="componentLoading">
                <!-- 页面、要素，预览面板 -->
                <component
                    class="content-wrapper"
                    :is="activeContentComponent"
                    :ref="activeContentComponent"
                    :attrs="contentComponentProps"
                    :eventInfoProps="eventInfoProps"
                    @removeComponentLoading="removeComponentLoading"
                ></component>
                <!-- 事件面板 -->
            </el-main>
        </el-container>
    </div>
</template>

<script>

import mixin from "@m/core/mixin";
import Tag from "./Tag.vue";
import pagePreview from "./pagePreview.vue"; // 页面预览
import elePreview from "./elePreview.vue"; // 要素预览
import eventInfo from "./eventInfo.vue";
import _ from "lodash";

export default {
    mixins: [mixin],
    props: {
        // functionId: "", // 功能编号，区别于功能id
        fnctId: "", // 功能id
        examId: "", // 实例版本id
        isolateWorkspace: "",
        // modelVersion: "",
        projectId: "",
        // 选择接口参数
        formB: {
            type: Object,
            default: () => {},
        },
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
            firstExpendNodeIds: [],
            currentSelectNode: null,
            initFinish: false,
            defaultProps: {
                id: "id",
                children: "children",
                label: "label",
                dataType: "dataType",
                dataId: "dataId",
                status: "status",
                isLeaf: "isLeaf",
            },
            functionId: "",
            modelVersion: ""
        };
    },
    watch: {
        keyword(val) {
            this.$refs.tree.filter(val);
        }
    },
    async created() {

        // 通过功能id先查询功能编号+版本(作业号)
        const res = await this.rpc.businessRules.queryFunctionRelInfo({
            fnctId: this.fnctId || this.$route.query.fnctId,
            examId: this.examId || this.$route.query.examId,
        });
        console.log('queryFunctionRelInfo', res);
        
        this.functionId = res.fnctNo;
        this.modelVersion = res.fnctVerNo;

        this.contentComponentProps = {
            modelVersion: this.modelVersion,
            isolateWorkspace: this.isolateWorkspace,
            functionId: this.functionId,
            projectId: this.projectId,
            fnctId: this.fnctId || this.$route.query.fnctId,
            examId: this.examId || this.$route.query.examId,
        };
        await this.getTreeData();
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.dataType == "SJ" && data.label.indexOf(value) !== -1;
        },
        async getTreeData() {
            const res = await this.rpc.businessRules.getTreeData({
                functionId: this.functionId,
                isolateWorkspace: this.isolateWorkspace,
                modelVersion: this.modelVersion,
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
                            };
                        }
                    );
                }
                // 事件
                if (Array.isArray(treeEventList) && treeEventList.length) {
                    treeEventList = treeEventList.map((eve) => {
                        return {
                            label: eve.d4iName,
                            dataType: "SJ",
                            dataId: eve.d4iId,
                            isLeaf: true,
                            relType: eve.relType,
                            elementId: eve.elementId,
                            layoutId: eve.layoutId,
                            eventName: eve.eventName,
                            d4iDesc: eve.d4iDesc,
                            componentId: eve.componentId,
                            componentName: eve.componentName,
                            componentTypeName: eve.componentTypeName,
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

                treeLayoutList = JSON.parse(JSON.stringify(treeLayoutList))

                treeLayoutList.forEach(lay => {
                    lay.id = _.uniqueId();
                    if (Array.isArray(lay.children) && lay.children.length) {
                        lay.children.forEach(ele => {
                            ele.id = _.uniqueId()
                            if (Array.isArray(ele.children) && ele.children.length) {
                                ele.children.forEach(eve => {
                                    eve.id = _.uniqueId()
                                })
                            }
                        })
                    }
                })

                this.treeData = treeLayoutList;
                console.log('treeLayoutList', treeLayoutList);
                
                // 展开第一个元素
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
        },

        setActive(nodeData) {
            console.log("active node ====> \n", nodeData);
            this.activeContentComponent = "";
            // this.componentLoading = true;
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(nodeData.id);
                switch (nodeData.dataType) {
                    case "YM":
                        Object.assign(this.contentComponentProps, {
                            layoutId: nodeData.dataId,
                        });
                        this.activeContentComponent = "pagePreview";
                        break;
                    case "YS":
                        Object.assign(this.contentComponentProps, {
                            elementId: nodeData.dataId,
                        });
                        this.activeContentComponent = "elePreview";
                        break;
                    case "SJ":
                        Object.assign(this.eventInfoProps, {
                            layoutId: nodeData.layoutId,
                            eleLayId: nodeData.elementId || nodeData.layoutId, // 要素id
                            d4iName: nodeData.label,
                            d4iId: nodeData.dataId,

                            d4iDesc: nodeData.d4iDesc,
                            componentId: nodeData.componentId,
                            componentName: nodeData.componentName,
                            componentTypeName: nodeData.componentTypeName,
                            eventName: nodeData.eventName,
                            ...this.contentComponentProps,
                            relType: nodeData.relType
                        });
                        this.activeContentComponent = "eventInfo";
                        console.log("eventInfoProps", this.eventInfoProps);
                        break;
                }
            });
        },
        clickNode(data, node, ele) {
            console.log("node data ====> \n", data);
            this.setActive(data);
            if (data.dataType != "SJ") {
                // 展开该节点
                this.firstExpendNodeIds.push(data.id);
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
    height: 100%;
    .el-container {
        height: 100%;
        background-color: #fff;
        .el-aside {
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
                padding: 10px 0;
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
                    position: relative;
                    .label-block {
                        margin-left: 4px;
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
