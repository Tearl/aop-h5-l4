<template>
  <div class="aop_tradedesign_comps_dicmgmt_object_attr_list">
    <div v-if="flag == 'list'" class="content_wrapper_box fixed">
      <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="searchForm">
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
      <div class="content_wrapper">
        <TableHeader
          title="元数据管理"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader>

        <TableMate :data="dictionaryList" :table="tables" @operate="operate" @selectionChange="handleSelectionChange" :cellStyle="dictListCellStyle" rowK="serialNumber" tableType="selection">

        </TableMate>
        <!-- 分页器 -->
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
    </div>
    <div v-if="flag == 'view'" class="content_wrapper_box">
      <DicView
        :dictryId="dictryId"
        @toDicList="toDicList"
        dicType="pubView"
        type='3'
      ></DicView>
    </div>

    <!-- 迁移数据弹窗 -->
    <DataTransfer
      :dialogVisiable="transferVisible"
      :selectedData="selectedData"
      :searchForm="searchForm"
      :classifyOptions="classifyOptions"
      @closeDialog="transferVisible = fasle"
      @confirm="transferVisible = fasle"
      @getList="getList"
    >
    </DataTransfer>

    <PageUploadBox
      dialogTitle="导入数据"
      :dialogVisiable="uploadDialog"
      dialogWidth="30%"
      :actionUrl="actionUrl"
      :data="{beltLine: beltLine}"
      @uploadFile="uploadFile"
      @closeDialog="uploadDialog = false"
      @download="download"
      @refresh="getList"
      @radioChange="radioChange"
    ></PageUploadBox>

    <PagePop
      desc="确定导出数据吗"
      :isPopCompleteShow="isExportPop"
      @handleCancel="closeExportPop"
      @handleConfirm="download('export')"
    ></PagePop>

    <PagePop
      desc="确定要批量删除数据吗"
      :isPopCompleteShow="isMultipleDeletePop"
      @handleCancel="isMultipleDeletePop = false"
      @handleConfirm="multipleDelete"
    ></PagePop>

    <!-- 规则详情 -->
    <PageDialog
      dialogTitle="验证规则详情"
      :dialogVisiable="ruleDetailsDialogVisible"
      dialogWidth="50%"
      @closeDialog="ruleDetailsDialogVisible = false"
    >
      <div slot="box">
        <Table
          class="table_dialog"
          :data="detailsData"
          :table="detailsDataTables"
        ></Table>
      </div>
      <span slot="footer">
        <el-button @click="ruleDetailsDialogVisible = false">取 消</el-button>
      </span>
    </PageDialog>
    <selcFromMateData ref="selectFromMateDataRef" selectType="selection" @confirmData="confirmData"></selcFromMateData>
    <!-- 新增属性 -->
    <!-- <AddAttr ref="addAttrRef"></AddAttr> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import DataTransfer from "../sys_dic/components/dic_list/transfer";
import DicView from "../dic_view";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import PageUploadBox from "@m/core/components/page_upload_box"; // 上传文件弹框
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import TableHeader from "@m/core/components/page_table_header";
import PagePop from "@m/core/components/page_pop";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import filters from "@m/utils/filters";
// import AddAttr from "./components/dialog/add_attr";
import selcFromMateData from "../dialog/selcFromMateData.vue"
import TableMate from "@m/core/components/page_table_metadata" // 公共表格组件

