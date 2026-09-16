<template>
  <div class="aop_workgate_comps_page_mock_row">
    <div class="mock_title">{{ title }}</div>
    <div class="mock_main">
      <JsonViewer
        class="io_data"
        :value="handleDataType(dataObj)"
        :expand-depth="6"
        :class="theme"
        copyable
        boxed
        :sort="false"
        v-show="type == 'view'"
      >
        <template slot="copy">
          <span v-if="copyable">copy</span>
        </template>
      </JsonViewer>
      <el-input
        type="textarea"
        :rows="3"
        placeholder=""
        v-model="exDataObj"
        @blur="handleDataJson($event.target.value)"
        v-show="type != 'view'"
        :disabled="disabled"
      >
      </el-input>
    </div>
  </div>
</template>
<script>
import JsonViewer from "vue-json-viewer";
import validate from "@m/utils/validate";
import { looseJsonParse } from "@m/utils/looseJson";
import { escape2Html } from "@m/utils/html2e";
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
      type: String,
      default: () => "",
    },
    theme: {
      type: String,
      default: () => "",
    },
    // 查看或编辑
    type: {
      type: String,
      default: () => "view",
    },
    // 是否允许编辑
    disabled: {
      type: Boolean,
      default: () => false,
    },
    copyable: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      // 原始数据
      exDataObj: "",

      //可提交数据
      resData: ""
    };
  },
  methods: {
    // 处理是否json
    handleDataType(e) {
      if (validate.isJson(escape2Html(e))) {
        return JSON.parse(escape2Html(e));
      } else {
        return escape2Html(e);
      }
    },
    //输入时转化
    handleDataJson(e) {
      // console.log(e)
      const item = escape2Html(e);
      try {
        const exItem = looseJsonParse(item);
        this.exDataObj = JSON.stringify(exItem, null, 4);
        this.resData = JSON.stringify(JSON.parse(this.exDataObj))
      } catch (err) {
        this.exDataObj = item;
        this.resData = this.exDataObj;
      }
    },
  },
  watch: {
    dataObj(val) {
      if (this.type !== "view") {
        this.handleDataJson(val);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_page_mock_row {
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