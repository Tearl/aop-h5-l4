<!-- 数据格式提示框 -->
<template>
  <div class="poptips">
    <el-popover placement="right" trigger="hover" width="500">
      <i class="el-icon-question warning-tip-btn" slot="reference"></i>
      <div class="warning-tip-text" v-if="type == 'define'">
        字段定义是对字段的定义和特性进行明确描述，用于确定字段在系统或数据库中的角色及用途。
      </div>
      <div class="warning-tip-text" v-if="type == 'rule'">
        字段规则是对字段数据的输入、存储和使用等方面所遵循的约束条件和规范的说明，用于确保字段数据的准确性、完整性和一致性。
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.warning-tip-btn {
  cursor: pointer;
  font-size: 14px;
  color: #ff9841;
  margin-left: 4px;
}

.warning-tip-text {
  font-size: 14px;
  color: #ff9841;
  line-height: 22px;
  padding: 5px;
  background-color: rgba(250, 205, 145, 0.32156862745098) !important;
}
</style>