export default {
  mixins: [mixin],
  props: {}, 
  components: {
    DataTransfer,
    PageDialog,
    PagePagination,
    PageUploadBox,
    Table,
    ServiceTop,
    TableHeader,
    PagePop,
    DicView,
    // AddAttr,
    selcFromMateData,
    TableMate
  },
  props: {
    flag: {
      type: String,
      default: () => "",
    },
    dictryId: {
      type: String,
      default: () => "",
    },
    beltLine:{
      type: String,
      default:() =>""
    }
  },
  data() {
    return {
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名、英文名",
          style: {
            width: "300px",
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
          type: "input",
          model: "dictryKeyWord",
          placeholder: "搜索关键字",
          style: {
            width: "127px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraGateg",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        //   style: {
        //     width: "100px",
        //   },
        // },
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
      // 搜索信息表单
      searchForm: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
      },
      //保存数据分类下拉列表的数据
      classifyOptions: [],
      // 规则详情表格参数
      detailsDataTables: [
        {
          prop: "ruleNo",
          label: "规则名称",
          minWidth: "20%",
          type: "text",
        },
        {
          prop: "ruleNm",
          label: "规则中文名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleDescr",
          label: "验证描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleExps",
          label: "正则表达式",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleTip",
          label: "提示信息",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
      ],
      // 字典列表参数
      tables: [
        {
          prop: "dictryNo",
          label: "参数名称",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          // width: "120",
          label: "中文名",
          type: "textClick",
          operate: "detail",
          tooltip: true,
        },
        {
          prop: "attributeTypNm",
          label: "属性分类",
          width: "120",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          width: "120",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryKeyWord",
          label: "关键字",
          width: "120",
          align: "center",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryLength",
        //   label: "最大长度",
        //   // width: "90",
        //   align: "center",
        //   type: "text",
        // },
        {
          prop: "creatrNm",
          label: "创建人",
          // minWidth: "90",
          width: "120",
          type: "text",
        },
        {
          prop: "crtTm",
          label: "创建时间",
          // minWidth: "120",
          width: "120",
          type: "text",
          filter: "crtTm",
          tooltip: true,
        },
        {
          width: "140",
          label: "操作",
          type: "button",
          fixed: "right",
          align: "center",
          buttonList: [
            // {
            //   desc: "配置验证规则",
            //   operate: "config",
            //   authName: "assetDispose:dictionary:config",
            //   relation: function (scope) {
            //     return (
            //       (scope.row.dictryTyp == "0" ||
            //         scope.row.dictryTyp == "String") &&
            //       scope.row.dictryPid == ""
            //     );
            //   },
            // },
            {
              desc: "新增属性",
              operate: "edit",
              relation: function (scope) {
                return !scope.row.dictryPid;
              },
            },
            // {
            //   desc: "示例",
            //   operate: "example",
            //   authName: "assetDispose:dictionary:example",
            //   relation: function (scope) {
            //     return (
            //       scope.row.dictryTyp !== "List" &&
            //       scope.row.dictryTyp !== "Object"
            //     );
            //   },
            // },
            {
              desc: "删除",
              operate: "delete",
              // authName: "designWorkgate:dictionary:delete",
            },
          ],
        },
      ],
      //字典数据集合
      dictionaryList: [],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      //控制迁移数据对话框显示或隐藏
      transferVisible: false,
      //控制导入数据对话框显示或隐藏
      uploadDialog: false,
      // 选中的数据
      selectedData: [],
      //上传文件的地址
      actionUrl: "",
      // 查看验证规则弹框
      ruleDetailsDialogVisible: false,
      // 查看验证规则详情表单
      detailsData: [],
      // 表格头部按钮
      btnList: [
        {
          name: "批量删除",
          value: "multipleDelete",
          type: "normal",
          imgSrc: "",
          iconClass: "el-icon-delete",
          // authName: "assetDispose:dictionary:delete",
          // authName: "designWorkgate:dictionary:delete",
        },
        {
          name: "导入数据",
          value: "import",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_import.png"),
          iconClass: "",
          // authName: "assetDispose:dictionary:import",
          // authName: "designWorkgate:dictionary:import",
        },
        {
          name: "导出数据",
          value: "export",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_export.png"),
          iconClass: "",
          // authName: "assetDispose:dictionary:export",
          // authName: "designWorkgate:dictionary:export",
        },
        // {
        //   name: "迁移数据",
        //   value: "transfer",
        //   type: "normal",
        //   imgSrc: require("@m/assets/images/icon_transfer.png"),
        //   iconClass: "",
        //   // authName: "assetDispose:dictionary:transfer",
        //   authName: "designWorkgate:dictionary:transfer",
        // },
        // {
        //   name: "分类维护",
        //   value: "classify",
        //   type: "normal",
        //   imgSrc: require("@m/assets/images/icon_classification.png"),
        //   iconClass: "",
        //   // authName: "assetDispose:dictionary:classify",
        //   authName: "designWorkgate:dictionary:classify",
        // },
        {
          name: "验证规则",
          value: "rule",
          type: "normal",
          imgSrc: "",
          iconClass: "el-icon-document",
          // authName: "assetDispose:dictionary:classify",
          // authName: "designWorkgate:dictionary:validationRule",
        },
        {
          name: "创建元数据",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
          // authName: "assetDispose:dictionary:create",
          // authName: "designWorkgate:dictionary:addDictionary",
        },
      ],
      //导出数据
      isExportPop: false,
      // 批量删除提示弹框
      isMultipleDeletePop: false,
      dictryId: "",
      begins: "",
      flag: "list",
      tableData: [
        {
          dataSubstnNo: "2",
          fieldList: [
            {
              dictNo: "测序",
            },
          ],
        },
      ],
      expandKeys: [],
      iInputList: [],
      selectData: {},
    };
  },
  methods: {
    async editDictionary() {
      let params = this.selectData
      params.dictChildList = this.iInputList
      params.dictryLength = ""
      params.beltLine = this.beltLine
      console.log(params, this.selectData)
      const res = await this.rpc.systemmgmt.editPublicDictionary(params)
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      })
      this.getList();
    },
    confirmData(data) {
      this.iInputList = setSerialNumber(
        unduplicated(this.iInputList.concat(data), "dictryId")
      )
      this.editDictionary()
      console.log(this.iInputList, "dddd")
    },
    // 点击搜索按钮
    search() {
      Object.assign(this.searchRecord, this.searchForm);
      this.getList();
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    //操作
    async operate(operation, data) {
      this.dictryId = data.dictryId;
      console.log("operate", this.dictryId);
      if (operation == "delete") {
        this.$confirm("确定要删除吗？").then(async () => {
          const dictIdList = [{ dictryId: data.dictryId }];
          const params = { dictIdList };
          const res = await this.rpc.systemmgmt.deletePublicDictionary(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          if (this.dictionaryList.length <= 1) {
            this.pager.currentPage = "1";
          }
          this.getList();
        });
      } else if (operation == "detail") {
        this.$nextTick(() =>{
          this.flag = "view";
        })
        // this.flag = "view";
        // this.$emit("toDetail", false);
        // this.$emit(
        //   "getDataDictionProd",
        //   { v: "公共数据字典详情", k: "dd", closable: true },
        //   data.dictryId
        // );

        // this.$router.push({
        //   path: "/aop_tradedesign/dicmgmt/dicDetail",
        //   query: { dictryId: data.dictryId, type: "public" },
        // });
      } else if (operation == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/modDictionary",
          query: { dictryId: data.dictryId, type: "addAttr" },
        });
      } else if (operation == "read") {
        const params = {
          ruleId: data.dictryRule,
        };
        const res = await this.rpc.systemmgmt.idGetRuleList(params);
        this.detailsData = [res];
        this.ruleDetailsDialogVisible = true;
      } else if (operation == "config") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/rule",
          query: {
            dictryId: data.dictryId,
            type: "public",
          },
        });
      } else if (operation == "configRead") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/rule",
          query: {
            dictryId: data.dictryId,
            pageType: "read",
            type: "public",
          },
        });
      } else if (operation == "example") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/dicExampleList",
          query: {
            dictryId: data.dictryId,
            type: "public",
          },
        });
      }
    },
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0", excludeClsfId: "10000000" };
      const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
      this.classifyOptions = res.serviceList;
      this.serviceForm[3].select = res.serviceList.map((item) => {
        item.type = item.clsfNm;
        item.value = item.clsfId;
        return item;
      });
    },
    // 获取字典列表数据
    async getList() {
      const { content, preciseQuery, dictryKeyWord, paraType, paraGateg } =
        this.searchForm;
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        begins: this.begins == "All" ? "" : this.begins,
        content,
        preciseQuery,
        dictryKeyWord,
        paraType,
        paraGateg,
        attributeTyp: "3",//0-普通属性，1-对象属性，2-枚举属性，3-列表属性，4-自定义属性
        beltLine:this.beltLine,        
      };
      const res = await this.rpc.systemmgmt.getDictionaryList(data);
      this.dictionaryList = setSerialNumber(res.dictionariesInfoBoList);
      this.pager.total = res.turnPageTotalNum * 1;
    },
    // 每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
    // 点击创建按钮，跳转页面到创建字典页面
    newDictionary() {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/addDictionary",
        query: {
          type: "public",
        },
      });
    },
    //关闭确认导出POP
    closeExportPop() {
      this.isExportPop = false;
    },
    //点击btnList里的按钮
    handleBtnClik(btn) {
      switch (btn) {
        case "multipleDelete":
          if (
            this.selectedData.length == 0 &&
            !this.searchForm.content &&
            !this.searchForm.dictryKeyWord &&
            !this.searchForm.paraType &&
            !this.searchForm.paraGateg
          ) {
            return this.$message.warning(
              "请勾选需要批量删除的数据或通过搜索进行匹配"
            );
          }
          this.isMultipleDeletePop = true;
          return;
        case "transfer":
          if (
            this.selectedData.length == 0 &&
            !this.searchForm.content &&
            !this.searchForm.dictryKeyWord &&
            !this.searchForm.paraType &&
            !this.searchForm.paraGateg
          ) {
            return this.$message.warning(
              "请勾选需要迁移的数据或通过搜索进行匹配"
            );
          }
          return (this.transferVisible = true);
        case "classify":
          return this.$router.push("/aop_tradedesign/dicmgmt/classify");
        case "import":
          this.uploadDialog = true;
          this.actionUrl = this.rpc.file.batchUpUrl();
          return;
        case "export":
          if (
            this.selectedData.length == 0 &&
            !this.searchForm.content &&
            !this.searchForm.dictryKeyWord &&
            !this.searchForm.paraType &&
            !this.searchForm.paraGateg
          ) {
            return this.$message.warning(
              "请勾选需要导出的数据或通过搜索进行匹配"
            );
          }
          this.isExportPop = true;
          return;
        case "rule":
          return this.$router.push({
            path: "/aop_tradedesign/dicmgmt/ruleList",
          });
        case "create":
          this.newDictionary();
          return;
        default:
          return;
      }
    },
    // 点击批量删除按钮
    async multipleDelete() {
      const dictIdList = this.selectedData.map((item) => ({
        dictryId: item.dictryId,
      }));
      const params = { dictIdList };
      const res = await this.rpc.systemmgmt.deletePublicDictionary(params);
      this.$notify({
        title: "成功",
        message: "删除成功",
        duration: 2000,
        type: "success",
      });
      if (this.dictionaryList.length <= 1) {
        this.pager.currentPage = "1";
      }
      this.getList();
      this.isMultipleDeletePop = false;
    },
    // 导入是否覆盖
    radioChange (e) {
      // if (e == "1") {
      //   this.actionUrl = this.rpc.file.batchUpUrl({ isCover: "1", beltLine: this.beltLine })
      // } else {
      //   this.actionUrl = this.rpc.file.batchUpUrl({ isCover: "0", beltLine: this.beltLine  })
      // }
    },
    // 多选框变化时
    handleSelectionChange(e) {
      this.selectedData = e;
    },
    // 模板下载或导出
    async download(e) {
      const params = {
        isTemplate: e == "export" ? "0" : "1",
        dictryIdList: this.selectedData.map((item) => item.dictryId),
        content: this.searchForm.content,
        dictryKeyWord: this.searchForm.dictryKeyWord,
        paraType: this.searchForm.paraType,
        paraGateg: this.searchForm.paraGateg,
      };
      const res = await this.rpc.systemmgmt.exportDictionaryList(params);
      const downLoadUrl = this.$replaceUrl(res.downLoadUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "";
      a.href = downLoadUrl;
      a.click();
      this.uploadDialog = false;
      this.isExportPop = false;
    },
    // 子参数没有多选框
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    //点击详情的返回按钮
    toDicList() {
      this.flag = "list";
      this.getList()
      this.$emit("toDetail", true);
    },
    // 初始化
    init() {
      this.getList();
      // this.getClassifyTypeList();
      this.flag = this.flag;
    },

    async handleExpandChange(data, arr) {
      console.log("ces")
      this.expandKeys = this.expandKeys.filter(
        (item, index) => this.expandKeys.indexOf(item) === index
      );
    },
    expandChangeFn() {},

    operateFn(type,data) {
      console.log("测试",type,data)
      if(type == "edit") {
        // 点击创建按钮，跳转页面到创建字典页面
        this.iInputList = data.children
        this.selectData = data
        this.$nextTick(() => {
          this.$refs.selectFromMateDataRef.showDialog()
        })
        // this.$router.push({
        //   path: "/aop_tradedesign/dicmgmt/addDictionary",
        //   query: {
        //     type: "addAttr",
        //     dictryId: data.dictryId,
        //   },
        // })
        return
      } else if (type == "del") {
        this.$confirm("确定要删除吗？").then(async () => {
          const dictIdList = [{ dictryId: data.dictryId }];
          const params = { dictIdList };
          const res = await this.rpc.systemmgmt.deletePublicDictionary(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          if (this.dictionaryList.length <= 1) {
            this.pager.currentPage = "1";
          }
          this.getList();
        });
      } 
    },
    resetPage(){
      this.pager = {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      }
    }
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_object_attr_list {
  // display: flex;
  // padding: 16px;
  // padding-left: 332px;
  .content_wrapper {
    padding: 16px 24px;
    background-color: $base_white;
  }
  .content_wrapper_box {
    width: 100%;
    overflow-x: hidden;
    // margin-top:10px;
  }
  // .fixed {
  //   // margin-top: 20px;
  // }
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .btn_style {
    cursor: pointer;
  }
  .add {
    color: #358aff;
  }
  .del {
    color: #fe4758;
  }
}
</style>
