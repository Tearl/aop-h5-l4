<template>
    <div class="aop_tradecode_comps_demandserv_list">
        <PageDialog
            dialogTitle=""
            :dialogVisiable="dialogVisible"
            dialogWidth="80%"
            @closeDialog="closeDialog"
            class="dialog"
            :apTobody="true"
        >
            <div slot="title">
                <div class="title_content">
                    <div class="title">选择服务</div>
                    <div class="top_btn_flex">
                        <el-radio-group
                            v-model="changeTabs"
                            size="medium"
                            @change="handleChangeTab"
                        >
                            <el-radio-button
                                v-for="item in labelTbs"
                                :key="item.value"
                                :label="item.value"
                                >{{ item.label }}</el-radio-button
                            >
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div slot="box">
                <el-container style="padding: 0" class="dialog_cont">
                    <el-aside
                        width="200px"
                        v-if="changeTabs == 'service'"
                        style="border-right: 1px solid #dedede"
                    >
                        <h3>需求列表</h3>
                        <div class="top_add">
                            <el-input
                                placeholder="请输入需求名称"
                                size="small"
                                v-model="filterText"
                            ></el-input>
                            <el-tooltip
                                effect="dark"
                                :content="'新建服务需求'"
                                placement="top"
                            >
                                <i
                                    class="el-icon-plus list_item_icon"
                                    @click.stop="addNewser()"
                                ></i>
                            </el-tooltip>
                        </div>

                        <el-tree
                            ref="menuTree"
                            node-key="id"
                            :data="dataTree"
                            :highlight-current="true"
                            :props="defaultProps"
                            :default-checked-keys="expandFirstNodskey"
                            :current-node-key="currentNodeKey"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                        >
                            <span
                                class="custom-tree-node"
                                slot-scope="{ node, data }"
                            >
                                <span
                                    :title="node.label"
                                    class="node_label"
                                    :style="{
                                        color: data.checked
                                            ? ' #358AFF'
                                            : '#333333',
                                    }"
                                    >{{ node.label }}</span
                                >
                                <span
                                    class="brage_item"
                                    :class="{
                                        green: data.demandStatus == '02',
                                        red: data.demandStatus == '01',
                                    }"
                                ></span>
                            </span>
                        </el-tree>
                    </el-aside>
                    <el-main style="padding: 0">
                        <el-header
                            v-if="
                                changeTabs == 'service' && dataTree.length > 0
                            "
                            style="
                                height: auto;
                                border-bottom: 1px solid #dddddd;
                            "
                        >
                            <el-form
                                ref="ruleForm"
                                :model="checkDemandInfo"
                                label-width="90px"
                                class="form_info"
                            >
                                <el-form-item label="需求名称：">
                                    <span>{{
                                        checkDemandInfo.demandName
                                    }}</span>
                                </el-form-item>
                                <el-form-item label="需求描述：">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 3, maxRows: 20 }"
                                        v-model="checkDemandInfo.demandDesc"
                                        disabled
                                        maxlength="500"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="回复状态：">
                                    <span slot="label">回复状态：</span>
                                    <span
                                        style="color: #f70019"
                                        v-if="
                                            checkDemandInfo.demandStatus == '01'
                                        "
                                        >未回复</span
                                    >
                                    <span
                                        style="color: #36d542"
                                        v-if="
                                            checkDemandInfo.demandStatus == '02'
                                        "
                                        >已回复</span
                                    >
                                </el-form-item>
                                <el-form-item label="回复内容：">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 3, maxRows: 20 }"
                                        v-model="
                                            checkDemandInfo.demandReplyDesc
                                        "
                                        maxlength="500"
                                        disabled
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                        </el-header>
                        <ServiceTop
                            ref="formRef"
                            :serviceForm="serviceForm2"
                            :form="form2"
                            class="service_top"
                            style="padding: 0 24px !important"
                            labelwidth="auto"
                            v-if="
                                (changeTabs == 'service' &&
                                    dataTree.length > 0) ||
                                changeTabs == 'rule' ||
                                changeTabs == 'all'
                            "
                        >
                            <div slot="rightButton">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="search"
                                    class="right_button"
                                    >搜索</el-button
                                >
                                <el-button
                                    size="small"
                                    @click="reset"
                                    class="right_button"
                                    >重置</el-button
                                >
                            </div>
                        </ServiceTop>
                        <div
                            class="content"
                            v-if="
                                (changeTabs == 'service' &&
                                    dataTree.length > 0) ||
                                changeTabs == 'rule' ||
                                changeTabs == 'all'
                            "
                        >
                            <div class="table_operate">
                                <div class="header_content">
                                    <h1>服务列表</h1>
                                </div>
                            </div>
                            <Table
                                ref="dictListTableRef"
                                class="table_style"
                                :table="
                                    changeTabs == 'service'
                                        ? tables2
                                        : changeTabs == 'rule'
                                        ? tables
                                        : tables3
                                "
                                :data="dictList"
                                :rowK="'serialNumber'"
                                :treeProps="{ children: 'children' }"
                                :tableType="'selection'"
                                selectName="aiState"
                                @selectionChange="handleSelectionChange"
                                @operate="operate"
                            ></Table>
                            <PagePagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :pager="pager"
                                v-if="
                                    changeTabs == 'rule' ||
                                    changeTabs == 'all'
                                "
                            >
                            </PagePagination>
                        </div>
                        <el-empty
                            v-if="
                                changeTabs == 'service' && dataTree.length == 0
                            "
                            description="暂无数据"
                        ></el-empty>
                    </el-main>
                </el-container>
            </div>
            <span slot="footer">
                <div
                    class="show_conf"
                    v-if="
                        (changeTabs == 'service' && dataTree.length > 0) ||
                        changeTabs == 'rule' ||
                        changeTabs == 'all'
                    "
                >
                    <div class="show_conf_title">
                        已选择{{ tableData && tableData.length }}个：
                    </div>
                    <div class="show_conf_content">
                        <el-tag
                            v-for="(item, index) in tableData"
                            :key="index"
                            type="info"
                            size="small"
                            closable
                            class="show_conf_tag"
                            @close="delParamsTag(item)"
                        >
                            {{ item.aiName }}
                        </el-tag>
                    </div>
                </div>
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </PageDialog>
        <DecisionList ref="decisionTreeCountRef"></DecisionList>
        <!-- 新建需求服务抽屉 -->
        <el-dialog
            title="新建需求"
            class="addNewDemand"
            :visible.sync="dialogVisibleNew"
            width="60%"
        >
            <div class="content" style="padding: 12px 0">
                <AddDemandInfo
                    :functionId="fnctId"
                    ref="demandInfoRef"
                    rowK="AddDemandInfo"
                    :showType="drawShowType"
                    :topInfo="topInfo"
                    @closeDrawer="closeDrawer"
                    v-if="newlabelShow"
                ></AddDemandInfo>
            </div>
            <!-- <span slot="footer">
                <el-button @click="dialogVisibleNew=false">取 消</el-button>
                <el-button type="primary" @click="closeDrawer">确 定</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_select_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import DecisionList from "./decisionList";
