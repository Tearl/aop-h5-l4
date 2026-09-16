<template>
    <el-dialog
        title="提交确认结果"
        width="900px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        append-to-body="true"
        :visible.sync="showSubmitDialog"
        @close="closeSubmitDialog"
        class="design-review-submit-dialog"
    >
        <div class="submit-content">
            <div class="interface-base">
                <p class="title">确认结果</p>
                <el-table
                    :data="submitData"
                    style="width: 100%"
                    ref="reviewTable"
                    size="medium"
                    align="center"
                    :stripe="false"
                    border
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                >
                    <el-table-column
                        label="当前功能"
                        :min-width="100"
                        prop="label"
                    ></el-table-column>
                    <el-table-column label="确认结果" :min-width="100">
                        <template slot-scope="scope">
                            <span
                                v-if="submitStatus == '1'"
                                style="color: #fe4758"
                                ><i class="el-icon-circle-close"></i
                                >不通过</span
                            >
                            <span
                                v-else-if="submitStatus == '0'"
                                style="color: #36d542"
                                ><i class="el-icon-circle-check"></i>通过</span
                            >
                            <span v-else>/</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="确认人员" :min-width="200">
                        <template slot-scope="scope">
                            <el-button
                                class="button-new-tag"
                                size="mini"
                                icon="el-icon-plus"
                                @click="showChooseDialog = true"
                                >添加人员</el-button
                            >
                            <el-tag type="info" effect="plain">{{
                                userInfo.cstName
                            }}</el-tag>
                            <el-tag
                                type="info"
                                effect="plain"
                                @close="removeUser(item)"
                                closable
                                v-for="(item, index) in chooseUsers"
                                :key="index"
                                >{{ item.userName }}</el-tag
                            >
                        </template>
                    </el-table-column>
                </el-table>

                <template v-if="submitStatus == '1'">
                    <p class="title title2">
                        <span @click="toggleUnPass">不通过明细</span>
                        <i
                            @click="toggleUnPass"
                            class="el-icon-arrow-right"
                            :class="{ expand: showUnPass }"
                        ></i>
                    </p>
                    <!-- 明细列表 -->
                    <el-table
                        v-show="showUnPass"
                        :data="unPassList"
                        style="width: 100%"
                        ref="contentTable"
                        size="medium"
                        align="center"
                        :stripe="false"
                        border
                        max-height="300"
                        :header-cell-style="{
                            background: '#F5F5F8',
                            color: '#333',
                        }"
                    >
                        <el-table-column
                            label="名称"
                            :min-width="100"
                            prop="contNm"
                        ></el-table-column>
                        <el-table-column
                            label="类型"
                            :min-width="100"
                            prop="contTpCdNm"
                        ></el-table-column>
                        <el-table-column
                            label="结果"
                            :min-width="100"
                            prop="rewReltCd"
                        >
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.rewReltCd == '1'"
                                    style="color: #fe4758"
                                    ><i class="el-icon-circle-close"></i
                                    >不通过</span
                                >
                                <span
                                    v-else-if="scope.row.rewReltCd == '0'"
                                    style="color: #36d542"
                                    ><i class="el-icon-circle-check"></i
                                    >通过</span
                                >
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="时间"
                            :min-width="100"
                            prop="updTm"
                        ></el-table-column>
                    </el-table>
                    <div class="pagination-block" v-show="showUnPass">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            :page-size="turnPageShowNum"
                            :total="turnPageTotalNum"
                            :hide-on-single-page="true"
                            @current-change="changePage"
                        >
                        </el-pagination>
                    </div>
                </template>
            </div>
        </div>
        <div class="btn-group" slot="footer">
            <el-button size="medium" @click="closeSubmitDialog">取消</el-button>
            <el-button size="medium" type="primary" @click="submitForm"
                >确定</el-button
            >
        </div>

        <!-- 选择人员dialog -->
        <chooseUser
            v-if="showChooseDialog"
            v-model="showChooseDialog"
            :users="chooseUsers"
            @output="chooseUserOut"
        />
    </el-dialog>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import chooseUser from "./chooseUser.vue";

