<template>
  <div class="aop_tradecode_download_design_comps_add_params">
    <PageDialog
      :dialogWidth="'60.3%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      :apTobody="true"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
          <div class="check_content">
            <div class="left">
              <div class="left_tree">
                <div class="list_title">
                  <span>服务列表</span>
                </div>
                <div class="elem_search flex">
                  <el-input
                    v-model="servNm"
                    clearable
                    placeholder="服务名称"
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
                        <span :class="['status', `status_${item.addState}`]">
                          {{ publishStatus[item.addState] }}
                        </span>
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
                    <TableHeader
                      :title="l5SevNm"
                      :slotVisble="true"
                      :checkedColumns="checkedColumns"
                      :checkBoxGroup="checkBoxGroup"
                      @changeColumn="changeColumn"
                    >
                    </TableHeader>
                    <Table
                      class="table_style"
                      :data="dictList"
                      :table="dictListTables"
                      ref="dictListTableRef"
                      :rowK="'serialNumber'"
                      :treeProps="{ children: 'sonParamList' }"
                      :tableType="'selection'"
                      :cellStyle="dictListCellStyle"
                      useType="dialog"
                      :reload="reload"
                      @select="checkSelect"
                      @selectAll="selectAll"
                    ></Table>
                    <!-- 分页器 -->
                    <!-- <PagePagination
                      @size-change="handleDicSizeChange"
                      @current-change="handleDicCurrentChange"
                      :pager="dicPager"
                    >
                    </PagePagination> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="show_conf">
          <div class="show_conf_title">
            已选择{{ tableData && tableData.length }}个：
          </div>
          <div class="show_conf_content">
            <el-tag
              v-for="(item, index) in tableData"
              :key="index"
              type="info"
              size="small"
              closable
              class="show_conf_tag"
              @close="delParamsTag(item, formInline.type)"
            >
              {{ item.paramCName }}
            </el-tag>
          </div>
        </div>
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
import { setSerialNumber } from "@m/utils/array";
import { getSessionStorage } from "@m/utils/localStorage.js";
import { packageParamKey } from "@m/utils/paramTree";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_editor_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header_filter";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
    TableHeader,
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
      publishStatus: {
        0: "新增",
        1: "完成",
        2: "登记",
      },
      // 已选参数数组
      tableData: [],
      // 选择参数弹框
      addVisible: false,
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dictList: [],
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "paramCName",
          label: "中文名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "paramKey",
          label: "英文名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          filter: "paraNed",
          isTrue: true,
        },
        {
          prop: "paramDesc",
          label: "描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
        {
          prop: "typeLength",
          label: "类型(长度)",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          isTrue: true,
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "inputSearch",
          model: "paramName",
          placeholder: "请输入字段名称",
          style: {
            width: "260px",
          },
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        paramName: "",
        paraType: "",
        paramDirection: "",
      },
      allFlagObj: {}, //存储全选的状态
      allList: [],
      l5SvcList: [],
      currentPage: 1, //存储当前服务列表的显示页数
      turnPageTotalNum: 10, //存储当前服务列表的总条数
      recordList: [],
      servNm: "",
      editBizLineId: "",
      l5SevNm: "",

      // 表格筛选信息
      checkedColumns: [
        "中文名称",
        "英文名称",
        "是否必输",
        "描述",
        "类型(长度)",
      ],
      checkBoxGroup: [
        { label: "中文名称", disabled: true },
        { label: "英文名称" },
        { label: "是否必输" },
        { label: "描述" },
        { label: "类型(长度)" },
      ],
      reload: 0,
      currentl5Obj: {},
    };
  },
  inject: ["bizLineId"],
  methods: {
    changeColumn(val) {
      this.checkedColumns = val;
      let tempArr = this.checkBoxGroup.filter((i) => !val.includes(i.label));
      let arr = tempArr.map((item) => {
        return item.label;
      });
      this.dictListTables.filter((i) => {
        if (arr.indexOf(i.label) != -1) {
          i.isTrue = false;
        } else {
          i.isTrue = true;
        }
      });
      ++this.reload;
    },
    saveParams() {
      this.$emit("saveParams", this.tableData);
    },
    // tableData数据选中表格中
    isTableData() {
      this.recordList = JSON.parse(JSON.stringify(this.tableData));
      if (this.tableData.length > 0) {
        this.compArr(this.tableData, this.dictList);
      }
    },
    // 对比当前页参数是否被选中过
    compArr(arr1, arr2) {
      arr1.forEach((item) => {
        arr2.forEach((data) => {
          if (item.paramId == data.paramId) {
            data.isPush = item.isPush;
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              data,
              item.isPush ? true : false
            );
            if (item.children?.length) {
              this.compArr(item.children, data.sonParamList);
            }
          }
        });
      });
    },
    showDialog(e, paramDirection) {
      // this.isHandleParamType = e;
      this.allFlagObj = new Map();
      this.editBizLineId = getSessionStorage("func-bizLineId");
      this.formInline.type = e;
      this.formInline.paramDirection = paramDirection;
      this.tableData = [];
      this.L5serviceList = [];
      this.addVisible = true;
      this.currentPage = 1;
      this.servNm = "";
      this.turnPageTotalNum = 0;
      this.reload = 0;
      this.resetSearch();
      this.getL5ServList();
    },
    // 初始化添加输入输出搜索栏
    resetSearch() {
      this.dicPager.currentPage = "1";
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    // async getL5ServList() {
    //   // console.log("eee", this.currentl5Obj, this.editBizLineId, this.bizLineId);
    //   const params = {
    //     content: this.servNm,
    //     // apiServiceType: "D5直连服务|D5自有服务",
    //     // // apiState: "2",
    //     // bkId: "",
    //     // relySys: "",
    //     // beltLine: this.bizLineId || this.editBizLineId,
    //     apiId: this.detailInfo.svcId,
    //     currentPage: this.currentPage,
    //     turnPageShowNum: 999,
    //   };
    //   const res = await this.rpc.d4.getAssociatedSelfServiceList(params);

    //   this.l5SvcList = res.apiInfoList.map((apiInfo) => {
    //     let actionId = "";
    //     for (let id in this.compositeIdMapToParamList) {
    //       if (this.compositeIdMapToParamList[id].svcId == apiInfo.apiId) {
    //         actionId = id;
    //         break;
    //       }
    //     }
    //     apiInfo.actionId = actionId;
    //     return apiInfo;
    //   });
    //   if (res.apiInfoList.length > 0) {
    //     this.d4bServClick(this.l5SvcList[0]);
    //   }
    //   if (!res.apiInfoList.length) {
    //     this.l5SevNm = "";
    //     this.dictList = [];
    //     this.l5SvcList = [];
    //     this.dicPager.total = 0;
    //   }
    // },
     async getL5ServList() {
      // console.log("eee", this.currentl5Obj, this.editBizLineId, this.bizLineId);
      const params = {
        content: this.servNm,
        // apiServiceType: "D5直连服务|D5自有服务",
        // // apiState: "2",
        // bkId: "",
        // relySys: "",
        // beltLine: this.bizLineId || this.editBizLineId,
        apiId: this.detailInfo.svcId,
        currentPage: this.currentPage,
        turnPageShowNum: 999,
      };
      const res = await this.rpc.d4.getAssociatedSelfServiceList(params);
      this.allList = res.apiInfoBeanList;
      this.l5SvcList = res.apiInfoBeanList.map((apiInfo) => {
        let actionId = "";
        for (let id in this.compositeIdMapToParamList) {
          if (this.compositeIdMapToParamList[id].svcId == apiInfo.apiId) {
            actionId = id;
            break;
          }
        }
        apiInfo.actionId = actionId;
        return apiInfo;
      });
      if (res.apiInfoBeanList.length > 0) {
        this.d4bServClick(this.l5SvcList[0]);
      }
      if (!res.apiInfoBeanList.length) {
        this.l5SevNm = "";
        this.dictList = [];
        this.l5SvcList = [];
        this.dicPager.total = 0;
      }
    },
    search() {
      // this.currentPage = 1;
      // this.getL5ServList();

      this.currentPage = 1;
        this.l5SvcList = this.allList.filter((item) => {
        if (item.apiName.includes(this.servNm)) {
          return item;
        }
      });
      if (this.l5SevcList?.length) {
        this.d4bServClick(this.l5SvcList[0]);
      } else {
        // this.dictListTables = []
      }
    },
    goSearch() {
      this.dicPager.currentPage = "1";
      if (this.l5SvcList.length) {
        this.getFiledList();
      }
    },
    resetFields() {
      this.formInline.paramName = "";
      this.dicPager.currentPage = "1";
      if (this.l5SvcList.length) {
        this.getFiledList();
      }
    },
    handleCancel(e) {
      console.log("handleCancel", e);
      this.radioHeader = 0;
      this.addVisible = false;
      this.tableData = [];
      this.clearAll(this.dictList);
    },
    d4bServClick(e) {
      this.currentl5Obj = e;
      this.l5SevNm = e.apiName;
      this.dicPager.turnPageShowNum = 10;
      this.dicPager.currentPage = 1;
      this.formInline.paramName = "";
      this.getFiledList();
    },
    handleDicSizeChange(e) {
      this.dicPager.turnPageShowNum = e;
      this.getFiledList();
    },
    handleDicCurrentChange(e) {
      this.getFiledList();
    },
    //字段
    async getFiledList() {
      Promise.all([
        this.rpc.d4.getL5ServField({
          apiId: this.currentl5Obj.apiId,
          paramName: this.formInline.paramName,
          // currentPage: this.dicPager.currentPage + "",
          // turnPageShowNum: this.dicPager.turnPageShowNum,
          currentPage: "1",
          turnPageShowNum: 1000,
        }),
        this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: this.currentl5Obj.apiId,
          d4bApiId: this.currentServObj.apiId,
          bizDomainNo: this.currentServObj.beltLine,
        }),
      ]).then((resArr) => {
        const res = resArr[0];
        const allParamList = JSON.parse(JSON.stringify(resArr[1].paramList));
        res.paramList.map((item) => {
          item.typeLength = `${item.paramType}（${item.paramLength}）`;
        });
        // const paramDirection = this.formInline.type == "s" ? "0" : "1";
        const paramDirection = this.formInline?.paramDirection;
        if (paramDirection == "1") {
          this.setFiledSourceAndSourceValue(res.paramList, allParamList);
        }
        this.radioModel = {};
        this.dictList = setSerialNumber(res.paramList, "", "sonParamList");
        this.dictList = this.dictList.filter(
          (item) => item.paramDirection == paramDirection
        );
        this.dicPager.total = res.turnPageTotalNum * 1;
        this.$nextTick(() => {
          this.isTableData();
        });
      });
      // const param = {
      //   apiId: this.currentl5Obj.apiId,
      //   paramName: this.formInline.paramName,
      //   currentPage: this.dicPager.currentPage + "",
      //   turnPageShowNum: this.dicPager.turnPageShowNum,
      // };
      // const res = await this.rpc.d4.getL5ServField(param);
      // res.paramList.map((item) => {
      //   item.typeLength = `${item.paramType}（${item.paramLength}）`;
      // });
      // this.radioModel = {};
      // this.dictList = setSerialNumber(res.paramList, "", "sonParamList");
      // this.dicPager.total = res.turnPageTotalNum * 1;
      // this.$nextTick(() => {
      //   this.isTableData();
      // });
    },
    /**
     * @description:
     * @param {*} paramList 需要设置来源和来源值的参数列表
     * @param {*} allParamList 全量参数列表
     * @return {*}
     */
    setFiledSourceAndSourceValue(paramList, allParamList) {
      paramList.forEach((item) => {
        item.actionId = this.currentl5Obj.actionId;
        item.actionName = this.currentl5Obj.apiName;
        item.paraMapgNm = item.paramCName;
        const _item = allParamList.find(
          (param) =>
            param.paramCName == item.paramCName &&
            param.paramKey == item.paramKey &&
            param.paramDirection == "1"
        );
        item.paramMappingKey = _item
          ? packageParamKey(_item, allParamList)
          : "";
        item.apSource = "20";
        if (item.sonParamList?.length) {
          this.setFiledSourceAndSourceValue(item.sonParamList, allParamList);
        }
      });
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      let index = this.dictList.findIndex((item) => item.paramId == e.paramId);
      // let index = -1
      this.dictList.forEach((item) => {
        if (item.paramId == e.paramId) {
          item.isPush = 0;
        }
      });
      if (index == -1) {
        this.recordList.forEach((item) => {
          if (item.paramId == e.paramId) {
            item.isPush = 0;
            this.tableData = this.tableData.filter(
              (it) => it.paramId != e.paramId
            );
          }
        });
      }
      if (index != -1) {
        this.tableData = this.tableData.filter((it) => it.paramId != e.paramId);
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
      // console.log(e, "delParamsTag",index,this.tableData,this.recordList);
    },
    //全选
    selectAll(data) {
      const page = this.dicPager.currentPage;
      const apiId = this.currentl5Obj.apiId;
      let allFlag = true;
      if (this.allFlagObj.has(apiId)) {
        const id = this.allFlagObj.get(apiId);
        id[page] = id[page] ? !id[page] : true;
        allFlag = id[page];
        this.allFlagObj.set(apiId, id);
      } else {
        this.allFlagObj.set(apiId, { [page]: allFlag });
      }
      this.checkChildren(this.dictList, allFlag);
      this.getId(this.dictList);
    },
    // 多选
    checkSelect(data, row) {
      row.isPush = row.isPush ? false : true;
      if (row.sonParamList.length) {
        // 将子参数全部选中
        this.checkFun(row.sonParamList, row.isPush);
      }
      if (row.isPush) {
        // 去找当前选中的参数是否存在父节点,选中父节点
        this.CheckParentFun(this.dictList, row.serialNumber);
      } else {
        // 清空父节点
        this.clearParentFun(this.dictList, row.serialNumber);
      }
      this.tableData = [];
      this.getId(this.dictList);
    },
    // 子节点全部取消父节点清空
    clearParentFun(table, serialNumber) {
      let i = serialNumber.lastIndexOf(".");
      let pid =
        serialNumber.indexOf(".") != "-1"
          ? serialNumber.substring(0, i)
          : serialNumber;
      table.forEach((element) => {
        if (element.serialNumber.indexOf(pid) !== -1) {
          if (element.serialNumber == serialNumber) {
            element.isPush = 0;
            this.clearRecord(this.recordList, element);
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              element,
              false
            );
          } else if (element.sonParamList && element.sonParamList > 0) {
            this.clearParentFun(element.sonParamList, serialNumber);
            let arr = element.sonParamList.filter((elementb) => {
              return elementb.isPush;
            });
            if (!arr.length) {
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                element,
                false
              );
            }
          }
        }
      });
    },
    // 递归选中
    checkFun(data, status) {
      data.forEach((element) => {
        element.isPush = status;
        this.clearRecord(this.recordList, element);
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          element,
          element.isPush ? true : false
        );
        if (element.sonParamList) {
          this.checkFun(element.sonParamList, element.isPush);
        }
      });
    },
    // 选中子节点
    checkChildren(data, flag) {
      data.forEach((item) => {
        item.isPush = flag;
        this.clearRecord(this.recordList, item);
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          item,
          flag
        );
        if (item.sonParamList.length) {
          this.checkChildren(item.sonParamList, flag);
        }
      });
    },
    // 父节点选中
    CheckParentFun(table, serialNumber) {
      let i = serialNumber.lastIndexOf(".");
      //如果传过来的序列号存在小数点，则删除最后一个小数点及后的数字，否则就是要当前序列号
      let pid =
        serialNumber.indexOf(".") != "-1"
          ? serialNumber.substring(0, i)
          : serialNumber;
      table.forEach((element) => {
        // 将当前参数序列号的最后一位截取掉，再和pid进行判断是否相符
        // 如果是子参数，找到父参数并选中父参数
        if (pid.includes(element.serialNumber)) {
          element.isPush = 1;
          this.clearRecord(this.recordList, element);
          this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
            element,
            true
          );
          // 如果当前参数的序列号存在小数点，则代表不是最初始的父参数
          let parentFlag = element.serialNumber.indexOf(".");
          // 如果子参数的父参数还存在父id，就继续往上找
          if (parentFlag == "-1") {
            this.CheckParentFun(element.sonParamList, serialNumber);
          }
        }
      });
    },
    // 清空记录
    clearRecord(data, e) {
      data.forEach((item) => {
        if (e.paramId == item.paramId) {
          item.isPush = e.isPush;
        } else if (item.children.length) {
          this.clearRecord(item.children, e);
        }
      });
    },
    clearAll(data) {
      data.forEach((item) => {
        item.isPush = 0;
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          item,
          false
        );
        if (item.sonParamList.length) {
          this.clearAll(item.sonParamList);
        }
      });
    },
    // 获取选中ID
    getId(data) {
      let arr = [];
      data.map((element) => {
        if (element.isPush) {
          let temp = this.recordList.filter(
            (item) => item.paramId == element.paramId
          );
          if (!temp.length) {
            arr.push(element);
          }
        }
      });
      arr = JSON.parse(
        JSON.stringify(arr).replace(/sonParamList/g, "children")
      );
      let recordList = this.recordList.filter((item) => item.isPush);
      this.tableData = [...recordList, ...arr];
      // this.tableData = recordList;
      // console.log("getId",arr,recordList,this.tableData)
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";

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
  .status_0 {
    color: #ff5f5f;
    background: #ffefee;
    border: 0.5px solid #ff5f5f;
  }
  .status_1{
    background: #409eff;
    color: #ffffff;
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
.create_dialog {
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
  .status_0 {
    color: #ff5f5f;
    background: #ffefee;
    border: 0.5px solid #ff5f5f;
  }
  .status_1{
    background: #409eff;
    color: #ffffff;
    border: 0.5px solid #409eff;
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
