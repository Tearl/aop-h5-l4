<template>
  <el-drawer
    title="查看词根"
    :visible.sync="drawerVisible"
    size="800px"
    class="drawer_common_wrap"
  >
    <div class="sort_detail_drawer">
      <div class="detail_item">
        <span class="detail_label">词根名称：</span>
        <span>{{ detailInfo.rootName || "/" }}</span>
      </div>
      <div class="detail_item">
        <span class="detail_label">词根类别：</span>
        <span>{{ rootTypeMaps[detailInfo.rootType] }}</span>
      </div>
      <div class="detail_item">
        <span class="detail_label">词根全称：</span>
        <span>{{ detailInfo.rootFullName || "/" }}</span>
      </div>
      <div class="detail_item">
        <span class="detail_label">词根简称：</span>
        <span>{{ detailInfo.rootShortName || "/" }}</span>
      </div>
      <div class="detail_item">
        <span class="detail_label">词根来源：</span>
        <span>{{ detailInfo.rootSource || "/" }}</span>
      </div>
    </div>
    <div class="detail_desc">
      <span class="detail_label">备注：</span>
      <span
        v-if="detailInfo.rootRemarks"
        v-html="detailInfo.rootRemarks"
      ></span>
      <span v-else>/</span>
    </div>
  </el-drawer>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      detailInfo: {},
      rootTypeMaps: {
        "01": "基本词",
        "02": "类词",
      },
      rootTypeThresholdMaps: {
        "01": "编码类",
        "02": "数值类",
        "03": "文本类",
        "04": "比例类",
        "05": "代码类",
        "06": "金额类",
        "07": "日期类",
        "08": "标志类",
      },
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    rootId: {
      type: String,
      default: "",
    },
  },
  computed: {
    drawerVisible: {
      get() {
        return this.value;
      },

      set(val) {
        this.$emit("input", val);
      },
    },
  },
  mounted() {
    this.queryrootDetail();
  },
  methods: {
    async queryrootDetail() {
      const {
        rootName,
        rootType,
        rootTypeThreshold,
        rootFullName,
        rootShortName,
        rootSource,
        rootRemarks,
        rootId,
      } = await this.rpc.datadict.qryDataDictionaryRootDetail({
        rootId: this.rootId,
      });
      this.detailInfo = {
        rootName,
        rootType,
        rootTypeThreshold,
        rootFullName,
        rootShortName,
        rootSource,
        rootRemarks,
        rootId,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
<style lang="scss" scoped>
.drawer_common_wrap {
  /deep/.el-drawer__body {
    padding: 24px;
    // padding-bottom: 90px;
  }
  /deep/.el-drawer__header {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    margin: 0;
    padding: 16px 24px;
    box-shadow: inset 0px -0.5px 0px 0px rgba(220, 224, 228, 1);
  }
  .sort_detail_drawer {
    border-bottom: 1px solid rgba(238, 240, 245, 1);
  }
  .detail_item,
  .detail_desc {
    margin-bottom: 24px;

    span {
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 20px;
      font-weight: 400;
    }

    .detail_label {
      color: #999999;
    }
  }
  .detail_desc {
    margin-top: 24px;
  }
}
</style>