<template>
  <div class="aop_tradedesign_dic_page_dicList">
    <div class="content">
      <div class="search">
        <el-form :inline="true" size="small" :model="formData">
          <el-row class="search_bottom">
            <el-col :span="20">
              <el-form-item label="关键字：" prop="dicName">
                <el-input
                  v-model="formData.dicName"
                  style="width: 475px"
                  placeholder="输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字"
                ></el-input>
              </el-form-item>
              <el-form-item label="精确查询：" prop="dicQuery">
                <el-switch v-model="formData.dicQuery"></el-switch>
              </el-form-item>
              <el-form-item label="状态：" prop="dicStatus">
                <el-select v-model="formData.dicStatus" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="form_btn">
                <el-button size="small" type="primary" @click="search"
                  >查询</el-button
                >
                <el-button size="small" @click="reset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tabs">
        <div class="title">
          <div>部：</div>
          <div class="title_tabs">
            <el-tabs
              v-model="departmentName"
              type="card"
              @tab-click="tabClick(departmentName, '0')"
            >
              <el-tab-pane
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.label"
                :name="item.name"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="title">
          <div>册：</div>
          <div class="title_tabs">
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="tabClick(activeName, '1')"
            >
              <el-tab-pane
                v-for="(item, index) in tabsList"
                :key="index"
                :label="item.label"
                :name="item.name"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <TabsContent
          :fieldList="fieldList"
          :piecewiseList="piecewiseList"
          :dataList="dataList"
          :L5serviceList="L5serviceList"
          @detailClick="detailClick"
          @dataChange="dataChange"
        ></TabsContent>
        <!-- <div class="tabs_content"> -->
        <!-- <div class="list"> -->

        <!-- 数据集 -->
        <!-- <div class="list_item">
              <div class="list_title">数据集(2)</div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table">
                  <div
                    class="table_item"
                    v-for="(item, index) in dataList"
                    @click.stop="clickChange(item,index,'0')"
                    :key="index"
                    :class="dataStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div :class="statusStyle == '0' ? '' : ''">
                        {{ statusObj[item.status] }}
                      </div>
                      <div class="left_title" :title="item.dataName">
                        {{ item.dataName }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div>
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item,'0')"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
        <!-- 分段 -->
        <!-- <div class="list_item">
              <div class="list_title">分段(2)</div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table">
                    <div
                    class="table_item"
                    v-for="(item, index) in piecewiseList"
                    @click.stop="clickChange(item,index,'1')"
                    :key="index"
                    :class="dataStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div :class="statusStyle == '0' ? '' : ''">
                        {{ statusObj[item.status] }}
                      </div>
                      <div class="left_title" :title="item.dataName">
                        {{ item.dataName }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div>
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item,index,'1')"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
        <!-- 字段 -->
        <!-- <div class="list_item">
              <div class="list_title">字段(2)</div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table">
                    <div
                    class="table_item"
                    v-for="(item, index) in fieldList"
                    @click.stop="clickChange(item,index,'2')"
                    :key="index"
                    :class="dataStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div :class="statusStyle == '0' ? '' : ''">
                        {{ statusObj[item.status] }}
                      </div>
                      <div class="left_title" :title="item.dataName">
                        {{ item.dataName }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div>
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item,index,'2')"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
        <!-- L5服务 -->
        <!-- <div class="list_item">
              <div class="list_title">L5服务(2)</div>
              <el-divider></el-divider>
              <div class="list_content">
                <div class="table">
                    <div
                    class="table_item"
                    v-for="(item, index) in L5serviceList"
                    @click.stop="clickChange(item,index,'3')"
                    :key="index"
                    :class="dataStyle == index ? 'item_active' : ''"
                  >
                    <div class="left_content">
                      <div :class="statusStyle == '0' ? '' : ''">
                        {{ statusObj[item.status] }}
                      </div>
                      <div class="left_title" :title="item.dataName">
                        {{ item.dataName }}
                      </div>
                    </div>
                    <div class="right_content">
                      <div>
                        <i
                          class="el-icon-view"
                          @click.stop="handleIconClick(item,index,'3')"
                        ></i>
                      </div>
                      <div class="right_title">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
        <!-- </div> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import TabsContent from "./components/tabsContent.vue";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
  },

  data() {
    return {
      formData: {
        dicName: "",
        dicQuery: "",
        dicStatus: "",
      },
      options: [
        {
          value: "0",
          label: "已入库",
        },
        {
          value: "1",
          label: "新增",
        },
      ],
      text: "已入库",
      statusObj: {
        0: "已入库",
        1: "新增",
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
      departmentList: [
        { name: "0", label: "对公业务" },
        { name: "1", label: "对私业务" },
        { name: "2", label: "营销业务" },
      ],
      activeName: "all",
      departmentName: "0",
      dataList: [
        { id: "1", dataName: "账户数据顶顶顶顶顶顶顶顶顶集", status: "1" },
        { id: "2", dataName: "产品数据集", status: "0" },
      ],
      piecewiseList: [
        { id: "1", dataName: "基本信息", status: "1" },
        { id: "2", dataName: "信用卡信息", status: "0" },
      ],
      fieldList: [
        { id: "1", dataName: "账号", status: "1" },
        { id: "2", dataName: "密码", status: "0" },
      ],
      L5serviceList: [
        { id: "1", dataName: "账户数据顶顶顶顶顶顶顶顶顶集", status: "1" },
        { id: "2", dataName: "账户数据顶顶顶顶顶顶顶顶顶集", status: "0" },
      ],
      dataStyle: "0",
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    tabClick(e, type) {
      switch (type) {
        case "0":
          console.log(e, type, "部tabClick");
          break;
        case "1":
          console.log(e,type,"册tabClick");
          break;
      }
    },
    handleIconClick() {},
    clickChange(e) {
      this.dataStyle = e;
    },
    detailClick(item, e, type) {
      console.log(item, type, e, "详情");
      if (e == "0" && type =="read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/dataDetail",
          query: {
            // astNo: scope.astNo,
            // astVerNo: scope.astVerNo,
            // action: "app-look-work-design",
          },
        });
      } else if (e == "1" && type =="read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
          query: {
            // astNo: scope.astNo,
            // astVerNo: scope.astVerNo,
            // action: "app-look-work-design",
          },
        });
      } else if (e == "2" && type =="read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/fieldDetail",
          query: {
            // astNo: scope.astNo,
            // astVerNo: scope.astVerNo,
            // action: "app-look-work-design",
          },
        });
      } else if (e == "3" && type =="read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            // astNo: scope.astNo,
            // astVerNo: scope.astVerNo,
            // action: "app-look-work-design",
          },
        });
      }
    },
    dataChange(item, e, type) {
      console.log(item, e, type, "dataChange");
    },
  },
};
</script>
<style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_page_dicList {
  .content {
    padding: 16px;
    // background: #fff;
    width: 100%;
    height: 100%;
    .search {
      background: #fff;
      padding: 16px;
      margin-bottom: 20px;
      // display: flex;
      // align-items: center;
    }
    .tabs {
      background: #fff;
      padding: 10px 16px;
      .title {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        .title_tabs {
          flex: 1;
        }
      }
      .tabs_content {
        width: 100%;
        // height: 900px;
        height: 100%;
        // .list {
        //   display: flex;
        //   justify-content: space-between;
        //   .list_item {
        //     border: 1px solid;
        //     // width: 380px;
        //     width: 24%;
        //     height: 450px;
        //     max-height: 450px;
        //     overflow: auto;
        //     .list_title {
        //       font-family: $font_medium;
        //       font-size: 16px;
        //       color: $pri_ft_color;
        //       letter-spacing: 0;
        //       font-weight: $font_weight_600;
        //       padding: 10px;
        //     }
        //     /deep/ .el-divider--horizontal {
        //       margin: 0 0;
        //     }
        //   }
        //   .item_active {
        //     background: #f0f5ff;
        //     color: #358aff;
        //   }
        //   .table {
        //     padding: 10px;
        //     // display: flex;
        //     .table_item {
        //       display: flex;
        //       justify-content: space-between;
        //       align-items: center;
        //       cursor: pointer;
        //       height: 40px;
        //       line-height: 40px;
        //       padding: 0 10px;
        //       margin-top: 10px;
        //       border-radius: 5px;
        //       .left_content {
        //         display: flex;
        //         flex: 1;
        //         overflow: hidden;
        //         white-space: nowrap;
        //         text-overflow: ellipsis;
        //         .left_title {
        //           margin-left: 5px;
        //           width: 100%;
        //           overflow: hidden;
        //           white-space: nowrap;
        //           text-overflow: ellipsis;
        //         }
        //       }
        //       .right_content {
        //         display: flex;
        //         .right_title {
        //           margin-left: 5px;
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
  }
}
</style>