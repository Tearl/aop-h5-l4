<template>
    <div class="dialog-content-table">
        <el-dialog
            title="部署申请信息"
            :visible.sync="visibleShow"
            width="65%"
            :before-close="handleClose"
            class="aop_techdesign_techdetail_dialog"
        >
            <div class="dialog_table_title_top">
                <span>部署环境：</span>
                <el-radio-group v-model="arrangeradio" @change="radioChange">
                    <!-- <el-radio :label="1">开发环境</el-radio> -->
                    <el-radio :label="2">SIT环境</el-radio>
                    <el-radio :label="3">UAT环境</el-radio>
                    <el-radio :label="4">投产演练环境</el-radio>
                </el-radio-group>
            </div>
            <div class="dialog_table_title_top">
                <span>申请部署时间：</span>
                <el-date-picker
                    v-model="arrangeTime"
                    type="date"
                    size="small"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="margin-right: 10px; width: 140px"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    @change="stratTimeChange"
                >
                </el-date-picker>
                <el-select
                    size="small"
                    style="margin-right: 10px; width: 140px"
                    v-model="arrangeTime2"
                    placeholder="请选择时间窗口"
                    @change="dateWindowChange"
                >
                    <el-option
                        v-for="item in timeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="dialog_table_title_top">
                <span>工程应用编码：</span>
                <span>{{gitCodeListNew[0].appId || ''}}</span>
            </div>
            <div class="dialog_table_title_top">
                <span>工程应用名称：</span>
                <span>{{gitCodeListNew[0].appNm || ''}}</span>
            </div>
            <div class="dialog_table_title_top">
                <span>工程Git地址：</span>
                <span>{{gitCodeListNew[0].deployBranchAddr || ''}}</span>
            </div>
            <div class="dialog_table_title_top">
                <span>分支：</span>
                <span>{{gitCodeListNew[0].branch || ''}}</span>
            </div>
            <!-- <div class="add_table_list">
                <span>应用列表</span>
            </div>
            <el-table
                :data="gitCodeListNew"
                align="center"
                :header-cell-style="{
                    background: '#F5F5F8',
                    color: '#333',
                }"
                size="medium"
            >
                <el-table-column
                    property="appId"
                    label="工程应用编号"
                    min-width="180"
                >
                </el-table-column>
                <el-table-column
                    property="appNm"
                    label="工程应用名称"
                    min-width="150"
                ></el-table-column>
                <el-table-column
                    property="deployBranchAddr"
                    label="部署分支"
                    min-width="250"
                >
                </el-table-column>
            </el-table> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small"
                    >取 消</el-button
                >
                <el-button
                    type="primary"
                    size="small"
                    @click="saveRightDialog()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 添加部署弹窗 -->
        <div class="dialog-content-table">
            <el-dialog
                title="添加部署"
                :visible.sync="showApplyDialog"
                width="65%"
                :before-close="handleClose3"
            >
                <h3>应用列表</h3>
                <el-table
                    :data="gitCodeList"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="medium"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column
                        property="projectName"
                        label="工程应用编码"
                        min-width="150"
                    ></el-table-column>
                    <el-table-column
                        property="appNm"
                        label="工程应用名称"
                        min-width="150"
                    ></el-table-column>
                    <el-table-column
                        property="branchAddr"
                        label="部署分支"
                        min-width="150"
                    ></el-table-column>
                </el-table>
                <el-pagination
                    class="btn_el_pageNation"
                    @size-change="handleSizeChange4"
                    @current-change="handleCurrentChange4"
                    medium
                    background
                    :current-page="currentPage4"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize4"
                    layout="prev, pager, next,sizes, jumper"
                    :total="gitCodeListTatal"
                >
                </el-pagination>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showApplyDialog = false" size="small"
                        >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="saveApplyDialog()"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </div>
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
        formInfo4: {
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
            arrangeradio: 1,
            arrangeTime: "",
            arrangeTime2: "",
            showLoading:false,
            timeOptions: [
                {
                    value: "A",
                    label: "9:00-10:00",
                    disabled: false,
                },
                {
                    value: "B",
                    label: "11:00-12:00",
                    disabled: false,
                },
                {
                    value: "C",
                    label: "17:00-18:00",
                    disabled: false,
                },
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() + 3600 * 1000 * 24 < Date.now();
                },
            },
            // 多选数据
            multipleSelection: [],
            gitCodeList: [],
            gitCodeListTatal: "",
            gitCodeListNew: [],
            currentPage4: 1,
            pageSize4: 10,
            total4: "",
            showApplyDialog: false,
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.visibleShow = false;
        // console.log(this.formInfo4, "------------info");
    },
    mounted() {
        // this.showRightDialog();
    },
    methods: {
        handleClose(e) {
            this.$emit("handleClose", e);
        },
        // 代码分支列表
        handleSizeChange4(val) {
            this.pageSize4 = val;
            this.getDevelopBranchList();
        },
        handleCurrentChange4(val) {
            this.currentPage4 = val;
            this.getDevelopBranchList();
        },
        delHandleClick(row, type) {
            var index = this.gitCodeListNew.indexOf(row);
            if (index !== -1) {
                this.gitCodeListNew.splice(index, 1);
            }
        },
        saveRightDialog() {
            if (!this.arrangeTime) {
                this.$message({
                    type: "warning",
                    message: "请选择部署日期",
                });
                return;
            }
            if (!this.arrangeTime2) {
                this.$message({
                    type: "warning",
                    message: "请选择部署时间窗口",
                });
                return;
            }
            if(this.gitCodeListNew.length <1) {
                this.$message({
                    type: "warning",
                    message: "请先添加数据",
                });
                return;
            }
            this.getApplyDevelopSubmit();
        },
        stratTimeChange(value) {
            const date = new Date();
            const hour = date.getHours();
            const times = date.getTime();
            const date2 = new Date(times);
            const yy = date2.getFullYear() + "-";
            const mm =
                (date2.getMonth() + 1 < 10
                    ? "0" + (date2.getMonth() + 1)
                    : date2.getMonth() + 1) + "-";
            const dd =
                date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
            const lastDate = yy + mm + dd;
            if (!value) {
                this.arrangeTime2 = "";
            }
            if (lastDate != value) {
                this.timeOptions.forEach((item) => {
                    item.disabled = false;
                });
            }
            if (this.arrangeTime && lastDate == value && hour >= 18) {
                this.$alert("当天已没有可部署窗口，请选择下一日期", "", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: (action) => {
                        //
                    },
                });
                this.arrangeTime = "";
            }
            if (this.arrangeTime && lastDate == value && hour >= 10) {
                this.timeOptions.forEach((item) => {
                    if (item.value == "A") {
                        item.disabled = true;
                    }
                });
            }
            if (this.arrangeTime && lastDate == value && hour >= 12) {
                this.timeOptions.forEach((item) => {
                    if (item.value == "C") {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            }
        },
        dateWindowChange(value) {
            if (this.arrangeTime == "") {
                this.$alert("请先选择日期", "", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: (action) => {
                        //
                    },
                });
                this.arrangeTime2 = "";
            }
        },
        addAppList(e) {
            this.getDevelopBranchList();
            this.showApplyDialog = true;
            this.multipleSelection = [];
            this.$nextTick(() => {
                this.$refs.multipleTable.clearSelection();
            });
        },
        // 申请部署
        async showRightDialog() {
            this.getTimes();
            const params = {
                authFnctJobInfoId: this.formInfo4.authAstFnctInfoId,
                projectName: "", // 工程名称
                appNm: "", // 应用名称
                fnctNo: this.formInfo4.assetFnctNo, // 功能编号
                currentPage: this.currentPage4,
                turnPageShowNum: this.pageSize4,
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryDevelopBranchList(params);
            this.showLoading = false;
            this.gitCodeList = res.fnctApplyInfoBranchList;
            this.gitCodeListTatal = res.turnPageTotalNum;
            let list = this.gitCodeList || [];
            let newList = [];
            list.forEach((item, index) => {
                let obj = {
                    appId: item.appId,
                    appNm: item.appNm,
                    projectName: item.projectName,
                    projectAppType: item.projectAppType,
                    deployBranchAddr: item.branchAddr,
                    codeChkReportUrl: "",
                };
                newList.push(obj);
            });
            this.gitCodeListNew = newList;
            // this.visibleShow = true;
        },
        saveApplyDialog(e) {
            // 保存应用编辑部署
            let list = this.multipleSelection || [];
            let newList = [];
            list.forEach((item, index) => {
                let obj = {
                    appId: item.appId,
                    appNm: item.appNm,
                    projectName: item.projectName,
                    projectAppType: item.projectAppType,
                    deployBranchAddr: item.branchAddr,
                    codeChkReportUrl: "",
                };
                newList.push(obj);
            });
            this.gitCodeListNew = newList;
            this.multipleSelection = [];
            this.showApplyDialog = false;
        },
        radioChange(val) {
            console.log("部署环境切换选择", val, this.arrangeradio);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 部署申请弹窗提交
        async getApplyDevelopSubmit() {
            const params = {
                authFnctJobInfoId: this.formInfo4.authAstFnctInfoId, // 授权作业ID"AUTH_20230302175402028225004"||
                fnctNo: this.formInfo4.assetFnctNo, // 功能编号
                envTypeCode: this.arrangeradio, // 环境类型
                planDeployDate: this.arrangeTime, // 计划部署日期
                planDeployTimeCd: this.arrangeTime2, // 部署时间窗口 123
                applyDevelopDeployList: this.gitCodeListNew || [], // 部署分支集合
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryApplyDevelopSubmit(
                params
            );
            console.log("开发部署申请提交--", res);
            this.showLoading = false;
            this.handleClose();
            // 成功清除原有数据
            this.gitCodeListNew = [];
            this.arrangeTime2 = "";
            this.arrangeTime = "";
            this.arrangeradio = 1;
        },
        // 开发代码分支列表查询
        async getDevelopBranchList() {
            const params = {
                authFnctJobInfoId: this.formInfo4.authAstFnctInfoId,
                projectName: "", // 工程名称
                appNm: "", // 应用名称
                fnctNo: this.formInfo4.assetFnctNo, // 功能编号
                currentPage: this.currentPage4,
                turnPageShowNum: this.pageSize4,
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryDevelopBranchList(params);
            this.showLoading = false;
            this.gitCodeList = res.fnctApplyInfoBranchList;
            this.gitCodeListTatal = res.turnPageTotalNum;
        },
        // 处理默认时间以及窗口选择
        getTimes() {
            const date = new Date();
            const hour = date.getHours();
            const times = date.getTime();
            const date2 = new Date(times);
            const date3 = new Date();
            date3.setTime(date.getTime() + 3600 * 1000 * 24);
            const yy = date2.getFullYear() + "-";
            const mm =
                (date2.getMonth() + 1 < 10
                    ? "0" + (date2.getMonth() + 1)
                    : date2.getMonth() + 1) + "-";
            const dd =
                date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
            const tommorow =
                date3.getFullYear() +
                "-" +
                (date3.getMonth() + 1 < 10
                    ? "0" + (date3.getMonth() + 1)
                    : date3.getMonth() + 1) +
                "-" +
                (date3.getDate() < 10
                    ? "0" + date3.getDate()
                    : date3.getDate());
            const lastDate = yy + mm + dd;
            this.arrangeTime = lastDate;
            if (hour >= 18) {
                this.arrangeTime = tommorow;
                this.arrangeTime2 = "A";
                this.timeOptions.forEach((item) => {
                    item.disabled = false;
                });
            } else if (hour >= 12) {
                this.arrangeTime2 = "C";
                this.timeOptions.forEach((item) => {
                    if (item.value == "C") {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            } else if (hour >= 10) {
                this.arrangeTime2 = "B";
                this.timeOptions.forEach((item) => {
                    if (item.value == "A") {
                        item.disabled = true;
                    }
                });
            }
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
    .dialog_table_title_top {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 10px 0px;
    }
    .add_table_list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0px;
    }
}
.dialog-content-table{
    .btn_el_pageNation{
         text-align: right;
        padding: 16px 0px;
    }
}
</style>
