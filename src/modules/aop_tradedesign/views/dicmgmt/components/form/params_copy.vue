<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_params">
    <el-form
      ref="formRef"
      :model="servForm"
      :rules="rules"
      label-width="130px"
      class="edit_form"
    >
      <div class="header_title">参数配置</div>
      <el-form-item label="输入参数">
        <div class="input_wrapper">
          <div class="top_right_create">
            <!-- <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(sendData, '0', '0')"
                  >添加输入参数</el-button
                > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showParams('s')"
              >从数据集中选择</el-button
            >
          </div>
          <!-- <Table
                class="table_style_ft table_style"
                :data="sendData"
                rowK="paramOrder"
                :table="sendColumns"
                @operate="operate"
              ></Table> -->
          <div class="data_wrapper">
            <PageBigData
              ref="sendDataRef"
              parentClass="send_data"
              :data="sendData"
              @add="addBdata"
              @del="delBdata"
              @addByDic="addByDic"
            ></PageBigData>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="输出参数">
        <div class="output_wrapper">
          <div class="top_right_create">
            <!-- <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(receiveData, '0', '1')"
                  >添加输出参数</el-button
                > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showParams('r')"
              >从数据集中选择</el-button
            >
          </div>
          <!-- <Table
                class="table_style_ft table_style"
                :data="receiveData"
                :table="receiveColumns"
                rowK="paramOrder"
                @operate="operate"
              ></Table> -->
          <div class="data_wrapper">
            <PageBigData
              ref="receiveDataRef"
              parentClass="receive_data"
              :data="receiveData"
              @add="addBdata"
              @del="delBdata"
              @addByDic="addByDic"
            ></PageBigData>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 从数据集中选择 -->
    <SelectFromDataSet
      ref="dataSetRef"
      :dataObj="dataObj"
      @saveParams="saveParams"
    ></SelectFromDataSet>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import Table from "@m/core/components/page_table_workgate"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";
