<template>
    <el-dialog
        :title="dialogTitle"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_dataSubleveldialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formData"
            label-width="140px"
            class="comps_applicationpositiondialog_form"
        >
            <el-form-item
                label="数据分段名称："
                prop="dataSubstnNm"
            >
                <el-input
                    v-model="formData.dataSubstnNm"
                    placeholder="请输入数据分段名称"
                    class="comps_applicationpositiondialog_width"
                />
            </el-form-item>
            <el-form-item
                label="数据分段属性："
                prop="dataSubstnAttr"
            >
                <el-radio-group v-model="formData.dataSubstnAttr">
                    <el-radio label="01">1对1</el-radio>
                    <el-radio label="02">1对多</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="创建时间"
                prop="crtTm"
                v-if="operationType == '1'"
            >
                <!-- <span>{{formData.gmtCreate}}</span> -->
                <el-input
                    disabled
                    v-model="formData.crtTm"
                    class="comps_applicationpositiondialog_width"
                />
            </el-form-item>
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
                dataSubstnNm: "",
                dataSubstnAttr: "01",
                gmtCreate: '2022-10-12 12:21:09'
            },
            rules: {
                dataSubstnNm: [
                    {
                        required: true,
                        message: "请输入数据分段名称",
                        trigger: "change",
                    },
                ],
                dataSubstnAttr: [
                    {
                        required: true,
                        message: "请选择数据分段属性",
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
        dateFormat (time) {
            return (time || '').replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
        },
        initForm() {
            this.operationType = this.dataSetInfo.operationType;

            if(this.operationType == '1') {
                this.queryDataSetSubLevelInfo()
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
                    this.addDataSetSublevel();
                } else if (this.operationType == "1") {
                    //修改
                    this.modifyDataSetSublevel();
                }
            });
        },

        addDataSetSublevel() {
            this.buttonDisabled = true;
            this.rpc.d1interation
                .createDataSubstn({
                    dataSubstnNm: this.formData.dataSubstnNm,
                    dataSubstnAttr: this.formData.dataSubstnAttr,
                    blgDataSetNo: this.dataSetInfo.blgDataSetNo
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

        modifyDataSetSublevel() {
            this.buttonDisabled = true;
            this.rpc.d1interation
                .modifyDataSubstn({
                    dataSubstnNm: this.formData.dataSubstnNm,
                    dataSubstnAttr: this.formData.dataSubstnAttr,
                    blgDataSetNo: this.dataSetInfo.blgDataSetNo,
                    dataSubstnNo: this.formData.dataSubstnNo
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
        async queryDataSetSubLevelInfo() {
            const { dataSubstnNm, dataSubstnAttr, crtPrsnNm, crtTm } = await this.rpc.d1interation
                .queryDataSubstn({
                    dataSubstnNo: this.dataSetInfo.dataSubstnNo
                })
            this.formData = { dataSubstnNm, dataSubstnAttr, crtPrsnNm, crtTm: this.dateFormat(crtTm), dataSubstnNo: this.dataSetInfo.dataSubstnNo }
        }
    },

    computed: {
        dialogTitle() {
            switch (this.operationType) {
                case "0":
                    return `新建数据分段`;
                case "1":
                    return `编辑数据分段`;
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
.inner_cheetah_comps_dataSubleveldialog {
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
.inner_cheetah_comps_dataSubleveldialog {
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
