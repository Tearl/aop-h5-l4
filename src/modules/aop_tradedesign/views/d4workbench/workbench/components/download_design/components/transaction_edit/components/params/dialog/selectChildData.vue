<template>
  <div class="aop_tradedesign_download_design_comps_add_user_undefined_child">
    <PageDialog
      :dialogWidth="'60%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
          <ServiceTop
            ref="formRef"
            :serviceForm="serviceForm"
            :form="searchRecord"
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
              <el-button size="small" @click="resetFields" class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>
          <div class="content">
            <Table
              class="table_style"
              :data="dictList"
              :table="dictListTables"
              ref="dictListTableRef"
              :rowK="'serialNumber'"
              :tableType="'selection'"
              :cellStyle="dictListCellStyle"
              @select="checkSelect"
              @selectAll="selectAll"
            ></Table>
            <!-- 分页器 -->
            <PagePagination
              @size-change="handleDicSizeChange"
              @current-change="handleDicCurrentChange"
              :pager="dicPager"
            >
            </PagePagination>
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
              @close="delParamsTag(item)"
            >
              {{ item.dictryNm }}
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
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import validate from "@m/utils/validate";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  props: {},
  data() {
    return {
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
          prop: "dictryNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryGategName",
          label: "所属分类",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "switch",
          model: "preciseQuery",
          label: "精确查询",
          activeValue: "1",
          inactiveValue: "0",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "paraGateg",
          placeholder: "所属分类",
          select: [],
          filterable: true,
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数类型",
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
      allFlagObj: {}, //存储全选的状态
      recordList: [],
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      },
    };
  },
  methods: {
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
    saveParams() {
      let data = this.filterChild(this.tableData);
      this.$emit("addChildParams", data);
      this.handleCancel();
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
    showDialog() {
      this.allFlagObj = new Map();
      this.tableData = [];
      this.addVisible = true;
      this.getList();
      this.getClassifyTypeList();
    },
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraGateg").select =
        selectList;
    },
    goSearch() {
      this.dicPager.currentPage = "1";
      this.getList();
    },
    resetFields() {
      this.dicPager.currentPage = "1";
      this.$refs.formRef.resetFields();
      this.searchRecord = {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      };
    },
    handleCancel(e) {
      console.log("handleCancel", e);
      this.addVisible = false;
      this.tableData = [];
      this.resetFields();
      this.clearAll(this.dictList);
    },
    handleDicSizeChange(e) {
      this.dicPager.turnPageShowNum = e;
      this.getList();
    },
    handleDicCurrentChange(e) {
      this.getList();
    },
    //字段
    async getList() {
      const param = {
        ...this.searchRecord,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
      };
      const res = await this.rpc.dictionary.getDictionaryList(param);
      this.dictList = setSerialNumber(
        res.dictionariesInfoBoList,
        "",
        "children"
      );
      this.dicPager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
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
          item.isPush = false;
        }
      });
      if (index == -1) {
        this.recordList.forEach((item) => {
          if (item.dictryId == e.dictryId) {
            item.isPush = false;
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
    //全选
    selectAll(data) {
      let allFlag = true;
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
            element.isPush = false;
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
          element.isPush = true;
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
        item.isPush = false;
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
      //   console.log("子参数选中", arr, recordList, this.tableData);
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_download_design_comps_add_user_undefined_child {
  .create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }

    .add_dialog_conf1 {
      width: 100%;

      .search_conf {
        padding: 0 24px;
      }
      .content {
        // height: 436px;
        padding: 0 24px;
        margin-top: 12px;
        background: #fff;
        // overflow: scroll;
      }
    }
  }

  .show_conf {
    padding-bottom: 10px;
    position: relative;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    z-index: 9;
    border-bottom: 1px solid #e7e7e7;
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
    padding-top: 14px;
  }
}
</style>