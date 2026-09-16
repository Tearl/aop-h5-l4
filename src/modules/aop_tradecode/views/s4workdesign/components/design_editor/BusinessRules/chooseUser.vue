<template>
    <el-dialog
        title="选择成员"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_applicationpositiondialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <div class="application_config_relevance_system">
            <div class="comp-lib-search-line">
                <el-form
                    :model="formData"
                    ref="formData"
                    class="comp-lib-search-form"
                    size="small"
                    :inline="true"
                >
                    <el-form-item label="用户姓名:" prop="userName">
                        <el-input
                            v-model="formData.userName"
                            class="comp-lib-search-form_input_width"
                            placeholder="请输入用户姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="手机号:" prop="userMobile">
                        <el-input
                            v-model="formData.userMobile"
                            placeholder="请输入手机号"
                            class="comp-lib-search-form_input_width"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="page_productlist_btns">
                    <el-button
                        class="page_productlist_btn"
                        type="primary"
                        @click="queryFormSubmit"
                        >查 询</el-button
                    >
                    <el-button
                        class="page_productlist_btn"
                        @click="resetQuerySubmit"
                        >重 置</el-button
                    >
                </div>
            </div>

            <div class="application_config_relevance_system_table" v-if="chooseType=='submitVal'">
                <PageTable
                    class="D2_workspace_common_table"
                    ref="radioTableRef"
                    :table="tables"
                    :data="list"
                    rowK="userNo"
                    key="table1"
                    @radioChange="handleSelect"
                ></PageTable>
            </div>
            <!-- 提交测试单选end -->
            <div class="application_config_relevance_system_table" v-else>
                <el-table
                    class="D2_workspace_common_table"
                    :data="list"
                    @select="handleSelect"
                    @select-all="handleAll"
                    ref="multipleTable"
                    key="table2"
                >
                    <el-table-column
                        :selectable="selectable"
                        type="selection"
                        fixed
                        width="52"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="用户姓名"
                        prop="userName"
                    ></el-table-column>
                    <el-table-column
                        label="手机号"
                        prop="userMobile"
                    ></el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div
                class="inner_cheetah_common_pagination"
                v-if="list.length != 0"
            >
                <el-pagination
                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                    :current-page.sync="curPage"
                    :pager-count="5"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="curPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="parseInt(turnPageTotalNum)"
                    :background="true"
                >
                </el-pagination>
            </div>
        </div>
        <div class="inner_cheetah_common_btns_area" slot="footer">
            <el-button @click="dialogVisible = false" :disabled="buttonDisabled"
                >取 消</el-button
            >
            <el-button
                type="primary"
                @click="submitForm"
                :disabled="buttonDisabled"
                >确 定</el-button
            >
        </div>
    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import PageTable from "@m/core/components/page_table";
