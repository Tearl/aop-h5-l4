<template>
    <div class="add_obj_behavior_box">
        <common-header :label="fieldLabelName" @routeBack="routeBack"></common-header>
        <div class="base_info_box" id="applyDetailBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">申请详情</span>
            </div>
            <div class="card_desc">新增数据字段申请</div>
            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../../../assets/images/icon_approve_user.png" alt="" class="card_tip_icon" />
                        <span>{{ detailData.aplyUserName || "/" }}</span>
                    </div>
                    <div class="list_item">
                        <img src="../../../../assets/images/icon_approve_time.png" alt="" class="card_tip_icon" />
                        <span>{{ detailData.aplyTime || "/" }}</span>
                    </div>
                    <div class="list_item wait_time_col">
                        <span>已等待：{{
                            calculateWaitTime(detailData.aplyTime) || "/"
                            }}</span>
                    </div>
                </div>
            </div>
            <div class="info_card">
                <el-row class="info_card_last_row">
                    <el-col :span="12">字段名称：{{ basicInfo.fieldName || "/" }}</el-col>
                    <el-col :span="12">字段别名：{{ basicInfo.fieldAlias || "/" }}</el-col>
                </el-row>
                <el-row class="info_card_last_row">
                    <el-col :span="12">字段类型：{{ basicInfo.fieldType || "/" }}</el-col>
                    <el-col :span="12">字段长度：{{ basicInfo.fieldLength || "/" }}</el-col>
                </el-row>
                <el-row class="info_card_last_row">
                    <el-col :span="24">业务定义：{{ basicInfo.fieldBusiness || "/" }}</el-col>
                </el-row>
                <el-row class="info_card_last_row">
                    <el-col :span="24">业务规则：{{ basicInfo.fieldRule || "/" }}</el-col>
                </el-row>
                <el-row class="info_card_last_row">
                    <el-col :span="24">枚举定义：</el-col>
                </el-row>
                <el-row class="info_card_last_row">
                    <div class="aop_common_page_table">
                        <el-table :data="basicInfo.dataDictionaryEnumLists" style="width: 20%" :header-cell-style="{
                            background: '#f5f5f8',
                            color: '#333333',
                        }">
                            <el-table-column prop="enumValue" label="枚举值" align="center">
                                <template slot-scope="scope">{{ scope.row.enumValue || "/" }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-row>
            </div>
        </div>
        <div class="base_info_box" id="applySourceBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">申请来源</span>
            </div>
            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/book.svg" alt="" />
                        <span>{{ detailData.aplyTargetSource | aplyTargetSourceMaps }}</span>
                    </div>
                </div>
            </div>
            <div class="table_box">
                <el-table :data="applySourceList" border>
                    <el-table-column prop="businessName" label="业务名称" min-width="160" show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.businessName || "/" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="processName" label="流程段名称" min-width="160" show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.processName || "/" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="controlPointName" label="控制点名称" min-width="160" show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.controlPointName || "/" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="settlementName" label="处理名称" min-width="160" show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.settlementName || "/" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="handleClick(scope.row, 'lookField')">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="base_info_box" id="applyHandleBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">审批处理</span>
                <span class="card_desc_tips">请在此处理申请，选择已有的数据替换，或确认新增并补全设计。</span>
            </div>
            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/people.svg" alt="" />
                        <span>{{ detailData.currentUserName || "/" }}</span>
                    </div>
                </div>
            </div>
            <div class="handle_box">
                <span>处理方式：</span>
                <el-radio-group v-model="handelType">
                    <el-radio label="0">从已有字段选择</el-radio>
                    <el-radio label="1">新建数据字段</el-radio>
                </el-radio-group>
            </div>
            <div class="table_box approve_table_box" v-if="handelType == '0'">
                <div class="table_search">
                    <div class="table_form">
                        <el-form size="small" :model="searchForm" inline="true" ref="form">
                            <el-form-item label="">
                                <el-input v-model="searchForm.fieldName" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="精准查询：" props="likeFlag" label-width="90px">
                                <el-switch v-model="searchForm.likeFlag" active-value="0" inactive-value="1">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="searchForm.fieldNameKey" placeholder="关键字" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="" label-width="0" props="fieldType">
                                <el-select v-model="searchForm.fieldType" placeholder="数据类型" clearable>
                                    <el-option :label="item.lable" :value="item.value" v-for="item in fieldTypeOption"
                                        :key="item.lable"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="search_item" label="" label-width="0" size="small" props="fieldFlag">
                                <el-select placeholder="是否贯标" v-model="searchForm.fieldFlag" clearable class="w150p"
                                    @change="topicChange">
                                    <el-option label="未贯标" value="1"></el-option>
                                    <el-option label="已贯标" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                        <el-button size="small" plain @click="handleReset">重置</el-button>
                    </div>
                </div>
                <!-- 列表 -->
                <div class="aop_common_page_table">
                    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
                        <!-- <el-table-column prop="" label="" width="120" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-radio v-model="fieldId" :label="scope.row.fieldId">
                                    <span></span>
                                </el-radio>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="fieldKeyName" label="字段简称" min-width="100">
                            <template slot-scope="{ row }">
                                {{ row.fieldKeyName || "/" }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fieldName" label="字段名称" min-width="100">
                            <template slot-scope="{ row }">
                                {{ row.fieldName || "/" }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fieldFlag" label="是否贯标" min-width="100">
                            <template slot-scope="{ row }">
                                <el-tag v-if="row.fieldFlag == '2'" type="success" effect="dark" color="#FE5161"
                                    size="mini">已贯标</el-tag>
                                <el-tag v-else-if="row.fieldFlag == '1'" type="danger" effect="dark" color="#D6D6D6"
                                    size="mini" style="border-color: #d6d6d6">未贯标</el-tag>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fieldBusiness" label="业务定义" min-width="150">
                            <template slot-scope="{ row }">
                                {{ row.fieldBusiness || "/" }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fieldRule" label="业务规则" min-width="150">
                            <template slot-scope="{ row }">
                                {{ row.fieldRule || "/" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="160" align="left" fixed="right">
                            <div class="flex_wrap" slot-scope="{ row }">
                                <span class="design_btn blue pointer" @click="handleView(row, 'useField')"
                                    v-if="row.fieldFlag == '1'">升级并使用</span>
                                <span class="design_btn blue pointer" @click="handleView(row, 'use')"
                                    v-if="row.fieldFlag == '2'">使用该字段</span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="design_btn blue pointer" @click="handleView(row, 'compare')">对比</span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="design_btn blue pointer" @click="handleView(row, 'lookField')">查看</span>
                            </div>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div>
                        <pagePagination @size-change="paginationChange" @current-change="currentChange" :pager="pager">
                        </pagePagination>
                    </div>
                    <div class="selected_box">
                        <div class="box_top">
                            <span class="selected_title">已选择</span>
                            <span class="num">（{{ selectedNum }}/1）：</span>
                        </div>
                        <div class="box_bottom">
                            <span v-if="selectedItem" class="selected_item_name">{{ selectedItem.fieldName ||
                                selectedItem.fieldKeyName }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table_box approve_table_box" v-if="handelType == '1'">
                <analysisField :analyInfo="basicInfo" ref="analysisField" v-show="step == 1" />
                <handleField @refreshData="handleConfirmData" ref="handleField" v-if="step == 2" />
            </div>
        </div>
        <div class="footer_btn">
            <div class="btn_box">
                <el-button @click="routeBack()" size="small" plain
                    v-if="handelType === '0' || (handelType == '1' && step == 1)">取消</el-button>
                <el-button type="primary" size="small" @click="nextStep"
                    v-if="handelType == '1' && step == 1">下一步</el-button>
                <el-button type="primary" size="small" @click="step = 1"
                    v-if="handelType == '1' && step == 2">上一步</el-button>
                <el-button type="primary" size="small" @click="onConfirm()"
                    v-if="handelType === '0' || (handelType === '1' && step === 2)">提交评审</el-button>
            </div>
        </div>

        <!-- 悬浮按钮 -->
        <div class="pos_box">
            <div v-for="item in posList" :key="item.id" :id="item.id" :class="{ active: item.id === activePosId }"
                @click="posClick(item.id)">
                {{ item.label }}
            </div>
        </div>
        <mapData ref="mapData" />
        <comparisonFieldDialog ref="comparisonFieldDialog" v-model="dialogVisible" v-if="dialogVisible"
            :dataDictionaryEnumLists="dataDictionaryEnumLists" :fieldInfo="basicInfo" :selectInfo="selectInfo"
            @saveDialog="handleSave" @handleView="handleView" />
        <comfirmFieldDialog ref="comfirmFieldDialog" v-model="confirmDialogVisible" v-if="confirmDialogVisible"
            :fieldInfo="basicInfo" :selectInfo="selectInfo1" :type="handelType" @saveDialog="handleApprove" />
        <useHandleField @addWordRoots="addWordRoots" ref="fieIdForm" :analyInfo="analyInfo" v-model="dialogDraw"
            v-if="dialogDraw" @analysisConfirm="handleReviewAdd" />
        <viewHandleField ref="viewHandleField" @refreshData="refreshData" />
    </div>
</template>

<script>
import commonHeader from "../../components/commonHeader";
import pagePagination from "@m/core/components/page_pagination";
import { applySourceOption, fieldTypeOption } from "@m/utils/commonData";
import analysisField from "./analysisField";
import handleField from "./handleField";
import useHandleField from "./analysisFieIdForm";
import mapData from "./mapData";
import comparisonFieldDialog from "./comparisonFieldDialog";
import comfirmFieldDialog from "./comfirmFieldDialog";
import viewHandleField from "./viewHandleField.vue";
import mixin from "@m/core/mixin";
export default {
    components: {
        commonHeader,
        pagePagination,
        analysisField,
        handleField,
        mapData,
        comparisonFieldDialog,
        comfirmFieldDialog,
        useHandleField,
        viewHandleField
    },
    mixins: [mixin],
    data() {
        return {
            fieldLabelName: "新增字段数据审批",
            dialogVisible: false,
            confirmDialogVisible: false,
            detailData: {},
            handelType: "0",
            step: 1,
            // 列表搜索项
            searchForm: {
                fieldName: "",
                fieldType: "",
                likeFlag: "1",
                fieldNameKey: "",
                fieldFlag: "",
            },
            fieldTypeOption: fieldTypeOption,
            tableLoading: false,
            tableData: [],
            pager: {
                //页码信息
                pageSizes: [10, 20, 50],
                turnPageShowNum: 10,
                currentPage: 1,
                total: 0,
            },
            drawerVisible: false,
            posList: [
                { label: "申请详情", id: "applyDetailBox" },
                { label: "申请来源", id: "applySourceBox" },
                { label: "审批处理", id: "applyHandleBox" },
            ],
            activePosId: "applyDetailBox",
            activeName: "1",
            basicInfo: {},
            aplyTargetId: "",
            aplySrlNo: "",
            applySourceList: [],
            sourceList: {},
            fieldInfo: {},
            fieldId: "",
            analyInfo: {},
            addAnalyInfo: {},
            selectInfo: {},
            selectInfo1: {},
            dialogDraw: false,
            selectRow: {},
            dataDictionaryEnumLists: [],
            storedSelectedItem: null,
            scrollTarget: null,
            clickScrolling: false,
        };
    },
    created() {
        const { aplySrlNo, rowId, fieldName } = this.$route.query;
        this.aplySrlNo = aplySrlNo;
        this.aplyTargetId = rowId;
        this.searchForm.fieldName = fieldName;

        Promise.all([
            this.dataDictionaryFieldDetailQuery(rowId),
            this.qryApprovalDetail(aplySrlNo),
            this.getTableData(),
            this.qryApplySource(aplySrlNo),
        ]);
    },
    mounted() {
        this.scrollTarget = document.querySelector('.home_main_view') || window;
        this.throttledScroll = this.throttle(this.handleScroll, 100);
        this.scrollTarget.addEventListener('scroll', this.throttledScroll);
    },
    beforeDestroy() {
        this.scrollTarget.removeEventListener('scroll', this.throttledScroll);
    },
    computed: {
        selectedItem() {
            if (this.storedSelectedItem && this.fieldId) {
                return this.storedSelectedItem;
            }
            if (!this.fieldId) {
                return;
            }
            let item = this.tableData.find((v) => v.fieldId == this.fieldId);
            return item;
        },
        selectedNum() {
            return this.fieldId ? 1 : 0;
        },
    },
    watch: {
        fieldId(newVal) {
            if (!newVal) {
                this.storedSelectedItem = null;
            }
        },
    },
    filters: {
        aplyTargetSourceMaps(val) {
            const maps = {
                '00': '业务模型-需求设计-处理设计',
                '01': '业务模型-需求设计-处理设计-规则设计',
                '02': '业务模型-需求设计-控制点设计',
            }
            return maps[val] || '-';
        },
    },
    methods: {
        handleScroll() {
            if (this.clickScrolling) return;
            const posIds = this.posList.map(item => item.id);
            let newActiveId = posIds[0];
            posIds.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                const top = el.getBoundingClientRect().top;
                if (top <= window.innerHeight * 0.55) {
                    newActiveId = id;
                }
            });
            this.activePosId = newActiveId;
        },
        throttle(fn, delay) {
            let lastCall = 0;
            return function (...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) return;
                lastCall = now;
                return fn(...args);
            };
        },
        refreshData(value) {
            // this.selectedItem = value
            this.storedSelectedItem = { ...value };
            this.selectInfo1 = value;
            this.fieldId = value.fieldId;
            this.dialogVisible = false
            this.getTableData();
        },
        handleReviewAdd(row) {
            this.$refs.viewHandleField.openDrawer({
                ...row,
                fieldName: row.fieldName,
                fieldKeyName: row.rootShortNameCombine,
                fieldFullName: row.rootFullNameCombine,
                drawerTitle: '升级字段',
                action: "addField",
            });
        },
        // 字段详情
        async dataDictionaryFieldDetailQuery(fieldId) {
            const res =
                await this.rpc.controlWorkbench.dataDictionaryFieldDetailQuery({
                    fieldId: fieldId,
                });
            this.basicInfo = res;
        },
        // 审批详情
        async qryApprovalDetail(aplySrlNo) {
            let res = await this.rpc.controlWorkbench.qryApprovalDetail({
                aplySrlNo: aplySrlNo,
            });
            this.detailData = res;
        },
        handleView(row, type) {
            if (type == "lookField") {
                this.$refs.mapData.openDrawer({
                    ...row,
                });
            } else if (type == "compare") {
                this.selectInfo = row;
                this.rpc.controlWorkbench.dataDictionaryFieldDetailQuery({
                    fieldId: row.fieldId,
                }).then(res => {
                    this.dataDictionaryEnumLists = res.dataDictionaryEnumLists || [];
                    this.dialogVisible = true;
                });

            } else if (type == "use") {
                this.fieldId = row.fieldId;
                this.selectInfo1 = row;
                this.storedSelectedItem = { ...row };
            } else if (type == "useField") {
                // this.$refs.useHandleField.openDrawer({
                //     // drawerTitle: "升级字段",
                //     action: "addField",
                //     fieldId: this.fieldId,
                // });
                this.selectRow = row;
                this.analyInfo = {
                    fieldId: row.fieldId,
                    fieldName: row.fieldName,
                    fieldNameDisabled: false,
                    ...row,
                };
                this.dialogDraw = true
            }
        },
        // posClick(id) {
        //     this.activePosId = id;
        //     const element = document.getElementById(id);
        //     if (element) {
        //         element.scrollIntoView({
        //             behavior: "smooth", // 平滑滚动
        //             block: "start", // 对齐到顶部（可选：start/center/end）
        //         });
        //     }
        // },
        posClick(id) {
            this.clickScrolling = true;
            this.activePosId = id;
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTimeout(() => {
                this.clickScrolling = false;
            }, 500);
        },
        nextStep() {
            const isValid = this.$refs.analysisField.handleConfirm();
            if (isValid) this.step = 2;
        },
        handleConfirmData(val) {
            // this.fieldId = val.fieldId;
            this.selectInfo1 = val;
            this.confirmDialogVisible = true
        },
        // 点击搜索
        handleSearch() {
            this.pager.currentPage = 1;
            this.getTableData();
        },
        // 点击重置按钮
        handleReset() {
            this.searchForm = {
                fieldName: "",
                fieldType: "",
                likeFlag: "1",
                fieldFlag: "",
                fieldNameKey: "",
            };
            this.fieldId = ""
            this.selectInfo1 = {};
            this.storedSelectedItem = null
            this.pager.currentPage = 1;
            this.getTableData();
        },
        handleSave(val) {
            this.fieldId = val.fieldId
            this.selectInfo1 = val;
            this.storedSelectedItem = val
        },




        // 审批
        async handleApprove(val) {
            let valData = { ...val };
            if (!valData.fieldId) {
                const res = await this.rpc.controlWorkbench.addDataDictionaryItemAndResponse(valData);
                valData = { ...valData, ...res.dataDictionaryFiled }
            }
            console.log(valData);
            let params = {
                aplySrlNo: this.aplySrlNo,
                aplyTargetId: this.aplyTargetId,
                aplyTargetType: "02", // 字段
                handleMode: this.handelType == '0' ? '00' : '01',
                operateType: this.basicInfo.fieldId == valData.fieldId ? "0" : "1",
                replaceId: this.basicInfo.fieldId == valData.fieldId ? "" : valData.fieldId,
                updateApprovalFieldInfo: this.basicInfo,
                updateApprovalFieldInfoNew: valData,
                updateApprovalObeInfo: {},
                updateApprovalObeInfoNew: {},
                updateApprovalObjectInfo: {},
                updateApprovalObjectInfoNew: {},
            }
            await this.rpc.controlWorkbench.submitApproval(params).then(res => {
                this.confirmDialogVisible = false
                this.$message.success("提交成功")
                this.routeBack()
            })
        },
        // 切换每页条数
        paginationChange(val) {
            this.pager.currentPage = 1;
            this.pager.turnPageShowNum = val;
            this.getTableData();
        },
        // 切换页码
        currentChange(val) {
            this.pager.currentPage = val;
            this.getTableData();
        },
        // 获取列表数据
        getTableData() {
            this.tableLoading = true;
            this.rpc.controlWorkbench
                .dataDictionaryFieldListQuery({
                    ...this.searchForm,
                    queryType: "5", // 1数据字典管控 2数据字段管理 3其他
                    currentPage: this.pager.currentPage,
                    turnPageShowNum: this.pager.turnPageShowNum,
                })
                .then((res) => {
                    this.pager.total = Number(res.turnPageTotalNum || 0);
                    this.tableData = res.dictionaryFiledLists || [];
                })
                .catch((err) => { })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        handleClick() {
            window.open(
                `/aop-h5-sub/#/aop_businessmold/modelDesign/home?productId=${this.sourceList.productId}&bizId=${this.sourceList.businessId}&productTreeId=${this.sourceList.productTreeId}&domainNo=${this.sourceList.domainNo}&bizDomainNo=${this.sourceList.bizDomainNo}&action=view`,
                "_blank"
            );
        },
        async qryApplySource(aplySrlNo) {
            this.applySourceList = [];
            try {
                let res = await this.rpc.controlWorkbench.qryApplySource({
                    aplySrlNo: aplySrlNo,
                });
                this.applySourceList.push(res);
                this.sourceList = await this.rpc.controlWorkbench.qryApplySourceExtend({
                    businessId: res.businessId,
                });
            } catch (error) {
                this.applySourceList = [];
            }
        },

        calculateWaitTime(targetTimeStr) {
            try {
                const [datePart, timePart] = targetTimeStr.split(" ");
                const [year, month, day] = datePart.split("-").map(Number);
                const [hours, minutes, seconds] = timePart
                    .split(":")
                    .map(Number);
                const targetTime = new Date(
                    year,
                    month - 1,
                    day,
                    hours,
                    minutes,
                    seconds
                );
                const now = new Date();
                const timeDiffMs = now - targetTime;
                if (timeDiffMs < 0) {
                    return "0天0时0分";
                }
                const totalSeconds = Math.floor(timeDiffMs / 1000);
                const daysPassed = Math.floor(totalSeconds / 86400); // 86400秒 = 1天
                const remainingSeconds = totalSeconds % 86400;

                const hoursPassed = Math.floor(remainingSeconds / 3600);
                const minutesPassed = Math.floor(
                    (remainingSeconds % 3600) / 60
                );
                return `${daysPassed}天${hoursPassed}时${minutesPassed}分`;
            } catch (error) {
                return "/";
            }
        },

        routeBack() {
            const { listType, sideType } = this.$route.query;
            this.$router.push({
                path: "/aop_tradedesign/controlWorkbench/list",
                query: {
                    listType: listType,
                    sideType: sideType,
                },
            });
        },

        onConfirm() {
            switch (this.handelType) {
                case '0':
                    if (!this.selectedItem) {
                        this.$message.error("请选择数据字段");
                        return;
                    }
                    this.confirmDialogVisible = true;
                    break;
                case '1':
                    this.$refs.handleField.handleConfirm()
                    break;
                default:
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.add_obj_behavior_box {
    padding-bottom: 68px;

    ::v-deep .demand-header {
        color: #333;
    }

    .base_info_box {
        padding: 16px 24px;
        background: #fff;
        border-radius: 4px;
        margin: 10px 10px 0 10px;
    }

    .card_title {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        margin-bottom: 24px;

        .d_line {
            display: inline-block;
            width: 3px;
            height: 14px;
            margin-right: 6px;
            background: #358aff;
            flex-shrink: 0;
        }

        .d_detail {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            font-weight: 500;
        }

        .card_desc_tips {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            margin-left: 8px;
            line-height: 22px;
        }
    }

    .card_desc {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 500;
    }

    .info_row1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        margin-bottom: 34px;

        .info_row1_left {
            display: flex;
            align-items: center;

            .list_item {
                display: flex;
                align-items: center;
                height: 20px;
                line-height: 20px;
                border-radius: 2px;
                margin-right: 10px;
                padding: 0 4px;
                background: #f5f5f5;
                color: rgba(0, 0, 0, 0.65);
                font-size: 12px;
                border: 1px solid #d9d9d9;

                .card_tip_icon {
                    flex-shrink: 0;
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                }

                img {
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                }
            }

            .wait_time_col {
                color: #fe5161;
                background: #ffeaec;
                border-color: #fe5161;
            }
        }
    }

    .info_card {
        border: 1px solid #eee;
        background: #fafafc;
        border-radius: 4px;
        padding: 16px 24px;
        margin-top: 10px;

        .info_card_last_row {
            margin-bottom: 20px;
        }
    }

    .table_box {
        margin-top: 10px;

        ::v-deep.el-table .el-table__body tr {
            cursor: pointer;
        }

        ::v-deep.el-table th {
            background: #fafafc;
            font-size: 14px;
            color: #333333;
        }

        ::v-deep.el-table th .cell {
            padding-left: 24px;
            line-height: 23px;
        }

        ::v-deep.el-table td {
            padding: 11px 0;
            font-size: 14px;
            color: #666666;
            position: relative;
        }

        ::v-deep.el-table td .cell {
            padding-left: 24px;
            line-height: 23px;
        }
    }

    .handle_box {
        margin-top: 10px;
    }

    .approve_table_box {
        border: 1px solid #eee;
        border-radius: 4px;

        .table_search {
            display: flex;
            margin: 16px;
        }

        .table_form {
            flex: 1;
            flex-wrap: wrap;

            ::v-deep .el-input,
            ::v-deep .el-select {
                width: 180px;
            }

            ::v-deep .el-form-item__label {
                color: rgba(0, 0, 0, 0.85);
                font-family: PingFangSC-Regular;
            }

            ::v-deep .el-form-item--small.el-form-item {
                margin-bottom: 0;
            }
        }

        .aop_common_page_table {
            padding: 0 16px;
        }
    }

    .selected_box {
        margin: 16px 0;
        // padding: 16px;

        .box_top {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 22px;

            .selected_title {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #111111;
                letter-spacing: 0;
                font-weight: 500;
            }

            .num {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #999999;
                letter-spacing: 0;
                font-weight: 400;
            }
        }

        .box_bottom {
            .selected_item_name {
                display: inline-block;
                height: 32px;
                line-height: 32px;
                text-align: center;
                // background: #F7F7F7;
                padding: 0 10px;
                // border-radius: 4px;
                background: #f5f5f8;
                border: 1px solid #dde0e4;
                border-radius: 2px;
            }
        }
    }

    .add_form_box {
        margin-top: 40px;
    }

    .footer_btn {
        width: calc(100%);
        background: #fff;
        padding: 12px 10px 12px 10px;
        margin-top: 10px;
        border-radius: 2px;
        text-align: center;
        position: fixed;
        bottom: 0;
        z-index: 10;
        box-shadow: 10px 2px 10px 0 rgba(204, 204, 204, 0.5);

        .btn_box {
            display: inline-block;
            margin-left: -130px;
        }
    }
}

::v-deep .el-drawer__header {
    padding: 10px 20px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 0;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #131313;
    font-weight: 600;
}

.pos_box {
    position: fixed;
    right: 20px;
    top: 30%;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    padding: 10px;
    z-index: 100;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    max-width: 260px;

    &:hover {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    &>div {
        &.active {
            color: #358aff;
        }

        cursor: pointer;
        padding: 8px 12px;
        color: #333;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: "Segoe UI",
        system-ui,
        sans-serif;
    }

    &>div:last-child {
        margin-bottom: 0;
    }

    &>div:hover {
        color: #358aff;
        background-color: #f0f7ff;
        transform: translateX(3px);
    }
}

::v-deep .behavior_box .list_box {
    width: 20%;
}

.blue {
    color: #358aff;
}
</style>
