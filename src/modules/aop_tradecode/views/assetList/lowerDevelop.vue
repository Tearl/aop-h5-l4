<template>
    <div class="aop_endentry_assetList_list_lowerDevelop">
        <PageHeader
            :breadcrumbs="breadcrumbs"
            @labelClick="labelClick"
        ></PageHeader>
        <el-container style="padding: 0 0; width: 100%; display: block">
            <el-header height="231px" class="preview_container">
                <div class="preview_content_block">
                    <div class="preview_content_title_big">功 能</div>
                    <div class="preview_content_table">
                        <div class="preview_content_table_flex1">
                            <div class="top_flex">
                                <p>{{ orderDetail.assetFnctNm }}</p>
                                <span class="orange">{{
                                    orderDetail.cstApp || "工程应用"
                                }}</span>
                                <span class="gray">功能</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <p>
                                {{ orderDetail.assetFnctNo }}
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <span>{{ orderDetail.fnctDesc || "/" }}</span>
                        </div>
                        <div class="top_right_flex">
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="designPreview2(orderDetail)"
                                >可视化开发</el-button
                            >
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('3')"
                                >配置申请</el-button
                            >
                            <!-- 暂时放开 -->
                            <!-- <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('2')"
                                >开发分支</el-button
                            > -->
                            <!-- 暂时放开 -->
                            <!-- <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('4')"
                                >部署申请</el-button
                            > -->
                            <!-- <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('01')"
                                >接口测试</el-button
                            > -->
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="showdialog('1')"
                                >生成代码</el-button
                            >
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="appyBranchCodeDownLoad(orderDetail)"
                                >下载代码</el-button
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
                <div v-show="defaultActive == 'A'">
                    <ListTableA
                        :tableA="table1"
                        :formA="orderDetail"
                        :detailObj="detailObj"
                        @handleSizeChange1="handleSizeChange1"
                        :currentPage1="currentPage1"
                        :pageSize1="pageSize1"
                        :total1="total1"
                        @searchSubmit="searchSubmit"
                        @resetSearch="resetSearch"
                        :formSearch="formSearch"
                        @handleCurrentChange1="handleCurrentChange1"
                        :tabType="defaultActive"
                        @removeList="removeList"
                        @apiStateChange="apiStateChange"
                    >
                    </ListTableA>
                </div>
                <div v-show="defaultActive == 'B'">
                    <ListTableB
                        :tableB="table2"
                        @handleSizeChange2="handleSizeChange2"
                        :currentPage2="currentPage2"
                        :pageSize2="pageSize2"
                        @handleCurrentChange2="handleCurrentChange2"
                        :orderDetail="orderDetail"
                        :tabType="defaultActive"
                    >
                    </ListTableB>
                </div>
                <div v-show="defaultActive == 'C'">
                    <ListTableC
                        :tableC="table3"
                        :formSearch3="formSearch3"
                        @searchSubmit2="searchSubmit2"
                        @resetSearch2="resetSearch2"
                        :tabType="defaultActive"
                    >
                    </ListTableC>
                </div>
                <div v-show="defaultActive == 'D'">
                    <ListTableD
                        :tableD="table4"
                        @handleSizeChange3="handleSizeChange3"
                        :currentPage3="currentPage3"
                        :pageSize3="pageSize3"
                        :total3="total3"
                        :formSearch4="formSearch4"
                        :options4="options4"
                        :formA="formA"
                        @handleCurrentChange3="handleCurrentChange3"
                        @searchSubmit3="searchSubmit3"
                        @resetSearch3="resetSearch3"
                        :tabType="defaultActive"
                    >
                    </ListTableD>
                </div>
                <!-- 配置历史 -->
                <div v-show="defaultActive == 'E'">
                    <ConfigHistory
                        :tableE="table5"
                        @handleSizeChange5="handleSizeChange5"
                        :currentPage5="currentPage5"
                        :pageSize5="pageSize5"
                        :total5="total5"
                        :formSearch5="formSearch5"
                        @handleCurrentChange5="handleCurrentChange5"
                        @searchSubmit5="searchSubmit5"
                        @resetSearch5="resetSearch5"
                        :tabType="defaultActive"
                    >
                    </ConfigHistory>
                </div>
            </el-main>
            <!-- 生成代码 -->
            <GenerateCode
                :visibleShow="centerDialogVisible"
                :key="code"
                :formInfo="orderDetail"
                :appId="formSearch5.appId"
                :fnctNo="orderDetail.assetFnctNo"
                :authFnctJobInfoId2="orderDetail.authFnctJobInfoId"
                :tableData="tableData"
                @handleClose="handleClose1"
                name="GennerateCode"
                :tranData="tranData"
            ></GenerateCode>
            <!-- 开发编码弹窗 -->
            <DevelopCode
                :visibleShow="leftDialogShow"
                :key="code2"
                :formInfo2="orderDetail"
                @handleClose="handleClose2"
                ref="developCodeRef"
                name="DevelopCoding"
            ></DevelopCode>
            <!-- 申请配置 -->
            <ApplyConfiguation
                :visibleShow="applyConfigVisible"
                :key="code3"
                :formInfo3="orderDetail"
                :detailObj="detailObj"
                :appId="formSearch5.appId"
                @handleClose="handleClose3"
                name="ApplyConfiguation"
            ></ApplyConfiguation>
            <!-- 申请部署弹窗 -->
            <!-- <ApplyDeployment
                :visibleShow="rightDialogShow"
                :key="code4"
                :formInfo4="orderDetail"
                @handleClose="handleClose4"
                name="ApplyDeployment"
                ref="applyDeploymentRef"
            ></ApplyDeployment> -->
        </el-container>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import DetailTabs from "./components/detail_tabs.vue";
