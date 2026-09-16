<template>
  <div>
    <el-dialog
      title="选择S6服务"
      :visible.sync="visible"
      class="add-s6-dialog"
      width="80%"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="10vh"
      @close="close"
    >
      <div class="title-select" slot="title">
        <el-radio-group v-model="titleActive" size="small">
          <el-radio-button label="1">映射库表对象下</el-radio-button>
          <el-radio-button label="2">新建S6服务</el-radio-button>
        </el-radio-group>
      </div>
      <div class="dialog-content">
        <template v-if="titleActive == '1'">
          <div class="search-form">
            <div class="left">
              <el-form
                ref="form"
                :model="searchForm"
                :inline="true"
                size="mini"
              >
                <el-form-item label="服务编码/名称:">
                  <el-input
                    v-model="searchForm.aiNmOrCd"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="业务域:">
                  <el-select
                    placeholder="请选择所属业务域"
                    v-model="searchForm.beltLine"
                    disabled
                  >
                    <el-option
                      :label="project && project.bizDomainNm"
                      :value="project && project.bizDomainNo"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="所属对象:" prop="objId">
                  <el-select
                    placeholder="请选择所属对象"
                    v-model="searchForm.objId"
                  >
                    <el-option
                      v-for="item in formData.sysObjList"
                      :key="item.objId"
                      :label="item.objNm"
                      :value="item.objId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="right">
              <el-button type="primary" size="small" @click="search"
                >查询</el-button
              >
              <el-button size="small" @click="reset">重置</el-button>
            </div>
          </div>

          <el-table
            :data="infoList"
            row-key="aiId"
            v-loading="loading"
            style="width: 100%"
            :height="500"
            ref="infoList"
            size="small"
            align="center"
            :stripe="false"
            highlight-current-row
            border
            :header-cell-style="{
              background: '#F5F5F8',
              color: '#333',
            }"
            @row-click="selectRow"
          >
            <el-table-column align="center" width="55" label="选择">
              <template slot-scope="scope">
                <el-radio :label="scope.row.aiId" v-model="selectedId"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column prop="aiCode" label="服务编码"></el-table-column>
            <el-table-column prop="aiName" label="服务名称"></el-table-column>
            <el-table-column prop="objNm" label="所属对象"></el-table-column>
            <el-table-column prop="aiModifyUsernm" label="更新人">
              <template slot-scope="scope">
                <span>{{ scope.row.aiModifyUsernm || "/" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="aiModifyTime" label="更新时间"
              ><template slot-scope="scope">
                <span>{{ scope.row.aiModifyTime || "/" }}</span>
              </template></el-table-column
            >
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="turnPageTotalNum"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
        <template v-if="titleActive == '2'">
          <el-form ref="s6" :model="formAdd" :rules="rules" size="small">
            <el-form-item label="所属业务域" prop="beltLine">
              <el-select
                placeholder="请选择所属业务域"
                style="width: 100%"
                v-model="formAdd.beltLine"
                disabled
              >
                <el-option
                  :label="project && project.bizDomainNm"
                  :value="project && project.bizDomainNo"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属对象" prop="objId">
              <el-select
                placeholder="请选择所属对象"
                style="width: 100%"
                v-model="formAdd.objId"
              >
                <el-option
                  v-for="item in formData.sysObjList"
                  :key="item.objId"
                  :label="item.objNm"
                  :value="item.objId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="aiName">
              <el-input
                maxLength="32"
                v-model="formAdd.aiName"
                placeholder="请输入服务名称"
              />
            </el-form-item>
            <el-form-item label="服务编码" prop="aiCode">
              <el-input
                maxLength="32"
                v-model="formAdd.aiCode"
                placeholder="请输入服务编码"
              />
            </el-form-item>
            <el-form-item label="描述" prop="aiDesc">
              <el-input v-model="formAdd.aiDesc" placeholder="请输入描述" />
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <template v-if="titleActive == '1'">
          <el-button
            size="medium"
            type="primary"
            @click="confirm"
            :disabled="selectedId == ''"
            >确 定</el-button
          >
        </template>
        <template v-else>
          <el-button size="medium" type="primary" @click="confirmAdd"
            >确 定</el-button
          >
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
    project: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      titleActive: "1",
      searchForm: {
        aiNmOrCd: "",
        objId: "",
        beltLine: this.project.bizDomainNo,
      },
      infoList: [],
      turnPageTotalNum: 0,
      currentPage: 1,
      loading: false,
      formAdd: {
        aiCode: "",
        aiName: "",
        aiDesc: "",
        objId: "",
        beltLine: this.project.bizDomainNo,
      },
      selectedId: "",
      selectedObj: null,
      rules: {
        aiName: [
          { required: true, message: "请输入服务名称", trigger: "blur" },
        ],
        aiCode: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,32}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
        beltLine: [{ required: true }],
        objId: [{ required: true, message: "请选择所属对象" }],
      },
    };
  },
  computed: {},
  async mounted() {
    console.log("formData.sysObjList", this.formData.sysObjList);
    if (this.formData.sysObjList.length) {
      let _obj = this.formData.sysObjList[0];
      this.formAdd.objId = _obj.objId;
      this.searchForm.objId = _obj.objId;
    }
    await this.reset();
  },
  methods: {
    async search() {
      this.loading = true;
      const { infoList, turnPageTotalNum } =
        await this.rpc.assetcenter.qryS6ServiceInfoPage({
          ...this.searchForm,
          turnPageShowNum: 10,
          currentPage: this.currentPage,
        });
      this.infoList = infoList;
      this.turnPageTotalNum = turnPageTotalNum;
      this.loading = false;
    },
    async reset() {
      this.searchForm.aiNmOrCd = "";
      this.currentPage = 1;
      this.turnPageTotalNum = 0;
      this.infoList = [];
      await this.search();
    },
    async handleCurrentChange(v) {
        this.currentChange = v
        await this.search()
    },
    close() {
      this.$emit("close");
    },
    selectRow(row) {
      this.selectedId = row.aiId;
      this.selectedObj = row;
    },
    confirm() {
      this.$emit("select", {
        selectedId: this.selectedId,
        info: this.selectedObj,
      });
    },
    confirmAdd() {
      this.$refs.s6.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.formAdd,
            beltLineNm: this.project.bizDomainNm,
          };
          const { aiId } = await this.rpc.assetcenter.saveS6ServiceInfo(params);
          this.selectedId = aiId;
          this.$emit("select", {
            selectedId: this.selectedId,
            info: {
              ...this.formAdd,
              aiId: aiId,
            },
          });
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../styles/mixin.scss";
.add-s6-dialog {
  /deep/.el-dialog__body {
    padding: 20px !important;
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

  .title-select {
    @include flex(row, center, center);
  }

  .dialog-content {
    height: 600px;
    overflow: auto;
    .search-form {
      @include flex(row, space-between, flex-start);
      .left {
        flex: 1;
      }
      .right {
        @include flex(row, flex-end, center);
      }
    }
  }
  /deep/.el-dialog__footer {
    @include flex(row, center, center);
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }
  .btn-group {
    text-align: center;
  }
  /deep/.el-pagination {
    padding: 0 !important;
    margin: 12px 0;
    text-align: right;
    .btn-next {
      margin-right: 0;
    }
  }
}
</style>

