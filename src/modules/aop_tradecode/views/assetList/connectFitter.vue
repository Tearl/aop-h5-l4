<template>
    <div class="aop_endentry_assetList_list_lowerDevelop">
        <PageHeader
            :breadcrumbs="breadcrumbs"
            @labelClick="labelClick"
        ></PageHeader>
        <el-container style="padding: 0 0; width: 100%; display: block">
            <el-header height="231px" class="preview_container">
                <div class="preview_content_block">
                    <div class="preview_content_title_big">应 用</div>
                    <div class="preview_content_table">
                        <div class="preview_content_table_flex1">
                            <div class="top_flex">
                                <p>{{ orderDetail.fnctNm }}</p>
                                <span class="orange">{{
                                    orderDetail.cstApp || "工程应用"
                                }}</span>
                                <span class="gray">功能</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <p>
                                {{ orderDetail2.standardSystemCode }}
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <span>{{ orderDetail2.standardSystemDesc }}</span>
                        </div>
                        <div class="top_right_flex">
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showLeftDialog()"
                                >开发编码</el-button
                            >
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('3')"
                                >申请配置</el-button
                            >
                            <el-button size="medium" type="primary"
                                plain @click="showRightDialog()"
                                >申请部署</el-button
                            >
                        </div>
                    </div>
                </div>
                <div class="detailTab">
                    <DetailTabs
                        :tabsList="tabsList"
                        :defaultActive="defaultActive"
                        @tabClick="handleTabClick"
                    >
                    </DetailTabs>
                </div>
            </el-header>
            <el-main class="preview_main">
                <!-- 各页签详情列表 -->
                <!-- <div v-show="defaultActive == 'A'">
                    <FitterTable :topInfo="topInfo" :tabType="defaultActive">
                    </FitterTable>
                </div> -->
                <div v-show="defaultActive == 'B'">
                    <FitterTableB
                        :tableListB="table2"
                        @handleSizeChange1="handleSizeChange1"
                        :currentPage1="currentPage1"
                        :pageSize1="pageSize1"
                        :total1="total1"
                        :formSearch="formSearch"
                        @searchSubmit="searchSubmit"
                        @resetSearch="resetSearch"
                        @handleCurrentChange1="handleCurrentChange1"
                        :tabType="defaultActive"
                    >
                    </FitterTableB>
                </div>
                <div v-show="defaultActive == 'C'">
                    <FitterTableC
                        :tableListC="table3"
                        @handleSizeChange3="handleSizeChange3"
                        :currentPage3="currentPage3"
                        :pageSize3="pageSize3"
                        :total3="total3"
                        :formA="formA"
                        @handleCurrentChange3="handleCurrentChange3"
                        :tabType="defaultActive"
                    >
                    </FitterTableC>
                </div>
                <!-- 配置历史 -->
                <div v-show="defaultActive == 'E'">
                    <ConfigHistory
                        :tableE="table4"
                        @handleSizeChange5="handleSizeChange4"
                        :currentPage5="currentPage4"
                        :pageSize5="pageSize4"
                        :total5="total4"
                        :formSearch5="formSearch5"
                        @handleCurrentChange5="handleCurrentChange4"
                        @searchSubmit5="searchSubmit4"
                        @resetSearch5="resetSearch4"
                        :tabType="defaultActive"
                    >
                    </ConfigHistory>
                </div>
            </el-main>
            <!-- 开发编码弹窗 -->
            <div class="dialog-content-table">
                <el-dialog
                    title="接收代码"
                    :visible.sync="leftDialogShow"
                    width="60%"
                    :before-close="handleClose"
                >
                    <div class="top_title_tips">
                        <i
                            class="el-icon-warning el-icon--left"
                            style="background: #fef2dd; color: #f5a623"
                        ></i
                        ><span
                            >代码已自动生成至Git中,
                            请通过Git地址下载代码进行开发</span
                        >
                    </div>
                    <div
                        class="left_dialog_table_content"
                        style="margin-top: 35px"
                    >
                        <!--  -->
                        <h3>基本信息</h3>
                        <div class="left_dialog_table_flex">
                            <span>Git账户：</span>
                            <span
                                v-for="item in gitUserInfo.developerList"
                                :key="item.appGitBaseUserId"
                                >{{ item.usrNm }}/{{ item.acctNo }}</span
                            >
                        </div>
                        <!--  -->
                        <h3>代码分支：</h3>
                        <div class="left_dialog_table_flex_end">
                            <p>
                                <span>matser:</span>{{ gitUserInfo.masterAddr }}
                            </p>
                            <p><span>uat:</span>{{ gitUserInfo.uatAddr }}</p>
                            <p><span>sit:</span>{{ gitUserInfo.sitAddr }}</p>
                            <p><span>dev:</span>{{ gitUserInfo.devAddr }}</p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="leftDialogShow = false" size="small"
                            >取 消</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            @click="saveLeftDialog()"
                            >确 定</el-button
                        >
                    </span>
                </el-dialog>
            </div>
            <!-- 申请部署弹窗 -->
            <div class="dialog-content-table">
                <el-dialog
                    title="部署申请信息"
                    :visible.sync="rightDialogShow"
                    width="60%"
                    :before-close="handleClose2"
                >
                    <div class="dialog_table_title_top">
                        <span>部署环境：</span>
                        <el-radio-group
                            v-model="arrangeradio"
                            @change="radioChange"
                        >
                            <el-radio :label="1">开发环境</el-radio>
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
                    <h3>应用信息</h3>
                    <div class="preview_content_table">
                        <div class="preview_content_table_flex">
                            <p>
                                工程应用编码：
                                <span>{{ topInfo.projectName }}</span>
                            </p>
                            <p>
                                工程应用名称：
                                <span>{{ topInfo.appNm }}</span>
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <p>
                                应用描述：
                                <span>{{ topInfo.appDesc }}</span>
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <p>
                                创建人：
                                <span>{{ topInfo.creatrNm }}</span>
                            </p>
                            <p>
                                创建时间：
                                <span>{{ topInfo.crtTm }}</span>
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <p>
                                最后修改人：
                                <span>{{ topInfo.updNm }}</span>
                            </p>
                            <p>
                                最后修改时间：
                                <span>{{ topInfo.updTm }}</span>
                            </p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="rightDialogShow = false"
                            >取 消</el-button
                        >
                        <el-button
                            size="small"
                            type="primary"
                            @click="saveRightDialog()"
                            >确 定</el-button
                        >
                    </span>
                </el-dialog>
            </div>
            <!-- 申请配置 -->
            <ApplyConfiguation
                :visibleShow="applyConfigVisible"
                :key="code3"
                :formInfo3="orderDetail"
                :appId="topInfo.appId"
                @handleClose="handleClose3"
                name="ApplyConfiguation"
            ></ApplyConfiguation>
        </el-container>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import DetailTabs from "./components/detail_tabs.vue";
