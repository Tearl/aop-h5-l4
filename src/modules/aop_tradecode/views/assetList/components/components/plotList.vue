<template>
    <div class="aop_developer_serviceList">
        <div v-if="tabType == 'B'" class="preview_content_table">
            <div class="app_container">
                <div
                    class="app_select_block"
                    :style="{
                        height: mainHight,
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                    }"
                >
                    <div class="select_block">
                        <el-input
                            class="module_search"
                            size="mini"
                            placeholder="布局名称"
                            prefix-icon="el-icon-search"
                            v-model="filterText"
                        ></el-input>
                        <div class="tree_block" :style="{ height: mainHight }" @scroll="beforeScroll">
                            <el-menu
                                class="el-menu-vertical-demo2"
                                :default-active="leftContDefault"
                            >
                                <el-menu-item
                                    :index="item.itemIndex"
                                    v-for="(item, index) in treeData"
                                    :key="index"
                                    @click="changesubPage(item)"
                                >
                                    <i></i>
                                    <span slot="title">{{ item.layoutName }}</span>
                                </el-menu-item>
                            </el-menu>
                        </div>
                    </div>
                    <div class="preview_block" :style="{ height: mainHight }">
                        <ListTableA
                            :tableA="table1"
                            :handleSizeChange1="handleSizeChange1"
                            :currentPage1="formSearch.currentPage1"
                            :pageSize1="formSearch.pageSize1"
                            :total1="formSearch.total1"
                            @searchSubmit="searchSubmit"
                            @resetSearch="resetSearch"
                            :formSearch="formSearch"
                            :rightCheckList="rightCheckList"
                            :oldrightCheckList="oldrightCheckList"
                            :removerightCheckList="removerightCheckList"
                            :contentShow="visibleShow"
                            @checkList="checkList"
                            @handleCurrentChange1="handleCurrentChange1"
                        >
                        </ListTableA>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import ListTableA from "./plot_content.vue";
