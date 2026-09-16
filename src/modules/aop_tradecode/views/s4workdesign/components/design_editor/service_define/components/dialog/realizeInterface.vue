<template>
  <div class="aop_tradecode_download_design_comps_add_params">
    <PageDialog
      :dialogWidth="'80%'"
      :dialogTitle="'接口列表'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
          <div class="check_content">
            <div class="left">
              <div class="left_tree">
                <div class="elem_search flex">
                  <el-input
                    v-model="servNm"
                    clearable
                    placeholder="接口名称"
                    size="small"
                    class="elem_search_sel"
                    @keyup.enter.native="search"
                  >
                    <i class="el-icon-search" slot="prefix" @click="search">
                    </i>
                  </el-input>
                </div>
                <div>
                  <ul class="service_menu_list">
                    <li
                      class="list_item"
                      :class="{ active: currentl5Obj.apiId == item.apiId }"
                      v-for="item in l5SvcList"
                      :key="item.apiId"
                      @click="d4bServClick(item)"
                    >
                      <div class="text_area">
                        <i
                          slot="suffix"
                          class="el-icon-check"
                          v-if="currentl5Obj.apiId == item.apiId"
                        ></i>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.apiName"
                          placement="top"
                          :disabled="item.apiName.length < 9"
                        >
                          <span class="list_item_title">{{
                            item.apiName
                          }}</span>
                        </el-tooltip>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="right_table">
                <ServiceTop
                  ref="formRef"
                  :serviceForm="serviceForm"
                  :form="formInline"
                  class="search_conf"
                  @enterSearch="goSearch"
                  labelwidth="85px"
                >
                  <div slot="rightButton">
                    <el-button
                      type="primary"
                      size="small"
                      @click="goSearch"
                      class="right_button"
                      >搜索</el-button
                    >
                    <el-button
                      size="small"
                      @click="resetFields"
                      class="right_button"
                      >重置</el-button
                    >
                  </div>
                </ServiceTop>
                <div class="content">
                  <div class="table">
                    <el-table
                      ref="refTable"
                      class="table_style"
                      :data="l5ServiceList"
                      :row-key="'actionId'"
                      :tree-props="{ children: 'layoutActionList' }"
                      :span-method="spanMethod"
                      border
                    >
                      <el-table-column
                        v-for="(item, index) in l5ServiceTable"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop"
                        align="left"
                        :show-overflow-tooltip="true"
                        min-width="60"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row[item.prop] == ''">/</span>
                          <span
                            v-else-if="scope.column.property == 'actionTyp'"
                            >{{ scope.row[item.prop] | actionType }}</span
                          >
                          <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer_btn">
          <el-button @click.native="handleCancel">取 消</el-button>
          <el-button type="primary" @click.native="saveParams">确定</el-button>
        </div>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_editor_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import filters from "@m/utils/filters";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  filters: {
    ...filters,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    compositeIdMapToParamList: {
      type: Object,
      default: () => ({}),
    },
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 选择参数弹框
      addVisible: false,
      l5ServiceList: [],
      l5ServiceTable: [
        {
          prop: "loSeqNo",
          label: "顺序号",
          type: "text",
          width: "120",
        },
        {
          prop: "actionTyp",
          label: "类型",
          type: "text",
          width: "120",
          // filter: actionType,
        },
        {
          prop: "actionNm",
          label: "名称",
          type: "text",
          width: "120",
        },
        {
          prop: "frntLoSeqNo",
          label: "前序顺序号",
          type: "text",
          operate: "fwmc",
          width: "180",
        },
        {
          prop: "source",
          label: "来源",
          type: "text",
          operate: "fwmc",
          width: "180",
        },
        {
          prop: "paramNm",
          label: "返回字段",
          type: "text",
          width: "100",
        },
        {
          prop: "condTyp",
          label: "对比关系",
          type: "text",
          width: "100",
        },
        {
          prop: "paramValue",
          label: "对比值",
          type: "text",
          width: "100",
        },
        {
          prop: "postLoSeqNo",
          label: "后续顺序号",
          type: "text",
          width: "100",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "inputSearch",
          model: "treeSeqNo",
          labelText: "位置序号：",
          placeholder: "请输入",
          style: {
            width: "260px",
          },
        },
      ],
      formInline: {
        treeSeqNo: "",
      },
      searchRecord: {
        treeSeqNo: "",
      },
      servNm: "",
      l5SvcList: [],
      currentl5Obj: {},
      jobNo: "", //作业号
      fnctCd: "", //功能编号
      beltLine: "", //业务域
      authId: "", //授权编号
      isolateWorkspace: "", //隔离标识
      asgntNo: "",
      appId: "",
      competitorId: "",
      mergeObj: {},
      mergeChildObj: [],
      mergeArr: [
        "loSeqNo",
        "actionTyp",
        "actionNm",
        "frntLoSeqNo",
        "postLoSeqNo",
      ],
      childData: [],
      columnList: [
        "loSeqNo",
        "actionTyp",
        "actionNm",
        "frntLoSeqNo",
        "postLoSeqNo",
      ],
    };
  },
  methods: {
    saveParams() {
      this.addVisible = false;
      this.$emit("realizeSave", this.currentl5Obj);
    },
    showDialog() {
      this.addVisible = true;
      this.init();
      this.servNm = "";
      this.resetSearch();
      this.getL5ServList();
    },
    // 初始化添加搜索栏
    resetSearch() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    async getL5ServList() {
      let params = {
        svcNm: this.servNm,
        pageFlg: "0",
        jobNo: this.asgntNo, //作业号
        fnctId: this.$route.query.fnctId, //功能编号   FM-ZC-2023-000663
        beltLine: this.beltLine, //业务域   FM-YWY-2022-000001
        authId: this.authId, //授权编号  FM-AFJI-2023041100001273
      };
      const res = await this.rpc.newEditor.getInterfaceList(params);
      this.l5SvcList = res.apiInfoList;
      this.l5SvcList.forEach((item) => {
        item.apiId = item.svcId;
        item.apiName = item.svcNm;
      });
      if (res.apiInfoList.length > 0) {
        this.d4bServClick(this.l5SvcList[0]);
      }
      if (!res.apiInfoList?.length) {
        this.l5ServiceList = [];
        this.l5SvcList = [];
        this.dicPager.total = 0;
      }
    },
    /**
     * 接口搜索
     */
    search() {
      this.currentPage = 1;
      this.getL5ServList();
    },
    /**
     * 接口详情搜索
     */
    goSearch() {
      Object.assign(this.searchRecord, this.formInline);
      this.getServDetail();
    },
    resetFields() {
      this.$refs.formRef.resetFields();
      Object.assign(this.searchRecord, this.formInline);
      this.getServDetail();
    },
    handleCancel(e) {
      console.log("handleCancel", e);
      this.addVisible = false;
    },
    d4bServClick(e) {
      this.currentl5Obj = e;
      this.childData = [];
      this.childData.childLength = 0;
      this.$nextTick(() => {
        this.getServDetail();
      });
    },
    //列表接口详情
    async getServDetail() {
      Object.assign(this.searchRecord, this.formInline);
      let params = {
        svcId: this.currentl5Obj.svcId,
        loSeqNo: this.searchRecord.treeSeqNo,
      };
      const res = await this.rpc.d4.getServiceArrangeList(params);
      this.l5ServiceList = res.layoutActionList.reduce((pre, cur) => {
        if (cur.layoutActionList && cur.layoutActionList.length) {
          cur.layoutActionList = cur.layoutActionList.filter((item) => {
            return item.actionTyp != "0";
          });
        }
        if (cur.actionTyp != "0") {
          pre.push(cur);
        }
        return pre;
      }, []);
      this.getJsonData(this.l5ServiceList);
      this.dealData(this.l5ServiceList);
      this.setChild(this.l5ServiceList);
      this.getSpanArr(this.l5ServiceList);
    },
    // 存在相同id的组件，且有子参数，则只保留最后一个元素的子参数，其他为空
    setChild(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].layoutActionList?.length > 0) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].actionId == data[j].actionId) {
              data[i].layoutActionList = [];
              break;
            }
          }
        }
      }
    },
    // 将tfrCdtnCd字段返回的时候解析为数组，并生成数据
    getJsonData(data) {
      const empty = "/";
      data.forEach((item) => {
        if (item.layoutActionList.length) {
          this.getJsonData(item.layoutActionList);
        }
        const tfrCdtnCd = JSON.parse(item.tfrCdtnCd || "[]");
        if (tfrCdtnCd.length) {
          item.paramKey = tfrCdtnCd[0].paramKey || empty;
          item.paramNm = tfrCdtnCd[0].paramNm || empty;
          item.condTyp = tfrCdtnCd[0].condTyp || empty;
          item.paramValue = tfrCdtnCd[0].paramValue || empty;
          item.postLoSeqNo = tfrCdtnCd[0].actionPostSeq || item.postLoSeqNo;
          item.source = tfrCdtnCd[0].actionNm || empty;
          for (let i = 1; i < tfrCdtnCd.length; i++) {
            let arr = JSON.parse(JSON.stringify(item));
            arr.paramKey = tfrCdtnCd[i].paramKey || empty;
            arr.paramNm = tfrCdtnCd[i].paramNm || empty;
            arr.condTyp = tfrCdtnCd[i].condTyp || empty;
            arr.paramValue = tfrCdtnCd[i].paramValue || empty;
            arr.postLoSeqNo = tfrCdtnCd[i].actionPostSeq || item.postLoSeqNo;
            arr.source = tfrCdtnCd[i].actionNm || empty;
            arr.tfrCdtnCd = "";
            data.push(arr);
          }
        } else {
          item.paramKey = empty;
          item.paramNm = empty;
          item.condTyp = empty;
          item.paramValue = empty;
          item.postLoSeqNo = item.postLoSeqNo;
          item.source = empty;
        }
        return item;
      });
    },
    //根据服务名称、后续位置进行排序
    dealData(data) {
      data.sort((a, b) => {
        let nameA = a.loSeqNo.toUpperCase();
        let nameB = b.loSeqNo.toUpperCase();
        let seqNoA = a.postLoSeqNo.toUpperCase();
        let seqNoB = b.postLoSeqNo.toUpperCase();
        if (nameA !== nameB) {
          return nameA < nameB ? -1 : 1;
        } else if (seqNoA !== seqNoB) {
          return seqNoA < seqNoB ? -1 : 1;
        }
      });
      data.forEach((item) => {
        if (item.layoutActionList) {
          this.dealData(item.layoutActionList);
        }
      });
    },
    // 获取需要合并的行列
    getSpanArr(data) {
      this.mergeArr.forEach((key, arrIndex) => {
        let pid = "";
        let count = 0;
        let childCount = 0;
        let sumChildList = [];
        this.mergeObj[key] = [];
        this.mergeChildObj[key] = [];
        data.forEach((item, index) => {
          if (!item.parentActionId) {
            if (index === 0) {
              this.mergeObj[key].push(1);
            } else if (
              arrIndex > 0 &&
              this.mergeObj[this.mergeArr[arrIndex - 1]][index] == 1
              //&&  (key == "postLoSeqNo" )
            ) {
              this.mergeObj[key].push(1);
            } else {
              // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
              if (
                item[key] === data[index - 1][key] &&
                item.actionId == data[index - 1].actionId
              ) {
                this.mergeObj[key][count] += 1;
                this.mergeObj[key].push(0);
              } else {
                count = index;
                this.mergeObj[key].push(1);
              }
            }
          }
          // 判断子参数
          if (item.layoutActionList.length) {
            item.layoutActionList.forEach((ii, index) => {
              if (index === 0 || pid != ii.parentActionId) {
                this.mergeChildObj[key].push(1);
              } else if (
                arrIndex > 0 &&
                this.mergeChildObj[this.mergeArr[arrIndex - 1]][index] == 1
                //&&  (key == "postLoSeqNo" )
              ) {
                // 判断当前列的前一列是否合并，如果没有则当前列也不合并
                this.mergeChildObj[key].push(1);
              } else {
                // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                if (
                  ii[key] === item.layoutActionList[index - 1][key] &&
                  ii.actionId == item.layoutActionList[index - 1].actionId
                ) {
                  this.mergeChildObj[key][childCount] += 1;
                  this.mergeChildObj[key].push(0);
                } else {
                  childCount = childCount + index;
                  this.mergeChildObj[key].push(1);
                }
              }
              // 如果是多个组件的子参数，则需要+1位进行判断新的子参数
              if (index == item.layoutActionList.length - 1) {
                sumChildList.push({
                  actionId: item.actionId,
                  count: item.layoutActionList.length,
                });
                let sum = 0;
                sumChildList.forEach((iitem, index) => {
                  sum += iitem.count;
                  if (iitem.actionId == item.actionId) {
                    childCount = sum;
                  }
                  // console.log("id相同时", childCount,sum);
                });
              }
              pid = ii.parentActionId;
            });
          }
        });
      });
      console.log("result", this.mergeObj, this.mergeChildObj);
    },
    // 合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        this.mergeArr.indexOf(column.property) !== -1 &&
        !row.parentActionId
      ) {
        // 如果当前行存在子参数
        if (
          row.layoutActionList.length > 0 &&
          this.mergeObj[column.property][rowIndex - this.childData.childLength]
        ) {
          // console.log("当前行有子参数", row.actionNm,column.property,row.layoutActionList,this.mergeObj[column.property][rowIndex - this.childData.childLength])
          // 如果当前组件存在子参数，且没有记录过当前组件的子参数信息
          if (
            this.childData.findIndex((item) => item.actionId == row.actionId) ==
            "-1"
          ) {
            this.childData.push({
              actionId: row.actionId,
              childIndex: rowIndex,
              sumChildlength:
                row.layoutActionList.length + this.childData.childLength,
            });
            this.childData.childLength += row.layoutActionList.length;
            // console.log("记录当前子参数", this.childData)
          }
          let recordIndex = rowIndex;
          this.childData.map((item) => {
            if (item.childIndex < rowIndex) {
              recordIndex = rowIndex - item.sumChildlength;
            }
          });
          // console.log("渲染咯", rowIndex,this.childData,recordIndex,this.mergeObj[column.property],this.mergeObj[column.property][recordIndex],)
          return [this.mergeObj[column.property][recordIndex], 1];
        }
        // console.log("无子参数",rowIndex,this.childData,row.actionNm,column.property,"子参数",row.layoutActionList,this.mergeObj[column.property][rowIndex],this.mergeObj[column.property])
        let index = rowIndex;
        this.childData.map((item) => {
          if (item.childIndex < rowIndex) {
            index = rowIndex - item.sumChildlength;
          }
        });
        // console.log("更新长度",row.actionNm,column.property,rowIndex, index, this.childData,this.childData.childLength,this.mergeObj[column.property],this.mergeObj[column.property][index])
        if (this.mergeObj[column.property][index]) {
          // console.log("渲染行",this.mergeObj[column.property][index],this.mergeObj[column.property], index)
          return [this.mergeObj[column.property][index], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
      if (this.mergeArr.indexOf(column.property) !== -1 && row.parentActionId) {
        // 因为子参数渲染是从0行开始的，但是他当前的rowIndex为总行数的第几行，所以需要找到当前mergeChildObj内对应的子参数位置
        let template = [];
        this.l5ServiceList.map((item, index) => {
          if (item.actionId == row.parentActionId) {
            template.push(index);
          }
        });
        let childIndex = template[template.length - 1] + 1;
        if (this.mergeChildObj[column.property][rowIndex - childIndex]) {
          return [
            this.mergeChildObj[column.property][rowIndex - childIndex],
            1,
          ];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
    init() {
      this.fnctCd = this.$route.query.fnctId;
      this.beltLine = this.$route.query.beltLine;
      this.authId = this.$route.query.authAstFnctInfoId;
      this.asgntNo = this.$route.query.asgntNo;
      this.childData = [];
      this.childData.childLength = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradecode_download_design_comps_add_params {
  .create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }

    .add_dialog_conf1 {
      padding: 15px 12px;
      // height: 600px;
      background: #f5f5f8;
      overflow: hidden;
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }

      .check_content {
        display: flex;

        .left {
          width: 23%;
          height: 520px;
          background: #fff;
          padding: 6px;
        }

        .middle {
          width: 77%;
          height: 300px;
          // max-height: 520px;
          margin-left: 10px;

          .search_conf {
            padding: 0 24px;
          }

          .content {
            height: 436px;
            padding: 0 24px;
            // margin-top: 12px;
            background: #fff;
            overflow: scroll;
          }
        }

        .list_title {
          padding: 10px;
          font-weight: 600;
          color: $reg_ft_color;
          font-size: 16px;
          border-bottom: none;
        }
      }
    }

    .service_menu_list {
      // margin-top: 8px;
      // height: 278px;
      max-height: 400px;
      overflow-y: scroll;
      width: 100%;
      .list_item {
        width: 100%;
        font-size: 12px;
        // margin-bottom: 6px;
        // white-space: nowrap;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        padding: 4px 6px;

        // height: 30px;
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
          width: 100%;
          align-items: center;

          .icon {
            margin-right: 4px;
          }

          .list_item_title {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            // max-width: 120px;
            height: 20px;
            line-height: 20px;
            color: #000;
            cursor: pointer;
            font-size: 13px;
            margin-left: 4px;
            &.r4b {
              max-width: 170px;
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
  }

  .elem_search {
    overflow: hidden;
    line-height: 30px;
    padding: 5px;
    margin-bottom: 10px;

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

  .status {
    padding: 2px 4px;
    margin-right: 6px;
    line-height: 18px;
    font-size: 12px;
    border-radius: 2px;
    text-align: center;
    min-width: 40px;
  }
  .status_0,
  .status_1 {
    color: #ff5f5f;
    background: #ffefee;
    border: 0.5px solid #ff5f5f;
  }
  .status_2 {
    color: #36d542;
    background: #e5ffe7;
    border: 0.5px solid #36d542;
  }
  .show_conf {
    padding-bottom: 10px;
    position: relative;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    z-index: 9;
    // overflow: hidden;
    .show_conf_title {
      text-align: left;
      margin-right: 10px;
      font-family: $font_medium;

      span {
        color: #358aff;
      }
    }

    .show_conf_content {
      text-align: left;
    }

    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .footer_btn {
    border-top: 1px solid #e7e7e7;
    padding-top: 14px;
  }
}
</style>
