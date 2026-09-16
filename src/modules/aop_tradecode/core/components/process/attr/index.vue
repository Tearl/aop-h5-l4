<template>
    <div
        class="aop_tradecode_comps_d5design_process_attr"
        :style="{
            flexBasis: flexBasis,
            maxWidth: flexBasis,
            userSelect: userSelect,
        }"
    >
        <div
            class="header_close"
            :class="chooseType == 'serv' ? 'serv_style' : ''"
            v-show="chooseType"
            @click="handleClose"
        >
            <i class="el-icon-close"></i>
        </div>
        <div class="width_move" @mousedown="mouseDown"></div>

        <!-- 交易信息 -->
        <TransactionAttr
            v-if="showType == 'service'"
            ref="transactionAttrRef"
            :fourRAttrFlag="fourRAttrFlag"
            :currentObj="currentObj"
            :currentServObj="currentServObj"
            :isRead="isRead"
        ></TransactionAttr>

        <!-- 服务组件信息 -->
        <ServiceAttr
            v-else-if="showType == 'd4bInfo'"
            ref="serviceAttrRef"
            :currentObj="currentObj"
            :transAppId="transAppId"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :serviceIdMapToParamList="serviceIdMapToParamList"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @checkRule="checkRule"
        ></ServiceAttr>

        <ConditionalBranchDrawer 
            v-else-if="showType == 'lineAction'"
            ref="conditionalBranchDrawer"
            :currentServObj="currentServObj"
            @conditionalBranchSave="conditionalBranchSave"
        ></ConditionalBranchDrawer>

        <!-- 循环组件 -->
        <LoopAttr
            v-else-if="showType == 'loopAction'"
            ref="loopAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></LoopAttr>
        <ListAttr
            v-else-if="showType == 'listAction'"
            ref="listAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></ListAttr>
        <TransferStateAttr
            v-else-if="showType == 'transferStateAction'"
            ref="transferStateRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></TransferStateAttr>
        <GetFlowNumActionAttr
            v-else-if="showType == 'getFlowNumAction'"
            ref="getFlowNumAction"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></GetFlowNumActionAttr>
        <DesensitizationAttr
            v-else-if="showType == 'desensitizationAction'"
            ref="desensitizationAction"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></DesensitizationAttr>
        <getDesensitizationAction
            v-else-if="showType == 'getDesensitizationAction'"
            ref="getDesensitizationAction"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></getDesensitizationAction>
        <CaptchaAction
            v-else-if="showType == 'captchaAction'"
            ref="captchaAction"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></CaptchaAction>
        <ListSetValAttr
            v-else-if="showType == 'listSetValAction'"
            ref="ListSetValRef"
            :transAppId="transAppId"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :showTips="showTips"
            :fourRAttrFlag="fourRAttrFlag"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></ListSetValAttr>

        <!--  -->
        <!-- 并发组件 -->
        <ConcurrentAttr
            v-else-if="showType == 'concurrentAction'"
            ref="concurrentAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></ConcurrentAttr>

        <!-- 异步组件 -->
        <AsyncAttr
            v-else-if="showType == 'asyncAction'"
            ref="asyncAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            :showTips="showTips"
            :fourRAttrFlag="fourRAttrFlag"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></AsyncAttr>

        <!-- 异常处理组件 -->
        <ThrowExceptionAttr
            v-else-if="showType == 'throwExceptionAction'"
            ref="throwExceptionAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></ThrowExceptionAttr>

        <!-- input组件 -->
        <InputAttr
            v-else-if="showType == 'inputAction'"
            ref="inputAttrRef"
            :fourRAttrFlag="fourRAttrFlag"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            :showTips="showTips"
            :currentParentCpnInfo="currentParentCpnInfo"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></InputAttr>

        <!-- output组件 -->
        <OutputAttr
            v-else-if="showType == 'outputAction'"
            ref="outputAttrRef"
            :fourRAttrFlag="fourRAttrFlag"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            :showTips="showTips"
            :currentParentCpnInfo="currentParentCpnInfo"
            :serviceIdMapToParamList="serviceIdMapToParamList"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></OutputAttr>

        <!-- break组件 -->
        <BreakAttr
            v-else-if="showType == 'breakAction'"
            ref="breakAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></BreakAttr>

        <!-- continue组件 -->
        <ContinueAttr
            v-else-if="showType == 'continueAction'"
            ref="continueAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></ContinueAttr>

        <!-- 赋值组件 -->
        <AssignAttr
            v-else-if="showType == 'assignAction'"
            ref="assignAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></AssignAttr>
        <!-- 赋值组件 -->

        <!-- 组件 -->
        <KeyMapAttr
            v-else-if="showType == 'keyMapAction'"
            ref="keyMapAttrRef"
            :currentServObj="currentServObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            :isRead="isRead"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></KeyMapAttr>
        <!-- 组件 -->
        <TimeActionAttr
            v-else-if="showType == 'timeAction'"
            ref="timeActionAttrRef"
            :currentServObj="currentServObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            :isRead="isRead"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></TimeActionAttr>
        <!-- 赋值组件 -->
        <ServiceHeaderAttr
            v-else-if="showType == 'setHeaderAction'"
            ref="serviceHeaderAttrRef"
            :currentServObj="currentServObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            :isRead="isRead"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></ServiceHeaderAttr>
        <!-- 运算组件 -->
        <OperationAttr
            v-else-if="showType == 'operationAction'"
            ref="operationAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></OperationAttr>

        <!-- 选择组件 -->
        <ContainerAttr
            v-else-if="showType == 'containerAction'"
            ref="containerAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></ContainerAttr>
        <!-- 设置会话组件 -->
        <CacheSessionAttr
            v-else-if="showType == 'cacheSessionAction'"
            ref="cacheSessionAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></CacheSessionAttr>
        <!-- 设置会话组件 -->
        <UpdateSessionAttr
            v-else-if="showType == 'updateSessionAction'"
            ref="updateSessionAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></UpdateSessionAttr>

        <!-- 获取会话组件 -->
        <GetSessionAttr
            v-else-if="showType == 'getSessionAction'"
            ref="getSessionAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></GetSessionAttr>

        <!-- 生成图形验证码 -->
        <CreateGraphValidateCodeAttr
            v-else-if="showType == 'createGraphValidateCodeAction'"
            ref="createGraphValidateCodeAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></CreateGraphValidateCodeAttr>

        <!-- 校验图形验证码 -->
        <VerifyGraphValidateCodeAttr
            v-else-if="showType == 'verifyGraphValidateCodeAction'"
            ref="verifyGraphValidateCodeAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></VerifyGraphValidateCodeAttr>

        <!-- 拼接组件 -->
        <SpliceAttr
            v-else-if="showType == 'spliceAction'"
            ref="spliceAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></SpliceAttr>

        <!-- 上传组件 -->
        <UploadAttr
            v-else-if="showType == 'uploadAction'"
            ref="uploadAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></UploadAttr>

        <!-- 设置缓存组件 -->
        <GetCacheAttr
            v-else-if="showType == 'getCacheAction'"
            ref="getCacheAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></GetCacheAttr>
        <!-- 设置缓存组件 -->
        <UpdateCacheAttr
            v-else-if="showType == 'updateCacheAction'"
            ref="updateCacheAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></UpdateCacheAttr>
        <!-- 获取缓存组件 -->
        <SetCacheAttr
            v-else-if="showType == 'setCacheAction'"
            ref="setCacheAttrRef"
            :currentServObj="currentServObj"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></SetCacheAttr>

        <!-- 决策组件 -->
        <DecisionAttr
            v-else-if="showType == 'decisionAction'"
            ref="decisionAttrRef"
            :currentServObj="currentServObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            :fourRAttrFlag="fourRAttrFlag"
            :isRead="isRead"
            :transAppId="transAppId"
            @upDateServParams="upDateServParams"
            @updateServiceArrangeList="updateServiceArrangeList"
            @toSave="toSave"
        ></DecisionAttr>
        <!-- 条件分支 -->
        <ConditionLine
            v-else-if="showType == 'conditionLine'"
            ref="conditionLine"
        />
        <AutoAttr
            v-else
            ref="autoAttrRef"
            :currentServObj="currentServObj"
            :currentParentCpnInfo="currentParentCpnInfo"
            :isRead="isRead"
            :transAppId="transAppId"
            :fourRAttrFlag="fourRAttrFlag"
            @upDateServParams="upDateServParams"
            @toSave="toSave"
        ></AutoAttr>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import TransactionAttr from "./components/transaction";
