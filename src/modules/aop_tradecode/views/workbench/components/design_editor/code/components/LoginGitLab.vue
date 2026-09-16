<template>
  <div class="aop_code_git_login">
    <el-dialog
      title="gitLab登录"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" v-show="showInput" prop="userName">
        
          <el-input type="text" v-model="ruleForm.userName" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-show="showInput"  prop="checkPass">
          <el-input
            type="password" 
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="disabled"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>  
<script>
export default {
  name: "NestedComponent",
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        //   if (this.ruleForm.checkPass !== '') {
        //     this.$refs.ruleForm.validateField('checkPass');
        //   }
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userName: undefined,
        checkPass: undefined,
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        userName: [{ validator: validateUserName, trigger: "blur" }],
      },
      dialogVisible: false,
      showInput: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.ruleForm = {
          userName: '',
          checkPass: '',
        }
        this.showInput = true
      }, 1000)

    })
  },
  computed: {
    disabled() {
      return !(this.ruleForm.checkPass && this.ruleForm.userName);
    },
  },
  methods: {
    submitForm() {
      this.$emit("login", this.ruleForm);
    },
    showDialog() {
      this.dialogVisible = true;
    },
    hideDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>