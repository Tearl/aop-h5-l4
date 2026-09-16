<template>
    <div class="condition-line" v-if="line">
        <div class="attr_main">
            <div class="attr_title underLine">
                <div>条件分支</div>
            </div>
            <div class="attr_box">
                <template v-if="initFinish">
                    <Table
                        class="attr_innerTable"
                        :data="tableData"
                        :table="tableColumn"
                    ></Table>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Table from "@m/core/components/page_table_workgate";
export default {
    data() {
        return {
            line: null,
            initFinish: false,
            tableColumn: [],
            tableColumn2: [
                {
                    prop: "paramKey",
                    label: "字段Key",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramNm",
                    label: "字段名称",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "condTyp",
                    label: "对比关系",
                    minWidth: "20%",
                    type: "text",
                },
                {
                    prop: "paramValue",
                    label: "对比字段key",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramValueNm",
                    label: "对比字段名称",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
            ],
            tableColumn1: [
                {
                    prop: "paramKey",
                    label: "字段Key",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "paramNm",
                    label: "字段名称",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "condTyp",
                    label: "对比关系",
                    minWidth: "20%",
                    type: "text",
                },
                {
                    prop: "paramValue",
                    label: "对比值",
                    minWidth: "20%",
                    type: "text",
                    tooltip: true,
                },
            ],
        };
    },
    components: {
        Table,
    },
    computed: {
        tableData() {
            return Array.isArray(this.line) ? this.line : [this.line];
        },
    },
    methods: {
        init(line) {
            this.initFinish = false;
            console.log("init line", line);
            this.line = line;
            if (Array.isArray(line) && line.length) {
                if (this.line[0].paramValueNm) {
                    this.tableColumn = this.tableColumn2;
                } else {
                    this.tableColumn = this.tableColumn1;
                }
            } else {
                if (this.line.paramValueNm) {
                    this.tableColumn = this.tableColumn2;
                } else {
                    this.tableColumn = this.tableColumn1;
                }
            }
            
            this.initFinish = true;
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.condition-line {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    .mt10 {
        margin-top: 10px;
    }
    .bold_text {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
    }
    .attr_main {
        height: 100%;
        ::v-deep .el-table__cell {
            padding: 8px 0;
            .cell {
                span {
                    font-size: 12px;
                }
            }
        }
        ::v-deep tr {
            .cell {
                font-size: 12px;
                // padding: 0;
            }
        }
    }
    .attr_title {
        padding: 0px 20px;
        font-family: $font_medium;
        font-weight: 600;
        height: 44px;
        line-height: 44px;
        &.flex {
            display: flex;
            justify-content: space-between;
            .right_btn {
                color: $theme_color;
                cursor: pointer;
            }
        }
    }
    .underLine {
        border-bottom: 1px solid $pri_br_color;
    }
    .attr_box {
        padding: 20px;
    }
}
</style>
