<template>
  <div class="aop_tradedesign_comps_dicmgmt_addUserDesign">
    <PageDialog
      dialogTitle="选择元数据"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box">
        <ServiceTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          class="service_top"
        >
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="right_button"
              >搜索</el-button
            >
            <el-button size="small" @click="reset" class="right_button"
              >重置</el-button
            >
          </div>
        </ServiceTop>
        <div class="content">
          <div class="table_operate">
            <div class="header_content">
              <h1>现有元数据列表</h1>
              <div class="btn">
                <el-button
                  type="primary"
                  @click="addMateData"
                  class="btn_style"
                  icon="el-icon-plus"
                  >新增元数据</el-button
                >
              </div>
            </div>
          </div>
          <Table
            ref="dictListTableRef"
            class="table_style"
            :table="tables"
            :data="dictList"
            :rowK="'serialNumber'"
            :treeProps="{ children: 'children' }"
            :tableType="'selection'"
            @select="checkSelect"
            @selectAll="selectAll"
            @operate="operate"
          ></Table>
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
        </div>
      </div>
      <span slot="footer">
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
              @close="delParamsTag(item)"
            >
              {{ item.dictryNm }}
            </el-tag>
          </div>
        </div>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <AddMateData ref="addMateDataRef" @confirmMate="getList"></AddMateData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import AddMateData from "./addMateData";
