<template>
  <div class="view-object-drawer">
    <el-drawer
      title="查看对象"
      :visible.sync="isShow"
      size="800px"
      :wrapperClosable="false"
      :before-close="handleClose"
    >
      <div class="drawer-content" v-if="isShow">
        <el-tabs v-model="activeTab" class="fixed-tab">
          <el-tab-pane label="基本信息" name="1">
            <div class="base-info">
              <BaseItem label="对象名称：" :value="nodeDataDetail.objName" />
              <BaseItem label="编码：" :value="nodeDataDetail.objCode" />
              <BaseItem label="对象类型：" :value="nodeDataDetail.objTypeNm" />
              <BaseItem
                label="所属业务域："
                :value="nodeDataDetail.bizDomainName"
              />
              <BaseItem
                label="所属中心："
                :value="nodeDataDetail.applicationName"
              />
              <BaseItem label="分类：" :value="nodeDataDetail.objClassName" />
              <BaseItem label="描述：" :value="nodeDataDetail.objDesc" />
              <BaseItem
                label="更新人："
                :value="nodeDataDetail.updateUserName"
              />
              <BaseItem label="更新时间：" :value="nodeDataDetail.updateTime" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="对象属性" name="2">
            <el-table
              :data="nodeDataDetail.attributeInfos"
              style="width: 100%"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="dictryName"
                label="字段名称"
              ></el-table-column>
              <el-table-column prop="dictryNo" label="编码"></el-table-column>
              <el-table-column
                prop="dictryType"
                label="数据类型"
              ></el-table-column>
              <el-table-column prop="dictryDesc" label="描述">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictryDesc || "/" }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="对象关系" name="3">
            <el-table
              :data="nodeDataDetail.objectRelInfos"
              style="width: 100%"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="obrName"
                label="关系名称"
              ></el-table-column>
              <el-table-column prop="obrCode" label="编码"></el-table-column>
              <el-table-column
                prop="curObjName"
                label="当前对象"
              ></el-table-column>
              <el-table-column
                prop="tgtObjName"
                label="目标对象"
              ></el-table-column>
              <el-table-column prop="obrRelash" label="关系类型">
                <template slot-scope="scope">
                  <span>{{ objRelTpCdNmMap[scope.row.obrRelash] || "/" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="relashMult" label="关系重数">
                <template slot-scope="scope">
                  <span>{{ formatRelation(scope.row) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="对象行为" name="4">
            <div class="behaviors">
              <div class="left-btns">
                <el-button
                  :type="
                    editBehaviorForm && index == editBehaviorForm.formIndex
                      ? 'primary'
                      : ''
                  "
                  size="small"
                  plain
                  v-for="(be, index) in nodeDataDetail.objectBehaviorInfos"
                  @click="selectBeh(be, index)"
                  :key="index"
                >
                  {{ be.obeName }}
                </el-button>
              </div>
              <div class="right-info" v-if="editBehaviorForm">
                <div class="info-title">
                  <span class="title">基本信息</span>
                  <div></div>
                </div>

                <el-form ref="be_base" :model="editBehaviorForm" size="small">
                  <el-form-item label="行为名称" prop="obeName">
                    <el-input
                      maxLength="32"
                      v-model.trim="editBehaviorForm.obeName"
                      placeholder="请输入行为名称"
                      readonly
                    />
                  </el-form-item>
                  <el-form-item label="行为编码" prop="obeNo">
                    <el-input
                      maxLength="32"
                      v-model.trim="editBehaviorForm.obeNo"
                      placeholder="字母、数字组合的编码，小写开头"
                      readonly
                    />
                  </el-form-item>
                  <el-form-item label="描述" prop="obeDesc">
                    <el-input
                      maxLength="500"
                      type="textarea"
                      v-model.trim="editBehaviorForm.obeDesc"
                      placeholder="请输入描述"
                      readonly
                    />
                  </el-form-item>
                  <div class="title2">
                    <span class="title">映射S6服务</span>
                  </div>

                  <el-table
                    :data="editBehaviorForm.s6InfoArr"
                    style="width: 100%; margin: 12px 0"
                    size="small"
                    align="center"
                    :stripe="false"
                    border
                    :header-cell-style="{
                      background: '#F5F5F8',
                      color: '#333',
                    }"
                  >
                    <el-table-column
                      prop="aiCode"
                      label="服务编码"
                    ></el-table-column>
                    <el-table-column
                      prop="aiName"
                      label="服务名称"
                    ></el-table-column>
                    <el-table-column prop="aiState" label="服务状态">
                      <span>/</span>
                    </el-table-column>
                  </el-table>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="映射库表对象" name="5">
            <el-table
              :data="formatSysObjList(nodeDataDetail.sysObjList)"
              style="width: 100%; margin: 12px 0"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="objCd"
                label="库表对象编码"
              ></el-table-column>
              <el-table-column
                prop="objNm"
                label="库表对象名称"
              ></el-table-column>
              <el-table-column
                prop="bizDomainNm"
                label="业务域"
              ></el-table-column>
              <el-table-column
                prop="appCntrNm"
                label="所属中心"
              ></el-table-column>
              <el-table-column prop="objClsNm" label="分类"></el-table-column>
              <el-table-column prop="attrs" label="属性"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import BaseItem from "./BaseItem.vue";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {
    BaseItem,
  },
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    designType: {
      type: String,
      default: "domain_model", // domain_model 产品域模型 product_model 产品模型
    },
    treeNodeData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isShow: false,
      activeTab: "1",
      nodeDataDetail: {},
      formatObjType: {
        "00": "实体对象",
        "01": "值对象",
        "02": "聚合根",
      },
      objRelTpCdNmMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      relationMap: {
        "0-N": "1:0..*",
        "1-N": "1:1..*",
        "0-1": "1:0..1",
        "1-1": "1:1",
        "N-0": "1:1",
        "N-1": "1:1",
        "1-0": "1:0..1",
      },

      editBehaviorForm: null,
    };
  },
  methods: {
    formatRelation(row) {
      if (row.object1Multiplicity && row.object2Multiplicity) {
        return this.relationMap[
          `${row.object1Multiplicity}-${row.object2Multiplicity}`
        ];
      }
      return "/";
    },
    async show(nodeData, tab) {
      const res = await this.rpc.assetcenter.qryBizObjectInfoV2({
        objId: nodeData.objId,
        belongId:
                this.designType == "domain_model"
                  ? this.project.projectId
                  : this.treeNodeData.id,
              belongType:
                this.designType == "domain_model"
                  ? "app"
                  : this.formatBelongType(this.treeNodeData),
              designType: this.designType,
      });
      this.nodeDataDetail = {
        ...res,
        objTypeNm: this.formatObjType[res.objType],
        sysObjList: [],
      };
      if (this.nodeDataDetail.objectBehaviorInfos.length) {
        this.selectBeh(this.nodeDataDetail.objectBehaviorInfos[0], 0);
      } else {
        this.editBehaviorForm = null;
      }

      if (this.nodeDataDetail.l5ObjIds.length) {
        const ps = this.nodeDataDetail.l5ObjIds.map((id) => {
          return this.rpc.assetcenter.qrySysBizObjectInfo({
            objId: id,
          });
        });
        const results = await Promise.all(ps);
        this.nodeDataDetail.sysObjList = results;
      }

      this.activeTab = tab || "1";

      console.log("nodeDataDetail", this.nodeDataDetail);

      this.isShow = true;
    },
    viewS6(row) {
      window.open(
        `/aop-h5-sub/#/aop_l5design/application/serviceS6BaseInfo?apiId=${row.aiId}&bizDomainNo=${row.beltLine}&currentType=S5&mode=view`,
        "_blank"
      );
    },
    selectBeh(item, index) {
      this.editBehaviorForm = {
        ...item,
        s6InfoArr: item.s6Info ? [item.s6Info] : [],
        formIndex: index,
      };
    },
    formatSysObjList(arr) {
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
/deep/ .el-drawer__header {
  margin: 0;
  padding: 12px;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #e2e2e2;
}
/deep/ .el-drawer__body {
  padding: 12px 12px 0 12px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  .drawer-content {
    flex: 1;
    overflow: hidden;
    .fixed-tab {
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-tabs__header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
        margin: 0 !important;
        border-bottom: 1px solid #e6e6e6;
      }
      .el-tabs__content {
        flex: 1;
        overflow-y: auto;
        padding: 12px 0;
      }
    }
    .el-tabs {
      .el-tabs__content {
        .el-tab-pane {
          height: 100%;
          .behaviors {
            @include flex(row, space-between, flex-start);
            height: 100%;
            .left-btns {
              @include flex(column, flex-start, center);
              width: 140px;
              height: 100%;
              overflow-y: scroll;
              .el-button {
                margin-left: 0 !important;
                width: 100%;
                margin-bottom: 12px;

                @include flex(row, center, center);
                padding: 8px 0 !important;
                span {
                  width: 116px;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: normal;
                  line-height: 1.2;
                }
              }
            }
            .right-info {
              flex: 1;
              padding-left: 12px;
              margin-left: 12px;
              border-left: 1px solid #e5e5e5;
              .info-title {
                @include flex(row, space-between, center);
                margin-bottom: 12px;
              }
              .title2 {
                display: flex;
                margin: 24px 0 12px 0;
              }
              .title {
                font-size: 14px;
                font-weight: 600;
              }
              .title::before {
                content: "";
                display: inline-block;
                width: 4px;
                height: 10px;
                margin-right: 2px;
                background-color: #358aff;
              }
            }
          }
        }
      }
    }
  }
}
</style>

