<template>
    <div class="design-review-container">
        <el-container>
            <el-aside width="222px">
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
                        :load="loadNode"
                        @node-click="clickNode"
                    >
                        <span
                            class="custom-tree-node"
                            slot-scope="{ node, data }"
                        >
                            <span class="tag-block">
                                <span class="tag blue" v-if="data.apiServiceType == 'D5自有服务'">自有</span>
                                <span class="tag origin" v-else-if="data.apiServiceType == 'D5直连服务'">直连</span>
                                <Tag :dataType="data.status" v-else />
                            </span>
                            <span class="label-block" @mousedown.stop="pickOne(data, $event)">
                                <span
                                    class="status-icon"
                                    v-if="data.demandStatus == '02'"
                                >
                                    <i class="el-icon-delete-solid" @click.stop="del(data)"></i>
                                </span>
                                <span>{{ node.label }}</span>
                            </span>
                        </span>
                    </el-tree>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
import Tag from "./tag.vue";
import mixin from "@m/core/mixin";
export default {
    name: "designReview",
    mixins: [mixin],
    components: {
        Tag,
    },
    data() {
        return {
            serviceActive: 'info',
            activeContentComponent: "",
            activeDataType: "", // GN YM YS SJ JK FW
            // // tree
            // treeData: [
            //     {
            //         label: '一级 1',
            //         children: [{
            //             label: '二级 1-1',
            //             dataType: 'GN',
            //             children: [{
            //                 label: '三级 1-1-1'
            //             }]
            //         }]
            //     },
            // ],
            firstExpendNodeIds: [],
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

            // start 评审所需字段
            authFnctJobInfoId: "",
            assetId: "", // 活动id
            modelVersion: "", // 版本号
            isolateWorkspace: "", // 隔离标识
            assetName: "", // 活动名称
            // end


            showConfirmDialog: false,
            reviewProps: {
                assetNo: "",
                contTpCd: "",
                parntContId: "",
                contId: "",
                contNm: "",
            },

            pageMode: "review", // preview: 预览； review: 评审； design: 设计

            projList: [], // 工程列表
            showDesignInfoDialog: false, // 展示设计信息
            dialogTitle:"",
            funcDesignList:[],

            paramsInfo:{}, // 功能资产所属信息集合
            tabsList: [
                // { v: "设置", k: "setting" },
                { v: "基本信息", k: "info" },
                { v: "规则列表", k: "ruleList" },
                { v: "接口列表", k: "list" },
                { v: "服务列表", k: "serviceList" },
            ],

        };
    },
    props: {
        treeData: {
            default: [],
            type: Array,
        }
    },
    async created() {
    },
    watch: {
        treeData() {
            console.log(this.treeData)
        }
    },
    methods: {
        del(item) {
            this.$emit('delete', item)
        },
        pickOne(i, ev)  {
            console.log("d5_self_pick_list-pickOne", i, ev);
            if (!i.parent) {
                this.$parent.pickOne(i, ev);
                // this.$emit('pickOne', i, ev);
            }
        }
    },
    computed: {
        title() {
            return this.pageMode == "review" ? "评审内容清单" : "设计内容清单";
        },
        contentHeaderText() {
            let map = {
                funcConfirm: "功能",
                serviceConfirm: "服务",
                interfaceConfirm: "接口",
                pageConfirm: "页面",
                elementConfirm: "要素",
                eventConfirm: "事件",
            };
            return map[this.activeContentComponent] || "";
        },
    },

};
</script>

<style lang="scss" scoped>
@import "./home.scss";
/deep/.el-loading-mask{
    z-index:999;
}
.design-review-container {
    padding-top: 0px;
    /deep/ .el-container {
        height: 100%;
    }
    /deep/ .side-tree {
        height: 100% !important;
        padding-bottom: 0px !important;
    }
}
.custom-tree-node {
    height: 32px;
}
</style>
