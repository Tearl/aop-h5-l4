.<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'E'">
            <el-form
                :inline="true"
                :model="formSearch5"
                class="demo-form-inline"
            >
                <div>
                    <el-form-item label="申请时间：" size="mini">
                        <el-date-picker
                            v-model="formSearch5.deployDateStart"
                            type="date"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;"
                            placeholder="申请开始日期"
                        >
                        </el-date-picker>
                        至
                        <el-date-picker
                            v-model="formSearch5.deployDateEnd"
                            type="date"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;"
                            placeholder="申请结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>

                <el-form-item size="small" style="float: right;margin-top:-48px;">
                    <el-button size="small" type="primary" @click="searchSubmit5('A')"
                        >搜索</el-button
                    >
                    <el-button size="small" plain @click="resetSearch5">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <h3>配置历史</h3>
                <el-table
                    :data="tableE"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="medium"
                >
                    <el-table-column
                        property="appConfigApplicationId"
                        label="配置申请号"
                        min-width="150"
                    >
                    </el-table-column>
                    <el-table-column
                        property="crtTm"
                        label="申请时间"
                        min-width="180"
                    >
                    </el-table-column>
                    <el-table-column
                        property="creatrNm"
                        label="申请人"
                        min-width="100"
                    ></el-table-column>
                    <el-table-column
                        property="updTm"
                        label="配置时间"
                        min-width="180"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.confSts == '02'"
                                >{{scope.row.updTm || '/'}}</span
                            >
                            <span v-else
                                >/</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="confPrsnNm"
                        label="配置人"
                        min-width="100"
                    ></el-table-column>
                    <el-table-column
                        property="confSts"
                        label="配置状态"
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.confSts == '01'" class="orange"
                                >配置中</span
                            >
                            <span v-if="scope.row.confSts == '02'" class="green"
                                >已配置</span
                            >
                            <span v-if="scope.row.confSts == '00'" class="orange"
                                >待配置</span
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="btn_el_pageNation"
                    @size-change="handleSizeChange5"
                    @current-change="handleCurrentChange5"
                    medium
                    background
                    :current-page="currentPage5"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize5"
                    layout="total, prev, pager, next,sizes, jumper"
                    :total="total5"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import FormDialog from "./formDialog.vue";
export default {
    components: {
        FormDialog,
    },
    props: {
        tableE: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        formSearch5: {
            type: Object,
            default: () => {},
        },
        pageSize5: {
            type: String,
            default: () => "10",
        },
        currentPage5: {
            type: String,
            default: () => "1",
        },
        total5: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            // 列表数据
            showCodeDialog: false,
        };
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
        },
        listnameDetail(type, value) {
            console.log("交易名称跳转应用", type, value);
        },
        // 弹窗搜索
        searchSubmit5(type) {
            this.$emit("searchSubmit5", type);
        },
        // 重置搜
        resetSearch5(type) {
            this.$emit("resetSearch5", type);
        },
        handleSizeChange5(val) {
            this.$emit("handleSizeChange5", val);
        },
        handleCurrentChange5(val) {
            this.$emit("handleCurrentChange5", val);
        },
    },
    created() {
        // this.getInfo(); // 查询基本详情
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    width: 100%;
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    .preview_content_table::-webkit-scrollbar {
        display: none;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 234px);
        min-height: calc(100vh - 234px);
        overflow-y: auto;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .orange {
            font-size: 12px;
            color: #fe4758;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #fe4758;
        }
        .green {
            font-size: 12px;
            color: #36d542;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 4px 4px;
            border: 1px solid #36d542;
        }
        .blue {
            font-size: 12px;
            color: #358aff;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #358aff;
        }
    }
    .demo-form-inline {
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
        ::v-deep .el-form-item__content {
            input {
                width: 140px;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 140px;
            }
        }
        ::v-deep .el-button{
            min-width:64px;
            height:32px;
            font-size:14px;
        }
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    .btn_el_pageNation {
        display: flex;
        justify-content: center;
        padding: 16px 0;
    }
    .dialog-footer {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        .el-button {
            margin-right: 10px;
        }
    }
    ::v-deep .el-tabs__header {
        margin: 0;
        .el-tabs__item {
            height: 72px;
            padding: 0 30px;
            line-height: 72px;
            font-size: 16px;
            font-family: $font_medium;
            letter-spacing: 0;
            font-weight: $font_weight_600;
        }
    }
    ::v-deep .el-tabs__content {
        display: none;
    }
}
</style>
