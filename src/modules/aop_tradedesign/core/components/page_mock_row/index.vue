<template>
  <div class="aop_tradedesign_comps_page_mock_row">
    <div class="mock_title">{{ title }}</div>
    <div class="mock_main">
      <!-- <el-input type="textarea" :rows="18" v-model="dataObj"></el-input> -->
      <JsonViewer
        class="io_data"
        :value="dataObj"
        :expand-depth="6"
        :class="theme"
        copyable
        boxed
        sort
      >
        <template slot="copy">
          <span>复制</span>
        </template>
      </JsonViewer>
    </div>
  </div>
</template>
<script>
import JsonViewer from "vue-json-viewer";

export default {
  components: {
    JsonViewer,
  },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    theme: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_mock_row {
  background: $base_white;
  position: relative;
  .io_data {
    border-radius: $theme_radius;
    ::v-deep .jv-code {
      min-height: 350px;
      overflow: auto;
    }
    // ::v-deep .jv-more {
    //   .jv-toggle {
    //     display: none;
    //   }
    // }
  }
  .mock_title {
    font-family: $font_regular;
    font-size: 14px;
    color: $reg_ft_color;
    letter-spacing: 0;
    margin-bottom: 10px;
  }
  .mock_main {
    width: 100%;
    height: 100%;
  }
  // values are default one from jv-light template
  .vscode_theme {
    background: $base_black;
    color: $sec_ft_color;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;

    ::v-deep .jv-ellipsis {
      color: #999;
      background-color: #eee;
    }
    ::v-deep .jv-button {
      color: #a9dbfb;
    }
    ::v-deep .jv-key {
      color: #a9dbfb;
    }
    ::v-deep .jv-item {
      &.jv-array {
        color: #a9dbfb;
      }
      &.jv-boolean {
        color: #c6937c;
      }
      &.jv-function {
        color: #a9dbfb;
      }
      &.jv-number {
        color: #c6937c;
      }
      &.jv-number-float {
        color: #c6937c;
      }
      &.jv-number-integer {
        color: #c6937c;
      }
      &.jv-object {
        color: #a9dbfb;
      }
      &.jv-undefined {
        color: #c6937c;
      }
      &.jv-string {
        color: #c6937c;
      }
    }
    ::v-deep .jv-code {
      .jv-toggle {
        &:hover {
          &:before {
            background: #eee;
          }
        }
      }
    }
  }
}
</style>