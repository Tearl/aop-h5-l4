<template>
    <div class="aop_tradecode_page_code">
        <!-- 顶部菜单 -->
        <AsNav @navBack="navBack" :asideActive="asideActive">
            <div slot="textProps" v-if="isAction">
                系统设计-接口设计-{{ fnctNm }}
            </div>
            <div slot="textProps" v-else>功能设计开发-{{ fnctNm }}</div>
            <div slot="radioProps" v-if="asideActive != '1'">
                <el-button-group>
                    <el-button
                        :type="asideActive == '2' ? 'primary' : ''"
                        size="small"
                        @click="handleGoTo('2')"
                        >接口定义</el-button
                    >
                    <el-button
                        :type="asideActive == '3' ? 'primary' : ''"
                        size="small"
                        @click="handleGoTo('3')"
                        >接口设计</el-button
                    >
                    <el-button
                        :type="asideActive == '4' ? 'primary' : ''"
                        size="small"
                        @click="handleGoTo('4')"
                        >接口源码</el-button
                    >
                    <el-button
                        :type="asideActive == '0' ? 'primary' : ''"
                        size="small"
                        @click="handleGoTo('0')"
                        >流程设计</el-button
                    >
                </el-button-group>
            </div>
            <!-- <div
                slot="btnProps"
                v-if="!isDisabled && $route.query.displayType != '01'"
                :class="!isAction ? 'transform-y' : ''"
                class="top_center_btns"
                :style="
                    asideActive == '2' || asideActive == '3'
                        ? 'right:268px'
                        : 'right:120px'
                "
            >
                <el-button
                    plain
                    type="primary"
                    size="small"
                    @click="showdialogBtn('3')"
                    >初始化配置</el-button
                >
                <el-button
                    plain
                    type="primary"
                    size="small"
                    @click="connectListOperate('configured', orderDetail)"
                    style="margin-left: 14px"
                    >工程配置</el-button
                >
                <el-button
                    plain
                    type="primary"
                    size="small"
                    @click="showdialogBtn('1')"
                    >生成代码</el-button
                >
                <el-button
                    plain
                    type="primary"
                    size="small"
                    @click="appyBranchCodeDownLoad('0')"
                    >下载代码</el-button
                >
            </div>
            <div slot="btnProps" style="visibility: hidden">
                <el-button
                    type="danger"
                    plain
                    @click="topMenuBtnClick('3')"
                    v-if="isAction"
                    >接口设计提交</el-button
                >
            </div> -->
        </AsNav>
        <!-- 主体 -->
        <div class="design_container">
            <div class="design_container_aside">
                <Aside
                    isClickTips
                    @goTo="handleGoTo"
                    :active="asideActive"
                ></Aside>
            </div>
            <div class="design_container_process">
                <div class="design_container_process_left" ref="leftMove">
                    <div class="elem_title">
                        <div class="bold_text">{{ modelName }}</div>
                    </div>

                    <el-tooltip
                        v-if="branchData.webUrl"
                        class="item"
                        effect="dark"
                        :content="branchData.webUrl"
                        placement="top-start"
                    >
                        <div class="design_container_process_left_name">
                            {{ branchData.name }} {{ branchData.webUrl }}
                        </div>
                    </el-tooltip>
                    <!-- fileList -->
                    <div v-if="!operateType || operateType === 'merge'">
                        <NestedComponent
                            v-if="children && children.length"
                            :proId="proId"
                            :rpc="rpc"
                            @openFile="openFile"
                            :webUrl="branchData.name"
                            ref="fileTree"
                            @hide="hideBg"
                            :data="{
                                sonDirectoryList: children,
                                type: 'tree',
                            }"
                        ></NestedComponent>
                    </div>
                    <!-- commit -->
                    <div
                        v-if="
                            operateType === 'commit' ||
                            operateType === 'conflict'
                        "
                    >
                        <el-input
                            class="commit-info"
                            type="textarea"
                            :autosize="{
                                minRows: 1,
                            }"
                            resize="none"
                            placeholder="请输入内容"
                            v-model="textarea"
                        >
                        </el-input>
                        <div class="commit-btn-container">
                            <!-- 没有diffChildren -->
                            <el-button
                                :disabled="commitDisabled"
                                class="commit-btn"
                                type="primary"
                                @click="commitFiles()"
                                >Commit</el-button
                            >
                            <el-button
                                class="commit-btn"
                                type="primary"
                                @click="commitCancle()"
                                >取消</el-button
                            >
                        </div>
                        <div v-if="operateType === 'commit'">
                            <NestedComponent
                                v-if="diffChildren && diffChildren.length"
                                :proId="proId"
                                :rpc="rpc"
                                ref="commitFileTree"
                                @openFile="openFile"
                                :webUrl="branchData.name"
                                :data="{
                                    sonDirectoryList: diffChildren,
                                    type: 'tree',
                                }"
                            ></NestedComponent>
                        </div>
                        <div v-if="operateType === 'conflict'">
                            <NestedComponent
                                v-if="conflictList && conflictList.length"
                                :proId="proId"
                                :rpc="rpc"
                                @openFile="openFile"
                                :webUrl="branchData.name"
                                ref="conflictFileTree"
                                :data="{
                                    sonDirectoryList: conflictList,
                                    type: 'tree',
                                }"
                            ></NestedComponent>
                        </div>
                    </div>
                </div>
                <div
                    class="design_container_process_middle"
                    ref="moveDiv"
                ></div>
                <div class="design_container_process_right" ref="rightMove">
                    <!-- pull merge -->
                    <div class="design_container_process_right_button" v-if="$route.query.displayType != '01'">
                        <!-- <el-tooltip class="item" effect="dark" content="拉取" placement="top">
              <img :src="require('@m/assets/images/git/git-pull.png')" alt="">
            </el-tooltip> -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="注销"
                            placement="top"
                            v-if="operateType !== 'merge'"
                        >
                            <img
                                :src="
                                    require('@m/assets/images/git/logout.png')
                                "
                                @click="handleLogout()"
                                alt=""
                            />
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="提交"
                            placement="top"
                            v-if="operateType !== 'merge' && !isDisabled"
                        >
                            <img
                                :src="
                                    require('@m/assets/images/git/git-commit.png')
                                "
                                @click="hanldeOperate('commit')"
                                alt=""
                            />
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="合并"
                            placement="top"
                            v-if="operateType !== 'commit' && !isDisabled"
                        >
                            <img
                                :src="
                                    require('@m/assets/images/git/git-merge.png')
                                "
                                @click="hanldeOperate('merge')"
                                alt=""
                            />
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="刷新源码"
                            placement="top"
                            v-if="
                                operateType !== 'merge' &&
                                operateType !== 'conflict' &&
                                !isDisabled
                            "
                        >
                            <img
                                :src="
                                    require('@m/assets/images/git/refresh.png')
                                "
                                @click="updateCode()"
                                alt=""
                            />
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="部署"
                            placement="top"
                            v-if="
                                operateType !== 'merge' &&
                                operateType !== 'conflict' &&
                                !isDisabled
                            "
                        >
                            <img
                                :src="require('@m/assets/images/git/play.png')"
                                @click="deployApp()"
                                alt=""
                            />
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="运行日志"
                            placement="top"
                            v-if="
                                operateType !== 'merge' &&
                                operateType !== 'conflict'
                            "
                        >
                            <img
                                :src="require('@m/assets/images/git/rizhi.png')"
                                @click="runRizhi()"
                                alt=""
                            />
                        </el-tooltip>

                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="分支初始化"
                            placement="top"
                        >
                            <img
                                :src="
                                    require('@m/assets/images/git/branch.png')
                                "
                                @click="initBranch"
                            />
                        </el-tooltip>
                        <!-- /developAppDeploy/deployApp -->
                        <!-- <div @click="handleShowMerge" class="design_container_process_right_button_merge">
              合并分支
            </div>
            <div v-if="!showMerge">
              刷新源码
            </div> -->
                    </div>
                    <div v-if="!operateType">
                        <el-tabs
                            closable
                            v-model="editableTabsValue"
                            @tab-click="handleChange"
                            type="card"
                            :stretch="false"
                            @edit="handleTabsEdit"
                        >
                            <el-tab-pane
                                :key="index"
                                v-for="(item, index) in tabList"
                                :label="item.title"
                                :name="item.path"
                                lazy
                            >
                            </el-tab-pane>
                        </el-tabs>
                        <Edit
                            @onChange="changeValue"
                            :type="editType"
                            :editable="true"
                            :language="language"
                            :value="code"
                        ></Edit>
                    </div>
                    <div v-if="operateType === 'commit'">
                        <el-tabs
                            closable
                            v-model="editableTabsValue"
                            @tab-click="handleChange"
                            type="card"
                            @edit="handleTabsEdit"
                        >
                            <el-tab-pane
                                :key="index"
                                v-for="(item, index) in diffTabList"
                                :label="item.title"
                                :name="item.path"
                            >
                            </el-tab-pane>
                        </el-tabs>
                        <DiffEfit
                            :value="fileInfo.code"
                            :newValue="fileInfo.newCode"
                            :language="this.language"
                        ></DiffEfit>
                    </div>
                    <div v-if="operateType === 'conflict'">
                        <el-tabs
                            closable
                            v-model="editableTabsValue"
                            @tab-click="handleConflictChange"
                            type="card"
                            @edit="handleTabsEdit"
                        >
                            <el-tab-pane
                                :key="index"
                                v-for="(item, index) in conflictList"
                                :label="item.title"
                                :name="item.path"
                            >
                            </el-tab-pane>
                        </el-tabs>
                        <mergeError
                            :value="code"
                            :newValue="fileInfo.newCode"
                            :language="this.language"
                            @onChange="handleConflictValue"
                        ></mergeError>
                    </div>
                    <div v-if="operateType === 'merge'">
                        <mergeBranch
                            ref="mergeBranch"
                            :branchData="branchData"
                            @conflict="handleConflict"
                            @cancle="handleCancle"
                            @success="handleSuccess"
                            :proId="proId"
                        ></mergeBranch>
                    </div>
                    <!-- mergeBranch -->
                    <!-- <MonacoEditor :options="editorOptions" style="height: 100%; width: 100%" v-model="code" language="javascript" height="1000" ref="editor"/>  -->
                    <!-- <mergeError v-if="loadJs" :value="fileInfo.code" :newValue="fileInfo.newCode"></mergeError> -->
                </div>
            </div>
        </div>
        <LoginGitLab ref="loginGitLab" @login="loginGitlab"></LoginGitLab>
        <DialogText
            :status="true"
            @endFetch="hideCloseTime"
            @updateText="fetchLog"
            @downLoad="downLoadClick"
            @updateContent="getAppLog"
            ref="dialogText"
            :deployText="deployText"
            :runtimeText="runtimeText"
            @hideClose="hideCloseTime"
        ></DialogText>
        <!-- @updateText="runRizhi()" -->
        <DialogText
            @hideClose="hideCloseTime"
            @endFetch="hideCloseTime"
            @updateText="fetchGetRuzhi()"
            @updateContent="getRunRizhi()"
            :status="false"
            ref="dialogText2"
            :deployText="deployText"
            :runtimeText="runtimeText"
        ></DialogText>
        <GenerateCode
            :key="code"
            :visibleShow="centerDialogVisible"
            :appId="$route.query.projectId"
            :fnctNo="$route.query.assetFnctNo"
            :authFnctJobInfoId2="$route.query.authFnctJobInfoId"
            :tableData="tableData"
            @handleClose="handleClose1"
            name="GennerateCode"
            @updateCreateCode="updateCreateCode"
            :tranData="tranData"
        ></GenerateCode>
        <!-- 初始化配置 -->
        <ApplyConfiguation
            :visibleShow="applyConfigVisible"
            :keyType="'s4design'"
            :formInfo3="orderDetail"
            :detailObj="detailObj"
            :appId="newId"
            @handleClose="handleClose3"
            name="ApplyConfiguation"
        ></ApplyConfiguation>
        <!-- 编辑器提交校验2024年1月24日 -->
        <CheckSystemDesign
            ref="checkSystemDesignRef"
            @checkSystemDesign="checkSystemDesign"
        ></CheckSystemDesign>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import AsNav from "./components/d4design_nav";
