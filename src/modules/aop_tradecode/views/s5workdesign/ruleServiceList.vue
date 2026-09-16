<template>
    <div class="aop_tradecode_s5_rule_service_list">
        <!-- 顶部菜单 -->
        <AsNav @navBack="navBack" :showBackIcon="false">
                <div slot="textProps">系统设计-服务设计</div>
                <!-- <div slot="radioProps">
                    <el-button type="text" @click="topMenuBtnClick('1')">系统设计-前端设计预览</el-button>
                    <el-button type="text" @click="topMenuBtnClick('2')">系统设计-后端设计S4预览</el-button>
                </div> -->
                <div slot="btnProps" v-if="!isRead">
                    <el-button type="danger" plain @click="topMenuBtnClick('3')">服务设计提交</el-button>
                </div>
            </AsNav>
        <div class="aop_endentry_rule_service_list">
            <div class="left_container">
                <div class="tab_item" v-for="(item, index) in leftMenus" :key="item.id" :class="tabIndex == index?'tab_item_blue':''" @click="handleClick(index)">
                    {{ item.title }}
                </div>
            </div>
            <div class="middle_container" v-if="tabIndex === 0">
                <div class="title">
                    规则列表
                </div>
                <div class="elem_item_content" >
                    <ul class="service_menu_list" v-if="s5SvcList.length > 0">
                        <li
                            class="list_item"
                            :class="{ active: currentS5bObj.apiId == item.ruleId }"
                            v-for="item in s5SvcList"
                            :key="item.ruleId"
                            @click.stop="s5ServClick(item)"
                            >
                            <div class="text_area">
                                <span
                                class="status"
                                :class="{
                                    unpublish: item.achFlg == '0',
                                    publishing: item.achFlg == '1',
                                    nopublishing: item.achFlg == '2',
                                }"
                                >
                                {{ item.achFlg | aiStuType }}
                                </span>
                                <span
                                class="statuscircle"
                                :class="{
                                    publishing: item.ruleSrcCd == 'C4',
                                    unpublish: item.ruleSrcCd == 'D2',
                                }"
                                >
                                {{ item.ruleSrcCd}}
                                </span>
                                <span class="list_item_title">
                                    {{ item.ruleNm }}
                                </span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="item.ruleNm"
                                    placement="top"
                                    v-if="item.ruleNm.length >8"
                                    >
                                    <span class="list_item_title">
                                        ...
                                    </span>
                                </el-tooltip>
                            </div>
                            <div class="endSeting">
                                 <el-dropdown @command="handleCommand">
                                  <i
                                    class="el-icon-s-tools seting"
                                   ></i>
                                    <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="item">绑定S5</el-dropdown-item>
                                    </el-dropdown-menu>
                                 </el-dropdown>
                                </div>
                        </li>
                    </ul>
                    <div v-else class="no_data">
                        <div>暂无数据</div>
                    </div>
                </div>

            </div>
            <div class="right_container">
                <ruleDetailInfo  v-if="tabIndex == 0" :isRead="isRead" :basicData="currentS5bObj" :s5ServiceInfoList="s5ServiceInfoList"></ruleDetailInfo>
                <ruleList v-if="tabIndex == 1" :isRead="isRead"></ruleList>
            </div>

        </div>
        <!-- 设计提交检验2024年1月22日 -->
        <CheckSystemDesign ref="checkSystemDesignRef" @checkS5SystemDesign="checkS5SystemDesign"></CheckSystemDesign>
    </div>

</template>
<script>
import mixin from "@m/core/mixin";
import ruleDetailInfo from './components/ruleDetail.vue';
import ruleList from './components/ruleList.vue';
import AsNav from "./components/d4analyse_nav";
import CheckSystemDesign from "./components/check_systemDesign";
import filters from "@m/utils/filters";

