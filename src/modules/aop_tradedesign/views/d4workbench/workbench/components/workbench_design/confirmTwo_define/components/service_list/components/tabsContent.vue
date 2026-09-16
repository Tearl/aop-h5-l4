<template>
  <div class="aop_tradedesign_dic_comps_tabs_content">
    <div class="contentComps">
      <div class="tabsComps">
        <!-- <div class="title">
          部册：<span>{{ text }}</span>
        </div> -->
        <!-- <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane
            v-for="(item, index) in tabsList"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs> -->
        <div class="tabs_content">
          <div class="list">
            <!-- 数据集 -->
            <div
              class="list_item"
              v-if="isShow"
              :class="widthChange ? 'widthChange' : ''"
            >
              <div class="list_title">
                <span>数据集（2）</span>
                <el-button
                  v-if="fourDesign == 'edit'"
                  type="text"
                  @click="add('dataSet')"
                  >新增数据集</el-button
                >
              </div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table" v-if="dataList.length > 0">
                  <div
                    class="table_item"
                    v-for="(item, index) in dataList"
                    @click.stop="clickChange(item, index, '0')"
                    :key="index"
                    :class="dataStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div class="left_status">
                        <el-tag
                          :type="item.status == '1' ? 'success' : 'danger'"
                          effect="Plain"
                          >{{ statusObj[item.status] }}</el-tag
                        >
                        <!-- <span :class="item.status == '0' ? 'statusRed' : 'statusGreen'"> {{ statusObj[item.status] }}</span> -->
                      </div>
                      <div class="left_title" :title="item.dataName">
                        {{ item.dataName }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div class="operate">
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item, 'read', '0')"
                        ></i>
                        <i
                          class="el-icon-edit-outline"
                          @click.stop="handleIconClick(item, 'mod', '0')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click.stop="handleIconClick(item, 'delete', '0')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分段 -->
            <div
              class="list_item subStn_scroll"
              v-if="piecewiseTrue"
              :class="widthChange ? 'widthChange' : ''"
            >
              <div class="list_title">
                <span>分段（{{ susStnCount }}）</span>
                <el-button
                  v-if="fourDesign == 'edit'"
                  type="text"
                  @click="add('subsection')"
                  >新增分段</el-button
                >
              </div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table" v-if="piecewiseList.length > 0">
                  <div
                    class="table_item"
                    v-for="(item, index) in piecewiseList"
                    @click.stop="clickChange(item, index, '1')"
                    :key="index"
                    :class="piecewiseStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div class="left_status">
                        <el-tag
                          :type="item.statusCd == '1' ? 'success' : 'danger'"
                          effect="Plain"
                          >{{ statusObj[item.statusCd] }}</el-tag
                        >
                        <!-- <span
                          :class="
                            item.status == '0' ? 'statusRed' : 'statusGreen'
                          "
                        >
                          {{ statusObj[item.status] }}</span
                        > -->
                      </div>
                      <div class="left_title" :title="item.dataSubstnNm">
                        {{ item.dataSubstnNm }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div class="operate">
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item, 'read', '1')"
                        ></i>
                        <i
                          class="el-icon-edit-outline"
                          @click.stop="handleIconClick(item, 'mod', '1')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click.stop="handleIconClick(item, 'delete', '1')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 字段 -->
            <div
              class="list_item field_scroll"
              :class="widthChange ? 'widthChange' : ''"
            >
              <div class="list_title">
                <span>字段（{{ fieldCount }}）</span>
                <el-button
                  v-if="fourDesign == 'edit'"
                  type="text"
                  @click="add('field')"
                  >新增字段</el-button
                >
              </div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table" v-if="fieldList.length > 0">
                  <div
                    class="table_item"
                    v-for="(item, index) in fieldList"
                    @click.stop="clickChange(item, index, '2')"
                    :key="index"
                    :class="{
                      item_active: fieldStyle == index,
                    }"
                  >
                    <div class="left_content">
                      <div class="left_status">
                        <el-tag
                          :type="item.statusCd == '1' ? 'success' : 'danger'"
                          effect="Plain"
                          >{{ statusObj[item.statusCd] }}</el-tag
                        >
                        <!-- <span
                          :class="
                            item.status == '0' ? 'statusRed' : 'statusGreen'
                          "
                        >
                          {{ statusObj[item.status] }}</span
                        > -->
                      </div>
                      <div class="left_title" :title="item.dictNm">
                        {{ item.dictNm }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div class="operate">
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item, 'read', '2')"
                        ></i>
                        <i
                          class="el-icon-edit-outline"
                          @click.stop="handleIconClick(item, 'mod', '2')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click.stop="handleIconClick(item, 'delete', '2')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                      </div>
                      <div class="right_title" v-if="fourDesign == 'choose'">
                        <el-checkbox
                          v-model="item.checked"
                          @change="checkChange($event, item)"
                        ></el-checkbox>
                      </div>
                      <div class="right_title" v-if="fourDesign != 'choose'">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- L5服务 -->
            <div
              class="list_item serv_scroll"
              :class="widthChange ? 'widthChange' : ''"
              v-if="serviceTrue"
            >
              <div class="list_title">
                <span>L5服务（{{ servCount }}）</span>
                <!-- <el-button
                  v-if="fourDesign != 'detail'"
                  type="text"
                  @click="add('service')"
                  >新增服务</el-button
                > -->
              </div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table" v-if="L5serviceList.length > 0">
                  <div
                    class="table_item"
                    v-for="(item, index) in L5serviceList"
                    @click.stop="clickChange(item, index, '3')"
                    :key="index"
                    :class="L5serviceStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div class="left_status">
                        <el-tag
                          :type="item.statusCd == '1' ? 'success' : 'danger'"
                          effect="Plain"
                          >{{ statusObj[item.statusCd] }}</el-tag
                        >
                        <!-- <span
                          :class="
                            item.status == '0' ? 'statusRed' : 'statusGreen'
                          "
                        >
                          {{ statusObj[item.status] }}</span
                        > -->
                      </div>
                      <div class="left_title" :title="item.l5SvcNm">
                        {{ item.l5SvcNm }}
                      </div>
                      <div class="left_status">
                        <el-tag
                          :type="item.statusCd == '1' ? '' : 'warning'"
                          effect="Plain"
                          >{{ L5Obj[item.statusCd] }}</el-tag
                        >
                        <!-- <span
                          :class="
                            item.status == '0' ? 'statusRed' : 'statusGreen'
                          "
                        >
                          {{ L5Obj[item.status] }}</span
                        > -->
                      </div>
                    </div>
                    <div class="right_content">
                      <div class="operate">
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item, 'read', '3')"
                        ></i>
                        <!-- <i
                          class="el-icon-edit-outline"
                          @click.stop="handleIconClick(item, 'mod', '3')"
                          v-if="fourDesign == 'edit'"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click.stop="handleIconClick(item, 'delete', '3')"
                          v-if="fourDesign == 'edit'"
                        ></i> -->
                      </div>
                      <div class="right_title" v-if="fourDesign == 'add'">
                        <el-checkbox
                          v-model="item.checked"
                          @change="checkChange($event, item)"
                        ></el-checkbox>
                      </div>
                    </div>
                  </div>
                  <!-- <ul>
                    <li
                      class=""
                      @click.stop="clickChange()"
                      v-for="(item, index) in L5serviceList"
                      :key="index"
                      :class="dataStyle == index ? 'item_active' : ''"
                    >
                      {{ item.dataName }}
                    </li>
                  </ul> -->
                </div>
              </div>
            </div>
            <!-- 占位符 -->
            <div
              class=""
              style="display: none"
              :class="widthChange ? 'displayNone' : ''"
              v-if="!isShow && !piecewiseTrue"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  props: {
    //数据
    dataList: {
      type: Array,
      default: () => [],
    },
    //字段
    fieldList: {
      type: Array,
      default: () => [],
    },
    //分段
    piecewiseList: {
      type: Array,
      default: () => [],
    },
    //L5服务
    L5serviceList: {
      type: Array,
      default: () => [],
    },
    widthChange: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    piecewiseTrue: {
      type: Boolean,
      default: true,
    },
    // 在D4b设计时，可新增
    fourDesign: {
      type: String,
      default: "detail",
    },
    serviceTrue: {
      type: Boolean,
      default: true,
    },
    // 分段数量
    susStnCount: {
      type: String,
      default: "0",
    },
    // 字段数量
    fieldCount: {
      type: String,
      default: "0",
    },
    // 服务数量
    servCount: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      text: "xxxxx",
      statusObj: {
        0: "新增",
        1: "已入库",
        2: "变更",
      },
      L5Obj: {
        0: "自有",
        1: "直连",
      },
      tabsList: [
        { name: "all", label: "全部" },
        { name: "C1", label: "C1 用户册" },
        { name: "P1", label: "P1 机构册" },
        { name: "C2", label: "C2 渠道册" },
        { name: "P2", label: "P2 产品册" },
        { name: "C3", label: "C3 合约册" },
        { name: "S", label: "S 系统册" },
      ],
      activeName: "all",
      dataList: [
        // { id: "1", dataName: "账户数据顶顶顶顶顶顶顶顶顶集", status: "1" },
        // { id: "2", dataName: "产品数据集", status: "0" },
      ],
      piecewiseList: [
        // { id: "3", dataName: "基本信息", status: "1" },
        // { id: "23", dataName: "信用卡信息", status: "0" },
      ],
      fieldList: [
        // { id: "133", dataName: "账号", status: "1" },
        // { id: "244", dataName: "密码", status: "0" },
      ],
      L5serviceList: [
        // { id: "551", dataName: "账户余额查询", status: "1" },
        // { id: "266", dataName: "账户余额校验", status: "0" },
      ],
      dataStyle: "0", //高亮
      piecewiseStyle: "0",
      fieldStyle: "0",
      L5serviceStyle: "0",
      isShow: true, //三栏
      widthChange: false, //控制三 二栏
      piecewiseTrue: true,
      checkData: [], //复选框勾选的值
      subStnPage: 1,
      fieldPage: 1,
      servPage: 1,
    };
  },
  created() {},
  mounted() {
    document
      .querySelector(".subStn_scroll")
      .addEventListener("scroll", this.getSubStnLocation);
    document
      .querySelector(".field_scroll")
      .addEventListener("scroll", this.getFieldLocation);
    document
      .querySelector(".serv_scroll")
      .addEventListener("scroll", this.getServLocation);
  },
  watch: {},
  methods: {
    initData() {
      this.piecewiseStyle = "0";
      this.fieldStyle = "0";
      this.L5serviceStyle = "0";
      this.checkData = [];
    },
    //获取分段位置
    getSubStnLocation() {
      let b = document.querySelector(".subStn_scroll");
      if (b.scrollTop + b.clientHeight >= b.scrollHeight) {
        this.updateData();
      }
    },
    //获取字段位置
    getFieldLocation() {
      let b = document.querySelector(".field_scroll");
      if (b.scrollTop + b.clientHeight >= b.scrollHeight) {
        this.updateFieldData();
      }
    },
    //获取字段位置
    getServLocation() {
      let b = document.querySelector(".serv_scroll");
      if (b.scrollTop + b.clientHeight >= b.scrollHeight) {
        this.updateServData();
      }
    },
    updateData() {
      if (this.susStnCount > this.piecewiseList.length) {
        this.$emit("reFresh", ++this.subStnPage, "sub");
      }
    },
    updateFieldData() {
      if (this.fieldCount > this.fieldList.length) {
        this.$emit("reFresh", ++this.fieldPage, "field");
      }
    },
    updateServData() {
      if (this.servCount > this.L5serviceList.length) {
        this.$emit("reFresh", ++this.servPage, "serv");
      }
    },
    tabClick(e) {
      this.activeName = e.name;
      console.log(e);
    },
    handleIconClick(item, index, e) {
      if (index == "read") {
        if (e == 0) {
          // this.isShow = false;
          // this.widthChange = true;
          // this.piecewiseTrue = true;
        } else if (e == 1) {
          // this.piecewiseTrue = false;
          // this.isShow = false;
          // this.widthChange = true;
        }
        // this.widthChange = true;
        // this.isShow = false;
      }
      // console.log(item,index,e)
      this.$emit("detailClick", item, e, index);
    },
    clickChange(item, index, e) {
      switch (e) {
        case "0":
          this.dataStyle = index;
          // console.log(item,index,e);
          this.$emit("dataChange", item, index, e);
          break;
        case "1":
          this.piecewiseStyle = index;
          this.$emit("dataChange", item, index, e);
          // console.log(item,index,e)
          break;
        case "2":
          this.fieldStyle = index;
          this.$emit("dataChange", item, index, e);
          break;
        case "3":
          this.L5serviceStyle = index;
          // console.log(item,index,e)
          this.$emit("dataChange", item, index, e);
          break;
      }
    },
    // 点击新增
    add(type) {
      switch (type) {
        case "dataSet":
          // console.log(item,index,e);
          this.$emit("addType", type);
          break;
        case "subsection":
          this.$emit("addType", type);
          // console.log(item,index,e)
          break;
        case "field":
          // console.log(item,index,e)
          this.$emit("addType", type);
          break;
        case "service":
          // console.log(item,index,e)
          this.$emit("addType", type);
          break;
      }
    },
    checkChange(e, data) {
      if (e) {
        this.checkData.push(data);
      } else {
        this.checkData.splice(
          this.checkData.findIndex((item) => item.dictId == data.dictId),
          1
        );
      }
      this.$emit("checkChange", this.checkData);
    },
  },
};
</script>
<style>
.tabs .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  color: #fff;
  background: #358aff;
}
.tabs .el-tabs__header {
  margin: 0;
}
.list_item .el-divider--horizontal {
  margin: 0 0;
}
.left_status .el-tag--Plain {
  border-radius: 2px;
  height: 19px;
  line-height: 19px;
  font-size: 12px;
  width: 50px;
}
</style>
<style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_comps_tabs_content {
  .contentComps {
    // padding: 16px;
    // background: #fff;
    width: 100%;
    height: 100%;

    .tabsComps {
      background: #fff;
      //   padding: 10px 16px;
      .title {
        margin-bottom: 10px;
      }
      .tabs_content {
        width: 100%;
        // height: 900px;
        height: 100%;
        .list {
          display: flex;
          justify-content: space-between;
          .list_item {
            border: 2px solid #dfdfdf;
            // width: 380px;
            width: 24%;
            height: 450px;
            max-height: 450px;
            overflow: auto;
            border-radius: 5px;
            .list_title {
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              line-height: 47px;
              font-family: $font_medium;
              font-size: 16px;
              color: $pri_ft_color;
              letter-spacing: 0;
              font-weight: $font_weight_600;
            }
          }
          .item_active {
            background: #f0f5ff;
            color: #358aff;
          }
          .table {
            padding: 10px;
            // display: flex;
            .table_item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              //   height: 40px;
              //   line-height: 40px;
              padding: 10px 10px;
              margin-top: 10px;
              border-radius: 5px;
              .left_content {
                display: flex;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .left_title {
                  //   margin-left: 5px;
                  margin: 0 5px;
                  //   width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: 13px;
                }
                .left_status {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;

                  // text-align: center;
                }
                // .statusRed{
                //     background:#fef1f1;
                //     color: #7bca55;
                // }
                // .statusGreen{
                //     background: #e7f4ec;
                //     color:#f78585;
                // }
              }
              .right_content {
                margin-left: 5px;
                display: flex;
                .right_title {
                  margin-left: 5px;
                }
              }
            }
          }
        }
        .widthChange {
          width: 32% !important;
        }
        .displayNone {
          display: inline !important;
          width: 32% !important;
        }
      }
    }
  }
  .icon_box {
    position: relative;
    bottom: 0;
    left: 130px;
    background: #fff;
    z-index: 999;
    .icon {
      width: 20px;
      height: 20px;
      vertical-align: sub;
    }
  }
}
</style>