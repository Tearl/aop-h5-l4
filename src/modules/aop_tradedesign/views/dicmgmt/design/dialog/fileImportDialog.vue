<template>
    <el-dialog
        title="导入文件"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_fileimportDialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <div class="submit_record_not_pass_content">
            <div class="import_file">
                <!-- <div class="template_download">
                    <p class="title">导入文件</p>
                    <a @click="templateDownload">模版下载</a>
                </div> -->
                
                <el-form :model="formData" :rules="rules" ref="formData">
                    <el-form-item label="导入文件：" prop="fileUrl" required>
                    <el-upload
                        :auto-upload="false"
                        :before-remove="beforeRemove"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :multiple="false"
                        :show-file-list="true"
                        :file-list="fileList"
                        accept=".xls,.xlsx"
                    >
                        <el-button
                        size="small"
                        style="height: 40px; font-size: 14px"
                        type="primary"
                        ><i class="icon_download el-icon-download"></i>开始导入</el-button
                        >
                    </el-upload>
                    </el-form-item>
                </el-form>
                <p class="tips">文件格式仅支持excel</p>
                <div v-if="isUpload">
                    <p class="parsing_res">解析结果</p>
                    <!-- 解析成功和解析失败提示 -->
                    <div
                    v-if="currentAlert.type != 'onload'"
                    class="parsing_status"
                    :class="`parsing_${currentAlert.type}`"
                    >
                    <i :class="`el-icon-${currentAlert.type}`" class="custom_icon"></i
                    ><span style="margin-top: -2px">{{ currentAlert.title }}</span>
                    <p v-if="currentAlert.type == 'error'" class="fail_reason">
                        失败原因：{{ resulVO.errorDesc }}
                    </p>
                    </div>
                    <!-- 解析中提示 -->
                    <div
                    v-else
                    class="parsing_status"
                    :class="`parsing_${currentAlert.type}`"
                    >
                    <img
                        class="icon_onload"
                        src="../../assets/spinner.gif"
                        alt=""
                    />
                    <span style="margin-top: -2px">{{ currentAlert.title }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="inner_cheetah_common_btns_area" slot="footer">
            <el-button @click="dialogVisible = false" :disabled="buttonDisabled">取 消</el-button>
            <el-button type="primary" @click="submitForm" :disabled="buttonDisabled">确 定</el-button>
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
        operationType: {
            type: String,
            default: ''
        },
        moduleInfo: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        uploadUrl() {
            let url = this.rpc.d1workspace.moduleDataImport();
            return url;
        },
    },

    inject: ['appInfo'],

    data() {
        return {
            buttonDisabled: false,
            formData: {
                fileUrl: '',
            },
            fileImportDialogVisible: false,
            rules: {
                fileUrl: [
                { type: "array" },
                { required: true, message: "请上传文件", trigger: "change" },
                ],
            },
            resulVO: {}, //上传成功还是失败
            isUpload: false, // 是否已上传文件
            fileList: [], //上传时的文件列表
            currentAlert: {
                title: "",
                type: "",
                icomUrl: "",
            },
        };
    },

    created() {
    },

    methods: {
        //移出文件
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        //删除后
        handleRemove() {
            this.isUpload = false;
            this.$emit("isShowInfoList", false);
        },
        //文件发生改变
        handleChange(file, fileList) {
            this.formData.fileUrl = file
            console.log(file, 'file----')
            if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的csv文件
            }
        },
        upPrototypeSuccess(res, file) {
            console.log(res, file);
            const {
                infoList, // 列表信息
                excelImportResultVO, // 导入文件解析结果
            } = res.body;

            this.resulVO = excelImportResultVO;
            this.$emit("importFuncInfoList", infoList);

            if (this.resulVO.errorCode == "0") {
                this.isUpload = true;
                this.currentAlert.title = "解析成功";
                this.currentAlert.type = "success";
                this.$emit("upSuccess", "success");
            } else if (this.resulVO.errorCode == "-1") {
                this.isUpload = true;
                this.currentAlert.title = "解析失败";
                this.currentAlert.type = "error";
            }
        },
        handleAvatarSuccess(res) {
            this.formData.fileImg = res.body.path
        },

        appImport() {
            let fd = new FormData()
            fd.append('file', this.formData.fileUrl.raw)
            fd.append('blgAppNo', this.appInfo.aaiId)
            fd.append('blgAppNm', this.appInfo.aaiName)
            fd.append('authId', this.appInfo.isolateWorkspace)
            fd.append('appVerNo', this.appInfo.aaiVersion)
            this.buttonDisabled = true
            console.log(this.moduleInfo, this.formData, '--------00')
            this.rpc.d1workspace.appDataImport(fd).then(res => {
                const { chkRsltCd, chkRslt } = res
                if(chkRsltCd == '1') {
                    this.isUpload = true;
                    this.currentAlert.title = "解析成功";
                    this.currentAlert.type = "success";
                    this.$notify({
                        title: "成功",
                        message: "导入成功",
                        duration: 2000,
                        type: "success",
                    });
                    this.$emit('output')
                    this.dialogVisible = false
                } else {
                    this.isUpload = true;
                    this.currentAlert.title = "解析失败";
                    this.currentAlert.type = "error";
                    this.resulVO.errorDesc = JSON.parse(chkRslt).join(',')
                }
            }).finally(() => {
                this.buttonDisabled = false
            })
        },

        moduleImport() {
            let fd = new FormData()
            fd.append('file', this.formData.fileUrl.raw)
            fd.append('mduNo', this.moduleInfo.appModuleId)
            fd.append('mduNm', this.moduleInfo.moduleName)
            fd.append('mduVerNo', this.moduleInfo.appModuleVersion)
            fd.append('blgAppNo', this.moduleInfo.appId)
            fd.append('blgAppNm', this.moduleInfo.aaiName)
            fd.append('authId', this.moduleInfo.isolateWorkspace)
            fd.append('appVerNo', this.moduleInfo.appVersion)
            this.buttonDisabled = true
            console.log(this.moduleInfo, this.formData, '--------00')
            this.rpc.d1workspace.moduleDataImport(fd).then(res => {
                const { chkRsltCd, chkRslt } = res
                if(chkRsltCd == '1') {
                    this.isUpload = true;
                    this.currentAlert.title = "解析成功";
                    this.currentAlert.type = "success";
                    this.$notify({
                        title: "成功",
                        message: "导入成功",
                        duration: 2000,
                        type: "success",
                    });
                    this.$emit('output')
                    this.dialogVisible = false
                } else {
                    this.isUpload = true;
                    this.currentAlert.title = "解析失败";
                    this.currentAlert.type = "error";
                    this.resulVO.errorDesc = JSON.parse(chkRslt).join(',')
                }
            }).finally(() => {
                this.buttonDisabled = false
            })
        },

        submitForm() {
            if(this.operationType == 'app') {
                this.appImport()
            } else if(this.operationType == 'module') {
                this.moduleImport()
            }
        }
    },

    computed: {
        

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
.inner_cheetah_comps_fileimportDialog {
    
}
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_fileimportDialog {
    .submit_record_not_pass_content {
        .import_file {
            position: relative;
            // height: 272px;
            // min-height: 180px;
            padding: 28px 32px 40px 32px;
            background: #ffffff;
            border-radius: 2px;

            .template_download {
                display: flex;
                align-items: center;
                margin-bottom: 32px;
                .title {
                    font-size: 16px;
                    // font-weight: 700;
                    margin-right: 12px;
                    font-family: PingFangSC-Medium;
                }
                a {
                    cursor: pointer;
                    text-decoration: underline;
                    color: #358aff;
                }
            }
            
            .tips {
            position: absolute;
            top: 37px;
            left: 240px;
            color: #cccccc;
            font-family: PingFangSC-Regular;
            }
            .parsing_res {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            // font-weight: 700;
            margin-bottom: 16px;
            }
            .parsing_tips {
            height: 40px;
            }
            .parsing_status {
            min-height: 40px;
            line-height: 40px;
            border-radius: 4px;
            font-size: 16px;
            font-family: PingFangSC-Regular;
            }
            .custom_icon {
            display: inline-block;
            font-size: 20px;
            margin: 0 12px 0 16px;
            vertical-align: middle;
            }
            // 解析成功
            .parsing_success {
            color: #36d542;
            background-color: #e5ffe7;
            }
            // 解析失败
            .parsing_error {
            color: #ff5f5f;
            background-color: #ffeaec;
            }
            .fail_reason {
            font-size: 14px;
            margin: -8px 0 0 48px;
            padding-bottom: 12px;
            }
            // 解析中
            .parsing_onload {
            background-color: #77a384;
            color: #ffffff;
            }
            .icon_onload {
            width: 20px;
            vertical-align: middle;
            margin: 0 12px 0 16px;
            }
            /deep/ .el-alert__title {
            font-size: 16px;
            font-family: PingFangSC-Regular;
            }
            /deep/ .el-alert__icon {
            font-size: 20px;
            }
            .el-form {
            font-family: PingFangSC-Regular;
            }
        }
    }
}
</style>
