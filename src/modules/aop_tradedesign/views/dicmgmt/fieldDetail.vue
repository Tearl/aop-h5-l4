<template>
  <div class="aop_tradedesign_dic_page_fieldDetail">
    <PageHeader
      v-if="!isDialog"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <!-- <common-header label="产品查看" /> -->
    <div class="detail_info">
      <div class="top_info">
        <h1>基本信息</h1>
        <div class="content_box">
          <div class="left_box">
            <div class="content">
              <span class="label">字段名称：</span
              ><span class="label_value">{{ filedData.dictryNm }}</span>
            </div>
            <div class="content">
              <span class="label">字段类型：</span
              ><span class="label_value">{{ filedData.dictryTyp }}</span>
            </div>
            <div class="content">
              <span class="label">所属域：</span
              ><span class="label_value">{{
                filedData.beltLineNm || filedData.beltLine | newBeltLineType
              }}</span>
            </div>
          </div>
          <div class="middle_box">
            <div class="content">
              <span class="label">英文名字：</span
              ><span class="label_value">{{ filedData.dictryNo }}</span>
            </div>
            <div class="content">
              <span class="label">最大长度：</span
              ><span class="label_value">{{ filedData.dictryLength }}</span>
            </div>
            <div class="content">
              <span class="label">创建人：</span
              ><span class="label_value">{{ filedData.crtPrsnNm }}</span>
            </div>
          </div>
          <div class="right_box">
            <div class="content">
              <span class="label">所属分段：</span
              ><span class="label_value">{{ filedData.dataSubstnNm }}</span>
            </div>
            <div class="content">
              <span class="label">所属数据集：</span
              ><span class="label_value">{{ filedData.dataSetNm }}</span>
            </div>
            <div class="content">
              <span class="label">创建时间：</span
              ><span class="label_value">{{
                filedData.crtTm | crtTm_yyyyMMddhhmmss
              }}</span>
            </div>
          </div>
        </div>
        <div class="bottom_box">
          <div class="content">
            <span>字段描述：</span>
            <span v-html="filedData.dictryDescr" class="label_value"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail_info" v-if="showEunm">
      <h1>枚举值</h1>
      <Table
        ref="tableRef"
        class="table_style"
        :data="enumTableData"
        :table="enumTableColumn"
        @operate="operate"
      ></Table>
      <!-- <Enumerate ref="enumRef" bizType="read"></Enumerate> -->
    </div>
    <!-- <div class="detail_info">
      <h1>验证规则</h1>
      <el-table class="data_set_common_table" :data="filedData.ruleDefinedInfoList">
        <el-table-column label="规则名称" prop="ruleNo"></el-table-column>
        <el-table-column
          label="规则中文名称"
          prop="ruleNm"
        ></el-table-column>
        <el-table-column label="规则描述" prop="ruleDescr"></el-table-column>
        <el-table-column label="所属分类" prop="clsfCnNm"></el-table-column>
        <el-table-column
          label="正则表达式"
          prop="ruleExps"
        ></el-table-column>
        <el-table-column label="提示信息" prop="ruleTip"></el-table-column>
      </el-table>
    </div>
    <div class="detail_info">
      <h1>示例列表</h1>
      <el-table class="data_set_common_table" :data="filedData.exampleInfoList">
        <el-table-column label="排序" prop="deiOrder"></el-table-column>
        <el-table-column label="示例值" prop="deiValue"></el-table-column>
        <el-table-column label="创建人" prop="creatrNm"></el-table-column>
        <el-table-column label="创建时间" prop="crtTm"></el-table-column>
      </el-table>
    </div>
    <div class="detail_info">
      <h1>L5服务</h1>
      <Table
        class="table_style"
        :data="filedData.apiList"
        :table="tableColumn"
        @operate="operate"
      ></Table>
    </div> -->
    <!-- <div class="btn_info" v-if="!isDialog">
      <div class="btn" style="">
        <el-button @click="labelClick('list')">返回</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table";
