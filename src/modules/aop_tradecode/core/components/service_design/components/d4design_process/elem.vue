<template>
    <div class="aop_tradecode_comps_d4design_process_elem">
        <div class="elem_box">
            <div
                class="elem_item"
                v-if="data_view"
                :class="{ hidden: !elemItemStatus[0].visible }"
                :style="{
                    height:
                        serviceListShowStatus === '1'
                            ? '35%'
                            : serviceListShowStatus === '3'
                            ? '100%'
                            : '',
                }"
            >
                <div
                    class="elem_item_title flex"
                    :class="{ no_border_top: !elemItemStatus[0].visible }"
                    style="padding: 0 20px; border-bottom: 1px solid #e7e7e7"
                    @dblclick="handleDblclick('0')"
                >
                    <span class="bold_text">服务列表</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'新建服务'"
                        placement="top"
                        v-if="$route.query.displayType != '01'"
                    >
                        <i
                            class="el-icon-plus"
                            @click="addService"
                            v-if="showAdd && !isDisabled"
                        ></i>
                    </el-tooltip>
                </div>
                <div
                    class="elem_item_content padding"
                    v-show="
                        serviceListShowStatus == '3' ||
                        serviceListShowStatus == '1'
                    "
                >
                    <D5SelfPickList
                        ref="d5SelfPickListRef"
                        :currentServObj="currentServObj"
                        :currentD4bObj="currentD4bObj"
                        :currentInterfaceObj="currentInterfaceObj"
                        :servId="servId"
                        :isRead="isRead"
                        @showServInfo="showServInfo"
                        @servChange="servChange"
                        @delServ="delServ"
                    ></D5SelfPickList>
                </div>
            </div>

            <div
                class="elem_item"
                :class="{ hidden: !elemItemStatus[1].visible }"
                :style="{ height: serviceListShowStatus === '1' ? '65%' : '' }"
            >
                <div class="elem_item_title" @dblclick="handleDblclick('1')">
                    <span
                        class="elem_title bold_text top_shadow"
                        style="height: 35px"
                        >服务编排组件</span
                    >
                    <div class="opt-icons-content">
                        <img
                            class="opt-icon"
                            v-if="serviceListShowStatus == '3'"
                            @click="serviceListShowStatus = '1'"
                            src="../../imgs/full.png"
                        />
                        <img
                            class="opt-icon"
                            v-if="serviceListShowStatus == '1'"
                            @click="serviceListShowStatus = '3'"
                            src="../../imgs/mini.png"
                        />
                        <!-- <img
                            class="opt-icon"
                            @click="serviceListShowStatus = '1'"
                            src="../../imgs/fixed.png"
                        /> -->
                    </div>
                </div>
                <template v-if="defaultActive == '服务编排组件'">
                    <div
                        class="elem_item_content"
                        v-show="
                            serviceListShowStatus == '2' ||
                            serviceListShowStatus == '1'
                        "
                    >
                        <ul
                            class="service_menu_list"
                            v-if="
                                currentParentCpnInfo.actionType === 'loopAction'
                            "
                        >
                            <li
                                class="list_item"
                                v-for="item in toolsList"
                                :key="item"
                            >
                                <div
                                    class="text_area"
                                    @mousedown.stop="
                                        pickOne(item, $event, 'baseCpn')
                                    "
                                >
                                    <!-- <img src="@m/assets/images/serv_icon.png" class="flex_container_icon"> -->
                                    <div
                                        v-if="
                                            ![
                                                'break组件',
                                                'continue组件',
                                                '运算组件',
                                            ].includes(item.cpntNm)
                                        "
                                        class="icon"
                                    >
                                        <span
                                            class="center"
                                            :class="{
                                                blue: [
                                                    '循环组件',
                                                    '选择组件',
                                                    '设置会话组件',
                                                    '获取会话组件',
                                                    '生成图形验证码',
                                                    '校验图形验证码',
                                                    '设置缓存组件',
                                                    '获取缓存组件',
                                                    '更新缓存组件',
                                                    '更新会话组件',
                                                    '集合处理组件',
                                                ].includes(item.cpntNm),
                                                green: ['并发组件'].includes(
                                                    item.cpntNm
                                                ),
                                                purple: ['异步组件'].includes(
                                                    item.cpntNm
                                                ),
                                                grey: [
                                                    '拼接组件',
                                                    '文件上传组件',
                                                    'break组件',
                                                    'continue组件',
                                                    '赋值组件',
                                                ].includes(item.cpntNm),
                                                red: ['异常组件'].includes(
                                                    item.cpntNm
                                                ),
                                            }"
                                        ></span>
                                    </div>
                                    <span class="content">{{
                                        item.cpntNm
                                    }}</span>
                                </div>
                            </li>
                        </ul>
                        <div v-else>
                            <el-collapse
                                v-model="activeNames"
                                @change="handleChange"
                            >
                                <el-collapse-item
                                    :title="parent.cpntPnm"
                                    :name="parent.cpntPid"
                                    v-for="(parent, index) in toolsList"
                                    :key="index"
                                >
                                    <ul class="service_menu_list">
                                        <li
                                            class="list_item"
                                            v-for="item in parent.compositeList"
                                            :key="item"
                                        >
                                            <div
                                                class="text_area"
                                                @mousedown.stop="
                                                    pickOne(
                                                        item,
                                                        $event,
                                                        'baseCpn'
                                                    )
                                                "
                                            >
                                                <!-- <img src="@m/assets/images/serv_icon.png" class="flex_container_icon"> -->
                                                <div
                                                    v-if="
                                                        ![
                                                            'break组件',
                                                            'continue组件',
                                                            '运算组件',
                                                        ].includes(item.cpntNm)
                                                    "
                                                    class="icon"
                                                >
                                                    <span
                                                        class="center"
                                                        :class="{
                                                            blue: [
                                                                '循环组件',
                                                                '选择组件',
                                                                '设置会话组件',
                                                                '获取会话组件',
                                                                '生成图形验证码',
                                                                '校验图形验证码',
                                                                '设置缓存组件',
                                                                '获取缓存组件',
                                                                '更新缓存组件',
                                                                '更新会话组件',
                                                                '集合处理组件',
                                                            ].includes(
                                                                item.cpntNm
                                                            ),
                                                            green: [
                                                                '并发组件',
                                                            ].includes(
                                                                item.cpntNm
                                                            ),
                                                            purple: [
                                                                '异步组件',
                                                            ].includes(
                                                                item.cpntNm
                                                            ),
                                                            grey: [
                                                                '拼接组件',
                                                                '文件上传组件',
                                                                'break组件',
                                                                'continue组件',
                                                                '赋值组件',
                                                            ].includes(
                                                                item.cpntNm
                                                            ),
                                                            red: [
                                                                '异常组件',
                                                            ].includes(
                                                                item.cpntNm
                                                            ),
                                                        }"
                                                    ></span>
                                                </div>
                                                <span class="content">{{
                                                    item.cpntNm
                                                }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";
import D5SelfPickList from "./components/elem/d5_self_pick_list";
import home from "./components/elem/home";
import AddDemandInfo from "./components/add_demandInfo";
import { compositeDirList } from "@m/utils/normalData";
import { setSessionStorage, getSessionStorage } from "@m/utils/localStorage";
export default {
    mixins: [mixin],
    name: "elem",
    components: {
        D5SelfPickList,
        home,
        AddDemandInfo,
    },
    props: {
        dataObj: {
            type: Object,
            default: () => ({}),
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
        authAppDtlId: {
            type: String,
            default: () => "",
        },
        currentServObj: {
            type: Object,
            default: () => ({}),
        },
        detailType: {
            type: String,
            default: () => "",
        },
        fourRAttrFlag: {
            type: Boolean,
            default: () => false,
        },
        currentApiId: {
            type: String,
            default: () => "",
        },
        svcId: {
            type: String,
            default: () => "",
        },
        currentParentCpnInfo: {
            type: Object,
            default: () => ({}),
        },
        // 阅读模式
        isRead: {
            type: Boolean,
            default: () => false,
        },
        currentInterfaceObj: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            serviceListShowStatus: "1",
            data: [],
            //服务组件数据列表
            cpntList: [],
            // 服务组件名称搜索
            cpntNm: "",
            // 所属应用下拉框
            appList: [],
            // 所属应用id
            aaId: "",
            // 控制菜单状态的数组
            elemItemStatus: [
                {
                    visible: true,
                    isFixed: true,
                    fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
                    fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
                    maxHeight: "calc(35%)",
                    minHeight: "calc(35%)",
                },
                {
                    visible: true,
                    isFixed: true,
                    fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
                    fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
                    maxHeight: "65%",
                    minHeight: "65%",
                },
            ],

            d4bOptions: [], // D4b下拉选择框
            currentD4bService: "", // 当前选中的D4b服务

            // 业务规则栏当前选中页签
            ruletabsActive: "业务规则",
            // 业务规则栏当前视图
            ruletabsView: 0,
            // 服务栏当前选中页签
            serviceActive: "服务列表",
            // 当前选中业务规则
            currentRule: "余额查询规则",
            // 业务规则下拉选择框
            ruleOptions: [
                { label: "余额查询规则", value: "余额查询规则", type: "文本" },
                {
                    label: "票据签收规则",
                    value: "票据签收规则",
                    type: "服务调用",
                },
            ],
            d4bSvcList: [],

            d4bSearchForm: {
                apiName: "",
                system: "",
                groupId: "",
            },
            sysOptions: [],
            apiGroupOptions: [],

            defaultOpeneds: [0], // 树形展示序号组
            d4bApiList: [], // d4b服务列表
            d5LinkApiList: [], // 直连服务列表
            d5SelfApiList: [], // 自有服务列表
            d4bServiceList: [], //

            relatedServiceList: [],
            currentD4bObj: {},
            defaultActive: "服务编排组件",
            // d4b服务名称搜索
            d4bNm: "",
            currentRelatedServiceObj: {},
            servId: "",
            //作业太网关跳转页面需要的参数
            relySys: "",
            groupId: "",
            releaseFlag: "",
            apiServiceType: "",
            pageMode: "",
            type: "",
            data_view: true,
            data_view: true,
            // 跳转确认框的配置信息
            confirmOptions: {
                distinguishCancelAndClose: true,
                confirmButtonText: "保存",
                cancelButtonText: "不保存",
            },
            modelName: "",
            showAdd: true,
            compositeDirList: [],
            tabActive: "rule",
            tabObject: {
                rule: null,
                service: null,
            },
            newlabelShow: false,
            dialogVisible: false,
        };
    },
    computed: {
        // treeData() {
        //   return this.
        // },
        isDisabled() {
            return this.$route.query.pageMode === "preview";
        },
        toolsList() {
            if (this.currentParentCpnInfo.actionType == "loopAction") {
                return [
                    {
                        cpntId: "",
                        cpntNm: "break组件",
                        id: "breakAction",
                        paramList: [],
                        referId: "breakAction",
                        type: "breakAction",
                        iconUrl: require("@m/assets/images/tools/circulation.png"),
                        conf: [
                            {
                                name: "actionDesc",
                                value: "break组件",
                            },
                            {
                                name: "actionMsg",
                                value: "",
                            },
                            {
                                name: "actionSeq",
                                value: "",
                            },
                            {
                                name: "actionFrntSeq",
                                value: "",
                            },
                            {
                                name: "actionPostSeq",
                                value: "",
                            },
                        ],
                    },
                    {
                        cpntId: "",
                        cpntNm: "continue组件",
                        id: "continueAction",
                        paramList: [],
                        referId: "continueAction",
                        type: "continueAction",
                        iconUrl: require("@m/assets/images/tools/circulation.png"),
                        conf: [
                            {
                                name: "actionDesc",
                                value: "continue组件",
                            },
                            {
                                name: "actionMsg",
                                value: "",
                            },
                            {
                                name: "actionSeq",
                                value: "",
                            },
                            {
                                name: "actionFrntSeq",
                                value: "",
                            },
                            {
                                name: "actionPostSeq",
                                value: "",
                            },
                        ],
                    },
                ];
            } else if (this.currentParentCpnInfo.actionType == "asyncAction") {
                return this.compositeDirList.filter(
                    (i) => i.cpntPnm != "子流程组件"
                );
            } else {
                // 是否能拖文件上传组件
                const uploadActionFlag =
                    this.currentServObj.isUploadFile == "1" &&
                    !this.getDataList().some(
                        (item) => item.actionType == "uploadAction"
                    );
                // 是否能拖缓存会话
                const cacheSessionActionFlag =
                    this.currentServObj.isLogin == "1";
                // 是否能拖获取会话
                const getSessionActionFlag =
                    this.currentServObj.isSession == "1";
                let arr = this.compositeDirList.map((item) => {
                    return {
                        ...item,
                        compositeList: item.compositeList
                            .filter(
                                (data) =>
                                    uploadActionFlag ||
                                    data.type != "uploadAction"
                            )
                            .filter(
                                (data) =>
                                    cacheSessionActionFlag ||
                                    data.type != "cacheSessionAction"
                            )
                            .filter(
                                (data) =>
                                    getSessionActionFlag ||
                                    data.type != "getSessionAction"
                            ),
                    };
                });
                return arr;
            }
        },
    },
    inject: ["getDataList"],
    watch: {
        async currentServObj() {
            const res = await this.rpc.transactionDesign.queryCacheIndexList({
                appId:
                    this.currentServObj.relySys || this.$route.query.bizAppNo,
            });
            setSessionStorage("cacheConList", JSON.stringify(res.confList));
        },
        "currentInterfaceObj.svcId": {
            handler(val, old) {
                // if(val){
                //     this.$refs.d5SelfPickListRef.initData()
                // }
            },
            deep: true,
        },
    },
    methods: {
        addService() {
            console.log("接口设计--添加服务");
            this.$emit("addService");
        },
        search() {
            this.getD4bServiceList();
        },
        tabClick(e) {
            this.defaultActive = e.name;
            if (this.defaultActive == "数据视图") {
                this.data_view = false;
                this.$emit("handleDataView", "", "数据视图");
            } else {
                this.data_view = true;
                this.$emit("handleDataView", false, "D4b列表");
            }
        },
        getServicePickList() {
        },
        async showServInfo(e) {
            console.log("showServInfo", e);
            const params = {
                apiId: e.svcId,
                d4StusCd: "1", // 0-分析，1-设计；2-测试
                blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
                dsgnFlg: "0",
                // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
            };
            let res = await this.rpc.d4.getServiceDesignDetail(params);
            console.log("");
            this.$emit("showServInfo", res);
        },
        handleTabsClick(e) {
            console.log(e);
            if (e.name == "D4b服务") {
            } else if (e.name == "自有服务") {
            }
        },
        imgClick(e) {
            const item = { data: { actionOwnId: e.cpntId } };
            this.$emit("imgClick", item);
        },
        //初始化
        init() {
            this.queryCompositeList();
            //初始化服务列表
            this.initSerData();
        },
        async queryCompositeList() {
            // 服务编排组件取值引用
            this.compositeDirList = compositeDirList;
            this.activeNames = '100005'
        },
        async getD4bServiceList() {
            // 上后端设计
            if (this.detailType == "download" || this.detailType == "upload") {
                const params = {
                    authId: this.authId,
                    fnctCd: this.fnctCd,
                    jobNo: this.jobNo,
                    svcNm: this.d4bNm,
                };
                const res = await this.rpc.d4.getFuncServList(params);
                this.d4bSvcList = res.bottomApiInfoList;
                this.d4bOptions = res.bottomApiInfoList.filter(
                    (item) => item.dsgnFlg == "1"
                );
                if (this.d4bOptions.length == 0) {
                    this.currentD4bObj = {};
                    this.currentD4bService = "";
                    return;
                }
                this.currentD4bService =
                    this.$route.query.apiId || res.bottomApiInfoList[0].svcId;
                this.currentD4bObj = this.d4bOptions.find(
                    (item) => item.svcId == this.currentD4bService
                );
                if (!this.currentD4bObj) {
                    this.currentD4bObj = res.d4bSvcList[0];
                    this.currentD4bService = this.currentD4bObj.svcId;
                }
                this.d4bOptionsChange(false);
            } else {
                //模块授权
                const params = {
                    authAppDtlId: this.fnctId,
                    qryCntnt: this.d4bNm,
                    funcCd: this.fnctCd,
                };
                //工作台授权
                const data = {
                    authAppDtlId: this.authAppDtlId,
                    qryCntnt: this.d4bNm,
                };
                const api =
                    this.detailType == "workbench"
                        ? "getModD4bServiceList"
                        : "getFnctD4bServiceList";
                const res = await this.rpc.d4[api](
                    this.detailType == "workbench" ? data : params
                );
                this.d4bOptions = res.d4bSvcList.filter(
                    (item) => item.dsgnFlg == "1"
                );
                if (this.d4bOptions.length == 0) {
                    this.currentD4bObj = {};
                    this.currentD4bService = "";
                    return;
                }
                this.currentD4bService =
                    this.$route.query.apiId || res.d4bSvcList[0].svcId;
                this.currentD4bObj = this.d4bOptions.find(
                    (item) => item.svcId == this.currentD4bService
                );
                if (!this.currentD4bObj) {
                    this.currentD4bObj = res.d4bSvcList[0];
                    this.currentD4bService = this.currentD4bObj.svcId;
                }
                this.d4bOptionsChange(false);
            }
        },
        // D4b下拉选择框变更
        d4bOptionsChange(e) {
            if (e) return;
            this.currentD4bObj =
                this.d4bOptions.find(
                    (item) => item.svcId == this.currentD4bService
                ) || {};
            // this.getD4bRelatedServiceList();
            this.servId = this.currentD4bObj.svcId;
            console.log("d4bOptionsChange", this.currentD4bObj);
            this.$emit("d4bOptionsChange", this.currentD4bObj);
            // this.currentD4bService = e
        },
        async getD4bRelatedServiceList() {
            const params = {
                fnctId: this.fnctId,
                svcId: this.currentD4bObj.svcId,
                svcStsCd: this.currentD4bObj.svcRlsFlg,
                dsgnFlg: this.currentD4bObj.dsgnFlg,
            };
            const res = await this.rpc.d4.getD4bRelatedServiceList(params);
            this.relatedServiceList = res.apiList;
        },
        //鼠标按下的时候触发
        pickOne(i, ev, type) {
            console.log(i, ev, type);
            if (type == "baseCpn") {
                // 判断是否存在重名
                const _item = JSON.parse(JSON.stringify(i));
                const dataList = this.getDataList();
                const list = dataList.filter(
                    (dataListItem) =>
                        dataListItem.actionName == i.cpntNm &&
                        dataListItem.actionType == i.type
                );
                if (list.length > 0) {
                    console.log("_item", i);
                    const num =
                        dataList.filter(
                            (dataListItem) => dataListItem.actionType == i.type
                        ).length + 1;
                    _item.conf.find(
                        (e) => e.name == "actionDesc"
                    ).value = `${_item.cpntNm}${num}`;
                }
                this.$emit("pickElemEvent", { ev, item: _item });
            } else {
                res = this.sysTrans(i);
                this.$emit("pickElemEvent", { ev, item: res });
            }
        },
        initData() {
            const aaNameList = unduplicated(this.cpntList, "aaName");
            aaNameList.forEach((item) => {
                this.data.push({ name: item.aaName, list: [] });
            });
            this.data.forEach((i) => {
                this.cpntList.forEach((item, index) => {
                    if (i.name == item.aaName) {
                        i.list.push({ name: item.grpgNm, list: [] });
                    }
                });
                i.list = unduplicated(i.list, "name");
            });
            this.data.forEach((i) => {
                this.cpntList.forEach((item, index) => {
                    if (i.name == item.aaName) {
                        i.list.forEach((j) => {
                            if (j.name == item.grpgNm) {
                                j.list.push(item);
                            }
                        });
                    }
                });
            });
        },
        // 组件结构改造
        sysTrans(e) {
            console.log("sysTrans", e);
            const obj = {
                D4b服务: "D4bAction",
                D5自有服务: "D5SelfAction",
                D5直连服务: "D5LinkAction",
            };
            const res = {
                cpntId: e.svcId,
                cpntNm: e.svcNm,
                id: "executeFlowAction",
                paramList: [],
                referId: "executeFlowAction",
                // type: "D4bAction",
                type: obj[e.svcTpCd],
                icon: "el-icon-plus",
                color: "$theme_color",
                conf: [
                    // ...e.conf,
                    {
                        name: "actionDesc",
                        value: e.svcNm,
                    },
                    {
                        name: "svcId",
                        value: e.svcId,
                    },
                    {
                        name: "svcNo",
                        value: e.svcNo,
                    },
                    {
                        name: "svcTpCd",
                        value: e.svcTpCd,
                    },
                    {
                        name: "sysNm",
                        value: e.sysNm,
                    },
                    {
                        name: "actionSeq",
                        value: "",
                    },
                    {
                        name: "actionFrntSeq",
                        value: "",
                    },
                    {
                        name: "actionPostSeq",
                        value: "",
                    },
                    {
                        name: "errorCode",
                        value: "",
                    },
                    {
                        name: "errorMsg",
                        value: "",
                    },
                ],
                paramList: e.paramList || [],
            };
            return res;
        },
        // 双击左侧菜单标题栏时触发
        handleDblclick(i) {
            if (this.elemItemStatus[i].isFixed) return;
            this.elemItemStatus.forEach((item, index) => {
                if (index == i) {
                    if (!item.isFixed) item.visible = !item.visible;
                } else {
                    if (!item.isFixed) item.visible = false;
                }
            });
            console.log("handleDblclick", i);
        },
        // 点击固定按钮
        fixedIconClick(i) {
            console.log("fixedIconClick");
            this.$set(
                this.elemItemStatus[i],
                "isFixed",
                !this.elemItemStatus[i].isFixed
            );
        },
        // 点击查看按钮时触发
        showD2InfoDialog() {
            this.$emit("showD2InfoDialog");
        },
        handleservClick(tab, e) {
            if (this.$parent.hasChangeProcess) {
                this.$confirm(
                    "您修改了流程图，还未保存，需要保存后再跳转吗？",
                    this.confirmOptions
                )
                    .then(async () => {
                        this.$emit("toSave", false);
                        this.servClick(tab, e);
                    })
                    .catch(() => {
                        this.servClick(tab, e);
                    });
            } else {
                this.servClick(tab, e);
            }
        },
        servClick(tab, e) {
            if (tab == "功能视图") {
                console.log("功能视图点击", e, this.currentD4bService);
                this.currentD4bService = e.svcId;
                this.d4bOptionsChange(false);
            } else {
                console.log("结构视图点击", e);
                this.currentRelatedServiceObj = e;
                this.$emit("servClick", e);
            }
        },
        // 获取菜单项展开后的最大高度
        getElemItemMaxHeight(i) {
            return this.elemItemStatus[i].maxHeight;
        },
        // 获取菜单项展开后的最小高度
        getElemItemMinHeight(i) {
            return this.elemItemStatus[i].minHeight;
        },
        // 切换视图模式
        changeViewMode() {
            console.log("changeViewMode");
            this.elemItemStatus[1].viewMode =
                this.elemItemStatus[1].viewMode == "detail" ? "list" : "detail";
        },
        showRuleInfo() {
            console.log("showRuleInfo");
        },
        handleDataView() {
            this.$emit("handleDataView", true, "数据视图列表");
        },
        initSerData() {
            this.$refs.d5SelfPickListRef.initData();
        },
        servChange(data) {
            this.$emit("servChange", data);
        },
        delServ() {
            this.$emit("delServ");
        },
    },
    created() {
        this.init();
        this.modelName = this.$route.query.modelName;
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4design_process_elem {
    // max-width: 240px;
    // max-width: 290px;
    user-select: none;
    height: calc(100% - 44px);
    /deep/ .opt-icons-content {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding-right: 10px;
        .opt-icon {
            width: 14px;
            height: 14px;
            cursor: pointer;
            margin-left: 4px;
        }
    }
    /deep/ .el-collapse-item__header {
        height: 28px;
        // color: red;
        font-weight: bold;
        padding-left: 16px;
        font-size: 14px;
        color: #111111;
    }
    /deep/ .el-collapse-item__content {
        padding-bottom: 0px;
    }
    .elem_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        padding: 0 16px;
        // box-shadow: 0 1px 0.5px 0 #e7e7ee;
        max-width: 240px;
        &.top_shadow {
            // box-shadow: 0 -1px 0.5px 0 #e7e7ee;
            // border-top: 1px solid #e7e7e7;
        }

        ::v-deep .el-button {
            @include mini_button_common;
        }
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
        // flex: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bold_text_blue {
        color: #ffffff;
        background-color: #358aff;
        height: 35px;
        .el-icon-plus {
            color: #fff !important;
        }
    }
    .elem_box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el_menu_div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 70%;
            height: 20px;
            line-height: 20px;
            color: #000;
        }
        .underLine {
            border-bottom: 1px solid $pri_br_color;
        }
    }
    .elem_item {
        // flex: 1;
        // max-height: 50%;
        font-size: 12px;
        .elem_item_title {
            // background: #f7f7f7;
            // width: 240px;
            height: 35px !important;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e7e7e7;
            &.text {
                display: flex;
                align-items: center;
                padding-left: 10px;
                height: 50px;
                border-top: 1px solid #dcdfe6;
                border-bottom: 1px solid #dcdfe6;
                user-select: none;
                box-shadow: 0 1px 10px 0 #e7e7e7;
                font-weight: $font_weight_600;
                // &.no_border_top {
                //   border-top: none;
                // }
            }
            &.tabs {
                display: flex;
                // justify-content: space-around;
                // border-bottom: 2px solid #dcdfe6;
                user-select: none;
                // ::v-deep .el-tabs__active-bar {
                //   width: 50px !important;
                // }
                // box-shadow: 0 1px 10px 0 #e7e7e7;
                ::v-deep .el-tabs__nav-wrap::after {
                    background-color: $base_white;
                }
                ::v-deep .el-tabs__header {
                    margin: 0;
                    .el-tabs__item {
                        height: 50px;
                        line-height: 50px;
                        font-size: 12px;
                        padding: 0 15px;
                        font-family: $font_medium;
                        letter-spacing: 0;
                        border-bottom: 1px solid #dcdfe6;
                        &.is-active {
                            font-weight: $font_weight_600;
                        }
                    }
                }
                ::v-deep .el-tabs__content {
                    display: none;
                }
            }
            &.flex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 44px;
                padding: 0 16px;
                .el-icon-plus {
                    font-size: 16px;
                    color: #3b3b3b;
                    cursor: pointer;
                }
            }
            .icon_area {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .item {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    cursor: pointer;
                }
                &.mw20 {
                    min-width: 20px;
                }
            }
        }
        .elem_item_content {
            @include scrollbar;
            height: calc(100% - 50px);
            overflow-y: auto;
            transition-duration: 0.5s;
            // &.padding {
            //   padding: 8px 10px;
            // }
            padding-bottom: 20px;
            &:nth-child(-n + 2) {
                min-height: 150px;
            }
            .elem_search,
            .elem_select {
                padding: 8px 10px;
                overflow: hidden;
                &.flex {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .add_icon {
                        margin-left: 10px;
                        cursor: pointer;
                        &.hidden {
                            visibility: hidden;
                        }
                    }
                }
                ::v-deep .el-select {
                    width: 100%;
                }
            }
            .elem_search_sel {
                float: left;
                ::v-deep .el-input__inner {
                    width: 100%;
                    height: 28px;
                }
                ::v-deep .el-input__icon {
                    line-height: 28px !important;
                }
                .el-icon-search {
                    line-height: 28px;
                }
            }
            .elem_tips {
                display: none;
                position: absolute;
                border-radius: $theme_radius;
                padding: 10px 5px;
                z-index: 2000;
                font-size: 12px;
                line-height: 1.2;
                word-wrap: break-word;
                background-color: $theme_color;
                color: $base_white;
                width: 192px;
                left: 80px;
                top: 70px;
            }
            .service_menu_list {
                // margin-top: 8px;
                .list_item {
                    font-size: 12px;
                    // margin-bottom: 6px;
                    // white-space: nowrap;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    cursor: pointer;
                    padding: 0 16px;
                    user-select: none;
                    height: 34px;
                    &:hover,
                    &.active {
                        background: #f7f7f9;
                        .text_area .list_item_title {
                            color: $theme_color;
                            font-weight: 600;
                        }
                    }
                    .text_area {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        .icon {
                            width: 16px;
                            height: 16px;
                            border: 1px solid #e7e7ee;
                            border-radius: 2px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-right: 4px;
                            .center {
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-radius: 2px;
                                &.blue {
                                    background: $theme_color;
                                }
                                &.origin {
                                    background: #ff9104;
                                }
                                &.green {
                                    background: #36d542;
                                }
                                &.purple {
                                    background: #8080ff;
                                }
                                &.grey {
                                    background: #f1f1f1;
                                }
                                &.red {
                                    background: #fe4758;
                                }
                            }
                        }
                        .content {
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #111111;
                            letter-spacing: 0;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        .flex_container_icon {
                            height: 16px;
                            vertical-align: top;
                            margin-left: 20px;
                            margin-right: 4px;
                        }
                        .list_item_title {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            max-width: 120px;
                            height: 20px;
                            // padding: 0 10px;
                            line-height: 20px;
                            color: #000;
                            cursor: pointer;
                            font-size: 13px;
                            &.r4b {
                                max-width: 170px;
                            }
                        }
                        .list_item_tag {
                            font-size: 12px;
                            padding: 0 3px;
                            border-radius: $theme_radius;
                            // margin-right: 4px;
                            transform: scale(0.7);
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            &.design {
                                color: #fff;
                                background: #358aff;
                                &.hidden {
                                    visibility: hidden;
                                }
                            }
                            &.released {
                                color: $base_white;
                                background: #2ddaac;
                            }
                            &.outside,
                            &.inside {
                                color: #ff934b;
                                background: #fff4e5;
                                font-size: 14px;
                            }
                            &.new {
                                color: #fe6f79;
                                background: #ffeaec;
                                display: inline-block;
                                width: 42px;
                                font-size: 14px;
                            }
                        }
                    }
                    &:hover {
                        .list_item_icon {
                            &.delete {
                                display: inline-block;
                            }
                        }
                    }
                    .list_item_icon {
                        &.delete {
                            display: none;
                            // color: $danger_color;
                            cursor: pointer;
                        }
                    }
                    .icon_area {
                        font-size: 13px;
                    }
                }
            }
            .elem_list {
                .elem_list_item {
                    margin-bottom: 8px;
                    &.function_info_button {
                        text-align: center;
                    }
                    .title {
                        font-weight: $font_weight_600;
                        display: inline-block;
                        text-align: right;
                        width: 70px;
                    }
                }
            }
            .view_mode {
                text-align: right;
                margin-bottom: 8px;
            }
            .text_button {
                color: $theme_color;
                cursor: pointer;
            }
        }
        &.hidden {
            .elem_item_title {
                background: $base_white;
            }
        }
    }
    .el-menu {
        // 隐藏滚动条
        // &::-webkit-scrollbar {
        //   width: 0 !important;
        // }
        // height: calc(100vh - 190px);
        overflow-y: auto;
        border: 0px;
        ::v-deep .el-submenu__title {
            height: 40px;
            line-height: 40px;
            font-weight: $font_weight_600;
            font-family: PingFangSC-Regular;
            font-size: 12px;
        }
        .el_menu_img {
            width: 9.95px;
            height: 9.98px;
            margin-right: 20px;
            margin-top: 4px;
        }
        ::v-deep .el-submenu__title:hover {
            background-color: #fff;
        }
        ::v-deep .el-menu-item-group__title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
            cursor: pointer;
            user-select: none;
        }
    }
    .fade-enter-active {
        transition: all 0.2s ease;
    }
    .fade-leave-active {
        transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .fade-enter,
    .fade-leave-to {
        transform: translateY(-5px);
        opacity: 0;
    }
}
</style>
