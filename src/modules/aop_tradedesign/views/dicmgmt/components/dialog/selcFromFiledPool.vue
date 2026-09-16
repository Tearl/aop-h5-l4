<template>
  <div class="aop_workgate_comps_dicmgmt_dic_form_select">
    <!-- 从字段池中选择 -->
    <PageDialog
      dialogTitle="从字段池中选择"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
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
        <Table
          ref="dictListTableRef"
          class="table_style"
          :table="tables"
          :data="dictionaryData"
          @radioChange="radioChange"
          @operate="operate"
        ></Table>
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
        <!-- <div class="show_conf">
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
              {{ item.dictryNm }}
            </el-tag>
          </div>
        </div> -->
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <!-- <SubsectionDetail ref="subsectioDetailRef"></SubsectionDetail> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
// import SubsectionDetail from "./detail/subsectionDetail";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    // SubsectionDetail
  },
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: () => false
    // },
    dictGategList: {
      type: Array,
      default: () => false
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 数据字典选择公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索字段名称、中文名或描述",
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
          model: "paraType",
          placeholder: "参数值类型",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            // { type: "List", value: "List" },
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
            // { type: "Object", value: "Object" },
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 数据字典搜索信息表单
      form: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: ""
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: ""
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
          prop: "dictryId",
          label: "",
          minWidth: "10%",
          type: "radio",
        },
        {
          prop: "dictryNo",
          label: "字段Key",
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
          label: "字段描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
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
          label: "创建人",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "创建时间",
          minWidth: "30%",
          type: "text",
        },
      ],
      // 数据字典选择列表
      dictionaryData: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],
    }
  },
  methods: {
    showDialog() {
      this.getList();
      this.dialogVisible = true
    },
    operate(operation, data) {
      console.log(operation,data)
      if(operation == "read") {
        this.$refs.subsectioDetailRef.showDialog();
      }
    },
    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 获取字典列表数据
    async getList() {
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        isBaseType: "1",
        ...this.searchRecord
      };
      const res = await this.rpc.dictionary.getDictionaryList(data);
      // this.dicGetNodeId(res.dictionariesInfoBoList);
      this.dictionaryData = JSON.parse(
        JSON.stringify(res.dictionariesInfoBoList)
      );
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictionaryData.forEach((data) => {
            if (item.dictryId == data.dictryId) {
              this.isRecord = true;
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
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
      this.dialogVisible = false
    },
    radioChange(e, data) {
      this.selectionData = data;
      console.log(this.selectionData)
    },
    confirm() {
      this.$emit("confirmData", this.selectionData);
      this.closeDialog()
    },
    // 初始化
    init() {
      // this.getList();
      // this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_dicmgmt_dic_form_select {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
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
}
</style>