export default {
    mixins: [mixin],
    props: {
        value: {
            type: Boolean,
            default: false,
        },

        users: {
            type: Array,
            default: () => [],
        },
        chooseType: {
            type: String,
            default: () => '',
        }
    },
    components: {
        PageTable,
    },
    data() {
        return {
            list: [],
            componentLibInfo: {},
            formData: {
                userName: "",
                userMobile: "",
            },
            curPageSize: "10",
            curPage: "1",
            turnPageTotalNum: 0,
            multipleSelection: [],
            cacheArr: [],
            tables: [
                {
                    prop: "userName",
                    width: "55",
                    type: "radio",
                    tooltip: false,
                },
                {
                    prop: "userName",
                    label: "用户姓名",
                    minWidth: "40%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "userMobile",
                    minWidth: "40%",
                    label: "手机号",
                    type: "text",
                    tooltip: true,
                },
            ],
            isCheck1: {},
        };
    },

    mounted() {
        this.users = this.users.map((item) => {
            return {
                userNo: item.userId,
                ...item,
            };
        });

        this.brhIds = [this.userInfo.usrBrhId, this.userInfo.custBrhId];
        this.cacheArr = JSON.parse(JSON.stringify(this.users));
        this.queryFuncList();
    },

    methods: {
        async queryFuncList() {
            var params = {
                roleShrtNm: "ALL_ROLES", //D2PSRY  ALL_ROLES
                pltfmFlg: this.systemId,
                type: "0",
                currentPage: this.curPage,
                turnPageShowNum: this.curPageSize,
                userNo: this.formData.userName,
                userMobile: this.formData.userMobile,
            };
            const { userList, turnPageTotalNum } =
                await this.rpc.businessRules.queryUserList(params);
            this.list = userList || [];
            this.turnPageTotalNum = turnPageTotalNum;
            this.cacheArr.forEach((user) => {
                this.list.forEach((el) => {
                    if (el.userNo == user.userNo) {
                        if (user.superAdmin) {
                            el.superAdmin = true;
                        }
                        this.$nextTick(() => {
                            if(this.chooseType=='submitVal'){
                                this.$refs.radioTableRef.clearRadio();
                            } else {
                                this.$refs.multipleTable.toggleRowSelection(
                                    el,
                                    true
                                );
                            }
                        });
                    }
                });
            });
        },

        selectable(row, index) {
            if (row.superAdmin) {
                return false;
            } else {
                return true;
            }
        },

        queryFormSubmit() {
            this.curPageSize = "10";
            this.curPage = "1";
            this.queryFuncList();
        },
        resetQuerySubmit() {
            this.$refs.formData.resetFields();
            this.curPageSize = "10";
            this.curPage = "1";
            this.queryFuncList();
        },
        pageSizeChange(val) {
            this.curPageSize = val;
            this.queryFuncList();
        },
        currentPageChange(val) {
            this.curPage = val;
            this.queryFuncList();
        },
        handleAll(val) {
            if (val.length === this.list.length) {
                // 全选
                val.map((item) => {
                    let index = this.cacheArr.findIndex(
                        (items) => items.userNo == item.userNo
                    );
                    if (index == -1) {
                        this.cacheArr.push(item);
                    }
                });
            } else {
                // 超管不能取消
                let arr = this.list.map((item) => {
                    if (!item.superAdmin) {
                        return item.userNo;
                    }
                });
                this.cacheArr = this.cacheArr.filter(
                    (item) => !arr.includes(item.userNo)
                );
            }
        },
        handleSelect(arr, val) {
            if(this.chooseType=='submitVal'){
                this.isCheck1 = arr;
                return
            }
            let isSelect =
                arr.findIndex((item) => item.userNo == val.userNo) == -1
                    ? false
                    : true; // false 取消当前选择
            let index = this.cacheArr.findIndex(
                (item) => item.userNo == val.userNo
            );
            if (isSelect) {
                if (index == -1) {
                    this.cacheArr.push(val);
                }
            } else {
                if (index != -1) {
                    this.cacheArr.splice(index, 1);
                }
            }
        },
        submitForm() {

            if(this.chooseType=='submitVal'){
                this.$emit("output", this.isCheck1);
            }else{
                this.multipleSelection = this.cacheArr.concat([]);
                this.$emit("output", this.multipleSelection);
            }

            this.dialogVisible = false;
        },
    },

    computed: {
        dialogVisible: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
        ...mapGetters(["systemId", "userInfo"]),
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/public.scss";
.inner_cheetah_comps_applicationpositiondialog {
    .application_config_relevance_system {
        .comp-lib-search {
            margin: 14px 7px 0 7px;
            padding: 24px;
            background: #ffffff;

            &.comp-lib-search-container {
                padding-bottom: 10px;
            }

            &.comp-lib-table-container {
                padding-top: 0px;
            }
        }
        .comp-lib-search-line {
            display: flex;
            align-items: flex-start;
        }

        .page_productlist_btn {
            width: 64px;
            height: 34px;
            padding: 0;
        }

        .comp-lib-search-form {
            display: flex;
            flex-wrap: wrap;
            width: 85%;
        }

        .comp-lib-search-form_input_width {
            width: 135px;
        }

        .page_productlist_btns {
            width: 25%;
            text-align: right;
        }
    }
}
</style>
