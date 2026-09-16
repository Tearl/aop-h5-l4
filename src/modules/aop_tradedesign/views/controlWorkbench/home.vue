<template>
    <div class="ctrl_workbench_home">
        <div class="accept_tabs">
            <el-tabs v-model="activeTabs" @tab-click="handleAttrClick">
                <el-tab-pane :label="waitApprovalLabel" name="waitApprove"></el-tab-pane>
                <el-tab-pane :label="approvedLabel" name="approved"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="container_box">
            <div class="side_box">
                <div class="side_item" :class="{ 'side_item_actived': sideType == '0' }" @click="changeSide('0')">
                    新增业务对象（{{ busObjectNum }}）
                </div>
                <div class="side_item" :class="{ 'side_item_actived': sideType == '1' }" @click="changeSide('1')">
                    新增对象行为（{{ objBehavior }}）
                </div>
                <div class="side_item" :class="{ 'side_item_actived': sideType == '3' }" @click="changeSide('3')">
                    新增对象属性（{{ objAttributeNum }}）
                </div>
                <div class="side_item" :class="{ 'side_item_actived': sideType == '2' }" @click="changeSide('2')">
                    新增数据字段（{{ dataFieldNum }}）
                </div>
                <!-- <div class="side_item" :class="{ 'side_item_actived': sideType == '3' }" @click="changeSide('3')">
                    修改数据字段（{{ modifyDataFieldNum }}）
                </div> -->
            </div>
            <div class="main_container">
                <!-- 对象行为 -->
                <ObjectBehavior ref="objBehaviorRef" v-if="sideType == '1'" :listType="activeTabs" :sideType="sideType"
                    :tableData="tableData" :total="total" @queryList="qryApprovalFlowPageList" />

                <!-- 业务对象 -->
                <BusinessObjectList ref="busObjectRef" v-if="sideType == '0'" :listType="activeTabs"
                    :sideType="sideType" :tableData="tableData" :total="total" @queryList="qryApprovalFlowPageList" />
                <!-- 新增数据字段 -->
                <FieldDataList ref="addFieldDataRef" v-if="sideType == '2'" :listType="activeTabs" :sideType="sideType"
                    :tableData="tableData" :total="total" @queryList="qryApprovalFlowPageList">
                </FieldDataList>

                <!-- 对象属性 -->
                <ObjectAttribute ref="objAttributeRef" v-if="sideType == '3'" :listType="activeTabs"
                    :sideType="sideType" :tableData="tableData" :total="total" @queryList="qryApprovalFlowPageList" />

                <!-- <datadictControl ref="datadictControlRef" v-if="sideType == '2'"  :listType="activeTabs" :sideType="sideType">
                </datadictControl> -->
                <!-- 修改数据字段 -->
            </div>
        </div>
    </div>
</template>

