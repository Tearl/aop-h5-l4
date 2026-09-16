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
        <!-- <div class="elem_item_title tabs" @dblclick="handleDblclick('0')">
          <el-tabs v-model="defaultActive" @tab-click="tabClick">
            <el-tab-pane label="接口列表" name="接口列表"></el-tab-pane>
            <el-tab-pane label="业务4b列表" name="业务4b列表"></el-tab-pane>
          </el-tabs>
        </div> -->
        <div class="elem_item_title tabs">
          <div class="top_tab_title" v-if="asideActive == '1'">业务4b列表</div>
          <div class="top_tab_title" v-if="asideActive == '2'">接口列表</div>
        </div>
        <transition name="fade">
          <template v-if="asideActive == '2'">
            <div class="elem_item_content" v-show="elemItemStatus[0].visible">
              <div class="elem_search flex">
                <el-input
                  v-model="d4bNm"
                  clearable
                  placeholder="输入名称"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search"
                >
                  <i class="el-icon-search" slot="prefix" @click="search"> </i>
                </el-input>
                <!-- <div class="btn_list">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="'新建接口'"
                      placement="top"
                    >
                    <i class="el-icon-plus" @click="addInterface"></i>
                  </el-tooltip>
                </div> -->
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
                    <span class="list_item_title">{{ item.svcNm }}</span>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.svcNm"
                      placement="top"
                      v-if="item.svcNm.length >14"
                    >
                      <span class="list_item_title">
                        ...
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="icon_area">
                    <el-tooltip effect="dark" :content="'删除'" placement="top">
                      <i
                        class="el-icon-delete list_item_icon delete"
                        @click.stop="del(item)"
                      ></i>
                    </el-tooltip>
                  </div>
                </li>
              </ul>
              <div v-else class="no_data">
                <div>暂无数据</div>
              </div>
            </div>
          </template>
          <template v-if="asideActive == '1'">
            <div class="elem_item_content" v-show="elemItemStatus[0].visible">
              <!-- <div class="elem_search flex">
                <el-input
                  v-model="r4bNm"
                  clearable
                  placeholder="输入名称或编号"
                  size="small"
                  class="elem_search_sel"
                  @keyup.enter.native="search('r4b')"
                >
                  <i
                    class="el-icon-search"
                    slot="prefix"
                    @click="search('r4b')"
                  >
                  </i>
                </el-input>
              </div> -->

              <ul class="service_menu_list" v-if="r4bSvcList.length > 0">
                <li
                  class="list_item"
                  :class="{ active: currentR4bObj.apiId == item.apiId }"
                  v-for="item in r4bSvcList"
                  :key="item.svcId"
                  @click="r4bServClick(item)"
                >
                  <div class="text_area">
                    <!-- <span
                      class="status"
                      :class="{
                        unpublish: item.apiState == '0',
                        publishing: item.apiState == '2',
                        completed: item.apiState == '1',
                      }"
                    >
                      {{ item.apiState | aiStu }}
                    </span> -->
                    <span class="list_item_title r4b">{{ item.apiName }}</span>
                  </div>
                  <!-- <div class="icon_area" v-if="!noEdit">
                    <el-tooltip
                      v-if="item.bindFlg == 0"
                      effect="dark"
                      :content="'关联'"
                      placement="top"
                    >
                      <i
                        class="el-icon-connection list_item_icon delete"
                        @click.stop="connect(item)"
                      ></i>
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      effect="dark"
                      :content="'取消关联'"
                      placement="top"
                    >
                      <i
                        class="el-icon-link list_item_icon delete"
                        @click.stop="cancelConnect(item)"
                      ></i>
                    </el-tooltip>
                  </div> -->
                </li>
              </ul>
              <div v-else class="no_data ht100">
                <div>暂无数据</div>
              </div>
            </div>
          </template>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import Table from "@m/core/components/page_table";

import { unduplicated } from "@m/utils/array";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  name: "elem",
  components: {
    PageDialog,
    SearchTop,
    Table,
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
      default: () => "",
    },
  },
  data() {
    return {
      data: [],
      //服务组件数据列表
      cpntList: [],
      // d4b服务名称搜索
      d4bNm: "",
      // r4b服务名称搜索
      r4bNm: "",
      // 所属应用下拉框
      appList: [],
      // 所属应用id
      aaId: "",
      defaultActive: "业务4b列表",
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
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
        if(this.asideActive == '1') {
            this.$emit("elemTabClick", '业务4b列表','1');
        } else if (this.asideActive == '2') {
            this.$emit("elemTabClick", '接口列表','2');
        }
    },
    search(e) {
      console.log(this.d4bSvcList);
      if (e == "r4b") {
        this.$emit("getR4bServiceList", this.r4bNm);
        // this.getR4bServiceList()
      } else {
        // console.log(this.d4bNm);
        this.$emit("getD4bServiceList", this.d4bNm);
        // this.getData();
      }
    },
    d4bServClick(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.currentD4bSvcId = e.svcId;
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
      // if (index == 0) this.elemItemStatus[0].visible = !this.elemItemStatus[0].visible
      // if (index == 1) this.elemItemStatus[1].visible = !this.elemItemStatus[1].visible
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
      // this.elemItemStatus[i].isFixed = !this.elemItemStatus[i].isFixed
      // this.$forceUpdate
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
    tabClick(e) {
      this.$emit("elemTabClick", e.name);
    },
    addInterface() {
      console.log("添加接口");
      // console.log("=---=-",this.fnctCd,this.jobNo,this.isolateWorkspace)
      this.$emit("addInterface");
    },
    async del(data) {
      console.log("删除接口");
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
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("delInterface");
        })
        .catch(() => {});
    },
  },
  filters: {
    ...filters,
  },
  watch:{
    'asideActive':{
        handler(newVal,oldVal){
            this.$nextTick(()=>{
                if(newVal == '1') {
                    this.$emit("elemTabClick", '业务4b列表','1');
                } else if (newVal == '2') {
                    this.$emit("elemTabClick", '接口列表','2');
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
        border-bottom: 2px solid #dcdfe6;
        user-select: none;
        // ::v-deep .el-tabs__active-bar {
        //   width: 50px !important;
        // }
        box-shadow: 0 1px 10px 0 #e7e7e7;
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
      // height: calc(100% - -50px);
      height: calc(100vh - 108px);
      overflow-y: auto;
      transition-duration: 0.5s;
      // padding: 8px 10px;
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
          // margin-bottom: 6px;
          // white-space: nowrap;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          padding: 4px 6px;
          &:hover,
          &.active {
            background: #eaf1ff;
            .text_area .list_item_title {
              color: $theme_color;
              font-weight: 600;
            }
          }
          .text_area {
            display: flex;
            .icon {
              margin-right: 4px;
            }
            .status {
              padding: 0px 5px;
              transform: scale(0.8);
              min-width: 55px;
              // min-width: 45px;
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
            }
            .list_item_title {
              white-space: nowrap;
            //   text-overflow: ellipsis;
              overflow: hidden;
              // padding: 0 10px;
              max-width: 160px;
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
          &:hover {
            .list_item_icon {
              &.delete {
                display: inline-block;
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
