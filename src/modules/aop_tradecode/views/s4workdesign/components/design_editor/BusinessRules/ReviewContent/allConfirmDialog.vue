<template>
    <el-dialog
        top="10vh"
        title="一键确认"
        width="1200px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        append-to-body="true"
        :visible.sync="showAllConfirmDialog"
        @close="closeDialog"
        class="design-review-confirm-dialog"
    >
        <el-alert
            title="若确认结果未选择，问题/意见不为空时默认为不通过，否则为通过；若结果已选择，则以已选择的结果为准。"
            type="warning"
            show-icon
            :closable="false"
        >
        </el-alert>
        <div class="review-block">
            <el-container>
                <el-aside width="300px">
                    <div class="review-slide-tree">
                        <el-tree
                            class="tree-list"
                            :data="treeDataD2"
                            :props="defaultProps"
                            ref="d2Tree"
                            node-key="dataId"
                            :indent="10"
                            :highlight-current="true"
                            :expand-on-click-node="true"
                            :default-expand-all="true"
                            @node-click="clickNode"
                        >
                            <span
                                class="custom-tree-node"
                                slot-scope="{ node, data }"
                            >
                                <template
                                    v-if="checkNodeStatus(node, data) === '0'"
                                >
                                    <i
                                        class="el-icon-success"
                                        style="color: #67c23a"
                                    ></i>
                                </template>
                                <template
                                    v-if="checkNodeStatus(node, data) === '1'"
                                >
                                    <i
                                        class="el-icon-error"
                                        style="color: #f56c6c"
                                    ></i>
                                </template>
                                <template
                                    v-if="checkNodeStatus(node, data) === '2'"
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
                <el-main
                    ><div class="review-list">
                        <el-table
                            :data="currentReviewContent"
                            style="width: 100%"
                            ref="reviewTable"
                            size="medium"
                            align="center"
                            :stripe="false"
                            border
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#606266',
                            }"
                        >
                            <el-table-column
                                :label="col.label"
                                :min-width="col.width"
                                show-overflow-tooltip="true"
                                v-for="(col, index) in reviewContentColumn"
                                :key="col.prop + index"
                            >
                                <template slot-scope="scope">
                                    <span v-if="col.prop == 'rewSectnNm'">{{
                                        scope.row.rewSectnNm
                                    }}</span>
                                    <span v-else-if="col.prop == 'rewReltCd'">
                                        <el-radio-group
                                            v-model="scope.row.rewReltCd"
                                            size="small"
                                            :fill="
                                                scope.row.rewReltCd == '0'
                                                    ? '#36d542'
                                                    : '#fe4758'
                                            "
                                        >
                                            <el-radio-button label="0"
                                                >通过</el-radio-button
                                            >
                                            <el-radio-button label="1"
                                                >不通过</el-radio-button
                                            >
                                        </el-radio-group>
                                    </span>
                                    <span v-else-if="col.prop == 'rewOpinion'">
                                        <el-input
                                            v-model="scope.row.rewOpinion"
                                            placeholder="请输入评审意见"
                                            size="medium"
                                        ></el-input>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table></div
                ></el-main>
            </el-container>
        </div>
        <div class="btn-group" slot="footer">
            <el-button size="medium" @click="closeDialog">取消</el-button>
            <el-button
                size="medium"
                type="primary"
                @click="confirmAll"
                :loading="confirmAllLoading"
                >一键确认</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import mixin from "@m/core/mixin";
import Tag from "../Tag.vue";