import Aside from "./components/d4design_process/aside";
import NestedComponent from "./components/NestedComponent.vue";
import Edit from "./components/edit.vue";
import DiffEfit from "./components/diffEdit.vue";
import mergeError from "./components/mergeError.vue";
import mergeBranch from "./components/mergeBranch.vue";
import LoginGitLab from "./components/LoginGitLab.vue";
import DialogText from "./components/dialogText.vue";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
import GenerateCode from "./components/generateCode";
import CheckSystemDesign from "../../../../s4workdesign/components/design_editor/check_systemDesign";
import ApplyConfiguation from "../../../../assetList/components/applyConfiguation.vue";
import { reList, mixList, rowInfos } from "@m/utils/paramTree";
// import MonacoEditor from 'vue-monaco'
// import * as monaco from 'monaco-editor'
// import 'monaco-editor/min/vs/loader.js'
export default {
    mixins: [mixin],
    components: {
        AsNav,
        Aside,
        NestedComponent,
        Edit,
        DiffEfit,
        mergeError,
        mergeBranch,
        LoginGitLab,
        DialogText,
        GenerateCode,
        CheckSystemDesign,
        ApplyConfiguation,
    },
    props: {
        pageType: {
            type: String,
            default: () => "",
        },
        fnctId: {
            type: String,
            default: () => "",
        },
        fnctCd: {
            type: String,
            default: () => "",
        },
        authId: {
            type: String,
            default: () => "",
        },
        jobNo: {
            type: String,
            default: () => "",
        },
        apiId: {
            type: String,
            default: () => "",
        },
        authAppDtlId: {
            type: String,
            default: () => "",
        },
        detailType: {
            type: String,
            default: () => "",
        },
        svcId: {
            type: String,
            default: () => "",
        },
        asideActive: {
            type: String,
            default: () => "",
        },
        transAppInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            children: [],
            code: "",
            language: "java",
            editableTabsValue: "2",
            editableTabs: [
                // {
                //   title: 'Tab 1',
                //   name: '1',
                //   content: 'Tab 1 content'
                // }
            ],
            tabIndex: 2,
            loadJs: true,
            branchList: [],
            branchData: {},
            //  FM-APP-TEMP-20230827001
            proId: "",
            // newId: "FM-APP-3023081500065043",
            newId: this.transAppInfo.appId,
            textarea: "",
            modelName: "",
            showMerge: false,
            operateType: "", // commit
            conflictList: [],
            targetBranchName: "",
            targetFileList: [],
            // authFnctJobInfoId: "FM1-AFJI-20231009-00119891",
            authFnctJobInfoId: this.$route.query.authFnctJobInfoId,
            refreshBranchName: "",
            refreshFileList: [],
            acctNo: "",
            branchName: "",
            deployText: "",
            runtimeText: "",
            centerDialogVisible: false,
            tableData: [],
            tranData: [],
            time: "",
            detailObj: {},
            applyConfigVisible: false, // 申请配置弹窗
            orderDetail: {},
            fnctNm: "",
        };
    },
    destroyed() {
        clearTimeout(this.time);
        this.time = null;
    },
    watch: {
        asideActive() {
            this.editableTabs = [...this.editableTabs];
        },
        editableTabsValue() {
            this.editableTabsValueChange();
        },
    },
    methods: {
        async initBranch() {
            // 分支初始化
            await this.getAPPlicationList();
            const params = {
                appId: this.detailObj.appId || "",
                fnctId: this.$route.query.fnctId || "",
            };
            const res = await this.rpc.configSev.queryAppInitConfStuts(params);
            if (res.appInitConfStutsInfos.length > 0) {
              let list = res.appInitConfStutsInfos.map((item)=>{
                    return {
                        typeName: item.confNm,
                        typeCode: item.confCd,
                        status: item.stusCd, // -1 未配置 0 已配置 -2配置失败
                        appId: item.appId,
                    }
                }).filter(i => i.typeCode == 'c3')
                console.log('list', list);
                if (list.length) {
                  let _res = list[0].status;
                  if (_res == '0') {
                    // 已配置
                    this.$message({
                        type: "success",
                        message: "已配置",
                    });
                  } else {
                    // 配置
                    const _params = {
                        appId: list[0].appId || "",
                        fnctId: this.$route.query.fnctId || "",
                    }
                    await this.rpc.configSev.createAppGitFnctBranch(_params);
                    this.$message({
                        type: "success",
                        message: "配置成功",
                    });
                    await this.getFunctionBranch();
                  } 
                //   else {
                //     // 配置失败
                //     this.$message({
                //         type: "error",
                //         message: "配置失败",
                //     });
                //   }
                }
            }
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
        async handleLogout() {
            await this.rpc.newEditor.loginOutGit();
            this.$notify({
                title: "成功",
                message: "注销成功",
                duration: 2000,
                type: "success",
            });
        },
        hideCloseTime() {
            clearTimeout(this.time);
            this.time = null;
        },
        updateCreateCode(list) {
            this.handleClose1();
            this.updateCode(list, false);
        },
        handleClose1() {
            this.centerDialogVisible = false;
        },
        async downLoadText(activeName) {
            // this.downFailSignature()
            this.rpc.newEditor
                .downloadAppLog(
                    {
                        logId: this.logId,
                        logType: activeName === "first" ? "deploy" : "runtime",
                    },
                    { responseType: "blob" }
                )
                .then((res) => {
                    console.log(res);
                    this.downFailSignature(res);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        downFailSignature(res) {
            // let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
            let downloadElement = document.createElement("a"); // 创建a标签
            let href = window.URL.createObjectURL(res); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.setAttribute("download", "日志.txt");
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
            // this.exporting = false
            // const messageError = [this.deployText];
            // const blob = new Blob([messageError.join('\\n')], { type: 'text/plain' });
            // const url = URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = url;
            // link.download = '失败原因.txt';
            // document.body.appendChild(link);
            // link.click();
        },
        fetchLog(activeName) {
            clearTimeout(this.time);
            this.time = setTimeout(() => {
                this.getAppLog(activeName);
                this.fetchLog(activeName);
            }, 1000);
        },
        async deployApp() {
            if (!this.transAppInfo.appId) {
                this.$alert("当前功能还未关联工程，请先去关联工程", "提示", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: (action) => {
                        return false;
                    },
                });
                return;
            }
            const res = await this.rpc.newEditor.deployApp({
                appId: this.transAppInfo.appId,
                // appId: 'FM-APP-2023081500065043',
                envId: "1",
            });
            this.rpc.s4design.addFuntionJobCommitFlow({
                fnctId: this.$route.query.fnctId,
                jobTpCd: "C4",
            });
            this.deployText = "";
            this.runtimeText = "";
            this.logId = res.logId;
            this.$refs.dialogText.showDialog();
            this.fetchLog("first");
        },

        downLoadClick(activeName) {
            this.downLoadText(activeName);
        },
        async getRunRizhi(id) {
            if (!this.transAppInfo.appId) {
                this.$alert("当前功能还未关联工程，请先去关联工程", "提示", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: (action) => {
                        return false;
                    },
                });
                return;
            }
            if (!id) {
                const res = await this.rpc.newEditor.getLastAppLogId({
                    appId: this.transAppInfo.appId,
                });
                id = res.logId;
            }
            const res2 = await this.rpc.newEditor.getAppLog({
                logId: id,
                logType: "runtime",
            });
            this.runtimeText = res2.appLogText;
            this.runtimeText = this.runtimeText
                .replace(/\r\n/g, "<br>")
                .replace(/\n/g, "<br>");
            return id;
        },
        runRizhi() {
            this.runtimeText = "";
            this.$refs.dialogText2.showDialog("second");
            // this.getAppLog('second')
            this.getRunRizhi();
        },
        async fetchGetRuzhi(logId) {
            this.time = setTimeout(async () => {
                const id = await this.getRunRizhi(logId);
                this.fetchGetRuzhi(id);
            }, 1000);
        },
        async getAppLog(activeName) {
            if (activeName === "first") {
                const res1 = await this.rpc.newEditor.getAppLog({
                    // "logId": "eyJhcHBOYW1lIjoidGVzdC13ZWItaHVhbmdtIiwiY2RHcm91cCI6ImRldi1maW5tYWxsLWFvcCIsImNpR3JvdXAiOiJERVYtRmlubWFsbCIsImNpTnVtYmVyIjozLCJlbnYiOiJERVYifQ==",
                    logId: this.logId,
                    logType: "deploy",
                });
                if (res1.logStatus === "preparing") {
                    this.$refs.dialogText.showCircle(true);
                    if (!this.time) {
                        this.fetchLog(activeName);
                    }
                } else {
                    this.deployText = res1.appLogText;
                    this.deployText = this.deployText.replace(/\r\n/g, "<br>");
                    this.$refs.dialogText.showCircle(false);
                }
            } else {
                const res2 = await this.rpc.newEditor.getAppLog({
                    logId: this.logId,
                    logType: "runtime",
                });
                // if (res1.logStatus === 'preparing') {
                //   this.$refs.dialogText.showCircle(true)
                // } else {
                this.runtimeText = res2.appLogText;
                // this.$refs.dialogText.showDialog(true);
                this.runtimeText = this.runtimeText
                    .replace(/\r\n/g, "<br>")
                    .replace(/\n/g, "<br>");
                this.$refs.dialogText.showCircle(false);
                // }
            }
        },
        async proxyRpc(method, params, fun) {
            // this.$refs.loginGitLab.showDialog();
            const res = await this.rpc.newEditor[method](params);
            if (res.loginAgainFlag) {
                this.$nextTick(() => {
                    this.$refs.loginGitLab.showDialog();
                });
                return {};
            }
            if (fun) {
                fun(res);
                return;
            }
            return res;
        },
        async loginGitlab(data) {
            console.log("login2");

            const res = await this.rpc.newEditor.loginGit({
                acctNo: data.userName,
                acctPwd: data.checkPass,
                proId: this.newId,
            });
            this.acctNo = data.userName;
            this.getBranchTree();

            this.$refs.loginGitLab.hideDialog();
        },
        dealCode(diffCode, oldCode) {
            // diffCode @@ -0,2 +1,24 @@/n+|-asdfbsdfqewr
            // 提取@@ -0,2 +1,24 @@/n
            //
            // let diffCode = '@@ -0,2 +1,24 @@/n+'
            // a\nb\n
            // diffCode = '@@ -1,7 +1,7 @@\n sss\n 1111\n 2222\n-3333\n+333\n 4444\n 5555\n 6666\n@@ -257,7 +257,7 @@ sss\n 999\n 1010\n 2020\n-3030\n+303\n 4040\n 5050\n 6060\n'
            const oldCodeList = this.createCodeObjList(oldCode);
            const list = diffCode.split("@@");
            while (list.length > 1) {
                const length = list.length;
                let code = list[length - 1];
                const status = list.length === 3;
                if (status) {
                    // 说明是开头 @@/n
                    code = code.slice(1);
                }
                const newCode = this.dealMatch(code, status);
                let header = list[length - 2];
                header = header.replace(" +", ",").replace("-", "");
                let positionList = header.split(",");
                let startLine = Number(positionList[0]) - 1;
                let endLine = startLine + Number(positionList[1]) - 1;
                if (startLine === -1 && endLine === -2) {
                    oldCodeList[0].code = newCode;
                } else {
                    this.replaceLines2(
                        newCode,
                        startLine,
                        endLine,
                        oldCodeList
                    );
                }
                console.log(endLine, "endLine");
                list.pop();
                list.pop();
            }
            console.log(oldCodeList);
            console.log(oldCodeList);
            return this.createCode(oldCodeList);
        },
        dealMatch(diffCode, status) {
            // 0,2 +1,24
            // const
            // const
            const lineCode = diffCode.split("\n");
            const list = [];
            for (let i = 0; i < lineCode.length; i++) {
                const item = lineCode[i];
                if (!status && i === 0) {
                    continue;
                }
                if (item[0] === "+") {
                    list.push(item.slice(1));
                } else if (item[0] !== "-") {
                    list.push(item.slice(1));
                }
            }
            return list.join("\n");
        },
        createPath(pathList, index) {
            // [1, 2, 3, 4, 5].slice(0, 4)
            // [1, 2, 3, 4].join('/')
            return pathList.slice(0, index + 1).join("/");
        },
        deepTree(pathList, treeList, index = 0) {
            const name = pathList[index];
            if (!name || index > pathList.length - 1) {
                return;
            }
            if (treeList.length === 0) {
                if (name.includes(".")) {
                    // 说明是文件
                    treeList.push({
                        id: "",
                        name: name,
                        path: this.createPath(pathList, index),
                        sonDirectoryList: [],
                        type: '"blob"',
                    });
                    return;
                } else {
                    // 文件夹
                    treeList.push({
                        id: "",
                        name: name,
                        path: this.createPath(pathList, index),
                        sonDirectoryList: [],
                        type: "tree",
                    });
                }
            }
            for (let i = 0; i < treeList.length; i++) {
                const item = treeList[i];
                if (name === item.name) {
                    index += 1;
                    this.deepTree(pathList, item.sonDirectoryList, index);
                    return;
                }
                if (i === treeList.length - 1) {
                    // 说明没有文件夹 需要创建文件夹
                    if (name.includes(".")) {
                        // 说明是文件
                        treeList.push({
                            id: "",
                            name: name,
                            path: this.createPath(pathList, index),
                            sonDirectoryList: [],
                            type: '"blob"',
                        });
                        return;
                    } else {
                        // 文件夹
                        treeList.push({
                            id: "",
                            name: name,
                            path: this.createPath(pathList, index),
                            sonDirectoryList: [],
                            type: "tree",
                        });
                    }
                }
            }
        },
        async updateCode(list, status = true) {
            if (status) {
                await this.getSaveCodeList();
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            try {
                const res = await this.proxyRpc("refreshSourceCode", {
                    proId: this.proId,
                    fnctId: this.$route.query.fnctId,
                    brhRef: this.branchData.name,
                    authFnctJobInfoId: this.authFnctJobInfoId,
                    dataList: list,
                });
                this.rpc.s4design.addFuntionJobCommitFlow({
                    fnctId: this.$route.query.fnctId,
                    jobTpCd: "C4",
                });
                // this.refreshBranchName = res.branchName;

                // this.refreshFileList = await this.getTargetFileList(
                //   this.refreshBranchName
                // );
                this.editableTabs = [];
                const diffs = res.actions || [];
                this.code = "";
                for (let i = 0; i < diffs.length; i++) {
                    const item = diffs[i];
                    // console.log(item.oldPath)
                    const id1 = this.findFileId(this.children, item.filePath);
                    let language = item.filePath.split(".")[1];
                    const arr1 = item.filePath.split("/");
                    const title = arr1[arr1.length - 1];
                    console.log(id1, "id1");
                    if (item.oldContent !== item.content) {
                        if (id1) {
                            this.editableTabs.push({
                                title: title,
                                code: item.oldContent,
                                language: language,
                                show: true,
                                newCode: item.content,
                                name: title,
                                type: "update",
                                path: item.filePath,
                                id: item.filePath,
                            });
                        } else {
                            this.editableTabs.push({
                                title: title,
                                code: item.oldContent,
                                language: language,
                                show: true,
                                newCode: item.content,
                                name: title,
                                type: item.action,
                                path: item.filePath,
                                id: item.filePath,
                            });
                        }
                    }
                    if (!this.editableTabs.length) {
                        this.$notify({
                            title: "成功",
                            message: "没有需要更新的代码",
                            duration: 2000,
                            type: "success",
                        });
                    }
                    loading.close();
                }
            } catch (e) {
                loading.close();
            }
        },
        deleteBranch(refreshBranchName) {
            this.rpc.newEditor.deleteBranch({
                proId: this.proId,
                brhRef: refreshBranchName,
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
        },
        editableTabsValueChange() {
            let account = 0;
            for (let i = 0; i < this.editableTabs.length; i++) {
                const item = this.editableTabs[i];
                if (item.path === this.editableTabsValue) {
                    this.$nextTick(() => {
                        this.moveTab({
                            index: account,
                        });
                    });

                    return;
                }
                if (item.show) {
                    account++;
                }
            }
        },
        bindMove(el, target) {
            const sideArr = ["right", "left", "top", "bottom"];
            const errmsg = "resizable needs string value of: " + sideArr;
            const minSize = 40;
            const dragSize = 30;
            const dragable = {};
            const oriCur = el.style.cursor;
            const sides = ["right"];
            let dragSide = "";
            let dragging = false;

            if (sides.length === 0) {
                throw errmsg;
            }
            for (let i = 0; i < sides.length; i++) {
                if (sideArr.indexOf(sides[i]) < 0) {
                    throw errmsg;
                }
                dragable[sides[i]] = true;
            }
            el.addEventListener("mousemove", (e) => {
                if (dragging) return;

                if (
                    dragable["right"] &&
                    el.offsetWidth - e.offsetX < dragSize
                ) {
                    el.style.cursor = "ew-resize";
                    dragSide = "right";
                } else if (dragable["left"] && e.offsetX < dragSize) {
                    el.style.cursor = "ew-resize";
                    dragSide = "left";
                } else if (dragable["top"] && e.offsetY < dragSize) {
                    el.style.cursor = "ns-resize";
                    dragSide = "top";
                } else if (
                    dragable["bottom"] &&
                    el.offsetHeight - e.offsetY < dragSize
                ) {
                    el.style.cursor = "ns-resize";
                    dragSide = "bottom";
                } else {
                    el.style.cursor = oriCur;
                    dragSide = "";
                }
            });

            el.addEventListener("mousedown", (e) => {
                if (!dragSide) return;

                dragging = true;
                const cstyle = window.getComputedStyle(target);
                const width = Number.parseInt(cstyle.width);
                const elW = width > 0 ? width : target.offsetWidth;
                const clientX = e.clientX;
                const movefun = (e) => {
                    e.preventDefault();
                    if (
                        dragSide === "right" &&
                        (e.clientX > clientX || target.offsetWidth >= minSize)
                    ) {
                        const res = e.clientX - clientX;
                        target.style.width = elW + res + "px";
                    } else if (
                        dragSide === "left" &&
                        (e.clientX < clientX || target.offsetWidth >= minSize)
                    ) {
                        target.style.width = elW + (clientX - e.clientX) + "px";
                    }
                };
                const removefun = () => {
                    dragging = false;
                    document.removeEventListener("mousemove", movefun);
                    document.removeEventListener("mouseup", removefun);
                };

                document.addEventListener("mousemove", movefun);
                document.addEventListener("mouseup", removefun);
            });
        },
        handleConflictChange(e) {
            this.moveTab(e);
            for (let i = 0; i < this.conflictList.length; i++) {
                const tab = this.conflictList[i];
                if (tab.path === e.name) {
                    this.code = tab.code;
                    this.language = tab.language;
                    tab.show = true;
                    this.conflictList = [...this.conflictList];
                    return;
                }
            }
        },
        handleSuccess() {
            this.operateType = "";
        },
        handleCancle() {
            this.operateType = "";
        },
        hanldeOperate(type) {
            this.operateType = type;
            this.code = "";
            console.log(this.operateType);
        },
        handleShowMerge() {
            console.log("kkkk");
            this.showMerge = true;
        },
        changeValue(value) {
            for (let i = 0; i < this.editableTabs.length; i++) {
                const tab = this.editableTabs[i];
                if (tab.path === this.editableTabsValue) {
                    tab.newCode = value;
                }
            }
        },
        async openFile(item) {
            // /appGitServiceI/queryFileText
            // 如果不为tree 说明是文件
            if (this.operateType === "conflict") {
                for (let i = 0; i < this.conflictList.length; i++) {
                    const tab = this.conflictList[i];
                    // 如果打开过，则使用之前的代码
                    if (tab.path === item.path) {
                        this.code = tab.code;
                        this.language = tab.language;
                        this.editableTabsValue = item.path;

                        this.conflictList = [...this.conflictList];
                        return;
                    }
                }
            }
            if (item.type !== "tree") {
                // 判断之前是否打开过
                for (let i = 0; i < this.editableTabs.length; i++) {
                    const tab = this.editableTabs[i];
                    // 如果打开过，则使用之前的代码
                    if (tab.path === item.path) {
                        this.code = tab.newCode;
                        this.language = tab.language;
                        this.editableTabsValue = item.path;
                        // 判断是普通展示还是diff
                        if (!this.operateType) {
                            tab.show = true;
                        } else if (this.operateType === "commit") {
                            tab.diffShow = true;
                        }
                        this.editableTabs = [...this.editableTabs];
                        this.$nextTick(() => {
                            this.editableTabsValueChange();
                        });
                        return;
                    }
                }
                // 否则 需要请求文件
                const res = await this.proxyRpc("queryFileText", {
                    proId: this.proId,
                    fileId: item.id,
                    filePath: item.path,
                    brhRef: this.branchData.name,
                    authFnctJobInfoId: this.authFnctJobInfoId,
                });
                this.code = res.fileText;
                // 获得文件类型
                this.language = item.name.split(".")[1];
                this.editableTabsValue = item.path;
                this.editableTabs.push({
                    title: item.name,
                    id: item.id,
                    code: res.fileText,
                    ...item,
                    language: this.language,
                    show: true,
                    newCode: res.fileText,
                });
                this.$nextTick(() => {
                    this.editableTabsValueChange();
                });
            }
        },
        // 导航栏返回
        navBack(e) {
            this.goRoute(e);
        },
        // 返回方法
        goRoute(e) {
            if (this.e == "home") {
                this.$router.push({
                    path: "/aop_endentry/t2/list",
                });
            } else {
                // this.$router.back();
                this.$router.push(getSessionStorage("interfaceRouter"));
            }
        },
        handleGoTo(e) {
            this.asideActive = e;
            this.$emit("handleGoTo", e, this.currentD4bObj);
        },
        async getFileText(id, brhRef) {
            const res = await this.proxyRpc("queryFileText", {
                proId: this.proId,
                fileId: id,
                brhRef: brhRef,
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
            return res.fileText;
        },
        // 删除tab后， 自动选择之前的一个
        handleTabsEdit(path) {
            // console.log(e, 'eee')
            // 先找到之前的数据
            // 如果删除当前页面， 需要自动寻找新页面
            if (path === this.editableTabsValue) {
                for (let i = 0; i < this.tabList.length; i++) {
                    const item = this.tabList[i];
                    if (item.path === path) {
                        if (i > 0) {
                            const newTab = this.tabList[i - 1];
                            this.code = newTab.code;
                            this.editableTabsValue = newTab.path;
                            this.language = newTab.language;
                        } else if (this.tabList.length > 1) {
                            // 如果为0 取下一个值
                            const newTab = this.tabList[1];
                            this.code = newTab.code;
                            this.editableTabsValue = newTab.path;
                            this.language = newTab.language;
                        }
                    }
                }
            }

            for (let i = 0; i < this.editableTabs.length; i++) {
                const tab = this.editableTabs[i];
                if (tab.path === path) {
                    // console.log("find");
                    if (this.operateType == "commit") {
                        tab.diffShow = false;
                    } else {
                        tab.show = false;
                    }
                    this.editableTabs = [...this.editableTabs];
                    // return
                }
            }
            // 没有页面了，清空代码
            if (this.tabList.length === 0) {
                this.code = "";
                this.editableTabsValue = "";
            }
        },
        replaceLines2(value, start, end, list) {
            let status = false;
            console.log(start, end);
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    if (i < start || i > end) {
                        continue;
                    } else if (!status) {
                        status = true;
                        item.code = value;
                    } else if (status) {
                        item.status = true;
                    }
                }
            }
        },
        createCode(list) {
            let str = "";
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    if (item.code) {
                        str = str + item.code + "";
                    } else if (!item.status) {
                        str = str + item.value + "\n";
                    }
                }
            }
            return str;
        },
        handleConflictValue(value) {
            for (let i = 0; i < this.conflictList.length; i++) {
                const tab = this.conflictList[i];
                if (tab.path === this.editableTabsValue) {
                    tab.newCode = value;
                }
            }
        },
        moveTab(e) {
            const children = document.querySelectorAll(".el-tabs__item");
            const child = children[e.index];
            if (child) {
                // 计算当前按钮的位置，看是否需要移动
                const spanLeft = child.offsetLeft; // 当前点击的元素左边距离
                const width = child.clientWidth;
                // const divBox = children.clientWidth / 2; // 点击的元素一半宽度
                // const totalWidths = 700; // 屏幕总宽度
                // const widths = totalWidths / 2; // 一半的屏幕宽度
                // const spanRight = totalWidths - spanLeft; // 元素的右边距离
                const scrollBox = document.querySelector(".el-tabs__nav"); // 获取最外层的元素
                const scrollL = scrollBox.scrollLeft; // 滚动条滚动的距离
                const distance = spanLeft + width;
                const containerWidth = scrollL + child.parentNode.clientWidth;
                console.log(spanLeft);
                if (spanLeft < scrollL && distance > scrollL) {
                    scrollBox.scrollTo(spanLeft, 0);
                }
                if (spanLeft > scrollL && distance > containerWidth) {
                    scrollBox.scrollTo(spanLeft, 0);
                }
            }
        },
        createCodeObjList(code) {
            const arr = code.split("\n");
            const list = [];
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                list.push({
                    value: item,
                });
            }
            return list;
        },
        handleChange(e) {
            this.moveTab(e);
            for (let i = 0; i < this.editableTabs.length; i++) {
                const tab = this.editableTabs[i];
                if (tab.path === this.editableTabsValue) {
                    // console.log(tab.ref.handleClick, 'sss')
                    // tab.ref.handleClick(tab, true)
                    if (this.operateType === "conflict") {
                        this.$refs.conflictFileTree?.showBg(tab);
                    } else if (
                        !this.operateType ||
                        this.operateType === "merge"
                    ) {
                        this.$refs.fileTree?.showBg(tab);
                    } else if (this.operateType === "commit") {
                        this.$refs.commitFileTree?.showBg(tab);
                    }
                    this.code = tab.newCode;
                    this.language = tab.language;
                    tab.show = true;
                    this.editableTabs = [...this.editableTabs];
                    return;
                }
            }
            // 如果选择的和当前激活的不同
        },

        async handleConflict(item) {
            this.operateType = "conflict";
            this.targetBranchName = item.targetBranchName;
            const res = await this.proxyRpc("mergeConflictsList", {
                proId: this.proId,
                iid: item.id,
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
            // title: item.name,
            // id: item.id,
            // code: res.fileText,
            // ...item,
            // language: this.language,
            // show: true,
            // newCode: res.fileText,
            this.textarea = res.commitMessage;
            const list = res?.files?.map(async (item) => {
                let code = "";
                const id = this.findFileId(this.targetFileList, item.newPath);
                // 源码
                let oldCode = await this.getFileText(id, "dev");
                let list = this.createCodeObjList(oldCode);
                item?.sections.map((section, sectionsIndex) => {
                    let start = 0;
                    let end = 0;
                    let status = false;
                    const lines = section?.lines;
                    let type = "";
                    lines.map((data, index) => {
                        if (data.type === "old" && !status) {
                            status = true;
                            start = Number(data.oldLine) - 1;
                        }
                        if (
                            data.type === "old" ||
                            (type === "match" && index === lines.length - 1)
                        ) {
                            end = Number(data.oldLine) - 1;
                        }
                        const nextData = section.lines[index + 1];
                        if (data.type) {
                            type = data.type;
                        }
                        if (!section.conflict) {
                            if (
                                data.text.includes("@@") &&
                                data.type === "match"
                            ) {
                                // @@ A @@ B
                                const value = data.text?.split("@@ ")[2];
                                // console.log(data.text.split("@@ "), "qqqq", value);
                                code += value + "\n";
                                start = Number(nextData?.oldLine) - 1;
                            } else {
                                code += data.text + "\n";
                            }
                        } else if (section.conflict && index === 0) {
                            // start
                            code += "<<<<<<<" + "\n";
                            if (data.type === "old") {
                                code += "=======" + "\n";
                            }
                            code += data.text + "\n";
                        } else if (section.conflict) {
                            code += data.text + "\n";
                        }
                        // 当前的是old 且之前的是new或者是空 则需要加上====
                        if (
                            (nextData?.type === "old" || !nextData) &&
                            section.conflict &&
                            data.type === "new"
                        ) {
                            code += "=======" + "\n";
                        }
                        if (
                            section.conflict &&
                            index === section.lines.length - 1
                        ) {
                            code += ">>>>>>>" + "";
                        }
                    });
                    console.log(type, "type");
                    if (type) {
                        this.replaceLines2(code, start, end, list);
                    } else {
                        console.log(code, "code");
                    }
                    type = "";
                    code = "";
                });
                oldCode = this.createCode(list);
                const endName = item.newPath?.split(".")[1] || "";
                this.conflictList.push({
                    id: item.newPath,
                    code: oldCode,
                    title: item.newPath,
                    language: endName,
                    conflictShow: true,
                    ...item,
                    name: item.newPath,
                });

                return {
                    id: item.newPath,
                    code: code,
                    title: item.newPath,
                    language: endName,
                    conflictShow: true,
                    ...item,
                    name: item.newPath,
                };
            });
        },
        loader(loading) {
            // 需要使用的是requirejs去加载AMD格式的monaco，而非node的require模块
            // loader.js负责装载window.require，也可以单独使用requirejs而非自带的loader.js去加载
            // 不要修改monaco-editor/min/vs路径，除非改源码，该版本的MonacoEnvironment不起作用，worker.main.js里面自维护的变量取的不是外面的
            const scripts = document.querySelectorAll("script");
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                if (script.src.includes("editor.main.js")) {
                    return;
                }
            }

            let require = window.require;
            // CDN引入（链接源自官方demo）
            let vsPath = window.origin + "/package/monaco-editor/0.33.0/min/vs";
            // public 引入
            // let vsPath = "monaco-editor/min/vs"
            require.config({ paths: { vs: vsPath } });
            console.log(this.editor, "this.edito33r");
            require(["vs/editor/editor.main"], () => this.toCreate(loading));
        },
        toCreate(loading) {
            loading && loading.close();
            this.loadJs = true;
        },
        getTranList() {
            const res = this.$route.query;
            const params = {
                pageFlg: "1",
                authId: res.authId,
                beltLine: res.beltLine,
                fnctId: res.fnctId,
                jobNo: res.asgntNo,
                currentPage: "1",
                turnPageShowNum: "999",
            };

            this.rpc.assetList
                .queryApiInfoListByPageList(params)
                .then((res) => {
                    res.apiInfoList.map((item) => {
                        item.txId = item.svcId;
                        item.txNm = item.svcNm;
                        item.txEngNm = item.svcCd;
                        return item;
                    });
                    this.tableData = res.apiInfoList;
                    for (let i = 0; i < this.tableData.length; i++) {
                        const element = this.tableData[i];
                        element.status = false;
                    }
                    this.centerDialogVisible = !this.centerDialogVisible;
                });
        },
        //生成代码按钮
        getSaveCodeList() {
            const params = {
                // appId: this.$route.query.projectId,
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId,
                fnctId: this.$route.query.fnctId,
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
                    };
                    // this.tableData.splice(0, 0, newarrList);
                    this.tranData.push(newarrList);
                    console.log(3333333333);
                    this.getTranList();

                    // this.centerDialogVisible = !this.centerDialogVisible;
                });
        },
        toCreateScript(src) {
            let head = document.querySelector("head");
            const scripts = document.querySelectorAll("script");
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                console.log(script.src, "sss");
                if (script.src === src) {
                    script.remove();
                }
            }
            console.log("ssss");
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            let script = document.createElement("script");
            script.onload = () => this.loader(loading);
            script.onerror = () => {
                head.removeChild(script);
            };
            script.src = src;
            console.log(script, "ddd");
            head.appendChild(script);
        },
        // "authFnctJobInfoId":"FM-AAJI-2023081600020923","appNm":"","fnctNo":"FM-GN-2023-000046621"
        // ?viewType=func&isolateWorkspace=T2&modelVersion=100001&modelName=四级活动1&competitorId=10000000&jobId=100001&bizLineId=FM-YWY-2022-000001&appId=A1-YWYY-126562&authId=FM1-AFJI-20231009-00119891&asgntNo=C1-0120042&assetFnctNo=A1-GN-2023-000116862&authAstFnctInfoId=FM1-AAJI-20231009-00090362&fnctNo=A1-ZC-2023-128302&_m_=A13925763
        async getFunctionBranch() {
            const params = {
                authFnctJobInfoId: this.$route.query.authAstFnctInfoId,
                appNm: "", // 应用名称
                fnctId: this.$route.query.fnctId, // 功能编号
                examId: this.$route.query.examId || "",
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryAppyBranchCodeHistoryList(
                params
            );
            const arr =
                res?.applyInfoBranchList[0].fnctDevBranchInfoList[0].branchAddr.split(
                    "/"
                );
            this.modelName = res.applyInfoBranchList[0].projectName;
            this.newId = this.newId
                ? this.newId
                : res.applyInfoBranchList[0].appId;
            this.branchName = arr[arr.length - 1];
            this.branchData =
                res?.applyInfoBranchList[0].fnctDevBranchInfoList[0];
            this.branchData.webUrl = this.branchData.branchAddr;
            this.branchData.name = this.branchName;

            this.getBranchTree();
            return res;
        },
        async getBranchTree() {
            const res = await this.proxyRpc(
                "queryBranchListByProId",
                {
                    authFnctJobInfoId: this.authFnctJobInfoId,
                    proId: this.newId,
                    search: "",
                    acctNo: this.acctNo,
                },
                async (res) => {
                    this.proId = res.proId;
                    this.branchList = res.branchList;
                    // for (let i = 0; i < this.branchList.length; i++) {
                    //   const item = this.branchList[i];
                    //   if (item.name === this.branchName) {
                    //     this.branchData = item;
                    //   }
                    // }
                    this.getFileList();
                    this.targetFileList = await this.getTargetFileList("dev");
                }
            );
        },
        async getFileList() {
            const res = await this.proxyRpc("queryBranchDirectoryList", {
                proId: this.proId,
                brhRef: this.branchData.name,
                brhPath: "",
                recursive: "1",
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
            this.children = res.directoryList;
        },
        async getTargetFileList(branchName) {
            const res = await this.proxyRpc("queryBranchDirectoryList", {
                proId: this.proId,
                brhRef: branchName,
                brhPath: "",
                recursive: "1",
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
            return res.directoryList;
        },

        commitCancle() {
            // if (this.operateType === 'merge') {}
            this.editableTabsValue = "";
            this.textarea = "";
            this.code = "";
            this.$nextTick(() => {
                this.operateType = "";
            });
            this.conflictList = [];
            this.editableTabs = this.editableTabs.map((item) => {
                item.diffShow = false;
                return item;
            });
        },
        findFileId(children, path) {
            let arr = [];
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                if (path === item.path) {
                    return item.id;
                } else {
                    arr = [...arr, ...item.sonDirectoryList];
                }
            }
            if (arr.length === 0) {
                return false;
            }
            return this.findFileId(arr, path);
        },
        async commitFiles() {
            // }
            let list = [];
            if (this.operateType === "conflict") {
                list = this.conflictList.map((item) => {
                    return {
                        filePath: item.newPath,
                        content: item.newCode,
                        action: "update",
                    };
                });
            } else {
                list = this.diffChildren.map((item) => {
                    return {
                        // ...item,
                        filePath: item.path,
                        content: item.newCode,
                        action: item.type === "blob" ? "update" : item.type,
                    };
                });
            }
            const branchName =
                this.operateType === "conflict"
                    ? this.targetBranchName
                    : this.branchData.name;
            const res = await this.proxyRpc("commits", {
                commitMessage: this.textarea,
                actions: list,
                branch: branchName,
                proId: this.proId,
                authFnctJobInfoId: this.authFnctJobInfoId,
            });
            if (this.operateType === "conflict") {
                this.commitCancle();
                this.editableTabs = [];
                this.$refs.mergeBranch.mergeBranch();
                return;
            }
            this.$notify({
                title: "成功",
                message: "提交成功",
                duration: 2000,
                type: "success",
            });
            this.commitCancle();
            this.editableTabs = [];

            this.getFileList();
        },
        topMenuBtnClick(num) {
            if (num == "1") {
                // 系统设计-前端设计预览
            } else if (num == "2") {
                // 系统设计-后端设计S5预览
            } else if (num == "3") {
                // S4设计提交
                this.checkS4SystemDesignResult();
            }
        },
        //2024年1月11日 S4系统设计结果校验
        async checkS4SystemDesignResult() {
            const res = await this.rpc.s4design.checkS4SystemDesignResult({
                fnctNo: this.assetFnctNo || this.$route.query.fnctId,
            });
            this.$refs.checkSystemDesignRef.showDialog(res);
        },
        //确认调用提交设计接口
        checkSystemDesign() {
            this.submitSystemDesign();
        },
        // 查询工程应用列表
        async getAPPlicationList() {
            console.log(333322);

            const data = {
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业Id
                examId: this.$route.query.examId, // 授权作业Id
                fnctId: this.$route.query.fnctId,
            };
            const res = await this.rpc.assetList.queryApplicationFunctionList(
                data
            );
            res.appId = res.transAppId;
            res.projectName = res.transAppCd;
            res.appNm = res.transAppNm;
            this.detailObj = res;
        },
        async showdialogBtn(obj) {
            if (obj == "1") {
                await this.getSaveCodeList();
                // await this.getTranList();
            } else if (obj == "3") {
                await this.getAPPlicationList();
                this.applyConfigVisible = !this.applyConfigVisible;
            }
        },
        handleClose3(obj) {
            this.applyConfigVisible = false;
        },
        async connectListOperate(type, row) {
            const data = {
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业Id
                examId: this.$route.query.examId, // 授权作业Id
                fnctId: this.$route.query.fnctId,
            };
            const res = await this.rpc.assetList.queryApplicationFunctionList(
                data
            );
            row = {
                appId: res.transAppId, //工程应用编号
                examId: this.$route.query.examId, //产品实例ID
                editSt: "0", // 设置编辑操作状态
            };
            if (!row.appId) {
                this.$alert("当前功能还未关联工程，请先去关联工程", "提示", {
                    confirmButtonText: "确定",
                    center: true,
                    callback: (action) => {
                        return false;
                    },
                });
                return;
            }
            let goType = res.transAppId ? "transt" : "channel";
            let params6 = rowInfos(row);
            //跳转应用配置
            if (type == "configured") {
                if (goType == "transt") {
                    //交易
                    window.open(
                        `/aop-h5-sub/#/aop_deploydesign/productionTable/configurationItem?${params6}`,
                        "_blank"
                    );
                } else if (goType == "channel") {
                    //渠道 // 渠道工程直接跳转渠道工程列表第一个的配置页面
                    if (res.chnlAppInfoList[0].appTpCd == "1") {
                        if (res.chnlAppInfoList[0].app2LvlTpCd == "2") {
                            //移动端应用
                            if (
                                res.chnlAppInfoList[0].app3LvlTpCd == "1" ||
                                res.chnlAppInfoList[0].app3LvlTpCd == "2"
                            ) {
                                //iOS 或 Android应用
                                window.open(
                                    `/aop-h5-sub/#/aop_deploydesign/productionTable/mobileChannelApplication?${params6}`,
                                    "_blank"
                                );
                                return;
                            }
                        }
                        window.open(
                            `/aop-h5-sub/#/aop_deploydesign/productionTable/channelApplication?${params6}`,
                            "_blank"
                        );
                    }
                }
            }
        },
    },

    created() {
        // this.loginGitlab()
        // let src =
        //   "/package/monaco-editor/0.33.0/min/vs/loader.js";
        // public 引入
        // let src = 'monaco-editor/min/vs/loader.js';
        // this.toCreateScript(src);
        this.rpc.businessRules
            .queryFunctionRelInfo({
                fnctId: this.fnctId || this.$route.query.fnctId,
            })
            .then((res) => {
                this.fnctNm = res.fnctNm;
            });
    },
    computed: {
        isAction() {
            return this.$route.query.pageMode === "s4design";
        },
        isDisabled() {
            return this.$route.query.pageMode === "preview";
        },
        commitDisabled() {
            // (!textarea && diffChildren.length) || !diffChildren.length || (conflictList.length && !textarea)
            if (this.operateType === "commit") {
                return (
                    (!this.textarea && this.diffChildren.length) ||
                    !this.diffChildren.length
                );
            } else {
                return !this.textarea;
            }
        },
        conflictChildren() {
            const list = this.editableTabs.filter((item) => {
                if (item.code !== item.newCode) {
                    return item;
                }
                return;
            });
            return list;
        },
        diffChildren() {
            const list = this.editableTabs.filter((item) => {
                if (item.code !== item.newCode || item.type === "delete") {
                    return item;
                }
                return;
            });
            return list;
        },
        diffTabList() {
            const list = this.editableTabs.filter((item) => {
                if (item.code !== item.newCode && item.diffShow) {
                    return item;
                }
                return;
            });
            return list;
        },
        fileInfo() {
            for (let i = 0; i < this.editableTabs.length; i++) {
                const item = this.editableTabs[i];
                if (item.path === this.editableTabsValue && item.diffShow) {
                    console.log(item, "diffShow");
                    return {
                        ...item,
                    };
                }
            }
            return {};
        },
        tabList() {
            console.log("tabList, change");
            const list = this.editableTabs.filter((item) => {
                if (item.show && !this.operateType) {
                    return item;
                } else if (item.diffShow && this.operateType == "commit") {
                    return item;
                }
            });
            return list;
        },
    },
    mounted() {
        this.bindMove(this.$refs.moveDiv, this.$refs.leftMove);
        this.$nextTick(async () => {
            await this.getFunctionBranch();
        });
        this.orderDetail = {
            authFnctJobInfoId: this.$route.query.authFnctJobInfoId,
            asgntNo: this.$route.query.asgntNo,
            assetFnctNo: this.$route.query.fnctId,
            fnctNo: this.$route.query.fnctNo,
            assetFnctNm: this.$route.query.modelName,
            bizDomainNo: this.$route.query.beltLine,
            appId: this.$route.query.projectId,
            cstNo: this.$route.query.competitorId,
            authAstFnctInfoId: this.$route.query.authAstFnctInfoId,
        };
    },

    beforeDestroy() {},
    beforeRouteLeave(to, from, next) {
        this.$destroy();
        next();
    },
};
</script>
<style lang="scss">
// @import "./default.scss";
</style>
<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";

.aop_tradecode_page_code {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .top_center_btns {
        position: absolute;
        display: flex;
        right: 120px;
    }
    .transform-y {
        transform: translateY(-50%);
        right: 10px;
    }
    /deep/ .el-tabs {
        background: #fff;
    }
    /deep/ .el-tabs__header {
        margin-bottom: 10px;
    }
    /deep/ .el-tabs__nav-wrap {
        height: 40px;
    }
    /deep/ .design_container_process_left_name {
        margin-left: 10px;
        margin-top: 12px;
        margin-right: 10px;
        margin-bottom: 12px;
        border: 1px solid #eaeaea;
        width: auto;
        border-radius: 4px;
        padding: 5px 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .design_container {
        display: flex;
        width: 100%;
        overflow: hidden;
        position: relative;
        .design_container_aside {
            flex: 0 0 40px;
        }
        .design_container_process {
            flex: 1;
            width: 0;
            display: flex;
            .process_contain_box {
                width: 100%;
                height: calc(100vh - 48px);
                display: flex;
                overflow: hidden;
                position: relative;
                .process_container {
                    width: 100%;
                    height: 100%;
                    margin: 0 auto;
                    display: flex;
                    font-family: $font_regular;
                    overflow: hidden;
                    ::v-deep .el-input__inner {
                        border: 1px solid $pri_br_color;
                        border-radius: $theme_radius;
                    }
                    .process_left {
                        background: $base_white;
                        flex: 0 0 240px;
                        // flex: 0 0 275px;
                        // flex: 0 0 216px;
                        border-right: 1px solid $pri_br_color;
                        position: relative;
                    }
                    .icon_show {
                        position: absolute;
                        right: -10px;
                        top: 50%;
                        margin-top: -30px;
                        z-index: 100;
                        cursor: pointer;
                    }
                    .process_left_interface {
                        position: relative;
                        height: 100%;
                        background: $base_white;
                        flex: 0 0 180px;
                        border-right: 1px solid $pri_br_color;
                    }
                    .icon_class {
                        // position: absolute;
                        // top: 50%;
                        // right: 1px;
                        // cursor: pointer;
                        // img {
                        //   height: 38px;
                        // }
                        position: absolute;
                        top: 50%;
                        width: 11px;
                        height: 84px;
                        line-height: 84px;
                        color: #fff;
                        font-size: 18px;
                        padding-right: 10px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        z-index: 2;
                        background: rgba(0, 0, 0, 0);
                        border-top: 11px solid rgba(0, 0, 0, 0);
                        border-bottom: 11px solid rgba(0, 0, 0, 0);
                        border-right: 11px solid #409eff;
                        right: 1px;
                        i {
                            margin-left: 7px;
                            margin-top: -25px;
                            vertical-align: middle;
                        }
                    }
                    .icon_class1 {
                        position: absolute;
                        top: 50%;
                        width: 11px;
                        height: 84px;
                        line-height: 84px;
                        color: #fff;
                        font-size: 18px;
                        padding-right: 10px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        z-index: 2;
                        background: rgba(0, 0, 0, 0);
                        border-top: 11px solid rgba(0, 0, 0, 0);
                        border-bottom: 11px solid rgba(0, 0, 0, 0);
                        border-left: 11px solid #409eff;
                        i {
                            margin-left: -15px;
                            margin-top: -25px;
                            vertical-align: middle;
                        }
                        // position: absolute;
                        // top: 50%;
                        // left: 1px;
                        // cursor: pointer;
                        // img {
                        //   height: 38px;
                        // }
                    }
                    .process_right {
                        background: $base_white;
                    }
                    .process_main {
                        background: $base_white;
                        display: inline-block;
                        // margin: 16px;
                        .process_divMb {
                            margin-bottom: 2px;
                        }
                        &.four_r {
                            margin-top: 6px;
                        }
                    }
                    .process_middle {
                        @include scrollbar;
                        // background-color: $base_white;
                        flex: 1;
                        overflow-y: hidden;
                        overflow-x: auto;
                        position: relative;
                        margin: 0px 10px 20px;
                        box-shadow: 0 0 0 0 #e7e7ee;
                        .process_box {
                            height: calc(100% - 20px);
                            background-color: $base_white;
                            // padding: 20px 20px 20px;
                            overflow: auto;
                            // margin-top: 50px;
                        }
                        .create_container {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            .el-icon-plus {
                                font-size: 60px;
                            }
                        }
                        .top_btn_area {
                            display: flex;
                            justify-content: space-between;
                            padding: 14px 16px 0;
                            .btn {
                                height: 24px;
                                padding: 0 9px;
                                cursor: pointer;
                                border-radius: 2px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular;
                                letter-spacing: 0;
                                &.back {
                                    background: #ffffff;
                                    border: 1px solid #358aff;
                                    color: #358aff;
                                }
                                &.save {
                                    background: #358aff;
                                    border: 1px solid #358aff;
                                    color: #ffffff;
                                }
                            }
                        }
                        .btn_style {
                            background: #ffffff;
                            display: flex;
                            flex-direction: row-reverse;
                            padding: 10px;
                            .btn_list {
                                top: 12px;
                            }
                            .btn_align {
                                @include mini_button_common;
                                // box-shadow: 0 1px 10px 0 #e7e7e7;
                                // z-index: 5;
                                // padding: 12px 8px;
                                // background: $base_white;
                            }
                        }
                        .flowTabs {
                            // width: 100%;
                            display: flex;
                            justify-content: center;
                            position: relative;
                            // margin-top: 10px;
                            .left_process,
                            .right_process {
                                width: 50%;
                                height: 44px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                // clip-path: polygon(0 0, 100% 0, 93% 100%, 7% 100%);
                                border: 1px solid #358aff;
                                font-weight: 600;
                                background: #ffffff;
                                color: #111111;
                                cursor: pointer;
                                &.active {
                                    color: #ffffff;
                                    font-weight: 600;
                                    background-color: #358aff;
                                }
                                &.left_border {
                                    // border-left: none;
                                }
                            }
                        }
                    }
                }
            }
            .params_contain_box {
                width: 100%;
                height: calc(100vh - 48px);
                background-color: $base_white;
                overflow: auto;
            }
        }
    }
    .newService_dialog {
        .el-select {
            width: 100%;
        }
        ::v-deep .el-form-item__label {
            color: $reg_ft_color;
            font-weight: $font_weight_600;
        }
        .check_formater_btn {
            width: 144px;
        }
    }
    .params_contain_box {
        width: 100%;
        height: 100%;
        height: calc(100vh - 48px);
        background-color: $base_white;
        overflow: auto;
    }
    .info_container_main {
        background-color: $base_white;
        .info_container_fr {
            ::v-deep .search_bar {
                width: 500px;
                margin: 0 auto;
            }
            padding: 16px 24px;
        }
    }
    .steps_box {
        background-color: $base_white;
        padding: 0px 100px;
        width: 100%;
        ::v-deep .el-step__head.is-finish {
            color: $base_white;
            border-color: #358aff;
            .el-step__icon.is-text {
                background-color: #358aff;
            }
        }
        ::v-deep .el-step__head.is-process {
            color: #333;
            border-color: #f8f8f8;
            .el-step__icon.is-text {
                background-color: #f8f8f8;
                .el-step__icon-inner {
                    font-weight: normal;
                }
            }
        }
        ::v-deep .el-step__title.is-process {
            font-weight: normal;
            font-size: 12px;
        }
        ::v-deep .el-step__title.is-finish {
            color: #303133;
            font-size: 12px;
        }
    }
    .form_box {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        ::v-deep .el-textarea__inner {
            width: 400px;
        }
        .el-input,
        .el-select {
            width: 400px;
        }
    }
    .form_item_flex {
        display: flex;
        .icon_right {
            margin-left: 5px;
            display: flex;
            flex-flow: column;
            font-size: 21px;
            i {
                cursor: pointer;
                line-height: 20px;
            }
        }
    }
    .d2Info_dialog {
        ::v-deep .el-dialog {
            margin-top: 5vh !important;
        }
        .iframe_content {
            width: 100%;
            height: 1200px;
        }
    }
    ::v-deep .el-dialog__wrapper {
        overflow: hidden;
    }
    .tips {
        margin-right: 12px;
        transition: none;
    }
    .flow_aside {
        display: flex;
        position: absolute;
        flex-direction: column;
        width: 40px;
        height: 100%;
        z-index: 10;
        ::v-deep .el-menu {
            height: 100%;
            .el-menu-item {
                height: auto;
                padding: 10px 0;
                padding-left: 0 !important;
                border-bottom: 1px solid #e6e6e6;
                text-orientation: upright;
                letter-spacing: 5px;
                div {
                    writing-mode: vertical-lr;
                    margin-left: -10px;
                    margin-right: -10px;
                }
                img {
                    width: 14px;
                    height: 14px;
                    margin-bottom: 8px;
                }
            }
        }
    }
    .design_container_process_left {
        border-right: 1px solid #eaeaea;
        width: 200px;
        background: #fff;
        height: calc(100vh - 48px);
        display: inline-block;
        overflow-y: overlay;
    }
    .design_container_process_middle {
        width: 5px;
        height: calc(100vh - 48px);
    }
    // background: #eaeaea;

    .design_container_process_right {
        flex: 1;
        display: inline-block;
        // background: red;
        height: calc(100vh - 48px);
        overflow-y: scroll;
    }
    .commit-info {
        // height: 20px;
        padding: 10px;
    }
    .commit-btn-container {
        display: flex;
        margin-bottom: 5px;
    }
    .commit-btn {
        margin-left: 10px;
        margin-right: 5px;
    }
    .bold_text {
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .elem_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        padding: 0 16px;
        box-shadow: 0 1px 0.5px 0 #e7e7ee;
        // max-width: 192px;
        &.top_shadow {
            box-shadow: 0 -1px 0.5px 0 #e7e7ee;
        }
        ::v-deep .el-button {
            @include mini_button_common;
        }
    }
    .design_container_process_right_button {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background: #fff;
        padding: 0 16px;

        img {
            width: 20px;
            cursor: pointer;
            margin-right: 10px;
        }
        div {
            margin-right: 12px;
        }
        // div::hov
    }
    /deep/ .el-tabs__nav-prev {
        display: none;
    }
    /deep/ .el-tabs__nav-next {
        display: none;
    }
    /deep/ .el-tabs__nav-scroll {
        overflow-x: scroll;
        width: 100%;
    }
    /deep/ .el-tabs__nav {
        width: 100%;
        // overflow-x: scroll;
        overflow-y: hidden;
        border-right: none;
    }
    /deep/ .el-tabs__nav:last-child {
        // background: red;
        border-right: none;
    }
    /deep/ .el-tabs__item {
        // color: red;
        border-left: none;
        border-right: 1px solid #ddd;
        border-top: 1px solid #dde;
    }
}
</style>
