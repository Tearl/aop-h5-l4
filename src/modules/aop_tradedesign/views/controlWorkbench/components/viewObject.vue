<template>
  <div class="view_object">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="tab1"></el-tab-pane>
      <el-tab-pane label="对象属性" name="tab2"></el-tab-pane>
      <el-tab-pane label="对象关系" name="tab3"></el-tab-pane>
      <el-tab-pane label="对象行为" name="tab4"></el-tab-pane>
      <el-tab-pane label="映射库表对象" name="tab5"></el-tab-pane>
    </el-tabs>
    <div class="demo-drawer__content" v-show="activeName == 'tab1'">
      <div class="body">
        <div class="objectInfo_main">
          <div class="objectInfo_main_item" v-for="(item, index) in objectInfoData" :key="index">
            <label>{{ item.label }}</label>
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="demo-drawer__content" v-if="activeName == 'tab2'">
      <div class="body">
        <el-table :data="l5SysBizObjectAttributeDTOs">
          <el-table-column prop="dictryName" label="字段名称" width="">
          </el-table-column>
          <el-table-column prop="dictryNo" label="编码" width="">
          </el-table-column>
          <el-table-column prop="dictryType" label="数据类型">
          </el-table-column>
          <el-table-column prop="dictryDesc" label="描述" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
                scope.row.dictryDesc.length > 0 ? scope.row.dictryDesc : "/"
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demo-drawer__content" v-if="activeName == 'tab3'">
      <div class="body content">
        <div class="obj-relation-content">
          <el-table :data="relationTableData" style="width: 100%; margin-top: 14px">
            <el-table-column prop="obrName" label="关系名称">
            </el-table-column>
            <el-table-column prop="obrCode" label="编码"> </el-table-column>
            <el-table-column prop="curObjName" label="当前对象">
            </el-table-column>
            <el-table-column prop="tgtObjName" label="目标对象">
            </el-table-column>
            <el-table-column prop="obrRelash" label="关系类型">
              <template slot-scope="scope">
                {{ relationMap[scope.row.obrRelash] }}
              </template>
            </el-table-column>
            <el-table-column prop="relashMult" label="关系重数">
              <template slot-scope="scope">
                {{ relashMultNameFun(scope.row.relashMult) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="demo-drawer__content" v-if="activeName == 'tab4'">
      <div class="body content">
        <div class="obj-relation-content">
          <div class="behavior_box" v-if="objectBehaviorInfos && objectBehaviorInfos.length > 0">
            <div class="list_box">
              <div v-for="(item, index) in objectBehaviorInfos" :key="index" :class="{ active: tabActive == index }"
                @click="clickTab(index)">
                <el-tooltip class="item" effect="dark" :content="item.obeName" placement="top-start">
                  <span>
                    {{ item.obeName || '/' }}
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div style="flex: 1;overflow-x: hidden; border-left: 1px solid #e5e5e5;">
              <div class="content_list">
                <div class="card_title">
                  <span class="d_line"></span>
                  <span class="d_detail">基本信息</span>
                </div>
                <el-row>
                  <el-col :span="12">
                    <div class="info_item">
                      <span class="info_label">对象行为：</span>
                      <span>{{ objectBehavior.obeName || '/' }}</span>
                    </div>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="12">
                    <div class="info_item">
                      <span class="info_label">行为编码：</span>
                      <span>{{ objectBehavior.obeNo || '/' }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <div class="info_item">
                      <span class="info_label">描述：</span>
                      <span>{{ objectBehavior.obeDesc || '/' }}</span>
                    </div>
                  </el-col>

                </el-row>
                <div class="card_title">
                  <span class="d_line"></span>
                  <span class="d_detail">映射S6</span>
                </div>
                <div style="width:100%;" v-if="s6Info">
                  <el-table :data="[s6Info]" ref="s6Info" style="width: 100%;">
                    <el-table-column prop="aiCode" label="服务编码" min-width="100">
                    </el-table-column>
                    <el-table-column prop="aiName" label="服务名称" min-width="100">
                      <template slot-scope="scope">
                        {{ scope.row.aiName || "/" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="objNm" label="所属对象" min-width="120">
                      <template slot-scope="scope">
                        {{ scope.row.objNm || "/" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="aiCreateUsernm" label="更新人" min-width="100">
                      <template slot-scope="scope">
                        {{ scope.row.aiCreateUsernm || "/" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="aiCreateTime" label="更新时间" min-width="160">
                      <template slot-scope="scope">
                        {{ scope.row.aiCreateTime || "/" }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-empty v-else description="暂无数据" :image-size="100" style="padding: 0;"></el-empty>
                <!-- <el-empty description="暂无此功能" :image-size="100" style="padding:0" /> -->
              </div>
              <!-- <div style="width: 100%; padding: 0 20px;">
              <el-table :data="objectBehaviorInfos" style="width: 100%; margin-top: 14px">
                <el-table-column prop="obeName" label="服务编码">
                </el-table-column>
                <el-table-column prop="obeNo" label="服务名称"> </el-table-column>
                <el-table-column prop="obeDesc" label="服务状态"> </el-table-column>
                <el-table-column prop="obeDesc" label="操作">
                  <template slot-scope='scope'>
                    <el-button type="text" @click="look(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div> -->

            </div>
          </div>
          <el-empty v-else description="暂无数据" :image-size="100" style="padding:0" />
        </div>
      </div>
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab5'">
      <div class="body content">
        <div class="obj-relation-content">
          <el-table :data="formatSysObjList(data1)" ref="multipleTableTwo">
            <el-table-column prop="objCd" label="库表对象编码" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column prop="objNm" label="库表对象名称" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column prop="bizDomainNm" label="业务域" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column prop="appCntrNm" label="所属中心" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column prop="objClsNm" label="分类" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column prop="attrs" label="属性" show-overflow-tooltip min-width="120px"></el-table-column>
            <el-table-column label="操作" width="120px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="designData1(scope.row)" size="small">设计</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-drawer size='46%' title="S6服务详情" :visible.sync="S6DrawerVisible" direction="rtl" :wrapperClosable="false"
      @closed="closed">
      <S6Details :basicData="basicData" />
    </el-drawer>
    <el-drawer size='46%' title="库表对象详情" :visible.sync="bussinessDrawerVisible" direction="rtl" :wrapperClosable="false"
      @closed="closed">
      <objectDetail />
    </el-drawer>
    <ObjectInfo :objId="objectInfoId" v-if="showObjectInfo" :visible="showObjectInfo" @close="showObjectInfo = false">
    </ObjectInfo>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import S6Details from "./S6Details.vue";
import objectDetail from "./objectDetail.vue";
import ObjectInfo from "./ObjectInfo.vue";
export default {
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: true,
    },
    value: {
      type: Boolean,
      default: () => false,
    },
    objectData: {
      type: Object,
      default: {},
    },
    basicInfo: {
      type: Object,
      default: {},
    },
    rowId: {
      type: String,
      default: '',
    },
    activeName: {
      type: String,
      default: 'tab1',
    },
    type: {
      type: String,
      default: 'object',
    },
    row: {
      type: Object,
      default: {},
    }

  },
  components: {
    S6Details,
    objectDetail,
    ObjectInfo,
  },
  data() {
    return {
      // activeName: "tab1",
      relationMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      objectInfoData: [
        {
          label: "对象名称：",
          value: "/",
        },
        {
          label: "编码：",
          value: "/",
        },
        {
          label: "对象类型：",
          value: "/",
        },
        {
          label: "分类：",
          value: "/",
        },

        {
          label: "所属业务域：",
          value: "/",
        },
        {
          label: "所属中心：",
          value: "/",
        },

        {
          label: "更新人：",
          value: "/",
        },
        {
          label: "更新时间：",
          value: "/",
        },
        {
          label: "描述：",
          value: "/",
        },
      ],
      tableData: [],

      objectActionRemark: "/",

      relationTableData: [

      ],
      objectBehaviorInfos: [],
      optionsRelation: [
        {
          value: "association",
          label: "关联",
        },
        {
          value: "aggregation",
          label: "聚合",
        },
        {
          value: "combination",
          label: "组合",
        },
        {
          value: "extends",
          label: "继承",
        },
      ],
      optionsNum: [
        {
          value: "0-N",
          label: "1:0..*",
        },
        {
          value: "1-N",
          label: "1:1..*",
        },
        {
          value: "0-1",
          label: "1:0..1",
        },
        {
          value: "1-1",
          label: "1:1",
        },
      ],
      optionsTypeMap: {
        1: "用户",
        2: "机构",
        3: "渠道",
        4: "产品",
        5: "合约",
        6: "系统",
      },
      source: [
        {
          name: '新建客户信息',
          code: 'createCustomerInfo'
        },
        {
          name: '查询客户信息',
          code: 'queryCustomerInfo'
        },
        {
          name: '更新客户信息',
          code: 'updateCustomerInfo'
        },
        {
          name: '删除客户信息',
          code: 'deleteCustomerInfo'
        }
      ],
      tabActive: 0,
      S6DrawerVisible: false,
      bussinessDrawerVisible: false,
      basicData: {},
      data1: [],
      showObjectInfo: false,
      objectInfoId: "",
      s6Info: null,
      showS6: false,
      bizDomain: {},
      bizDomainList: [],
      objMain: {},
      showAddModel: false,
      showl5ObjId: '',
      objectBehavior: {},
      // activeName:'1'
      // basicInfo: {}
    };
  },
  computed: {

  },
  created() {
    // this.qryObjBizObjectInfoV2();
    // this.basicInfo = this.objectData;
    this.qryObjBizObjectInfoV2(this.rowId);

  },
  methods: {
    formatSysObjList(arr) {
      if (Array.isArray(arr)) {
        return arr.map((i) => {
          let arr = i.l5SysBizObjectAttributeDTOs;
          let attrs = arr
            .map((a) => a.attrChiNm)
            .filter((a) => a)
            .join("、");
          return {
            ...i,
            bizDomainNm: i.bizDomainNm || "/",
            appCntrNm: i.appCntrNm || "/",
            attrs: i.l5SysBizObjectAttributeDTOs.length ? attrs : "/",
          };
        });
      } else {
        return [];
      }
    },
    handleS6Confirm(info) {
      console.log("info s6:", info);
      this.s6Info = info;
    },
    openS6() {
      this.showS6 = true;
      this.$nextTick(() => {
        this.$refs.s6.openDialog();
      });
    },
    concelDialog() {
      this.dialogVisible = false;
    },
    async confirmDialog() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit("confirm", { ...this.form, s6Info: this.s6Info }, this.currentIndex);
          this.dialogVisible = false;
        }
      });
    },
    openObjectInfo(id) {
      this.objectInfoId = id;
      this.showObjectInfo = true;
    },
    async qryObjBizObjectInfoV2(rowId) {
      let res = await this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
        objId: rowId,
      });
      this.objectInfoData[0].value = res.objName || '/';
      this.objectInfoData[1].value = res.objCode || '/';
      this.objectInfoData[2].value =
        res.objType == "00" ? "实体对象" : res.objType == "01" ? "值对象" : "聚合根对象";
      this.objectInfoData[3].value = this.optionsTypeMap[res.objClass] || '/';
      this.objectInfoData[4].value = res.bizDomainName || '/';
      this.objectInfoData[5].value = res.applicationName || '/';
      this.objectInfoData[6].value = res.updateUserName || '/';
      this.objectInfoData[7].value = res.updateTime || '/';
      this.objectInfoData[8].value = res.objDesc || '/';
      this.l5SysBizObjectAttributeDTOs = res.attributeInfos;
      this.relationTableData = res.objectRelInfos;
      this.objectBehaviorInfos = res.objectBehaviorInfos;
      const { businessDomainLists } = await this.rpc.controlWorkbench.queryBizDomainList();
      this.bizDomainList = businessDomainLists

      this.bizDomain = this.bizDomainList.find(item => item.bizDomainNo == res.bizDomainNo)

      if (this.objectBehaviorInfos.length > 0) {
        if (this.type === 'bussiness') {
          for (const tabItem of this.objectBehaviorInfos) {
            const formData = JSON.parse(JSON.stringify(tabItem));
            const s6 = formData.s6Info;
            const s6InfoList = s6 ? await this.getS6InfoFn(s6.aiCode, res.l5ObjId) : [];
            tabItem.s6Info = s6InfoList[0] || '';
          }
          this.objectBehavior = JSON.parse(JSON.stringify(this.objectBehaviorInfos[0])) || {};
          this.s6Info = this.objectBehaviorInfos[0].s6Info || '';
        } else {
          for (const tabItem of this.objectBehaviorInfos) {
            const formData = JSON.parse(JSON.stringify(tabItem));
            const s6 = formData.s6Info;
            const s6InfoList = s6 ? await this.getS6InfoFn(s6.aiCode, res.l5ObjId) : [];
            tabItem.s6Info = s6InfoList[0] || '';
          }
          const index = this.objectBehaviorInfos.findIndex(item => item.obeId == this.row.obeId);
          this.tabActive = index
          this.objectBehavior = this.objectBehaviorInfos[index];
          this.s6Info = this.objectBehaviorInfos[index].s6Info || '';
        }

        // this.isEdit = true;
      }
      if (res.l5ObjId) {
        const _data1 = await this.rpc.controlWorkbench.qrySysBizObjectInfo({
          objId: res.l5ObjId,
        });
        this.data1 = [_data1];
        this.objMain = _data1
        this.l5ObjId = res.l5ObjId || ''
      }
      // if (res.l5ObjId) {
      //   const _data1 = await this.rpc.controlWorkbench.qrySysBizObjectInfo({
      //     objId: res.l5ObjId,
      //   });
      //   this.data1 = [_data1];
      //   this.objMain = _data1
      // }
    },
    async getS6InfoFn(aiNmOrCd, objId) {
      let params = {
        aiNmOrCd: aiNmOrCd,
        objId: objId,
        beltLine: this.bizDomain.bizDomainNo,
        currentPage: 1,
        turnPageShowNum: 10,
      };
      const { infoList } =
        await this.rpc.controlWorkbench.qryS6ServiceInfoPage(params);
      return infoList
    },
    relashMultNameFun(key) {
      const tmp = this.optionsNum.find((item) => item.value == key);
      return tmp?.label;
    },
    look() {
      this.S6DrawerVisible = true
    },
    check() {
      this.bussinessDrawerVisible = true
    },
    clickTab(index) {
      this.tabActive = index;
      this.objectBehavior = this.objectBehaviorInfos[index];
      this.s6Info = this.objectBehaviorInfos[index].s6Info || ""
    }
  },
};
</script>
<style lang="scss" scoped>
.view_object {
  width: 100%;

  ::v-deep .el-tabs {
    min-height: 48px;
    border-bottom: 2px solid #E7E7EE !important;

    .el-tabs__header {
      padding-left: 0px;
      background: #fff;
      margin: 0;
    }

    .el-tabs__nav {
      font-family: PingFangSC-Semibold;
    }

    .el-tabs__nav-wrap::after {
      background: #fff;
    }

    .el-tabs--top .el-tabs__item.is-top {
      font-size: 14px;
    }

    .el-tabs__content {
      position: static;
    }

    .el-tabs__item {
      height: 48px;
      line-height: 48px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      font-weight: 400;
    }

    .el-tabs__item.is-active {
      color: #358aff;
    }

    .el-tabs__item.is-active {
      outline-offset: 0 !important;
      box-shadow: none !important;
    }

    .el-tabs__item:hover {
      color: #358aff;
    }

    .el-tabs__active-bar {
      background-color: #358aff;
      height: 3px;
    }

    .is-disabled {
      cursor: not-allowed;

      &:hover {
        color: #c0c4cc;
      }
    }
  }

  .demo-drawer__content {
    height: 90%;

    .body {
      height: 100%;
      // padding: 0 20px;
      border-bottom: 1px solid #f7f7f9;
      margin-top: 20px;
    }
  }

  .obj-action-cont {
    display: flex;

    .obj-action-cont-itemList {
      width: 152px;

      .obj-action-cont-itemList-item {
        width: 144px;
        height: 34px;
        line-height: 34px;
        border-radius: 2px;
        font-size: 14px;
        margin-top: 8px;
        display: flex;
        justify-content: space-around;
        padding: 0 10px;

        .obj-action-cont-itemList-item-icon {
          content: " ";
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url("~@m/assets/images/icon_移动@2x.png");
          background-size: cover;
          margin-top: 9px;
        }

        .obj-action-cont-itemList-item-name {
          flex: 1;
          margin-left: 6px;
          width: 96px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .obj-action-cont-itemList-item-delete {
          padding-top: 9px;
        }
      }

      .actived {
        background: #f0f5ff;
        color: #358aff;
      }
    }

    .obj-action-cont-item-cont {
      padding: 0 24px;
      border-left: 1px solid #dde0e4;
      flex: 1;
      margin-left: 8px;
    }
  }

  .obj-relation-content-tips {
    height: 32px;
    line-height: 32px;
    background: #fef2de;
    color: #f5a623;
    margin-bottom: 24px;

    p {
      padding-left: 20px;
    }
  }

  .objectInfo_main {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    // padding-bottom: 12px;
    background: #FAFAFC;
    padding: 20px 24px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    font-weight: 400;


    // border-bottom: 1px solid rgba(238, 240, 245, 1);
    .objectInfo_main_item {
      width: 50%;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #333;
      // label {
      //     // color: #999;
      // }
    }
  }

  .objectInfo_remark {
    display: flex;
    overflow: hidden;
    // margin-top: 12px;
    font-size: 14px;
    // min-height: 36px;
    // line-height: 36px;
    color: #333;

    label {
      min-width: 42px;
    }

    div {
      min-height: 20px;
    }
  }

  .objectInfo_main_item_remark {

    // color: #999;
    span {
      color: #333;
    }
  }

  .objectAction_main_param {
    h5 {
      color: #333;
      font-weight: 600;
      margin-top: 24px;
    }
  }

  .jh {
    display: inline-block;
    width: 44px;
    height: 20px;
    line-height: 18px;
    font-size: 12px;
    border: 1px solid #358aff;
    text-align: center;
    border-radius: 2px;
    color: #358aff;
    margin-left: 8px;
  }

  ::v-deep.el-table .el-table__body tr {
    cursor: pointer;
  }

  ::v-deep.el-table th {
    background: #fafafc;
    font-size: 14px;
    color: #333333;
  }

  ::v-deep.el-table th .cell {
    padding-left: 24px;
    line-height: 23px;
  }

  ::v-deep.el-table td {
    padding: 11px 0;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  ::v-deep.el-table td .cell {
    padding-left: 24px;
    line-height: 23px;
  }


}

.behavior_box {
  display: flex;
  // justify-content: space-between;
  background-color: #ffffff;
  height: calc(100vh - 150px);
  width: 100%;

  .list_box {
    min-width: 15%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    overflow-y: auto;
    // box-sizing: border-box;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      // text-align: center;
      // flex-shrink: 1;
      border: 1px solid #e5e5e5;
      font-size: 14px;
      line-height: 36px;
      margin-bottom: 10px;
      cursor: pointer;
      width: 100%;
      // padding: 0 10px;

      span {
        min-width: 0;
        /* 防止内容撑开 */
        padding: 4px 8px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }

      &.active {
        border: 1px solid #358AFF;
        color: #358AFF;
      }
    }
  }

  .content_list {
    flex: 1;
    padding: 0 20px;




    .card_title {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;
      margin-bottom: 24px;

      .d_line {
        display: inline-block;
        width: 3px;
        height: 14px;
        margin-right: 6px;
        background: #358AFF;
        flex-shrink: 0;
      }

      .d_detail {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 500;
      }

      .card_desc_tips {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        font-weight: 400;
        margin-left: 8px;
        line-height: 22px;
      }
    }

    .info_item {
      font-size: 14px;
      margin-bottom: 24px;

      .info_label {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
  }

  // .list_box {
  //     padding: 12px 24px;
  //     background: #F5F7FA;
  // }
}
</style>
