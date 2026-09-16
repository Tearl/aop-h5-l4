<template>
    <el-dialog
        :title="dialogTitle"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_dataSetInfodialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formData"
            label-width="120px"
            class="comps_applicationpositiondialog_form"
        >
             <el-form-item
                label="数据集编号"
                prop="dataSetNo"
                v-if="operationType == '1'"
            >
                <el-input
                    disabled
                    v-model="formData.dataSetNo"
                    class="comps_applicationpositiondialog_width"
                />
            </el-form-item>
            <el-form-item
                label="数据集名称："
                prop="dataSetNm"
            >
                <el-input
                    v-model="formData.dataSetNm"
                    placeholder="请输入数据集名称"
                    class="comps_applicationpositiondialog_width"
                />
            </el-form-item>
            <el-form-item
                label="数据集描述："
                prop="dataSetDesc"
            >
                <el-input
                    v-model="formData.dataSetDesc"
                    type="textarea"
                    class="comps_applicationpositiondialog_width"
                    placeholder="请输入数据集描述"
                ></el-input>
            </el-form-item> 
            <!-- <el-form-item
                label="创建时间"
                prop="gmtCreate"
                v-if="operationType == '1'"
            >
                <span>{{formData.gmtCreate}}</span>
            </el-form-item> -->
        </el-form>
        <div
            class="inner_cheetah_common_btns_area"
            slot="footer"
        >
            <el-button
                @click="dialogVisible = false"
                :disabled="buttonDisabled"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="submitForm"
                :disabled="buttonDisabled"
            >确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    inject: ['action', 'appInfo'],

    props: {
        value: {
            type: Boolean,
            default: false,
        },

        dataSetInfo: {
            type: Object,
            default() {
                return {};
            },
        },
    },


    data() {
        return {
            buttonDisabled: false,
            formData: {
                dataSetNo: '',
                dataSetNm: "",
                dataSetDesc: "",
                aaiVersion: '1.0.0'
            },
            rules: {
                dataSetNm: [
                    {
                        required: true,
                        message: "请输入数据集名称",
                        trigger: "change",
                    },
                ],
                dataSetDesc: [
                    {
                        required: true,
                        message: "请输入数据集描述",
                        trigger: "change",
                    },
                ]
            },
            formDataInfo: {},

            baseList: [],

            bPositionChoiceVisible: false,
        };
    },

    created() {
        this.initForm();
    },

    methods: {
        initForm() {
            this.operationType = this.dataSetInfo.operationType;
            if(this.operationType == '1') {

                this.queryDataSetInfo()

            }
        },
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (!valid) return;

                if (this.operationType == "0") {
                    //新增操作
                    this.addDataSet();
                } else if (this.operationType == "1") {
                    //修改
                    this.modifyDataSet();
                }
            });
        },

        addDataSet() {
            this.buttonDisabled = true;
            this.rpc.d1interation
                .createDataSet({
                    dataSetNm: this.formData.dataSetNm,
                    dataSetDesc: this.formData.dataSetDesc,
                    // blgAppNo: this.appInfo.aaiId,
                    // blgAppNm: this.appInfo.aaiName,
                    // appVerNo: this.appInfo.aaiVersion,
                    // authId: this.appInfo.isolateWorkspace,
                    classifyId: this.dataSetInfo.classifyId
                })
                .then((res) => {
                    this.$emit("output");
                    //保存成功关闭对话框
                    this.dialogVisible = false;
                })
                .finally(() => {
                    this.buttonDisabled = false;
                });
        },

        modifyDataSet() {
            this.buttonDisabled = true;
            this.rpc.d1interation
                .modifyDataSet({
                    dataSetNm: this.formData.dataSetNm,
                    dataSetDesc: this.formData.dataSetDesc,
                    dataSetNo: this.formData.dataSetNo
                })
                .then((res) => {
                    this.$emit("output");
                    //保存成功关闭对话框
                    this.dialogVisible = false;
                })
                .finally(() => {
                    this.buttonDisabled = false;
                });
        },
        async queryDataSetInfo() {
            const { dataSetDesc, dataSetNm, crtTm } = await this.rpc.d1interation.queryDataSet({
                dataSetNo: this.dataSetInfo.dataSetNo
            })

            this.formData = { dataSetDesc, dataSetNm, crtTm, dataSetNo: this.dataSetInfo.dataSetNo }
        }
    },

    computed: {
        dialogTitle() {
            switch (this.operationType) {
                case "0":
                    return `新建数据集`;
                case "1":
                    return `编辑数据集`;
            }
        },

        dialogVisible: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
    },
};
</script>
<style lang="scss">
@import "../../assets/public.scss";
</style>
<style lang="scss">
.inner_cheetah_comps_dataSetInfodialog {
    .comps_applicationpositiondialog_form {
        .el-input.is-disabled .el-input__inner {
            background-color: #fafafc;
            border-color: #dde0e4;
            color: #999999;
        }

        .el-radio__input.is-disabled .el-radio__inner,
        .el-radio__input.is-disabled.is-checked .el-radio__inner {
            background-color: #fafafc;
            border-color: #dde0e4;
            color: #999999;
        }

        .comps_applicationpositiondialog_blue.el-input .el-input__inner {
            color: #3671ff;
        }
    }
}
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_dataSetInfodialog {
    .comps_applicationpositiondialog_form {
        // width: 520px;
        text-align: left;
        margin: 0 auto;
    }

    .comps_applicationpositiondialog_width {
        width: 520px;
    }
    .applicationdialog_logo {
        background: #fafafc;
        border: 1px solid #e9ebee;
        border-radius: 2px;
        width: 80px;
        height: 80px;
        position: relative;

        img {
            width: 20px;
            height: 20px;
            margin-left: 30px;
            margin-top: 20px;
        }
        span {
            position: absolute;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #a2a4a6;
            letter-spacing: 0;
            bottom: 6px;
            left: 12px;
            display: block;
        }
    }

    .uploads {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .avatar-uploader {
            display: inline-block;
            margin: 0 20px 20px 0;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }
        .avatar-uploader-icon {
            font-family: PingFangSC-Regular;
            font-size: 25px;
            border: 1px solid #e9ebee;
            color: #a2a4a6;
            background: #fafafc;
            letter-spacing: 0;
            width: 80px;
            height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .avatar-uploader-icon:hover {
            border-color: #409eff;
        }
        .el-image {
            margin: 0 20px 20px 0;
        }
        .avatar-uploader-outer {
            width: 80px;
            height: 80px;
            position: relative;
            border-radius: 2px;
            margin: 0 20px 20px 0;
            border: 1px solid #e9ebee;
            cursor: pointer;
            .avatar-uploader-img {
                width: 78px;
                height: 78px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
            .del {
                width: 16px;
                height: 16px;
                position: absolute;
                right: -8px;
                top: -8px;
            }
        }
    }
}
</style>
