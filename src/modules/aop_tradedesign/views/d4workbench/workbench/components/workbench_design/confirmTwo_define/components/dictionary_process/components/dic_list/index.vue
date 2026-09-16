<template>
  <div class="aop_workgate_comps_systemmgmt_dic_list">
    <TableHeader
      title="数据字典管理"
      :btnList="btnList"
      @btnClick="handleBtnClik"
    ></TableHeader>

    <Table
      :table="tables"
      @operate="operate"
      :data="dictionaryList"
      tableType="selection"
      rowK="serialNumber"
      @selectionChange="handleSelectionChange"
      :cellStyle="dictListCellStyle"
    ></Table>
    <!-- 分页器 -->
    <PagePagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pager="pager"
    >
    </PagePagination>

    <PageUploadBox
      dialogTitle="导入数据"
      :dialogVisiable="uploadDialog"
      dialogWidth="30%"
      :actionUrl="actionUrl"
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
      @handleConfirm="exportDic"
    ></PagePop>

    <PagePop
      desc="确定要批量删除数据吗"
      :isPopCompleteShow="isMultipleDeletePop"
      @handleCancel="isMultipleDeletePop = false"
      @handleConfirm="multipleDelete"
    ></PagePop>

    <!-- 数据字典升级 -->
    <DataUpgrade
      :dialogVisiable="upgradeVisible"
      :selectedData="selectedData"
      :classifyOptions="classifyOptions"
      @closeDialog="upgradeVisible = fasle"
      @confirm="upgradeVisible = fasle"
      @getList="getList"
    >
    </DataUpgrade>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import PageUploadBox from "@m/core/components/page_upload_box"; // 上传文件弹框
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import TableHeader from "@m/core/components/page_table_header";
import PagePop from "@m/core/components/page_pop";
import { setSerialNumber } from "@m/utils/array";
import DataUpgrade from "./upgrade";

