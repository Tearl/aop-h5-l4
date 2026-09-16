<template>
    <div class="dialog-content-table">
        <el-dialog
            title="接收代码"
            :visible.sync="visibleShow"
            width="65%"
            :before-close="handleClose"
            class="aop_techdesign_techdetail_dialog"
        >
            <div class="top_title_tips">
                <i
                    class="el-icon-warning el-icon--left"
                    style="background: #fef2dd; color: #f5a623"
                ></i
                ><span
                    >代码已自动生成至Git中, 请通过Git地址下载代码进行开发</span
                >
            </div>
            <div class="preview_content_table" style="margin-top: 35px">
                <el-table
                    :data="gitCodeList"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="medium"
                >
                    <el-table-column
                        property="appNm"
                        label="应用名称"
                        min-width="150"
                    ></el-table-column>
                    <!-- <el-table-column
                        property=""
                        label="GIT用户名/账号"
                        min-width="180"
                    >
                        <template slot-scope="scope">
                            <span
                                >{{ scope.row.usrNm }}/{{
                                    scope.row.acctNo
                                }}</span
                            >
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        property=""
                        min-width="250"
                        label="GIT地址"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="goGitUrl(scope.row)"
                                type="text"
                                size="small"
                                style="
                                    word-wrap: break-word;
                                    white-space: normal;
                                    padding: 0 0;
                                "
                            >
                                {{ scope.row.branchAddr }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose()" size="small"
                        >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleClose()"
                        >确 定</el-button
                    >
                </span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import { downloadEvt } from "@m/core/utils/download.js";
export default {
    mixins: [mixin],
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        formInfo2: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            appId: "",
            fnctNo: "",
            authFnctJobInfoId2: "",
            gitCodeList: [],
            showLoading:false,
            currentPage4: 1,
            pageSize4: 10,
            gitCodeListTatal: 0,
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.visibleShow = false;
        // console.log(this.formInfo2, "------------info");
    },
    mounted() {
        // this.getDevelopBranchList();
    },
    methods: {
        handleClose(e) {
            this.$emit("handleClose", e);
        },
        // git 代码查看
        goGitUrl(row) {
            console.log(row.branchAddr);
            const input = document.createElement("input");
            input.value = row.branchAddr; // 设置复制内容
            document.body.appendChild(input); // 添加临时实例
            input.select(); // 选择实例内容
            document.execCommand("Copy"); // 执行复制
            document.body.removeChild(input); // 删除临时实例
            this.$message({
                type: "success",
                message: "已复制地址到剪贴板",
            });
        },
        // 开发代码分支列表查询
        async getDevelopBranchList() {
            const params = {
                authFnctJobInfoId: this.formInfo2.authAstFnctInfoId,
                projectName: "", // 工程名称
                appNm: "", // 应用名称
                fnctNo: this.formInfo2.assetFnctNo, // 功能编号
                currentPage: this.currentPage4,
                turnPageShowNum: this.pageSize4,
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryDevelopBranchList(params);
            this.showLoading = false;
            this.gitCodeList = res.fnctApplyInfoBranchList;
            this.gitCodeListTatal = res.turnPageTotalNum;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_techdesign_techdetail_dialog {
    min-width: 640px;
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    ::v-deep .el-dialog__body {
        padding: 20px 20px 0 20px !important;
    }
    ::v-deep .el-button {
        min-width: 64px;
        height: 32px;
        font-size: 14px;
    }
    .top_title_tips {
        width: 100%;
        display: flex;
        align-items: center;
        background: #fef2dd;
        position: absolute;
        top: 54px;
        left: 0;
        padding: 16px 16px;
        span {
            font-size: 14px;
            color: #f5a623;
            line-height: 1;
            margin-left: 5px;
        }
    }
    h3 {
        color: $pri_ft_color;
        font-weight: 600;
        margin-bottom: 10px;
    }
    ::v-deep .el-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    p {
        font-size: 14px;
        line-height: 30px;
        margin: 10px 0px;
        color: #ff9104;
    }
    .dialog-footer {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 20px 24px;
        justify-content: center;
    }
}
</style>