import ServiceAttr from "./components/service";
import { array2nested, setSerialNumber } from "@m/utils/array";
import InputAttr from "./components/input";
import OutputAttr from "./components/output";
// import DataDealAttr from "./components/data_deal"
// import DataListAttr from "./components/data_list"
import LoopAttr from "./components/loop";
import ListAttr from "./components/listAction";
import TransferStateAttr from "./components/transferStateAction";
import GetFlowNumActionAttr from "./components/getFlowNumAction";

import DesensitizationAttr from "./components/desensitizationAction";
import getDesensitizationAction from "./components/getDesensitizationAction";
import CaptchaAction from "./components/captchaAction";
import ListSetValAttr from "./components/listSetValAction";

// import JudgeAttr from "./components/judge"
import ThrowExceptionAttr from "./components/throw_exception";
// import SqlAttr from "./components/sql"
// import RuleAttr from "./components/rule"
// import LineDialog from "./components/line"
// import FourRAttr from "./components/fourR"
import ConcurrentAttr from "./components/concurrent";
import AsyncAttr from "./components/async";
import BreakAttr from "./components/break";
import ContinueAttr from "./components/continue";
import AssignAttr from "./components/assign";
import AutoAttr from "./components/auto";
import KeyMapAttr from "./components/keyMap";
import TimeActionAttr from "./components/timeAction/index.vue";
import ServiceHeaderAttr from "./components/serviceHeader";
import OperationAttr from "./components/operation";
import ContainerAttr from "./components/container";
import CacheSessionAttr from "./components/cache_session";
import GetSessionAttr from "./components/get_session";
import CreateGraphValidateCodeAttr from "./components/create_graph_validate_code";
import VerifyGraphValidateCodeAttr from "./components/verify_graph_validate_code";
import SpliceAttr from "./components/splice";
import UploadAttr from "./components/upload";
import GetCacheAttr from "./components/get_cache";
import SetCacheAttr from "./components/set_cache";
import UpdateCacheAttr from "./components/update_cache";
import UpdateSessionAttr from "./components/update_session";

import DecisionAttr from "./components/decision";
import { mixList, reList } from "@m/utils/paramTree";
import { throttle } from "@m/utils/throttle.js";
import { getLocalStorage, setLocalStorage } from "@m/utils/localStorage";
import { compositeDirList } from "@m/utils/normalData";
import ConditionLine from "./components/ConditionLine.vue";
import ConditionalBranchDrawer from './components/conditionalBranchDrawer'

