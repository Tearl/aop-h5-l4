<template>
  <div>
    <el-dialog
      title="编辑聚合"
      :visible.sync="visible"
      class="edit-agg-dialog"
      width="720px"
      :close-on-click-modal="false"
      top="10vh"
      @close="close"
    >
      <div class="dialog-content" v-loading="loading">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="1">
            <el-form ref="base" :model="formData" :rules="rules" size="mini">
              <el-form-item label="聚合名称" prop="aggregationName">
                <el-input
                  maxLength="32"
                  v-model.trim="formData.aggregationName"
                  placeholder="请输入聚合名称"
                />
              </el-form-item>
              <el-form-item label="聚合编码" prop="aggregationCode">
                <el-input
                  maxLength="32"
                  v-model.trim="formData.aggregationCode"
                  placeholder="字母、数字组合的编码，大写开头"
                />
              </el-form-item>
              <el-form-item label="描述" prop="aggregationDesc">
                <el-input
                  maxLength="500"
                  type="textarea"
                  v-model.trim="formData.aggregationDesc"
                  placeholder="请输入描述"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="对象列表" name="2">
            <el-table
              :data="bizObjectLists"
              style="width: 100%; margin: 12px 0"
              size="mini"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="objCode"
                label="业务对象编码"
              ></el-table-column>
              <el-table-column
                prop="objName"
                label="业务对象名称"
              ></el-table-column>
              <el-table-column
                prop="objTypeText"
                label="对象类型"
              ></el-table-column>
              <el-table-column
                prop="applicationName"
                label="所属中心"
              ></el-table-column>
              <el-table-column
                prop="objClassName"
                label="分类"
              ></el-table-column>
              <el-table-column
                prop="bizDomainName"
                label="业务域"
              ></el-table-column>
              <el-table-column label="操作" width="120px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    style="color: #f56c6c"
                    type="text"
                    size="mini"
                    v-if="!scope.row.canUseLink"
                    @click="delAggregationObjRel(scope.row.objId)"
                    >解除绑定</el-button
                  >
                  <span v-else>/</span>
                </template></el-table-column
              >
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import _ from "lodash";
export default {
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    agg: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      activeTab: "1",
      formData: {
        aggregationCode: "",
        aggregationName: "",
        aggregationId: "",
        aggregationDesc: "",
      },
      bizObjectLists: [],
      aggRoot: null,
      objTypeMap: {
        "00": "实体对象",
        "01": "值对象",
        "02": "聚合根对象",
      },
      rules: {
        aggregationName: [
          { required: true, message: "请输入聚合名称", trigger: "blur" },
        ],
        aggregationCode: [
          {
            required: true,
            pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，大写开头",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async mounted() {
    const _data = this.agg.getData();
    this.aggRoot = _data.aggRoot;
    this.formData = _.pick(_data, [
      "aggregationCode",
      "aggregationName",
      "aggregationId",
      "aggregationDesc",
    ]);
    await this.qryAggObjRelList();
  },
  methods: {
    async qryAggObjRelList() {
      const { bizObjectLists } = await this.rpc.assetcenter.qryAggObjRelList({
        aggregationId: this.formData.aggregationId,
      });
      this.bizObjectLists = bizObjectLists.map((i) => {
        return {
          ...i,
          objTypeText: this.objTypeMap[i.objType] || "/",
          canUseLink: this.checkLink(i.objId),
        };
      });
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$refs.base.validate(async (valid) => {
        if (valid) {
          await this.rpc.assetcenter.updateBizAggregationInfo(this.formData);
          this.$emit("updateAgg", this.formData);
        }
      });
    },
    checkLink(objId) {
      return _.some(
        this.aggRoot.objectRelInfos,
        (i) => i.curObjId == objId || i.tgtObjId == objId
      );
    },
    async delAggregationObjRel(objId) {
      await this.rpc.assetcenter.delAggregationObjRel({
        aggregationId: this.formData.aggregationId,
        objId,
      });
      this.$message.success("解绑成功");
      await this.qryAggObjRelList();
      this.$emit("removeObj", objId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
.edit-agg-dialog {
  /deep/.el-dialog__body {
    padding: 10px 20px 20px 20px !important;
  }
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
  /deep/.el-dialog__footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }
  .btn-group {
    text-align: center;
  }

  .dialog-content {
    height: 550px;
    overflow-y: scroll;
  }
}
</style>

