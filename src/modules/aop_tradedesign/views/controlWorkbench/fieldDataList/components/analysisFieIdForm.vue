<template>
    <el-drawer class="aop-com-drawer" title="升级字段" :size="800" :visible.sync="dialogVisiable" :wrapperClosable="false"
        :close-on-click-modal="false">
        <div class="info-content">
            <div class="drawer-main-content info-form-content">
                <!-- 内容 -->
                <div class="aop-com-info-form-wrap">
                    <!-- 模块信息表单 -->
                    <el-form ref="infoForm" :model="formData" :rules="formRules" label-position="top" :inline="false"
                        size="small" @submit.native.prevent>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="字段名称" prop="fieldName">
                                    <el-input class="input-primary-btn" v-model="formData.fieldName"
                                        placeholder="请输入字段名称" :maxlength="20" :disabled="initData.fieldNameDisabled
                                            ">
                                        <el-button slot="append" type="primary" @click="handleAnalysis"
                                            :loading="isLoading" :disabled="isLoading">{{
                                                isAnalyzed
                                                    ? "重新分析"
                                                    : "分析"
                                            }}</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                    <!-- 枚举定义 -->
                    <div class="padding-b-12">
                        <el-button @click="handleAddWordRoots" class="com-primary-medium-btn" icon="el-icon-plus"
                            type="primary" size="small">新增词根</el-button>
                    </div>
                    <div v-if="isAnalyzed" class="aop_common_page_table">
                        <el-table v-loading="isLoading" :data="tableData" @row-click="singleSelect"
                            highlight-current-row>
                            <el-table-column prop="rootIdCombine" label="" align="center" min-width="55">
                                <template slot-scope="scope">
                                    <el-radio v-model="tableSelection"
                                        :label="scope.row.rootIdCombine">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rootShortNameCombine" label="推荐名称" min-width="100"></el-table-column>

                            <el-table-column v-for="index in maxRootCount" :prop="'rootName_' + (index - 1)"
                                :label="'词根' + index" :key="index" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row[
                                        "rootName_" + (index - 1)
                                        ]
                                    }}（{{
                                            scope.row[
                                            "rootFullName_" +
                                            (index - 1)
                                            ] || "缺失"
                                        }}）</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- 底部操作按钮 -->
            <div class="info-bottom-handle">
                <el-button type="default" plain size="medium" @click="handleClose">
                    取 消
                </el-button>
                <el-button class="ml24" type="primary" size="medium" @click="handleConfirm">
                    下一步
                </el-button>
            </div>
        </div>
        <!-- 新增词根 -->
        <handleWordRoots ref="handleWordRoots" @success="handleAddRootSuccess" />
    </el-drawer>