import debounce from '@m/core/utils/debounce.js';
export default {
    mixins: [mixin],
    components: {
        ListTableA,
    },
    props: {
        tabType: {
            type: String,
            default: () => "",
        },
        formData: {
            type: Object,
            default: () => ({}),
        },
        rightCheckList: {
            type: Array,
            default: () => [],
        },
        oldrightCheckList: {
            type: Array,
            default: () => [],
        },
        tableData: {
            type: Array,
            default: () => [],
        },
        visibleShow: {
            type: Boolean,
            default: false,
        },
        removerightCheckList:{
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            table1: [],
            filterList: [],
            formSearch: {
                txNm: "",
                txCd: "",
                currentPage1: 1,
                pageSize1: 10,
                total1: 0,
            },
            // 列表数据
            listPage: 1,
            listTotal: 0,
            mainHight: "",
            filterText: "",
            leftContDefault:'1-1',
            checkItem:{},
            // tree
            treeData: [],
            arr1:[],

            initFinish: false,
        };
    },
    methods: {
        // 弹窗搜索
        searchSubmit(type) {
            this.getBusinessList(this.checkItem);
        },
        // 重置搜
        resetSearch(type) {
            this.formSearch = {
                txNm: "",
                txCd: "",
                currentPage1: 1,
                pageSize1: 10,
            };
            this.checkItem = this.treeData[0];
            this.getBusinessList(this.checkItem);
        },
        // 交易列表
        handleSizeChange1(val) {
            this.formSearch.pageSize1 = val;
            this.getBusinessList(this.checkItem);
        },
        handleCurrentChange1(val) {
            this.formSearch.currentPage1 = val;
            this.getBusinessList(this.checkItem);
        },
        // 列表多选
        checkList(e) {
            this.$emit("checkListB", e);
        },
        // 查询布局关联交互列表
        async getBusinessList(row) {
            const params = {
                admiId: row.admiId,
                currentPage: this.formSearch.currentPage1,
                eleLayId: row.layoutId,
                isolateWorkspace: row.isolateWorkspace,
                modelVersion: row.modelVersion,
                name: this.formSearch.txNm,
                interfaceId: this.formSearch.txCd,
                turnPageShowNum: this.formSearch.pageSize1,
                type: "01", // 00要素 01页面

            }
            const res = await this.rpc.assetList.eventList(params)
            this.table1 = res.list || [];
            this.formSearch.total1 = Number(res.turnPageTotalNum);
        },
        scrollHeader(op){
            let scrollTop = op.target.scrollTop;
            if(scrollTop>40 && this.listTotal>this.treeData.length){
                this.initFinish = false;
                this.listPage++
                this.getElementList()
            }
        },
        beforeScroll: debounce(function(eve){
            this.scrollHeader(eve)
        },300),
        // 左侧布局列表
        async getElementList(row) {
            if (this.initFinish) return;
            let params = {
                isolateWorkspace: "C3", //开发工作台的场景是写死C3
                admiId: this.formData.assetFnctNo, // 修正功能编号 非活动编号this.formData.fnctNo
                // modelVersion: this.formData.asgntNo,
                currentPage: this.listPage, //当前页
                turnPageShowNum: 99, //当前页数量
            };
            let res = await this.rpc.assetList.getLyoutList(params);
            if (Array.isArray(res.list) && res.list.length) {
                const list1 = res.list.map((i,index) => {
                    return {
                        id: index + 1,
                        itemIndex: '1-' + '' + (index +1),
                        isClick: false,
                        ...i,
                    };
                });
                const arrList = [...this.treeData, ...list1];
                this.treeData = JSON.parse(JSON.stringify(arrList));
                this.arr1 = JSON.parse(JSON.stringify(arrList));
                this.listTotal = Number(res.turnPageTotalNum);
                this.changesubPage(this.treeData[0])
                this.initFinish = true;
            }
        },
        changesubPage(pop) {
            const name = pop.title;
            this.subTabname = name;
            this.leftContDefault = pop.itemIndex;
            this.checkItem = pop;
            this.getBusinessList(pop)
        },
    },
    created() {
        this.queryParams = this.$route.query;
        this.mainHight = document.documentElement.clientHeight - 308 + "px";
    },
    mounted() {
    },
    watch: {
        filterText(val) {
            if(val){
                this.treeData = this.treeData.filter((item)=>item.layoutName.indexOf(val) != -1);
            }else{
                this.treeData = this.arr1;
            }
        },
        'tabType':{
            handler(newVal, oldVal) {
                // console.log('初始化弹窗',newVal)
                if(newVal){
                    this.$nextTick(()=>{
                        this.getElementList()
                    })
                }
            },
            deep: true,
            immediate: true,
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_serviceList {
    width: 100%;
    .preview_content_table {
        color: #131313;
        .app_container {
            width:100%;
            max-height: calc(100vh - 296px);
            min-height: calc(100vh - 296px);
        }
        .app_select_block::-webkit-scrollbar {
            display: none;
        }
        .app_select_block {
            width: 100%;
            display: flex;
            max-height: calc(100vh - 296px);
            min-height: calc(100vh - 296px);
            .select_block::-webkit-scrollbar {
                display: none;
            }
            .select_block {
                background: #ffffff;
                width: 240px;
                padding: 0 16px 16px;
                border-right: 1px solid #eeeeee;
                h3{
                    width:100%;
                    font-size:16px;
                    color:#111111;
                    font-weight:600;
                    line-height: 54px;
                    margin-left:16px;
                }
                @include flex(column, flex-start, center);
                .module_search {
                    width: 208px;
                    border-radius: 2px;
                }
                .tree_block::-webkit-scrollbar {
                    display: none;
                }
                .tree_block {
                    width: 208px;
                    margin-top: 12px;
                    overflow-y: scroll;
                    .el-menu-vertical-demo2 {
                        width: 100%;
                        font-family: "PingFang SC";
                        border-right:none !important;
                        .el-menu-item {
                            width: 228px;
                            margin: 6px 5px 0 5px;
                            height: 34px;
                            line-height: 34px;
                            border-radius: 2px;
                            padding: 0 0 !important;
                            display: flex;
                            align-items: center;
                            span {
                                font-size: 14px;
                                color: #333333;
                                line-height: 34px;
                            }
                            i{
                                display: block;
                                width: 16px;
                                height: 16px;
                                margin-right: 2px;
                                background-image: url(~@m/assets/images/page.png);
                                background-size: 100% 100%;
                            }
                        }
                        .el-menu-item.is-active {
                            color: #358aff !important;
                            background: #f0f5ff !important;
                            width: 228px;
                            margin: 6px 5px 0 5px;
                            border-radius: 2px;
                            height: 34px;
                            line-height: 34px;
                            span {
                                color: #358aff !important;
                                line-height: 34px;
                            }
                            i{
                                width: 16px;
                                background-image: url(~@m/assets/images/page-active.png);
                                background-size: 100% 100%;
                            }
                        }
                    }
                    /deep/ .el-tree-node__content {
                        height: 40px;
                    }
                    h4{
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333333;
                        letter-spacing: 0;
                        line-height: 20px;
                        font-weight: 400;
                        margin-left:12px;
                        cursor: pointer;
                    }
                    .custom-tree-node {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        position: relative;
                    }
                    /deep/ .home_icon {
                        position: absolute;
                        right: 8px;
                        @include wh(18px, 18px);
                        opacity: 0;
                    }
                    /deep/ .selected_icon {
                        position: absolute;
                        right: 8px;
                        @include wh(18px, 18px);
                    }
                    /deep/ .node_selected {
                        opacity: 1 !important;
                    }
                    /deep/ .el-tree-node__content:hover {
                        .home_icon {
                            position: absolute;
                            right: 8px;
                            @include wh(18px, 18px);
                            opacity: 1;
                        }
                    }
                }
            }
            .preview_block {
                flex: 1;
                margin-left: 12px;
                overflow: scroll;
            }
            .preview_block::-webkit-scrollbar {
                display: none;
            }
        }
    }
}
</style>
