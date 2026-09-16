<template>
    <div class="aop_endentry_assetList_list_viewConfig">
        <PageHeader
            :breadcrumbs="breadcrumbs"
            @labelClick="labelClick"
        ></PageHeader>
        <el-container style="padding: 0 0; width: 100%; display: block">
            <el-header height="196px" class="preview_container">
                <div class="top_header_display_flex">
                    <div
                        class="preview_content_block"
                        v-for="item in topList"
                        :key="item.id"
                        @click="goTopList(item)"
                    >
                        <div style="display: flex">
                            <div class="preview_content_title_big">
                                <p>工程</p>
                                <p>应用</p>
                            </div>
                            <div class="preview_content_table">
                                <div class="preview_content_table_flex1">
                                    <div class="top_flex">
                                        <p>{{ item.appNm }}</p>
                                        <span class="orange">{{
                                            item.fnctNm || "应用"
                                        }}</span>
                                        <!-- <el-tag type="info" size="small">功能</el-tag> -->
                                    </div>
                                </div>
                                <div class="preview_content_table_flex">
                                    <p>
                                        {{ item.projectName }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="preview_content_table_flex_bottom">
                            <span>{{ item.appDesc }}</span>
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
                    <div class="preview_content_table_wrap">
                        <h3>基本信息</h3>
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
                        <div class="preview_content_table_flex">
                            <p>
                                应用描述：
                                <span>{{ topInfo.appDesc }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-show="defaultActive == 'B'">
                    <div class="preview_content_table_wrap2">
                        <div class="preview_content_table_flex">
                            <p>
                                配置中心地址：
                                <span>{{ topInfo2.confCenterAddr }}</span>
                            </p>
                        </div>
                        <div class="header_bot_line"></div>
                        <el-tabs
                            v-model="defaultActive1"
                            @tab-click="handleTabClick1"
                            style="padding: 0px 24px"
                        >
                            <el-tab-pane label="开发环境" name="1"></el-tab-pane>
                            <el-tab-pane label="SIT环境" name="2"></el-tab-pane>
                            <el-tab-pane label="UAT环境" name="3"></el-tab-pane>
                            <el-tab-pane
                                label="投产演练环境"
                                name="4"
                            ></el-tab-pane>
                        </el-tabs>
                        <h3>配置列表</h3>
                        <el-table
                            :data="table2"
                            align="center"
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#333',
                            }"
                            size="medium"
                            style="padding: 0px 24px"
                        >
                            <el-table-column
                                property="confKey"
                                label="key"
                                min-width="150"
                            ></el-table-column>
                            <el-table-column
                                property="confVal"
                                label="value"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                property="confDesc"
                                label="备注"
                                min-width="280"
                            ></el-table-column>
                            <el-table-column
                                property="updNm"
                                label="最后修改人"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                property="updTm"
                                label="最后修改时间"
                                min-width="180"
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
                <!-- 会话中心 -->
                <div v-show="defaultActive == 'C'">
                    <div class="preview_content_table_wrap">
                        <h3>会话数据</h3>
                        <el-table
                            :data="table5"
                            align="center"
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#333',
                            }"
                            size="medium"
                            :key="tabelKey"
                            :expand-row-keys="expandID"
                            row-key="id"
                            ref="listTable"
                            @expand-change="handleExpandChange"
                            :default-expand-all="true"
                        >
                            <el-table-column
                                property="paramCode"
                                label="英文名称"
                                min-width="150"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.paramCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="paramName"
                                label="中文名称"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                property="paramType"
                                label="变量数据类型"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                property="paramDefaultValue"
                                label="默认值"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                property="paramDesc"
                                label="描述"
                                min-width="180"
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div v-show="defaultActive == 'D'">
                    <div class="preview_content_table_wrap">
                        <h3>基础分支信息</h3>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                应用代码模板(archetype)：
                                <span class="right_text">{{
                                    topInfo3.archeTypeAddr
                                }}</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                master：
                                <span class="right_text">{{
                                    topInfo3.masterAddr
                                }}</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                uat：
                                <span class="right_text">{{
                                    topInfo3.uatAddr
                                }}</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                sit：
                                <span class="right_text">{{
                                    topInfo3.sitAddr
                                }}</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                dev：
                                <span class="right_text">{{
                                    topInfo3.devAddr
                                }}</span>
                            </div>
                        </div>
                        <div class="preview_content_table_flex">
                            <div class="topinfo_p">
                                <span
                                    class="green"
                                    v-if="topInfo3.crtSts == '01'"
                                    >已建</span
                                ><span
                                    class="red"
                                    v-if="topInfo3.crtSts == '00'"
                                    >未建</span
                                >
                                standard：
                                <span class="right_text">{{
                                    topInfo3.standardAddr
                                }}</span>
                            </div>
                        </div>
                        <h3>功能开发分支</h3>
                        <el-table
                            :data="table3"
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#333',
                                padding: '0px',
                                height: '40px',
                            }"
                            default-expand-all="true"
                            style="width: 100%"
                        >
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-table
                                        :data="props.row.fnctDevBranchInfoBOList"
                                        :header-cell-style="{
                                            background: '#F5F5F8',
                                            color: '#333',
                                            padding: '0px',
                                            fontSize: '12px',
                                            height: '32px',
                                        }"
                                        :show-header="false"
                                        style="width: 100%"
                                    >
                                        <el-table-column
                                            width="44"
                                            prop=""
                                            label=""
                                        ></el-table-column>
                                        <el-table-column
                                            prop="branchNm"
                                            label="分支名称"
                                            min-width="250"
                                        >
                                            <template slot-scope="scope">
                                                <div class="branchNmBody">
                                                    <span class="noneState" v-if="scope.row.crtSts == '00'" style="text-indent: 20px">未建</span>
                                                    <span class="succeedState" v-if="scope.row.crtSts == '01'" style="text-indent: 20px">已建</span>
                                                    <span>{{scope.row.branchNm}}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            min-width="350"
                                            prop="branchAddr"
                                            label="分支地址"
                                        ></el-table-column>
                                        <el-table-column
                                            min-width="100"
                                            prop="deloperNm"
                                            label="开发人员"
                                        >
                                            <template slot-scope="scope">
                                                <div v-for="item in scope.row.developerInfoBOList" :key="item.appGitBaseUserId">
                                                    <span>{{item.usrNm || "/" || scope.row.usrNm}}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="branchNm"
                                label="分支名称"
                                min-width="250"
                            >
                                <template slot-scope="scope">
                                    <div class="branchNmBody">
                                        <span class="noneState" v-if="scope.row.crtSts == '00'" style="text-indent: 20px">未建</span>
                                        <span class="succeedState" v-if="scope.row.crtSts == '01'" style="text-indent: 20px">已建</span>
                                        <span>{{scope.row.branchNm}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="fnctBranchAddr"
                                min-width="350"
                                label="分支地址"
                            ></el-table-column>
                            <el-table-column
                                property="deloperNm"
                                label="开发人员"
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.deloperNm || "/"}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <!-- 环境变量列表 -->
                <div v-show="defaultActive == 'E'">
                    <div class="preview_content_table_wrap">
                        <el-tabs
                            v-model="defaultActive2"
                            @tab-click="handleTabClick2"
                        >
                            <el-tab-pane label="开发环境" name="1"></el-tab-pane>
                            <el-tab-pane label="SIT环境" name="2"></el-tab-pane>
                            <el-tab-pane label="UAT环境" name="3"></el-tab-pane>
                            <el-tab-pane
                                label="投产演练环境"
                                name="4"
                            ></el-tab-pane>
                        </el-tabs>
                        <h3>基本信息</h3>
                        <div class="preview_content_table_flex">
                            <p>
                                主机信息：
                                <span>{{ topInfo4.hstInfo }}</span>
                            </p>
                            <p>
                                机器数量：
                                <span>{{ topInfo4.deployCount }}</span>
                            </p>
                        </div>
                        <div class="preview_content_table_flex">
                            <p style="width: 100%">
                                服务器配置：
                                <span v-if="topInfo4.srcType">{{
                                    topInfo4.srcType == 1
                                        ? "低配"
                                        : topInfo4.srcType == 2
                                        ? "中配"
                                        : "高配"
                                }}</span>
                                <span v-if="topInfo4.cpuCount">CPU：{{ topInfo4.cpuCount }}核</span>
                                <span v-if="topInfo4.memoryCount">内存：{{ topInfo4.memoryCount }}</span>
                                <span v-if="topInfo4.diskSpace">硬盘：{{ topInfo4.diskSpace }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <!-- 交易列表 -->
                <div v-show="defaultActive == 'F'">
                    <div class="preview_content_table_wrap">
                        <h3>活动列表</h3>
                        <div class="table_list">
                            <el-table :data="table6" :header-cell-style="{ background: '#F5F5F8', color: '#333' }"  ref="expandTable" :row-key="getRowKeys" :expand-row-keys="expandArray" @current-change="clickRowHandle">
                            <el-table-column prop="assetNo" label="" width="55" type="expand">
                                <template slot-scope="props">
                                    <el-table :data="props.row.fnctInfoList" :header-cell-style="{ background: '#F5F5F8', color: '#333' }" style="margin-left: 31px">
                                        <el-table-column prop="fnctNo" label="功能编码" min-width="150"></el-table-column>
                                        <el-table-column prop="fnctNm" label="功能名称" min-width="150"></el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column prop="assetNo" label="活动编码" min-width="150"></el-table-column>
                            <el-table-column prop="assetNm" label="活动名称" min-width="150"></el-table-column>
                        </el-table>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import DetailTabs from "./components/detail_tabs.vue";
import { mapGetters } from "vuex";
export default {
    mixins: [mixin],
    components: {
        PageHeader,
        DetailTabs,
    },
    data() {
        return {
            // 表单数据
            showLoading: false,
            orderDetail: {},
            topList: [],
            tabsList: [
                { v: "工程应用基本信息", k: "A" },
                { v: "配置中心信息", k: "B" },
                { v: "会话数据", k: "C" },
                { v: "活动列表", k: "F" },
                { v: "代码库（Git）", k: "D" },
                { v: "环境资源信息", k: "E" },
            ],
            defaultActive2: "1",
            // 默认页签
            defaultActive: "A",
            defaultActive1: "1",
            // 底部4个列表
            table1: [],
            table2: [],
            table3: [],
            table4: [],
            // 会话中心和交易列表
            ExpandedNum: 0,
            tabelKey: true,
            expandID: [],
            table5: [],
            table6: [],
            formSearch: {
                resourceradio: 1,
                resourceradio2: 1,
            },
            topInfo: {},
            topInfo2: {},
            topInfo3: {},
            topInfo4: {},
            // 列表数据
            currentPage2: 1,
            pageSize2: 10,
            currentPage3: 1,
            pageSize3: 10,
            getRowKeys(row){
                return row.id
            },
            expandArray: [],
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
        breadcrumbs() {
            return [
                {
                    label: "后端开发",
                    operate: "lowerDevelop",
                },
                {
                    label: "查看配置",
                },
            ];
        },
    },
    watch: {
        ExpandedNum: {
            deep: true,
            handler(val) {
                this.ExpandedNum = val;
            },
        },
    },
    methods: {
        // 顶部导航栏点击
        labelClick(e) {
            this.$router.go(-1);
        },
        // 返回
        reBack() {
            this.$router.go(-1);
        },
        //tab切换
        handleTabClick(e) {
            // 切换表单
            if (e == "A") {
                this.table2 = [];
                this.table3 = [];
                this.table4 = [];
                this.table5 = [];
                this.table6 = [];
                this.getTabOneInfo();
            } else if (e == "B") {
                this.table1 = [];
                this.table3 = [];
                this.table4 = [];
                this.table5 = [];
                this.table6 = [];
                this.getTabUrlDeatil();
                this.getDisposeUrlInfoList();
            } else if (e == "C") {
                this.table2 = [];
                this.table4 = [];
                this.table1 = [];
                this.table3 = [];
                this.table6 = [];
                this.getSessiondataList();
            } else if (e == "D") {
                this.table2 = [];
                this.table4 = [];
                this.table1 = [];
                this.table5 = [];
                this.table6 = [];
                this.getGitListInfo();
            } else if (e == "E") {
                this.table2 = [];
                this.table3 = [];
                this.table1 = [];
                this.table5 = [];
                this.table6 = [];
                this.getConfigurationList();
            } else if (e == "F") {
                this.table2 = [];
                this.table3 = [];
                this.table1 = [];
                this.table5 = [];
                this.table4 = [];
                this.getBusinessList();
            }
            this.defaultActive = e;
        },
        listnameDetail(type, value) {
            console.log("交易名称跳转应用", type, value);
            // 传参：apiId(服务id)
            window.open(
                `/aop-h5-sub/#/aop_tradedesign/d4workbench/transDetail?apiId=${value.txId}`,
                "_blank"
            );
        },
        handleExpandChange(e,v){
            console.log(e,"点击展开",v)
        },
        // 配置中心地址查询
        handleTabClick1(e) {
            this.formSearch.resourceradio2 = e.name;
            console.log("第二个菜单点击切换", e);
            this.getDisposeUrlInfoList();
        },
        // 环境资源切换查询
        handleTabClick2(e) {
            this.formSearch.resourceradio = e.name;
            console.log("第六个菜单点击切换", e);
            this.getConfigurationList();
        },
        handleSizeChange2(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize2 = val;
            let list = this.applyViewList.slice(
                (this.currentPage2 - 1) * val,
                this.currentPage2 * val
            );
            // 分页新数组
            this.applyViewList = list;
        },
        handleCurrentChange2(val) {
            this.currentPage2 = val;
        },
        handleSizeChange3(val) {
            this.pageSize3 = val;
            let list = this.applyViewList.slice(
                (this.currentPage3 - 1) * val,
                this.currentPage3 * val
            );
            // 分页新数组
            this.applyViewList = list;
        },
        handleCurrentChange3(val) {
            this.currentPage3 = val;
        },
        handleSelectionChange(e) {
            this.multipleSelection = val;
        },
        saveApplyDialog(e) {
            // 保存应用编辑部署
            this.showApplyDialog = false;
        },
        goTopList(obj) {
            this.orderDetail.appConfigApplicationId =
                obj.appConfigApplicationId;
            this.orderDetail.appId = obj.appId;
        },
        // 环境资源配置信息
        async getConfigurationList(obj) {
            const params = {
                appId: this.orderDetail.appId, // ID
                envTypeCode: this.formSearch.resourceradio, //环境类型代码 (1-开发环境; 2-SIT环境; 3-UAT环境; 4-生产环境
            };
            this.showLoading = true;
            const res =
                await this.rpc.assetList.queryLookDisposeConfigurationList(
                    params
                );
            this.showLoading = false;
            this.topInfo4 = res;
        },
        // 查询代码分支信息列表
        async getBranchList(obj) {
            const params = {
                fnctBranchId: obj, // 功能活动分支ID
            };
            this.showLoading = true;
            this.rpc.assetList
                .queryLookDisposeBranchList(params)
                .then((res) => {
                    this.showLoading = false;
                    this.table3 = res.devBranchList;
                })
                .catch((err) => {
                    console.log("11111111", err);
                });
            this.showLoading = false;
        },
        // 查询代码库基础分支信息
        async getBranchInfo() {
            const params = {
                appConfigApplicationId:
                    this.orderDetail.appConfigApplicationId || "", // 配置申请号
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId || "", // 授权作业信息ID
                appId: this.orderDetail.appId || "", // 应用ID
            };
            this.showLoading = true;
            // const res = await this.rpc.assetList.queryLookDisposeBranchInfo(params);
            this.rpc.assetList
                .queryLookDisposeBranchInfo(params)
                .then((res) => {
                    this.showLoading = false;
                    this.topInfo3 = res;
                    if (res.fnctBranchInfo) {
                        this.getBranchList(res.fnctBranchInfo.fnctBranchId);
                    }
                })
                .catch((err) => {
                    // console.log("11111111", err);
                    this.showLoading = false;
                    this.defaultActive = "A";
                    if (err.errorCode == "1") {
                    }
                });
            // console.log("基础分支信息的数据", this.topInfo3);
        },
        //  会话数据列表
        async getSessiondataList() {
            const params = {
                appId: this.orderDetail.appId, // 应用ID
                paramCateg: "1", // 数据分类(1-会话数据; 2-缓存数据;3-平台数据;4-应用数据)
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryLookDisposeSessiondata(
                params
            );
            this.showLoading = false;
            let list = res.pubDataList || [];
            // 子节点是否展示
            list.forEach((item, index) => {
                var num = 0;
                item.id = index + 1;
                if (item.children.length > 0) {
                    item.children.forEach((itm, idx) => {
                        itm.id = item.id + "" + (idx + 1);
                        if (itm.children.length > 0) {
                            itm.children.forEach((pro, li) => {
                                pro.id = itm.id + "" + (li + 1);
                            });
                        }
                    });
                }
            });
            // this.findArr(list);
            this.table5 = list;
            // console.log("组合后的数据", this.table5);
        },
        findArr(list) {
            for (i in list) {
                var data = list[i];
                this.ExpandedNum++;
                if (data.children.length > 0) {
                    data.id = i + 1;
                    this.findArr(data.children); //自己调用自己增加ID
                } else {
                    data.id = i + 1;
                }
            }
        },
        // 加载配置中心地址
        async getTabUrlDeatil() {
            const params = {
                appId: this.orderDetail.appId, // 应用ID
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryLookDisposeUrlInfo(
                params
            );
            // console.log("工程应用第二个TAB地址信息", res);
            this.showLoading = false;
            this.topInfo2 = res;
        },
        // 加载配置中心配置列表
        async getDisposeUrlInfoList() {
            const params = {
                appId: this.orderDetail.appId, // 应用ID
                envTypeCode: this.formSearch.resourceradio2, //环境类型代码 (1-开发环境; 2-SIT环境; 3-UAT环境; 4-生产环境
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryLookDisposeUrlInfoList(
                params
            );
            // console.log("工程应用第二个TAB配置列表", res);
            this.showLoading = false;
            this.table2 = res.confList || [];
        },
        // 加载工程应用基本信息
        async getTabOneInfo() {
            const params = {
                appId: this.orderDetail.appId, // 应用ID
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryLookDisposeDetailInfo(
                params
            );
            // console.log("工程应用第一个TAB基本信息", res);
            this.showLoading = false;
            this.topInfo = res || {};
        },
        // 加载应用配置申请列表
        async getApplyListTop() {
            const params = {
                // 头部菜单列表
                appId: this.orderDetail.appId,
                authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业信息ID
                currentPage: "1",
                turnPageShowNum: "10",
            };
            this.showLoading = true;
            const res = await this.rpc.assetList.queryLookDisposeList(params);
            // console.log("工程应用顶部列表", res);
            this.showLoading = false;
            this.topList = res.confList || [];
            if (this.topList.length > 0) {
                this.orderDetail.appConfigApplicationId =
                    this.topList[0].appConfigApplicationId;
                this.orderDetail.appId = this.topList[0].appId;
            }
        },
        // 交易列表
        async getBusinessList() {
            const params = {
                // authFnctJobInfoId: this.orderDetail.authFnctJobInfoId, // 授权作业信息ID
                // txNm: this.formSearch.txNm, // 交易名称
                // txCd: this.formSearch.txCd, // 交易ID
                // blgPojAppId: "", // 所属工程应用ID
                // currentPage: this.currentPage1,
                // turnPageShowNum: this.pageSize1,
                projectId: this.orderDetail.appId,
                projectType: '2', // 2交易 1工程
            };
            this.showLoading = true;
            const res = await this.rpc.newEditor.queryAssetFnctListByProjectId(
                params
            );
            // console.log("交易和工程应用配置列表", res);
            this.showLoading = false;
            this.$nextTick(() => {
                this.table6 = res.assetInfoList.map((item,index)=>{
                    return {
                        id: index +1,
                        ...item,
                    }
                });
                this.total1 = res.turnPageTotalNum;
                this.clickRowHandle(this.table6[0]); // 默认展开交易列表第一行数据
            });
            // 过滤重组table5 appId appNm
            let newList = res.assetInfoList;
            let arrTable5 = [];
            newList.forEach((item, index) => {
                let obj = {
                    appId: item.blgPojAppId,
                    appNm: item.appNm,
                    txId: item.txId,
                    id: index + 1,
                };
                arrTable5.push(obj);
            });
            this.table5 = [...new Set(arrTable5)];
        },
        clickRowHandle(row, column, event) {
            if (this.expandArray.includes(row.id)) {
                this.expandArray = this.expandArray.filter((val) => val !== row.id);
            } else {
                this.expandArray.push(row.id);
            }
            // console.log(this.expandArray,"1111111111")
        },
        //新版获取git仓库列表
        async getGitListInfo(){
            let params = {
                appId: this.orderDetail.appId || '',
                appTypeCode: '2', //应用类型代码 1-渠道端应用; 2-交易4b应用; 3-服务L5应用
            }
            let res = await this.rpc.newEditor.getGitListInfo(params);
            this.topInfo3 = res;
            this.table3 = res.aopRunFunctionBranchBOList
            console.log("res====>",res)
        }
    },
    created() {
        this.orderDetail = this.$route.query;
        this.$nextTick(() => {
            let list = [
                {
                    id: 1,
                },
            ];
            list.forEach((item) => {
                item = Object.assign(item, this.orderDetail);
            });
            this.topList = list;
            // this.getApplyListTop(); // 查询
            this.getTabOneInfo();
        });
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_viewConfig {
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    .preview_container {
        display: flex;
        width: 100%;
        flex-direction: column;
        padding: 0 16px;
        width: 100%;
        margin-top:12px;
        .top_header_display_flex {
            width: 100%;
            display: flex;
            background: #ffffff;
            align-items: center;
            margin-bottom: 12px;
            .preview_content_block {
                padding: 16px 16px;
                background: $base_white;
                display: flex;
                flex-direction: column;
                .preview_content_table_flex_bottom {
                    display: flex;
                    width: 100%;
                    margin-top: 5px;
                    p {
                        color: $pri_ft_color;
                        font-size: 12px;
                    }
                    span {
                        font-size: 12px;
                        color: #999999;
                    }
                }
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
                            font-size: 12px;
                        }
                        span {
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                    .preview_content_table_flex1 {
                        display: flex;
                        width: 100%;
                        align-items: center;
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
                }
                .preview_content_table2 {
                    margin: 16px 0 20px 0;
                    color: #131313;
                    padding: 5px 24px 5px 24px;
                    p {
                        margin-top: 10px;
                        color: $pri_ft_color;
                        span {
                            color: #131313;
                        }
                        .span_link {
                            color: rgb(2, 151, 215) !important;
                            cursor: pointer !important;
                        }
                    }
                    .imgUrl {
                        display: flex;
                    }
                }
                .preview_content_title_big {
                    font-family: $font_medium;
                    font-size: 14px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    color: #ffffff;
                    width: 60px;
                    height: 60px;
                    border-radius: 8px 8px;
                    background: #358aff;
                    letter-spacing: 0;
                    font-weight: $font_weight_600;
                    margin-bottom: 10px;
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
        }
        .detailTab {
            width: 100%;
            background: #ffffff;
        }
    }
    .preview_main {
        width: 100%;
        padding: 0px 16px;
        .preview_content_table_wrap {
            color: #131313;
            padding-bottom: 5px;
            background: #ffffff;
            padding: 16px 16px;
            max-height: calc(100vh - 316px);
            min-height: calc(100vh - 316px);
            overflow-y: auto;
            ::v-deep .el-tabs__nav-wrap::after {
                background: #ffffff;
            }
            ::v-deep .el-tabs__active-bar {
                min-width: 56px !important;
            }
            h3 {
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 36px;
            }
            .preview_content_table_flex {
                display: flex;
                width: 100%;
                padding:10px 0;
                p {
                    color: #333333;
                    font-size: 14px;
                    width: 50%;
                    ::v-deep .el-radio {
                        margin-right: 5px;
                    }
                    span {
                        color: #333333;
                        font-size: 14px;
                        margin-right: 5px;
                    }
                }
            }
            .table_list{
                ::v-deep .el-table__expand-icon {
                    .el-icon-arrow-right:before {
                        content: '\e791' !important;
                        font-size: 16px;
                    }
                }
            }
            ::v-deep .el-table__expand-icon {
                .el-icon-arrow-right:before {
                    content: '\e791' !important;
                    font-size: 16px;
                }
            }
        }
        .preview_content_table_wrap2 {
            color: #131313;
            padding-bottom: 5px;
            background: #ffffff;
            max-height: calc(100vh - 340px);
            overflow-y: auto;
            ::v-deep .el-tabs__nav-wrap::after {
                background: #ffffff;
            }
            ::v-deep .el-tabs__active-bar {
                min-width: 56px !important;
            }
            h3 {
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 36px;
                padding: 0px 24px;
            }
            .header_bot_line {
                width: 100%;
                height: 1px;
                background: #e5e5e5;
            }
            .preview_content_table_flex {
                display: flex;
                width: 100%;
                padding: 16px 24px;
                p {
                    margin-top: 6px;
                    color: #999999;
                    font-size: 14px;
                    width: 50%;
                    ::v-deep .el-radio {
                        margin-right: 5px;
                    }
                    span {
                        color: #333333;
                        font-size: 14px;
                        margin-right: 5px;
                    }
                }
            }
        }
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .btn_el_pageNation {
            display: flex;
            justify-content: center;
            padding: 16px 0;
        }
        .radio_group_line_top {
            display: flex;
            .dialog_table_title_top {
                width: 100%;
                display: flex;
                align-items: center;
                margin: 10px 0px;
            }
        }
    }
    .lowCodeDown {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 10px 0;
        span {
            color: red;
            font-size: 13px;
            margin-left: 5px;
        }
    }
    .demo-form-inline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .topinfo_p {
        color: #999999;
        font-size: 14px;
        margin-bottom: 10px;
        .red {
            color: #fe4758;
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #fe4758;
            font-size: 12px;
        }
        .green {
            color: #36d542;
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #36d542;
            font-size: 12px;
        }
        .right_text {
            font-size: 14px;
            color: #333333;
        }
    }
    .noneState{
        border: 0.5px solid rgba(254, 71, 88, 1);
        border-radius: 2px;
        color: #fe4758;
        font-size:13px;
        padding: 0px 4px;
    }
    .succeedState {
        border: 0.5px solid rgba(54, 213, 66, 1);
        border-radius: 2px;
        color: #36d542;
        font-size:13px;
        padding: 0px 4px;
    }
}
</style>