</template>
<script>
import mixin from "@m/core/mixin";
import handleWordRoots from "./handleWordRoots.vue";
export default {
    mixins: [mixin],
    components: { handleWordRoots },
    data() {
        return {
            isLoading: false,
            drawerShow: false, // 弹窗是否显示
            // 表单数据
            formData: {
                fieldName: "",
            },
            analysisName: '',
            // 表单规则
            formRules: {
                fieldName: [
                    {
                        required: true,
                        message: "请输入字段名称",
                        trigger: "blur",
                    },
                ],
            },
            tableData: [],
            // 选中
            tableSelection: "",
            isAnalyzed: false,
            initData: {},
            maxRootCount: 0,
        };
    },
    props: {
        analyInfo: {
            type: Object,
            default: () => { }
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    inject: ["openTab"], // 用于打开窗口
    computed: {
        dialogVisiable: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
    },
    mounted() {
        if (this.analyInfo.fieldName) {
            this.formData.fieldName = this.analyInfo.fieldName || "";
        }
        this.$nextTick(() => {
            this.$refs.infoForm && this.$refs.infoForm.clearValidate();
            if (!this.analyInfo.analysisFirst) {
                // 有名称直接分析
                this.handleAnalysis();
            }
        });
    },
    methods: {
        // 打开抽屉
        openDrawer(data = {}) {
            // data数据初始化
            Object.assign(this.$data, this.$options.data());
            this.drawerShow = true;
            this.initData = data || {};
            if (data.fieldName) {
                this.formData.fieldName = data.fieldName || "";
            }
            this.$nextTick(() => {
                this.$refs.infoForm && this.$refs.infoForm.clearValidate();
                if (!data.analysisFirst) {
                    // 有名称直接分析
                    this.handleAnalysis();
                }
            });
        },
        // 点击分析按钮
        handleAnalysis() {
            this.$refs.infoForm.validate((valid, validObject) => {
                if (valid === true) {
                    this.isLoading = true;
                    this.rpc.datadict
                        .fieldNameAnalyse({
                            fieldName: this.formData.fieldName,
                        })
                        .then((res) => {
                            this.isAnalyzed = true;
                            this.analysisName = this.formData.fieldName;
                            let infoList = res.infoList || [];
                            this.maxRootCount = infoList.length;
                            this.tableSelection = "";
                            let rootData = {
                                rootShortNameCombine: "",
                                rootFullNameCombine: "",
                            };
                            let rootShortNames = [];
                            let rootFullNames = [];
                            let rootIds = [this.formData.fieldName];
                            infoList.forEach((item, index) => {
                                rootData["rootName_" + index] = item.rootName;
                                rootData["rootFullName_" + index] =
                                    item.rootFullName;
                                rootIds.push(item.rootId);
                                if (item.rootShortName) {
                                    rootShortNames.push(item.rootShortName);
                                }
                                if (item.rootFullName) {
                                    rootFullNames.push(item.rootFullName);
                                }
                            });
                            if (rootShortNames.length === infoList.length) {
                                let combine = rootShortNames.join("_");
                                combine = combine.split("_");
                                // 简称小驼峰拼接
                                combine.forEach((item, i) => {
                                    if (i > 0) {
                                        // 拼接时除第一个词外首字母大写
                                        combine[i] =
                                            combine[i]
                                                .slice(0, 1)
                                                .toUpperCase() +
                                            combine[i].slice(1);
                                    }
                                });
                                rootData.rootShortNameCombine =
                                    combine.join("");
                            }
                            if (rootFullNames.length === infoList.length) {
                                // 全称以空格拼接
                                rootData.rootFullNameCombine =
                                    rootFullNames.join(" ");
                            }
                            this.tableData = [
                                {
                                    ...rootData,
                                    rootIdCombine: rootIds.join("_"),
                                },
                            ];
                        })
                        .catch((err) => { })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
            });
        },
        // 点击新增词根
        handleAddWordRoots() {
            // this.$emit("addWordRoots")
            this.$refs.handleWordRoots.openDrawer();
        },
        // 新增词根成功
        handleAddRootSuccess() {
            this.handleAnalysis();
        },
        singleSelect(row) {
            this.tableSelection = row.rootIdCombine;
        },
        // 点击取消按钮
        handleClose() {
            this.isLoading = false;
            this.drawerShow = false;
            this.dialogVisiable = false;
        },
        // 点击确定按钮
        handleConfirm() {
            if (!this.formData.fieldName) {
                this.$message.error("请输入字段名称并分析");
                return false;
            }
            if (this.analysisName !== this.formData.fieldName) {
                this.$message.error("请重新分析字段名称");
                return false;
            }
            if (!this.tableSelection) {
                this.$message.error("请选择推荐名称");
                return false;
            }
            let selected = this.tableData.find((item) => {
                return (
                    this.tableSelection &&
                    this.tableSelection == item.rootIdCombine
                );
            });
            if (!selected || !selected.rootShortNameCombine) {
                this.$message.error("请补充缺失的词根");
                return false;
            }
            this.drawerShow = false;
            this.dialogVisiable = false;

            // return {
            //     analysisFirst: this.initData.analysisFirst,
            //     fieldName: this.formData.fieldName,
            //     ...selected,
            // }
            // this.$emit(
            //     "reviewFieldAdd",
            //     Object.assign({}, this.drawerData, data)
            // );

            this.$emit("analysisConfirm", {
                analysisFirst: this.initData.analysisFirst,
                fieldName: this.formData.fieldName,
                fieldId: this.analyInfo.fieldId,
                ...selected,
            });
            // const data = this.$refs.fieIdForm.handleConfirm();
            // if (data) {
            //     this.$emit(
            //         "reviewFieldAdd",
            //         Object.assign({}, this.drawerData, data)
            //     );
            // } else {
            //     // this.$emit("reviewFieldAdd", Object.assign({}, this.drawerData));
            // }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "@m/assets/css/public.scss";
@import "./css/page.scss";

.info-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-top: 1px solid #e7e7ee;

    .drawer-main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .info-top-fixed {
        flex: none;
    }

    .top-header-tab {
        padding: 0 24px;
        box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
    }

    .info-bottom-handle {
        flex: none;
        height: 72px;
        box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
        @extend .flex-center;

        ::v-deep .el-button {
            width: 112px;
            height: 40px;
            border-radius: 2px;
        }
    }
}

.info-form-content {
    padding: 24px;

    .aop-com-info-form-wrap {
        ::v-deep {
            .el-form-item {
                margin-bottom: 24px;
            }

            .el-form-item__label {
                line-height: 16px;
                padding-bottom: 12px;
            }

            .el-select {
                width: 100%;
            }
        }
    }

    .required-title {
        padding-bottom: 12px;
        font-size: 14px;
        color: #323c41;
        line-height: 16px;
        font-weight: 400;

        &::before {
            display: inline-block;
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
        }
    }
}

.input-primary-btn {
    ::v-deep .el-input-group__append {
        .el-button {
            color: #fff;
            background-color: $theme_color;
            border-radius: 0 3px 3px 0;
        }
    }
}
</style>
