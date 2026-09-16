<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_stay_approve">
    <!-- <DicSidebar
      class="dic_sidebar"
      @toGetList="toGetList"
      :sysId="arsId"
      :bkId="bkId"
      type="read"
      pageType="standard"
      @toDicView="toDicView"
      @dicAdd="toAddDic"
    ></DicSidebar> -->
    <div class="service_content" v-if="flag == 'list'">
      <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
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
      <div class="content_bottom">
        <TableHeader
          :title="pageType == 'approved' ? '已审批列表' : '待审批列表'"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader>

        <Table
          :table="tables"
          @operate="operate"
          :data="dictionaryList"
          :tableType="pageType == 'approved' ? '' : 'selection'"
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
        <PageFooter v-if="pageType !== ''">
          <div slot="box">
            <el-button @click="handleCancel">返回</el-button>
          </div>
        </PageFooter>
      </div>
    </div>
    <div class="service_content" v-if="flag == 'view'">
      <DicView
        type="standard"
        :dictryId="dictryId"
        :toDefaultActive="toDefaultActive"
        :sysId="arsId"
        @toDicList="toDicList"
      ></DicView>
    </div>
    <div class="service_content" v-if="flag == 'approval'">
      <ApprDic
        ref="modDicRef"
        class="obj_detail"
        :dictryId="dictryId"
        :sysId="sysId"
        :aplySrlNo="aplySrlNo"
        :apiType="apiType"
        @toDetail="toDetail"
      ></ApprDic>
    </div>
    <!-- 批量同意未通过弹窗 -->
    <PageDialog
      :dialogWidth="'50%'"
      :dialogTitle="'未通过参数列表'"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="group_count_dialog"
    >
      <div slot="box">
        <Table :data="probData" :table="dialogTable"></Table>
        <!-- 分页器 -->
        <!-- <PagePagination
          @size-change="handleSizeChangeForGroupCount"
          @current-change="handleCurrentChangeForGroupCount"
          :pager="pager"
        >
        </PagePagination> -->
      </div>
      <div slot="footer">
        <PageFooter>
          <div slot="box">
            <el-button type="primary" @click="closeDialog">确 定</el-button>
          </div>
        </PageFooter>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin"
import ServiceTop from "@m/core/components/page_search_top" //
import TableHeader from "@m/core/components/page_table_header"
import PageFooter from "@m/core/components/page_footer"
import Table from "@m/core/components/page_table" // 公共表格组
import PagePagination from "@m/core/components/page_pagination"
import DicSidebar from "../dic_sidebar"
import DicView from "../dic_view"
import ApprDic from "../batch_approve"
import PageDialog from "@m/core/components/page_dialog"
import { setSerialNumber } from "@m/utils/array"

