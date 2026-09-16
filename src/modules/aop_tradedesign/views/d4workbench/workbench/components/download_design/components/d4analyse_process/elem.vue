<template>
  <div class="aop_tradedesign_comps_d4analyse_process_elem">
    <div class="elem_box">
      <div class="elem_title">
        <span>交易列表</span>
        <i class="el-icon-plus" @click="addTrans"></i>
      </div>
      <div class="scroll_content">
        <div class="elem_item_content">
          <div class="item_tpye">未关联交易</div>
          <ul class="uncorrelated_ul">
            <li
              v-for="item in servList"
              :key="item.apiId"
              class="uncorrelated_li"
              :class="transId == item.apiId ? 'current_cls' : ''"
              @click="transClick(item, 'unRelation')"
            >
              <div class="imgCheck">
                    <div :class="item.checkFlag === '1' ? 'green' : 'red'"></div>
                    <!-- <span>{{  item.checkFlg = = "1" ? "校验通过" : "校验失败"}}</span> -->
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.apiName"
                placement="top"
                :disabled="item.apiName.length < 11"
              >
                <span class="content">
                  {{ item.apiName }}
                </span>
              </el-tooltip>
              <el-button type="text" @click="delTrans(item.apiId)"
                >删除</el-button
              >
            </li>
          </ul>
        </div>
        <div class="elem_item_content">
          <div class="item_tpye">已关联交易</div>
          <ul class="uncorrelated_ul">
            <li
              v-for="item in transList"
              :key="item.apiId"
              class="correlated_li"
              :class="transId == item.apiId ? 'current_cls' : ''"
              @click="transClick(item)"
            >
              <div class="imgCheck">
                    <div :class="item.checkFlag === '1' ? 'green' : 'red'"></div>
                    <!-- <span>{{  item.checkFlg = = "1" ? "校验通过" : "校验失败"}}</span> -->
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.apiName"
                placement="top"
                :disabled="item.apiName.length < 11"
              >
                <span class="content">
                  {{ item.apiName }}
                </span>
              </el-tooltip>
              <span
                class="status"
                :class="{
                  unpublish: item.apiState == '0',
                  publishing: item.apiState == '2',
                }"
              >
                {{ item.apiState | transState }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <AddTrans ref="transRef" @saveForm="saveForm"></AddTrans>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import AddTrans from "./components/dic_form/addTrans";

import { unduplicated } from "@m/utils/array";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  name: "elem",
  components: {
    AddTrans,
  },
  props: {
    fnctCd: {
      type: String,
      default: () => "",
    },
    jobNo: {
      type: String,
      default: () => "",
    },
    authId: {
      type: String,
      default: () => "",
    },
    bizLineId: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: {
    funcDetail: {
      type: Object,
    },
  },
  data() {
    return {
      publishStatus: {
        "00": "待登记",
        "02": "已登记",
      },
      currentD4bSvcId: "",
      servList: [],
      transId: "",
      transList: [],
      competitorId:"",  //银行ID
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    //初始化
    init(id) {
      this.getRelationServList(id);
      this.getServList(id);
      this.competitorId = this.$route.query.competitorId || "";
    },
    // 查询已关联交易列表
    async getRelationServList(id) {
      const params = {
        assetId: this.fnctCd,
        isolateWorkspace: this.authId,
      };
      const res = await this.rpc.d4.getNewRelationServList(params);
      this.transList = res.list;
      if (id) {
        return
      } else if (!this.transList.length) {
        this.$emit("setTransFlag", true);
      } else {
        this.transClick(this.transList[0]);
      }
    },
    // 查询未关联交易列表
    async getServList(id) {
      const params = {
        authId: this.authId,
        fnctCd: this.fnctCd,
        jobNo: this.jobNo,
        pageFlg: "0",
      };
      const res = await this.rpc.d4.getFuncServList(params);
      this.servList = res.bottomApiInfoList.map((item) => {
        return {
          apiId: item.svcId,
          apiName: item.svcNm,
          checkFlag: item.checkFlag,
        };
      });
      if (id) {
        this.transId = id;
        for (let i = 0; i < this.servList.length; i++) {
          const item  = this.servList[i]
          if (item.apiId === id) {
            this.$emit("d4bServClick", item);
          }
        }
      } 
    },
    // 新增交易
    addTrans() {
      this.$refs.transRef.showDialog();
    },
    // 删除交易
    delTrans(e) {
      this.$confirm("是否删除该交易").then(async () => {
        const params = {
          apiId: e,
          fnctCd: this.fnctCd,
          jobNo: this.jobNo,
          isolateWorkspace: this.authId,
        };
        const res = await this.rpc.d4.delDownLoadTrans(params);
        this.$notify({
          type: "success",
          message: "成功",
          title: "成功",
          duration: 2000,
        });
        this.getServList().then(() => {
          if (this.transList.length) {
            this.transClick(this.transList[0]);
          } else if (this.servList.length) {
            this.transClick(this.servList[0]);
          } else {
            this.$emit("setTransFlag", true);
            this.transClick();
          }
        });
      });
    },
    // 点击交易
    transClick(e, type) {
      this.transId = e?.apiId || "";
      this.$emit("d4bServClick", e, type);
    },
    async saveForm(data) {
      let funcInfo = this.funcDetail();
      const params = {
        ...data,
        fnctCd: this.fnctCd,
        isolateWorkspace: this.authId,
        beltLine: this.bizLineId,
        jobNo: this.jobNo,
        // 资产
        groupId: funcInfo.admiId,
        groupNm: funcInfo.modelName,
        // 客户
        bkId: funcInfo.competitorId || this.competitorId,
        bkNm: funcInfo.competitorName,
        // 应用
        arsId: funcInfo.appLabel,
        arsNm: funcInfo.appLabelName,
        //客户编码
        cstNo: funcInfo.competitorId || this.competitorId,
        //业务应用ID
        appId: funcInfo.appLabel
      };
      const res = await this.rpc.d4.addDownLoadTrans(params);
      // this.transId = res.apiId
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.getServList();
      this.$refs.transRef.handleCancel();
    },
  },
  filters: {
    ...filters,
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4analyse_process_elem {
  .elem_box {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 6px;
    width: 260px;
  }
  .green {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #7fd86d;
  }
  .red {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ea565e;
  }
  .elem_title {
    margin: 16px 0;
    margin-left: 10px;
    font-size: 16px;
    color: #111111;
    letter-spacing: 0;
    font-weight: $font_weight_600;
    display: flex;
    justify-content: space-between;
    i {
      cursor: pointer;
    }
  }

  .elem_item_content {
    margin-bottom: 6px;
    .item_tpye {
      padding: 4px 10px;
      background: $table_bg_color;
    }
  }
  .scroll_content {
    height: calc(100% - 120px);
    overflow-y: scroll;
  }
  .uncorrelated_ul {
    // max-height: 250px;
    // overflow-y: scroll;
    .uncorrelated_li,
    .correlated_li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 20px 2px 24px;
      cursor: pointer;
      /deep/ .el-button {
        color: $danger_color;
        padding: 2px 0;
      }
      .content {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .correlated_li {
      padding: 1px 8px 1px 24px;
    }
    .current_cls {
      background: #eaf1ff;
      color: $theme_color;
    }
  }
  .status {
    padding: 0px 5px;
    transform: scale(0.8);
    min-width: 55px;
    // min-width: 45px;
    text-align: center;
    // 新增
    &.unpublish {
      color: #ff5f5f;
      background: #ffefee;
      border: 0.5px solid #ff5f5f;
    }
    // 已登记
    &.publishing {
      color: #36d542;
      background: #e5ffe7;
      border: 0.5px solid #36d542;
    }
  }
  .imgCheck {
    // font-size: 12px;
    // min-width: 64px;
    display: inline-block;
    margin-right: 4px;
    img {
      width: 15px;
      // height: 10px;
    }
  }
}
</style>