export default {
    mixins: [mixin],
    components: {
        ruleDetailInfo,
        ruleList,
        AsNav,
        CheckSystemDesign,
    },
    data() {
        return {
            tabIndex: 0,
            // 列表某项点击数据
            currentS5bObj: {},
            s5ServiceInfoList:[], // 规则下的服务列表
            s5SvcList:[], // 规则列表
            leftMenus:[{
                id:1,
                title:'业务规则',
            },{
                id:2,
                title:'服务设计',
            }],
            isRead: false,
        };
    },
    computed: {
    },
    watch: {

    },
    filters: {
        ...filters,
        aiStuType(v){
            if(!v){
                return '-'
            }
            if(v == '0'){
                return '未实现'
            }
            if(v == '1'){
                return '已实现'
            }
            if(v == '2'){
                return '不实现'
            }
        }
    },
    methods: {
        init(){
            this.queryFunctionRuleListS5()
        },
        handleClick(index) {
            this.tabIndex = index;
            if(index == 0) {
                this.queryFunctionRuleListS5()
            } else if(index ==1){

            }
        },
        getTabClass(index) {
            if (index === this.tabIndex) {
                return 'tab_item_blue'
            } else {
                return ''
            }
        },
        // 导航栏返回
        navBack(e) {
            this.navReturn = e;
            this.goRoute();
        },
        // 返回方法
        goRoute() {
            if (this.navReturn == "home") {
                this.$router.back();
            } else {
                this.$router.push(getSessionStorage("interfaceRouter"));
            }
        },
        topMenuBtnClick(num){
            if(num == '1'){
                // 系统设计-前端设计预览
            } else if(num == '2'){
                // 系统设计-后端设计S5预览
            } else if(num == '3'){
                // S5设计提交
                this.checkS5SystemDesignResult();
                return;
                this.$confirm("确定要进行提交吗？", "", {
                    distinguishCancelAndClose: true,
                    center: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
                .then(() => {
                    this.submitSystemDesign()
                })
                .catch((action) => {
                    console.log(action)
                });
            }
        },
        async s5ServClick(data){
            console.log("data",data)
            // 单击列表
            let params = {
                apiId: data.ruleId,
            }
            let res = await this.rpc.s4design.queryTreeBaseInfo(params);
            this.currentS5bObj= res;
            this.s5ServiceInfoList = data.s5ServiceInfoList || [];
        },
        async checkS5SystemDesignResult() {
            const  res = await this.rpc.s4design.checkS5SystemDesignResult({
                fnctNo: this.assetFnctNo || this.$route.query.fnctId,
            })
            this.$refs.checkSystemDesignRef.showDialog(res);
        },
        //确认调用提交设计接口
        checkS5SystemDesign(){
            this.submitSystemDesign();
        },
        async submitSystemDesign(){ // 系统设计提交S5
            const params = {
                fnctId: this.assetFnctNo || this.$route.query.fnctId,
                submitTpCd: "03", // 01-上装设计;02-下装S4设计;03-下装S5设计
            };
            let res = await this.rpc.s4design.submitSystemDesign(params);
            this.$notify({
                title: "成功",
                message: "保存成功",
                duration: 2000,
                type: "success",
            });
            this.init()
        },
        // 查询规则列表==功能
        async queryFunctionRuleListS5(){
            const params = {
                fnctId: this.fnctId || this.$route.query.fnctId,
            };
            let res = await this.rpc.s4design.queryFunctionRuleListS5(params);
            let list = res.bizRuleInfoList || [];
            this.$nextTick(()=>{
                this.s5SvcList = list;
                if(list && list.length >0){
                    this.s5ServClick(list[0]);
                }
            })
        },
        handleCommand(command) {
            this.$router.push({
              path: "/aop_l5design/application/treeList",
              query: {
              domainNo: this.$route.query.beltLine,
              appNo: this.$route.query.appId,
              functionId: this.$route.query.fnctId,
          },
            })
    },
    },
    created(){
        let obj = this.$route.query || {};
        this.isRead = obj.pageMode==='preview';
        if(obj.currentActive){
            this.handleClick(obj.currentActive)
        } else {
            this.init();
        }
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_s5_rule_service_list{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .aop_endentry_rule_service_list {
        display: flex;
        height: 100%;
        overflow: hidden;
        .left_container {
            width: 40px;
            height: 100%;
            font-size: 14px;
            background: #fff;
            border-right: 1px solid #e6e6e6;
            overflow: hidden;
            .tab_item {
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                text-align: center;
                cursor: pointer;
                padding: 10px;
                border-bottom: 1px solid #e6e6e6;
            }
            .tab_item_blue {
                color: #358AFF;
                font-weight: bold;
            }
        }
        .el-menu-vertical-demo {
            width: 100%;
            .el-menu-item {
                width: 32px !important;
                height: 32px !important;
                margin: 8px 8px !important;
                padding: 0 0 !important;
                border-radius: 2px 2px;
                /deep/.el-tooltip {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    padding: 0px 0px !important;
                    img {
                        width: 20px !important;
                        height: 20px !important;
                    }
                }
            }
            .el-menu-item.is-active {
                color: #358aff !important;
                background: #f0f5ff !important;
                span {
                    font-size: 12px;
                    color: #358aff !important;
                    line-height: 56px;
                    margin-left: 4px;
                }
            }
        }
        .middle_container {
            width: 220px;
            height: calc(100vh - 50px);
            background: #fff;
            border: 1px solid #e6e6e6;
            overflow: hidden;
            .title {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 44px;
                padding: 0 16px;
                box-shadow: 0 1px 0.5px 0 #e7e7ee;
                max-width: 212px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 14px;
                color: #111111;
                letter-spacing: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                background: #fff;
            }
            .rule_list_item {
                display: flex;
                padding: 4px 6px;
                span {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    max-width: 150px;
                    height: 20px;
                    line-height: 20px;
                    color: #000;
                    cursor: pointer;
                    font-size: 13px;
                }
            }
            .success_color {
                background: $success_color;
                color: #fff;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 3px;
                margin-right: 5px;
                cursor: pointer;
            }
            .select_item {
                color: #358aff;
                background: #eaf1ff;
            }
            .elem_item_content {
                @include scrollbar;
                // height: calc(100% - -50px);
                height: calc(100vh - 108px);
                overflow-y: auto;
                transition-duration: 0.5s;
                // padding: 8px 10px;
                min-height: 200px;
                padding-bottom: 30px;
                .elem_search {
                    padding: 8px 10px;
                    overflow: hidden;
                    &.flex {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .add_icon {
                        margin-left: 5px;
                        cursor: pointer;
                        .el-icon-plus {
                        color: $theme_color;
                        font-weight: $font_weight_600;
                        font-size: 28px;
                        }
                        &.hidden {
                        visibility: hidden;
                        }
                    }
                    }
                }
                .elem_search_sel {
                    float: left;
                    ::v-deep .el-input__inner {
                    width: 220px;
                    height: 28px;
                    }
                    ::v-deep .el-input__icon {
                    line-height: 28px !important;
                    }
                    .el-icon-search {
                    line-height: 28px;
                    }
                }
                .elem_tips {
                    display: none;
                    position: absolute;
                    border-radius: $theme_radius;
                    padding: 10px 5px;
                    z-index: 2000;
                    font-size: 12px;
                    line-height: 1.2;
                    word-wrap: break-word;
                    background-color: $theme_color;
                    color: $base_white;
                    width: 192px;
                    left: 80px;
                    top: 70px;
                }
                .service_menu_list {
                    // margin-top: 8px;
                    .list_item {
                    font-size: 12px;
                    width: 100%;
                    // margin-bottom: 6px;
                    // white-space: nowrap;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    cursor: pointer;
                    padding: 4px 6px;
                    //   &:hover,
                    &.active {
                        background: #eaf1ff;
                        .text_area .list_item_title {
                        color: $theme_color;
                        font-weight: 600;
                        }
                    }
                    .endSeting{
                            flex: 1;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            .item {
                            width: 16px;
                            height: 16px;
                            margin-right: 8px;
                            cursor: pointer;
                            }
                            .seting{
                                font-size:12px;
                                color:#358aff;
                            }
                            .el-icon-arrow-down {
                                font-size: 12px!important;
                            }
                            .d4tipBtn{
                                margin-left:5px;
                            }
                        }
                    .text_area {
                        display: flex;
                        align-items: center;
                        .icon {
                        margin-right: 4px;
                        }
                        .status {
                        padding: 0px 5px;
                        transform: scale(0.8);
                        min-width: 55px;
                        line-height: 28px;
                        text-align: center;
                        // 新增
                        &.unpublish {
                            color: #ffffff;
                            background: #f59a23;
                            // border: 0.5px solid #ff5f5f;
                        }
                        // 已登记
                        &.publishing {
                            color: #ffffff;
                            background: #70b603;
                            // border: 0.5px solid #36d542;
                        }
                        //已完成
                        &.completed {
                            background: #409eff;
                            color: #ffffff;
                        }
                        &.nopublishing {
                            background: #fe4758;
                            color: #ffffff;
                        }
                        }
                        .statuscircle{
                            padding: 0px 5px;
                        transform: scale(0.8);
                        width: 28px;
                        height:28px;
                        border-radius:50% 50%;
                        text-align: center;
                        line-height: 28px;
                        // 新增
                        &.unpublish {
                            color: #ffffff;
                            background: #358aff;
                            // border: 0.5px solid #ff5f5f;
                        }
                        // 已登记
                        &.publishing {
                            color: #ffffff;
                            background: #3603b6;
                            // border: 0.5px solid #36d542;
                        }
                        &.nopublishing {
                            background: #fe4758;
                            color: #ffffff;
                        }
                        //已完成
                        &.completed {
                            background: #ff40f5;
                            color: #ffffff;
                        }
                        }
                        .list_item_title {
                        white-space: nowrap;
                        // text-overflow: ellipsis;
                        overflow: hidden;
                        // padding: 0 10px;
                        max-width: 95px;
                        height: 20px;
                        line-height: 20px;
                        color: #000;
                        cursor: pointer;
                        font-size: 13px;
                        &.r4b {
                            max-width: 220px;
                            padding: 0 10px;
                        }
                        }
                        .list_item_tag {
                        font-size: 12px;
                        padding: 0 3px;
                        border-radius: $theme_radius;
                        // margin-right: 4px;
                        transform: scale(0.7);
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        &.design {
                            color: #fff;
                            background: #358aff;
                            &.hidden {
                            visibility: hidden;
                            }
                        }
                        &.released {
                            color: $base_white;
                            background: #2ddaac;
                        }
                        &.outside,
                        &.inside {
                            color: #ff934b;
                            background: #fff4e5;
                            font-size: 14px;
                        }
                        &.new {
                            color: #fe6f79;
                            background: #ffeaec;
                            display: inline-block;
                            width: 42px;
                            font-size: 14px;
                        }
                        &.danger {
                            color: #fe6f79;
                            background: #ffeaec;
                            font-weight: 600;
                        }
                        }
                    }
                    .list_item_icon {
                        &.delete {
                        display: none;
                        // color: $danger_color;
                        cursor: pointer;
                        }
                    }
                    .icon_area {
                        font-size: 13px;
                    }
                    }
                }
                .function_info {
                    padding: 8px 10px;
                    li {
                    margin-bottom: 8px;
                    font-weight: $font_weight_600;
                    &.function_info_button {
                        text-align: center;
                    }
                    span {
                        font-weight: 400;
                    }
                    }
                }
                .no_data {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    margin-top: 10px;
                    color: #000000;
                    font-size: 14px;
                }
                .ht100 {
                    padding: 40px;
                }
                }
        }
        .right_container {
            width: auto;
            flex: 1;
            height: calc(100vh - 50px);
            background: #fff;
            overflow: scroll;
            .title {
                width: 140px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                color: #111111;
                background-color: #fff;
                padding: 0;
                font-weight: 600;
            }
        }
        .circle_item {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: red;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;


        }
    }
}
</style>