import ListTableA from "./components/list_tableA.vue";
import ListTableB from "./components/list_tableB.vue";
import ListTableC from "./components/list_tableC.vue";
import ListTableD from "./components/list_tableD.vue";
import ConfigHistory from "./components/configuationHistory.vue";
import GenerateCode from "./components/generateCode.vue";
import DevelopCode from "./components/developCode.vue";
import ApplyDeployment from "./components/applyDeployment.vue";
import ApplyConfiguation from "./components/applyConfiguation.vue";
import { mapGetters } from "vuex";
import { downloadEvt } from "@m/core/utils/download.js";
import { setSessionStorage } from "@m/utils/localStorage";
export default {
    mixins: [mixin],
    components: {
        PageHeader,
        DetailTabs,
        ListTableA,
        ListTableB,
        ListTableC,
        ListTableD,
        GenerateCode,
        DevelopCode,
        ApplyDeployment,
        ApplyConfiguation,
        ConfigHistory,
    },
    data() {
        return {
            // 表单数据
            showLoading: false,
            isInput: false,
            menuStatus:"",
            orderDetail: {},
            orderDetail2: {},
            tabsList: [
                { v: "交易列表", k: "A" },
                { v: "工程应用列表", k: "B" },
                { v: "代码历史", k: "C" },
                { v: "配置历史", k: "E" },
                { v: "部署历史", k: "D" },
            ],
            // 默认页签
            defaultActive: "A",
            tabsList2: [],
            // 底部4个列表
            table1: [],
            table2: [],
            table3: [],
            table4: [],
            table5: [],
            formSearch: {
                txNm: "",
                txCd: "",
                txId:"",
                // svcNm: '',
                // svcCd: '', //接口编码
                // svcSeq: '', //编号
                // svcId: '', //id
            },
            formSearch3: {
                appNm: "",
                projectName: "",
            },
            formSearch4: {
                appNm: "",
                deployDateEnd: "",
                deployDateStart: "",
                envTypeCode: "", // 默认查全部
                planDeployTimeCd: "",
            },
            formSearch5: {
                appId: "",
                deployDateEnd: "",
                deployDateStart: "",
            },
            options4: [],
            formA: {},
            formB: {},
            // 部署弹框
            leftDialogShow: false,
            rightDialogShow: false,
            applyConfigVisible: false, // 申请配置弹窗
            // 多选数据
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
            currentPage5: 1,
            pageSize5: 10,
            total5: 0,
            //生成代码弹窗
            centerDialogVisible: false,
            detailObj:{},
            tranData: []
        };
    },
    computed: {
        ...mapGetters(["userInfo","systemId"]),
        breadcrumbs() {
            return [
                {
                    label: "活动列表",
                    operate: "list",
                },
                {
                    label: "后端开发",
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
        async showdialog(obj) {
            if (obj == "1") {
                await this.getSaveCodeList();
                await this.getTranList();

            } else if (obj == "2") {
                this.leftDialogShow = !this.leftDialogShow;
                if(this.leftDialogShow) this.$nextTick(() =>{this.$refs.developCodeRef.getDevelopBranchList()})
            } else if (obj == "3") {
                await this.getAPPlicationList();
                this.applyConfigVisible = !this.applyConfigVisible;
            } else if (obj == "4") {
                this.rightDialogShow = !this.rightDialogShow;
                this.$refs.applyDeploymentRef.showRightDialog();
            }
        },
        handleClose1(obj) {
            this.centerDialogVisible = !this.centerDialogVisible;
        },
        handleClose2(obj) {
            this.leftDialogShow = !this.leftDialogShow;
        },
        handleClose3(obj) {
            this.applyConfigVisible = false;
            if(obj == "applyConfigClose"){
                this.getConfigurationHistoryList()
            }
        },
        handleClose4(obj) {
            this.rightDialogShow = !this.rightDialogShow;
            // 弹窗关闭重新请求部署历史列表
            this.getDeploymentHistoryList();
        },
        // 设计预览
        async designPreview(row) {
            setSessionStorage("interfaceRouter",this.$route.fullPath)
            this.$router.push({
                path:"/aop_tradecode/editorDesign/design",
                query:{
                    viewType: 'func',
                    isolateWorkspace: this.systemId == 1 ? "T2" : "T1",
                    admiId:this.orderDetail.fnctCd,
                    modelVersion:this.orderDetail?.modelVersion || "100001",
                    modelName:this.orderDetail.assetFnctNm,
                    competitorId:this.orderDetail.cstNo,
                    jobId:this.orderDetail?.jobId || "100001",
                    bizLineId:this.orderDetail?.bizDomainNo,
                    appId:this.orderDetail?.bizAppId,
                    authId:this.orderDetail.authFnctJobInfoId,     //授权编号
                    asgntNo:this.orderDetail.asgntNo,
                    assetFnctNo: this.orderDetail.assetFnctNo,
                    authAstFnctInfoId: this.orderDetail.authAstFnctInfoId,
                    fnctNo: this.orderDetail.fnctNo,
                    projectId: this.detailObj.appId,
                    authFnctJobInfoId: this.orderDetail.authFnctJobInfoId,
                }
               })
        },
        async designPreview2(row){
            let queryData = {
                viewType: "func",
                isolateWorkspace: this.systemId == 1 ? "T2" : "T1",
                admiId:this.orderDetail.fnctCd,
                modelVersion:this.orderDetail?.modelVersion || "100001",
                modelName:this.orderDetail.assetFnctNm,
                competitorId:this.orderDetail.cstNo,
                jobId:this.orderDetail?.jobId || "100001",
                bizLineId:this.orderDetail?.bizDomainNo,
                appId:this.orderDetail?.bizAppId,
                authId:this.orderDetail.authFnctJobInfoId,     //授权编号
                asgntNo:this.orderDetail.asgntNo,
                assetFnctNo: this.orderDetail.assetFnctNo,
                authAstFnctInfoId: this.orderDetail.authAstFnctInfoId,
                fnctNo: this.orderDetail.fnctNo,
                projectId: this.detailObj.appId,
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId,
            }
            let params = JSON.stringify(queryData);
            let params2 = params.replace("{", "");
            let params3 = params2.replace("}", "");
            let params4 = params3.replace(/:/g, "=");
            let params5 = params4.replace(/,/g, "&");
            let params6 = params5.replace(/"/g, "");
            // 进入S4设计
            window.open(
                `/aop-h5-sub/#/aop_tradecode/s4Design/design?${params6}`,
                "_blank"
            );
        },
        // 导入设计
        importDesign(info){
            this.$confirm("导入将会更新交易列表及直连服务列表，您确认导入吗？", "", {
                distinguishCancelAndClose: true,
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    const params = {
                        authFnctJobInfoId: info.authFnctJobInfoId,
                        fnctNo: info.fnctNo,
                    };
                    this.rpc.assetList.queryAssetImportDesign(params).then((res) => {
                        this.$message({
                            type: "success",
                            message: "导入设计成功!",
                        });
                    });
                    // 刷新列表数据
                    this.handleTabClick(this.defaultActive);
                })
                .catch((action) => {
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消导入设计",
                    // });
                });
        },
        //生成代码按钮
        getSaveCodeList(row) {
            const params = {
                appId: this.formSearch5.appId,
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId,
                fnctId: this.orderDetail.fnctId,
            };
            this.rpc.assetList
                .queryApplicationSaveCodeList(params)
                .then((res) => {
                    // this.tableData = res.dataList;
                    // this.tableData = []; //生成代码仅展示功能信息-交易列表去掉
                    this.tranData = [];
                    let txNm = res.fnctNm || res.fnctNm.trim();
                    let newarrList = {
                        txNm: txNm,
                        txEngNm: res.fnctEngNm || "",
                        fnctNo: res.fnctNo || "",
                        type: "功能",
                        pkgPath: res.pkgPath || '', // 查询到的包路径
                    };
                    // this.tableData.splice(0, 0, newarrList);
                    this.tranData.push(newarrList)
                    // this.centerDialogVisible = !this.centerDialogVisible;
                });
        },
        //下载代码按钮
        appyBranchCodeDownLoad(row) {
            this.$confirm("请先确定代码是否生成，再下载代码去保存", "", {
                distinguishCancelAndClose: true,
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    this.downDialog(row);
                })
                .catch((action) => {
                    this.$message({
                        type: "info",
                        message: "已取消下载",
                    });
                });
        },
        //确定下载代码
        downDialog(row) {
            const params = {
                // authFnctJobInfoId: row.authAstFnctInfoId,
                fnctId: this.$route.query.fnctId,
            };
            this.rpc.assetList
                .queryAppyBranchCodeDownLoad(params)
                .then((res) => {
                    if (!res.downUrl) {
                        this.$message({
                            message: "请先生成代码，再下载代码",
                            type: "warning",
                        });
                    } else {
                        downloadEvt(this.$replaceUrl(res.downUrl));
                    }
                });
        },
        //tab切换
        handleTabClick(e) {
            // 切换表单
            if (e == "A") {
                this.table2 = [];
                this.table3 = [];
                this.table4 = [];
                this.formSearch = {
                    txNm: "",
                    txCd: "",
                    txId:"",
                };
                this.getBusinessList();
            } else if (e == "B") {
                this.table1 = [];
                this.table3 = [];
                this.table4 = [];
                this.getAPPlicationList();
            } else if (e == "C") {
                this.table2 = [];
                this.table4 = [];
                this.table1 = [];
                this.formSearch3 = {
                    appNm: "",
                    projectName: "",
                };
                this.getBranchCodeHistoryList();
            } else if (e == "D") {
                this.table2 = [];
                this.table3 = [];
                this.table1 = [];

                this.formSearch4 = {
                    appNm: "",
                    deployDateEnd: "",
                    deployDateStart: "",
                    envTypeCode: "",
                    planDeployTimeCd: "",
                };
                this.getDeploymentHistoryList();
            } else if (e == "E") {
                this.table2 = [];
                this.table3 = [];
                this.table1 = [];
                this.table4 = [];
                this.formSearch5.deployDateEnd = ""
                this.formSearch5.deployDateStart = ""
                this.getConfigurationHistoryList();
            }
            this.defaultActive = e;
        },
        // 弹窗搜索
        searchSubmit(type) {
            this.getBusinessList();
        },
        // 重置搜
        resetSearch(type) {
            this.formSearch = {
                txNm: "",
                txCd: "",
                txId:"",
            };
            this.getBusinessList();
        },
        // 条件搜索代码历史
        searchSubmit2(type) {
            this.getBranchCodeHistoryList();
        },
        // 重置搜代码历史列表
        resetSearch2(type) {
            this.formSearch3 = {
                appNm: "",
                projectName: "",
            };
            this.getBranchCodeHistoryList();
        },
        // 条件搜索部署历史
        searchSubmit3(type) {
            this.getDeploymentHistoryList();
        },
        // 重置搜部署历史
        resetSearch3(type) {
            this.formSearch4 = {
                appNm: "",
                deployDateEnd: "",
                deployDateStart: "",
                envTypeCode: "",
                planDeployTimeCd: "",
            };
            this.getDeploymentHistoryList();
        },
        // 条件搜索配置历史
        searchSubmit5(type) {
            this.currentPage5 = 1
            this.pageSize5 = 10
            this.getConfigurationHistoryList();
        },
        // 重置搜配置历史
        resetSearch5(type) {
            this.formSearch5.deployDateEnd = ""
            this.formSearch5.deployDateStart = ""
            this.currentPage5 = 1
            this.pageSize5 = 10
            this.getConfigurationHistoryList();
        },
        // 交易列表
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.getBusinessList();
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.getBusinessList();
        },
        // 工程应用列表
        handleSizeChange2(val) {
            this.pageSize2 = val;
            this.getAPPlicationList();
        },
        handleCurrentChange2(val) {
            this.currentPage2 = val;
            this.getAPPlicationList();
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
        handleSizeChange5(val) {
            this.pageSize5 = val;
            this.getConfigurationHistoryList();
        },
        handleCurrentChange5(val) {
            this.currentPage5 = val;
            this.getConfigurationHistoryList();
        },
        // 查询代码历史列表
        async getBranchCodeHistoryList() {
            const params = {
                authFnctJobInfoId: this.orderDetail.authAstFnctInfoId, // 授权作业ID
                projectName: this.formSearch3.appId, // 工程名称
                appNm: this.formSearch3.appNm, // 应用名称
                fnctId: this.orderDetail.fnctId, // 功能编号字段修改
                examId: this.$route.query.examId || "",
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryAppyBranchCodeHistoryList(
                params
            );
            console.log("代码历史列表--", res);
            this.showLoading = false;
            this.$nextTick(() => {
                this.table3 = res.applyInfoBranchList;
            });
        },
        // 查询配置历史列表
        async getConfigurationHistoryList() {
            const params = {
                authFnctJobInfoId: this.orderDetail.authAstFnctInfoId, // 授权作业ID
                appId: this.formSearch5.appId,
                applyDateEnd: this.formSearch5.deployDateEnd,
                applyDateStart: this.formSearch5.deployDateStart,
                turnPageShowNum: this.pageSize5,
                currentPage: this.currentPage5
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryApplyConfigurationQuery(
                params
            );
            this.showLoading = false;
            this.$nextTick(() => {
                this.table5 = res.configApplicationList || [];
                this.total5 = res.turnPageTotalNum;
            });
        },
        // 查询部署历史列表
        async getDeploymentHistoryList() {
            let appid = this.options4.length > 1 ? this.options4[1].appId : "";
            const params = {
                authFnctJobInfoId: this.orderDetail.authAstFnctInfoId, // 授权作业ID
                envTypeCode: this.formSearch4.envTypeCode, // 环境类型
                appNm: this.formSearch4.appNm, // 应用名称
                appId: appid,
                deployDateStart: this.formSearch4.deployDateStart, // 计划开始日期
                deployDateEnd: this.formSearch4.deployDateEnd, // 计划结束日期
                planDeployTimeCd: this.formSearch4.planDeployTimeCd,
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
            // planDeployDate 部署时间需要拼接 planDeployTimeCd
            let time1 = "9:00-10:00";
            let time2 = "11:00-12:00";
            let time3 = "17:00-18:00";
            if (res.developDeployHistoryList) {
                res.developDeployHistoryList.forEach((item) => {
                    item.planDeployDate2 = "";
                    if (item.planDeployTimeCd == "A") {
                        item.planDeployDate2 =
                            item.planDeployDate + " " + time1;
                    } else if (item.planDeployTimeCd == "B") {
                        item.planDeployDate2 =
                            item.planDeployDate + " " + time2;
                    } else if (item.planDeployTimeCd == "C") {
                        item.planDeployDate2 =
                            item.planDeployDate + " " + time3;
                    }
                });
            }
            this.$nextTick(() => {
                this.table4 = res.developDeployHistoryList;
                this.total3 = res.turnPageTotalNum;
            });
        },
        // 查询工程应用列表
        async getAPPlicationList() {
            this.showLoading = true;
            const data = {
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业Id
                examId: this.$route.query.examId, // 授权作业Id
                fnctId: this.$route.query.fnctId
            };
            const res = await this.rpc.assetList.queryApplicationFunctionList(
                data
            );
            res.appId = res.transAppId
            res.projectName = res.transAppCd
            res.appNm = res.transAppNm
            this.formSearch5.appId = res.appId

            this.detailObj = res;
            this.showLoading = false;
            // 无数据则停止
            if (!res.appId && !res.appNm) {
                return;
            }
            let list = [
                {
                    appId: res.appId,
                    appNm: res.appNm,
                    appDesc: res.appDesc,
                    authFnctJobInfoId: this.orderDetail.authFnctJobInfoId,
                },
            ];
            let list2 = [
                {
                    label: res.appNm,
                    value: res.appNm,
                },
            ];
            list.forEach((item, index) => {
                item = Object.assign(item, res);
            });
            list2.forEach((item) => {
                item = Object.assign(item, res);
                item.label = item.appNm;
                item.value = item.appNm;
            });
            this.table2 = list;
            this.options4 = list2; // 工程应用选项组
            this.total2 = res.turnPageTotalNum;
            let obj = {
                value: "",
                label: "全部",
            };
            this.options4.splice(0, 0, obj);
        },
        // 删除单条
        async removeList(op){
            // 走接口删除--
            this.$confirm("确定要删除吗？", "", {
                distinguishCancelAndClose: true,
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
            .then(() => {
                const params = {
                    fnctId: this.orderDetail.assetFnctNo, //功能编号
                    jobNo: this.orderDetail.asgntNo, //作业号
                    apiId: op.svcId, // 接口Id
                    svcSeq: op.svcSeq, // 接口编号
                    isolateWorkspace: '', //工作台隔离标识
                }
                this.rpc.assetList.deleteFnctD4ApiInfo(params).then((res)=>{
                    // console.log("删除结果",res)
                    this.getBusinessList()
                })
            })
            .catch((action) => {
                // this.$message({
                //     type: "info",
                //     message: "已取消删除",
                // });
            });
        },
        // 交易列表
        async getBusinessList() {
            const params = {
                currentPage: this.currentPage1,
                turnPageShowNum: this.pageSize1,
                svcNm: this.formSearch.txNm,
                svcCd: this.formSearch.txCd, //接口编码
                svcSeq: this.formSearch.txId, //编号
                svcId: '', //id
                authId: this.orderDetail.authAstFnctInfoId,
                jobNo: this.orderDetail.asgntNo, // 功能作业编号
                pageFlg:'1', //0否1是
                fnctId: this.orderDetail.fnctId,
                beltLine: this.orderDetail.bizDomainNo,
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryApiInfoListByPageList(params);
            const changeListRes = await this.queryAssetTranChangeList(params);
            console.log("=====>",changeListRes)
            this.showLoading = false;
            this.$nextTick(() => {
                // this.table1 = res.apiInfoList;
                // this.total1 = Number(res.turnPageTotalPage);
                this.table1 = res.apiInfoList.map((item) =>{
                    let sameItem = changeListRes?.assetTranChangeList.length > 0 && changeListRes?.assetTranChangeList.find(findItem =>findItem.svcId == item.svcId)
                    if(sameItem) item.changeTp = sameItem.changeTp
                    else item.changeTp = ""
                    return item
                })
                this.total1 = Number(res.turnPageTotalPage);
            });
        },
        /**
         * 接口状态改变
         */
        async apiStateChange(data){
            this.$confirm(`是否设置该接口为已完成状态，接口名称为：${data.svcNm}`).then(async () =>{
                await this.rpc.assetList.apiInfoStateModify({
                    apiId: data.svcId
                });
                this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                });
                this.getBusinessList();
            })
        },
        getTranList() {
            const params = {
                pageFlg:"1",
                authId:this.orderDetail.authFnctJobInfoId,
                beltLine:this.orderDetail.beltLine,
                fnctId:this.orderDetail.fnctId,
                jobNo:this.orderDetail.asgntNo,
                currentPage:"1",
                turnPageShowNum:"999",
            };
        console.log(66666666)

            this.rpc.assetList.queryApiInfoListByPageList(params).then((res) =>{
                res.apiInfoList.map((item) =>{
                    item.txId = item.svcId;
                    item.txNm = item.svcNm;
                    item.txEngNm = item.svcCd;
                    return item
                })
                this.tableData = res.apiInfoList;
                this.centerDialogVisible = !this.centerDialogVisible;
            });
        },
        async queryAssetTranChangeList(query) {
            let res = await this.rpc.changeList.queryAssetTranChangeList(query);
            return res;
        }
    },
    created() {
        this.orderDetail = this.$route.query;
        this.$nextTick(() => {
            this.getBusinessList();
            this.getAPPlicationList();
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
        padding: 0px 16px;
        width: 100%;
        .preview_content_block {
            padding: 16px 16px;
            width: 100%;
            height: 100%;
            background: $base_white;
            display: flex;
            margin: 12px 0;
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
                }
                .top_right_flex {
                    display: flex;
                    margin-top: 5px;
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
                min-width:126px;
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
        .detailTab {
            width: 100%;
            background: #ffffff;
        }
    }
}
</style>
