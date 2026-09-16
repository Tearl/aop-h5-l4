<template>
  <div class="page_business">
    <div class="head_cont">
      <div class="header">
        <span>业务4b编排规则列表：</span>
        <el-select
          v-model="type4B"
          placeholder=""
          size="small"
          @change="changeBusiness"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <ServiceTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          @service="search"
          @reset="reset"
          class="search_top"
          labelwidth="100px"
        ></ServiceTop>
      </div>
      <div class="table">
        <Table :table="tables" :data="serviceList" @operate="operate"> </Table>
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
      <RealizeInterface
        ref="realizeInterfaceRef"
        @realizeSave="realizeSave"
      ></RealizeInterface>
    </div>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_editor_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import RealizeInterface from "../dialog/realizeInterface";
export default {
  mixins: [mixin],
  components: {
    Table,
    ServiceTop,
    PagePagination,
    RealizeInterface,
  },
  props: {
    currentR4bObj: {
      type: Object,
      default: () => ({}),
    },
    currentR4bList: {
       type: Array,
       default: () => [],
    }
  },
  data() {
    return {
      tables: [
        {
          prop: "treeSeqNo",
          label: "位置序号",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "treeNm",
          label: "规则名称",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "tx4bSeqNo",
          label: "业务4b序号",
          minWidth: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "tx4bNm",
          label: "业务4b",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isImplements",
          type: "text",
          tooltip: true,
          label: "是否已实现",
        },
        {
          prop: "interfaceNm",
          label: "实现接口",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          width: "140",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "选择接口实现",
              operate: "check",
            },
          ],
        },
      ],
      //表格数据
      serviceList: [],
      options: [
        { value: "1", label: "当前4b" },
        { value: "2", label: "所有4b" },
      ],
      //4b类型
      type4B: "1",
      //头部搜索
      serviceForm: [
        {
          type: "inputIcon",
          model: "treeSeqNo",
          labelText: "位置序号：",
          placeholder: "",
          style: {
            width: "160px",
          },
        },
        {
          type: "inputIcon",
          model: "treeNm",
          placeholder: "",
          labelText: "规则名称：",
          style: {
            width: "160px",
          },
        },
        {
          type: "inputIcon",
          model: "interfaceNm",
          placeholder: "",
          labelText: "实现接口：",
          style: {
            width: "160px",
          },
        },
        {
          type: "select",
          model: "isImplements",
          placeholder: "请选择",
          labelText: "是否已实现:",
          select: [
            { value: "", type: "所有" },
            { value: "0", type: "未实现" },
            { value: "1", type: "已实现" },
          ],
          style: {
            width: "160px",
          },
        },
        {
          type: "inputIcon",
          model: "tx4bNm",
          placeholder: "",
          labelText: "业务4b：",
          style: {
            width: "160px",
          },
        },
      ],
      // 搜索条件
      form: {
        treeSeqNo: "", //位置序号
        treeNm: "", //规则名称
        interfaceNm: "", //实现接口
        isImplements: "", //是否已实
        tx4bNm: "", //业务4b：
      },
      //搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        treeSeqNo: "", //位置序号
        treeNm: "", //规则名称
        interfaceNm: "", //实现接口
        isImplements: "", //是否已实
        tx4bNm: "", //业务4b：
      },
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      //当前表格数据
      decisionObj: {},
    };
  },
  methods: {
    /**
     * 表格操作
     */
    operate(operation, data) {
      this.decisionObj = data;
      if (operation == "check") {
        this.$refs.realizeInterfaceRef.showDialog();
      }
    },
    /**
     * 搜索
     * */
    search() {
      this.pager.currentPage = "1";
      Object.assign(this.searchRecord, this.form);
      this.getDataList();
    },
    /**
     * 重置
     */
    reset() {
      this.$refs.formRef.resetFields();
      Object.assign(this.searchRecord, this.form);
      this.getDataList();
    },
    /**
     * 列表数据
     */
    async getDataList() {
      let tx4bIdList = [];
      if (this.type4B == "1") { // 当前4b
        tx4bIdList = this.currentR4bList.map((item)=>{
            if(this.currentR4bObj.apiId==item.apiId){
                return item.apiId;
            }
        })
        this.form.tx4bNm = this.currentR4bObj.apiName;
      } else { // 所有4b
        this.form.tx4bNm = "";
        tx4bIdList = this.currentR4bList.map((item)=>{
            return item.apiId;
        })
      }
      let params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ...this.searchRecord,
        tx4bIds: tx4bIdList, // 上送集合
      };
      let res = await this.rpc.newEditor.getBusinessList(params);
      this.serviceList = res.decisionTreeInfoList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    /**
     * 更改页码条数
     */
    handleSizeChange(turnPageShowNum) {
      this.pager.currentPage = "1";
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getDataList();
    },
    /**
     * 更改当前页
     */
    handleCurrentChange() {
      this.getDataList();
    },
    /**
     * 初始化接口
     */
    init() {
      this.getDataList();
    },
    /**
     * 管理接口实现弹框回调函数
     */
    realizeSave(data) {
      let params = {
        treeId: this.decisionObj.treeId,
        tx4bId: this.decisionObj.tx4bId,
        interfaceNm: data.apiName,
        interfaceId: data.apiId,
        // 新增入参
        treeSeqNo: this.decisionObj.treeSeqNo, // 规则位置序号
        treeNm: this.decisionObj.treeNm, // 决策树名称
        tx4bNm: this.decisionObj.tx4bNm, // 业务4b名称
        infoId: this.decisionObj.infoId || '', // 信息主键 新增传空
      };
      let res = this.rpc.newEditor.decisionTreeInfoModify(params);
      this.$notify({
        title: "成功",
        message: "绑定成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("completeConfirm");
    },
    changeBusiness(e) {
      console.log(e);
      this.getDataList();
    },
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
@import "@m/assets/css/mixin.scss";
.page_business {
  padding: 24px;
  /deep/
    .aop_tradecode_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px !important;
  }
  /deep/ .aop_tradecode_comps_page_service_top .serivce_top {
    height: auto !important;
  }
}
</style>