import FitterTable from "./components/fitter_table.vue";
import FitterTableB from "./components/fitter_table2.vue";
import FitterTableC from "./components/fitter_tableC.vue";
import ApplyConfiguation from "./components/applyConfiguation.vue";
import ConfigHistory from "./components/configuationHistory.vue";
import { mapGetters } from "vuex";
export default {
    mixins: [mixin],
    components: {
        PageHeader,
        DetailTabs,
        FitterTable,
        FitterTableB,
        FitterTableC,
        ApplyConfiguation,
        ConfigHistory,
    },
    data() {
        return {
            // 表单数据
            showLoading: false,
            orderDetail: {},
            orderDetail2: {},
            topInfo: {},
            tabsList: [
                // { v: "基本信息", k: "A" },
                { v: "服务列表", k: "B" },
                { v: "配置历史", k: "E" },
                { v: "部署历史", k: "C" },
            ],
            // 默认页签
            defaultActive: "B",
            table1: [],
            table2: [],
            table3: [],
            table4: [],
            formSearch: {
                inputValue: "",
            },
            formSearch4: {
                appNm: "",
                deployDateEnd: "",
                deployDateStart: "",
                envTypeCode: "",
            },
            formSearch5: {
                appId: "",
                deployDateEnd: "",
                deployDateStart: "",
            },
            // 部署弹框
            leftDialogShow: false,
            rightDialogShow: false,
            applyConfigVisible: false, // 申请配置弹窗
            arrangeradio: 1,
            arrangeTime: "",
            arrangeTime2: "",
            timeOptions: [
                {
                    value: "A",
                    label: "9:00-10:00",
                    disabled:false,
                },
                {
                    value: "B",
                    label: "11:00-12:00",
                    disabled:false,
                },
                {
                    value: "C",
                    label: "17:00-18:00",
                    disabled:false,
                },
            ],
            pickerOptions: {
                disabledDate(time) {
                    return (time.getTime() + 3600 * 1000 * 24) < Date.now();
                },
            },
            // 多选数据
            multipleSelection: [],
            gitUserInfo: {},
            gitCodeListNew: [],
            // 列表数据
            currentPage1: 1,
            pageSize1: 10,
            total1: 0,
            currentPage2: 1,
            pageSize2: 10,
            total2: 0,
            currentPage3: 1,
            pageSize3: 10,
            total3: 0,
            currentPage4: 1,
            pageSize4: 10,
            total4: 0,
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
        breadcrumbs() {
            return [
                {
                    label: "活动列表",
                    operate: "list",
                },
                {
                    label: "直连适配",
                },
            ];
        },
    },
    methods: {
        // 顶部导航栏点击
        labelClick(e) {
            if (e == "list") {
                this.$router.push({
                    path: "/aop_endentry/assetALLList/list",
                });
            }
        },
        // 返回
        reBack() {
            this.$router.go(-1);
        },
        showdialog(obj) {
            if (obj == "3") {
                this.applyConfigVisible = !this.applyConfigVisible;
            }
        },
        handleClose3(obj) {
            this.applyConfigVisible = !this.applyConfigVisible;
            if(obj == "申请配置已提交"){
                this.getConfigurationHistoryList()
            }
        },
        // 开发编码
        showLeftDialog() {
            this.getBranchInfo();
            this.leftDialogShow = true;
        },
        // 申请部署
        showRightDialog() {
            this.getTimes()
            this.rightDialogShow = true;
        },
        handleClose(done) {
            // done();
            this.leftDialogShow = false;
        },
        handleClose2(done) {
            // done();
            this.rightDialogShow = false;
        },
        saveLeftDialog() {
            this.leftDialogShow = false;
        },
        stratTimeChange(value){
            const date = new Date();
            const hour = date.getHours();
            const times = date.getTime();
            const date2 = new Date(times);
            const yy = date2.getFullYear() + '-';
            const mm = (date2.getMonth()+1<10?'0'+(date2.getMonth()+1):date2.getMonth()+1) + '-';
            const dd = date2.getDate()<10?'0'+date2.getDate():date2.getDate();
            const lastDate = yy + mm + dd;
            if(!value){
                this.arrangeTime2 = "";
            }
            if(lastDate!=value){
                this.timeOptions.forEach(item=>{
                    item.disabled = false;
                })
            }
            if(this.arrangeTime &&(lastDate==value) && hour >= 18) {
                this.$alert('当天已没有可部署窗口，请选择下一日期', '', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                        // 
                    }
                });
                this.arrangeTime = "";
            }
            if(this.arrangeTime &&(lastDate==value) && hour >= 10) {
                this.timeOptions.forEach(item=>{
                    if(item.value == "A"){
                        item.disabled = true;
                    }
                })
            } 
            if(this.arrangeTime &&(lastDate==value) && hour >= 12) {
                this.timeOptions.forEach(item=>{
                    if(item.value == "C"){
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                })
            }
        },
        dateWindowChange(value){
            if(this.arrangeTime == ""){
                this.$alert('请先选择日期', '', {
                    confirmButtonText: '确定',
                    center: true,
                    callback: action => {
                        // 
                    }
                });
                this.arrangeTime2 = "";
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
            let arr = [{ appId: "123" }];
            let newList = [];
            arr.forEach((item) => {
                let obj = {
                    appId: this.topInfo.appId,
                    appNm: this.topInfo.appNm,
                    projectName: this.topInfo.projectName,
                    projectAppType: this.topInfo.projectAppType,
                    deployBranchAddr: "",
                    codeChkReportUrl: "",
                };
                newList.push(obj);
            });
            this.gitCodeListNew = newList;
            this.getApplyDevelopSubmit();
            this.rightDialogShow = false;
        },
        // 部署申请弹窗提交
        async getApplyDevelopSubmit() {
            const params = {
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业ID"AUTH_20230302175402028225004"||
                fnctNo: this.orderDetail.fnctNo, // 功能编号
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
            // 成功清除原有数据
            this.getDeploymentHistoryList()
            this.gitCodeListNew = [];
            this.arrangeTime2 = "";
            this.arrangeTime = "";
            this.arrangeradio = 1;
        },
        goGitUrl(row) {
            // window.open(row.link)
        },
        addAppList(e) {},
        //tab切换
        handleTabClick(e) {
            // 切换表单
            if (e == "A") {
                this.table2 = [];
                this.table3 = [];
                this.getApplyInfo();
            } else if (e == "B") {
                this.table1 = [];
                this.table3 = [];
                this.getServiceList();
            } else if (e == "C") {
                this.table2 = [];
                this.table1 = [];
                this.getDeploymentHistoryList();
            } else if (e == "E") {
                this.table2 = [];
                this.table3 = [];
                this.table1 = [];
                this.formSearch5.deployDateEnd = ""
                this.formSearch5.deployDateStart = ""
                this.getConfigurationHistoryList();
            }
            this.defaultActive = e;
        },
        handleTabClick2(e) {
            this.defaultActive2 = e;
            // 切换表格
        },
        radioChange(v) {
            console.log("点击配置环境", v);
        },
        searchSubmit(type) {
            this.getServiceList();
        },
        // 重置
        resetSearch(type) {
            this.formSearch.inputValue = "";
            this.getServiceList();
        },
        // 条件搜索配置历史
        searchSubmit4(type) {
            this.currentPage4 = 1
            this.pageSize4 = 10
            this.getConfigurationHistoryList();
        },
        // 重置搜配置历史
        resetSearch4(type) {
            this.formSearch5.deployDateEnd = ""
            this.formSearch5.deployDateStart = ""
            this.currentPage4 = 1
            this.pageSize4 = 10
            this.getConfigurationHistoryList();
        },
        // 部署历史
        handleSizeChange3(val) {
            this.pageSize3 = val;
            this.getDeploymentHistoryList();
        },
        handleCurrentChange3(val) {
            this.currentPage3 = val;
            this.getDeploymentHistoryList();
        },
        // 配置历史
        handleSizeChange4(val) {
            this.pageSize4 = val;
            this.getConfigurationHistoryList();
        },
        handleCurrentChange4(val) {
            this.currentPage4 = val;
            this.getConfigurationHistoryList();
        },
        // 查询部署历史列表
        async getDeploymentHistoryList() {
            let appid = this.topInfo?this.topInfo.appId:"";
            const params = {
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业ID
                envTypeCode: this.formSearch4.envTypeCode, // 环境类型
                appNm: this.formSearch4.appNm, // 应用名称
                appId: appid,
                deployDateStart: this.formSearch4.deployDateStart, // 计划开始日期
                deployDateEnd: this.formSearch4.deployDateEnd, // 计划结束日期
                currentPage: this.currentPage3,
                turnPageShowNum: this.pageSize3,
            };
            this.showLoading = true;
            const res =
                await this.rpc.assetList.queryApplyDeploymentHistoryList(
                    params
                );
            console.log("部署历史列表--", res);
            this.showLoading = false;
            this.$nextTick(() => {
                this.table3 = res.developDeployHistoryList || [];
                this.total3 = res.turnPageTotalNum;
            });
        },
        // 查询配置历史列表
        async getConfigurationHistoryList() {
            const params = {
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业ID
                appId: this.topInfo.appId,
                applyDateEnd: this.formSearch5.deployDateEnd,
                applyDateStart: this.formSearch5.deployDateStart,
                turnPageShowNum: this.pageSize4,
                currentPage: this.currentPage4
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryApplyConfigurationQuery(
                params
            );
            this.showLoading = false;
            this.$nextTick(() => {
                this.table4 = res.configApplicationList || [];
                this.total4 = res.turnPageTotalNum;
            });
        },
        // 查询代码库基础分支信息
        async getBranchInfo() {
            const params = {
                appId: this.topInfo.appId, // 应用ID
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 应用类型代码
            };
            this.showLoading = true;
            // const res = await this.rpc.assetList.queryLookDisposeBranchInfo(params);
            this.rpc.assetList
                .queryConnectGitInfo(params)
                .then((res) => {
                    this.showLoading = false;
                    this.gitUserInfo = res;
                })
                .catch((err) => {
                    console.log("11111111", err);
                    this.showLoading = false;
                    this.leftDialogShow = false;
                    this.defaultActive = "B";
                    if (err.errorCode == "1") {
                    }
                });
            console.log("基础分支信息的数据", this.gitUserInfo);
        },
        // 服务列表数据
        async getServiceList() {
            const params = {
                authFnctJobInfoId: this.$route.query.authFnctJobInfoId, // 授权作业信息ID
                serviceCode: "",
                serviceName: "",
                allocationId: "", // 分配ID
                currentPage: this.currentPage1,
                turnPageShowNum: this.pageSize1,
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryConnectServiceList(
                params
            ); //WF0301004
            this.showLoading = false;
            this.table2 = res.directServiceAdaptList || [];
            this.total1 = res.turnPageTotalNum;
            console.log("服务列表数据", this.table2);
        },
        // 基本信息查询
        async getApplyInfo() {
            const params = {
                authCd: this.$route.query.authCd, // 授权编号
                appTypeCode: "", // (1-渠道端应用; 2-交易4b应用; 3-服务L5应用)
                currentPage: "1",
                turnPageShowNum: "100",
                bizDomainNo:this.$route.query.bizDomainNo || '',
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryConnectApplyInfo(params); //WF0301004
            console.log("服务列表数据", res);
            this.showLoading = false;
            if (res.aopRunAppInfoBOList.length > 0) {
                this.topInfo = res.aopRunAppInfoBOList[0] || {};
            } else {
                this.topInfo = {};
            }
        },
        // 加载详情
        async getInfo() {
            // type = '02';
            const params = {
                standardSystemCode: this.$route.query.fnctNo || "", //功能编号名称
            };
            const res = await this.rpc.assetList.queryAllStandardSystemList(
                params
            ); //WF0301004
            console.log("直连系统详情", res);
            this.orderDetail2 = res.relationSystemList[0] || {};
        },
        // 处理默认时间以及窗口选择
        getTimes(){
            const date = new Date();
            const hour = date.getHours();
            const times = date.getTime();
            const date2 = new Date(times);
            const date3 = new Date();
            date3.setTime(date.getTime() + 3600 * 1000 * 24);
            const yy = date2.getFullYear() + '-';
            const mm = (date2.getMonth()+1<10?'0'+(date2.getMonth()+1):date2.getMonth()+1) + '-';
            const dd = date2.getDate()<10?'0'+date2.getDate():date2.getDate();
            const tommorow =date3.getFullYear()+"-" + (date3.getMonth()+1<10?'0'+(date3.getMonth()+1):date3.getMonth()+1) + "-" + (date3.getDate()<10?'0'+date3.getDate():date3.getDate());
            const lastDate = yy + mm + dd;
            console.log(lastDate,'当前时间点')
            console.log(tommorow)
            this.arrangeTime = lastDate;
            if(hour >= 18) {
                this.arrangeTime = tommorow;
                this.arrangeTime2 = 'A';
                this.timeOptions.forEach(item=>{
                    item.disabled = false;
                })
            } else if(hour >= 12) {
                this.arrangeTime2 = 'C';
                this.timeOptions.forEach(item=>{
                    if(item.value == "C"){
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                })
            } else if(hour >= 10) {
                this.arrangeTime2 = 'B';
                this.timeOptions.forEach(item=>{
                    if(item.value == "A"){
                        item.disabled = true;
                    }
                })
            }
        }
    },
    created() {
        console.log("router query", this.$route.query);
        this.$nextTick(() => {
            this.orderDetail = this.$route.query;
            this.getInfo();
            this.getApplyInfo(); // 查询基本详情
            this.getServiceList()
        });
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_lowerDevelop {
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    .preview_main {
        width: 100%;
        padding: 0px 16px;
    }
    .preview_container {
        display: flex;
        flex-direction: column;
        padding: 0 16px;
        width: 100%;
        .preview_content_block {
            padding: 16px 16px;
            width: 100%;
            background: $base_white;
            display: flex;
            margin:12px 0;
            .preview_content_table {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin: 0px 20px;
                color: #131313;
                padding-bottom: 5px;
                .preview_content_table_flex {
                    display: flex;
                    width: 100%;
                    margin-top: 5px;
                    p {
                        color: $pri_ft_color;
                        font-size: 14px;
                        margin-right: 10px;
                    }
                    span {
                        font-size: 14px;
                        color: #999999;
                    }
                }
                .preview_content_table_flex1 {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
                    .top_flex {
                        display: flex;
                        align-items: center;
                        p {
                            color: $pri_ft_color;
                            font-weight: 600;
                            margin-right: 8px;
                            font-size: 16px;
                        }
                        span {
                            margin-right: 6px;
                        }
                        .gray {
                            color: #555555;
                            background: #f5f5f5;
                            padding: 2px 5px;
                            border-radius: 2px 2px;
                            border: 1px solid #d9d9d9;
                            font-size: 12px;
                        }
                        .orange {
                            color: #ff9104;
                            background: #fff4e5;
                            padding: 2px 5px;
                            border-radius: 2px 2px;
                            border: 1px solid #ff9104;
                            font-size: 12px;
                        }
                    }
                    .top_right_flex {
                        display: flex;
                    }
                }
            }
            .preview_content_title_big {
                font-family: $font_medium;
                font-size: 18px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
                width: 126px;
                height: 126px;
                border-radius: 8px 8px;
                background: #358aff;
                letter-spacing: 4px;
                font-weight: $font_weight_600;
            }
            .preview_content_title {
                font-family: $font_medium;
                font-size: 16px;
                color: $pri_ft_color;
                letter-spacing: 0;
                font-weight: $font_weight_600;
                margin-top: 0;
            }
            .preview_content_line {
                width: 100%;
                border-top: 0px;
                border-left: 0px;
                border-right: 0px;
                border-bottom: #131313 1px dashed;
            }
        }
        .detailTab{
            width:100%;
            background:#ffffff;
        }
    }
    .dialog-content-table {
        width: 100%;
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
            color: #ff9104;
        }
        .dialog-footer {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dialog_table_title_top {
            width: 100%;
            display: flex;
            align-items: center;
            margin: 10px 0px;
        }
        .preview_content_table {
            display: flex;
            flex: 1;
            flex-direction: column;
            margin: 10px 0px;
            color: #131313;
            padding-bottom: 5px;
        }
        .preview_content_table_flex {
            display: flex;
            width: 100%;
            text-align: left;
            p {
                color: #999999;
                font-size: 14px;
                width: 50%;
            }
            span {
                font-size: 14px;
                color: $pri_ft_color;
            }
        }
        .left_dialog_table_content {
            width: 100%;
            h3 {
                margin-top: 10px;
            }
            .left_dialog_table_flex {
                width: 100%;
                display: flex;
                span {
                    font-size: 14px;
                    color: #999999;
                }
                span:last-child {
                    font-size: 14px;
                    color: #333333;
                }
            }
            .left_dialog_table_flex_end {
                width: 100%;
                margin-top: 14px;
                span {
                    font-size: 14px;
                    color: $pri_ft_color;
                }
                p {
                    font-size: 14px;
                    color: $pri_ft_color;
                    span {
                        font-size: 14px;
                        color: #999999;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
}
</style>
