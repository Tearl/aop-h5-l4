<template>
    <div class="aop_tradecode_comps_design_attr_cache_session_attr">
        <div class="attr_main">
            <div class="attr_title underLine">
                <div>设置会话组件</div>
            </div>
            <div v-if="!isRead && !fourRAttrFlag" class="attr_box">
                <div class="attr_show">
                    <div class="attr_show_item">
                        <div class="attr_show_item_t required">组件名称：</div>
                        <div class="attr_show_item_c">
                            <el-input
                                disabled
                                v-model="formData.actionDesc"
                                size="mini"
                            ></el-input>
                        </div>
                    </div>
                    <div class="attr_show_item">
                        <div class="attr_show_item_t">
                            &nbsp;&nbsp;组件描述：
                        </div>
                        <div class="attr_show_item_c textarea">
                            <el-input
                                maxlength="1000"
                                show-word-limit
                                autosize
                                :disabled="!canSave"
                                type="textarea"
                                v-model="formData.actionMsg"
                                placeholder="组件描述"
                                size="mini"
                            ></el-input>
                        </div>
                    </div>
                </div>
                <div class="transition_arrange">
                    <div class="attr_show">
                        <div class="attr_pre_title mb0">
                            <div class="attr_pre_title_b bold">
                                会话数据结构
                            </div>
                            <i
                                class="el-icon-more"
                                style="cursor: pointer"
                                @click="switchTableMode('inputAtSetting')"
                            ></i>
                        </div>
                    </div>

                    <div class="attr_recive mb20">
                        <div class="attr_show_item_c">
                            <Table
                                class="table input_list"
                                :data="tableData"
                                :table="tableColumn"
                                :rowK="'paramOrder'"
                                :treeProps="{ children: 'children' }"
                                @operate="outputTargetOperate"
                                @selectChange="outputTargetSelectChange"
                                @inputClick="inputClick"
                            ></Table>
                        </div>
                        <div v-if="!isRead">
                            <div class="tips_info" v-if="!canSave">
                                <el-tag type="warning"
                                    >保存交易编排后，可对组件信息进行编辑</el-tag
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!isRead && !fourRAttrFlag" class="attr_btn">
                    <el-button
                        v-if="canSave"
                        type="primary"
                        size="small"
                        @click="saveParams"
                        class="right_button"
                        >保存</el-button
                    >
                </div>
            </div>
            <div v-else class="attr_box">
                <div class="attr_show read">
                    <div class="attr_show_item">
                        <div class="attr_show_item_t">
                            组件名称：<span class="attr_show_item_i">{{
                                formData.actionDesc
                            }}</span>
                        </div>
                    </div>
                    <div class="attr_show_item">
                        <div class="attr_show_item_t textLeft">
                            组件描述：<span class="attr_show_item_i">{{
                                formData.actionMsg
                            }}</span>
                        </div>
                    </div>
                </div>
                <div class="transition_arrange read">
                    <div class="attr_show">
                        <div class="attr_pre_title mb0">
                            <div class="attr_pre_title_b bold">
                                会话数据结构
                            </div>
                        </div>
                    </div>

                    <div class="attr_recive mb20">
                        <div class="attr_show_item_c">
                            <Table
                                class="table"
                                :data="tableData"
                                :table="tableColumn"
                                :rowK="'paramOrder'"
                                :treeProps="{ children: 'children' }"
                                @operate="outputTargetOperate"
                                @selectChange="outputTargetSelectChange"
                            ></Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 拟态的下拉选择框 -->
        <SimulantSelect
            ref="simulantSelectRef"
            :currentServObj="currentServObj"
            :currentObj="currentObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            @update="updateData"
            :fourRAttrFlag="fourRAttrFlag"
        >
        </SimulantSelect>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SimulantSelect from "./service_setting/simulantSelect";
import { mixList, reList, packageParamKey } from "@m/utils/paramTree";
import {
    sourceActionType,
    actionTypeToApSource,
    actionNameToNoActionId,
} from "@m/utils/normalData";

