<template>
    <div class="object_list_box">
        <div class="search" v-show="isSearch" ref="searchRefs">
            <div class="form">
                <el-form size="small" :model="formData" inline="true" ref="form">
                    <el-form-item label="对象行为名称：" label-width="110px">
                        <el-input v-model="formData.obeName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="业务对象名称：" label-width="110px">
                        <el-input v-model="formData.objName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="申请来源：" label-width="110px">
                        <el-select placeholder="请选择" v-model="formData.aplyTargetSource" clearable class="w150p">
                            <el-option v-for="(item) in sourceList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请人：" props="createUserName" label-width="110px">
                        <el-input class="w150p" v-model="formData.aplyUserName" placeholder="请输入" clearable
                            maxlength="30">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn">
                <el-button type="primary" size="small" @click="onSearch">查询</el-button>
                <el-button size="small" plain @click="onReset">重置</el-button>
            </div>
        </div>
        <div class="table_box">
            <div class="page-flex-mode-header mb16">
                <div class="title-text">
                    <em>申请列表</em>
                    <el-checkbox v-model="isMyApprove" v-if="listType == 'approved'"
                        style="margin-left: 10px; color:#333;" @change="changeMyApprove">
                        我审批的
                    </el-checkbox>
                </div>
                <tableOptimize :isSearch.sync="isSearch" :isStripe.sync="isStripe" :operateShow="false">
                </tableOptimize>
            </div>
            <el-table :data="tableData" v-loading="tableLoading" :stripe="isStripe">
                <el-table-column prop="obeName" label="对象行为名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.obeName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="objName" label="业务对象名称" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.objName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="aplyTargetSource" label="申请来源" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ aplyTargetSourceType[scope.row.aplyTargetSource] || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="aplyUserName" label="申请人" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.aplyUserName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="aplyTime" label="申请时间" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.aplyTime || "/" }}</span>
                    </template>
                </el-table-column>
                <!-- tab为待审批时显示 -->
                <el-table-column prop="aplyTime" label="已等待" min-width="160" show-overflow-tooltip="true"
                    v-if="listType == 'waitApprove'">
                    <template slot-scope="scope">
                        <span class="wait_time_value">{{ calculateWaitTime(scope.row.aplyTime) || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="aprvlStusCd" label="处理结果" min-width="160" show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span
                            :class="{ 'success': scope.row.aprvlStusCd == '1', 'danger': scope.row.aprvlStusCd == '0' }">{{
                                aprvlStusCdType[scope.row.aprvlStusCd] || "/" }}</span>
                    </template>
                </el-table-column>
                <!-- tab为已审批时显示 -->
                <el-table-column prop="approverName" label="审批人" min-width="160" show-overflow-tooltip="true"
                    v-if="listType == 'approved'">
                    <template slot-scope="scope">
                        <span>{{ scope.row.approverName || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="approverTime" label="审批时间" min-width="160" show-overflow-tooltip="true"
                    v-if="listType == 'approved'">
                    <template slot-scope="scope">
                        <span>{{ scope.row.approverTime || "/" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="handleClick(scope.row, 'approve')"
                            v-if="listType == 'waitApprove'">
                            审批
                        </el-button>
                        <el-button type="text" size="medium" @click="handleClick(scope.row, 'look')"
                            v-if="listType == 'approved'">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table_footer_box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="turnPageShowNum"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import tableOptimize from "@m/core/components/table_optimize";
import { getLocalStorage } from "@m/utils/localStorage.js";
export default {
    components: {
        tableOptimize
    },
    props: {
        // 列表类型
        listType: {
            type: String,
            default: () => 'waitApprove'
        },
        sideType: {
            type: String,
            default: () => ''
        },
        tableData: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            formData: {
                objName: '',
                obeName: '',
                aplyTargetSource: '',
                aplyUserName: '',
                approverId: ''
            },
            sourceList: [
                { label: '全部', value: '' },
                { label: '处理设计', value: '00' },
                { label: '规则设计', value: '01' },
            ],
            isSearch: true, // 是否展示搜索行
            isStripe: false, // 是否显示斑马线
            scrollHeight: '',
            currentPage: 1,
            turnPageShowNum: 10,
            turnPageTotalNum: 0,
            tableLoading: false,
            isMyApprove: false,
            searchFormHeight: 0,
            maxTopHeight: '50px',
            aplyTargetSourceType: {
                '00': '处理设计',
                '01': '规则设计'
            },
            aprvlStusCdType: {
                '0': '待审批',
                '1': '已审批'
            },
            cstNo: ""
        }
    },
    watch: {
        listType(newv) {
            this.onReset()
        },
        'isSearch'(newVal, oldVal) {
            console.log('newVal--', newVal)
            if (!newVal) {
                this.maxTopHeight = 'calc(100vh - 220px)'
            }
            this.$nextTick(() => {
                this.searchFormHeight = this.$refs.searchRefs.$el.offsetHeight
                let h = this.searchFormHeight + 'px';
                if (this.searchFormHeight > 80) {
                    this.maxTableHeight = 'calc(100vh - 230px' + ' - ' + h + ')';
                } else {
                    this.maxTableHeight = 'calc(100vh - 325px)';
                }
            })
        },
        isMyApprove(newv) {
            !!newv ? this.formData.approverId = this.cstNo : this.formData.approverId = ''
            this.queryList()
        }
    },
    created() {
        this.getRoleFn()
    },
    methods: {
        getRoleFn() { //获取角色
            let userInfo = JSON.parse(getLocalStorage('_userInfo'));
            this.cstNo = userInfo.cstNo
        },
        changeMyApprove() { },
        queryList() {
            this.$emit('queryList', {
                ...this.formData,
                currentPage: this.currentPage,
                turnPageShowNum: this.turnPageShowNum,
            })
        },
        handleSizeChange(value) {
            this.turnPageShowNum = value
            this.currentPage = 1
            this.queryList()
        },
        handleCurrentChange(value) {
            this.currentPage = value
            this.queryList()
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
        handleClick(row, type) {
            if (type == 'approve') {
                // 审批
                this.$router.push({
                    path: '/aop_tradedesign/controlWorkbench/addObjectBehavior',
                    query: {
                        listType: this.listType,
                        sideType: this.sideType,
                        aplySrlNo: row.aplySrlNo,
                        aplyTargetId: row.aplyTargetId
                    }
                })
            } else if (type == 'look') {
                // 查看
                this.$router.push({
                    path: '/aop_tradedesign/controlWorkbench/lookObjectBehavior',
                    query: {
                        listType: this.listType,
                        sideType: this.sideType,
                        aplySrlNo: row.aplySrlNo,
                        aplyTargetId: row.aplyTargetId
                    }
                })

            }
        },
        onSearch() {
            this.currentPage = 1
            this.queryList()
        },
        onReset() {
            this.formData = {
                obeName: '',
                objName: '',
                aplyTargetSource: '',
                aplyUserName: ''
            }
            this.onSearch()
        },
    },
}

</script>
<style lang='scss' scoped>
.object_list_box {
    .search {
        padding: 16px 24px 4px 24px;
        background-color: #fff;
        display: flex;
        margin-bottom: 12px;
        border-radius: 4px;
    }

    .form {
        flex: 1;
        flex-wrap: wrap;

        ::v-deep .el-input,
        ::v-deep .el-select {
            width: 160px;
        }

        ::v-deep .el-form-item__label {
            color: rgba(0, 0, 0, 0.85);
            font-family: PingFangSC-Regular;
        }

        ::v-deep .el-form-item--small.el-form-item {
            margin-bottom: 10px;
        }
    }

    .table_box {
        background: #fff;
        padding: 16px 24px;
        border-radius: 4px;

        .page-flex-mode-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ffffff;
            margin-bottom: 16px;

            .handle-btn {
                padding: 8px 10px;
                line-height: 20px;
                background: #358aff;
                border-radius: 2px;
                min-width: 126px;
                height: 36px;
            }

            .title-text {
                em {
                    margin-right: 8px;
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #333333;
                    line-height: 24px;
                    font-weight: 500;
                    font-style: normal;
                }

                span {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #999999;
                    letter-spacing: 0;
                    line-height: 24px;
                    font-weight: 400;
                }
            }
        }

        .success {
            color: #67c23a;
            background-color: #f0f9eb;
            padding: 4px 8px;
        }

        .danger {
            color: #e6a23c;
            background-color: #fdf6ec;
            padding: 4px 8px;
        }


        .wait_time_value {
            color: #FF5F5F;
            background-color: #fef0f0;
            padding: 4px 8px;
        }

        /deep/.el-table .el-table__body tr {
            cursor: pointer;
        }

        /deep/.el-table th {
            background: #fafafc;
            font-size: 14px;
            color: #333333;
        }

        /deep/.el-table th .cell {
            padding-left: 24px;
            line-height: 23px;
        }

        /deep/.el-table td {
            padding: 11px 0;
            font-size: 14px;
            color: #666666;
            position: relative;
        }

        /deep/.el-table td .cell {
            padding-left: 24px;
            line-height: 23px;
        }
    }

    .table_footer_box {
        text-align: right;
        margin-top: 24px;
    }
}
</style>