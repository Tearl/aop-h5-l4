<template>
  <div>
    <el-dialog
      title="库表对象详情"
      :visible.sync="visible"
      class="object-info-dialog"
      width="800px"
      top="10vh"
      @close="close"
      append-to-body
    >
      <div class="dialog-content" v-loading="loading">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="tab1">
            <p>
              <span class="label">对象名称：</span>
              <span class="value">{{ info.objNm }}</span>
            </p>
            <p>
              <span class="label">编码：</span>
              <span class="value">{{ info.objCd }}</span>
            </p>
            <p>
              <span class="label">对象类型：</span>
              <span class="value">{{
                info.objTpCd == "00" ? "实体对象" : "值对象"
              }}</span>
            </p>
            <p>
              <span class="label">分类：</span>
              <span class="value">{{ info.objClsNm }}</span>
            </p>
            <p>
              <span class="label">所属业务域：</span>
              <span class="value">{{ info.bizDomainNm || "/" }}</span>
            </p>

            <p>
              <span class="label">所属中心：</span>
              <span class="value">{{ info.appCntrNm || "/" }}</span>
            </p>
            <p>
              <span class="label">描述：</span>
              <span class="value">{{ info.objDesc || "/" }}</span>
            </p>
            <p>
              <span class="label">更新人：</span>
              <span class="value">{{ info.upderNm || "/" }}</span>
            </p>
            <p>
              <span class="label">更新时间：</span>
              <span class="value">{{ info.updTm || "/" }}</span>
            </p>
          </el-tab-pane>
          <el-tab-pane label="对象属性" name="tab2">
            <el-table
              :data="l5SysBizObjectAttributeDTOs"
              ref="l5SysBizObjectAttributeDTOs"
            >
              <el-table-column
                show-overflow-tooltip
                prop="attrChiNm"
                label="字段名称"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.attrChiNm || "/" }}
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                prop="attrEngNm"
                label="编码"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.attrEngNm || "/" }}
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                prop="attrTpCd"
                label="数据类型"
                min-width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.attrTpCd || "/" }}
                </template>
              </el-table-column>

              <el-table-column
                show-overflow-tooltip
                prop="attrDesc"
                label="描述"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.attrDesc || "/" }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="对象关系" name="tab3">
            <el-table :data="l5SysBizObjectRelDTOs" ref="l5SysBizObjectRelDTOs">
              <el-table-column
                prop="objRelNm"
                show-overflow-tooltip
                label="关系名称"
              >
              </el-table-column>
              <el-table-column
                prop="objRelCd"
                show-overflow-tooltip
                label="编码"
              >
              </el-table-column>
              <el-table-column
                prop="curObjName"
                show-overflow-tooltip
                label="当前对象"
              >
              </el-table-column>
              <el-table-column
                prop="targetObjName"
                show-overflow-tooltip
                label="目标对象"
              >
              </el-table-column>
              <el-table-column prop="objRelTpCd" label="关系类型">
              </el-table-column>
              <el-table-column prop="bjRelEnum" label="关系重数">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="S6服务" name="tab4">
            <el-table :data="s6InfoList" ref="s6InfoList">
              <el-table-column
                prop="aiCode"
                show-overflow-tooltip
                label="服务编码"
              >
              </el-table-column>
              <el-table-column
                prop="aiName"
                show-overflow-tooltip
                label="服务名称"
              >
              </el-table-column>
              <el-table-column
                prop="aiDesc"
                show-overflow-tooltip
                label="服务描述"
              >
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    @click="openS6Info(scope.row)"
                    disabled
                    type="text"
                    style="color: grey"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="映射业务对象" name="tab5">
            <el-table :data="busList" ref="busList">
              <el-table-column
                prop="objCode"
                show-overflow-tooltip
                label="业务对象编码"
              >
              </el-table-column>
              <el-table-column
                prop="objName"
                show-overflow-tooltip
                label="业务对象名称"
              >
              </el-table-column>
              <el-table-column
                prop="objClassName"
                show-overflow-tooltip
                label="分类"
              >
              </el-table-column>
              <el-table-column
                prop="dictryName"
                show-overflow-tooltip
                label="属性"
              >
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    @click="openBusInfo(scope.row)"
                    disabled
                    type="text"
                    style="color: grey"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  name: "ObjectInfo",
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    objId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      activeTab: "tab1",
      relationMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      info: {},

      // 对象属性
      l5SysBizObjectAttributeDTOs: [],
      // 对象关系
      l5SysBizObjectRelDTOs: [],
      //   S6
      s6InfoList: [],

      busList: [],
    };
  },
  async mounted() {
    await this.qryObjectDetail();
  },
  methods: {
    async qryObjectDetail() {
      this.loading = true;
      this.info = await this.rpc.controlWorkbench.qrySysBizObjectInfo({
        objId: this.objId,
      });
      console.log("this.info", this.info);
      this.l5SysBizObjectAttributeDTOs =
        this.info.l5SysBizObjectAttributeDTOs || [];
      this.l5SysBizObjectRelDTOs = (this.info.l5SysBizObjectRelDTOs || []).map(
        (item) => {
          return {
            ...item,
            objRelTpCd: this.relationMap[item.objRelTpCd] || item.objRelTpCd,
          };
        }
      );
      this.s6InfoList = this.info.s6InfoList || [];

      const { infoList } = await this.rpc.controlWorkbench.qrySysObjBizObjRel({
        l5ObjId: this.objId,
      });
      this.busList = infoList || [];

      this.loading = false;
    },
    close() {
      this.$emit("close");
    },
    openS6Info(row) {},
    openBusInfo(row) {},
  },
};
</script>

<style lang="scss" scoped>
.object-info-dialog {
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f5f5fa;
    padding: 12px 20px;
    background: #fafafc;

    .el-dialog__title {
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
      font-family: PingFangSC-Medium;
    }

    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 12px 20px 20px 20px !important;
  }
  .dialog-content {
    max-height: 800px;
    min-height: 400px;
    overflow: auto;
    p {
      display: flex;
      margin-bottom: 8px;
    }
    .label {
      width: 90px;
      text-align: right;
      margin-right: 10px;
    }
    .value {
      color: #1b1d1d;
    }
  }
  .common_btns_area {
    text-align: center;
  }
}
</style>