import { setSessionStorage } from "@m/utils/localStorage";
export default {
    mixins: [mixin],
    components: {
        Table,
        SimulantSelect,
    },
    props: {
        currentServObj: {
            type: Object,
            default: () => ({}),
        },
        currentObj: {
            type: Object,
            default: () => ({}),
        },
        isRead: {
            type: Boolean,
            default: () => false,
        },
        dataList: {
            type: Array,
            default: () => [],
        },
        type: {
            type: Boolean,
            default: () => false,
        },
        showTips: {
            type: Boolean,
            default: () => true,
        },
        fourRAttrFlag: {
            type: Boolean,
            default: () => false,
        },
        currentParentCpnInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            isNeedCheck: "",
            paramValueSelect: [],
            isEnumList: false,
            formData: {
                actionDesc: "",
                actionMsg: "",
                cacheStrategy: "", // 缓存策略
                timeOut: "", // 缓存时长
                // paramList: "[]"
            },
            cacheStrategyOptions: [
                { lable: "Redis", value: "REDIS" },
                { lable: "数据库", value: "DB" },
            ],
            // loopListOptions: [],
            paramList: [],
            currentObj: {},
            cpnData: {},
            inputParamsVisibleAtSetting: true,
            // 设置页签下的输入参数表格数据
            inputParamsListAtSetting: [],
            // 控制设置页签下的输出参数列表显示或隐藏
            outputParamsVisibleAtSetting: true,
            // 设置页签下的输出参数表格数据
            outputParamsListAtSetting: [],
            loopListVisibleAtSetting: true,
            // 设置页签下的输出参数表格数据
            loopListAtSetting: [],
            tempParamsListAtSetting: [],
            tableParamList: [],
            tableType: false,
            currentRow: {},
            cpnParamsRecord: {},
            actionIdRecord: "",
            tempDataList: [],
            chooseData: [],
            // 选择参数弹框
            addVisible: false,
            // 公共搜索
            serviceForm: [
                {
                    type: "input",
                    model: "content",
                    placeholder: "搜索参数名称、中文名或描述",
                    style: {
                        width: "260px",
                    },
                },
                {
                    type: "select",
                    model: "dictType",
                    placeholder: "参数类型",
                    select: [
                        { type: "String", value: "String" },
                        { type: "List", value: "List" },
                        { type: "boolean", value: "boolean" },
                        { type: "char", value: "char" },
                        { type: "int", value: "int" },
                        { type: "byte", value: "byte" },
                        { type: "short", value: "short" },
                        { type: "long", value: "long" },
                        { type: "float", value: "float" },
                        { type: "double", value: "double" },
                        { type: "Boolean", value: "Boolean" },
                        { type: "Character", value: "Character" },
                        { type: "Integer", value: "Integer" },
                        { type: "Byte", value: "Byte" },
                        { type: "Short", value: "Short" },
                        { type: "Long", value: "Long" },
                        { type: "Float", value: "Float" },
                        { type: "Double", value: "Double" },
                        { type: "BigDecimal", value: "BigDecimal" },
                        { type: "Object", value: "Object" },
                    ],
                },
            ],
            // 输入输出参数弹框的搜索表单
            formInline: {
                content: "",
                clsfId: "",
                dictType: "",
            },
            // 选择参数分页器
            dicPager: {
                currentPage: "1",
                turnPageShowNum: "10",
                total: 0,
            },
            // 记录是否点击分页器和搜索按钮
            isRecord: false,
            // 字典参数
            // 添加参数列表参数
            dictListTables: [
                {
                    prop: "paramKey",
                    label: "参数Key",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramCName",
                    label: "参数名称",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramDesc",
                    label: "参数描述",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramType",
                    label: "参数值类型",
                    width: "90",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramLength",
                    label: "参数长度",
                    width: "90",
                    type: "text",
                    tooltip: true,
                },
            ],
            // 输入输出参数弹框列表数据
            dictList: [],
            // 输入输出参数弹框选择类型下拉框数据
            dictGategList: [],
            // 公共搜索
            serviceForm: [
                {
                    type: "input",
                    model: "content",
                    placeholder: "搜索参数名称、中文名或描述",
                    style: {
                        width: "260px",
                    },
                },
                {
                    type: "select",
                    model: "dictType",
                    placeholder: "参数类型",
                    select: [
                        { type: "String", value: "String" },
                        { type: "List", value: "List" },
                        { type: "boolean", value: "boolean" },
                        { type: "char", value: "char" },
                        { type: "int", value: "int" },
                        { type: "byte", value: "byte" },
                        { type: "short", value: "short" },
                        { type: "long", value: "long" },
                        { type: "float", value: "float" },
                        { type: "double", value: "double" },
                        { type: "Boolean", value: "Boolean" },
                        { type: "Character", value: "Character" },
                        { type: "Integer", value: "Integer" },
                        { type: "Byte", value: "Byte" },
                        { type: "Short", value: "Short" },
                        { type: "Long", value: "Long" },
                        { type: "Float", value: "Float" },
                        { type: "Double", value: "Double" },
                        { type: "BigDecimal", value: "BigDecimal" },
                        { type: "Object", value: "Object" },
                    ],
                },
            ],
            // 当前数据
            isData: {},
            selectionData: [],
            // 输入列表数据
            iInputList: [],
            // 输出列表数据
            iOutputList: [],
            // 循环集合数据
            iLoopList: [],
            // 临时参数列表数据
            iTempList: [],
            // 参数存放
            paramList: [],
            httpData: [],
            svcIdToSvcNm: {},
            transId: "",
            compositeIdMapToParamList: {},
            tableData: [],
            layoutActionList: [],
            appId: "",
            projectId: "",
            showAllInputParamsAtSetting: false,
            processDataList: []
        };
    },
    computed: {
        blngtoTyp() {
            return this.currentServObj.apiServiceType.indexOf("D4") > -1
                ? "10"
                : "11";
        },
        // 是否修改过组件的参数
        hasChangeCpnParams() {
            return false;
        },
        canSave() {
            return (
                !this.isRead &&
                this.currentObj.compositeId &&
                !this.fourRAttrFlag
            );
        },
        loopListOptions() {
            const compositeId = this.formData.cacheStrategy;
            const dataList =
                this.currentParentCpnInfo?.dataList || this.processDataList;
            const item = dataList.find(
                (data) => data.compositeId && data.compositeId == compositeId
            );
            if (item || compositeId == this.currentServObj?.svcId) {
                const paramList =
                    this.compositeIdMapToParamList[compositeId]?.paramList ||
                    [];
                return paramList
                    .filter((param) => param.paramType == "List")
                    .map((param) => {
                        param.label = param.paramCName;
                        param.value = this.packageParamKey(param, paramList);
                        return param;
                    });
            } else {
                return [];
            }
        },
        tableColumn() {
            if (this.canSave) {
                return [
                    {
                        prop: "paramKey",
                        label: "参数Key",
                        minWidth: "25%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        prop: "paramName",
                        label: "参数名称",
                        minWidth: "20%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        prop: "paramType",
                        label: "参数类型",
                        width: "70",
                        // minWidth: "15%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        // prop: "apSource", // 当前4b交易00 L5服务20
                        prop: "actionId",
                        label: "来源",
                        minWidth: "30%",
                        type: "simulantSelect",
                        placeholder: "请选择",
                        inputStyle: {
                            cursor: "pointer",
                        },
                        filter: (scope) => {
                            const { actionName, actionId } = scope.row;
                            if (actionId == 'constantValue') {
                                return '枚举值'
                                // if (paraMapgNm && paraMapgNm.includes('.') || this.customChanged) {
                                //   return '枚举值'
                                // }
                                
                            } else if(actionId == 'fixedValue') {
                                return '固定值'
                            } else if (!actionName && !actionId) {
                                return "";
                            } else if (
                                [
                                    "当前4b交易",
                                    "当前循环组件",
                                    "复合来源",
                                ].includes(actionName)
                            ) {
                                return actionName;
                            } else {
                                const item = this.processDataList.find(
                                    (data) => data.compositeId == actionId
                                );
                                if (item) {
                                    const actionSeq = this.getConfItem(
                                        "actionSeq",
                                        item.actionId
                                    ).value;
                                    return `${actionName}(${actionSeq})`;
                                } else {
                                    return scope.row.actionId;
                                }
                            }
                        },
                    },
                    {
                        prop: (row) => {
                            if (row?.actionId == "fixedValue") {
                                return "paramMappingKey";
                            } else {
                                return "paraMapgNm";
                            }
                        },
                        label: "来源值",
                        minWidth: "30%",
                        type: (row) => {
                            if (row.actionId == "fixedValue") {
                                return "input";
                            } else {
                                return "simulantSelect";
                            }
                        },
                        placeholder: "请选择",
                        inputStyle: {
                            cursor: "pointer",
                        },
                    },
                    {
                        // prop: "paraMapgNm",
                        prop: "paramValue",
                        label: "缺省值",
                        width: "70",
                        // minWidth: "15%",
                        type: "text",
                        align: "center",
                    },
                ].filter(
                    (item) =>
                        this.showAllInputParamsAtSetting ||
                        [
                            "参数Key",
                            "参数名称",
                            "来源",
                            "来源值",
                            "操作",
                        ].includes(item.label)
                );
            } else {
                return [
                    {
                        prop: "paramKey",
                        label: "参数Key",
                        minWidth: "30%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        prop: "paramName",
                        label: "参数名称",
                        minWidth: "25%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        prop: "paramType",
                        label: "参数类型",
                        width: "70",
                        // minWidth: "15%",
                        type: "text",
                        tooltip: true,
                    },
                    {
                        // prop: "apSource", // 当前4b交易00 L5服务20
                        prop: "actionId",
                        label: "来源",
                        minWidth: "25%",
                        type: "text",
                        tooltip: true,
                        filter: (scope) => {
                            const { actionName, actionId } = scope.row;
                            if (!actionName && !actionId) {
                                return "";
                            } else if (
                                [
                                    "当前4b交易",
                                    "当前循环组件",
                                    "固定值",
                                ].includes(actionName)
                            ) {
                                return actionName;
                            } else {
                                const item = this.processDataList.find(
                                    (data) => data.compositeId == actionId
                                );
                                const actionSeq = this.getConfItem(
                                    "actionSeq",
                                    item.actionId
                                ).value;
                                return `${actionName}(${actionSeq})`;
                            }
                        },
                    },
                    {
                        prop: "paraMapgNm",
                        label: "来源值",
                        minWidth: "25%",
                        type: "text",
                        tooltip: true,
                        filter: (scope) => {
                            if (scope.row?.actionId == "fixedValue") {
                                return scope.row.paramMappingKey;
                            } else {
                                return scope.row.paraMapgNm;
                            }
                        },
                    },
                    {
                        prop: "isNeed",
                        label: "是否必输",
                        // minWidth: "15%",
                        width: "70",
                        type: "text",
                        tooltip: true,
                        align: "center",
                        filter: "paraNed",
                    },
                    {
                        // prop: "paraMapgNm",
                        prop: "paramValue",
                        label: "缺省值",
                        // minWidth: "15%",
                        width: "70",
                        type: "text",
                        align: "center",
                    },
                ];
            }
        },
    },
    inject: ["getDataList"],
    methods: {
        checkStatus(list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.actionId === "complex") {
                    if (item.children) {
                        return this.checkStatus(item.children);
                    } else {
                        return -1;
                    }
                } else {
                    if (item.actionId) {
                        return true;
                    }
                }
            }
        },
        switchTableMode() {
            this.showAllInputParamsAtSetting =
                !this.showAllInputParamsAtSetting;
        },
        updateData(target, source) {
            target.children.map((item1) => {
                source.children.map((item2) => {
                    if (item1.paramKey === item2.paramKey) {
                        item1.paramMappingKey =
                            target.paramMappingKey + "." + item2.paramKey;
                        item1.paraMapgNm = item2.paramName;
                        item1.actionId = target.actionId;
                        item1.actionName = target.actionName;
                        item1.apSource = target.apSource;
                        console.log(item1.actionId, "actionId");
                    }
                });
            });
            this.tableData = [...this.tableData];
        },
        async getParams(e, obj) {
            console.log("getParams", e, obj);
            this.init();
            this.currentObj = e;
            // this.loopListOptions = obj.puApiParams.filter((item) => item.paramDirection == 0 && ["List"].includes(item.paramType));
            if (!e.compositeId) {
                e.conf.map((item) => {
                    this.formData[item.name] = item.value;
                });
                // await this.getServiceArrangeList(e)
                return;
            } else {
                // const params = {
                //     d4StusCd: "1",
                //     blngtoTyp: this.blngtoTyp,
                //     compositeId: e.compositeId || "",
                // };
                // const res = await this.rpc.d4.getServiceCpnParams(params);
                this.cpnData = e;
                this.paramList = e.paramList;
                e.confList.map((item) => {
                    this.formData[item.confKey] = item.confValue;
                });
                // 更新实时位置序号
                ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach(
                    (key) => {
                        this.formData[key] =
                            this.getConfItem(key, e.actionId)?.value || "";
                    }
                );
                // 查询会话数据
                if (e.paramList.length) {
                    e.paramList.forEach((item) => {
                        if (item.apSource == "00") {
                            item.actionName = "当前4b交易";
                            item.actionId = this.currentServObj?.svcId;
                        } else if (item.apSource == "10") {
                            item.actionId = "constantValue";
                        } else if (item.apSource == "03") {
                            item.actionId = "fixedValue";
                        }
                    });
                    this.tableData = reList(e.paramList);
                } else {
                    const resQuerySessionParam =
                        await this.rpc.newEditor.querySessionParam({
                            appId: this.currentServObj.transAppId,
                            paramCateg: "1",
                        });
                    // this.tableData = reList(resQuerySessionParam.paramList);
                    this.tableData = resQuerySessionParam.pubDataList;
                    this.handleParamsList(this.tableData);
                    this.tableData = JSON.parse(JSON.stringify(this.tableData));
                }
            }
            this.setCpnParamsRecord();
        },
        // 查询编排列表
        async getServiceArrangeList(e) {
            console.log("getServiceArrangeList", e, this.currentServObj);
            const res = await this.rpc.d4.getServiceArrangeList({
                svcId: this.currentServObj?.svcId,
                actionId: e.compositeId,
                // parentActionId:
            });
            this.layoutActionList = res.layoutActionList;
            const tfrCdtnCd = JSON.parse(
                res.layoutActionList[0]?.tfrCdtnCd || "[]"
            );
            this.tableData = tfrCdtnCd.map((item) => {
                return {
                    actionId:
                        item.actionNm == "当前4b交易"
                            ? this.currentServObj?.svcId
                            : item.actionId,
                    actionNm: item.actionNm,
                    paramKey: item.paramKey,
                    paramNm: item.paramNm,
                    paramType: item.paramType,
                    condTyp: item.condTyp,
                    paramValue: item.paramValue,
                    actionPostSeq: item.actionPostSeq,
                };
            });
            this.tableData = JSON.parse(JSON.stringify(this.tableData));
        },
        async saveParams() {
            if (!this.formData.actionDesc) {
                return this.$message.error("组件名称不能为空");
            } else if (!this.formData.cacheStrategy) {
                // return this.$message.error("缓存策略不能为空")
            } else if (!this.formData.timeOut) {
                // return this.$message.error("缓存时长不能为空")
            }
            const confList = this.cpnData.confList || [];
            const _formData = JSON.parse(JSON.stringify(this.formData));
            for (let i in _formData) {
                const target = confList.find((item) => item.confKey == i);
                if (target) {
                    target.confValue = _formData[i];
                } else {
                    confList.push({
                        confKey: i,
                        confValue: _formData[i],
                        confId: "",
                        confDescr: "",
                        compositeId: this.currentObj?.compositeId || "",
                    });
                }
            }
            let paramList = JSON.parse(JSON.stringify(this.tableData));
            const allList = mixList(paramList, "children");
            const list = this.tableData.filter((item) => {
                return item.actionId === "complex";
            });
            const result = this.checkStatus(list);

            if (!result && list.length) {
                return this.$message.error(
                    "复合来源的子参数至少有一个来源、来源值不能为空"
                );
            }
            for (let i = 0; i < allList.length; i++) {
                const item = allList[i];
                if (item.actionId !== "complex") {
                    if (item.actionName && !item.paramMappingKey) {
                        this.$message.error(
                            `输出参数${item.paramKey}来源值不能为空`
                        );
                        return true;
                    }
                }
            }
            paramList = mixList(paramList, "children").map((param) => {
                param.paramDirection = "1";
                if (actionNameToNoActionId.includes(param.actionName)) {
                    param.actionId = "";
                }
                return param;
            });
            const params = {
                d4StusCd: "1",
                blngtoTyp: this.blngtoTyp,
                apiId: this.currentServObj?.svcId,
                paramList: paramList,
                confList,
                compositeId: this.currentObj?.compositeId || "",
            };
            // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(
            //     params
            // );
            // params.compositeId = compositeId;
            this.rpc.s4design.addFuntionJobCommitFlow({
                fnctId: this.$route.query.fnctId,
                jobTpCd: "C4",
            });
            this.setCpnParamsRecord();
            this.$emit(
                "upDateServParams",
                JSON.parse(JSON.stringify(this.currentObj)),
                params
            );
        },
        setCpnParamsRecord() {
            const _formData = JSON.parse(JSON.stringify(this.formData));
            _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
            _formData.outputParamsListAtSetting =
                this.outputParamsListAtSetting;
            this.cpnParamsRecord = JSON.stringify(_formData);
            this.actionIdRecord = this.currentObj.actionId;
            console.log(
                "数据-setCpnParamsRecord",
                this.inputParamsListAtSetting
            );
            setSessionStorage("4R-paramsData", JSON.stringify(_formData));
        },
        getDisplayText(type) {
            if (type == "cacheStrategy") {
                const option = this.cacheStrategyOptions.find(
                    (item) => item.value == this.formData.cacheStrategy
                );
                return option?.lable || "";
            }
        },
        async updateCompositeIdMapToParamList() {
            const compositeId = this.formData.cacheStrategy;
            const item = this.compositeIdMapToParamList[compositeId];
            const apiId = item?.svcId;
            if (
                compositeId &&
                apiId &&
                !this.compositeIdMapToParamList[compositeId]?.paramList?.length
            ) {
                const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
                    d4StusCd: "1",
                    blngtoTyp: "10",
                    apiId: apiId,
                    d4bApiId:
                        this.currentServObj?.svcId || this.currentServObj.apiId,
                    bizDomainNo:
                        this.currentServObj.bizLineId ||
                        this.currentServObj.beltLine,
                });
                this.compositeIdMapToParamList[compositeId].paramList =
                    res.paramList.filter((item) => item.paramDirection == 1);
            }
        },
        // 获取conf配置项
        getConfItem(name, actionId) {
            const dataList =
                this.currentParentCpnInfo?.dataList || this.processDataList;
            const cpn = dataList.find((data) => data.actionId == actionId);
            return cpn.conf.find((item) => item.name == name) || {};
        },
        // 输出目标-增加行
        addOutputTargetLine() {
            console.log("addOutputTargetLine", this.currentObj);
            const row = JSON.parse(
                JSON.stringify(this.layoutActionList[0] || {})
            );
            row.svcId = row.svcId || this.currentObj.svcId;
            row.tranId = row.tranId || this.currentServObj?.svcId;
            row.actionId = this.currentServObj?.svcId;
            row.actionNm = "当前4b交易";
            row.postLoSeqNo = "";
            row.actionPostSeq = "";
            row.paramKey = "";
            row.paramNm = "";
            row.condTyp = "=";
            row.paramValue = "";
            this.tableData.push(row);
            this.tableData = JSON.parse(JSON.stringify(this.tableData));
        },
        outputTargetOperate(operation, data) {
            console.log("outputTargetOperate", operation, data);
            if (operation == "paramNm") {
                console.log("111");
                this.$refs.selectOutputFieldRef.showDialog(data, this.formData);
            } else if (operation == "actionPostSeq") {
                console.log("222");

                this.$refs.selectOutputPostSeqRef.showDialog(data);
            } else if (operation == "delete") {
                console.log("333");

                const index = this.tableData.indexOf(data);
                this.tableData.splice(index, 1);
            }
        },
        outputTargetSelectChange(row, prop) {
            console.log("outputTargetSelectChange", row, prop);
            if (prop == "paramNm") {
                console.log("111");
                const item = this.formData.paramList.find(
                    (item) => item.paramCName == row.paramNm
                );
                row.paramKey = item.paramKey;
            } else if (prop == "actionId") {
                console.log("222");

                row.paramKey = "";
                row.paramNm = "";
                row.actionNm = this.svcIdToSvcNm[row.actionId];
            }
        },
        setOutputTarget(type, target, obj) {
            console.log(
                "setOutputTarget",
                type,
                target,
                obj,
                this.tableData.indexOf(target)
            );
            if (type == "paramNm") {
                target.paramKey = obj.paramKey;
                target.paramNm = obj.paramCName;
                target.paramType = obj.paramType;
                if (["List", "Object"].includes(target.paramType)) {
                    target.paramValue = "null";
                    target.condTyp = "=";
                }
            } else if (type == "actionPostSeq") {
                target.actionPostSeq = obj.actionSeq;
                target.postLoSeqNo = obj.actionSeq;
            }
            this.tableData = JSON.parse(JSON.stringify(this.tableData));
        },
        /**
         * @description: 把参数key组装成 parentKey.key的形式
         * @param {*} param 当前进行拼接的参数
         * @param {*} paramList 参数列表
         * @param {*} paramKey 累计拼接的paramKey
         * @return {*}
         */
        packageParamKey(param, paramList, paramKey = "") {
            const { paramOrder, paramParentId } = param;
            if (paramOrder != paramParentId && paramParentId) {
                const _param = paramList.find(
                    (item) => item.paramOrder == paramParentId
                );
                const _paramKey = `${param.paramKey}${
                    paramKey ? "." : ""
                }${paramKey}`;
                return this.packageParamKey(_param, paramList, _paramKey);
            } else {
                return `${param.paramKey}${paramKey ? "." : ""}${paramKey}`;
            }
        },
        inputClick(scope, e) {
            console.log("pppppp");
            console.log("inputClick", scope, e);
            e.preventDefault();
            this.$refs.simulantSelectRef.init(scope, e);
        },
        init() {
            // 在子流程时，使用currentParentCpnInfo中的主流程数据
            const dataList =
                this.currentParentCpnInfo?.dataList || this.processDataList;
            let { apiName, puApiParams } = this.currentServObj;
            puApiParams = puApiParams.filter(
                (item) => item.paramDirection == 0
            );
            this.compositeIdMapToParamList = dataList.reduce(
                (prev, data) => {
                    if (
                        ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
                            data.actionType
                        ) &&
                        data.compositeId
                    ) {
                        const compositeId = data.compositeId;
                        if (!this.compositeIdMapToParamList[compositeId]) {
                            prev[compositeId] = {
                                svcId: data.actionOwnId,
                                svcNm: data.actionName,
                                paramList: [],
                            };
                        }
                    }
                    return prev;
                },
                {
                    [this.currentServObj?.svcId]: {
                        svcNm: "当前4b交易",
                        svcId: this.currentServObj?.svcId,
                        paramList: puApiParams,
                    },
                }
            );
        },
        handleParamsList(data) {
            data.map((item) => {
                item.actionId = "";
                item.actionName = "";
                item.paraMapgNm = "";
                item.paramMappingKey = "";
                item.apSource = "";
                item.paramKey = item.paramCode;
                item.paramParentId = item.paramParentOrder;
                if (item?.children?.length > 0) {
                    this.handleParamsList(item.children);
                }
            });
        },
    },
    created() {
        this.appId = this.$route.query.appId;
        this.projectId = this.$route.query.projectId;
        this.processDataList = this.getDataList();
        this.svcIdToSvcNm = this.processDataList.reduce(
            (prev, data) => {
                if (
                    ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
                        data.actionType
                    ) &&
                    data.compositeId
                ) {
                    prev[data.compositeId] = data.actionName;
                }
                return prev;
            },
            { [this.currentServObj?.svcId]: "当前4b交易" }
        );
    },
    filters: {
        ...filters,
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_cache_session_attr {
    position: relative;
    height: 100%;
    .mt10 {
        margin-top: 10px;
    }
    .attr_main {
        height: 100%;
        ::v-deep .el-table__cell {
            padding: 8px 0;
            .cell {
                span {
                    font-size: 12px;
                }
            }
        }
        ::v-deep tr {
            .cell {
                font-size: 12px;
                // padding: 0;
            }
        }
    }
    .attr_title {
        padding: 0px 20px;
        font-family: $font_medium;
        font-weight: 600;
        height: 44px;
        line-height: 44px;
        &.flex {
            display: flex;
            justify-content: space-between;
            .right_btn {
                color: $theme_color;
                cursor: pointer;
            }
        }
    }
    .attr_pre_title {
        // padding: 8px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        .el-icon-arrow-down {
            cursor: pointer;
            &.hidden {
                transform: rotate(180deg);
            }
        }
        .attr_pre_title_b {
            color: $reg_ft_color;
            &.bold {
                font-weight: 600;
            }
        }
        .icon {
            cursor: pointer;
            background: #358aff;
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 2px;
            font-weight: 400;
            color: #fff;
        }
    }
    .attr_content {
        background-color: $base_bg_color;
        padding: 20px 10px;
    }
    .attr_box {
        height: calc(100% - 47px);
        overflow-y: scroll;
        padding-bottom: 55px;
        &.mt10 {
            margin-top: 10px;
        }
    }
    .attr_show {
        padding: 20px 20px 0;
        overflow: hidden;
        // &.read {
        //   padding: 10px 20px;
        // }
        .attr_show_item {
            display: flex;
            margin-bottom: 10px;
            overflow: hidden;
            position: relative;
            font-size: 14px;
            &.flex {
                display: flex;
                .item_title {
                    width: 80px;
                    padding-right: 4px;
                    padding-top: 4px;
                    text-align: right;
                    font-size: 12px;
                    font-weight: $font_weight_600;
                    &.required_fields {
                        &::before {
                            content: "*";
                            color: $sec_danger_color;
                            margin-right: 2px;
                        }
                    }
                    &.w68 {
                        width: 68px;
                    }
                }
                .item_value {
                    flex: 1;
                    ::v-deep .el-textarea__inner {
                        height: 80px;
                    }
                    &.select {
                        ::v-deep .el-input--suffix {
                            font-size: 12px;
                        }
                    }
                    &.text {
                        font-size: 12px;
                        padding-top: 4px;
                    }
                }
            }
            &.mb20 {
                margin-bottom: 20px;
            }
            &.pb20 {
                padding-bottom: 20px;
            }
            &.border_bottom {
                border-bottom: 1px solid #e7e7ee;
            }
            .attr_show_item_t {
                // width: 100%;
                // margin-right: 10px;
                // margin-bottom: 10px;
                padding: 5px 5px 0 0;
                // font-weight: $font_weight_600;
                white-space: nowrap;
                min-width: 90px;
                // text-align: right;
                font-weight: $font_weight_600;
                .attr_show_item_i {
                    font-weight: 400;
                    white-space: normal;
                    word-break: break-all;
                }
                &.flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .title {
                        width: 64px;
                    }
                    .content {
                        flex: 1;
                    }
                    .right_btn {
                        color: $theme_color;
                        cursor: pointer;
                    }
                }
                &.required {
                    &::before {
                        content: "*";
                        color: red;
                    }
                }
                &.textLeft {
                    text-align: left;
                }
            }
            .attr_show_item_c {
                width: 100%;
                &.textarea {
                    ::v-deep .el-textarea__inner {
                        min-height: 60px !important;
                    }
                }
                ::v-deep .el-select {
                    width: 100%;
                }
            }
            .attr_show_item_b {
                position: absolute;
                right: 0;
                top: 0;
                ::v-deep .el-button {
                    @include mini_button_common;
                    height: 20px;
                    &.el-button--default.is-plain {
                        border-color: $sec_ft_color;
                        color: $sec_ft_color;
                        &:hover,
                        &:focus {
                            color: $sec_ft_color;
                        }
                    }
                    &.el-button--danger.is-plain {
                        border-color: $danger_color;
                        &:hover,
                        &:focus {
                            color: $danger_color;
                        }
                    }
                    &.el-button--primary {
                        background-color: $theme_color;
                        border-color: $theme_color;
                    }
                    &.is-plain {
                        background-color: $base_white;
                        &:hover,
                        &:focus {
                            color: $theme_color;
                        }
                    }
                }
                .el-icon-more {
                    cursor: pointer;
                }
            }
        }
    }
    .attr_send {
        // padding: 8px 10px;
        font-weight: 600;
        margin-bottom: 16px;
    }
    .attr_recive {
        padding: 8px 20px;
        &.mb20 {
            margin-bottom: 20px;
        }
        .text_btn {
            color: $theme_color;
            cursor: pointer;
            font-size: 10px;
        }
    }
    .underLine {
        border-bottom: 1px solid $pri_br_color;
    }
    .attr_set_f {
        width: 68px;
        margin-right: 10px;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ::v-deep .el-input--mini .el-input__inner {
            height: 24px;
        }
    }
    .attr_set_s {
        width: 116px;
        margin-right: 5px;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .attr_set_ad {
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        width: 16px;
        float: right;
        color: $reg_ft_color;
        cursor: pointer;
    }
    .attr_set_t {
        width: 16px;
        float: right;
        .key_action {
            font-size: 16px;
            height: 24px;
            line-height: 24px;
        }
        i {
            cursor: pointer;
        }
    }
    .attr_set_l {
        width: 186px;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .key_title {
        padding: 0px 0px 8px;
        overflow: hidden;
        color: $sec_ft_color;
        display: flex;
        justify-content: space-between;
    }
    .key_list {
        overflow: hidden;
        .key_item {
            margin-bottom: 5px;
            overflow: hidden;
            .attr_set_f_ml {
                margin-left: 10px;
            }
            ::v-deep .el-input__inner {
                line-height: 28px;
                border: 1px solid $pri_br_color;
                border-radius: $theme_radius;
                height: 28px;
                color: $reg_ft_color;
                padding: 0 5px;
            }
        }
    }

    ::v-deep .el-input__inner {
        line-height: 32px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 32px;
        color: $reg_ft_color;
    }
    ::v-deep .el-dialog__body {
        padding: 0;
    }
    ::v-deep .el-table thead tr th {
        background-color: $table_bg_color;
    }
    .line_dialog_conf {
        .add_conf {
            padding: 15px 20px;
            border-bottom: 1px solid $pri_br_color;
            display: flex;
            align-items: center;
            .add_conf_s {
                width: 90px;
            }
            .add_conf_t {
                width: 90px;
            }
            .add_conf_btn {
                // float: right;
                margin-left: auto;
            }
        }
        .add_condition {
            padding: 15px 20px;
            border-bottom: 1px solid $pri_br_color;
            .add_condition_k {
                width: 110px;
                margin-right: 2px;
            }
            .add_condition_btn {
                cursor: pointer;
            }
            .hidden {
                visibility: hidden;
            }
        }
        .add_content {
            padding: 15px 20px;
            .add_content_t {
                margin-bottom: 15px;
                font-family: $font_medium;
            }
            .add_content_l {
                padding: 15px;
                background-color: $base_bg_color;
            }
        }
        ::v-deep .el-form-item {
            margin-bottom: 0;
        }
    }
    .attr_tabs {
        display: flex;
        // justify-content: center;
        background-color: $base_white;
        width: 100%;
        border-bottom: 2px solid #dcdfe6;
        box-shadow: 0 1px 10px 0 #e7e7e7;
        // ::v-deep .el-tabs__active-bar {
        //   width: 50px !important;
        // }
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
                min-width: 78px;
                text-align: center;
                &.is-active {
                    font-weight: $font_weight_600;
                }
            }
        }
        ::v-deep .el-tabs__content {
            display: none;
        }
    }
    .form {
        width: 70%;
        margin: 24px auto;
    }
    .attr_btn {
        @include attr_btn;
    }
    .service_edit_form {
        ::v-deep .el-form-item__label {
            font-size: 12px;
        }
    }
    .service_edit_form_info {
        margin-bottom: 16px;
        .el-form-item {
            margin-bottom: 8px;
        }
    }
    .rule_dialog {
        padding: 15px 24px;
        .rule_dialog_item {
            margin-bottom: 10px;
        }
    }
    .table ::v-deep .wraning_row {
        display: none;
    }
    .table {
        &.input_list {
            ::v-deep .el-input__inner {
                cursor: pointer;
            }
            ::v-deep .el-table {
                &::before {
                    display: none;
                }
            }
        }
    }
    .show_conf {
        padding: 15px 24px;
        overflow: hidden;
        .show_conf_title {
            float: left;
            margin-right: 10px;
            font-family: $font_medium;
        }
        .show_conf_content {
            float: left;
        }
        .show_conf_tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
    .tips_info {
        margin-top: 10px;
    }
    .transition_arrange {
        ::v-deep .el-select__caret {
            color: #333;
            transform: rotateZ(0);
            &::before {
                content: "\e790";
            }
        }
        ::v-deep .el-input__suffix {
            color: #333;
        }
        .tips_info {
            margin-top: 10px;
        }
        .attr_show {
            padding-top: 0px;
        }
        &.read {
            margin-top: 20px;
        }
    }
}
</style>