export default {
    mixins: [mixin],
    components: {
        PageDialog,
        Table,
        TransactionAttr,
        ServiceAttr,
        InputAttr,
        OutputAttr,
        // DataDealAttr,
        LoopAttr,
        // JudgeAttr,
        ThrowExceptionAttr,
        // SqlAttr,
        // RuleAttr,
        // DataListAttr,
        // LineDialog,
        // FourRAttr,
        ConcurrentAttr,
        AsyncAttr,
        BreakAttr,
        ContinueAttr,
        AssignAttr,
        AutoAttr,
        KeyMapAttr,
        ServiceHeaderAttr,
        OperationAttr,
        ContainerAttr,
        CacheSessionAttr,
        GetSessionAttr,
        CreateGraphValidateCodeAttr,
        VerifyGraphValidateCodeAttr,
        SpliceAttr,
        UploadAttr,
        GetCacheAttr,
        SetCacheAttr,
        UpdateCacheAttr,
        DecisionAttr,
        UpdateSessionAttr,
        TimeActionAttr,
        ListAttr,
        TransferStateAttr,
        ListSetValAttr,
        DesensitizationAttr,
        CaptchaAction,
        getDesensitizationAction,
        GetFlowNumActionAttr,
        ConditionLine,
        ConditionalBranchDrawer
    },
    name: "attr",
    props: {
        dicArray: {
            type: Array,
            default: () => [],
        },
        // dataList: {
        //   type: Array,
        //   default: () => [],
        // },
        fnctId: {
            type: String,
            default: () => "",
        },
        // 阅读模式
        isRead: {
            type: Boolean,
            default: () => false,
        },
        currentServObj: {
            type: Object,
            default: () => ({}),
        },
        // layoutList:{
        //   type:Array,
        //   default:() =>[]
        // }
        fourRAttrFlag: {
            type: Boolean,
            default: () => false,
        },
        currentApiId: {
            type: String,
            default: () => "",
        },
        currentParentCpnInfo: {
            type: Object,
            default: () => ({}),
        },
        chooseType: {
            type: Boolean,
            default: () => "",
        },
        showTips: {
            type: Boolean,
            default: () => true,
        },
        showType: {
            type: String,
            default: () => "service",
        },
        typeFrom: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            svcTpCdList: [
                { name: "D4b服务", value: "D4b服务" },
                { name: "D5自有服务", value: "D5自有服务" },
                { name: "D5直连服务", value: "D5直连服务" },
            ],
            bData: [
                {
                    paraNm: "手续费",
                    paraDescr: "手续费服务是否...",
                    isNeed: "0",
                },
            ],
            //组件数据
            currentObj: {},
            // 画布数据
            dataObj: {
                servNm: "",
                servNo: "",
            },
            //当前对象
            currentLineObj: {},
            //判断类型
            //   showType: "service", // 切换传参
            // 编辑表单
            form: {},
            //编辑条件配置 默认条件和优先级的数据
            lineForm: {
                deltCondFlg: "1",
                condPrit: "1",
                condList: [],
                desc: "",
            },
            //增加条件数据
            condList: [],
            changeList: [], //正在改变线条的存储
            //控制编辑条件配置显示或隐藏
            lineVisible: false,
            //编辑条件配置 选项
            condAndOrOptions: [
                { value: "AND", label: "并且" },
                { value: "or", label: "或" },
            ],
            //编辑条件配置 值的数据
            condLevel: [{ value: "1", label: "1", disabled: false }],
            //编辑条件配置 判断条件
            condOptions: [
                { label: "大于", value: ">" },
                { label: "大于等于", value: ">=" },
                { label: "等于", value: "==" },
                { label: "小于", value: "<" },
                { label: "小于等于", value: "<=" },
                { label: "不等于", value: "!=" },
            ],
            d4bInfoTabsList: [
                // { v: "设置", k: "setting" },
                { v: "服务信息", k: "d4b" },
            ],
            fourRtabsList: [
                // { v: "设置", k: "setting" },
                { v: "组件信息", k: "4R" },
                { v: "布局结构", k: "layout" },
            ],
            d4bActive: "d4b",
            fourRActive: "4R",
            // 错误信息映射
            setErrorMsgData: {
                actionDesc: "",
                errorCodeFieldName: "",
                errorCodeMappingFieldName: "",
                errorMsgFieldName: "",
            },
            // 错误信息映射列表
            setErrorMsgList: [],
            // 错误信息映射列表参数
            setErrorMsgtableColumn: [
                {
                    prop: "errorCodeFieldName",
                    label: "源错误码",
                    minWidth: "23%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "errorCodeMappingFieldName",
                    label: "映射错误码",
                    minWidth: "30%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "errorMsgFieldName",
                    label: "映射错误信息",
                    minWidth: "35%",
                    type: "text",
                    tooltip: true,
                },
                {
                    label: "操作",
                    minWidth: "12%",
                    type: "button",
                    buttonList: [
                        {
                            desc: "删除",
                            operate: "del",
                        },
                    ],
                },
            ],
            setErrorMsgVisible: false,
            setErrorMsgform: {
                errorCodeFieldName: "",
                errorCodeMappingFieldName: "",
                errorMsgFieldName: "",
            },
            setErrorMsgformRules: {
                errorCodeFieldName: [
                    {
                        required: true,
                        message: "请输入源错误码",
                        trigger: "blur",
                    },
                ],
                // errorCodeMappingFieldName: [{ required: true, message: "请输入映射错误码", trigger: "blur" }],
                errorMsgFieldName: [
                    {
                        required: true,
                        message: "请输入映射错误信息",
                        trigger: "blur",
                    },
                ],
            },
            // 规则组件
            ruleItemMsgData: {
                name: "",
                type: "",
                desc: "",
            },
            // 组件信息里的业务规则表格列
            cBusinessRuleColumn: [
                {
                    prop: "ruleNm",
                    label: "规则名称",
                    minWidth: "35%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "ruleTpCd",
                    label: "规则类型",
                    minWidth: "25%",
                    type: "text",
                    filter: "ruleTpCd",
                    tooltip: true,
                },
                {
                    prop: "ruleDesc",
                    label: "规则描述",
                    minWidth: "20%",
                    type: "textClick",
                    tooltip: true,
                },
            ],
            // 组件信息里的业务规则表格数据
            cBusinessRuleList: [],
            // 控制规则详情对话框显示或隐藏
            ruleVisible: false,
            currentRuleObj: {},
            currentApiName: "",
            // 条件组件编辑
            judgeData: {
                actionDesc: "",
                actionMsg: "",
            },
            // 数据处理组件编辑
            dataDealData: {
                actionDesc: "",
                actionMsg: "",
            },
            // 异常组件编辑
            errorData: {
                actionDesc: "",
                errorMsg: "",
                errorCode: "",
            },
            // 条件组件编辑
            loopData: {
                actionDesc: "",
                actionMsg: "",
            },
            apiSidebarShow: true,
            flexBasis: "700px",
            isNeedCheck: "",
            headerCheck: "",
            isEnumList: false,

            lastX: "",
            currentX: 0,
            // 跳转确认框的配置信息
            confirmOptions: {
                distinguishCancelAndClose: true,
                confirmButtonText: "保存",
                cancelButtonText: "不保存",
            },
            dataList: [],
            fourRParamData: {},
            serviceIdMapToParamList: {},
            transId: "",
            userSelect: "auto",
            transAppId: "",
        };
    },

    watch: {
        currentServObj() {
            this.currentServObj.transAppId = this.transAppId;
        },
    },
    computed: {
        // 是否修改过组件的参数
        hasChangeCpnParams() {
            if (this.showType == "d4bInfo") {
                return (
                    this.cpnParamsRecord !==
                    JSON.stringify(this.inputParamsListAtSetting)
                );
            } else if (this.showType == "inputAction") {
                return this.$refs.inputAttrRef.hasChangeCpnParams;
            } else if (this.showType == "outputAction") {
                return this.$refs.outputAttrRef.hasChangeCpnParams;
            } else if (this.showType == "dataDealAction") {
                return this.$refs.dataDealAttrRef.hasChangeCpnParams;
            } else if (this.showType == "dataListAction") {
                return this.$refs.dataListAttrRef.hasChangeCpnParams;
            } else if (this.showType == "judgeAction") {
                return this.$refs.judgeAttrRef.hasChangeCpnParams;
            } else if (this.showType == "loopAction") {
                return this.$refs.loopAttrRef.hasChangeCpnParams;
            } else if (this.showType == "concurrentAction") {
                return this.$refs.concurrentAttrRef.hasChangeCpnParams;
            } else if (this.showType == "asyncAction") {
                return this.$refs.asyncAttrRef.hasChangeCpnParams;
            } else if (this.showType == "throwExceptionAction") {
                return this.$refs.throwExceptionAttrRef.hasChangeCpnParams;
            } else if (this.showType == "sqlAction") {
                return this.$refs.sqlAttrRef.hasChangeCpnParams;
            } else if (this.showType == "ruleAction") {
                return this.$refs.ruleAttrRef.hasChangeCpnParams;
            } else if (this.showType == "4RAction") {
                return this.$refs.fourRAttrRef.hasChangeCpnParams;
            }
        },
    },
    inject: ["getDataList", "setCurrentActionId"],
    methods: {
        getActionFrntSeq() {
            const cpn = this.getDataList().find(
                (item) => item.compositeId == this.currentObj.compositeId
            );
            const result = cpn?.conf.find(
                (item) => item.name == "actionFrntSeq"
            )?.value;
            return result;
        },
        async getR5Detail(e, flag) {
            console.log(123, e);
            const parmas = {
                apiId: e.actionOwnId || e,
            };
            const res = await this.rpc.d5.getR5Detail(parmas);
            this.formData = {
                svcNm: res.apiName,
                svcTpCd: "D5自有服务",
                svcCd: res.apiCode,
                svcDesc: res.apiDesc,
                svcVersionNo: res.versionDesc,
            };
            // this.currentObj = res;
            this.inputParamsList = this.inputParamsListAtSetting = reList(
                res.puApiParams.filter((item) => item.paramDirection == "0")
            );
            this.outputParamsList = this.outputParamsListAtSetting = reList(
                res.puApiParams.filter((item) => item.paramDirection == "1")
            );
            this.cBusinessRuleList = res.bizRuleList;
            this.setCpnParamsRecord();
            if (e.compositeId) {
                const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11";
                const params = {
                    d4StusCd: "1",
                    blngtoTyp,
                    compositeId: e.compositeId || "",
                };
                const res = await this.rpc.d4.getServiceCpnParams(params);
                console.log(res);
                this.inputParamsListAtSetting = reList(
                    res.paramList.filter((item) => item.paramDirection == "0")
                );
                this.outputParamsListAtSetting = reList(
                    res.paramList.filter((item) => item.paramDirection == "1")
                );
                this.setCpnParamsRecord();
            }
            this.showType = "d4bInfo";
            this.d4bActive = "d4b";
            // this.currentR5Obj = res
            if (flag) {
                this.saveAction();
            }
        },
        // 改成条件显示
        changeShowTypeCondition(e) {
            this.showType = "lineAction";
            this.$nextTick(() => {
                this.$refs.conditionalBranchDrawer.init(e, false);
            });
            // this.$nextTick(() => {
            //     this.$refs.conditionLine.init(line);
            // });
        },
        // 获取参数
        getAttr(e, click) {
            // setTimeout(() => {
            new Promise((resolve, reject) => {
                // 修改了组件参数设置
                if (this.hasChangeCpnParams) {
                    console.log("修改过参数");
                    this.$confirm(
                        "您修改了组件参数，还未保存，需要保存吗？",
                        this.confirmOptions
                    )
                        .then(async () => {
                            await this.saveAction();
                            // await this.saveServiceCpnParams("d4bInfo")
                            // this.resetCpnParamsRecord()
                            resolve();
                        })
                        .catch(() => {
                            this.resetCpnParamsRecord();
                            resolve();
                        });
                } else {
                    // 没有修改过组件参数设置
                    resolve();
                }
            }).then(async () => {
                this.showType = "";
                this.currentObj = e;
                if (
                    ["D4bAction", "D5SelfAction", "D5LinkAction"].indexOf(
                        e.actionType
                    ) > -1
                ) {
                    this.showType = "d4bInfo";
                    // await this.getAllL5ServiceParamList()
                    this.$nextTick(() => {
                        this.$refs.serviceAttrRef.init(e, click);
                    });
                } else if (e.actionType == "decisionAction") {
                    this.showType = "decisionAction";
                    this.$nextTick(() => {
                        this.$refs.decisionAttrRef.init(e, click);
                    });
                } else if (e.actionType == "newD5Action") {
                    // this.d4bActive = "d4b"
                    if (click) {
                        console.log("获取R5详情");
                        this.getR5Detail(e);
                    }
                } else if (e.actionType == "inputAction") {
                    this.showType = "inputAction";
                    this.$nextTick(() => {
                        this.$refs.inputAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "outputAction") {
                    this.showType = "outputAction";
                    this.$nextTick(() => {
                        this.$refs.outputAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "throwExceptionAction") {
                    // this.errorData = this.getAction(e.conf);
                    this.showType = "throwExceptionAction";
                    this.$nextTick(() => {
                        this.$refs.throwExceptionAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "ruleAction") {
                    this.showType = "ruleAction";
                    this.$nextTick(() => {
                        this.$refs.ruleAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "judgeAction") {
                    // this.judgeData = this.getAction(e.conf);
                    this.showType = "judgeAction";
                    this.$nextTick(() => {
                        this.$refs.judgeAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "loopAction") {
                    // this.loopData = this.getAction(e.conf);
                    this.showType = "loopAction";
                    this.$nextTick(() => {
                        this.$refs.loopAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "listAction") {
                    // this.loopData = this.getAction(e.conf);
                    this.showType = "listAction";
                    this.$nextTick(() => {
                        this.$refs.listAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "transferStateAction") {
                    this.showType = "transferStateAction";
                    this.$nextTick(() => {
                        this.$refs.transferStateRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "getFlowNumAction") {
                    this.showType = "getFlowNumAction";
                    this.$nextTick(() => {
                        this.$refs.getFlowNumAction.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "desensitizationAction") {
                    this.showType = "desensitizationAction";
                    this.$nextTick(() => {
                        this.$refs.desensitizationAction.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "getDesensitizationAction") {
                    this.showType = "getDesensitizationAction";
                    this.$nextTick(() => {
                        this.$refs.getDesensitizationAction.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "captchaAction") {
                    this.showType = "captchaAction";
                    this.$nextTick(() => {
                        this.$refs.captchaAction.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "listSetValAction") {
                    this.showType = "listSetValAction";
                    this.$nextTick(() => {
                        this.$refs.ListSetValRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "concurrentAction") {
                    this.showType = "concurrentAction";
                    this.$nextTick(() => {
                        this.$refs.concurrentAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "asyncAction") {
                    this.showType = "asyncAction";
                    this.$nextTick(() => {
                        this.$refs.asyncAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "dataDealAction") {
                    // this.dataDealData = this.getAction(e.conf);
                    this.showType = "dataDealAction";
                    this.$nextTick(() => {
                        this.$refs.dataDealAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "sqlAction") {
                    // this.dataDealData = this.getAction(e.conf);
                    this.showType = "sqlAction";
                    this.$nextTick(() => {
                        this.$refs.sqlAttrRef.getParams(e, this.currentServObj);
                    });
                } else if (e.actionType == "dataListAction") {
                    // this.dataDealData = this.getAction(e.conf);
                    this.showType = "dataListAction";
                    this.$nextTick(() => {
                        this.$refs.dataListAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "4RAction") {
                    // this.dataDealData = this.getAction(e.conf);
                    this.showType = "4RAction";
                    this.$nextTick(() => {
                        this.$refs.fourRAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                    this.fourRParamData = e;
                } else if (e.actionType == "breakAction") {
                    this.showType = "breakAction";
                    this.$nextTick(() => {
                        this.$refs.breakAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "continueAction") {
                    this.showType = "continueAction";
                    this.$nextTick(() => {
                        this.$refs.continueAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "assignAction") {
                    this.showType = "assignAction";
                    this.$nextTick(() => {
                        this.$refs.assignAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "keyMapAction") {
                    this.showType = "keyMapAction";
                    this.$nextTick(() => {
                        this.$refs.keyMapAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "timeAction") {
                    this.showType = "timeAction";
                    this.$nextTick(() => {
                        console.log(
                            this.$refs.timeActionAttrRef.getParams,
                            "timeActionAttrRef"
                        );
                        this.$refs.timeActionAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType === "setHeaderAction") {
                    this.showType = "setHeaderAction";
                    this.$nextTick(() => {
                        this.$refs.serviceHeaderAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "operationAction") {
                    this.showType = "operationAction";
                    this.$nextTick(() => {
                        this.$refs.operationAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "containerAction") {
                    this.showType = "containerAction";
                    this.$nextTick(() => {
                        this.$refs.containerAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "cacheSessionAction") {
                    this.showType = "cacheSessionAction";
                    this.$nextTick(() => {
                        this.$refs.cacheSessionAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "updateSessionAction") {
                    this.showType = "updateSessionAction";
                    this.$nextTick(() => {
                        this.$refs.updateSessionAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "getSessionAction") {
                    this.showType = "getSessionAction";
                    this.$nextTick(() => {
                        this.$refs.getSessionAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "createGraphValidateCodeAction") {
                    this.showType = "createGraphValidateCodeAction";
                    this.$nextTick(() => {
                        this.$refs.createGraphValidateCodeAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "verifyGraphValidateCodeAction") {
                    this.showType = "verifyGraphValidateCodeAction";
                    this.$nextTick(() => {
                        this.$refs.verifyGraphValidateCodeAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "spliceAction") {
                    this.showType = "spliceAction";
                    this.$nextTick(() => {
                        this.$refs.spliceAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "uploadAction") {
                    this.showType = "uploadAction";
                    this.$nextTick(() => {
                        this.$refs.uploadAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "updateCacheAction") {
                    this.showType = "updateCacheAction";
                    this.$nextTick(() => {
                        this.$refs.updateCacheAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "getCacheAction") {
                    this.showType = "getCacheAction";
                    this.$nextTick(() => {
                        this.$refs.getCacheAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if (e.actionType == "setCacheAction") {
                    this.showType = "setCacheAction";
                    this.$nextTick(() => {
                        this.$refs.setCacheAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                } else if(e.actionType == "lineAction") {
                    this.showType = "lineAction";
                    this.$nextTick(() => {
                        this.$refs.conditionalBranchDrawer.init(e, click);
                    });
                    
                } else {
                    this.showType = e.actionType;
                    console.log(e, this.currentServObj, "oooooooooooooo");
                    this.$nextTick(() => {
                        this.$refs.autoAttrRef.getParams(
                            e,
                            this.currentServObj
                        );
                    });
                }
            });
            // }, 0)
        },
        showServInfo(e) {
            this.showType = "d4bInfo";
            this.$nextTick(() => {
                this.$refs.serviceAttrRef.showServInfo(e);
            });
            // this.currentObj = e
            // this.inputParamsList  = reList(e.puApiParams.filter((item) => item.paramDirection == "0"));
            // this.outputParamsList = reList(e.puApiParams.filter((item) => item.paramDirection == "1"));
            // this.businessRuleList = e.businessRuleList
            // this.showType = 'service'
        },
        handleGetDataList() {
            this.dataList = this.getDataList();
        },
        // conf转换
        getAction(e) {
            let data = {};
            for (let i in e) {
                data[e[i].name] = e[i].value;
            }
            return data;
        },
        // ErrorMsg转换
        getErrorMsg(e) {
            let data = [];
            if (
                e.errorCodeFieldName == "" ||
                !e.errorCodeFieldName ||
                !e.errorCodeMappingFieldName ||
                !e.errorMsgFieldName
            )
                return data;
            let sppa = e.errorCodeFieldName.split("||") || [];
            let spsource = e.errorCodeMappingFieldName.split("||") || [];
            let spdesc = e.errorMsgFieldName.split("||") || [];
            for (let i in sppa) {
                let n = {
                    errorCodeFieldName: sppa[i],
                    errorCodeMappingFieldName: spsource[i],
                    errorMsgFieldName: spdesc[i],
                };
                data.push(n);
            }
            return data;
        },
        toSave(refresh = false) {
            this.$emit("toSave", refresh);
        },
        conditionalBranchSave(id) {
            this.$emit("conditionalBranchSave", id);
        },
        upDateServParams(currentObj, e, layoutServiceBeanList) {
            this.$notify({
                title: "成功",
                message: "保存成功",
                duration: 2000,
                type: "success",
            });
            this.getToSave().then(() => {
                this.$emit("upDateServParams", currentObj, e);
                // if (
                //     [
                //         "D4bAction",
                //         "D5SelfAction",
                //         "D5LinkAction",
                //         "loopAction",
                //         "listAction",
                //         "spliceAction",
                //         "listSetValAction",
                //         "uploadAction",
                //         "setHeaderAction",
                //         "transferStateAction",
                //         "desensitizationAction",
                //         "inputAction",
                //         "captchaAction",
                //         "getCacheAction",
                //     ].includes(currentObj.actionType)
                // ) {
                //     this.$emit(
                //         "updateServiceArrangeList",
                //         layoutServiceBeanList
                //     );
                // }
            });
        },
        async getToSave() {
            const params = {
                flowId: this.fourRAttrFlag
                    ? this.currentObj.compositeId
                    : this.currentServObj?.svcId,
                flowType: this.fourRAttrFlag ? "2" : "1",
            };
            const res = await this.rpc.d4.saveAction(params);
        },
        // 保存动作
        async saveAction() {
            console.log("saveAction");
            if (this.showType == "d4bInfo") {
                // await this.saveServiceCpnParams("d4bInfo")
                await this.$refs.serviceAttrRef.saveServiceCpnParams("d4bInfo");
                // this.resetCpnParamsRecord()
            } else if (this.showType == "inputAction") {
                await this.$refs.inputAttrRef.saveParams();
            } else if (this.showType == "outputAction") {
                await this.$refs.outputAttrRef.saveParams();
            } else if (this.showType == "dataDealAction") {
                await this.$refs.dataDealAttrRef.saveParams();
            } else if (this.showType == "dataListAction") {
                await this.$refs.dataListAttrRef.saveParams();
            } else if (this.showType == "judgeAction") {
                await this.$refs.judgeAttrRef.saveParams();
            } else if (this.showType == "loopAction") {
                await this.$refs.loopAttrRef.saveParams();
            } else if (this.showType == "concurrentAttrRef") {
                await this.$refs.concurrentAttrRef.saveParams();
            } else if (this.showType == "asyncAttrRef") {
                await this.$refs.asyncAttrRef.saveParams();
            } else if (this.showType == "throwExceptionAction") {
                await this.$refs.throwExceptionAttrRef.saveParams();
            } else if (this.showType == "sqlAction") {
                await this.$refs.sqlAttrRef.saveParams();
            } else if (this.showType == "ruleAction") {
                await this.$refs.ruleAttrRef.saveParams();
            } else if (this.showType == "4RAction") {
                await this.$refs.fourRAttrRef.saveParams();
            } else if (this.showTYpe == "listAction") {
                await this.$refs.listAttrRef.saveParams();
            }
        },
        // 更新action
        updateDataParams(e) {
            console.log("updateDataParams", e);
            for (let i in this.currentObj.conf) {
                this.currentObj.conf[i].value = e[this.currentObj.conf[i].name];
            }
            this.$emit("updateDataParams", this.currentObj);
        },
        // 获取条件
        getCondition(e, lineList) {
            console.log("getCondition", e, lineList);
            if (e.sourceId.indexOf("judgeAction") > -1 && !this.isRead) {
                // 点击从条件组件拉出来的线
                try {
                    const judgeCpn = this.getDataList().find(
                        (item) => item.actionId == e.sourceId
                    );
                    const paramList = judgeCpn.conf.find(
                        (item) => item.name == "paramList"
                    ).value;
                    const _paramList = JSON.parse(paramList);
                    const target = _paramList.find(
                        (item) => item.targetId == e.targetId
                    );
                    if (!target) {
                        this.$refs.lineDialogRef.showDialog("add", e, judgeCpn);
                    } else {
                        const data = _paramList.find(
                            (item) => item.targetId == e.targetId
                        );
                        this.$refs.lineDialogRef.showDialog(
                            "edit",
                            data,
                            judgeCpn
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            // const sameSourceLines = lineList.filter(item => item.sourceId == e.sourceId)
            // // 已经选择了的优先级
            // const cache = sameSourceLines.map(item => item.condition.condPrit)
            // const condLevel = []
            // for (let i = 0; i < sameSourceLines.length; i++) {
            //   condLevel[i] = { value: i + "", label: i + "" }
            // }
            // this.condLevel = condLevel
            // this.currentLineObj = e;
            // this.lineForm = this.currentLineObj.condition;
            // if (!this.lineForm.condList) {
            //   this.lineForm.condList = [];
            // }
            // this.condList = this.lineForm.condList || [];
            // this.showType = "line";
        },
        generateLineCondPrit(lineObj, lineList) {
            const sameSourceLines = lineList.filter(
                (item) => lineObj.sourceId == item.sourceId
            );
            lineObj.condition.condPrit = sameSourceLines.length - 1 + "";
            this.currentLineObj = lineObj;
            this.$nextTick(() => {
                this.upDateCondition();
            });
        },
        // 获取活动参数
        getFlowParams(e) {
            console.log("活动参数", e);
            this.currentObj = e;
            this.showType = "service";
            this.$nextTick(() => {
                this.$refs.transactionAttrRef.init(e);
            });
        },
        // 获取4R组件参数
        get4RFlowParams(e) {
            // this.currentServObj = e;
            // this.showType = "4RView";
            // this.fourRActive = "4R";
            // this.getAttr(e)
            this.refresh();
        },
        getSvgClickEvent(e) {
            console.log("点击空白");
            new Promise((resolve, reject) => {
                // 修改了组件参数设置
                if (this.hasChangeCpnParams) {
                    console.log("修改过参数");
                    this.$confirm(
                        "您修改了组件参数，还未保存，需要保存吗？",
                        this.confirmOptions
                    )
                        .then(async () => {
                            await this.saveAction();
                            // await this.saveServiceCpnParams("d4bInfo")
                            // this.resetCpnParamsRecord()
                            resolve();
                        })
                        .catch(() => {
                            this.resetCpnParamsRecord();
                            resolve();
                        });
                } else {
                    // 没有修改过组件参数设置
                    resolve();
                }
            }).then(() => {
                if (
                    ["loopAction", "asyncAction", "4RAction"].includes(
                        this.currentParentCpnInfo.actionType
                    )
                ) {
                    this.getAttr(this.currentParentCpnInfo);
                    // this.show4R(e)
                } else {
                    this.getFlowParams(e);
                }
            });
        },
        show4R(e) {
            this.get4RFlowParams();
            this.$nextTick(() => {
                console.log("ref数据", this.$refs, this.$refs.fourRAttrRefs);
                this.$refs.fourRAttrRefs.getParams(this.fourRParamData, e);
            });
        },
        //点击编辑条件配置按钮
        showLine() {
            console.log("this.condList", this.condList);
            this.changeList = JSON.parse(JSON.stringify(this.condList || []));
            if (
                this.changeList.length == 1 &&
                this.changeList[0].sorcParaTyp == ""
            ) {
                this.changeList[0].sorcParaTyp = "00";
            }
            this.lineVisible = true;
        },
        //保存编辑条件配置
        saveLine(flag = true) {
            // flag：是否进行填写项校验
            if (flag) {
                let i;
                this.changeList.forEach((item, index) => {
                    if (
                        !(
                            (item.mtchMode || index == 0) &&
                            item.sorcParaVal &&
                            item.condTyp &&
                            item.trgtParaTyp &&
                            item.trgtParaVal
                        )
                    ) {
                        i = true;
                    } else {
                        i = false;
                    }
                });
                if (i) return this.$message.error("条件填写有误");
            }
            this.condList = JSON.parse(JSON.stringify(this.changeList));
            this.lineForm.condList = this.condList;
            this.currentLineObj.condition = this.lineForm;
            this.upDateCondition();
            this.lineVisible = false;
        },
        //取消编辑条件配置
        cancelLine() {
            this.lineVisible = false;
        },
        //删除添加的条件
        innerDelLine(e) {
            this.changeList.splice(e, 1);
        },
        //在左侧面板删除已配置的条件
        delLine(e) {
            console.log("删除", this.e);
            this.condList.splice(e, 1);
            this.upDateCondition();
        },
        //点击增加条件按钮
        addLine() {
            const d = {
                mtchMode: "AND",
                sorcParaTyp: "00",
                sorcParaVal: "",
                condTyp: "==",
                trgtParaTyp: "01",
                trgtParaVal: "",
            };
            this.changeList.push(d);
        },
        //输入框的值发生改变
        handleConditionInput(e, i) {
            if (i == "s") {
                e.sorcParaNm = e.sorcParaVal;
            } else {
                e.trgtParaNm = e.trgtParaVal;
            }
            this.$forceUpdate();
        },
        //下拉框的值发生改变
        handleConditionSelect(e, i) {
            if (i == "s") {
                e.sorcParaNm = this.dicArray.filter(
                    (item) => item.paraNo == e.sorcParaVal
                )[0].paraNm;
            } else {
                e.trgtParaNm = this.dicArray.filter(
                    (item) => item.paraNo == e.trgtParaVal
                )[0].paraNm;
            }
            this.$forceUpdate();
        },
        //更新数据 并向父组件返回当前对象
        upDateCondition() {
            this.$emit("updateConditionEvent", this.currentLineObj);
        },
        // 更新活动参数
        upDateFlowParams() {
            this.currentObj.input = this.sData;
            this.currentObj.output = this.rData;
            const d = this.sData.concat(this.rData);

            this.currentObj.paramList = d;
            this.$emit("upDateFlowParams", this.currentObj);
        },
        //返回两个值或者是参数之间的条件判断类型
        condType(e) {
            return filters.condType(e);
        },
        //返回当前条件的类型 为 并且 还是 或
        condAndOr(e) {
            return filters.condAndOr(e);
        },
        // 错误信息添加参数
        addsetErrorMsg() {
            this.setErrorMsgVisible = true;
            this.setErrorMsgform.errorCodeFieldName = "";
            this.setErrorMsgform.errorCodeMappingFieldName = "";
            this.setErrorMsgform.errorMsgFieldName = "";
        },
        setErrorMsgcloseDialog() {
            this.setErrorMsgVisible = false;
        },
        // 错误信息确认参数
        setErrorMsgconfirm() {
            this.$refs.setErrorMsgformRef.validate((valid) => {
                if (!valid)
                    return this.$message.error("基本信息填写有误或未填写");
                this.setErrorMsgList.push(
                    JSON.parse(JSON.stringify(this.setErrorMsgform))
                );
                this.saveAction();
                this.setErrorMsgcloseDialog();
            });
        },
        // 点击错误信息列表的操作列按钮
        setErrorMsgoperate(e, data) {
            this.setErrorMsgList = this.setErrorMsgList.filter(
                (item) =>
                    item.errorCodeFieldName != data.errorCodeFieldName ||
                    item.errorMsgFieldName != data.errorMsgFieldName
            );
            this.saveAction();
        },
        // 获取线的条件配置描述
        getConditionDesc() {
            return this.condList.reduce((pre, item, index) => {
                return `${pre}${
                    index != 0 ? this.mtchModeFilter(item.mtchMode) : ""
                }${item.sorcParaNm}${item.condTyp}${item.trgtParaNm}`;
            }, "");
        },
        mtchModeFilter(value) {
            switch (value) {
                case "AND":
                    return "&&";
                case "or":
                    return "||";
                default:
                    return value;
            }
        },
        handleTrgtParaTypChange(data) {
            data.trgtParaVal = "";
        },
        // 线条的优先级下拉框改变值时
        handleCondPritChange(lineObj, e) {
            this.$emit(
                "handleCondPritChange",
                e,
                this.handleCondPritChange.oldCondPrit,
                lineObj
            );
            this.handleCondPritChange.oldCondPrit = e;
            this.$forceUpdate();
        },
        handleCondPritFocus(e) {
            this.handleCondPritChange.oldCondPrit = e.target.value;
        },
        // 切换表格的显示模式（是否完整显示）
        switchTableMode(e) {
            if (e == "input")
                this.showAllInputParams = !this.showAllInputParams;
            if (e == "output")
                this.showAllOutputParams = !this.showAllOutputParams;
            if (e == "inputAtSetting")
                this.showAllInputParamsAtSetting =
                    !this.showAllInputParamsAtSetting;
            if (e == "outputAtSetting")
                this.showAllOutputParamsAtSetting =
                    !this.showAllOutputParamsAtSetting;
        },

        // 关闭规则详情弹窗
        ruleMsgCloseDialog() {
            this.ruleVisible = false;
            this.currentRuleObj = {};
        },

        // 切换设置页签下的输入参数列表的显示
        changeInputParamsVisible() {
            this.inputParamsVisibleAtSetting =
                !this.inputParamsVisibleAtSetting;
        },
        // 切换设置页签下的输出参数列表的显示
        changeOutputParamsVisible() {
            this.outputParamsVisibleAtSetting =
                !this.outputParamsVisibleAtSetting;
        },
        showChange() {
            this.apiSidebarShow = !this.apiSidebarShow;
            this.currentX = 0;
            this.flexBasis = this.apiSidebarShow
                ? "700px"
                : `${document.body.offsetWidth / 2}px`;
        },
        // 非必输多选框点击
        isNeedChange(e) {
            console.log(e);
        },
        mouseDown(ev) {
            let x = ev.clientX;
            let s = document.querySelector(
                ".aop_tradecode_comps_d5design_process_attr"
            );
            this.userSelect = "none";
            (document.onmousemove = throttle((event) => {
                if (this.currentX == x - event.clientX) return;
                this.flexBasis =
                    s.offsetWidth + (x - event.clientX - this.currentX) + "px";
                this.currentX = x - event.clientX;
            })),
                (document.onmouseup = (event) => {
                    this.userSelect = "auto";
                    setLocalStorage(
                        "downdesign_right_menu_width",
                        this.flexBasis
                    );
                    this.currentX = 0;
                    document.onmousemove = null;
                });
        },
        // 布局结构点击
        handleClickServ(e) {
            // this.$emit("getDataList")
            // let list = JSON.parse(JSON.stringify(this.dataList))
            let list = this.getDataList();
            this.layoutList = list.sort((a, b) => {
                return a.actionY == b.actionY
                    ? a.actionX - b.actionX
                    : a.actionY - b.actionY;
            });
        },
        // 新增条件保存
        saveLineDialog(judgeCpn, data) {
            console.log("saveLineDialog", judgeCpn, data);
            this.currentObj = judgeCpn;
            this.showType = "judgeAction";
            this.setCurrentActionId(judgeCpn.actionId);
            this.$nextTick(() => {
                this.$refs.judgeAttrRef.getParams(
                    judgeCpn,
                    this.currentServObj,
                    data,
                    "add"
                );
            });
        },
        // 编辑条件保存
        editLineDialog(judgeCpn, data) {
            console.log("editLineDialog", judgeCpn, data);
            this.currentObj = judgeCpn;
            this.showType = "judgeAction";
            this.setCurrentActionId(judgeCpn.actionId);
            this.$nextTick(() => {
                this.$refs.judgeAttrRef.getParams(
                    judgeCpn,
                    this.currentServObj,
                    data,
                    "edit"
                );
            });
        },
        // 输出目标-增加行
        addOutputTargetLine() {
            console.log("addOutputTargetLine", this.currentObj);
            const row = JSON.parse(JSON.stringify(this.layoutActionList[0]));
            row.postLoSeqNo = "";
            row.actionPostSeq = "";
            row.paramKey = "";
            row.paramNm = "";
            row.condTyp = "";
            row.paramValue = "";
            this.outputTargetList.push(row);
            this.outputTargetList = JSON.parse(
                JSON.stringify(this.outputTargetList)
            );
            // this.outputTargetList.push({
            //   paramKey: "",
            //   paramNm: "",
            //   condTyp: "=",
            //   paramValue: "",
            //   actionPostSeq: "",
            //   tranId: this.currentServObj.apiId,
            //   svcId: this.currentObj.svcId,
            //   loSeqNo: this.currentObj.conf.find(item => item.name == "actionSeq")?.value,
            //   frntLoSeqNo: this.currentObj.conf.find(item => item.name == "actionFrntSeq")?.value,
            //   postLoSeqNo: this.currentObj.conf.find(item => item.name == "actionPostSeq")?.value,
            //   tfrCdtnCd: "",
            // })
        },
        outputTargetOperate(operation, data) {
            console.log("outputTargetOperate", operation, data);
            if (operation == "paramNm") {
                this.$refs.selectOutputFieldRef.showDialog(data);
            } else if (operation == "actionPostSeq") {
                this.$refs.selectOutputPostSeqRef.showDialog(data);
            } else if (operation == "delete") {
                const index = this.outputTargetList.indexOf(data);
                this.outputTargetList.splice(index, 1);
            }
        },
        setOutputTarget(type, target, obj) {
            console.log(
                "setOutputTarget",
                type,
                target,
                obj,
                this.outputTargetList.indexOf(target)
            );
            if (type == "paramNm") {
                target.paramKey = obj.paramKey;
                target.paramNm = obj.paramCName;
            } else if (type == "actionPostSeq") {
                target.actionPostSeq = obj.actionSeq;
                target.postLoSeqNo = obj.actionSeq;
            }
            this.outputTargetList = JSON.parse(
                JSON.stringify(this.outputTargetList)
            );
        },
        handleClose() {
            this.$emit("handleClose");
        },
        updateServiceArrangeList(layoutServiceBeanList) {
            this.$emit(
                "updateServiceArrangeList",
                layoutServiceBeanList,
                this.currentObj
            );
        },
        // 获取所有L5服务的参数
        async getAllL5ServiceParamList() {
            const dataList = this.getDataList();
            const promises = dataList.reduce(
                (prev, data) => {
                    if (
                        ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
                            data.actionType
                        ) &&
                        !(data.actionOwnId in this.serviceIdMapToParamList)
                    ) {
                        const apiId = data.conf.find(
                            (item) => item.name == "svcId"
                        ).value;
                        prev.set(
                            apiId,
                            this.rpc.d4.getServiceCpnDefaultParams({
                                d4StusCd: "1",
                                blngtoTyp: "10",
                                apiId: apiId,
                                d4bApiId: this.currentServObj.apiId,
                            })
                        );
                    }
                    return prev;
                },
                new Map([
                    [
                        this.currentServObj.apiId,
                        Promise.resolve({
                            paramList: this.currentServObj.puApiParams,
                        }),
                    ],
                ])
            );
            Promise.all(promises).then((res, a) => {
                res.forEach(([apiId, data]) => {
                    data.then((_res) => {
                        this.serviceIdMapToParamList[apiId] = _res.paramList;
                    });
                });
            });
            console.log(
                "this.serviceIdMapToParamList",
                this.serviceIdMapToParamList
            );
        },
        refresh() {
            this.showType = "";
            this.$nextTick(() => {
                const item = this.getDataList().find(
                    (item) => item.actionId == this.currentObj.actionId
                );
                if (item) {
                    this.getAttr(item, true);
                } else {
                    this.getSvgClickEvent(this.currentServObj);
                }
            });
        },
        async getProjcet() {
            console.log("这里");
            const res = await this.rpc.assetList.queryApplicationFunctionList({
                fnctId: this.$route.query.fnctId,
                examId: this.$route.query.examId,
            });
            this.transAppId = res.transAppId;
            this.currentServObj.transAppId = this.transAppId;
            console.log(res, "async getProjcet", this.currentServObj);
        },
        init() {
            // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId;
            // if (!this.isRead) {
            //   const downdesign_right_menu_width = getLocalStorage("downdesign_right_menu_width")
            //   if (downdesign_right_menu_width) {
            //     this.flexBasis = downdesign_right_menu_width
            //   }
            // }
            if (this.typeFrom != "showDetail") {
                this.getProjcet();
            }
            const downdesign_right_menu_width = getLocalStorage(
                "downdesign_right_menu_width"
            );
            if (downdesign_right_menu_width) {
                this.flexBasis = downdesign_right_menu_width;
            }
            console.log(compositeDirList, "compositeDirList");
        },
        checkRule(data) {
            this.$emit("checkRule", data);
        },
    },
    created() {
        this.init();
    },
    filters: {
        ...filters,
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d5design_process_attr {
    position: relative;
    flex: 0 0 700px;
    // border-left: 1px solid $pri_br_color;
    // user-select: none;
    z-index: 15;
    background: $base_white;
    .bold_text {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
    }
    .width_move {
        width: 4px;
        position: absolute;
        left: -3px;
        height: 100%;
        cursor: w-resize;
        background: #f5f5fa;
        z-index: 1;
        opacity: 0;
    }
    .trigger_diy {
        position: absolute;
        left: -22px;
        top: 50%;
        width: 11px;
        height: 84px;
        line-height: 84px;
        color: #fff;
        font-size: 18px;
        padding-right: 10px;
        cursor: pointer;
        transition: background 0.3s ease;
        z-index: 200;
        background: rgba(0, 0, 0, 0);
        border-top: 11px solid rgba(0, 0, 0, 0);
        border-bottom: 11px solid rgba(0, 0, 0, 0);
        border-right: 11px solid #409eff;
        i {
            margin-left: 7px;
            margin-top: -25px;
            vertical-align: middle;
        }
    }
    .trigger_diy_without_sidebar {
        transform: rotate(180deg);
        transform-origin: 100% 50% 0;
    }
    .attr_main {
        height: 100%;
        ::v-deep .el-table__cell {
            padding: 2px 0;
            .cell {
                span {
                    font-size: 12px;
                }
            }
        }
        ::v-deep tr {
            .cell {
                font-size: 12px;
                padding: 0;
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
        margin-bottom: 10px;
        &.underline {
            border-bottom: 1px solid $pri_br_color;
        }
        &.mb0 {
            margin-bottom: 0;
        }
        .el-icon-arrow-down {
            cursor: pointer;
            &.hidden {
                transform: rotate(180deg);
            }
        }
        .el-icon-more {
            cursor: pointer;
        }
        .attr_pre_title_b {
            color: $reg_ft_color;
            &.bold {
                font-weight: 600;
            }
        }
    }
    .attr_content {
        background-color: $base_bg_color;
        padding: 20px 10px;
    }
    .attr_box {
        height: 100%;
        overflow-y: scroll;
        padding-bottom: 102px;
        background: $base_bg_color;
        &.mt10 {
            margin-top: 10px;
        }
        .base_info {
            margin: 10px 20px 0;
            border-bottom: 1px solid #e7e7ee;
            .flex_container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 16px;
                .info_list_item {
                    display: flex;
                    align-items: center;
                    max-width: 33%;
                    .title {
                        color: #999;
                        white-space: nowrap;
                    }
                    .content {
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    .attr_show {
        padding: 0px 20px;
        overflow: hidden;
        .attr_show_item {
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
                    white-space: nowrap;
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
                    overflow: hidden;
                    text-overflow: ellipsis;
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
            &.boder_bottom {
                border-bottom: 1px solid #e7e7ee;
            }
            .can_select {
                user-select: text;
            }
            .sub_title {
                font-size: 12px;
                margin-bottom: 6px;
            }
            .attr_show_item_t {
                width: 100%;
                margin-right: 10px;
                margin-bottom: 10px;
                font-weight: $font_weight_600;
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
            }
            .attr_show_item_c {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
        padding: 8px 20px;
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        width: calc(100% - 10px);
        padding: 10px;
        background: $base_white;
        z-index: 10;
        border-left: 2px solid #dcdfe6;
        border-top: 1px solid #dcdfe6;
        ::v-deep .el-button {
            @include normal_button_common;
            width: 112px;
            color: $reg_ft_color;
            background: $base_white;
            border: 1px solid $pri_br_color;
            &.el-button--primary {
                @include primary_button;
            }
        }
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
    .el-menu {
        border-right: 0;
        ::v-deep .is-active {
            color: #303133;
        }
        .is_active {
            color: $theme_color;
            background-color: #eaf1ff;
            font-weight: $font_weight_600;
        }
        ::v-deep .el-menu-item {
            padding-left: 10px !important;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            letter-spacing: 0;
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
        margin-left: 5px;
        &.outside {
            color: #ff934b;
            background: #fff4e5;
            font-size: 14px;
        }
    }
    .header_close {
        position: absolute;
        top: 8px;
        right: 20px;
        cursor: pointer;
        z-index: 99;
    }
    .serv_style {
        top: 12px;
    }
}
</style>
