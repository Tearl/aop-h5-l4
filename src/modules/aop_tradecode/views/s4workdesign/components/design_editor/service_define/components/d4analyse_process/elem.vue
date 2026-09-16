<template>
  <div class="aop_tradecode_comps_d4analyse_process_elem">
    <div class="elem_box">
      <div
        class="elem_item"
        :class="{ hidden: !elemItemStatus[0].visible }"
        :style="{
          maxHeight: getElemItemMaxHeight(0),
          minHeight: getElemItemMinHeight(0),
        }"
      >
        <div class="elem_item_title tabs">
          <div class="top_tab_title" v-if="asideActive == '2'">接口列表</div>
        </div>
        <transition name="fade">
          <!-- 业务交易列表 -->
          <!-- 业务接口列表 -->
          <template v-if="asideActive == '2'">
            <div class="elem_item_content" ref="ul4bScroll" v-show="elemItemStatus[0].visible">
              <div class="elem_search flex">
                <el-input
                  v-model="d4bNm"
                  clearable
                  placeholder="输入名称"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search('d4b')"
                >
                  <i class="el-icon-search" slot="prefix" @click="search('d4b')"> </i>
                </el-input>
                <div class="btn_list" v-if="!isDisabled && $route.query.displayType != '01'">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'新建接口'"
                      placement="top"
                    >
                     <i class="el-icon-plus" @click="addInterface('d4b')"></i>
                    </el-tooltip>
                </div>
              </div>

              <ul class="service_menu_list" v-if="d4bSvcList.length > 0">
                <li
                  class="list_item"
                  :class="{ active: currentD4bObj.svcId == item.svcId }"
                  v-for="item in d4bSvcList"
                  :key="item.svcId"
                  @click="d4bServClick(item)"
                >
                  <div class="text_area">
                    <span
                      class="status"
                      :class="{
                        unpublish: item.svcSts == '0',
                        publishing: item.svcSts == '2',
                        completed: item.svcSts == '1',
                      }"
                    >
                    {{ item.svcSts | aiStu }}
                    </span>
                    <span class="list_item_title">
                        {{ item.svcNm }}
                    </span>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.svcNm"
                      placement="top"
                      v-if="item.svcNm.length>14"
                    >
                      <span
                       class="list_item_title"
                        >...</span>
                    </el-tooltip>
                  </div>
                  <div class="endSeting" v-if="!isDisabled && $route.query.displayType != '01'">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'删除'"
                      placement="top"
                    >
                    <i
                        class="el-icon-delete d4tipBtn"
                        @click.stop="del(item,'d4b')"
                      ></i>
                      </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'提交设计'"
                      placement="top"
                    >
                      <i
                        class="el-icon-check d4tipBtn"
                        @click.stop="changeOne(item,'finneshed','d4b')"
                        v-if="item.svcSts == '0' && item.srcFnctFlg=='1'"
                      ></i>
                      </el-tooltip>
                      <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'重新设计'"
                      placement="top"
                    >
                      <i
                        class="el-icon-refresh-left d4tipBtn"
                        @click.stop="changeOne(item,'reback','d4b')"
                        v-if="item.svcSts == '1' && item.srcFnctFlg=='1'"
                      ></i>
                      </el-tooltip>
                      <!--  -->
                  </div>
                </li>
              </ul>
              <div v-else class="no_data">
                <div>暂无数据</div>
              </div>
            </div>
          </template>
        </transition>
      </div>
    </div>
    <!-- 选择接口实现 -->
    <InterfaceList
        :visibleShow="visibleShowService"
        :dialogTitle="dialogTitle"
        :tableData="service4BList"
        :detailInfo="detailInfo"
        :formB="queryDetail"
        :key="'4'"
        @closeDialog="closeDialog"
        :showServiceTyp="showServiceType"
        name="InterfaceList"
        ></InterfaceList>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import Table from "@m/core/components/page_table";
import InterfaceList from "../service_detail/components/add_service"; // 选择接口实现