export default {
    mixins: [mixin],
    components: {
        Tag,
    },
    props: {
        showAllConfirmDialog: {
            type: Boolean,
            default: false,
        },
        fnctId: "",
        examId: "",
    },
    data() {
        return {
            confirmAllLoading: false,
            treeDataD2: [],
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
            modelVersionD2: "",
            fnctNm: "",
            currentReviewContent: [],
            currentEvent: {},
            reviewContentColumn: [
                {
                    prop: "rewSectnNm",
                    label: "评审项",
                    width: "180",
                },
                {
                    prop: "rewReltCd",
                    label: "评审结果",
                    width: "100",
                },
                {
                    prop: "rewOpinion",
                    label: "评审意见",
                    width: "180",
                },
            ],
            reviewContentMap: new Map(),
            commonVariableList: [],
        };
    },
    async created() {
        const { commonVariableList } =
            await this.rpc.assetList.commonVariableQuery({
                varTpCd: "bizEventReviewSection",
            });
        this.commonVariableList = commonVariableList;
        await this.init();
    },
    methods: {
        async init() {
            await this.queryFunctionRelInfo();
            await this.getTree();
        },
        // 通过功能 id 查功能详情
        async queryFunctionRelInfo() {
            const res = await this.rpc.businessRules.queryFunctionRelInfo({
                examId: this.examId,
                fnctId: this.fnctId,
                queryTpCd: "02",
            });
            this.functionId = res.fnctNo;
            this.modelVersionD2 = res.fnctVerNo;
            this.fnctNm = res.fnctNm;
        },
        async getTree() {
            const res = await this.rpc.businessRules.getTreeData({
                functionId: this.functionId,
                isolateWorkspace: "D2",
                modelVersion: this.modelVersionD2,
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
                this.treeDataD2 = treeData;
                if (this.treeEventList.length) {
                    this.$nextTick(async () => {
                        this.$refs.d2Tree.setCurrentKey(
                            this.treeEventList[0].dataId
                        );
                        console.log(
                            "currentReviewContent",
                            this.treeEventList[0]
                        );
                        this.currentEvent = this.treeEventList[0];
                        // 设置右侧显示对应数据
                        if (this.treeEventList[0].list.length) {
                            this.currentReviewContent =
                                this.treeEventList[0].list;
                        } else {
                            this.currentReviewContent =
                                await this.querySingleContentReviewResult(
                                    this.treeEventList[0].dataId,
                                    this.treeEventList[0].elementId ||
                                        this.treeEventList[0].layoutId
                                );
                        }
                    });
                }
            } else {
                this.treeDataD2 = [];
            }
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
        async confirmAll() {
            console.log('currentReviewContent', this.currentReviewContent);
            
            const temp = this.currentReviewContent.filter(
                (c) => c.rewReltCd != "" || c.rewOpinion != ""
            );
            let origin_key = "";
            if (temp.length) {
                const contId = this.currentEvent.dataId;
                const parentId =
                    this.currentEvent.elementId || this.currentEvent.layoutId;
                origin_key = `${contId}__${parentId}`;
                this.reviewContentMap.set(
                    origin_key,
                    this.currentReviewContent
                );
                // TODO: 计算状态
            }

            // 计算所有事件对应的评审状态
            // 1. 是否在 reviewContentMap
            // 2. 不在的话，查原来有没有评审过
            // 3. 都没有的话，评审默认通过
            const list = this.treeEventList.map((eve) => {
                let obj = {};
                const current_key = `${eve.dataId}__${
                    eve.elementId || eve.layoutId
                }`;
                const current_value = this.reviewContentMap.get(current_key);

                if (current_value) {
                    // 1. 在 reviewContentMap
                    const un_pass = current_value.filter(
                        (i) =>
                            i.rewReltCd == "1" ||
                            (i.rewReltCd == "" && i.rewOpinion != "")
                    );
                    obj = {
                        contTpCd: "04",
                        contId: eve.dataId,
                        parntContId: eve.elementId || eve.layoutId,
                        contNm: eve.label,
                        rewReltCd: un_pass.length ? "1" : "0",
                        systemDesignReviewContentDetailRecordList:
                            current_value.map((_c) => {
                                return {
                                    rewSectnCdTpCd: _c.rewSectnCdTpCd || _c.varTpCd,
                                    rewSectnCd: _c.rewSectnCd,
                                    rewSectnNm: _c.rewSectnNm,
                                    rewReltCd:
                                        _c.rewReltCd != ""
                                            ? _c.rewReltCd
                                            : _c.rewOpinion != ""
                                            ? "1"
                                            : "0",
                                    rewOpinion: _c.rewOpinion,
                                };
                            }),
                    };
                } else {
                    // 2. 原来评审过的
                    if (eve.list.length) {
                        const un_pass = eve.list.filter(
                            (i) =>
                                i.rewReltCd == "1" ||
                                (i.rewReltCd == "" && i.rewOpinion != "")
                        );
                        obj = {
                            contTpCd: "04",
                            contId: eve.dataId,
                            parntContId: eve.elementId || eve.layoutId,
                            contNm: eve.label,
                            rewReltCd: un_pass.length ? "1" : "0",
                            systemDesignReviewContentDetailRecordList: eve.list,
                        };
                    } else {
                        // 3. 都没评审过
                        obj = {
                            contTpCd: "04",
                            contId: eve.dataId,
                            parntContId: eve.elementId || eve.layoutId,
                            contNm: eve.label,
                            rewReltCd: "0",
                            systemDesignReviewContentDetailRecordList:
                                this.commonVariableList.map((c) => {
                                    return {
                                        rewSectnNm: c.varVal,
                                        rewReltCd: "0",
                                        rewOpinion: "",
                                        rewSectnCdTpCd: c.varTpCd,
                                        rewSectnCd: c.varKey,
                                    };
                                }),
                        };
                    }
                }
                return {
                    ...obj,
                };
            });
            console.log("最终数据", list);

            this.confirmAllLoading = true;

            await this.rpc.assetList.confirmAll({
              examId: this.examId,
              fnctId: this.fnctId,
              systemDesignReviewContentRecordList: list,
            });
            this.$message({
                type: "success",
                message: "评审成功",
            });
            this.confirmAllLoading = false;
            this.$emit("closeDialog", true);
        },
        closeDialog() {
            this.$emit("closeDialog");
        },
        async clickNode(data, node, ele) {
            if (data.dataType == "SJ") {
                // 切换node之前，将当前的评审项(若修改)和node关联存储起来
                const temp = this.currentReviewContent.filter(
                    (c) => c.rewReltCd != "" || c.rewOpinion != ""
                );
                let origin_key = "";
                if (temp.length) {
                    const contId = this.currentEvent.dataId;
                    const parentId =
                        this.currentEvent.elementId ||
                        this.currentEvent.layoutId;
                    origin_key = `${contId}__${parentId}`;
                    this.reviewContentMap.set(
                        origin_key,
                        this.currentReviewContent
                    );
                    // TODO: 计算状态
                }

                // 切换到现在
                this.currentEvent = data;
                const current_key = `${this.currentEvent.dataId}__${
                    this.currentEvent.elementId || this.currentEvent.layoutId
                }`;
                const current_value = this.reviewContentMap.get(current_key);
                if (current_value) {
                    this.currentReviewContent = current_value;
                } else {
                    if (data.list.length) {
                        this.currentReviewContent = data.list;
                    } else {
                        this.currentReviewContent =
                            await this.querySingleContentReviewResult(
                                data.dataId,
                                data.parent.dataId
                            );
                    }
                }
            }
        },
        async querySingleContentReviewResult(contId, parntContId) {
            const { systemDesignReviewContentDetailRecordList } =
                await this.rpc.assetList.querySingleContentReviewResult({
                    examId: this.examId,
                    fnctId: this.fnctId,
                    contTpCd: "04",
                    parntContId: parntContId,
                    contId: contId,
                });
            if (systemDesignReviewContentDetailRecordList.length) {
                return systemDesignReviewContentDetailRecordList;
            } else {
                return this.commonVariableList.map((item) => {
                    return {
                        rewSectnNm: item.varVal,
                        rewReltCd: "",
                        rewOpinion: "",
                        rewSectnCdTpCd: item.varTpCd,
                        rewSectnCd: item.varKey,
                        ...item,
                    };
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin flex($d, $j, $a) {
    display: flex;
    flex-direction: $d;
    justify-content: $j;
    align-items: $a;
}
$success: #36d542;
$error: #fe4758;
$warning: #ffb531;

::-webkit-scrollbar {
    width: 3px;
    height: 3px;
}
.design-review-confirm-dialog {
    /deep/ .el-dialog {
        border-radius: 8px;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    /deep/ .el-dialog__header {
        text-align: left;
        padding: 0 24px;
        height: 48px;
        line-height: 48px;
        background: #fafafc;
        border-radius: 8px 8px 0 0;
        font-weight: 600;
        .el-dialog__title {
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            top: 14px;
        }
    }
    /deep/ .el-dialog__footer {
        border-top: 1px solid #e7e7e7;
        padding: 16px 24px;
    }

    .review-block {
        width: 100%;
        padding: 10px 10px;
        .review-slide-tree {
            border-right: 1px solid #e7e7e7;
            padding-right: 4px;
            // height: 400px;
            height: 56vh;
            width: 100%;
            overflow: auto;
            padding-bottom: 20px;
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
                i {
                    margin-right: 4px;
                }
                .label-block {
                    margin-left: 4px;
                }
            }
        }
        .el-main {
            padding: 4px 0px 10px 10px;
        }
    }
}

.btn-group {
    text-align: right;
}
</style>