import AddDemandInfo from "../d4design_process/components/add_demandInfo";

export default {
    mixins: [mixin],
    components: {
        PageDialog,
        PagePagination,
        Table,
        ServiceTop,
        DecisionList,
        AddDemandInfo,
    },
    props: {
        currentInterfaceObj: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        beltLineSelectList() {
            if (this.beltLine == 'FM-YWY-2022-000006') {
                // 当前是公共域
                return this.businessDomainLists;
            } else {
                return [
                    {
                        type: this.getBizName("FM-YWY-2022-000006"),
                        value: "FM-YWY-2022-000006"
                    },
                    {
                        type: this.getBizName(this.beltLine),
                        value: this.beltLine
                    }
                ]
            }  
            
        },
        serviceForm2() {
            return this.changeTabs == 'all' ? [
                {
                    type: "inputIcon",
                    model: "apiNuCoNm",
                    placeholder: "请输入",
                    labelText: "服务编号/编码/名称:",
                },
                {
                    type: "select",
                    model: "beltLine",
                    placeholder: "请选择",
                    labelText: "业务域:",
                    select: this.beltLineSelectList
                },
            ] : [
                {
                    type: "inputIcon",
                    model: "apiNuCoNm",
                    placeholder: "请输入",
                    labelText: "服务编号/编码/名称:",
                },
            ];
        }
    },
    data() {
        return {
            businessDomainLists: [],
            dialogVisible: false,
            // serviceForm2: [
            //     {
            //         type: "inputIcon",
            //         model: "apiNuCoNm",
            //         placeholder: "请输入",
            //         labelText: "服务编号/编码/名称:",
            //     },
            // ],
            form2: {
                apiNuCoNm: "", // 服务编号/编码/名称
                beltLine: ""
            },
            // 分段列表分页器
            pager: {
                currentPage: "1",
                turnPageShowNum: "10",
                total: 0,
            },
            // 分段列表参数
            tables: [
                {
                    prop: "aiSeq",
                    label: "服务编号",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiCode",
                    label: "服务编码",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiName",
                    label: "服务名称",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiVersion",
                    label: "版本",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiDesc",
                    label: "服务描述",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "centerName",
                    label: "所属中心",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiServiceGroupName",
                    label: "所属分组",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiState",
                    label: "服务状态",
                    // width: "120",
                    type: "textClassList",
                    filter: "serStus2",
                    textClassList: [
                        { class: "add status", val: "2" },
                        { class: "register status", val: "1" },
                        { class: "change status", val: "3" },
                        { class: "change status", val: "4" },
                        { class: "self status", val: "5" },
                        { class: "change status", val: "6" },
                        { class: "add status", val: "-1" },
                    ],
                },
                {
                    prop: "freezeFlag",
                    label: "冻结状态",
                    // width: "250",
                    type: "textClassList",
                    filter: "freezeStus",
                    textClassList: [
                        { class: "add status", val: "0" },
                        { class: "register status", val: "1" },
                    ],
                },
            ],
            tables3: [
                {
                    prop: "apiSeq",
                    label: "服务编号",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiCode",
                    label: "服务编码",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiName",
                    label: "服务名称",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiVersion",
                    label: "版本",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiDesc",
                    label: "服务描述",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "centerName",
                    label: "所属中心",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiServiceGroupName",
                    label: "所属分组",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiState",
                    label: "服务状态",
                    // width: "120",
                    type: "textClassList",
                    filter: "serStus2",
                    textClassList: [
                        { class: "add status", val: "2" },
                        { class: "register status", val: "1" },
                        { class: "change status", val: "3" },
                        { class: "change status", val: "4" },
                        { class: "self status", val: "5" },
                        { class: "change status", val: "6" },
                        { class: "add status", val: "-1" },
                    ],
                },
                {
                    prop: "freezeFlag",
                    label: "冻结状态",
                    // width: "250",
                    type: "textClassList",
                    filter: "freezeStus",
                    textClassList: [
                        { class: "add status", val: "0" },
                        { class: "register status", val: "1" },
                    ],
                },
            ],
            tables2: [
                {
                    prop: "aiSeq",
                    label: "服务编号",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiCode",
                    label: "服务编码",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiName",
                    label: "服务名称",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiVersion",
                    label: "版本",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiDesc",
                    label: "服务描述",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "centerName",
                    label: "所属中心",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiServiceGroupName",
                    label: "所属分组",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiState",
                    label: "服务状态",
                    // width: "250",
                    type: "textClassList",
                    filter: "serStus2",
                    textClassList: [
                        { class: "add status", val: "2" },
                        { class: "register status", val: "1" },
                        { class: "change status", val: "3" },
                        { class: "change status", val: "4" },
                        { class: "self status", val: "5" },
                        { class: "change status", val: "6" },
                        { class: "add status", val: "-1" },
                    ],
                },
                {
                    prop: "freezeFlag",
                    label: "冻结状态",
                    // width: "250",
                    type: "textClassList",
                    filter: "freezeStus",
                    textClassList: [
                        { class: "add status", val: "0" },
                        { class: "register status", val: "1" },
                    ],
                },
                // {
                //   prop: "bindDecisionTreeCount",
                //   label: "绑定规则",
                //   tooltip: true,
                //   type: "textClick",
                //   operate:"detail"
                // },
                // {
                // prop: "aiModifyUserNm",
                // label: "更新人",
                // type: "text",
                // tooltip: true,
                // },
                // {
                // prop: "aiModifyTime",
                // label: "更新时间",
                // type: "text",
                // tooltip: true,
                // },
            ],
            // 数据字典选择列表
            dictList: [],
            // 记录是否点击分页器和搜索按钮
            isRecord: false,
            // 已选参数数组
            tableData: [],
            // 记录已经选择
            selectionData: [],
            beltLine: "",
            l5ProjectGroupInfoList: [],
            changeTabs: "rule",
            labelTbs: [
                { value: "rule", label: "功能下" },
                { value: "all", label: "全部" },
                // { value: "current", label: "当前域" },
                // { value: "public", label: "公共域" },
                { value: "service", label: "需求下" },
            ],
            funcList: [], //功能列表
            funcList2: [], //功能列表更多
            functionId: "",

            newlabelShow: false,
            dialogVisibleNew: false,
            drawShowType: "add",
            filterText: "",
            dataTree: [],
            defaultProps: {
                children: "children",
                label: "demandName",
            },
            checkDemandInfo: {},
            expandFirstNodskey: [1],
            currentNodeKey: 1,
        };
    },
    methods: {
        // 通过业务域id查名称
        getBizName(id) {
            let _temp = this.businessDomainLists.filter(i => i.value == id);
            if (_temp.length) {
                return _temp[0].type;
            } else {
                return "/"
            }
        },
        // 获取业务域列表
        async getBitLineList() {
            const { businessDomainLists } = await this.rpc.newEditor.queryBizDomainList();
            console.log('businessDomainLists', businessDomainLists);
            let arr = businessDomainLists.map(item => {
                return {
                    ...item,
                    type: item.bizDomainName,
                    value: item.bizDomainNo
                }
            });
            this.businessDomainLists = arr;
        },
        async showDialog() {
            await this.init();
            this.dialogVisible = true;
        },
        // 点击搜索按钮
        search() {
            this.isRecord = true;
            this.pager.currentPage = "1";
            this.queryS5SvcPageList(this.changeTabs);
        },
        // 点击重置按钮
        reset() {
            this.resetForm();
            this.queryS5SvcPageList(this.changeTabs);
        },
        resetForm() {
            this.$refs.formRef.resetFields();
            this.form2 = {
                apiNuCoNm: "", // 服务编号/编码/名称
            };
            // 分段列表分页器
            this.pager = {
                currentPage: "1",
                turnPageShowNum: "10",
                total: 0,
            };
        },
        // 数据字典选择每页条数改变时
        handleSizeChange(e) {
            this.isRecord = true;
            this.pager.currentPage = "1";
            this.pager.turnPageShowNum = e;
            this.queryS5SvcPageList(this.changeTabs);
        },
        // 数据字典选择当前页改变时
        handleCurrentChange(e) {
            this.isRecord = true;
            this.queryS5SvcPageList(this.changeTabs);
        },
        closeDialog() {
            this.dialogVisible = false;
            this.$refs.formRef.resetFields();
            this.resetForm();
            this.tableData = [];
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.demandName.indexOf(value) !== -1;
        },
        handleNodeClick(node, data) {
            console.log(node, data, "888888======");
            this.checkDemandInfo = node;
            this.currentNodeKey = node.id;
            this.dataTree.forEach((item) => {
                if (item.id == node.id) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            });
            this.form2 = {
                apiNuCoNm: "", // 服务编号/编码/名称
            };
            // 分段列表分页器
            this.pager = {
                currentPage: "1",
                turnPageShowNum: "10",
                total: 0,
            };
            this.queryS5SvcPageList("service");
        },
        async confirm() {
            if (this.tableData.length == 0)
                return this.$message.error("请选择服务");
            const svcdIds = this.tableData.map((item) => {
                return item.aiId
            });
            const params = {
                tranId: this.currentInterfaceObj.apiId,
                svcIdList: svcdIds,
            };
            const res = await this.rpc.newEditor.addWaitUseService(params);
            console.log(res, "====res");
            this.rpc.s4design.addFuntionJobCommitFlow({
                fnctId: this.$route.query.fnctId,
                jobTpCd: "C4",
            });

            this.$notify({
                title: "成功",
                message: "添加成功",
                duration: 2000,
                type: "success",
            });
            this.closeDialog();
            this.$emit("getInterfaceList");
        },
        // 初始化
        async init() {
            this.beltLine = this.$route.query.beltLine;
            this.handleChangeTab("rule");
            await this.getBitLineList();
            this.form2.beltLine = this.beltLine;
        },
        // 多选框选中
        handleSelectionChange(e) {
            if (!this.isRecord && this.selectionData.length > e.length) {
                this.selectionData.forEach((item) => {
                    if (e.indexOf(item) == -1) {
                        this.tableData = this.tableData.filter(
                            (it) => it.aiId != item.aiId
                        );
                    }
                });
            } else {
                this.tableData.push(...e);
                this.tableData = unduplicated(this.tableData, "aiId");
            }
            this.selectionData = e;
            this.isRecord = false;
        },
        delParamsTag(e) {
            // console.log(e, "eeee");
            const index = this.dictList.findIndex(
                (item) => item.aiId == e.aiId
            );
            if (index == -1) {
                this.tableData = this.tableData.filter(
                    (it) => it.aiId != e.aiId
                );
            } else {
                this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                    this.dictList[index],
                    false
                );
            }
        },
        // tableData数据选中表格中
        isTableData() {
            if (this.tableData.length > 0) {
                this.tableData.forEach((item) => {
                    this.dictList.forEach((data) => {
                        if (item.aiId == data.aiId) {
                            this.isRecord = true;
                            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                                data
                            );
                        }
                    });
                });
            }
        },
        selectChange(data, type) {
            console.log(type, data, "=----->");
            if (type == "projectId") {
                this.l5ProjectGroupInfoList.map((item, index) => {
                    if (item.projectId == data) {
                        this.$nextTick(() => {
                            this.serviceForm[2].select =
                                item.l5GroupInfoList?.reduce(
                                    (prev, iitem) => {
                                        prev.push({
                                            value: iitem.l5GroupId,
                                            type: iitem.l5GroupNm,
                                        });
                                        return prev;
                                    },
                                    [{ value: "", type: "全部" }]
                                );
                        });
                    } else if (data == "") {
                        this.form.aiServiceGroupId = "";
                        this.serviceForm[2].select = this.getGroupSelectList(
                            this.l5ProjectGroupInfoList
                        );
                    } else {
                        this.form.aiServiceGroupId = "";
                        this.serviceForm[2].select = [];
                    }
                });
            }
        },
        operate(op, data) {
            if (op == "detail") {
                this.$refs.decisionTreeCountRef.showDialog(data);
            }
        },
        async handleChangeTab(type) {
            console.log(type, "pppppppppp");
            this.pager = {
                currentPage: "1",
                turnPageShowNum: "10",
                total: 0,
            };
            this.changeTabs = type;
            if (type === "service") {
                const res = await this.rpc.d4.getDemandInfoList({
                    functionId: this.$route.query.fnctId,
                });
                let newarr = res.demandInfos.map((ele, index) => {
                    return {
                        id: index + 1,
                        checked: false,
                        ...ele,
                    };
                });
                console.log("需求列表===", newarr);
                this.dataTree = newarr || [];
                if (this.dataTree.length == 0) return;
                this.checkDemandInfo = newarr[0];
                this.currentNodeKey = 1;
                this.dataTree[0].checked = true;
                this.queryS5SvcPageList(type);
            } else {
                this.queryS5SvcPageList(type);
            }
        },
        async queryBetLine(type) {
            const params = {
                currentPage: this.pager.currentPage + "",
                turnPageShowNum: this.pager.turnPageShowNum,
                apiNuCoNm: this.form2.apiNuCoNm,
                domainNo: this.form2.beltLine,
            };
            const res = await this.rpc.newEditor.getL5ServList(params);
            this.dictList = res.ifpApiInfoBos || [];
            this.pager.total = res.turnPageTotalNum * 1;
            this.$nextTick(() => {
                this.isTableData();
            });
        },
        async queryS5SvcPageList(type) {
            if (type == 'all') {
                // 查当前域|公共域
                return await this.queryBetLine(type);
            } else {
                const params = {
                    funcId: type == "rule" ? this.$route.query.fnctId : "",
                    demandId:
                        type == "service"
                            ? this.checkDemandInfo
                                ? this.checkDemandInfo.demandId
                                : ""
                            : "",
                    keyWord: this.form2.apiNuCoNm || "",
                    currentPage: this.pager.currentPage + "",
                    turnPageShowNum: this.pager.turnPageShowNum,
                };
                const res = await this.rpc.d4.queryS5SvcPageList(params);
                console.log(res);
                let newarr = res.decisionTreeAndApiListBos || [];
                this.dictList = newarr;
                this.pager.total = res.turnPageTotalNum * 1 || 0;
                this.$nextTick(() => {
                    this.isTableData();
                });
            }
        },
        addNewser() {
            console.log("接口设计--添加服务需求");
            this.drawShowType = "add";
            this.newlabelShow = true;
            this.dialogVisibleNew = true;
        },
        editNewser() {
            console.log("接口设计--编辑服务需求");
            this.drawShowType = "edit";
            this.newlabelShow = true;
            this.dialogVisibleNew = true;
        },
        closeDrawer() {
            if (this.drawShowType == "look") {
                this.dialogVisibleNew = false;
                this.looklabelShow = false;
            } else {
                this.dialogVisibleNew = false;
                this.newlabelShow = false;
                setTimeout(() => {
                    this.handleChangeTab("service");
                }, 800);
            }
        },
        filterArray(arr) {
            let newdata = [];
            let stringArr = [];
            for (var i = 0; i <= arr.length; i++) {
                //apiId apiSeq
                if (
                    arr[i] &&
                    arr[i].aiId &&
                    !stringArr.includes(JSON.stringify(arr[i]))
                ) {
                    stringArr.push(JSON.stringify(arr[i]));
                    newdata.push(arr[i]);
                }
            }
            return newdata;
        },
        getGroupSelectList(dataList) {
            let arr = [];
            dataList.forEach((item) => {
                if (item.l5GroupInfoList.length > 0) {
                    item?.l5GroupInfoList.forEach((iitem) => {
                        arr.push({
                            value: iitem.l5GroupId,
                            type: iitem.l5GroupNm,
                        });
                    });
                }
            });
            arr.unshift({ value: "", type: "全部" });
            return arr;
        },
    },
    watch: {
        filterText(val) {
            this.$refs.menuTree.filter(val);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_demandserv_list {
    .content {
        padding: 0px 30px;
    }
    ::v-deep .table_dialog th {
        color: $sec_ft_color;
    }

    .service_top ::v-deep.serivce_top_box {
        padding: 0;
        margin: 0;
    }
    .show_conf {
        padding: 15px 24px;
        overflow: hidden;
        .show_conf_title {
            float: left;
            margin-right: 10px;
            font-family: $font_medium;
        }
    }

    ::v-deep .el-form-item__label {
        width: 86px !important;
    }
}
.dialog {
    .content {
        padding: 0px 30px;
        border-top: 1px solid #dddddd;
    }
    ::v-deep.el-dialog {
        margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
        max-height: 78vh;
    }
    .show_conf {
        padding: 15px 24px;
        overflow: hidden;
        .show_conf_title {
            float: left;
            margin-right: 10px;
            font-family: $font_medium;
            span {
                color: #358aff;
            }
        }
        .show_conf_content {
            float: left;
        }
        .show_conf_tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
    .table_operate {
        padding: 16px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        h1 {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #111111;
            letter-spacing: 0;
        }
        .header_content {
            display: flex;
            //   justify-content: space-between;
            align-items: center;
            // flex: 1;
            width: 100%;
            margin-right: 10px;
            .btn_style {
                @include small_button_common;
            }
            .list_type {
                width: 70%;
                // overflow-x: scroll;
                margin-left: 5px;
                display: flex;
                padding: 5px 0;
                span {
                    flex-basis: auto; /* 默认值，也可以设置具体的宽度如50px, 20%等 */
                    flex-grow: 1; /* 让子元素平分父容器的剩余空间 */
                    display: inline-block;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 12px;
                    line-height: 22px;
                    letter-spacing: 0;
                    border-radius: 15px;
                    padding: 0px 11px;
                    margin-right: 8px;
                    flex-shrink: 0;
                    max-width: max-content;
                    // max-width: 100px;
                }
                .list_item {
                    color: #666666;
                    font-weight: 400;
                    background: #eff0f4;
                }
                .list_active {
                    color: #ffffff;
                    font-weight: 600;
                    background: #67c23a;
                }
                .item {
                    margin-top: 2px;
                    margin-right: 2px;
                }
                .item_dropdown {
                    align-items: center;
                    display: flex;
                    margin-left: 5px;
                    cursor: pointer;
                }
            }
        }
    }

    ::v-deep .el-dialog .el-dialog__body {
        padding: 0px !important;
    }
    ::v-deep .aop_tradecode_comps_page_service_top {
        // height: 160px !important;
        margin-bottom: 0px !important;
        padding: 16px 24px 8px 24px !important;
    }
    ::v-deep
        .aop_tradecode_comps_page_service_top
        .serivce_top
        .serivce_top_left {
        flex: 1;
    }
    ::v-deep
        .aop_tradecode_comps_page_service_top
        .el-form
        .el-form-item
        .el-input {
        width: 160px;
    }

    ::v-deep .show_conf {
        padding: 15px 0px;
        overflow: hidden;
        border-bottom: 1px solid #e7e7e7;
        margin-bottom: 16px;
        // box-shadow: inset 0 1px 0 0 #F5F5FA;
        .show_conf_title {
            float: left;
            margin-right: 10px;
            font-family: $font_medium;
            span {
                color: #358aff;
            }
        }
        .show_conf_content {
            float: left;
        }
        .show_conf_tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
    .top_btn_flex {
        margin-top: -36px;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
        z-index: 100 !important;
    }
}
</style>
<style lang="scss">
.addNewDemand {
    .el-dialog__body {
        border-top: 1px solid #dddddd;
    }
}
.dialog_cont {
    padding: 5px 4px;
    h3 {
        background: #358aff;
        color: #fff;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
    .top_add {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 4px;
        .list_item_icon {
            margin-left: 5px;
            color: #358aff;
        }
    }
    .el-tree-node__content {
        height: 30px !important;
    }
    .el-tree-node {
        height: 30px;
        margin-bottom: 5px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        .node_label {
            margin-left: 2px;
            max-width: 130px;
            height: 30px;
            line-height: 32px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .brage_item {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: absolute;
            right: 2px;
            top: 0;
        }
        .orange {
            color: #ff9104;
            background: #ff9104;
        }
        .green {
            color: #36d542;
            background: #36d542;
        }
        .blue {
            color: #358aff;
            background: #358aff;
        }
        .red {
            color: #f70019;
            background: #f70019;
        }
    }
    .form_info {
        .el-form-item {
            margin-bottom: 10px !important;
        }
    }
}
</style>
