<template>
  <div class="aop_tradedesign_comps_d4b_edit_create_system">
    <!-- 新增服务系统 -->
    <PageDialog
      :dialogWidth="'600px'"
      :dialogTitle="'新增服务系统'"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="create_dialog"
    >
      <div slot="box">
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="120px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="银行" prop="bkId">
              <el-select
                v-model="formData.bkId"
                placeholder="请选择"
                disabled
              >
                <el-option
                  v-for="item in bkList"
                  :label="item.bkNm"
                  :key="item.bkId"
                  :value="item.bkId"
                >
                  {{ item.type }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系统名称" prop="arsName">
              <el-input
                v-model.trim="formData.arsName"
                clearable
                placeholder="请输入系统名称"
              />
            </el-form-item>
            <el-form-item label="系统编码" prop="arsCode">
              <el-input
                v-model="formData.arsCode"
                clearable
                placeholder="请输入系统编码"
              />
            </el-form-item>
            <el-form-item label="服务类型">
              <el-select
                v-model="formData.servTypeList"
                placeholder="请选择服务类型"
                multiple
              >
                <el-option
                  v-for="(item) in servTypeList"
                  :key="item.servTypeId"
                  :value="item.servTypeId"
                  :label="item.servTypeNm"
                >
                  {{ item.servTypeNm }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系统描述" class="no_before">
              <el-input
                type="textarea"
                :rows="4"
                v-model="formData.arsDesc"
                clearable
                placeholder="请输入系统描述"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="confirm">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";

export default {
  mixins: [mixin],
  components: {
    PageDialog
  },
  props: {
    dialogVisiable: {
      type: Boolean,
      default: () => false,
    },
    bkList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        bkId: "",
        arsName: "",
        arsCode: "",
        servTypeList: [],
        arsDesc: "",
      },
      //定义规则
      rules: {
        bkId: [{ required: true, trigger: "blur", message: "银行不能为空" }],
        arsName: [
          { required: true, trigger: "blur", message: "系统名称不能为空" },
        ],
        arsCode: [
          { required: true, trigger: "blur", message: "系统编码不能为空" },
        ],
      },
      bankList: [{
        type: "YNET银行",
        value: "69573898205943214251"
      }],
      // 服务类型列表
      servTypeList: []
    }
  },
  methods: {
    resetDialog() {
      this.formData = {
        bkId: "69573898205943214251",
        arsName: "",
        arsCode: "",
        servTypeList: [],
        arsDesc: "",
      }
    },
    closeDialog() {
      this.resetDialog()
      this.$emit("closeDialog", "system")
    },
    confirm() {
      const form = this.$refs.form;
      const data = this.formData;
      data.serviceTypeList = data.servTypeList.map((item )=> {return {servTypeId:item}})
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        // if(this.$refs.addFrom.$refs.requestRow.resData !== "" && !validate.isJson(this.$refs.addFrom.$refs.requestRow.resData)) return this.$message.error("输入报文样例格式错误");
        // if(this.$refs.addFrom.$refs.responseRow.resData !== "" && !validate.isJson(this.$refs.addFrom.$refs.responseRow.resData)) return this.$message.error("输出报文样例格式错误");
        // const params = Object.assign(data, {
        //   requestStr: this.$refs.addFrom.$refs.requestRow.resData,
        //   responseStr: this.$refs.addFrom.$refs.responseRow.resData,
        // });
        const res = await this.rpc.public.addServiceSys(data);
        this.$notify({
          title: "成功",
          message: "新增服务系统成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("updateSelect", "system")
        this.closeDialog()
      });
    },
    async getServTypeList() {
      const res = await this.rpc.public.getServTypeList()
      this.servTypeList = res.serviceTypeList
    },
    init() {
      this.getServTypeList()
    }
  },
  created() {
    // this.init()
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4b_edit_create_system {
  .edit_form {
    @include form;
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
}
</style>
