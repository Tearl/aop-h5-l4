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
                                <template slot-scope="scope">{{
                                    scope.row.enumValue || "/"
                                }}</template>
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
                <span>{{ detailData.handleMode == '00' ? '从已有字段选择' : '新建字段数据' }}</span>
            </div>
            <div class="table_box approve_table_box">
                <viewMapData ref="viewMapData" :drawerData="drawerData" v-if="drawerData" />
            </div>
        </div>

        <div class="footer_btn">
            <div class="btn_box">
                <el-button @click="routeBack()" size="small" plain>关 闭</el-button>
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
            :fieldInfo="basicInfo" :selectInfo="selectInfo" @saveDialog="handleSave" />

    </div>
</template>

<script>
import commonHeader from "../../components/commonHeader";
import pagePagination from "@m/core/components/page_pagination";
import { applySourceOption, fieldTypeOption } from "@m/utils/commonData";
import viewMapData from "./viewMapData.vue";
import comparisonFieldDialog from "./comparisonFieldDialog.vue";
import mixin from "@m/core/mixin";
export default {
    components: {
        commonHeader,
        pagePagination,
        viewMapData,
        comparisonFieldDialog,

    },
    mixins: [mixin],
    data() {
        return {
            fieldLabelName: "新增字段数据审批",
            dialogVisible: false,
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
            tableData: [
                {
                    fieldName: "字段1",
                    fieldType: "1",
                    fieldRule: "规则1",
                },
            ],
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
            fieldInfo: {},
            fieldId: "",
            analyInfo: {},
            dialogDraw: false,
            detailInfo: {},
            drawerData: null,
            sourceList:{},
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
            this.getTableData();
            this.fieldId = value;
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
            // this.basicInfo = res;
        },
        // 审批详情
        async qryApprovalDetail(aplySrlNo) {
            let res = await this.rpc.controlWorkbench.qryApprovalDetail({
                aplySrlNo: aplySrlNo,
            });
            this.detailData = res;
            this.basicInfo = res && res.updateApprovalFieldInfo;
            let afterChangeJson = res && res.updateApprovalFieldInfoNew;
            this.drawerData = { ...afterChangeJson }
        },

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
            this.pager.currentPage = 1;
            this.getTableData();
        },
        handleSave(val) {
            this.fieldId = val.fieldId
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
                    queryType: "4", // 1数据字典管控 2数据字段管理 3其他
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
                `/aop-h5-sub/#/aop_businessmold/modelDesign/home?productId=${this.applySourceList.productId}&bizId=${this.applySourceList.businessId}&productTreeId=${this.applySourceList.productTreeId}&domainNo=${this.applySourceList.domainNo}&bizDomainNo=${this.applySourceList.bizDomainNo}&action=view`,
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
        padding: 12px;
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