export default {
  mixins: [mixin],
  components: {
    ServiceTop,
    Table,
    PagePagination,
    TableHeader,
    DicSidebar,
    DicView,
    PageFooter,
    ApprDic,
    PageDialog
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
    bkId: {
      type: String,
      default: () => "",
    },
    begins: {
      type: String,
      default: () => "",
    },
    pageType: {
      type: String,
      default: () => "",
    },
    pageData: {
      type: String,
      default: () => { },
    },
  },
  data () {
    return {
      flag: "list",
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名、英文名或描述",
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
      form: {
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
      // 表格头部按钮
      btnList: [],
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
          tooltip: true,
        },
        {
          prop: "dictryEnglishFullName",
          width: "150",
          label: "英文名字全称",
          type: "text",
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
      ],
      dictionaryList: [],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      selectedData: [],
      dictryId: "",
      aplySrlNo: "",
      toDefaultActive: "",
      apprData: [],
      applyFlowList: [],
      probData: [], //批量同意后有问题的数据
      dialogVisiable: false,
      dialogTable: [
        {
          prop: "key",
          label: "参数key",
          type: "text",
          tooltip: true,
          width: "150",

        },
        {
          prop: "value",
          label: "拒绝原因",
          type: "text",
          tooltip: true,
        },
      ]
    }
  },
  methods: {
    toDicDetail (e) {
      this.flag = "view"
      this.dictryId = e
      this.$emit("tabsShow", false)
    },
    toAddDic () {
      this.$emit("toAddDic")
    },
    toModDic (e) {
      this.$emit("toModDic", e)
    },
    toRule (e, o) {
      this.$emit("toRule", e, o)
    },
    toExampleList (e) {
      this.$emit("toExampleList", e)
    },
    handleBtnClik (e) {
      if (e == "batchAgree") {
        this.applyFlowList = this.selectedData.map(item => ({ aplySrlNo: item.aplySrlNo }))
        const params = {
          applyFlowList: this.applyFlowList
        }
        console.log("同意", e, this.selectedData, params)
        this.$confirm("确定要批量同意所选数据字典吗？").then(async () => {
          const res = await this.rpc.public.batchAgree(params)
          this.$notify({
            title: "成功",
            message: "同意成功",
            duration: 2000,
            type: "success",
          })
          const arr = []
          for (let i in res.applyDesc) {
            let flag
            [i].map(item => {
              flag = item.toString()
              flag = flag.replace(/\[|]/g, "\'").split("'")[1]
            })
            arr.push({ key: flag, value: res.applyDesc[i] })
          }
          this.probData = arr
          if (arr.length) {
            this.dialogVisiable = true
          }
        })
      } else {
        this.$confirm("确定要批量同意所选数据字典吗？").then(async () => {
          const res = await this.rpc.dicmgmt.agreeStandardDic({
            standardFlowList: this.selectedData,
          })
          this.$notify({
            title: "成功",
            message: "同意成功",
            duration: 2000,
            type: "success",
          })
        })
      }
      this.getList()
    },
    // 点击搜索按钮
    search () {
      Object.assign(this.searchRecord, this.form)
      this.currentPage = "1"
      this.getList()
    },
    // 点击重置按钮
    reset () {
      this.$refs.formRef.resetFields()
    },
    // 获取字典列表数据
    async getList () {
      const { content, preciseQuery, dictryKeyWord, paraType, paraGateg } =
        this.searchRecord
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        content,
        preciseQuery,
        dictryKeyWord,
        paraType,
        paraGateg,
        sysId: this.arsId,
        begins: this.begins,
        bkId: this.bkId,
      }
      if (!!this.pageType) {
        data.aplyBtchNo = this.pageData.aplyBtchNo
        data.aprvlStusCd = this.pageType === "noApproval" ? "0" : "1"
      }
      const api = !!this.pageType ? "getBatchDetailList" : "getStandardDicList"
      const res = await this.rpc.dicmgmt[api](data)
      this.dictionaryList = setSerialNumber(res.standardFlowList || res.dictInfoList)
      this.pager.total = res.turnPageTotalNum * 1
    },
    // 每页条数改变时
    handleSizeChange (e) {
      this.pager.turnPageShowNum = e
      this.getList()
    },
    // 当前页改变时
    handleCurrentChange (e) {
      this.getList()
    },
    toDetail () {
      this.flag = "list"
      this.getList()
    },
    //操作
    async operate (operation, data) {
      if (operation == "agree") {
        this.$confirm("确定要同意吗？").then(async () => {
          data.sysId = this.arsId
          const standardFlowList = [data]
          // const params = {
          //   dictIdList,
          // };
          const res = await this.rpc.dicmgmt.agreeStandardDic({
            standardFlowList,
          })
          this.$notify({
            title: "成功",
            message: "同意成功",
            duration: 2000,
            type: "success",
          })
          // if (this.dictionaryList.length <= 1) {
          //   this.pager.currentPage = "1";
          // }
          this.getList()
        })
      } else if (operation == "detail") {
        this.toDicDetail(data.dictryId)
      } else if (operation == "edit") {
        this.flag = "view"
        this.$emit("tabsShow", false)
        this.dictryId = data.dictryId
        this.toDefaultActive = "m"
        // this.toModDic(data.dictryId);
      } else if (operation == "appr") {
        // this.$emit("goAppr",data)
        this.flag = "approval"
        this.aplySrlNo = data.aplySrlNo || ""
        this.dictryId = data.dictryId
      }
    },
    // 多选框变化时
    handleSelectionChange (e) {
      this.selectedData = e
    },
    toGetList (e) {
      this.flag = "list"
      this.$emit("tabsShow", true)
    },
    toDicView (e) {
      this.dictryId = e
      this.toDefaultActive = ""
      this.flag = "view"
      this.$emit("tabsShow", false)
    },
    toDicList () {
      this.flag = "list"
      this.$emit("tabsShow", true)
    },
    // 子参数没有多选框
    dictListCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" }
      }
    },
    closeDialog () {
      this.dialogVisiable = false
    },
    handleCancel () {
      this.$emit("goBatchList")
    },
    //初始化
    init () {
      this.search()
      //如果是从已审批批次列表进入
      if (this.pageType === "approved") {
        this.btnList = []
      } else if (this.pageType === "noApproval") {
        //如果是从未审批批次列表进入
        this.tables.push({
          width: "120",
          label: "操作",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "审批",
              operate: "appr",
            },
          ],
        })
        this.btnList = [
          {
            name: "批量同意",
            value: "batchAgree",
            type: "primary",
            imgSrc: "",
            iconClass: "",
            authName: "assetDispose:dictionary:create",
          },
        ]
      } else {
        this.btnList = [
          {
            name: "批量同意",
            value: "create",
            type: "primary",
            imgSrc: "",
            iconClass: "",
            authName: "assetDispose:dictionary:create",
          },
        ]
        //应用数据字典的待审批列表
        const item = this.tables.find((item) => item.label === "操作")
        if (!item) {
          this.tables.push({
            width: "120",
            label: "操作",
            type: "button",
            fixed: "right",
            buttonList: [
              {
                desc: "编辑",
                operate: "edit",
                authName: "assetDispose:dictionary:edit",
                relation: function (scope) {
                  return !scope.row.dictryPid
                },
              },
              {
                desc: "同意",
                operate: "agree",
              },
            ],
          })
        }
      }

    },
  },
  created () {
    this.init()
  },
  watch: {
    begins (n, o) {
      this.init()
    },
    arsId (n, o) {
      this.init()
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dic_stay_approve {
  // position: relative;
  min-height: 100%;
  .service_content {
    // padding-left: 216px;
    // padding: 20px 24px;
    // margin-top: 50px;
  }
  .dic_sidebar {
    // padding: 0;
    left: 216px;
  }
  .content_bottom {
    background: $base_white;
    padding: 0 24px 24px;
  }
}
</style>


