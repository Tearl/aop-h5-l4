<template>
  <div class="aop_tradedesign_dic_cmps_my_field_list">
    <div class="D2_workspace_table_list">
      <div class="table_operate">
        <div class="header_content">
          <h1>字段列表{{ buttonList }}</h1>
          <!-- <div class="btn" v-show="active == 'all' || active == '00'">
            <el-button
              type="primary"
              @click="addDataSet"
              class="btn_style"
              icon="el-icon-plus"
              >新增数据集</el-button
            >
          </div> -->
        </div>

        <common-table-operate
          @changeComlunTable="changeComlunTable"
          @btnClick="btnClick"
          :tableColumnList="tableColumnList"
          :selectItemKeyList="selectItemKeyList"
          :btnList="btnList"
        />
      </div>

      <div
        class="show_main"
        :style="{
          paddingBottom: '4px',
          marginTop: changeView ? '12px' : '',
          background: !changeView ? '#FFFFFF' : '',
        }"
      >
        <!-- 表格展示 -->
        <el-table
          :key="toggleIndex"
          :stripe="hasRowLine ? true : false"
          :data="list"
          class="D2_workspace_common_table"
          v-if="changeView"
        >
          <el-table-column
            label="字段名称"
            prop="dictNm"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span @click="doOperate('look', scope.row)" class="blue_span">{{
                scope.row.dictNm
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="字段英文"
            prop="dictNo"
            show-overflow-tooltip
            v-if="selectedKey.includes('dictNo')"
          ></el-table-column>
          <el-table-column
            label="所属类型"
            prop="dictTyp"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="所属数据集"
            prop="dataSetNm"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="所属分段"
            prop="dataSubstnNm"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="分类"
            prop="classifyNm"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="所属域"
            prop="beltLineNm"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="状态" prop="statusCd">
            <template slot-scope="scope">
              <span
                :class="['status_span', `status_${scope.row.statusCd}`]"
                >{{ publishStatus[scope.row.statusCd] }}</span
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <div class="operate">
                <span class="blue_span" @click="doOperate('look', scope.row)"
                  >查看</span
                >
                <span
                  v-if="scope.row.desiStusCd == '00'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('design', scope.row)"
                  >设计</span
                >
                <span
                  v-if="scope.row.desiStusCd == '00'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('commit', scope.row)"
                  >提交评审</span
                >
                <span
                  v-if="scope.row.desiStusCd == '01'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('review', scope.row)"
                  >评审</span
                >
                <span
                  v-if="scope.row.desiStusCd == '01'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('recall', scope.row)"
                  >撤回</span
                >
                <span
                  v-if="scope.row.desiStusCd == '03'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('register', scope.row)"
                  >登记</span
                >
                <span
                  v-if="scope.row.desiStusCd == '02'"
                  class="blue_span border_d4_wark_space"
                  @click="doOperate('redesign', scope.row)"
                  >重新设计</span
                >
              </div>
            </template>
          </el-table-column> -->
        </el-table>

        <!-- 图表展示 -->

        <div v-else>
          <div class="empty" v-if="list.length == 0">
            <div class="empty_main">
              <img src="../../assets/Group.png" alt="" />
              <span class="desc">当前暂无字典</span>
            </div>
          </div>
          <div class="application_manage_list_card" v-else>
            <div
              class="application_manage_list_card_item"
              v-for="item in list"
              :key="item"
            >
              <div class="application_manage_list_card_item_top">
                <img src="../../assets/logo.png" alt="" />
                <div class="application_manage_list_card_item_top_desc">
                  <div class="title_and_version">
                    <h1 :title="item.dataSetNm">{{ item.dataSetNm }}</h1>
                    <span
                      v-show="item.lblStusCd != '0'"
                      :class="['status_span', `status_${item.lblStusCd}`]"
                      >{{ labelStatus[item.lblStusCd] }}</span
                    >
                  </div>

                  <div class="application_manage_list_card_item_platform">
                    <span class="app_auth">{{ item.beltLineNm || objTemp[item.beltLine]}}</span>
                    <span class="app_publish">{{ item.classifyId | classifyIdSt}}</span>
                  </div>
                </div>
              </div>
              <div
                :title="item.dataSetDesc"
                class="application_manage_list_card_item_all_desc"
              >
                {{ item.dataSetDesc }}
              </div>
              <div class="application_manage_list_card_item_create_desc">
                <div v-if="selectedKey.includes('dataSetNo')">
                  <span>ID：</span>
                  <span>{{ item.dataSetNo }}</span>
                </div>
                <div v-if="selectedKey.includes('gmtCreate')">
                  <span>创建时间：</span>
                  <span>{{ item.crtTm | crtTm_yyyyMMddhhmmss }}</span>
                </div>
              </div>

              <div class="application_manage_list_card_item_bottom">
                <div class="opera-item" @click="doOperate('look', item)">
                  <!-- <img src="../assets/icon_look.png" alt="" class="item-img" /> -->
                  <span>查看</span>
                </div>

                <div
                  v-if="item.desiStusCd == '00'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('design', item)"
                >
                  <!-- <img src="../assets/icon_design.png" alt="" class="item-img" /> -->
                  <span>设计</span>
                </div>
                <div
                  v-if="item.desiStusCd == '00'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('commit', item)"
                >
                  <!-- <img src="../assets/icon_permiss.png" alt="" class="item-img" /> -->
                  <span>提交评审</span>
                </div>
                <div
                  v-if="item.desiStusCd == '01'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('review', item)"
                >
                  <!-- <img src="../assets/icon_permiss.png" alt="" class="item-img" /> -->
                  <span>评审</span>
                </div>
                <div
                  v-if="item.desiStusCd == '01'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('recall', item)"
                >
                  <!-- <img src="../assets/icon_permiss.png" alt="" class="item-img" /> -->
                  <span>撤回</span>
                </div>
                <div
                  v-if="item.desiStusCd == '03'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('register', item)"
                >
                  <!-- <img src="../assets/icon_permiss.png" alt="" class="item-img" /> -->
                  <span>登记</span>
                </div>
                <div
                  v-if="item.desiStusCd == '02'"
                  class="opera-item border_d4_wark_space"
                  @click="doOperate('redesign', item)"
                >
                  <!-- <img src="../assets/icon_permiss.png" alt="" class="item-img" /> -->
                  <span>重新设计</span>
                </div>
              </div>

              <span :class="['status_span', `status_${item.desiStusCd}`]">{{
                publishStatus[item.desiStusCd]
              }}</span>
            </div>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="pagination" v-if="list.length > 0 && total > 15">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-sizes="[15, 30, 45]"
            :page-size="pageNum"
            layout="total,prev, pager, next, sizes, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <ReviewDialog ref="reviewRef" @refresh="refresh"></ReviewDialog>
  </div>
</template>

<script>
import commonTableOperate from "../CommonTableOperate.vue";
import ReviewDialog from "../dialog/review.vue";
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: { commonTableOperate, ReviewDialog },
  props: {
    active: {
      type: String,
      default: "01",
    },
    activeTabs: {
      type: String,
      default: "",
    },
    flag: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  data() {
    return {
      m3NotPassDialogVisible: false,
      btnList: [
        {
          defaultIcon: require("../../assets/common_search.png"),
          activeIcon: require("../../assets/common_search_h.png"),
          hasActive: false,
          isPop: false,
        },
        {
          defaultIcon: require("../../assets/common_operate.png"),
          activeIcon: require("../../assets/common_operate_h.png"),
          hasActive: false,
          isPop: true,
        },
      ],
      selectedKey: ["dictNo"],
      selectItemKeyList: ["dictNo"],
      toggleIndex: 0,
      // 待选项的数据列表
      tableColumnList: [
        {
          text: "字段英文",
          value: "dictNo",
        },
        // {
        //   text: "创建时间",
        //   value: "gmtCreate",
        // },
      ],
      list: [],
      formData: {
        qryCntnt: "",
      },
      baseList: [],
      publishStatus: {
        "0": "新增",
        "1": "已登记",
        "2": "已登记",
        "3": "待评审",
      },
      labelStatus: {
        1: "单确",
        2: "双确",
      },
      applicationInfo: {},
      changeView: true,
      hasRowLine: false,
      page: "1",
      pageNum: "15",
      total: 0,
      // 搜索条件
      form: {},
      objBl:{
        "FM-YWY-2022-000003":"营销业务",
        "FM-YWY-2022-000002":"对私业务",
        "FM-YWY-2022-000001":"对公业务"
      },
      departmentList:[],
      objTemp:{}
    };
  },
  created() {
    // this.getBaseInfoList()
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      // this.getDicList();
      // this.queryBizDomainList();
    },
    async queryBizDomainList() {
      const res = await this.rpc.downloadDesign.queryBizDomainList();
      if (res.businessDomainLists.length > 0) {
        res.businessDomainLists.map((item) => {
          this.departmentList.push({
            value: item.bizDomainNo,
            type: item.bizDomainName,
          });
        });
      }
      this.objTemp = this.arrTransferObj(this.departmentList,"value","type")
      console.log(this.objTemp,"----------")
    },
    //数组转对象
    arrTransferObj(arr,key,val){
      return arr.reduce((obj,item) => ((obj[item[key]] = item[val]),obj),{})
    },
    addDataSet() {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/addDataSet",
      });
    },
    addService() {},
    search() {
      this.page = 1;
      this.getDicList();
    },
    reset() {
      this.page = 1;
      // this.$refs.formRef.resetFields();
      this.getDicList();
    },
    async getDicList(e) {
      let status = [];
      let registerCount = "";
     if (this.active == "all") {
        if(this.form.status == "0") status = ["0"]
        else if (this.form.status =="20") status = ["1","2"]
        else if (this.form.status == "01") status = ["01"]
        else status = []
      } else if (this.active == "design") {
        status = ["0"];
      } else if (this.active == "unreview") {
        status = ["3"];
      } else if (this.active == "unaccept") {
        status = ["1", "2"];
      }
      const queryParams = {
        ...this.form,
        desiStusCdList: status,
        currentPage: this.page, //当前页
        turnPageShowNum: this.pageNum, //当前页数量
      };
      const res = await this.rpc.dicmgmt.getFieldInfoBeanPage(queryParams);
      this.list = res.dataSetDataRelationList || [];
      this.total = res.turnPageTotalNum *1;
      registerCount = this.active == "20" ? "registerCount" : e
      this.$emit("getTotal",res.turnPageTotalNum,registerCount)
    },
    /**
     * 响应按钮操作
     * @param {String} operate 操作
     * @param {Object} scope 操作数据对象
     */
    doOperate(operate, scope) {
      switch (operate) {
        case "look":
          this.$router.push({
            path: "/aop_tradedesign/dicmgmt/fieldDetail",
            query: {
              dataSetDataId: scope.dataSetDataId,
              dataSetNo: scope.dataSetNo,
              type:"list"
            },
          });
          break;
        case "design":
          this.$router.push({
            path: "/aop_tradedesign/dicmgmt/editDataSet",
            query: {
              dataSetNo: scope.dataSetNo,
            },
          });
          break;
        case "commit":
          this.$confirm("确定要提交评审吗?").then(async () => {
            const params = {
              dataSetNo: scope.dataSetNo,
            };
            const res = await this.rpc.dicmgmt.submitReview(params);
            this.$notify({
              title: "成功",
              message: "提交评审成功",
              duration: 2000,
              type: "success",
            });
            this.refresh("01");
          });
          break;
        case "review":
          this.$refs.reviewRef.showDialog(scope.dataSetNo);
          // this.refresh("01");
          break;
        case "recall":
          this.$confirm("确定要撤回吗?").then(async () => {
            const params = {
              dataSetNo: scope.dataSetNo,
            };
            const res = await this.rpc.dicmgmt.revocaDataSet(params);
            this.$notify({
              title: "成功",
              message: "撤回成功",
              duration: 2000,
              type: "success",
            });
            this.refresh("01");
          });
          break;
        case "redesign":
          this.$confirm("确定要重新设计吗?").then(async () => {
            const params = {
              dataSetNo: scope.dataSetNo,
            };
            const res = await this.rpc.dicmgmt.reDesignDataSet(params);
            this.$notify({
              title: "成功",
              message: "重新设计成功",
              duration: 2000,
              type: "success",
            });
            this.refresh("02");
          });
          break;
      }
    },
    handleSizeChange(e) {
      this.pageNum = e;
      this.getDicList();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getDicList();
    },
    refresh(e) {
      this.getDicList();
      if(e) {
        this.$emit("getViewCount",e);
      }
      this.$emit("getCount");
    },
    btnClick(val) {
      switch (val) {
        case 0:
          this.$emit("changeSearch");
          break;
        case 1:
          // this.changeView = !this.changeView;
          // this.pageNum = this.changeView == true ? 9 : 10
          // this.getDicList();
          break;
        case 2:
          this.hasRowLine = !this.hasRowLine;
          break;
      }
    },
    dateTimeFilter(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      return filters.crtTm_yyyyMMddhhmmss(data);
    },
    changeComlunTable(val) {
      this.toggleIndex = Math.random();
      this.selectedKey = val;
      this.selectItemKeyList = val;
    },
    classifyIdSt(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      return filters.classifyIdSt(data);
    },
    resetPage(){
      this.page= "1"
      this.pageNum = "15"
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_my_field_list {
  .el-table__header,
  .el-table__body {
    overflow: hidden;
    width: 99.9% !important;
  }
  .el-table {
    width: 99.9% !important; //不让它到临界值，这样可避免自动计算
  }
  .el-table th{
    background:$table_bg_color !important;
    color:$reg_ft_color !important;
  }

  .d2_common_search_form {
    background: #ffffff;
    padding: 16px;
    padding-bottom: 0;
    margin-bottom: 12px;

    .el-form-item--small.el-form-item {
      margin-bottom: 16px;
    }
    .form_btn {
      text-align: right;
    }
  }

  .D2_workspace_table_list {
    .border_d4_wark_space {
      border-left: 1px solid #d1cccc;
    }
    .table_operate {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      h1 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0;
      }
      .header_content {
        display: flex;
        justify-content: space-between;
        // flex: 1;
        width: 100%;
        margin-right: 10px;
        .btn_style {
          @include small_button_common;
        }
      }
    }
    .show_main {
      height: calc(100vh - 255px);
    }
    .D2_workspace_common_table {
      padding: 16px;
      padding-bottom: 12px;

      .blue_span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #358aff;
        letter-spacing: 0;
        margin-right: 3px;
        padding-left: 7px;
        cursor: pointer;
      }
      .del_span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ff5f5f;
        letter-spacing: 0;
      }
    }

    .empty {
      // background: #FFFFFF;
      justify-content: center;
      display: flex;
      padding-top: 116px;

      .empty_main {
        width: 340px;
        text-align: center;
        img {
          width: 200px;
          height: 130px;
        }
        .desc {
          display: block;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          margin-bottom: 32px;
        }
      }
    }

    .application_manage_list_card {
      display: grid;
      grid-template-columns: 32% 32% 32%;
      justify-items: center;
      grid-gap: 12px 2%;

      .application_manage_list_card_item {
        width: 100%;
        // height: 172px;
        background: #ffffff;
        border: 1px solid #d9d4d4a6;
        border-radius: 4px;
        position: relative;

        &:hover {
          box-shadow: 0 4px 8px 2px rgba(53, 138, 255, 0.2);
        }

        .application_manage_list_card_item_top {
          display: flex;
          align-items: flex-start;
          padding: 27px 16px 12px 16px;
          position: relative;
          cursor: pointer;
          position: relative;

          .status-label {
            width: 44px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            position: absolute;
            border-radius: 4px 0 4px 0;
            font-size: 12px;
            right: 0;
            top: 0;
          }
          .table-delay-img {
            width: 105px;
            height: 83px;
            min-height: 105px;
            min-width: 83px;
            position: absolute;
            top: 35px;
            right: 36px;

            img {
              width: 105px;
              height: 83px;
            }
          }

          img {
            width: 48px;
            height: 48px;
            margin-right: 16px;
          }
          .application_manage_list_card_item_top_desc {
            // height: 48px;
            // margin-bottom: 10px;
            width: 100%;

            .title_and_version {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
            }
            h1 {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: #333333;
              letter-spacing: 0;
              line-height: 20px;
              font-weight: 500;
              margin-right: 8px;

              max-width: 80%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            span {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #999999;
            }

            .application_manage_list_card_item_platform {
              display: flex;
              align-items: center;

              span {
                display: block;
                padding: 0 4px;
                background: #f5f5f5;
                border-radius: 2px;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.65);
                margin-right: 6px;
                border: 0.5px solid rgba(217, 217, 217, 1);
              }
              .app_auth {
                background: #fff2f0;
                color: #f89477;
                border: 0.5px solid rgba(248, 148, 119, 1);
              }
              .module_auth {
                background: #eefff0;
                color: #29cd40;
                border: 0.5px solid rgba(41, 205, 64, 1);
              }
              .app_publish {
                color: #358aff;
                background: #e7f1ff;
                border: 0.5px solid rgba(53, 138, 255, 1);
              }
              .app_version {
                color: #fff;
                background: #358aff;
                border: 0.5px solid #358aff;
              }
            }
          }
        }

        .application_manage_list_card_item_all_desc {
          padding: 0 16px;
          width: 100%;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .application_manage_list_card_item_create_desc {
          // display: flex;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          padding: 0 16px;
          margin: 4px 0 12px 0;
          div:first-child {
            margin-right: 16px;
          }
        }

        .application_manage_list_card_item_bottom {
          // background: #f7f9fa;
          box-shadow: inset 0 0.5px 0 0 #cbc9c9;
          padding: 15px 0;
          display: flex;
          align-items: center;
          // justify-content: space-between;
          font-size: 14px;
          margin: 0 16px;

          .opera-item {
            cursor: pointer;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #358aff;
            &:hover {
              // box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.12);
              color: #358aff;
            }
          }
          .item-img {
            width: 20px;
            height: 20px;
            min-width: 20px;
            min-height: 20px;
          }
        }

        // .application_manage_list_card_item_bottom {
        //     background: #f7f9fa;
        //     box-shadow: inset 0 1px 0 0 #e9e9e9;
        //     padding: 16px 0;
        //     display: flex;
        //     align-items: center;
        //     justify-content: space-between;

        //     span {
        //         display: block;
        //         width: 50%;
        //         height: 16px;
        //         text-align: center;
        //         border-right: 1px solid #e8e8e8;
        //         font-family: PingFangSC-Regular;
        //         font-size: 14px;
        //         color: #358aff;
        //         cursor: pointer;

        //         &:last-child {
        //             border: none;
        //         }
        //     }

        //     // .btn_detail {
        //     //     &:hover {
        //     //         color: #358aff;
        //     //     }
        //     // }
        // }
      }
      .status_span {
        position: absolute;
        top: 0;
        right: 0;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        letter-spacing: 0;
        padding: 0 4px;
      }
      // .status_00,
      // .status_1 {
      //   color: #ff9104;
      //   background: #fff4e5;
      // }
      .status_3 {
        color: #36d542;
        background: #e5ffe7;
      }
      .status_0 {
        color: #ff5f5f;
        background: #ffefee;
      }
      .status_03,
      .status_1,
      .status_2 {
        color: #358aff;
        background: #f2f8ff;
      }
      .status_20 {
        color: #5d36d5;
        background: #e6e5ff;
      }
    }
  }
  .status_span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    letter-spacing: 0;
    padding: 0 4px;
  }
  // .status_00,
  // .status_1 {
  //   color: #ff9104;
  //   background: #fff4e5;
  // }
  .status_3 {
    color: #36d542;
    background: #e5ffe7;
  }
  .status_02 {
    color: #5d36d5;
    background: #e6e5ff;
  }
  .status_03,
  .status_1,
  .status_2 {
    color: #358aff;
    background: #f2f8ff;
  }
  .status_0 {
    color: #ff5f5f;
    background: #ffefee;
  }
  .pagination {
    margin: 12px 0;
    text-align: center;
    padding: 12px 0px 36px 0px;
  }
}
</style>