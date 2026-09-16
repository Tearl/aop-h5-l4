<template>
  <div class="aop_workgate_comps_page_search_top">
    <div class="search_top">
      <div class="search_top_left">
        <el-form
          ref="formRefTop"
          :rules="rules"
          :model="form"
          label-width="80px"
          :inline="true"
        >
          <el-form-item
            v-for="(item, index) in serviceForm"
            :key="index"
            :prop="item.model"
          >
            <span v-if="item.type == 'input'">
              {{ item.label }}
              <el-input
                @keyup.enter.native="service"
                class="input"
                :style="item.style"
                v-model="form[item.model]"
                clearable
                :placeholder="item.placeholder"
                size="small"
              >
                <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </span>
            <span v-else-if="item.type == 'select'">
              {{ item.label }}
              <el-select
                :style="item.style"
                :filterable="item.filterable"
                v-model="form[item.model]"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                clearable
              >
                <el-option
                  v-for="i in item.select"
                  :key="i.value"
                  :label="i.type"
                  :value="i.value"
                ></el-option>
              </el-select>
            </span>
            <div v-else-if="item.type == 'datetime'">
              <el-date-picker
                size="small"
                v-model="form[item.startModel]"
                :style="item.style"
                type="datetime"
                clearable
                :editable="false"
                :value-format="item.valueFormat"
                :placeholder="item.startPlaceholder"
              >
              </el-date-picker>
              <span class="data_pocker_content">至</span>
              <el-date-picker
                size="small"
                v-model="form[item.endModel]"
                type="datetime"
                :style="item.style"
                clearable
                :placeholder="item.endPlaceholder"
                :value-format="item.valueFormat"
                @change="endDateChange"
              >
              </el-date-picker>
            </div>

            <div v-else-if="item.type == 'switch'" class="switch_content">
              <span class="switch_label">{{ item.label }}</span>
              <el-switch
                v-model="form[item.model]"
                :active-value="item.activeValue"
                :inactive-value="item.inactiveValue"
              >
              </el-switch>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="search_top_right">
        <slot name="rightButton">
          <el-button type="primary" @click="service" class="right_button"
            >搜索</el-button
          >
          <el-button @click="reset" class="right_button">重置</el-button>
        </slot>
      </div>
    </div>
    <div class="serivce_bottom" v-show="isOpen">
      <el-form
        ref="formRefBottom"
        :rules="rules"
        :model="form"
        label-width="80px"
        :inline="true"
      >
        <el-form-item
          v-for="(item, index) in serviceFormBottom"
          :key="index"
          :prop="item.model"
        >
          <el-input
            v-if="item.type == 'input'"
            class="input"
            :style="item.style"
            v-model="form[item.model]"
            clearable
            :placeholder="item.placeholder"
            size="small"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-select
            :filterable="item.filterable"
            v-else-if="item.type == 'select'"
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="i in item.select"
              :key="i.value"
              :label="i.type"
              :value="i.value"
            ></el-option>
          </el-select>

          <div v-else-if="item.type == 'datetime'">
            <el-date-picker
              size="small"
              v-model="form[item.startModel]"
              :style="item.style"
              type="datetime"
              clearable
              :editable="false"
              :value-format="item.valueFormat"
              :placeholder="item.startPlaceholder"
            >
            </el-date-picker>
            <span class="data_pocker_content">至</span>
            <el-date-picker
              size="small"
              v-model="form[item.endModel]"
              type="datetime"
              :style="item.style"
              clearable
              :placeholder="item.endPlaceholder"
              :value-format="item.valueFormat"
              @change="endDateChange"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serviceForm: {
      type: Array,
      default: () => [],
    },
    serviceFormBottom: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    isOpen: {
      type: Boolean,
      default: () => false,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    resetFields() {
      this.$refs.formRefTop.resetFields();
      this.$refs.formRefBottom.resetFields();
    },
    service() {
      this.$emit("service");
    },
    reset() {
      this.$emit("reset");
      // this.$refs.formRef.resetFields();
    },
    endDateChange(e) {
      this.$emit("endDateChange", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_page_search_top {
  background: $base_white;
  margin-bottom: 16px;
  .search_top {
    padding: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .data_pocker_content {
      margin: 0 8px;
    }
    .search_top_left {
      width: 900px;
    }
    .search_top_right {
      white-space: nowrap;
      ::v-deep .el-button {
        @include small_button_common;
        min-width: 64px;
      }
      ::v-deep .el-button--primary {
        @include primary_button;
      }
    }
  }
  .search_top,
  .serivce_bottom {
    ::v-deep .el-input__inner {
      height: 32px;
      line-height: 32px;
      background: $base_white;
      border-radius: $theme_radius;
    }
    ::v-deep .el-select .el-input__inner:focus {
      border-color: $pri_br_color;
    }
    ::v-deep .el-input__inner:focus {
      border-color: $pri_br_color;
    }
    .el-select ::v-deep .el-input__inner::placeholder {
      color: $reg_ft_color;
    }
  }
  .el-form {
    ::v-deep .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
      .el-input {
        font-size: 14px;
        color: $reg_ft_color;
        &.input {
          width: 240px;
        }
      }
      .el-select {
        .el-input__inner {
          width: 170px;
          padding: 0 10px;
        }
        ::v-deep .el-input__suffix {
          right: 2px;
        }
      }
    }
  }
}
</style>