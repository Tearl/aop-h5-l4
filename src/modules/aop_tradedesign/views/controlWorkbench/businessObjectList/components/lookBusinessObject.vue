<template>
    <div class="add_obj_behavior_box">
        <common-header :label="objName" @routeBack="routeBack"></common-header>
        <div class="base_info_box" id="applyDetailBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">申请详情</span>
            </div>
            <div class="card_desc">{{ aplyTargetType[detailData.aplyTargetType] || '/' }}</div>

            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/people.svg" alt="">
                        <span>{{ detailData.aplyUserName || '/' }}</span>

                    </div>
                    <div class="list_item">
                        <img src="../../assets/images/time.svg" alt="">
                        <span>{{ detailData.aplyTime || '/' }}</span>
                    </div>
                </div>
            </div>

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="1" />
                <el-tab-pane label="对象属性" name="2" />
                <el-tab-pane label="对象关系" name="3" />
                <el-tab-pane label="对象行为" name="4" />
            </el-tabs>
            <div class="tab_content">
                <objectPage :activeTabs="activeName" :basicInfo="basicInfo"></objectPage>
            </div>
        </div>
        <div class="base_info_box" id="applySourceBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">申请来源</span>
            </div>
            <div class="info_row1" style="margin-bottom: 20px;">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/book.svg" alt="">
                        <span>业务模型-需求设计-处理设计</span>
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
                            <el-button type="text" size="medium" @click="handleClick(scope.row, 'lookBusiness')">
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
            <div class="info_row1" style="margin-bottom: 28px;">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/people.svg" alt="">
                        <span>{{ detailData.approverName || '/' }}</span>
                    </div>
                    <div class="list_item">
                        <img src="../../assets/images/time.svg" alt="">
                        <span>{{ detailData.approverTime || '/' }}</span>
                    </div>
                </div>
            </div>
            <div class="handle_box">
                <span>处理方式：</span>
                <span>{{ detailData.handleMode == '00' ? '从业务对象选择' : detailData.handleMode == '01' ? '新建业务对象' : '/' }}</span>
            </div>
            <div class="info_card">
                <viewObject v-if="rowId" :rowId="rowId" type="bussiness" />
            </div>
        </div>
        <el-drawer size='46%' title="对象详情" :visible.sync="drawerVisible" direction="rtl" :wrapperClosable="false"
            @closed="closed">
            <objectPage :activeTabs="activeName" />
        </el-drawer>

        <div class="pos_box">
            <div v-for="item in posList" :key="item.id" :id="item.id" :class="{ active: item.id === activePosId }"
                @click="posClick(item.id)">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script>
import commonHeader from "../../components/commonHeader.vue";
import objectPage from '../../components/objectPage'
import viewObject from "../../components/viewObject";
import mixin from "@m/core/mixin";

