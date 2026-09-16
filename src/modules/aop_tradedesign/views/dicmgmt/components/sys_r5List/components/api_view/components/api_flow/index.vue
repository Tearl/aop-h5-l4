 <template>
  <div class="aop_tradedesign_comps_apimgmt_api_view_api_flow">
    <div class="process_contain_box">
      <div class="process_container">
        <!-- 画布 -->
        <div class="process_middle">
          <!-- <div class="process_header_title">4B服务流程图</div> -->
          <Process
            ref="process"
            class="process_main"
            pageType="d5Design"
            :dataObj="dataObj"
            @getAttrEvent="getAttrEvent"
            @getConditionEvent="getConditionEvent"
            @getSvgClickEvent="getSvgClickEvent"
          >
            <template #createNeedsProps="data">
              <el-button
                class="process_divBtn"
                type="primary"
                size="mini"
                @click="checkNeeds(data)"
                >查看需求</el-button
              >
            </template>
            <template #hasCreateNeedsProps="data">
              <el-button
                class="process_divBtn"
                type="primary"
                size="mini"
                @click="checkNeeds(data)"
                >查看需求</el-button
              >
            </template>
          </Process>
        </div>
        <!-- 属性 -->
        <Pattr
          ref="pattr"
          class="process_right"
          :dicArray="dicArray"
          @updateConditionEvent="updateConditionEvent"
          @upDateFlowParams="upDateFlowParams"
          @updateDataParams="updateDataParams"
        ></Pattr>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Pattr from "./attr";
import Process from "@m/core/components/process/comps";
import { unduplicatedByKeys } from "@m/utils/array";
export default {
  mixins: [mixin],
  components: {
    Pattr,
    Process,
  },
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 右侧导航栏参数
      itemList: [],
      servShow: false,
      detailInfo: {},
      dataObj: {
        flow: [],
        position: "",
      },
      //参数下拉数据
      dicArray: [],
    };
  },
  methods: {
    init() {
      this.getApiDetail();
    },
    //画布触发
    //画布获取组件参数
    getAttrEvent(e) {
      this.$refs.pattr.getAttr(e);
      this.mixDic();
    },
    //画布条件
    getConditionEvent(lineObj, lineList) {
      this.$refs.pattr.getCondition(lineObj, lineList);
      this.mixDic();
    },
    //点击画布空白
    getSvgClickEvent(e) {
      if (e.flow.length !== 0) {
        this.$refs.pattr.getFlowParams(this.dataObj);
      }
    },
    //画布组件创建
    handleNewRectAdd(e) {
      if (e.actionType == "newAction") {
        this.currentNewService = e;
        this.showNewServiceDemand(e);
      }
    },
    // 生成线条时的默认优先级
    generateLineCondPrit(lineObj, lineList) {
      this.$refs.pattr.generateLineCondPrit(lineObj, lineList);
    },

    //组合字典
    mixDic() {
      const d = this.dataObj.puApiParams
        .map((item) => {
          return {
            paraNm: item.paraNm,
            paraNo: item.paraNo,
            paraId: item.paraId,
            paraPareId: item.paraPareId,
            paraPosition: item.paraPosition,
          };
        })
        .filter((item) => item.paraPosition == 0);
      this.dicArray = unduplicatedByKeys(d, [
        "paraId",
        "paraPareId",
        "paraPosition",
      ]);
    },
    //获取参数或配置默认参数
    getAllData(val) {
      if (val.flow.length == 0) {
        val.flow = this.defaultObj.flow;
        val.position = this.defaultObj.position;
      }
      if (this.isProcessTemp) {
        val.flow = this.tempProcessObj.flow;
        val.position = this.tempProcessObj.position;
      }
      this.dataObj = val;
      this.$refs.pattr.getFlowParams(this.dataObj);
      this.mixDic();
    },
    //编辑服务组件需求
    async editNeeds(e) {
      if (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      ) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.save();
          })
          .catch(() => {})
          .finally(() => {
            this.$router.push({
              path: "/aop_service/assetsdesign/cpnModify",
              query: {
                reqmentId: e.data.actionOwnId,
                servId: this.servId,
                pageType: "edit",
              },
            });
          });
      } else {
        this.$router.push({
          path: "/aop_service/assetsdesign/cpnModify",
          query: {
            reqmentId: e.data.actionOwnId,
            servId: this.servId,
            pageType: "edit",
          },
        });
      }
    },
    //查看服务组件需求
    async checkNeeds(e) {
      // this.tempSave();
      // this.changeProcessTemp(true);
      const dataObj = this.pcTranform();
      if (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      ) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.save();
          })
          .catch(() => {})
          .finally(() => {
            this.$router.push({
              path: "/aop_service/assetsdesign/cpnDetail",
              query: {
                reqmentId: e.data.actionOwnId,
              },
            });
          });
      } else {
        this.$router.push({
          path: "/aop_service/assetsdesign/cpnDetail",
          query: {
            reqmentId: e.data.actionOwnId,
          },
        });
      }
    },
    //属性栏触发
    //更新线条条件
    updateConditionEvent(e) {
      this.$refs.process.updateCondition(e);
    },
    //更新flow参数
    upDateFlowParams(e) {
      this.dataObj.puApiParams = e.puApiParams;
      this.dataObj.input = e.input;
      this.dataObj.output = e.output;
      this.mixDic();
    },
    // 更新dataList
    updateDataParams(e) {
      console.log("updateDataParams", e);
      this.$refs.process.updateDataParams(e);
    },
    handleCondPritChange(newCondPrit, oldCondPrit, lineObj) {
      this.$refs.process.handleCondPritChange(
        newCondPrit,
        oldCondPrit,
        lineObj
      );
    },
    // 更新recordFlow
    updateRecordFlow(e) {
      const _recordFlow = JSON.parse(this.recordFlow);
      const updatedItem = _recordFlow.find((item) => item.id == e.actionId);
      if (updatedItem) {
        updatedItem.puApiParams = JSON.parse(JSON.stringify(e.puApiParams));
        this.recordFlow = JSON.stringify(_recordFlow);
      }
    },
    // 查询详情
    async getApiDetail() {
      const params = {
        apiId: this.apiId,
        blngtoTyp: "00",
        d4StusCd: "1",
        deployFlg: "1"
      };
      const res = await this.rpc.apimgmt.getServiceDesignDetail(params);
      this.getAllData(res);
      this.detailInfo = res;
    },
  },
  created() {
    this.init();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_view_api_flow {
  .process_contain_box {
    width: 100%;
    height: calc(100vh - 48px);
    display: flex;
    overflow: hidden;
    .process_container {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      display: flex;
      // justify-content: flex-end;
      font-family: $font_regular;
      overflow: hidden;
      ::v-deep .el-input__inner {
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
      }
      .process_right {
        background: $base_white;
        flex: 0 0 260px;
        border-left: 1px solid $pri_br_color;
      }
      .process_main {
        background: $base_white;
        display: inline-block;
        padding: 24px;
        // padding: 0 24px 24px;
        .process_divMb {
          margin-bottom: 5px;
        }
      }
      .process_middle {
        background-color: $base_bg_color;
        flex: 1;
        overflow: auto;
        position: relative;
        .process_header_title {
          font-family: $font_medium;
          font-size: 16px;
          color: $pri_ft_color;
          letter-spacing: 0;
          background-color: $base_white;
          padding: 20px 30px;
          padding-bottom: 0;
          font-weight: $font_weight_600;
        }
      }
    }
  }
}
</style>