import PageBigData from "../page_big_data";
import SelectFromDataSet from "../dialog/selcFromDataSet";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    PageBigData,
    SelectFromDataSet,
    PageHeader,
    PageFooter,
  },
  props: {
    // 数据集信息
    dataObj: {
      type: String,
      default: () => "",
    },
    // 关联paramsId信息
    paramsIdList: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      sendData: "",
      receiveData: "",
      // 当前数据
      isData: {},
      isHandleParamType: "",
      childList: []
    };
  },
  methods: {
    init() {},
    // 添加输入输出按钮点击
    showParams(e) {
      this.isHandleParamType = e;
      this.$refs.dataSetRef.showDialog();
    },
    //大数据的添加
    addBdata(e) {
      this.operate("add", e);
    },
    //大数据的删除
    delBdata(e) {
      this.operate("del", e);
    },
    addByDic(e) {
      this.operate("dicAdd", e);
    },
    //BODY列表参数操作
    operate(operation, data) {
      console.log(data);
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addChildParams(this.sendData, data);
          this.refreshParams();
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.sendData, data.paramOrder, data);
          this.$refs.dataSetRef.delDataSetId(data.dataSetDataId)
          this.getNodeId(this.sendData);
          console.log(this.sendData);
        }
      } else {
        if (operation == "add") {
          this.addChildParams(this.receiveData, data);
          this.refreshParams();
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.receiveData, data.paramOrder, data);
          this.$refs.dataSetRef.delDataSetId(data.dataSetDataId)
          this.getNodeId(this.receiveData);
          console.log(this.receiveData);
        }
      }
    },
    /** 添加子级报文参数
     * @param {Array} arrs 原数组
     * @param {Object} item 父级
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addChildParams(arrs, item = {}, prs = {}) {
      const order =
        item.children && item.children.length > 0
          ? item.paramOrder + "." + (item.children.length + 1)
          : item.paramOrder + "." + 1;
      const data = {
        paramOrder: order,
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramValueType: "String",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        paramDesc: "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
      };
      const mixData = Object.assign(data, prs);
      item.children = item.children || [];
      item.children.push(mixData);
      this.$emit("addParamsId",mixData)
      // arrs = JSON.parse(JSON.stringify(arrs));
      // this.refreshParams();
    },
    refreshParams() {
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      this.sendData = JSON.parse(JSON.stringify(this.sendData));
      this.$forceUpdate();
    },
    // 删除报文参数
    delParams(arrs, id, data) {
      console.log("删除的",this.paramsIdList)
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          let paramsId = arrs[i].paramId
          this.$emit("delParamsId",paramsId, arrs[i])
          arrs.splice(i, 1);
          let d = 0;
          if (id.indexOf(".") != -1) {
            d = id.substring(0, id.length - 1);
          }
          for (let i = 0; i < arrs.length; i++) {
            arrs[i].paramOrder = d + (i + 1) + "";
          }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id, data);
        }
        i++;
      }
    },
    // 遍历数组 重新排序
    getNodeId(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        arrs[i].paramOrder = id ? id + "." + (i + 1) : i + 1 + "";
        arrs[i].paramParentId = id ? id : "";
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.getNodeId(arrs[i].children, arrs[i].paramOrder);
        }
        i++;
      }
    },
    // 保存当前选中的参数
    saveParams(e,substnData) {
      console.log("data",e,substnData)
      const data = JSON.parse(JSON.stringify(e));
      if (this.isHandleParamType === "addChild") {
        data.map((item) => {
          const prs = {
            paramKey: item.dictNo,
            paramCName: item.dictNm,
            paramLength: "",
            paramValueType: "",
            paramDesc: "",
            paramNm: item.dictNm,
            paramId: this.createId(),
            dataSetDataId: item.dataSetDataId,
            dataSetNo: item.dataSetNo,
            dataSetNm: this.dataObj.dataSetNm,
            dataSubstnNo: item.dataSubstnNo,
            dataSubstnNm: substnData.dataSubstnNm,
          };
          this.addChildParams(
            this.isData.paramPosition === "1"
              ? this.httpData
              : this.isData.paramDirection === "1"
              ? this.receiveData
              : this.sendData,
            this.isData,
            prs
          );
        });
        this.refreshParams();
      } else {
        data.map((item) => {
          const prs = {
            paramKey: item.dictNo,
            paramCName: item.dictNm,
            paramLength: "",
            paramValueType: "",
            paramDesc: "",
            paramNm: item.dictNm,
            paramId: this.createId(),
            dataSetDataId: item.dataSetDataId,
            dataSetNo: item.dataSetNo,
            dataSetNm: this.dataObj.dataSetNm,
            dataSubstnNo: item.dataSubstnNo,
            dataSubstnNm: substnData.dataSubstnNm,
          };
          this.addParams(
            this.isHandleParamType === "r" ? this.receiveData : this.sendData,
            this.isHandleParamType === "h" ? "1" : "0",
            this.isHandleParamType === "r" ? "1" : "0",
            prs
          );
        });
      }
      this.$nextTick(() => {
        this.$refs.dataSetRef.closeDialog();
      });
    },
    //参数操作
    /** 添加第一级报文参数
     * @param {Array} arrs 原数组
     * @param {String} pos 数组位置
     * @param {String} direct 数组方向
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addParams(arrs, pos, direct, prs = {}) {
      const order =
        arrs.length > 0
          ? arrs[arrs.length - 1].paramOrder.indexOf(".") !== -1
            ? arrs[arrs.length - 1].split(".")[0] * 1 + 1
            : arrs[arrs.length - 1].paramOrder * 1 + 1
          : 1;
      const data = {
        paramOrder: order.toString(),
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramValueType: "String",
        paramPosition: pos,
        paramDirection: direct,
        paramDesc: "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: "",
        action: "0",
      };
      const mixData = Object.assign(data, prs);
      arrs.push(mixData);
      this.$emit("addParamsId",mixData)
    },
    //增加paramsId
    createId() {
      let paramId = "";
      const paramIdLength = 6;
      const random = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < paramIdLength; i++) {
        let indexId = Math.floor(Math.random() * 26);
        paramId += random[indexId];
      }
      return paramId;
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_params {
  // padding: 20px 30px;
  margin-top: 10px;
  background: $base_white;
  padding: 20px 24px;
  .input_wrapper,
  .output_wrapper {
    .table_style {
      margin-top: 16px;
    }
    .top_right_create {
      font-size: 14px;
      ::v-deep .el-button {
        @include large_button_common;
      }
    }
    .data_wrapper {
      margin-top: 16px;
    }
  }
  .output_wrapper {
    // margin-top: 20px;
  }
  ::v-deep .edit_form {
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .el-form-item__label {
      color: $reg_ft_color;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      text-align: right;
      padding-right: 16px;
      font-weight: 600;
    }
  }
}
</style>
