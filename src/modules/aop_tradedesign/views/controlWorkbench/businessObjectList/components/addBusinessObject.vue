<template>
    <div style="width: 100%; height: 100%">
        <div class="add_obj_behavior_box">
            <common-header :label="objName" @routeBack="routeBack"></common-header>
            <div class="base_info_box" id="applyDetailBox">
                <div class="card_title">
                    <span class="d_line"></span>
                    <span class="d_detail">申请详情</span>
                </div>
                <div class="card_desc">新增业务对象申请</div>
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
                                calculateWaitTime(detailData.aplyTime) ||
                                "/"
                            }}</span>
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
                        <el-table-column prop="controlPointName" label="控制点名称" min-width="160"
                            show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.controlPointName || "/" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="settlementName" label="处理名称" min-width="160"
                            show-overflow-tooltip="true">
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
                            <span>{{ detailData.currentUserName || "/" }}</span>
                        </div>
                    </div>
                </div>
                <div class="handle_box">
                    <span>处理方式：</span>
                    <el-radio-group v-model="handelType" @change="changeType">
                        <el-radio label="0">从业务对象选择</el-radio>
                        <el-radio label="1">新建业务对象</el-radio>
                    </el-radio-group>
                </div>
                <div class="table_box approve_table_box" v-show="handelType == '0'">
                    <div class="table_search">
                        <div class="table_form">
                            <el-form size="small" :model="searchForm" inline="true" ref="form">
                                <el-form-item label="业务对象：">
                                    <el-input v-model="searchForm.objNm" placeholder="请输入对象编码/名称" clearable></el-input>
                                </el-form-item>
                                <!-- <el-form-item label="业务对象：" prop="busName">
                                <el-input class="w150p" v-model="searchForm.busName" placeholder="" disabled></el-input>
                            </el-form-item> -->
                                <el-form-item label="精确查询：" prop="busName">
                                    <el-switch v-model="searchForm.qryPreciseFlag"></el-switch>
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
                                    <el-radio v-model="rowIdKey" :label="scope.row.objId"
                                        @change="handleRadioChange(scope.row)">
                                        <span></span>
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="objCode" label="对象编码" min-width="160" show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.objCode || "/" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="objName" label="对象名称" min-width="160" show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.objName || "/" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="objType" label="对象类型" min-width="160" show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.objType == "00"
                                            ? "实体对象"
                                            : "值对象" || "/"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="objClassName" label="对象分类" min-width="160"
                                show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.objClassName || "/"
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="180px" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" size="medium" @click="
                                        handleClick(scope.row, 'comparison')
                                        ">
                                        对比
                                    </el-button>
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button type="text" size="medium" @click="handleClick(scope.row, 'look')">
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="table_footer_box">
                            <el-pagination background @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" :current-page="searchForm.currentPage"
                                :page-sizes="[10, 20, 30, 40]" :page-size="searchForm.turnPageShowNum"
                                layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total">
                            </el-pagination>
                        </div>
                        <div class="selected_box">
                            <div class="box_top">
                                <span class="selected_title">已选择</span>
                                <span class="num">（{{ selectedNum }}/1）：</span>
                            </div>
                            <div class="box_bottom">
                                <span v-if="selectedItem" class="selected_item_name">{{ selectedItem.objName }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table_box approve_table_box" v-if="handelType == '1'">
                    <!-- confim 抛出修改的对象 -->
                    <editObject ref="editObject" :objId="editId" @confim="confim" />
                </div>
            </div>
            <div class="footer_btn">
                <div class="btn_box">
                    <el-button @click="routeBack" size="small" plain>取消</el-button>
                    <el-button type="primary" size="small" @click="onConfirm()" :loading="loading"
                        :disabled="pageLoading">提交评审</el-button>
                </div>
            </div>
            <el-drawer size="46%" title="对象详情" :visible.sync="drawerVisible" direction="rtl" :wrapperClosable="false"
                @closed="closed">
                <div style="padding: 0 10px">
                    <viewObject v-if="drawerVisible" :rowId="objectId" :row="rowInfo" :type="'bussiness'" />
                </div>
            </el-drawer>
            <!-- 悬浮按钮 -->
            <div class="pos_box">
                <div v-for="item in posList" :key="item.id" :id="item.id" :class="{ active: item.id === activePosId }"
                    @click="posClick(item.id)">
                    {{ item.label }}
                </div>
            </div>
            <!-- 对比弹窗  selectItem-->
            <comparisonBussinessDialog ref="comparisonDialog" :basicInfo="basicInfo" :selectedItem="selectItem"
                :bussinessItem="bussinessItem" :dialogVisiable="dialogVisiable" @saveDialog="saveDialog"
                @closeDialog="dialogVisiable = flase; comparisonType = ''" v-if="dialogVisiable"
                :handelType="handelType" @editComDialog="editComDialog" :detailData="detailData" @sumbitFn="sumbitFn" />
            <!-- 提交评审弹窗 basicInfo1 -->
            <comparisonObjectDialog ref="comparisonBussinessDialog" :basicInfo="basicInfo" :selectedItem="basicInfo1"
                :dialogVisiable="dialogBussinessVisiable" @closeDialog="dialogBussinessVisiable = flase"
                v-if="dialogBussinessVisiable" :handelType="handelType" :detailData="detailData" @saveForm="saveForm"
                @editDialog="editDialog" />
            <!-- 编辑的弹窗  传入的是basicInfo2 -->
            <editObjectDetail ref="editObjectDetail" v-if="addKeyActVisible" @confim="confim" :objId="basicInfo2.objId"
                :value="addKeyActVisible" @input="addKeyActVisible = false" :basicInfo="basicInfo2" />
        </div>
    </div>
</template>

<script>
import commonHeader from "../../components/commonHeader.vue";
import ObjectDetail from "../../components/objectDetail";
import viewObject from "../../components/viewObject";
import comparisonBussinessDialog from "../../components/comparisonBussinessDialog";
import comparisonObjectDialog from "../../components/comparisonObjectDialog";
import objectPage from "../../components/objectPage";
import addObject from "../../components/addObject";
import editObjectDetail from "../../components/editObjectDetail";
import editObject from "../../components/editObject";
import mixin from "@m/core/mixin";
export default {
    components: {
        commonHeader,
        ObjectDetail,
        comparisonBussinessDialog,
        objectPage,
        addObject,
        editObjectDetail,
        viewObject,
        editObject,
        comparisonObjectDialog,
    },
    mixins: [mixin],
    data() {
        return {
            objName: "新增业务对象审批",
            detailData: {},
            handelType: "0",
            rowIdKey: "",
            searchForm: {
                objNm: "",
                currentPage: 1,
                turnPageShowNum: 10,
                qryPreciseFlag: false,
                total: 0,
            },
            sourceList: [],
            tableData: [],
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
            addObjectVisible: true,
            addKeyActVisible: false, // 编辑弹窗
            isChanged: false,
            basicInfo: {},
            basicInfo1: {},
            basicInfo2: {},
            aplyTargetType: {
                "00": "新增业务对象",
                "01": "新增对象行为",
            },
            rowId: "",
            objectId: "",
            editId: "",
            selectItem: {},
            bussinessItem: {},
            aplySrlNo: "",
            applySourceList: [],
            type: "add",
            comparisonType: '',
            rowInfo: {},
            sourceList: {},
            bizDomainNo: "",
            storedSelectedItem: null,
            scrollTarget: null,
            clickScrolling: false,
        };
    },
    computed: {
        selectedItem() {
            if (!this.rowIdKey) {
                return null;
            }
            if (this.storedSelectedItem && this.rowIdKey) {
                return this.storedSelectedItem;
            }
            // console.log(22222)
            // return this.tableData.find((v) => v.objId == this.rowIdKey) || null;
        },
        selectedNum() {
            return this.rowIdKey ? 1 : 0;
        },
    },
    watch: {
        rowIdKey(newVal) {
            if (!newVal) {
                this.storedSelectedItem = null;
            }
        }
    },
    created() {
        const { rowId, aplySrlNo } = this.$route.query;
        this.editId = rowId;
        this.aplySrlNo = aplySrlNo;
        // this.qryBizObjectInfoV2(rowId),

        this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
            objId: rowId,
        }).then(res => {
            this.bizDomainNo = res.bizDomainNo;
            this.basicInfo = res;
            Promise.all([
                this.qryApprovalDetail(aplySrlNo),
                this.qryApplySource(aplySrlNo),
                this.onSearch()
            ]);
        })
    },
    mounted() {
        this.scrollTarget = document.querySelector('.home_main_view') || window;
        this.throttledScroll = this.throttle(this.handleScroll, 100);
        this.scrollTarget.addEventListener('scroll', this.throttledScroll);
    },
    beforeDestroy() {
        this.scrollTarget.removeEventListener('scroll', this.throttledScroll);
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
        handleRadioChange(row) {
            this.rowIdKey = row.objId;

            this.storedSelectedItem = { ...row };
            //  console.log(this.storedSelectedItem,'stroe')
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
            this.rowIdKey = "";
            this.getList();
        },
        onReset() {
            this.searchForm = {
                objNm: "",
                currentPage: 1,
                turnPageShowNum: 10,
                total: 0,
                qryPreciseFlag: false,
            };
            this.tableData = [];
            this.rowIdKey = "";
        },
        async getList() {
            let res = await this.rpc.controlWorkbench.qryBizD1ObjectListV2({
                objName: this.searchForm.objNm,
                objClass: "",
                // objNm: this.searchForm.objNm,
                currentPage: this.searchForm.currentPage,
                turnPageShowNum: this.searchForm.turnPageShowNum,
                approvalStatus: ['00', '02'],
                bizDomainNo: this.bizDomainNo,
                qryPreciseFlag: this.searchForm.qryPreciseFlag
            });
            this.tableData = res.objectInfos || [];
            this.searchForm.total = res.turnPageTotalNum;
        },

        handleClick(row, type) {
            if (type == "lookBusiness") {
                // 业务模型设计工具的查看模式 定位到对应的处理
                // console.log(row, 'row===>')
                window.open(
                    `/aop-h5-sub/#/aop_businessmold/modelDesign/home?productId=${this.sourceList.productId}&bizId=${this.sourceList.businessId}&productTreeId=${this.sourceList.productTreeId}&domainNo=${this.sourceList.domainNo}&bizDomainNo=${this.sourceList.bizDomainNo}&action=view`,
                    "_blank"
                );

            } else if (type == "look") {
                // 显示对象详情
                this.drawerVisible = true;
                this.objectId = row.objId;
                if (row.objectBehaviorInfos && row.objectBehaviorInfos.length > 0) {
                    this.rowInfo = row.objectBehaviorInfos[0]
                }

            } else if (type == "comparison") {
                this.rpc.controlWorkbench
                    .qryObjBizObjectInfoV2({
                        objId: row.objId,
                    })
                    .then((res) => {
                        this.selectItem = res; // 选择查询的对象
                        this.dialogVisiable = true;
                    });
            }
        },
        handleSizeChange(value) {
            this.searchForm.turnPageShowNum = value
            this.searchForm.currentPage = 1
            this.getList()
        },
        handleCurrentChange(value) {
            this.searchForm.currentPage = value
            this.getList()
        },
        saveDialog(val) {
            this.basicInfo1 = JSON.parse(JSON.stringify(val));
            let objId = val.objId;
            this.rowIdKey = objId;
            this.dialogVisiable = false;
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


        async qryApprovalDetail(rowId) {
            let res = await this.rpc.controlWorkbench.qryApprovalDetail({
                aplySrlNo: rowId,
            });
            this.detailData = res;
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
                return "/";
            }
        },
        onConfirm() {
            if (this.handelType == "0") {
                if (!this.selectedItem) {
                    this.$message.error("请选择业务对象");
                    return;
                }
                // 第一种是直接选择提交    // 第二种是点了对比没点编辑
                this.basicInfo1 = JSON.parse(JSON.stringify(this.selectedItem));
                // 第三种是点了对比之后编辑的
                if (this.comparisonType !== 'edit') {
                    this.rpc.controlWorkbench
                        .qryObjBizObjectInfoV2({
                            objId: this.rowIdKey,
                        })
                        .then((res) => {
                            this.basicInfo1 = res;
                        });
                }
                // 确认弹窗
                this.dialogBussinessVisiable = true;
            } else {
                this.$refs.editObject.txtSaveSubmitForm();
            }
        },
        confim(val) {
            this.basicInfo1 = JSON.parse(JSON.stringify(val));
            // this.selectItem = val;
            if (this.comparisonType != 'edit') {
                this.dialogBussinessVisiable = true;
            } else {
                this.selectItem = JSON.parse(JSON.stringify(val));
            }
            this.addKeyActVisible = false;
        },
        // 选中
        saveForm(val) {
            const { basicInfo, selectedItem, mappings } = val;
            selectedItem && selectedItem.objectBehaviorInfos?.map(item => {
                item.approvalStatus = '02';
            });
            const obaReplaceInfo = Object.entries(mappings.attribute).flatMap(([originalId, replaceIds]) => {
                return replaceIds.map(replaceId => ({
                    originalId: originalId,
                    replaceId: replaceId 
                }));
            });
            const obeReplaceInfo = Object.entries(mappings.behavior).flatMap(([originalId, replaceIds]) => {
                return replaceIds.map(replaceId => ({
                    originalId: originalId,
                    replaceId: replaceId
                }));
            });

            let parmas = {
                aplySrlNo: this.aplySrlNo,
                aplyTargetId: basicInfo.objId,
                aplyTargetType: "00", // 00-对象;01-对象行为,02-字段
                handleMode: this.handelType === '0' ? '00' : '01',
                operateType: basicInfo.objId === selectedItem.objId ? "0" : "1", // 0 -新增;1-替换
                replaceId: basicInfo.objId === selectedItem.objId ? "" : selectedItem.objId, // 替换时才传
                updateApprovalObjectInfo: {
                    ...basicInfo,
                    obaReplaceInfo,
                    obeReplaceInfo 
                },
                updateApprovalObjectInfoNew: selectedItem,
            };

            this.rpc.controlWorkbench
                .submitApproval(parmas)
                .then((res) => {
                    this.$message.success("提交成功");
                    this.routeBack();
                });
        },
        sumbitFn(val) {
            console.log(val,)
            // 这种点对比之后选中对象，没点编辑
            this.basicInfo1 = JSON.parse(JSON.stringify(val.selectedItem));
            this.rowIdKey = val.selectedItem.objId;
            this.storedSelectedItem = JSON.parse(JSON.stringify(val.selectedItem));
            this.dialogVisiable = false;
            this.addKeyActVisible = false;
        },
        editDialog(val) {
            this.basicInfo2 = JSON.parse(JSON.stringify(val));
            this.type = "edit";
            this.addKeyActVisible = true;
        },
        // 对比弹窗编辑
        editComDialog(val) {
            this.basicInfo2 = JSON.parse(JSON.stringify(val));
            this.comparisonType = val && val.comparisonType
            this.addKeyActVisible = true;
        },
        async submitApproval() {
            let parmas = {
                aplySourceId: "", // 申请来源
                aplySrlNo: this.aplySrlNo, // 申请流水号
                aplyTargetId: "", // 审批目标Id
                aplyTargetSource: "", // 审批来源 00-处理设计,01-规则设计
                aplyTargetType: "00", // 审批目标类型(00-对象;01-对象行为,02-字段)
                approvalResult: "01", // 审批结果(00:替换; 01:新增)  (目前做新增)
                replaceId: "", // 替换ID
            };
            this.rpc.controlWorkbench
                .submitApproval({
                    aplySrlNo: this.aplySrlNo,
                })
                .then((res) => {
                    this.$message.success("提交成功");
                    this.routeBack();
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

    .tab_content {
        background: #fafafc;
        border-radius: 4px;
        margin-top: 16px;
    }

    /deep/.el-tabs {
        min-height: 48px;
        border-bottom: 3px solid #e7e7ee;

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
        border: 1px solid #eee;
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

        .table_footer_box {
            text-align: right;
            margin-top: 24px;
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
</style>
