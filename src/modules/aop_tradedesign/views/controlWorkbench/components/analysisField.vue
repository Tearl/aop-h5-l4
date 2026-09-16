<!--
 * 数据字典-数据字段管理-新增字段
 -->
<template>
  <div>
    <el-drawer class="aop-com-drawer" :append-to-body="true" title="新建业务对象" :size="800" :visible.sync="drawerShow"
      :before-close="handleClose" :wrapperClosable="false">
      <div class="info-content">
        <div class="drawer-main-content info-form-content">
          <!-- 内容 -->
          <div class="aop-com-info-form-wrap">
            <!-- 模块信息表单 -->
            <el-form ref="infoForm" :model="formData" :rules="formRules" label-position="top" :inline="false"
              size="small" @submit.native.prevent>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="业务对象名称" prop="fieldName">
                    <el-input class="input-primary-btn" v-model="formData.fieldName" placeholder="请输入字段名称，用可空号隔开进行评估分析"
                      :maxlength="20" :disabled="initData.fieldNameDisabled">
                      <el-button slot="append" type="primary" @click="handleAnalysis" :loading="isLoading"
                        :disabled="isLoading">{{ isAnalyzed ? "重新分析" : "分析" }}</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="padding-b-12" v-if="isAnalyzed">
              <el-button @click="handleSelect" type="primary" style="width: 100px" size="mini">选择</el-button>
              <span class="btn-tips">系统识别到同名库表对象，可以选择该对象，复制其数据生成业务对象；如不合适，可以选择其他。</span>
            </div>
            <div v-if="isAnalyzed" class="aop_common_page_table">
              <el-table v-loading="isLoading" :data="tableData" @row-click="singleSelect" highlight-current-row>
                <el-table-column prop="objCd" label="" align="center" min-width="55">
                  <template slot-scope="scope">
                    <el-radio v-model="tableSelection" :label="scope.row.objCd">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="objCd" label="库表对象编码" min-width="100"></el-table-column>
                <el-table-column prop="objNm" label="库表对象名称" min-width="100"></el-table-column>
                <el-table-column prop="objClsNm" label="分类" min-width="80"></el-table-column>
                <el-table-column prop="attributesStr" label="属性" min-width="160">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 底部操作按钮 -->
        <div class="info-bottom-handle">
          <el-button type="default" plain size="medium" @click="handleClose">
            取消
          </el-button>
          <el-button class="ml24" type="primary" size="medium" @click="handleConfirm">
            确定
          </el-button>
        </div>
      </div>
      <addModel ref="addModel" @selectData="selectData"> </addModel>
    </el-drawer>
    <!-- 新增词根 -->
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import addModel from "./popObjSelect.vue";
export default {
  mixins: [mixin],
  components: { addModel },
  data() {
    return {
      isLoading: false,
      drawerShow: false, // 弹窗是否显示
      // 表单数据
      formData: {
        fieldName: "",
      },
      analysisName: "",
      // 表单规则
      formRules: {
        fieldName: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      // 选中
      tableSelection: "",
      isAnalyzed: false,
      initData: {},
      maxRootCount: 0,
    };
  },
  created() { },
  methods: {
    handleSelect() {
      this.$refs.addModel.openDialog();
    },
    selectData(info = {}) {
      this.drawerShow = false;
      this.$emit("analysisConfirm", {
        analysisFirst: this.initData.analysisFirst,
        fieldName: this.formData.fieldName,
        info,
      });
    },
    openDrawer(data = {}) {
      Object.assign(this.$data, this.$options.data());
      this.drawerShow = true;
      this.initData = data || {};
      if (data.fieldName) {
        this.formData.fieldName = data.fieldName || "";
      }
      this.$nextTick(() => {
        this.$refs.infoForm && this.$refs.infoForm.clearValidate();
        if (!data.analysisFirst) {
          this.handleAnalysis();
        }
      });
    },
    // 点击分析按钮
    handleAnalysis() {
      this.$refs.infoForm.validate((valid, validObject) => {
        if (valid === true) {
          this.isLoading = true;
          this.rpc.controlWorkbench
            .qryPageSysBizObjectInfoListFilter({
              objNm: this.formData.fieldName,
              currentPage: "1",
              turnPageShowNum: "10",
            })
            .then((res) => {
              this.isAnalyzed = true;
              this.analysisName = this.formData.fieldName;
              this.tableData = res.l5SysBizObjectInfos.map((item) => {
                let temArr = [];
                item.l5SysBizObjectAttributeDTOs.length &&
                  item.l5SysBizObjectAttributeDTOs.forEach((val) => {
                    if (val.attrChiNm) {
                      temArr.push(val.attrChiNm);
                    }
                  });
                return {
                  ...item,
                  attributesStr: temArr.join("、"),
                };
              });
            })
            .catch((err) => { })
            .finally(() => {
              this.isLoading = false;
            });
        }
      });
    },

    singleSelect(row) {
      this.tableSelection = row.objCd;
    },
    // 点击取消按钮
    handleClose() {
      this.isLoading = false;
      this.drawerShow = false;
      this.$emit("analysisConfirm", {
        analysisFirst: this.initData.analysisFirst,
        fieldName: this.formData.fieldName,
      });
    },
    // 点击确定按钮
    handleConfirm() {
      if (!this.formData.fieldName) {
        this.$message.error("请输入对象名称并分析");
        return false;
      }
      if (this.analysisName !== this.formData.fieldName) {
        this.$message.error("请重新分析对象名称");
        return false;
      }
      // if (!this.tableSelection) {
      //   this.$message.error("请选择推荐");
      //   return false;
      // }
      let selected = this.tableData.filter(
        (item) => item.objCd == this.tableSelection
      );
      this.drawerShow = false;
      this.$emit("analysisConfirm", {
        analysisFirst: this.initData.analysisFirst,
        fieldName: this.formData.fieldName,
        info: selected[0],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "@m/assets/css/public.scss";
@import "./page.scss";

.info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 1px solid #e7e7ee;

  .drawer-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .info-top-fixed {
    flex: none;
  }

  .top-header-tab {
    padding: 0 24px;
    box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  }

  .info-bottom-handle {
    flex: none;
    height: 72px;
    box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
    @extend .flex-center;

    ::v-deep .el-button {
      width: 112px;
      height: 40px;
      border-radius: 2px;
    }
  }
}

.info-form-content {
  padding: 24px;

  .aop-com-info-form-wrap {
    ::v-deep {
      .el-form-item {
        margin-bottom: 24px;
      }

      .el-form-item__label {
        line-height: 16px;
        padding-bottom: 12px;
      }

      .el-select {
        width: 100%;
      }
    }
  }

  .required-title {
    padding-bottom: 12px;
    font-size: 14px;
    color: #323c41;
    line-height: 16px;
    font-weight: 400;

    &::before {
      display: inline-block;
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}

.input-primary-btn {
  ::v-deep .el-input-group__append {
    .el-button {
      color: #fff;
      background-color: $theme_color;
      border-radius: 0 3px 3px 0;
    }
  }
}

.btn-tips {
  color: #999999;
  font-size: 13px;
  margin-left: 10px;
}
</style>
