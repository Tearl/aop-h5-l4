<template>
    <div class="field_dialog inner_cheetah_common_dialog">
        <div class="container">
            <div class="design_page_nav" :style="{ width: sidebarWidth + 'px' }">
                <h1>使用场景</h1>
                <div class="nav_box">
                    <el-input placeholder="请输入名称" prefix-icon="el-icon-search" v-model="keyword" size="small"
                        @change="getSlideData"></el-input>
                    <div class="nav_item_box">
                        <div :class="[
                            'common_tree_content_item',
                            currentIndex == index ? 'active_item' : '',
                        ]" v-for="(data, index) in navList" :key="data.code" @click="handleTreeClick(index, data)">
                            <span>{{ data.objName }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <h1>使用对象</h1>
                <aop-public-search ref="searchBar" label-width="100px" :list="searchConfig" @search="searchHandle"
                    @reset="resetHandle" style="margin-bottom: 12px" />
                <aop-public-table-container class="process-table-wrap" :tools="[]">
                    <div class="control" slot="left">
                        <el-button type="primary" size="small" @click="addAttrDialogVisible = true">新增对象属性</el-button>
                    </div>

                    <template slot-scope="{ data }">
                        <el-table v-loading="loading" :data="list" :stripe="data.stripe" ref="multipleTable">
                            <el-table-column min-width="120px" prop="dictryNo" show-overflow-tooltip label="字段简称">
                            </el-table-column>
                            <el-table-column min-width="160px" prop="dictryName" show-overflow-tooltip label="字段名称">
                            </el-table-column>
                            <el-table-column min-width="120px" prop="dictryType" show-overflow-tooltip label="字段类型">
                            </el-table-column>
                            <el-table-column min-width="120px" prop="dictryType" show-overflow-tooltip label="是否新增">
                            </el-table-column>
                            <el-table-column min-width="120px" prop="dictryType" show-overflow-tooltip label="是否贯标">
                            </el-table-column>
                            <el-table-column min-width="120px" prop="dictryType" show-overflow-tooltip label="字段审批状态">
                            </el-table-column>
                        </el-table>
                    </template>
                </aop-public-table-container>
            </div>
        </div>
    </div>
</template>

<script>

import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    props: {
    },
    computed: {

    },
    data() {
        return {

            keyword: "",
            searchConfig: [
                {
                    label: "字段名称",
                    name: "el-input",
                    key: "dictryNoOrName",
                    placeholder: "请输入字段简称、字段名称",
                },
                {
                    label: "字段类型",
                    name: "el-select",
                    key: "dataSetId",
                    placeholder: "请选择",
                    attrs: {
                        filterable: true,
                    },
                    options: [],
                },
            ],
            page: 1, // 当前页
            pageNum: 10, // 每页显示条数
            total: 0, // 总条数
            loading: false, // 加载中
            searchParams: {},
            navList: [],
            currentIndex: 0,
            objId: "",
            objName: "",
            list: [],
            selectedFieldList: [],
            sidebarWidth: 200,
            selectData: [],
        };
    },
    async mounted() {
        await this.getSlideData();
        await this.getList();
    },
    methods: {
        searchHandle(v) {
            this.searchParams = v;
            this.getList();
        },
        resetHandle() {
            this.page = 1;
            this.pageNum = 10;
            this.searchParams = {};
            this.getList();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.pageNum = val;
            this.getList();
        },
        async getList() {
            this.loading = true;
            const { attributeInfos } =
                await this.rpc.controlWorkbench.qryBizObjectInfoV2({
                    objId: this.objId,
                    dictryNoOrName: this.searchParams.dictryNoOrName,
                });
            this.list = attributeInfos || [];
            // if (this.selectData.length) {
            //     this.selectData.forEach((e) => {
            //         this.list.forEach((l, i) => {
            //             if (e.dictryNo == l.dictryNo) {
            //                 this.$nextTick(() => {
            //                     this.$refs.multipleTable.toggleRowSelection(
            //                         l,
            //                         true
            //                     );
            //                 });
            //             }
            //         });
            //     });
            // }

            // this.total = Number(turnPageTotalNum) || 0;
            this.loading = false;
        },
        async getSlideData() {
            const { objectInfos } = await this.rpc.controlWorkbench.qryBizD1ObjectListV2({
                currentPage: 1,
                turnPageShowNum: 9999,
                bizDomainNo: this.$route.query.bizDomainNo,
                objName: this.keyword,
            });
            this.navList = objectInfos || [];
            // this.searchConfig[1].options = this.navList.map((e) => {
            //     return {
            //         value: e.objId,
            //         label: e.objName,
            //     };
            // });
            // this.searchConfig[1].options.unshift({
            //     value: "",
            //     label: "全部",
            // });
            // this.$refs.searchBar.setData(this.searchConfig);

            this.objId = this.navList[0].objId;
            this.objName = this.navList[0].objName;
        },
        handleTreeClick(index, data) {
            this.currentIndex = index;
            this.objId = data.objId;
            this.objName = data.objName;
            this.getList();
        },

        save() {
            if (this.selectData.length == 0) {
                this.$message.warning("请选择字段");
            } else {
                this.$emit("objFieldSelect", this.selectData);
                this.dialogVisiable = false;
            }
        },
        jumpToDict() {
            let link = this.$router.resolve({
                path: "/aop_businessmold/businessAnalysis/datasetManagement",
                query: {
                    statusActive: this.$route.query.domainNo,
                },
            });
            window.open(link.href, "_blank");
        },
    },
};
</script>

<style lang="scss" scoped>
.field_dialog {

    .container {
        display: flex;
        height: calc(100vh - 104px);
        padding: 12px;

        .design_page_nav {
            // height: 100%;
            background: #fff;
            overflow: hidden;

            h1 {
                // padding: 8px 0;
                padding: 8px;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 600;
            }

            .nav_box {
                padding: 8px;
                padding-top: 0;


                /deep/.el-input {
                    border-radius: 2px;
                    margin-bottom: 10px;
                }

                .nav_item_box {
                    height: calc(100vh - 100px);
                    overflow-y: auto;
                }

                .common_tree_content_item {
                    margin-top: 10px;
                    padding: 9px 0;
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                    span {
                        display: inline-block;
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333333;
                        letter-spacing: 0;
                        margin-left: 4px;
                    }

                    &.active_item {
                        background: #f0f5ff;
                        border-radius: 2px;

                        span {
                            font-family: PingFangSC-Medium;
                            color: #358aff;
                        }
                    }
                }
            }
        }

        .content {
            flex: 1;
            overflow: auto;
            margin-left: 12px;

            h1 {
                // padding: 8px 0;
                padding: 8px;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 600;
                background-color: #fff;
                margin-bottom: 12px;
            }
        }

        .control {
            h1 {
                font-size: 16px;
                font-weight: 500;
            }
        }
    }

    .btn_footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        background-color: #fff;

        .field_chose {
            width: 70%;
            display: flex;
            align-items: center;
        }

        .chose_leb {
            display: block;
            min-width: 80px;
        }

        .leb_var {
            font-size: 12px;
            color: #358aff;
            background-color: #ecf2fe;
            padding: 2px 8px;
            user-select: text;
            cursor: text;
            margin-right: 8px;
        }
    }

    .process-table-wrap {
        .control {
            display: flex;
            align-items: center;
            // justify-content: space-between;
        }
    }
}
</style>