export default {
    mixins: [mixin],
    components: {
        chooseUser,
    },
    props: {
        showSubmitDialog: {
            type: Boolean,
            default: false,
        },
        examId: "",
        fnctId: '',
        fnctNm: "",
    },
    data() {
        return {
            showChooseDialog: false,
            submitData: [
                {
                    label: this.fnctNm,
                    reviewUser: [],
                    reviewStatus: "1",
                },
            ],
            chooseUsers: [],
            showUnPass: false,

            submitStatus: "", // 接口返回确认结果 0-通过;1-不通过
            currentPage: 1,
            unPassList: [],
            turnPageShowNum: 10,
            turnPageTotalNum: 0,
            typeTextMap: {
                "01": "功能流程图",
                "02": "页面",
                "03": "要素",
                "04": "事件",
                "05": "接口",
                "06": "服务",
                "08": '非功能需求'
            },
        };
    },
    // watch: {
    //     showSubmitDialog: {
    //         async handler() {
    //             if (this.showSubmitDialog) {
    //                 await this.queryContent();
    //             }
    //         },
    //         immediate: true
    //     }
    // },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    async mounted() {
        await this.queryContent();
    },
    methods: {
        async queryContent(currentPage = 1) {
            const res =
                await this.rpc.businessRules.querySystemDesignReviewContentPageList(
                    {
                        examId: this.examId,
                        fnctId: this.fnctId,
                        currentPage: currentPage,
                        turnPageShowNum: this.turnPageShowNum,
                    }
                );
            this.submitStatus = res.rewReltCd;
            this.unPassList = res.systemDesignReviewContentRecordList.map(
                (i) => {
                    return {
                        ...i,
                        contTpCdNm: this.typeTextMap[i.contTpCd] || "",
                    };
                }
            );
            this.turnPageTotalNum = res.turnPageTotalNum;
        },
        async changePage(page) {
            await this.queryContent(page);
        },
        closeSubmitDialog() {
            this.$emit("closeSubmitDialog");
        },
        submitForm() {
            let userNames = this.chooseUsers.map((u) => u.userName);
            userNames = [this.userInfo.cstName].concat(userNames).join(",");
            let userNos = this.chooseUsers.map((u) => u.userNo);
            userNos = [this.userInfo.cstNo].concat(userNos).join(",");
            this.$emit("finishSubmit", userNames, userNos);
        },
        chooseUserOut(users) {
            this.chooseUsers = users;
        },
        removeUser(user) {
            this.chooseUsers = this.chooseUsers.filter(
                (u) => u.userNo != user.userNo
            );
        },
        async toggleUnPass() {
            this.showUnPass = !this.showUnPass;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "./mixin.scss";
.design-review-submit-dialog {
    /deep/ .el-dialog {
        border-radius: 8px;
    }

    /deep/ .el-dialog__body {
        // padding: 30px 20px;
        padding: 0;
    }
    /deep/ .el-dialog__header {
        text-align: left;
        padding: 0 24px;
        height: 48px;
        line-height: 48px;
        background: #fafafc;
        // box-shadow: inset 0 -1px 0 0 #e7e7e7;
        border-radius: 8px 8px 0 0;
        font-weight: 600;
        .el-dialog__title {
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            top: 14px;
        }
    }
    /deep/ .el-dialog__footer {
        border-top: 1px solid #e7e7e7;
        padding: 16px 24px;
    }

    .submit-content {
        width: 100%;
        padding: 30px 20px;
        .interface-base {
            width: 100%;
            min-height: 80px;
            .title {
                font-weight: 600;
                margin-bottom: 6px;
                color: #111;
            }
            .title2 {
                margin-top: 16px;
                @include flex(row, flex-start, center);
                user-select: none;
                span {
                    margin-right: 6px;
                    cursor: pointer;
                }
                i {
                    margin-top: 2px;
                    cursor: pointer;
                }
                .expand {
                    transform: rotate(90deg);
                    transition: transform 0.5s ease;
                }
            }
            .pagination-block {
                margin-right: -6px;
                .el-pagination {
                    padding: 0;
                    margin-top: 6px;
                    @include flex(row, flex-end, center);
                }
            }
            /deep/ .el-icon-circle-close,
            .el-icon-circle-check {
                // color: $error;
                margin-right: 6px;
            }
            /deep/ .button-new-tag {
                height: 32px;
                line-height: 30px;
                padding-top: 0;
                padding-bottom: 0;
                margin-right: 6px;
            }
            /deep/ .el-tag--plain {
                margin: 4px;
            }
        }
    }
}

.btn-group {
    text-align: center;
}
</style>