import { unduplicated } from "@m/utils/array";
import filters from "@m/utils/filters";
import {
  setSessionStorage,
  getSessionStorage,
  getLocalStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  name: "elem",
  components: {
    PageDialog,
    SearchTop,
    Table,
    InterfaceList,
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
    currentR4bObj: {
      type: Object,
      default: () => ({}),
    },
    d4bSvcList: {
      type: Array,
      default: () => [],
    },
    r4bSvcList: {
      type: Array,
      default: () => [],
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    jobNo: {
      type: String,
      default: () => "",
    },
    isolateWorkspace: {
      type: String,
      default: () => "",
    },
    assetFnctNo: {
      type: String,
      default: () => "",
    },
    asideActive: {
      type: String,
      default: () => "1",
    },
    d4bScrollTop: {
        type: Number,
      default: () => 0,
    }
  },
  data() {
    return {
      data: [],
      //服务组件数据列表
      cpntList: [],
      // s4b交易名称搜索
      d4bNm: "",
      // r4b服务名称搜索
      r4bNm: "",
      // 所属应用下拉框
      appList: [],
      // 所属应用id
      aaId: "",
      defaultActive: "业务交易", // 废弃用 asideActive 替换
      // 控制菜单状态的数组
      elemItemStatus: [
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "55%",
          minHeight: "55%",
        },
        {
          visible: true,
          isFixed: true,
          fixedOnUrl: require("@m/assets/images/icon_fixed_on.png"),
          fixedOffUrl: require("@m/assets/images/icon_fixed_off.png"),
          maxHeight: "45%",
          minHeight: "45%",
        },
      ],
      currentD4bSvcId: "",

      // 实现接口
      visibleShowService: false, //接口添加弹框
      dialogTitle: "", //接口添加弹框标题
      service4BList:[],
      showServiceType:'changeSvr',
      showServiceData:{},

      interD4bObj:{},
      interR4bObj:{},
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.init();
  },
  computed: {
    isDisabled() {
      return this.$route.query.pageMode === 'preview'
    },
  },
  methods: {
    //初始化
    init() {
        if(this.asideActive == '1') {
            this.$emit("elemTabClick", '业务交易','1');
        } else if (this.asideActive == '2') {
            this.$emit("elemTabClick", '接口列表','2');
        }
    },
    search(e) {
      if (e == "r4b") {
        this.$emit("getR4bServiceList", this.r4bNm);
      } else {
        this.$emit("getD4bServiceList", this.d4bNm);
      }
    },
    d4bServClick(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.currentD4bSvcId = e.txId;
        setSessionStorage('svcId', e.svcId)
        this.$emit("d4bServClick", e);
      }, 300);
    },
    r4bServClick(e) {
      this.currentR4bObj = e;
      this.$emit("r4bServClick", e);
    },
    initData() {
      const aaNameList = unduplicated(this.cpntList, "aaName");
      aaNameList.forEach((item) => {
        this.data.push({ name: item.aaName, list: [] });
      });
      this.data.forEach((i) => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.push({ name: item.grpgNm, list: [] });
          }
        });
        i.list = unduplicated(i.list, "name");
      });
      this.data.forEach((i) => {
        this.cpntList.forEach((item, index) => {
          if (i.name == item.aaName) {
            i.list.forEach((j) => {
              if (j.name == item.grpgNm) {
                j.list.push(item);
              }
            });
          }
        });
      });
    },
    // 双击左侧菜单标题栏时触发
    handleDblclick(i) {
      if (this.elemItemStatus[i].isFixed) return;
      this.elemItemStatus.forEach((item, index) => {
        if (index == i) {
          if (!item.isFixed) item.visible = !item.visible;
        } else {
          if (!item.isFixed) item.visible = false;
        }
      });
      console.log("handleDblclick", i);
    },
    // 点击固定按钮
    fixedIconClick(i) {
      console.log("fixedIconClick");
      this.$set(
        this.elemItemStatus[i],
        "isFixed",
        !this.elemItemStatus[i].isFixed
      );
    },
    // 获取菜单项展开后的最大高度
    getElemItemMaxHeight(i) {
      if (this.elemItemStatus[i].maxHeight) {
        return this.elemItemStatus[i].maxHeight;
      } else {
        const visibleCount = this.elemItemStatus.reduce((prev, item) => {
          return item.visible ? prev + 1 : prev;
        }, 0);

        if (this.elemItemStatus[i].visible) {
          return visibleCount == 1
            ? `calc(${100 / visibleCount}% - ${
                (this.elemItemStatus.length - 1) * 50
              }px)`
            : `${100 / visibleCount}%`;
        } else {
          return "50px";
        }
      }
    },
    // 获取菜单项展开后的最小高度
    getElemItemMinHeight(i) {
      return this.elemItemStatus[i].minHeight;
    },
    tabClick(e,v) {
      this.$emit("elemTabClick", e,v);
    },
    addInterface(v) {
      // console.log("=---=-",this.fnctCd,this.jobNo,this.isolateWorkspace)
      this.$emit("addInterface",v,'s4addInterface');
    },
    handleCommand(command) {
        console.log(command,'command')
        if(command[0]=="change"){
            this.showServiceData = command[1];
            this.addserviceFace('changeSvr',command[1])
        } else if(command[0]=="none"){
            this.saveTradeAchieveSituation(command[1],'0')
        } else if(command[0]=="del"){
            this.del(command[1],'r4b')
        }
    },
    addserviceFace(type,data) {
      this.dialogTitle = "选择接口实现"
      this.showServiceType = type;
      this.visibleShowService = true;
    },
    closeDialog(type,data) {
      if(type=="close"){
        this.visibleShowService = false;
      } else {
        this.visibleShowService = false;
        this.saveTradeAchieveSituation(this.showServiceData,'1',data)
      }
    },
    async saveTradeAchieveSituation(data,type,nerarr){
        let title = type=='0'?'是否选择不实现该交易，交易名称为：':'是否选择实现该交易，交易名称为：'
        this.$confirm(title + data.txNm)
        .then(async () => {
            let obj = [];
            if(type=='1'){
                obj = nerarr.map((item)=>{
                    return{
                        fnctId: this.fnctCd || this.$route.query.fnctId,
                        txId: data.txId,
                        txNm: data.txNm,
                        achFlg: type, // 0-不实现;1-实现 当实现标志为1时，接口信息列表不能为空
                        ifId: item.svcId || '', // 接口Id
                        ifNm: item.svcNm ||'',
                    }
                })
            } else {
                obj = [{
                        fnctId: this.fnctCd || this.$route.query.fnctId,
                        txId: data.txId,
                        txNm: data.txNm,
                        achFlg: type, // 0-不实现;1-实现 当实现标志为1时，接口信息列表不能为空
                        ifId: '', // 接口id
                        ifNm: '',
                    }]
            }
            let params = {
                bizTradeAchieveSituationList: obj
            };
            let res = await this.rpc.s4design.saveTradeAchieveSituation(params);
            this.rpc.s4design.addFuntionJobCommitFlow({
              fnctId: this.$route.query.fnctId,
              jobTpCd: 'C4',
            })
            console.log('关系绑定',res)
            this.$notify({
                title: "成功",
                message: "修改成功",
                duration: 2000,
                type: "success",
            });
            this.$emit("getR4bServiceList", this.r4bNm);
        })
        .catch(() => {});
    },
    async changeOne(data,type,name) {
      console.log("修改业务接口状态",data);
      if(data.srcFnctFlg=='0'){return}
      let state = type=='reback'?'0':(type=='finneshed'?'1':'0');
      this.$confirm("是否修改该接口状态，接口名称名称为" + data.svcNm)
        .then(async () => {
          let params = {
            apiId: data.svcId || data.txId,
            state: state, //0-设计中;1-已完成
          };
          let res = await this.rpc.s4design.apiInfoStateModify(params);
          this.rpc.s4design.addFuntionJobCommitFlow({
            fnctId: this.$route.query.fnctId,
            jobTpCd: 'C4',
          })
          this.$notify({
            title: "成功",
            message: "修改成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("delInterface");
        })
        .catch(() => {});
    },
    async del(data,type) {
        if(type=='d4b'){
            this.$confirm("是否删除该接口，接口名称名称为" + data.svcNm)
            .then(async () => {
            let params = {
                fnctId: this.assetFnctNo,
                jobNo: this.jobNo,
                isolateWorkspace: this.isolateWorkspace,
                svcSeq: data.svcSeq,
                apiId: data.svcId,
            };
            let res = await this.rpc.newEditor.delService(params);
            this.rpc.s4design.addFuntionJobCommitFlow({
              fnctId: this.$route.query.fnctId,
              jobTpCd: 'C4',
            })
            this.$notify({
                title: "成功",
                message: "删除成功",
                duration: 2000,
                type: "success",
            });
            this.$emit("delInterface");
            })
            .catch(() => {});
        } else if(type =='r4b'){
            console.log("删除交易");
        }

    },
  },
  filters: {
    ...filters,
    aiStuType(v){
        if(!v || v==''){
            return '待实现'
        }
        if(v == '0'){
            return '不实现'
        }
        if(v == '1'){
            return '实现'
        }
    }
  },
  watch:{
    // d4bSvcList() {
    //   const svcId = getSessionStorage('svcId')
    //   const e = this.d4bSvcList.find((item) => {
    //     return item.svcId === svcId
    //   })
    //   if (e) {
    //     this.d4bServClick(e)
    //   }
    // },
    'asideActive':{
        handler(newVal,oldVal){
            this.$nextTick(()=>{
                if(newVal == '1') {
                    this.$emit("elemTabClick", '业务交易','1');
                } else if (newVal == '2') {
                    this.$emit("elemTabClick", '接口列表','2');
                }
            })
        },
        deep: true,
        immediate: true,
    },
    "d4bScrollTop":{
        handler(newVal,oldVal){
            this.$nextTick(()=>{
                if(newVal) {
                    this.$refs.ul4bScroll.scrollTo(newVal, newVal);
                }
            })
        },
        deep: true,
        immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_d4analyse_process_elem {
  .elem_box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el_menu_div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 70%;
      height: 20px;
      line-height: 20px;
      color: #000;
    }
    .underLine {
      border-bottom: 1px solid $pri_br_color;
    }
  }
  .elem_item {
    // flex: 1;
    max-height: 50%;
    font-size: 12px;
    .elem_item_title {
      // background: #f7f7f7;
      .top_tab_title{
        font-size: 14px;
        height:36px;
        line-height: 36px;
        font-weight: 600;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.text {
        display: flex;
        align-items: center;
        padding-left: 10px;
        height: 50px;
        border-top: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        user-select: none;
        box-shadow: 0 1px 10px 0 #e7e7e7;
        font-weight: $font_weight_600;
        // &.no_border_top {
        //   border-top: none;
        // }
      }
      &.tabs {
        display: flex;
        // justify-content: space-around;
        width: 100%;
        border-bottom: 1px solid #e7e7e7;
        user-select: none;
        // ::v-deep .el-tabs__active-bar {
        //   width: 50px !important;
        // }
        // box-shadow: 0 1px 10px 0 #e7e7e7;
        ::v-deep .el-tabs__nav-wrap::after {
          background-color: $base_white;
        }
        ::v-deep .el-tabs__header {
          margin: 0;
          .el-tabs__item {
            height: 50px;
            line-height: 50px;
            font-size: 12px;
            padding: 0 15px;
            font-family: $font_medium;
            letter-spacing: 0;
            &.is-active {
              font-weight: $font_weight_600;
            }
          }
        }
        ::v-deep .el-tabs__content {
          display: none;
        }
      }
      .icon_area {
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
      }
    }
    .elem_item_content {
      @include scrollbar;
      height: calc(100vh - 108px);
      overflow-y: auto;
      transition-duration: 0.5s;
      padding-bottom: 30px;
      min-height: 200px;
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
          flex-wrap: nowrap;
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
              &.wating {
                color: #ffffff;
                background: #f2081f;
                // border: 0.5px solid #36d542;
              }
              //已完成
              &.completed {
                background: #409eff;
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
              //已完成
              &.completed {
                background: #ff40f5;
                color: #ffffff;
              }
            }
            .list_item_title {
              white-space: nowrap;
            //   text-overflow: ellipsis;
              overflow: hidden;
              max-width: 150px;
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
        //   &:hover {
        //     .list_item_icon {
        //       &.delete {
        //         display: inline-block;
        //       }
        //     }
        //   }
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
        // height: 100%;
        color: #000000;
        font-size: 14px;
      }
      .ht100 {
        padding: 40px;
      }
      // &.pdt10{
      //   margin-top: 10px;
      // }
    }
    &.hidden {
      .elem_item_title {
        background: $base_white;
      }
    }
  }
  .el-menu {
    // 隐藏滚动条
    // &::-webkit-scrollbar {
    //   width: 0 !important;
    // }
    // height: calc(100vh - 190px);
    overflow-y: auto;
    border: 0px;
    ::v-deep .el-submenu__title {
      height: 40px;
      line-height: 40px;
      font-weight: $font_weight_600;
      font-family: PingFangSC-Regular;
      font-size: 12px;
    }
    .el_menu_img {
      width: 9.95px;
      height: 9.98px;
      margin-right: 20px;
      margin-top: 4px;
    }
    ::v-deep .el-submenu__title:hover {
      background-color: #fff;
    }
    ::v-deep .el-menu-item-group__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      letter-spacing: 0;
    }
  }
  .fade-enter-active {
    transition: all 0.2s ease;
  }
  .fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .fade-enter,
  .fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
  }
  .logo {
    width: 10%;
  }
  .btn_list {
    i {
      cursor: pointer;
    }
  }
}
</style>
