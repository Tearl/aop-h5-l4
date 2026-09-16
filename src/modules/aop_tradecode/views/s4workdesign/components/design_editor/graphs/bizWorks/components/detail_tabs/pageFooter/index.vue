<template>
  <div class="aop_client_footer">
    <button class="cancel" @click="$emit('handleLeft')">{{ leftbtn }}</button>
    <slot></slot>
    <button class="save" v-bind="$attrs" @click="handleR" v-if="rightbtn">
      {{ rightbtn }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    rightbtn: {
      default: "",
      type: String,
    },
    leftbtn: {
      default: "取 消",
      type: String,
    },
  },
  data() {
    return {
      timer: 0,
      now: true,
      throttleTime: 2000, //节流时间
    };
  },
  methods: {
    handleR() {
      if (!this.timer) {
        if (this.now) {
          this.$emit("handleRight");
          this.now = false;
          this.timer = setTimeout(() => {
            this.now = true;
            clearTimeout(this.timer);
            this.timer = 0;
          }, this.throttleTime);
        }
      }
    },
    handleSave() {
      this.$emit("handleSubmit");
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_client_footer {
  background: #fff;
  text-align: center;
  padding: 16px;
  box-shadow: 10px 1px 10px 0 #e7e7e7;
  z-index: 10;
  .save,
  .cancel {
    width: 112px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dde0e4;
    border-radius: 2px;
    background: #fff;
    color: #323c41;
    margin-right: 24px;
    cursor: pointer;
  }
  .save {
    background: #3771ff;
    border: 1px solid #3771ff;
    color: #fff;
    &:disabled {
      color: #bcbec2;
      background-color: #f4f4f5;
      border-color: #e9e9eb;
    }
  }
}
</style>