import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    AddMateData,
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      serviceForm: [
        {
          type: "inputIcon",
          model: "content",
          placeholder: "请输入",
          labelText: "参数名称:",
        },
        {
          type: "select",
          model: "attributeTyp",
          placeholder: "请选择",
          labelText: "属性分类:",
          select: [
            { value: "", type: "所有属性" },
            { value: "0", type: "普通属性" },
            { value: "1", type: "对象属性" },
            { value: "2", type: "枚举属性" },
            { value: "3", type: "列表属性" },
            { value: "4", type: "自定义属性" },
          ],
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数值类型",
          labelText: "参数值类型:",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 数据字典搜索信息表单
      form: {
        content: "", // 编号或名称或描述
        // preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: "",
        attributeTyp: "",
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        // preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: "",
        attributeTyp: "",
      },
      // 分段列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 分段列表参数
      tables: [
        {
          prop: "dictryNo",
          label: "参数Key",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "字段名称",
          type: "text",
          tooltip: true,
          // operate: "read",
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "分类",
          label: "创建时间",
          minWidth: "30%",
          type: "text",
        },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "字段类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "参数长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
      ],
      // 数据字典选择列表
      dictList: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],
      beltLine: "",
      recordList: [],
      allFlagObj: {}, //存储全选的状态
    };
  },
  methods: {
    showDialog(beltLine) {
      this.searchRecord = {
        content: "",
        paraType: "",
        attributeTyp: "",
      };
      this.allFlagObj = new Map();
      this.getList(beltLine);
      this.init();
      this.dialogVisible = true;
    },
    operate(operation, data) {
      console.log(operation, data);
      if (operation == "read") {
        this.$refs.subsectioDetailRef.showDialog();
      }
    },
    // delParamsTag(e) {
    //   console.log(e, "eeee");
    //   const index = this.dictionaryData.findIndex(
    //     (item) => item.dictryNo == e.dictryNo
    //   );
    //   if (index == -1) {
    //     this.tableData = this.tableData.filter(
    //       (it) => it.dictryNo != e.dictryNo
    //     );
    //   } else {
    //     this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
    //       this.dictionaryData[index],
    //       false
    //     );
    //   }
    // },
    // 多选框选中
    // handleSelectionChange(e) {
    //   if (!this.isRecord && this.selectionData.length > e.length) {
    //     this.selectionData.forEach((item) => {
    //       if (e.indexOf(item) == -1) {
    //         this.tableData = this.tableData.filter(
    //           (it) => it.dictryNo != item.dictryNo
    //         );
    //       }
    //     });
    //   } else {
    //     this.tableData.push(...e);
    //     this.tableData = unduplicated(this.tableData, "dictryNo");
    //   }
    //   this.selectionData = e;
    //   this.isRecord = false;
    // },
    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    // 点击重置按钮
    reset() {
      this.pager.currentPage = "1";
      this.$refs.formRef.resetFields();
      this.searchRecord = {
        content: "", // 编号或名称或描述
        // preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        // dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
        attributeTyp:"",  //属性类型
      };
    },
    // 获取字典列表数据
    async getList(beltLine) {
      this.beltLine = this.$route.query.beltLine || beltLine;
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        // isBaseType: "1",
        ...this.searchRecord,
        beltLine: this.beltLine,
      };
      const res = await this.rpc.dictionary.getDictionaryList(data);
      this.dictList = setSerialNumber(res.dictionariesInfoBoList);
      // this.dicGetNodeId(res.dictionariesInfoBoList);
      // this.dictionaryData = JSON.parse(
      //   JSON.stringify(res.dictionariesInfoBoList)
      // );
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // tableData数据选中表格中
    // isTableData() {
    //   if (this.tableData.length > 0) {
    //     this.tableData.forEach((item) => {
    //       this.dictionaryData.forEach((data) => {
    //         if (item.dictryId == data.dictryId) {
    //           this.isRecord = true;
    //           this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
    //             data
    //           );
    //         }
    //       });
    //     });
    //   }
    // },
    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getList();
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
      this.reset();
      this.tableData = [];
      this.clearAll(this.dictList);
    },
    confirm() {
      let arr = this.filterType(this.tableData);
      this.$emit("confirmData", arr, "", "userDefined");
      this.closeDialog();
    },
    // 初始化
    init() {
      this.beltLine = this.$route.query.beltLine;
      // this.getList();
      // this.getClassifyTypeList();
    },
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraGateg").select =
        selectList;
    },
    addMateData() {
      this.$refs.addMateDataRef.showAddDialog();
    },
    //全选
    selectAll(data) {
      const page = this.pager.currentPage;
      const apiId = "11";
      let allFlag = true;
      if (this.allFlagObj.has(page)) {
        const id = this.allFlagObj.get(page);
        allFlag = !id;
        this.allFlagObj.set(page, allFlag);
      } else {
        this.allFlagObj.set(page, allFlag);
      }
      this.checkChildren(this.dictList, allFlag);
      this.getId(this.dictList);
    },
    // 多选
    checkSelect(data, row) {
      row.isPush = row.isPush ? false : true;
      if (row.children.length) {
        // 将子参数全部选中
        this.checkFun(row.children, row.isPush);
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
          } else if (element.children && element.children > 0) {
            this.clearParentFun(element.children, serialNumber);
            let arr = element.children.filter((elementb) => {
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
        if (element.children) {
          this.checkFun(element.children, element.isPush);
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
        if (item.children.length) {
          this.checkChildren(item.children, flag);
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
            this.CheckParentFun(element.children, serialNumber);
          }
        }
      });
    },
    // 清空记录
    clearRecord(data, e) {
      data.forEach((item) => {
        if (e.dictryId == item.dictryId) {
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
        if (item.children.length) {
          this.clearAll(item.children);
        }
      });
    },
    // 获取选中ID
    getId(data) {
      let arr = [];
      data.map((element) => {
        if (element.isPush) {
          let temp = this.recordList.filter(
            (item) => item.dictryId == element.dictryId
          );
          if (!temp.length) {
            arr.push(element);
          }
        }
      });
      let recordList = this.recordList.filter((item) => item.isPush);
      this.tableData = [...recordList, ...arr];
      // this.tableData = recordList;
    },
    filterType(data) {
      let arr = data.map((params) => {
        return {
          paramKey: params.dictryNo,
          paramCName: params.dictryNm,
          paramLength: params.dictryLength,
          paramValueType: params.dictryTyp,
          paramDesc: params.dictryDescr,
          paramId: params.dictryId,
          apEnum: params.dictryEnum,
          children: params.children ? this.filterType(params.children) : [],
          isPush: params.isPush,
          isNeed: "0",
        };
      });
      return arr;
    },
    // 去除没有被选中的子参数
    filterChild(arr) {
      let data = arr.filter((item, index) => {
        if (item.isPush) {
          if (item.children?.length) {
            item.children = item.children.filter((ii) => {
              return ii.isPush;
            });
          }
        }
        if (item.children && item.children.length) {
          this.filterChild(item.children);
        }
        return item.isPush;
      });
      return data;
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
          if (item.dictryId == data.dictryId) {
            data.isPush = item.isPush;
            this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
              data,
              item.isPush ? true : false
            );
            if (item.children?.length) {
              this.compArr(item.children, data.children);
            }
          }
        });
      });
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      let index = this.dictList.findIndex(
        (item) => item.dictryId == e.dictryId
      );
      // let index = -1
      this.dictList.forEach((item) => {
        if (item.dictryId == e.dictryId) {
          item.isPush = 0;
        }
      });
      if (index == -1) {
        this.recordList.forEach((item) => {
          if (item.dictryId == e.dictryId) {
            item.isPush = 0;
            this.tableData = this.tableData.filter(
              (it) => it.dictryId != e.dictryId
            );
          }
        });
      }
      if (index != -1) {
        this.tableData = this.tableData.filter(
          (it) => it.dictryId != e.dictryId
        );
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
      // console.log(e, "delParamsTag",index,this.tableData,this.recordList);
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_addUserDesign {
  .content {
    padding: 0px 30px;
  }
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }

  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }

  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
}
.dialog {
  .content {
    padding: 0px 30px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .table_operate {
    padding: 16px 0px;
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
  ::v-deep .aop_tradedesign_comps_page_service_top {
    padding: 0;
    margin-bottom: 0;
    // height: 64px;
  }
  ::v-deep .aop_tradedesign_comps_page_service_top .serivce_top {
    padding: 21px 16px;
    height: 64px;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
  }
  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }
  ::v-deep
    .aop_tradedesign_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px;
  }
  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  ::v-deep .el-form-item__label {
    width: 92px !important;
  }
  ::v-deep .show_conf {
    padding: 15px 0px;
    overflow: hidden;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 16px;
    // box-shadow: inset 0 1px 0 0 #F5F5FA;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
