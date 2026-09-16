<template>
  <div class="aop_tradedesign_dic_page_fieldDetail">
    <div class="detail_info">
      <div class="top_info">
        <h1>基本信息</h1>
        <div class="content_box">
          <div class="right_box">
            <div class="content">
              <span class="label">参数名称：</span
              ><span class="label_value">{{ filedData.dictryNo }}</span>
            </div>
            <div class="content">
              <span class="label">关键字：</span
              ><span class="label_value">{{
                filedData.dictryKeywd
              }}</span>
            </div>
            <div class="content">
              <span class="label">参数描述：</span
              ><span class="label_value">{{
                filedData.dictryDescr
              }}</span>
            </div>
            <div class="content">
              <span class="label">参数类型：</span
              ><span class="label_value">{{
                filedData.dictryTyp 
              }}</span>
            </div>
            <div class="content">
              <span class="label">创建人：</span
              ><span class="label_value">{{
                filedData.crtPrsnNm
              }}</span>
            </div>
            <div class="content">
              <span class="label">所属数据集：</span
              ><span class="label_value">{{
                filedData.dataSetNm
              }}</span>
            </div>
          </div>
          <div class="left_box">
            <div class="content">
              <span class="label">参数中文名称：</span
              ><span class="label_value">{{ filedData.dictryNm }}</span>
            </div>
            <div class="content">
              <span class="label">英文名称全称：</span
              ><span class="label_value">{{ filedData.dictryEnm }}</span>
            </div>
            <div class="content">
              <span class="label">所属分类：</span
              ><span class="label_value">{{ filedData.assetsName }}</span>
            </div>
            <div class="content">
              <span class="label">最大长度：</span
              ><span class="label_value">{{ filedData.dictryLength }}</span>
            </div>
            <div class="content">
              <span class="label">创建时间：</span
              ><span class="label_value">{{ filedData.crtTm | crtTm_yyyyMMddhhmmss }}</span>
            </div>
            <div class="content">
              <span class="label">所属分段：</span
              ><span class="label_value">{{ filedData.dataSubstnNm }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="bottom_box">
        <div class="content">
          <span class="label">产品描述：</span
          ><span class="label_value">{{ filedData.assetsContext }}</span>
        </div>
      </div> -->
    </div>
    <div class="detail_info">
      <h1>枚举值</h1>
      <Enumerate ref="enumRef" bizType="read"></Enumerate>
    </div>
    <div class="detail_info">
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
    </div>
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
import Enumerate from "./components/enumerate";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
    PageHeader,
    Enumerate,
    Table
  },
  data() {
    return {
      filedData: {},
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
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
          operate: "read"
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
      ]
    };
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    fieldInfo:{
      type:Object,
      default:()=>({})
    }
  },
  created() {},
  mounted() {
    // this.init();
  },
  computed: {
   
  },
  methods: {
    init() {
      this.dataSetNo = this.$route.query.dataSetNo;
      this.dataSubstnNo = this.$route.query.dataSubstnNo;
      this.dataSetDataId = this.$route.query.dataSetDataId;
      this.type = this.$route.query.type || "";
      console.log(this.fieldInfo,"查询")
      this.getDetail();
    },
    operate(op, data) {
      console.log("服务",op, data)
      this.$emit("checkL5ServiceDetail",data)
      // if(op == "read") {
      //   this.$router.push({
      //     path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
      //     query: {
      //       apiId: data.apiId,
      //       dataSetNo: this.dataSetNo,
      //       dataSetDataId: this.dataSetDataId,
      //       type: this.type
      //     },
      //   });
      // }
    },
    // 查询模块下用户信息
    async getDetail() {
      const params = {
        dataSetDataId: this.dataSetDataId || this.fieldInfo.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      this.filedData = res || {};
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
        .left_box {
          width: 50%;
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
}
</style>