<script>
import ObjectBehavior from './objectBehaviorList/objectBehaviorList'
import BusinessObjectList from './businessObjectList/businessObjectList'
import FieldDataList from './fieldDataList/fieldDataList'
import ObjectAttribute from './objectAttributeList/objectAttributeList'
// import datadictControl from '@m/views/datadict/datadictControl'
import mixin from "@m/core/mixin";
export default {
    components: {
        ObjectBehavior,
        BusinessObjectList,
        // datadictControl,
        FieldDataList,
        ObjectAttribute
    },
    data() {
        return {
            sideType: '0',
            activeTabs: 'waitApprove',
            waitApprovalNum: 0,
            approvedNum: 0,
            busObjectNum: 0,
            objBehavior: 0,
            dataFieldNum: 0,
            objAttributeNum: 0,
            modifyDataFieldNum: 0,
            // searchForm: {
            //     aplyTargetSource: '', // 审批来源
            //     // aplyTargetType: '00', // 审批目标类型(00-对象;01-对象行为,02-字段)
            //     aplyUserName: '', // 申请人名称
            //     // aprvlStusCd: '0', // 审批状态代码：0-待审批;1-已审批
            //     // aprvlStusCd: this.activeTabs === 'waitApprove' ? '00' : '01', // 审批状态代码：0-待审批;1-已审批
            //     obeName: '', // 对象行为名称
            //     objName: '', // 业务对象名称
            // },
            tableData: [],
            total: 0,
            currentPage: 1,
            turnPageShowNum: 10,
        }
    },
    mixins: [mixin],
    created() {
        const { sideType, listType } = this.$route.query
        console.log(sideType, listType)
        if (sideType) {
            this.sideType = sideType
        }
        if (listType) {
            this.activeTabs = listType
        }

    },
    mounted() {
        this.qryHomeApprovalStatistic()
        this.qryApprovalFlowPageList()
    },
    computed: {
        waitApprovalLabel() {
            return `待审批(${this.waitApprovalNum})`
        },
        approvedLabel() {
            return `已审批(${this.approvedNum})`
        },
    },
    methods: {
        handleAttrClick() {
            // this.qryHomeApprovalStatistic()
            // if (this.sideType == '3') return
            // if (this.sideType == '0' || this.sideType == '1') {
            this.qryHomeApprovalStatistic()
            this.onReset()
            this.qryApprovalFlowPageList()
            // this.qryHomeApprovalStatistic()
            // this.onReset()
            // this.qryApprovalFlowPageList()
            // }

        },
        onReset() {
            // this.searchForm = {
            //     aplyTargetSource: '', // 审批来源
            //     // aplyTargetType: '00', // 审批目标类型(00-对象;01-对象行为,02-字段)
            //     aplyUserName: '', // 申请人名称
            //     // aprvlStusCd: '0', // 审批状态代码：0-待审批;1-已审批
            //     obeName: '', // 对象行为名称
            //     objName: '', // 业务对象名称
            // }
            this.tableData = []
            this.total = 0
        },
        changeSide(value) {
            this.sideType = value
            this.onReset()
            this.qryApprovalFlowPageList()
        },
        async qryHomeApprovalStatistic() {
            const res = await this.rpc.controlWorkbench.qryHomeApprovalStatistic()
            this.waitApprovalNum = res.totalPending
            this.approvedNum = res.totalApproved
            switch (this.activeTabs) {
                case 'waitApprove':
                    this.busObjectNum = res.businessObjectPending
                    this.objBehavior = res.objectActionPending
                    this.dataFieldNum = res.addDataDictPending
                    this.objAttributeNum = res.objectPropertyPending
                    this.modifyDataFieldNum = res.updateDataDictPending
                    break;
                case 'approved':
                    this.busObjectNum = res.businessObjectApproved
                    this.objBehavior = res.objectActionApproved
                    this.dataFieldNum = res.addDataDictApproved
                    this.objAttributeNum = res.objectPropertyApproved
                    this.modifyDataFieldNum = res.updateDataDictApproved
                    break;
            }
        },

        async qryApprovalFlowPageList(val = {}) {
            const { aopCommonApplyFlows, turnPageTotalNum } = await this.rpc.controlWorkbench.qryApprovalFlowPageList({
                // ...this.searchForm,
                aprvlStusCd: this.activeTabs === 'waitApprove' ? '0' : '1',
                aplyTargetType: this.sideType === '0' ? '00' : this.sideType === '1' ? '01' : this.sideType === '2' ? '02' : '03',
                currentPage: val.currentPage || this.currentPage,
                turnPageShowNum: val.turnPageShowNum || this.turnPageShowNum,
                ...val
            })
            this.tableData = aopCommonApplyFlows
            this.total = turnPageTotalNum
            if (this.sideType == '3') {
                this.tableData = this.tableData.map(item => {
                     let fileNameStr = '';
                    if (Array.isArray(item.dataDictionarys) && item.dataDictionarys.length > 0) {
                        const fieldNamesWithStyle = item.dataDictionarys
                            .filter(dic => dic.fieldName)
                            .map(dic => {
                                if (dic.aprvlStusCd == '0') {
                                    return `<span style="color: #F56C6C;">${dic.fieldName}</span>`;
                                }
                                return dic.fieldName;
                            });
                        fileNameStr = fieldNamesWithStyle.join('、');
                    }
                    return {
                        ...item,
                        fileNameStr
                    };
                })
            }
        }
    },
}

</script>
<style lang='scss' scoped>
.ctrl_workbench_home {
    width: 100%;

    .container_box {
        width: 100%;
        display: flex;
        padding: 0 12px 12px;
    }

    .side_box {
        min-height: calc(100vh - 160px);
        margin-right: 12px;
        background: #fff;
        width: 186px;
        flex-shrink: 0;
        padding: 20px 6px;
        border-radius: 4px;

        .side_box_title {
            font-size: 16px;
            color: #333333;
            margin-left: 14px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .side_item {
            font-size: 14px;
            height: 34px;
            line-height: 34px;
            padding-left: 14px;
            border-radius: 2px;
            margin-bottom: 6px;
            cursor: pointer;
        }

        .side_item_actived {
            color: #358AFF;
            background: #F0F5FF;
        }
    }

    .main_container {
        width: calc(100% - 200px);
        min-height: calc(100vh - 163px);
    }

    .accept_tabs {
        width: 100%;
        background: #ffffff;
        margin-bottom: 12px;
        padding: 0 24px;
        border-radius: 4px;

        ::v-deep .el-tabs__nav-wrap {
            margin: 0;
            line-height: 48px;
        }

        ::v-deep .el-tabs__header {
            margin: 0;
        }

        ::v-deep .el-tabs__nav-wrap::after {
            height: 0px;
            background-color: none;
        }

        ::v-deep .el-tabs__item {
            height: 48px;
            line-height: 48px;
        }
    }
}
</style>