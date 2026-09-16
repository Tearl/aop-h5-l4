<template>
    <div class="add_obj_behavior_box">
        <common-header :label="objName" @routeBack="routeBack"></common-header>
        <div class="base_info_box" id="applyDetailBox">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">申请详情</span>
            </div>
            <div class="card_desc">新增对象行为审批</div>
            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../../../assets/images/icon_approve_user.png" alt="" class="card_tip_icon" />
                        <span>{{ detailData.aplyUserName || '/' }}</span>
                    </div>
                    <div class="list_item">
                        <img src="../../../../assets/images/icon_approve_time.png" alt="" class="card_tip_icon" />
                        <span>{{ detailData.aplyTime || '/' }}</span>
                    </div>
                    <div class="list_item wait_time_col">
                        <span>已等待：{{ calculateWaitTime(detailData.aplyTime) || '/' }}</span>
                    </div>
                </div>
            </div>
            <div class="info_card">
                <el-row class="info_card_last_row">
                    <el-col :span="12">行为名称：{{ basicInfo.obeName || '/' }}</el-col>
                    <el-col :span="12">行为编码：{{ basicInfo.obeNo || '/' }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">业务对象名称：{{ basicInfo.objName || '/' }}</el-col>
                    <el-col :span="12">描述：{{ basicInfo.obeDesc || '/' }}</el-col>
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
                        <span>{{
                            detailData.aplyTargetSource == "00"
                                ? "业务模型-需求设计-处理设计"
                                : detailData.aplyTargetSource == "01"
                                    ? "业务模型-需求设计-处理设计-规则设计"
                                    : "/"
                        }}</span>
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
                <span class="card_desc_tips">请在此处理申请，选择已有的数据替换，或确认新增并补全设计。</span>
            </div>
            <div class="info_row1">
                <div class="info_row1_left">
                    <div class="list_item">
                        <img src="../../assets/images/people.svg" alt="" />
                        <span>{{ detailData.currentUserName || '/' }}</span>
                    </div>
                </div>
            </div>
            <!-- <div class="handle_box">
                <span>处理方式：</span>
                <el-radio-group v-model="handelType">
                    <el-radio label="0">从业务对象选择</el-radio>
                    <el-radio label="1">新建对象行为</el-radio>
                </el-radio-group>
            </div>
            <div class="table_box approve_table_box" v-if="handelType == '0'">
                <div class="table_search">
                    <div class="table_form">
                        <el-form size="small" :model="searchForm" inline="true" ref="form">
                            <el-form-item label="对象行为：">
                                <el-input v-model="searchForm.obeIdOrNm" placeholder="请输入行为编码/名称" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="业务对象：" prop="busName">
                                <el-input class="w150p" v-model="searchForm.busName" placeholder="" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="small" @click="onSearch">查询</el-button>
                        <el-button size="small" plain @click="onReset">重置</el-button>
                    </div>
                </div>
                <div class="table_container">
                    <el-table :data="tableData">
                        <el-table-column prop="rootName" label="请选择" width="120" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-radio v-model="obeId" :label="scope.row.obeId">
                                    <span></span>
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="obeNo" label="行为编码" min-width="160" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.obeNo || "/" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="obeName" label="行为名称" min-width="160" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.obeName || "/" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="obeDesc" label="行为描述" min-width="160" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.obeDesc || "/" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="objName" label="所属业务对象" min-width="160" show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.objName || "/" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180px" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="medium" @click="handleClick(scope.row, 'look')">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="selected_box">
                        <div class="box_top">
                            <span class="selected_title">已选择</span>
                            <span class="num">（{{ selectedNum }}/1）：</span>
                        </div>
                        <div class="box_bottom">
                            <span v-if="selectedItem" class="selected_item_name">{{ selectedItem.obeName }}</span>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="table_box approve_table_box">
                <editBehavior ref="editObject" :activeName="'tab4'" :objId="searchForm.objId" @sumbitFn="sumbitFn"
                    v-if="searchForm.objId" :type="'object'" @confim="confim" />
            </div>
        </div>
        <div class="footer_btn" v-if="showApproveBtn">
            <div class="btn_box">
                <el-button @click="routeBack()" size="small" plain>取消</el-button>
                <el-button type="primary" size="small" @click="onConfirm()" :loading="loading"
                    :disabled="pageLoading">提交评审</el-button>
            </div>
        </div>
        <!-- <el-drawer size="46%" title="对象详情" :visible.sync="drawerVisible" direction="rtl" :wrapperClosable="false"
            @closed="closed">
            <ObjectDetail />
        </el-drawer> -->

        <el-drawer size="46%" title="对象详情" :visible.sync="drawerVisible" direction="rtl" :wrapperClosable="false"
            @closed="closed">
            <div style="padding: 0 10px">
                <viewObject v-if="drawerVisible" :rowId="basicInfo.objId" :activeName="'tab4'" :type="'object'"
                    :row="detail" />
            </div>
        </el-drawer>
        <!-- 悬浮按钮 -->
        <div class="pos_box">
            <div v-for="item in posList" :key="item.id" :id="item.id" :class="{ active: item.id === activePosId }"
                @click="posClick(item.id)">
                {{ item.label }}
            </div>
        </div>
        <comparisonObjectDialog ref="comparisonDialog" v-if="dialogVisiable" :dialogVisiable="dialogVisiable"
            :basicInfo="behaviorInfo" :selectedItem="updateItem" @saveForm="saveDialog" @editDialog="editDialogFn"
            @closeDialog="dialogVisiable = flase" />
        <editBehaviorDetail ref="editBehaviorDetail" v-if="editDialog" :value="editDialog" :basicInfo="basicItem"
            @input="editDialog = false" :objId="searchForm.objId" :activeName="'tab4'" :type="'object'"
            @confim="saveEdit" :editFlag="editFlag" />
    </div>
</template>

<script>
import commonHeader from "../../components/commonHeader";
import ObjectDetail from "../../components/objectDetail";
import comparisonObjectDialog from "./comparisonObjectDialog";
import viewObject from "../../components/viewObject";
import addObject from "../../components/addObject";
import editBehavior from "../../components/editBehavior";
import editBehaviorDetail from "../../components/editBehaviorDetail";
import mixin from "@m/core/mixin";
export default {
    components: {
        commonHeader,
        ObjectDetail,
        comparisonObjectDialog,
        viewObject,
        addObject,
        editBehavior,
        editBehaviorDetail
    },
    mixins: [mixin],
    data() {
        return {
            objName: "新增对象行为审批",
            detailData: {},
            handelType: "1",
            searchForm: {
                obeIdOrNm: "", // 对象行为ID或名称
                objId: "",  // 对象ID
                approvalStatus: ['00', '02'],
                busName: ""
            },
            detail: {},
            tableData: [
            ],
            obeId: "",
            addForm: {
                busType: "",
                behaviorName: "",
                behaviorCode: "",
                behaviorDesc: "",
            },
            rules: {
                busType: [
                    { required: true, message: "请选择", trigger: "change" },
                ],
                behaviorName: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                behaviorCode: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
            },
            busTypeList: [],
            drawerVisible: false,
            posList: [
                { label: "申请详情", id: "applyDetailBox" },
                { label: "申请来源", id: "applySourceBox" },
                { label: "审批处理", id: "applyHandleBox" },
            ],
            activePosId: "applyDetailBox",
            activeName: "1",
            dialogVisiable: false,
            dialogBussinessVisiable: false,
            addObjectVisible: false, // 新建业务对象
            detailData: {},
            basicInfo: {},
            aplyTargetId: "",
            aplySrlNo: "",
            applySourceList: [],
            sourceList: {},
            behaviorInfo: {},
            updateItem: {},
            editDialog: false,
            basicItem: {},
            editFlag: false,
            showApproveBtn: true
        };
    },
    watch: {
        handelType(newVal) {
            if (newVal == '1') {
                this.addKeyActVisible = true
            }
        }
    },
    created() {
        const { aplySrlNo, aplyTargetId } = this.$route.query
        this.aplySrlNo = aplySrlNo
        this.aplyTargetId = aplyTargetId
        Promise.all([
            this.qryBehaviorInfoDetail(aplyTargetId),
            this.qryApprovalDetail(aplySrlNo),
            this.qryApplySource(aplySrlNo),
        ])
        // this.onSearch()
    },
    computed: {
        selectedItem() {
            if (!this.obeId) {
                return;
            }
            let item = this.tableData.find((v) => v.obeId == this.obeId);
            return item;
        },
        selectedNum() {
            return this.obeId ? 1 : 0;
        },
    },
    methods: {
        editDialogFn(val) {
            this.editDialog = true
            // this.editFlag = true  // 是否编辑
            this.basicItem = val

        },
        posClick(id) {
            this.activePosId = id;
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth", // 平滑滚动
                    block: "start", // 对齐到顶部（可选：start/center/end）
                });
            }
        },
        onSearch() {
            this.qryObeAllList()
        },
        onReset() {
            this.searchForm = {
                obeIdOrNm: "", // 对象行为ID或名称
                objId: this.basicInfo.objId,  // 对象ID
                approvalStatus: ['00', '02'],
                busName: this.basicInfo.objName
            };
        },
        handleClick(row, type) {
            if (type == "lookBusiness") {
                // 业务模型设计工具的查看模式 定位到对应的处理
                window.open(
                    `/aop-h5-sub/#/aop_businessmold/modelDesign/home?productId=${this.sourceList.productId}&bizId=${this.sourceList.businessId}&productTreeId=${this.sourceList.productTreeId}&domainNo=${this.sourceList.domainNo}&bizDomainNo=${this.sourceList.bizDomainNo}&action=view`,
                    "_blank"
                );
            } else if (type == "look") {
                // 显示对象详情
                this.detail = row
                this.drawerVisible = true;
            } else if (type == "comparison") {
                this.dialogVisiable = true;
            }
        },
        async qryApprovalDetail(aplySrlNo) {
            let res = await this.rpc.controlWorkbench.qryApprovalDetail({
                aplySrlNo: aplySrlNo
            })
            this.detailData = res
        },

        async qryBehaviorInfoDetail(obeId) {
            let res = await this.rpc.controlWorkbench.qryBehaviorInfoDetail({
                obeId: obeId
            })
            this.basicInfo = res
            this.searchForm.busName = this.basicInfo.objName
            this.searchForm.objId = this.basicInfo.objId
            this.onSearch()

            const { approvalStatus } = await this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
                objId: this.basicInfo.objId,
            })
            if (approvalStatus == '01') {
                this.showApproveBtn = false
                this.$confirm(`当前对象行为所属业务对象【待审批】，请先完成对象审批。`, "提示", {
                    confirmButtonText: "去审批",
                    showCancelButton: false,
                    type: "warning",
                }).then(async () => {

                    const { aopCommonApplyFlows } = await this.rpc.controlWorkbench.qryApprovalFlowPageList({
                        currentPage: 1,
                        turnPageShowNum: 10,
                        aplyTargetType: "00",
                        objId: this.basicInfo.objId,
                        aprvlStusCd: '0'

                    })
                    this.$router.push({
                        path: '/aop_tradedesign/controlWorkbench/addBusinessObject',
                        query: {
                            listType: 'waitApprove',
                            sideType: '1',
                            rowId: this.basicInfo.objId,
                            aplySrlNo: aopCommonApplyFlows[0].aplySrlNo
                        }
                    })
                }).catch(err => { })
            }
        },
        async qryObeAllList() {
            let res = await this.rpc.controlWorkbench.qryObeAllList({
                objId: this.searchForm.objId,
                approvalStatus: this.searchForm.approvalStatus,
                obeIdOrNm: this.searchForm.obeIdOrNm,
            })
            this.tableData = res.objectBehaviorInfos
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
                const [datePart, timePart] = targetTimeStr.split(' ');
                const [year, month, day] = datePart.split('-').map(Number);
                const [hours, minutes, seconds] = timePart.split(':').map(Number);
                const targetTime = new Date(year, month - 1, day, hours, minutes, seconds);
                const now = new Date();
                const timeDiffMs = now - targetTime;
                if (timeDiffMs < 0) {
                    return "0天0时0分";
                }
                const totalSeconds = Math.floor(timeDiffMs / 1000);
                const daysPassed = Math.floor(totalSeconds / 86400); // 86400秒 = 1天
                const remainingSeconds = totalSeconds % 86400;

                const hoursPassed = Math.floor(remainingSeconds / 3600);
                const minutesPassed = Math.floor((remainingSeconds % 3600) / 60);
                return `${daysPassed}天${hoursPassed}时${minutesPassed}分`;
            } catch (error) {
                return "目标时间格式错误，请使用 'YYYY-MM-DD HH:MM:SS' 格式";
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
        async submitApproval(parmas) {
            await this.rpc.controlWorkbench.submitApproval(parmas).then(res => {
                this.$message.success("提交成功")
                this.routeBack()
            })
        },
        onConfirm() {
            this.$refs.editObject.txtSaveSubmitForm();
        },
        saveEdit(val) {
            let info = {
                ...val,
                aplyUserName: this.detailData.aplyUserName,
                aplyTime: this.detailData.aplyTime,
            }
            this.behaviorInfo = JSON.parse(JSON.stringify(info))
            let item = {
                ...val,
                aplyUserName: this.detailData.aplyUserName,
                aplyTime: this.detailData.aplyTime,
                objectBehaviorInfos: val.objectBehaviorInfos.map(behaviorItem => {
                    if (behaviorItem.approvalStatus === '01' && behaviorItem.handleType === '0') {
                        return behaviorItem.selectedItem;
                    }
                    return behaviorItem;
                })
            };
            this.updateItem = JSON.parse(JSON.stringify(item))
        },
        saveDialog(val) {
            let obeInfo = JSON.parse(JSON.stringify(val))
            if (obeInfo.objectBehaviorInfos.length > 0) {
                obeBatchList = obeInfo.objectBehaviorInfos.filter(item => item.approvalStatus == "01").map(item => {
                    return {
                        aplySrlNo: this.aplySrlNo,
                        aplyTargetId: obeInfo.approveItem.find(v => v.obeId == item.obeId).obeId,
                        aplyTargetType: '01',
                        updateApprovalObeInfo: obeInfo.approveItem.find(v => v.obeId == item.obeId),
                        updateApprovalObeInfoNew: item.handleType == '0' ? item.selectedItem : item,
                        operateType: item.handleType == '0' ? '1' : '0', // 0 新增 1 替换
                        handleMode: item.handleType == '0' ? '00' : '01', // 00-从已有选择；01-新建
                        replaceId: item.handleType == '0' ? item.selectedObeId : '',
                        updateApprovalObjectInfo: {},
                        updateApprovalObjectInfoNew: {}
                    }
                })
            }
            let parmas = {
                aplySrlNo: this.aplySrlNo,
                aplyTargetId: this.aplyTargetId,
                aplyTargetType: '01', // 对象行为
                obeBatchList: obeBatchList,
            }
            this.submitApproval(parmas)
        },
        confim(val) {
            console.log(val, 'val')
            let obeInfo = JSON.parse(JSON.stringify(val))
            let info = {
                ...val,
                aplyUserName: this.detailData.aplyUserName,
                aplyTime: this.detailData.aplyTime,
            }
            this.behaviorInfo = JSON.parse(JSON.stringify(info))
            let item = {
                ...val,
                aplyUserName: this.detailData.aplyUserName,
                aplyTime: this.detailData.aplyTime,
                objectBehaviorInfos: val.objectBehaviorInfos.map(behaviorItem => {
                    if (behaviorItem.approvalStatus === '01' && behaviorItem.handleType === '0') {
                        return behaviorItem.selectedItem;
                    }
                    return behaviorItem;
                })
            };
            this.updateItem = JSON.parse(JSON.stringify(item))
            // let obeBatchList = []
            // if (obeInfo.objectBehaviorInfos.length > 0) {
            //     obeBatchList = obeInfo.objectBehaviorInfos.filter(item => item.approvalStatus == "01").map(item => {
            //         return {
            //             aplySrlNo: this.aplySrlNo,
            //             aplyTargetId: this.aplyTargetId,
            //             aplyTargetType: '01',
            //             updateApprovalObeInfo: obeInfo.approveItem.find(v => v.obeId == item.obeId),
            //             updateApprovalObeInfoNew: item.handleType == '0' ? item.selectedItem : item,
            //             operateType: item.handleType == '0' ? '1' : '0', // 0 新增 1 替换
            //             handleMode: item.handleType == '0' ? '00' : '01', // 00-从已有选择；01-新建
            //             replaceId: item.handleType == '0' ? item.selectedObeId : '',
            //             updateApprovalObjectInfo: {},
            //             updateApprovalObjectInfoNew: {}
            //         }
            //     })
            // }
            // let parmas = {
            //     aplySrlNo: this.aplySrlNo,
            //     aplyTargetId: this.aplyTargetId,
            //     aplyTargetType: '01', // 对象行为
            //     obeBatchList: obeBatchList,
            // }
            // console.log(parmas,'parmas')
            // this.submitApproval(parmas)
            this.dialogVisiable = true
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
        background: #FAFAFC;
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
    }

    .table_container {
        margin: 0 16px;

        .selected_box {
            margin: 16px 0;

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
</style>
