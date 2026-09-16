<template>
  <div class="object-graph-shortcut">
    <div class="left">
      <el-tooltip effect="dark" content="取消" placement="top">
        <div
          class="object-graph-shortcut-key"
          :class="{ disabled: disabled.includes('undo') }"
          @click="iconClick('undo')"
        >
          <icon-container name="#icon-undo" />
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="重做" placement="top">
        <div
          class="object-graph-shortcut-key"
          :class="{ disabled: disabled.includes('redo') }"
          @click="iconClick('redo')"
        >
          <icon-container name="#icon-redo" />
        </div>
      </el-tooltip>
      <div><el-divider direction="vertical" /></div>
      <el-tooltip effect="dark" content="选择" placement="top">
        <div
          class="object-graph-shortcut-key"
          :class="{ activated: current == 'click' }"
          @click="iconClick('click')"
        >
          <icon-container name="#icon-select" />
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="拖拽画布" placement="top">
        <div
          class="object-graph-shortcut-key"
          :class="{ activated: current == 'move' }"
          @click="iconClick('move')"
        >
          <icon-container name="#icon-zhuashou" />
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="框选节点" placement="top">
        <div
          class="object-graph-shortcut-key"
          :class="{ activated: current == 'select' }"
          @click="iconClick('select')"
        >
          <icon-container name="#icon-kuangxuan" />
        </div>
      </el-tooltip>
      <div><el-divider direction="vertical" /></div>
      <template v-if="action == '0'">
        <el-tooltip effect="dark" content="删除" placement="top">
          <div
            class="object-graph-shortcut-key"
            :class="{ disabled: disabled.includes('delete') }"
            @click="iconClick('delete')"
          >
            <icon-container name="#icon-delete" />
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改颜色" placement="top">
          <el-popover placement="bottom" trigger="click" v-model="colorVisible">
            <p style="display: flex; align-items: center">
              <span>背景颜色：</span>
              <el-color-picker
                :predefine="predefineColors"
                v-model="color"
                :disabled="disabled.includes('color')"
                size="mini"
              ></el-color-picker>
            </p>
            <p style="display: flex; align-items: center">
              <span>字体颜色：</span>
              <el-color-picker
                :predefine="predefineFontColors"
                v-model="fontColor"
                :disabled="disabled.includes('color')"
                size="mini"
              ></el-color-picker>
            </p>
            <p style="margin-top: 20px">
              <el-button size="mini" @click="colorVisible = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="submitColor"
                >确定</el-button
              >
            </p>
            <div
              class="object-graph-shortcut-key"
              :class="{ disabled: disabled.includes('color') }"
              slot="reference"
            >
              <icon-container name="#icon-color" />
            </div>
          </el-popover>
        </el-tooltip>

        <div><el-divider direction="vertical" /></div>

        <el-tooltip effect="dark" content="水平对齐" placement="top">
          <div
            class="object-graph-shortcut-key"
            :class="{ disabled: disabled.includes('hline') }"
            @click="iconClick('hline')"
          >
            <icon-container name="#icon-hline" />
          </div>
        </el-tooltip>

        <el-tooltip effect="dark" content="垂直对齐" placement="top">
          <div
            class="object-graph-shortcut-key"
            :class="{ disabled: disabled.includes('vline') }"
            @click="iconClick('vline')"
          >
            <icon-container name="#icon-vline" />
          </div>
        </el-tooltip>

        <el-tooltip effect="dark" content="水平居中" placement="top">
          <div
            class="object-graph-shortcut-key"
            :class="{ disabled: disabled.includes('hcenter') }"
            @click="iconClick('hcenter')"
          >
            <icon-container name="#icon-hcenter" />
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="垂直居中" placement="top">
          <div
            class="object-graph-shortcut-key"
            :class="{ disabled: disabled.includes('vcenter') }"
            @click="iconClick('vcenter')"
          >
            <icon-container name="#icon-vcenter" />
          </div>
        </el-tooltip>
      </template>
    </div>

    <div class="right">
      <el-button size="mini" type="primary" plain @click="viewFn"
        >功能列表</el-button
      >
      <el-button size="mini" type="primary" plain @click="importObj"
        >引用对象</el-button
      >
    </div>
  </div>
</template>

<script>
import iconContainer from "../iconContainer";
export default {
  components: {
    iconContainer,
  },
  props: {
    action: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      current: "click",
      disabled: [
        "undo",
        "redo",
        "delete",
        "color",
        "hline",
        "vline",
        "hcenter",
        "vcenter",
      ],
      color: "#ff0000",
      fontColor: "#1b1d1d",
      colorVisible: false,
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      predefineFontColors: ["#f8f8f8", "#1b1d1d"],
    };
  },
  methods: {
    iconClick(key) {
      if (!this.disabled.includes(key)) {
        if (["click", "select", "move"].includes(key)) {
          this.current = key;
        }
        this.$emit("shortcutSelect", key);
      }
    },
    formatIcons(icons) {
      return Array.isArray(icons) ? icons : icons ? [icons] : [];
    },

    setDisabledIcon(icons) {
      let _icons = this.formatIcons(icons);
      _icons.forEach((icon) => {
        if (this.disabled.indexOf(icon) == "-1") {
          this.disabled.push(icon);
        }
      });
    },

    cleanDisabledIcon(icons) {
      let _icons = this.formatIcons(icons);
      this.disabled = this.disabled.filter((key) => !_icons.includes(key));
    },

    submitColor() {
      this.$emit("changeColor", {
        color: this.color,
        fontColor: this.fontColor,
      });
      this.colorVisible = false;
    },

    updateBgColor(color) {
      this.color = color;
      this.predefineColors.push(color);
    },
    updateFontColor(fontColor) {
      this.fontColor = fontColor;
      this.predefineFontColors.push(fontColor);
    },
    cleanColors() {
      this.color = "#ff0000";
      this.fontColor = "#1b1d1d";
      (this.predefineColors = [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ]),
        (this.predefineFontColors = ["#f8f8f8", "#1b1d1d"]);
    },
    importObj() {
      this.$emit("importObj");
    },
    viewFn() {
      this.$emit("viewFn");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
.object-graph-shortcut {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #bbbdbf;
  @include flex(row, space-between, center);
  .left {
    @include flex(row, flex-start, center);

    .object-graph-shortcut-key {
      cursor: pointer;
      @include flex(row, center, center);
      height: 22px;
      margin-right: 2px;
      flex-shrink: 0;
      overflow: hidden;
      padding: 4px;

      &:hover {
        background-color: #dfe0e1;
      }
      &.disabled {
        opacity: 0.3;
        cursor: not-allowed !important;
      }
      &.activated {
        background-color: #dfe0e1;
      }

      .x6-graph-custom-works-next-icon {
        width: 14px;
        height: 14px;
        line-height: 14px;
      }
    }
  }
  .right {
    @include flex(row, flex-end, center);
  }
}
</style>