export default {
    components: {
        commonHeader,
        objectPage,
        viewObject
    },
    mixins: [mixin],
    data() {
        return {
            objName: '审批详情',
            detailData: {},
            handelType: '0',
            searchForm: {
                behaviorName: '',
                busName: '',
            },
            tableData: [
            ],
            busTypeList: [],
            drawerVisible: false,
            posList: [
                { label: '申请详情', id: 'applyDetailBox' },
                { label: '申请来源', id: 'applySourceBox' },
                { label: '审批处理', id: 'applyHandleBox' },
            ],
            activePosId: "applyDetailBox",
            activeName: '1',
            rowId: '',
            basicInfo: {},
            aplyTargetType: {
                '00': '新增业务对象',
                '01': '新增对象行为',
            },
            applySourceList: [],
            sourceList: {},
            scrollTarget: null,
            clickScrolling: false,
        }
    },
    created() {
        const { aplySrlNo } = this.$route.query
        // this.rowId = rowId
        Promise.all([
            // this.qryBizObjectInfoV2(rowId),
            this.qryApprovalDetail(aplySrlNo),
            // this.qryBizD1ObjectListV2(rowId)
            this.qryApplySource(aplySrlNo),
        ])
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
            if (!this.rowId) {
                return
            }
            let item = this.tableData.find(v => v.id == this.rowId)
            return item
        },
        selectedNum() {
            return this.rowId ? 1 : 0
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

        onSearch() {

        },
        onReset() {
            this.searchForm = {
                behaviorName: '',
                busName: '',
            }
        },
        handleClick(row, type) {
            if (type == 'lookBusiness') {
                // 业务模型设计工具的查看模式 定位到对应的处理
                window.open(
                    `/aop-h5-sub/#/aop_businessmold/modelDesign/home?productId=${this.sourceList.productId}&bizId=${this.sourceList.businessId}&productTreeId=${this.sourceList.productTreeId}&domainNo=${this.sourceList.domainNo}&bizDomainNo=${this.sourceList.bizDomainNo}&action=view`,
                    "_blank"
                );
            } else if (type == 'look') {
                // 显示对象详情
                this.drawerVisible = true
            }
        },
        routeBack() {
            const { listType, sideType } = this.$route.query
            console.log(listType, sideType)
            this.$router.push({
                path: '/aop_tradedesign/controlWorkbench/list',
                query: {
                    listType: listType,
                    sideType: sideType
                }
            })
        },
        async qryBizObjectInfoV2(rowId) {
            let res = await this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
                objId: rowId
            })
            this.basicInfo = res
        },
        async qryApprovalDetail(rowId) {
            let res = await this.rpc.controlWorkbench.qryApprovalDetail({
                aplySrlNo: rowId
            })
            this.detailData = res
            if(res.beforeChangeJson){
                this.basicInfo = JSON.parse(res.beforeChangeJson)
            }
            if(res.replaceId){
                this.rowId = res.replaceId
            }else{
                this.rowId = this.$route.query.rowId
            }
        },
        async qryBizD1ObjectListV2(rowId) {
            let res = await this.rpc.controlWorkbench.qryBizD1ObjectListV2({
                objId: rowId
            })
            // this.sourceList = res
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


    },
}

</script>
<style lang='scss' scoped>
.add_obj_behavior_box {
    padding-bottom: 20px;

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
            width: 2px;
            height: 16px;
            border-radius: 2px;
            margin-right: 6px;
            background: #358AFF;
        }

        .d_detail {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            font-weight: 500;
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
                background: #F5F5F5;
                color: rgba(0, 0, 0, 0.65);
                font-size: 12px;
                border: 1px solid #D9D9D9;

                img {
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                }
            }
        }

        .wait_time_col {
            color: #FF5F5F;
        }
    }

    .tab_content {
        background: #FAFAFC;
        border-radius: 4px;
        margin-top: 16px;
    }

    /deep/.el-tabs {
        min-height: 48px;
        border-bottom: 3px solid #E7E7EE;

        .el-tabs__header {
            padding-left: 0px;
            background: #fff;
            margin: 0;
        }

        .el-tabs__nav {
            font-family: PingFangSC-Semibold;
        }

        .el-tabs__nav-wrap::after {
            background: #fff;
        }

        .el-tabs--top .el-tabs__item.is-top {
            font-size: 14px;
        }

        .el-tabs__content {
            position: static;
        }

        .el-tabs__item {
            height: 48px;
            line-height: 48px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            font-weight: 400;
        }

        .el-tabs__item.is-active {
            color: #358aff;
        }

        .el-tabs__item.is-active {
            outline-offset: 0 !important;
            box-shadow: none !important;
        }

        .el-tabs__item:hover {
            color: #358aff;
        }

        .el-tabs__active-bar {
            background-color: #358aff;
            height: 3px;
        }

        .is-disabled {
            cursor: not-allowed;

            &:hover {
                color: #c0c4cc;
            }
        }
    }

    .info_card {
        // background: #FAFAFC;
        border-radius: 4px;
        // padding: 16px 20px;
        margin-top: 10px;

        .info_card_last_row {
            margin-bottom: 24px;
        }

        .info_card_row {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            font-weight: 400;
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
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        font-weight: 400;
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
    }

    .table_container {
        margin: 0 16px;

        .selected_box {
            display: flex;
            align-items: center;
            margin: 16px 0;

            .selected_item_name {
                display: inline-block;
                height: 32px;
                line-height: 32px;
                text-align: center;
                background: #F7F7F7;
                padding: 0 10px;
                border-radius: 4px;
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
    border-bottom: 1px solid #999999;
    color: #333;
    margin-bottom: 0;
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
            color: #358AFF;
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
        font-family: 'Segoe UI',
        system-ui,
        sans-serif;
    }

    &>div:last-child {
        margin-bottom: 0;
    }

    &>div:hover {
        color: #358AFF;
        background-color: #f0f7ff;
        transform: translateX(3px);
    }

}
</style>