import PageHeader from "@m/core/components/page_header";
import TabsContent from "./components/tabsContent.vue";
import Enumerate from "./components/form/components/enumerate";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
    PageHeader,
    Enumerate,
    Table,
  },
  data() {
    return {
      filedData: {},
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
      // breadcrumbs: [
      //   {
      //     label: "字典管理",
      //     operate: "list",
      //   },
      //   {
      //     label: "编辑数据集",
      //     operate: "dataSet",
      //   },
      //   {
      //     label: "字段详情",
      //   },
      // ],
      list: [],
      dataSetNo: "",
      dataSetDataId: "",
      type: "",
      dataSubstnNo: "",
      tableColumn: [
        {
          prop: "apiName",
          label: "服务名称",
          minWidth: "25%",
          type: "textClick",
          operate: "read",
        },
        {
          prop: "apiCode",
          label: "服务编码",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "version",
          label: "版本号",
          minWidth: "15%",
          type: "text",
        },
        {
          prop: "apiDesc",
          label: "服务描述",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
      ],
      showEunm: false,
      enumTableData:[],
      enumTableColumn: [
        {
          prop: "key",
          label: "枚举值",
          // width: "250",
          type: "text",
        },
        {
          prop: "value",
          label: "内容",
          // width: "250",
          type: "text",
        },
      ],
    };
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  destroyed(){
    sessionStorage.removeItem("dataSetInfo")
  },
  computed: {
    breadcrumbs() {
      if (this.type == "dataSetDetail") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "数据集详情",
            operate: "dataSetDetail",
          },
          {
            label: "字段详情",
          },
        ];
      } else if (this.type == "editDataSet") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑数据集",
            operate: "dataSetEdit",
          },
          {
            label: "字段详情",
          },
        ];
      } else if (this.type == "detail" || this.type == "edit") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "分段详情",
            operate: "substnDetil",
          },
          {
            label: "字段详情",
          },
        ];
      } else if (this.type == "editSub") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑分段",
            operate: "editSub",
          },
          {
            label: "字段详情",
          },
        ];
      }else if (this.type == "list"){
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "字段详情",
          }
        ]
      }
    },
  },
  methods: {
    init() {
      this.dataSetNo = this.$route.query.dataSetNo;
      this.dataSubstnNo = this.$route.query.dataSubstnNo || "";
      this.dataSetDataId = this.$route.query.dataSetDataId;
      this.type = this.$route.query.type || "";
      this.getDetail();
    },
    labelClick(e) {
      console.log("e", e);
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "dataSetDetail") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/dataDetail",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (e == "dataSetEdit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (e == "substnDetil") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
          query: {
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            type: this.type,
          },
        });
      } else if (e == "editSub") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSubstnNo: this.dataSubstnNo,
            dataSetNo: this.dataSetNo,
          },
        });
      }
    },
    operate(op, data) {
      console.log("服务", op, data);
      if (op == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            apiId: data.apiId,
            dataSetNo: this.dataSetNo,
            dataSetDataId: this.dataSetDataId,
            type: this.type,
          },
        });
      }
    },
    // 查询模块下用户信息
    async getDetail() {
      const params = {
        dataSetDataId: this.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      this.filedData = res || {};
      if (
        [
          "String",
          "char",
          "byte",
          "short",
          "long",
          "Character",
          "Byte",
          "Short",
          "Long",
        ].includes(res.dictryTyp)
      ) {
        if (res.dictryEnum) {
          this.enumTableData = res.dictryEnum.split(",").map((item) => {
            const arr = item.split("-");
            return {
              key: arr[0],
              value: arr[1],
            };
          });
        }
        this.showEunm = true;
      } else {
        this.showEunm = false;
      }
      // console.log(this.filedData, 'appInfoLists-----')
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_page_fieldDetail {
  .detail_info {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 16px;
    margin: 16px;
    h1 {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      font-weight: $font_weight_600;
    }
    .top_info {
      .content_box {
        display: flex;
        .right_box,
        .middle_box,
        .left_box {
          width: 33%;
        }
      }
    }
    .bottom_box,
    .top_info {
      .content {
        margin-top: 16px;
        .label {
          font-family: $font_regular;
          font-size: 14px;
          color: $sec_ft_color;
          letter-spacing: 0;
        }
        .label_value {
          color: $pri_ft_color;
          &.cursor {
            color: $theme_color;
            cursor: pointer;
          }
        }
      }
    }
  }
  .btn_info {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 16px;
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottom_box {
    border-top: 1px solid #e7e7ee;
    margin-top: 24px;
  }
}
</style>