<template>
  <div class="aop_tradecode_comps_serv_change_list">
    <PageDialog
      :dialogTitle="serTitle"
      :dialogVisiable="dialogVisible"
      dialogWidth="90%"
      @closeDialog="closeDialog"
      customClass="dialog"
    >
      <div slot="box">
        <div class="content">
          <div class="left_content">
            <div class="title_header">{{ servNameObj.oldText || "/" }}</div>
            <div class="item_content">
              <div class="base_title">基本信息</div>
              <div class="base_info" v-if="changeType == '1'">
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>服务编码：</span>
                    <span class="value">{{ servCodeObj.oldText || "/" }}</span>
                  </div>
                  <div class="base_info_box">
                    <span>所属中心：</span>
                    <span class="value">{{ centerObj.oldText || "/" }}</span>
                  </div>
                  <div class="base_info_box">
                    <span>版本号：</span>
                    <span class="value">{{ versionObj.oldText || "/" }}</span>
                  </div>
                </div>
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>服务编号：</span>
                    <span class="value">{{ servSeqObj.oldText || "/" }}</span>
                  </div>
                  <div class="base_info_box">
                    <span>所属分组：</span>
                    <span class="value">{{ bankNameObj.oldText || "/" }}</span>
                  </div>
                </div>
              </div>
              <div class="base_info" v-else>
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>交易编码：</span>
                    <span class="value">{{ servCodeObj.oldText || "/" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="left_content mgl10">
            <div class="title_header">{{ servNameObj.newText || "/" }}</div>
            <div class="item_content">
              <div class="base_title">基本信息</div>
              <div v-if="changeType == '1'" class="base_info">
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>服务编码：</span>
                    <span class="value">{{ servCodeObj.newText || "/" }}</span>
                  </div>
                  <div class="base_info_box">
                    <span>所属中心：</span>
                    <span class="value">{{ centerObj.newText || "/" }}</span>
                  </div>
                  <div class="base_info_box">
                    <span>版本号：</span>
                    <span class="value">{{ versionObj.newText || "/" }}</span>
                  </div>
                </div>
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>服务编号：</span>
                    <span class="value">{{ servSeqObj.newText || "/" }}</span>
                  </div>

                  <div class="base_info_box">
                    <span>所属分组：</span>
                    <span class="value">{{ bankNameObj.newText || "/" }}</span>
                  </div>
                </div>
              </div>
              <div class="base_info" v-else>
                <div class="base_info_left">
                  <div class="base_info_box">
                    <span>交易编码：</span>
                    <span class="value">{{ servCodeObj.newText || "/" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="param_input">
          <div class="params_list">
            <div class="title">输入参数</div>
            <div class="table">
              <Table
                class="table_style"
                rowK="paramOrder"
                :data="iInputList"
                :table="iInputListTable"
                :treeProps="{ children: 'sonParamList' }"
                :expandAll="true"
              ></Table>
            </div>
          </div>
          <ParamContrastLeft
            ref="ParamInMapping"
            :sourceData="iInputList"
            :targetData="iInputList1"
            :topInit="12 + 40 + 20"
            :index="1"
            v-if="isDataIn"
          ></ParamContrastLeft>
          <div class="params_list">
            <div class="title">输入参数</div>
            <div class="table">
              <Table
                class="table_style"
                :data="iInputList1"
                rowK="paramOrder"
                :table="iInputListTable"
                :expandAll="true"
                :treeProps="{ children: 'sonParamList' }"
              ></Table>
            </div>
          </div>
        </div>
        <div class="param_output">
          <div class="params_list">
            <div class="title">输出参数</div>
            <div class="table">
              <Table
                class="table_style"
                :data="iOutputList"
                rowK="paramOrder"
                :table="iOutputListTable"
                :treeProps="{ children: 'sonParamList' }"
                :expandAll="true"
              ></Table>
            </div>
          </div>

          <ParamContrastLeft
            ref="ParamInMapping"
            :sourceData="iOutputList"
            :targetData="iOutputList1"
            :topInit="12 + 40 + 20"
            :index="2"
            v-if="isDataIn"
          ></ParamContrastLeft>

          <div class="params_list">
            <div class="title">输出参数</div>
            <div class="table">
              <Table
                class="table_style"
                :data="iOutputList1"
                rowK="paramOrder"
                :table="iOutputListTable"
                :treeProps="{ children: 'sonParamList' }"
                :expandAll="true"
              ></Table>
            </div>
          </div>
        </div>
        <div class="updateTime">
          <span>更新时间</span>
          <span>{{ updTm }}</span>
        </div>
      </div>
      <div slot="footer">
        <div v-if="changeType == '1'">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button
            v-if="changeTp == '1'"
            type="primary"
            @click="updateServ('update')"
            >更 新</el-button
          >
          <el-button
            v-if="changeTp == '1'"
            type="primary"
            @click="updateServ('noUpdate')"
            >不更新</el-button
          >
          <el-button
            v-if="changeTp == '2'"
            type="primary"
            @click="upgradeService"
            >升 级</el-button
          >
        </div>
        <div v-else></div>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table_workgate"; // 公共表格组件
import ParamContrastLeft from "./components/param_contrast_left_g6";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
    ParamContrastLeft,
  },
  props: {
    currentInterfaceObj: {
      type: Object,
      default: () => ({}),
    },
    //1为S5、其他为4b
    changeType: {
      type: String,
      default: () => "1",
    },
    serTitle: {
      type:String,
      default: () => "服务列表变更信息对比"
    }
  },
  data() {
    return {
      dialogVisible: false,
      iInputList: [],
      iOutputList: [],
      iInputList1: [],
      iOutputList1: [],
      isDataIn: false,
      iInputListTable: [
        {
          prop: "apKey",
          label: "字段编码",
          width: "120px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apName",
          label: "字段名称",
          type: "text",
          tooltip: true,
          width: "120px",
        },
        {
          prop: "apType",
          label: "参数值类型",
          type: "text",
          tooltip: true,
          width: "120px",
        },
        {
          prop: "apIsNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          width: "100px",
          tooltip: true,
        },
      ],
      iOutputListTable: [
        {
          prop: "apKey",
          label: "字段编码",
          // width: "200px",
          width: "150px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apName",
          label: "字段名称",
          width: "150px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apType",
          label: "参数值类型",
          width: "150px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apIsNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          width: "100px",
          tooltip: true,
        },
      ],
      indexMap: 1,
      servCodeObj: {},
      servNameObj: {},
      bankNameObj: {},
      servSeqObj: {},
      centerObj: {},
      changeTp: "", //1-服务变动；2-服务升级;
      servObj: {},
      servApiObj: {},
      beltLine: "",
      versionObj: {},
      updTm: "",
    };
  },
  methods: {
    async showDialog(data) {
      // this.dialogVisible = true;
      await this.resetData();
      this.servObj = data;
      this.changeTp = data.changeTp;
      await this.getDataList(data);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async getDataList(data) {
      let res =
        this.changeType == "1"
          ? await this.rpc.changeList.queryServiceChangeDetail({
              serviceChangeId: data?.serviceChangeId,
            })
          : await this.rpc.changeList.queryTranChangeDetail({
              tranChangeId: data?.flowId,
            });

      this.isDataIn = false;
      this.dialogVisible = true;
      // console.log(res, "=====???");
      //更新时间
      this.updTm = res.updTm || "";
      //老数据 输入参数
      if (res?.oldParamList?.length > 0) {
        this.iInputList = this.setParamOrder(
          res.oldParamList,
          "",
          "",
          "paramOrder",
          "sonParamList"
        );
      } else {
        this.iInputList = [];
      }
      //新数据 输入参数
      if (res?.newParamList?.length > 0) {
        this.iInputList1 = this.setParamOrder(
          res.newParamList,
          "",
          "",
          "paramOrder",
          "sonParamList"
        );
      } else {
        this.iInputList1 = [];
      }
      //旧数据 输出参数
      if (res?.oldOutputParamList?.length > 0) {
        this.iOutputList = this.setParamOrder(
          res.oldOutputParamList,
          "",
          "",
          "paramOrder",
          "sonParamList"
        );
      } else {
        this.iOutputList = [];
      }
      //新数据 输出参数
      if (res?.newOutputParamList?.length > 0) {
        this.iOutputList1 = this.setParamOrder(
          res.newOutputParamList,
          "",
          "",
          "paramOrder",
          "sonParamList"
        );
      } else {
        this.iOutputList1 = [];
      }
      // 1-服务编码;2-版本号;3-服务编号;4;服务名称;5-所属中心;6-所属分组;7-服务描述;
      //textItem-textItemNm
      if (this.changeType == "1") {
        res.noticeServiceDetailList.forEach((e) => {
          if (e.textItem == "1" && e.textItemNm == "服务编码")
            this.servCodeObj = e;
          else if (e.textItem == "3" && e.textItemNm == "服务编号")
            this.servSeqObj = e;
          else if (e.textItem == "4" && e.textItemNm == "服务名称")
            this.servNameObj = e;
          else if (e.textItem == "5" && e.textItemNm == "所属中心")
            this.centerObj = e;
          else if (e.textItem == "6" && e.textItemNm == "所属分组")
            this.bankNameObj = e;
          else if (e.textItem == "9" && e.textItemNm == "输出参数")
            this.servApiObj = e;
          else if (e.textItem == "2" && e.textItemNm == "版本号")
            this.versionObj = e;
        });
      } else {
        this.servCodeObj = {
          oldText:res.txCode,
          newText:res.txCode
        }
        this.servNameObj = {
          oldText:res.txName,
          newText:res.txName
        }
      }

      await this.getHandleData(this.iInputList);
      await this.getHandleData(this.iInputList1);
      await this.getHandleData(this.iOutputList);
      await this.getHandleData(this.iOutputList1);
      this.isDataIn = true;
    },
    //遍历子节点 paramStandardId格式： 父节点key.子节点key....
    getHandleData(dataList, codes) {
      let code = codes || "";
      dataList.map((item) => {
        if (code) {
          item.paramStandardId = `${code}.${item.apKey}`;
        } else {
          if (["List", "Object"].includes(item.apType)) {
            item.paramStandardId = "";
            // code = item.apKey;
          } else {
            code = "";
            item.paramStandardId = item.apKey;
          }
        }
        if (item?.sonParamList?.length > 0) {
          this.getHandleData(
            item.sonParamList,
            item.paramStandardId || item.apKey
          );
        }
      });
    },
    //服务更新
    async updateServ(type) {
      // console.log(data, "updataServ");
      let params = {
        serviceChangeId: this.servObj.serviceChangeId,
        operTp: type == "noUpdate" ? "-1" : "1", //-1:作废；1：更新
      };
      let res = await this.rpc.changeList.updateAssetService(params);
      this.dialogVisible = false;
      this.$emit("updataServ", type, this.servObj);
    },
    //服务升级
    async upgradeService() {
      let params = {
        serviceChangeId: this.servObj.serviceChangeId,
        operTp: "1",
      };
      let res = await this.rpc.changeList.updateAssetService(params);
      let oldServObj = {
        svcSeq: this.servSeqObj.oldText,
        svcName: this.servNameObj.oldText,
        svcNo: this.servCodeObj.oldText,
        svcId: this.servApiObj.oldText,
      };
      let newServObj = {
        svcSeq: this.servSeqObj.newText,
        svcName: this.servNameObj.newText,
        svcNo: this.servCodeObj.newText,
        svcId: this.servApiObj.newText,
      };
      this.dialogVisible = false;
      //查询更新过后的服务名称
      let serResList = await this.rpc.newEditor.getL5ServList({
        domainNo: this.beltLine || "",
        apiNuCoNm: newServObj.svcSeq,
      });
      // console.log(serResList, newServObj, "serResList");
      if (serResList?.ifpApiInfoBos.length > 0) {
        let item = serResList.ifpApiInfoBos.find(
          (item) => item.aiId == newServObj.svcId
        );
        // console.log("item", item);
        let checkList = [];
        if (item) {
          checkList.push(item);
          // console.log("checkList", checkList);
          let svcChoiceList = checkList.map((item) => {
            item.transId = this.currentInterfaceObj.apiId;
            item.apiId = item.aiId;
            item.apiState = item.aiState;
            item.apiCode = item.aiCode;
            item.apiName = item.aiName;
            item.apiSeq = item.apiSeq;
            return item;
          });
          // console.log(svcChoiceList, "svcChoiceList");
          //手动选择绑定的接口（选进去升级的服务）
          let resCheck = await this.rpc.newEditor.chooseL5serv({
            svcChoiceList,
          });
          //删除旧的服务
          // let delSer = await this.rpc.newEditor.delectTransL5ServiceRel({
          //   apiId: oldServObj.svcId,
          //   transId: this.currentInterfaceObj.svcId,
          // });
          this.$emit("upgradeService", oldServObj, newServObj);
        }
      }
    },
    /**
     * 处理父子序号
     */
    setParamOrder(
      arr,
      paramOrder,
      paramParentId = "",
      key = "paramOrder",
      childKey = "sonParamList"
    ) {
      if (arr.length == 0 || !arr) return [];
      return arr.map((item, i) => {
        if (item[childKey] && item[childKey].length > 0) {
          item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
          item.paramParentId = paramParentId;
          this.setParamOrder(item[childKey], item[key], item[key]);
          return item;
        } else {
          item[key] = paramOrder ? `${paramOrder}.${i + 1}` : `${i + 1}`;
          item.paramParentId = paramParentId;
          return item;
        }
      });
    },
    //重置数据
    resetData(){
      this.iInputList = [];
      this.iInputList1 = [];
      this.iOutputList = [];
      this.iOutputList1 = [];
      this.servCodeObj = {};
      this.servSeqObj = {};
      this.servNameObj = {};
      this.centerObj = {};
      this.bankNameObj = {};
      this.servApiObj = {};
      this.versionObj = {};
      this.isDataIn = false;
    }
  },
  created() {
    this.beltLine = this.$route.query.beltLine;
  },
};
</script>
<style scoped lang="scss">
.aop_tradecode_comps_serv_change_list {
  .content {
    display: flex;
    padding: 10px 20px;
    .left_content {
      width: 50%;
      .title_header {
        border-bottom: 1px solid #dcdfe6;
      }
      .item_content {
        // display: flex;
        .base_title {
          font-weight: 600;
          margin-top: 10px;
        }
        .base_info {
          display: flex;
          .base_info_left {
            width: 50%;
            .base_info_box {
              margin-top: 10px;
              display: flex;
              .value {
                max-width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .params_list {
        margin-top: 10px;
        .title {
          font-weight: 600;
        }
        .table {
          margin-top: 10px;
        }
      }
    }
    .mgl10 {
      margin-left: 20px;
    }
  }
  .param_input,
  .param_output {
    display: flex;
    padding: 10px;
    .params_list {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      // width: 540px;
      width: 45%;
      flex-direction: column;
    }
  }
  .dialog {
    position: relative;
    .updateTime {
      position: absolute;
      top: 13px;
      left: 208px;
    }
  }
}
</style>