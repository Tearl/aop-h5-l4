<template>
  <div class="aop_tradedesigncomps_rule_add">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header_title">
          {{ `${ruleId ? "编辑" : "创建"}验证规则` }}
        </div>
        <el-form
          ref="createFormRef"
          class="create_form"
          :model="createForm"
          :rules="createRules"
          label-width="120px"
        >
          <div class="form_info">
            <el-form-item label="规则名称" prop="ruleNo">
              <el-input
                v-model="createForm.ruleNo"
                clearable
                placeholder="请输入规则名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="规则中文名称" prop="ruleNm">
              <el-input
                v-model="createForm.ruleNm"
                clearable
                placeholder="请输入规则中文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="ruleClassifyId">
              <el-select
                v-model="createForm.ruleClassifyId"
                clearable
                placeholder="所属分类"
              >
                <el-option
                  v-for="item in ruleClassification"
                  :key="item.clsfId"
                  :label="item.clsfCnNm"
                  :value="item.clsfId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则描述" prop="ruleDescr">
              <el-input
                type="textarea"
                v-model="createForm.ruleDescr"
                clearable
                placeholder="请输入规则描述"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="规则类型" prop="ruleType">
              <el-select
                v-model="createForm.ruleType"
                clearable
                placeholder="规则类型"
              >
                <el-option
                  v-for="item in ruleTypeOption"
                  :key="item.ruleType"
                  :label="item.label"
                  :value="item.ruleType"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="验证规则" prop="ruleExps" v-if="createForm.ruleType == '1'">
              <el-input
                type="textarea"
                v-model="createForm.ruleExps"
                clearable
                placeholder="请输入验证规则"
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="正则表达式" prop="ruleExps">
              <el-input
                type="textarea"
                v-model="createForm.ruleExps"
                clearable
                placeholder="请输入正则表达式"
              >
              </el-input>
            </el-form-item> -->
            <el-form-item label="提示信息" prop="ruleTip">
              <el-input
                type="textarea"
                v-model="createForm.ruleTip"
                clearable
                placeholder="请输入提示信息"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <PageFooter @handleConfirm="preservation"> </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageFooter from "@m/core/components/page_footer";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
  },
  props: {
    ruleId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 添加编辑表单
      createForm: {
        ruleNo: "", // 名称
        ruleNm: "", // 中文名
        ruleClassifyId: "", // 分类id
        ruleDescr: "", // 描述
        ruleType: "", // 规则类型
        ruleExps: "", // 表达式
        ruleTip: "", // 提示信息
      },
      // 添加编辑表单验证规则
      createRules: {
        ruleNo: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ruleNm: [
          { required: true, trigger: "blur", validator: this.validator },
        ],
        ruleClassifyId: [
          { required: true, message: "请选择规则分类", trigger: "change" },
          { required: true, message: "请选择规则分类", trigger: "blur" },
        ],
        ruleDescr: [
          { required: true, message: "请输入验证描述", trigger: "blur" },
        ],
        ruleExps: [
          { required: true, message: "请输入正则表达式", trigger: "blur" },
        ],
        ruleTip: [
          { required: true, message: "请输入提示信息", trigger: "blur" },
        ],
        ruleType: [
          { required: true, message: "请选择规则类型", trigger: "change" },
        ],
      },
      ruleClassification: [],
      ruleTypeOption: [
        // { ruleType: "0", label: "应用验证类"},
        { ruleType: "1", label: "正则表达式"},
      ],
      disabled: false,
    };
  },
  methods: {
    // 创建规则校验
    validator(rule, value, callback) {
      switch (rule.field) {
        case "ruleNm": // 分类中文名
          if (!value) return callback("请输入规则中文名称");
          else if (!/^[\u4E00-\u9FA5]+$/.test(value))
            return callback("请输入中文名");
          else return callback();
        default:
          return callback();
      }
    },
    // 查询验证规则分类
    async getRuleClassification() {
      const res = await this.rpc.systemmgmt.getRuleClassification();
      this.ruleClassification = res.rciList;
    },
    // 保存
    preservation() {
      if (this.disabled) {
        return
      }
      console.log(1111)
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1000)
      this.$refs.createFormRef.validate(async (valid) => {
        if (!valid) return;
        if (!this.ruleId) {
          if (this.createForm.ruleType == "0") this.createForm.ruleExps = ""
          const res = await this.rpc.systemmgmt.addRule(this.createForm);
          this.$notify({
            title: "成功",
            message: "创建成功",
            duration: 2000,
            type: "success",
          });
          this.$router.push({ path: "/aop_tradedesign/dicmgmt/ruleList" });
        } else {
          if (this.createForm.ruleType == "0") this.createForm.ruleExps = ""
          const res = await this.rpc.systemmgmt.editRule(this.createForm);
          this.$notify({
            title: "成功",
            message: "编辑成功",
            duration: 2000,
            type: "success",
          });
          this.$router.push({ path: "/aop_tradedesign/dicmgmt/ruleList" });
        }
      });
    },
    // 获取编辑信息
    async getEditData() {
      if (!!this.ruleId) {
        const params = {
          ruleId: this.ruleId,
        };
        const res = await this.rpc.systemmgmt.idGetRuleList(params);
        this.createForm = res;
      }
    },
    // 初始化
    init() {
      this.getRuleClassification();
      this.getEditData();
    },
  },
  created() {
    this.init();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesigncomps_rule_add {
  .create_content_wrapper {
    padding: 16px 24px;
  }
  .detail_content {
    background: $base_white;
    padding: 20px 30px;
    min-height: 78.5vh;
    .content_header,
    .content_header_title {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
    }
    .create_form {
      margin-top: 32px;
      @include form($input_width: 600px);
    }
  }
}
</style>