export default {
  mixins: [mixin],
  props: {
    searchForm: {
      type: Object,
      default: () => ({}),
    },
    begins: {
      type: String,
      default: () => ""
    }
  },
  components: {
    PageDialog,
    PagePagination,
    PageUploadBox,
    Table,
    ServiceTop,
    TableHeader,
    PagePop,
    DataUpgrade
  },
  data() {
    return {
      // 字典列表参数
      tables: [
        {
          prop: "dictryNo",
          label: "参数名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          width: "150",
          label: "参数中文名称",
          type: "textClick",
          operate: "detail",
          tooltip: true,
        },
        {
          prop: "dictryKeyWord",
          width: "90",
          label: "关键字",
          type: "text",
          operate: "detail",
          tooltip: true,
        },
        {
          prop: "dictryEnglishFullName",
          width: "150",
          label: "英文名字全称",
          type: "text",
          operate: "detail",
          tooltip: true,
        },
        // {
        //   prop: "dictryDescr",
        //   label: "参数描述",
        //   width: "180",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "dictryEnum",
          label: "枚举值",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          width: "100",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          width: "90",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "验证规则",
          minWidth: "130",
          type: "text",
          // operate: "configRead",
          tooltip: true,
        },
        {
          prop: "creatrNm",
          label: "创建人",
          minWidth: "90",
          type: "text",
        },
        {
          prop: "crtTm",
          label: "创建时间",
          minWidth: "120",
          type: "text",
          filter: "crtTm",
          tooltip: true,
        },
        {
          width: "220",
          label: "操作",
          type: "button",
          fixed: "right",
          buttonList: [
            // {
            //   desc: "配置验证规则",
            //   operate: "config",
            //   authName: "assetDispose:dictionary:config",
            //   relation: function (scope) {
            //     return (scope.row.dictryTyp == "0" || scope.row.dictryTyp == "String") && scope.row.dictryPid == "";
            //   },
            // },
            // {
            //   desc: "编辑",
            //   operate: "edit",
            //   authName: "assetDispose:dictionary:edit",
            //   relation: function (scope) {
            //     return !scope.row.dictryPid;
            //   },
            // },
            {
              desc: "升级公共字典",
              operate: "upgrade",
              authName: "assetDispose:dictionary:edit",
            },
            // {
            //   desc: "示例",
            //   operate: "example",
            //   authName: "assetDispose:dictionary:example",
            //   relation: function (scope) {
            //     return scope.row.dictryTyp !== "List" && scope.row.dictryTyp !== "Object"
            //   },
            // },
            {
              desc: "删除",
              operate: "delete",
              authName: "assetDispose:dictionary:delete",
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
      //控制导入数据对话框显示或隐藏
      uploadDialog: false,
      // 选中的数据
      selectedData: [],
      //上传文件的地址
      actionUrl: "", 
      // 表格头部按钮
      btnList: [
        {
          name: "数据字典导出",
          value: "export",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_export.png"),
          iconClass: "",
          authName: "assetDispose:dictionary:export",
        },
        {
          name: "升级公共字典",
          value: "upgrade",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-top",
          authName: "assetDispose:dictionary:bind",
        },
        {
          name: "批量删除",
          value: "multipleDelete",
          type: "normal",
          imgSrc: "",
          iconClass: "el-icon-delete",
          authName: "assetDispose:dictionary:delete",
        },
        {
          name: "创建字典",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
          authName: "assetDispose:dictionary:create",
        },
      ],
      //导出数据
      isExportPop: false,
      // 批量删除提示弹框
      isMultipleDeletePop: false,
      sysId: "",

      //升级数据字典
      upgradeVisible: false,
      classifyOptions: []
    };
  },
  methods: {
    //操作
    async operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("确定要删除吗？").then(async () => {
          const dictIdList = [ {dictryId: data.dictryId} ];
          const params = { 
            sysId: this.sysId,
            dictIdList 
          };
          const res = await this.rpc.public.deletePublicDictionary(params);
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
        this.$emit("toDicDetail",data.dictryId)
      } else if (operation == "edit") {
        this.$emit("toModDic",data.dictryId)
      } else if(operation == "config") {
        this.$emit("toRule",data.dictryId,"mod")
      } else if(operation == "configRead") {
        this.$emit("toRule",data.dictryId,"read")
      } else if(operation == "upgrade") {
        this.selectedData = [];
        this.selectedData.push(data);
        this.upgradeVisible = true;
      } else if (operation == "example") {
        this.$emit("toExampleList",data.dictryId)
      }
    },
    // 获取字典列表数据
    async getList() {
      const { content, preciseQuery, dictryKeyWord, paraType, paraGateg } = this.searchForm;
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        content,
        preciseQuery,
        dictryKeyWord,
        paraType,
        paraGateg,
        sysId: this.sysId,
        begins: this.begins
      };
      const res = await this.rpc.dictionary.getSysDictionaryList(data);
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
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0",excludeClsfId: "10000000"};
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.classifyOptions = res.serviceList;
    },
    // 点击创建按钮，跳转页面到创建字典页面
    newDictionary() {
      this.$emit("toAddDic")
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
          this.isMultipleDeletePop = true
          return;
        case "import":
          this.uploadDialog = true;
          this.actionUrl = this.rpc.file.upUrl({ isCover: "1" });
          return;
        case "export":
          if (
            this.selectedData.length == 0 &&
            !this.searchForm.content &&
            !this.searchForm.dictryKeyWord &&
            !this.searchForm.paraType &&
            !this.searchForm.paraGateg
          ) {
            this.$confirm("请勾选需要导出的数据或通过搜索进行匹配,否则导出全部").then(() => {
              this.isExportPop = true
            })
          } else {
            this.isExportPop = true
          }
          return;
        case "create":
          this.newDictionary();
          return;
        case "upgrade": 
          if (
            this.selectedData.length == 0 &&
            !this.searchForm.content &&
            !this.searchForm.dictryKeyWord &&
            !this.searchForm.paraType &&
            !this.searchForm.paraGateg
          ) {
            return this.$message.warning(
              "请勾选需要升级的数据或通过搜索进行匹配"
            );
          }
          this.upgradeDictionary()
          return;
        default:
          return;
      }
    },
    // 点击批量删除按钮
    async multipleDelete() {
      const dictIdList = this.selectedData.map(item => ({dictryId: item.dictryId }));
      const params = { 
        sysId: this.sysId,
        dictIdList 
      };
        const res = await this.rpc.public.deletePublicDictionary(params);
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
        this.isMultipleDeletePop = false
    },
    // 导入是否覆盖
    radioChange(e) {
      if (e == "1") {
        this.actionUrl = this.rpc.file.upUrl({ isCover: "1" });
      } else {
        this.actionUrl = this.rpc.file.upUrl({ isCover: "0" });
      }
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
      const res = await this.rpc.dictionary.exportDictionaryList(params);
      const downLoadUrl = this.$replaceUrl(res.downLoadUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "";
      a.href = downLoadUrl;
      a.click();
      this.uploadDialog = false;
      this.isExportPop = false;
    },
    async exportDic() {
      const params = {
        sysId: this.sysId,
        dictryIdList: this.selectedData.map((item) => item.dictryId),
        content: this.searchForm.content,
        dictryKeyWord: this.searchForm.dictryKeyWord,
        paraType: this.searchForm.paraType,
        paraGateg: this.searchForm.paraGateg,
      };
      const res = await this.rpc.dictionary.exportSysDic(params);
      const downLoadUrl = this.$replaceUrl(res.downLoadUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "";
      a.href = downLoadUrl;
      a.click();
      this.isExportPop = false;
    },
    // 子参数没有多选框
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    //数据字典升级
    upgradeDictionary() {
      this.upgradeVisible = true;
    },
    // 初始化
    init() {
      this.sysId = this.$route.query.sysId
      this.getList();
      this.getClassifyTypeList();
    },
  },
  watch: {
    begins(n,o) {
      this.init()
    }
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_list {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
}
</style>
