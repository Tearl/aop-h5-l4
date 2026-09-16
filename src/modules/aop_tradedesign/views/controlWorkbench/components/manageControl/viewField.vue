<!--
 * 数据字典-数据字段管理/数据字典管控-查看字段
 -->
<template>
  <el-drawer
    class="aop-com-drawer"
    :title="drawerTitle"
    :size="800"
    :visible.sync="drawerShow"
    :wrapperClosable="false"
  >
    <div v-loading="isLoading" class="datadict-drawer-info-content">
      <!-- 查看 -->
      <div class="drawer-main-content aop-com-info-form-wrap">
        <div class="info-main view-mode">
          <dl
            v-for="(item, index) in infoList"
            :key="index"
            class="info-cell"
            :class="{ 'info-block': item.isBlock }"
          >
            <dt>{{ item.title }}：</dt>
            <dd>
              {{ item.contentKey ? drawerData[item.contentKey] || "/" : "/" }}
            </dd>
          </dl>
        </div>

        <!-- 枚举定义列表 -->
        <div class="table-list-box border-top">
          <div class="table-title">枚举定义</div>
          <div class="aop_common_page_table">
            <el-table :data="tableData">
              <el-table-column prop="enumLabel" label="枚举标签">
                <template slot-scope="scope">{{
                  scope.row.enumLabel || "/"
                }}</template>
              </el-table-column>
              <el-table-column
                prop="enumValue"
                label="枚举值"
              ></el-table-column>
              <el-table-column prop="enumKey" label="枚举key">
                <template slot-scope="scope">{{
                  scope.row.enumKey || "/"
                }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div v-if="action !== 'view'" class="info-bottom-handle">
        <el-button type="default" plain size="medium" @click="handleClose">
          取消
        </el-button>
        <el-button
          class="ml24"
          type="primary"
          size="medium"
          v-if="action === 'upgrade'"
          @click="handleUpgrade"
        >
          升级
        </el-button>
        <el-button
          class="ml24"
          type="primary"
          size="medium"
          v-if="action === 'fieldUse'"
          @click="handleFieldUse"
        >
          使用该字段
        </el-button>
        <el-button
          class="ml24"
          type="primary"
          size="medium"
          v-if="action === 'fieldUpgradeUse'"
          @click="handleFieldUpgradeUse"
        >
          升级并使用
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mixin from "@m/core/mixin";
import { applySourceOption } from "@m/utils/commonData";
import { arrayToJson } from "@m/utils/tools";
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      isLoading: false,
      drawerTitle: "查看字段",
      drawerShow: false, // 弹窗是否显示
      drawerData: {},
      action: "view",
      // 展示数据
      infoList: [
        {
          title: "字段名称",
          contentKey: "fieldName",
        },
        {
          title: "字段简称",
          contentKey: "fieldKeyName",
        },
        {
          title: "字段全称",
          contentKey: "fieldFullName",
        },
        {
          title: "别名",
          contentKey: "fieldAlias",
        },
        {
          title: "业务定义",
          contentKey: "fieldBusiness",
          isBlock: true,
        },
        {
          title: "业务规则",
          contentKey: "fieldRule",
          isBlock: true,
        },
        {
          title: "字段类型",
          contentKey: "fieldType",
        },
        {
          title: "字段长度",
          contentKey: "fieldLength",
        },
      ],
      controlInfo: [
        {
          title: "申请人",
          contentKey: "createUserName",
        },
        {
          title: "申请来源",
          contentKey: "fieldSourceName",
        },
        {
          title: "申请时间",
          contentKey: "createTime",
        },
      ],
      manageInfo: [
        {
          title: "字段主题",
          contentKey: "topicName",
        },
        {
          title: "标准分类",
          contentKey: "categoryName",
        },
        {
          title: "数据格式",
          contentKey: "dataFormat",
        },
        {
          title: "代码编码规则",
          contentKey: "codeRule",
        },
        {
          title: "取值范围",
          contentKey: "valueRange",
        },
        {
          title: "主数据系统",
          contentKey: "masterDataSystem",
        },
        // {
        //   title: "原始字典项英文名称",
        //   contentKey: "valueRange",
        // },
        // {
        //   title: "原始字典项英文简称",
        //   contentKey: "valueRange",
        // },
      ],
      tableData: [],
    };
  },
  inject: ["openTab"], // 用于打开窗口
  created() {},
  methods: {
    // 打开抽屉
    openDrawer(data = {}) {
      console.log(data, "data====");

      // data数据初始化
      Object.assign(this.$data, this.$options.data());
      this.drawerData = { ...data };
      this.action = data.action || "view";
      this.drawerTitle = data.drawerTitle || "查看字段";
      let applySourceObj = arrayToJson(applySourceOption);
      this.drawerData.fieldSourceName =
        applySourceObj[this.drawerData.fieldSource] ||
        this.drawerData.fieldSource ||
        "";
      this.tableData = data.dataDictionaryEnumLists || [];
      if (this.drawerData.viewType === "datadictControl") {
        this.infoList = this.infoList.concat(this.controlInfo);
      } else {
        this.infoList = this.infoList.concat(this.manageInfo);
      }
      // 有replaceField的，查replaceField数据
      if (data.fieldId) {
        this.rpc.datadict
          .dataDictionaryFieldDetailQuery({
            // fieldId: this.drawerData.fieldId,
            fieldId: this.drawerData.replaceField,
            fieldKeyName: this.drawerData.fieldKeyName,
            fieldSource: this.drawerData.fieldSource,
          })
          .then((res) => {
            this.drawerData = { ...res };
            this.drawerData.fieldSourceName =
              applySourceObj[this.drawerData.fieldSource] || "";
          })
          .catch((err) => {});
      }
      this.drawerShow = true;
    },
    handleUpgrade() {
      // 升级接口
      this.rpc.datadict
        .dataDictionaryFieldUpdate({
          fieldId: this.drawerData.fieldId || "",
          replaceField:
            this.drawerData.replaceField || this.drawerData.fieldId || "",
          fieldFlag: "2",
          operation: "1", // 操作方式 0：审批；1：修改
        })
        .then(() => {
          this.$notify({
            title: "成功",
            message: "升级成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("refreshData");
          this.drawerShow = false;
        })
        .catch(() => {});
    },
    handleFieldUse() {
      this.$emit("fieldUse", this.drawerData, "2");
    },
    handleFieldUpgradeUse() {
      this.$emit("fieldUpgradeUse", this.drawerData, "1");
    },
    handleClose() {
      this.drawerShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "../../css/page.scss";
@import "../../css/drawer.scss";
</style>
