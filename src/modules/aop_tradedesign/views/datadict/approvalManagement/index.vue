<template>
  <div class="datadict_thememanage">
    <Dashboard :standardReport="standardReport" />
    <notStandardized :nonStandardReport="nonStandardReport" />
    <distribution :nonStandardReport="nonStandardReport" />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import distribution from "./components/distribution";
import Dashboard from "./components/Dashboard";
import notStandardized from "./components/notStandardized";
export default {
  mixins: [mixin],
  components: {
    Dashboard,
    notStandardized,
    distribution,
  },
  data() {
    return {
      standardReport: {},
      nonStandardReport: {},
    };
  },
  created() {
    this.dataDictionaryReport();
  },

  methods: {
    async dataDictionaryReport() {
      const { standardReport, nonStandardReport } =
        await this.rpc.datadict.dataDictionaryReport();
      this.standardReport = standardReport || {};
      this.nonStandardReport = nonStandardReport || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.datadict_thememanage {
  padding: 12px 6px;
}
.add_operate {
  background: #ffffff;
  padding: 14px 24px;
  margin: 0 6px;
}
.card_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
}
.card_box_item {
  width: 295px;
  height: 182px;
  margin: 6px;
  background: #ffffff;
  border: 1px solid rgba(232, 232, 232, 1);
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
}
.card_box_item_content {
  padding: 18px;
  height: 134px;

  .title {
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 500;
    margin-bottom: 2px;
  }
  .theme_id {
    display: block;
    font-size: 12px;
    color: #cccccc;
    text-align: left;
    line-height: 20px;
    font-weight: 400;
    margin-bottom: 14px;
  }
  .theme_desc {
    font-size: 12px;
    color: #999999;
    text-align: justify;
    line-height: 20px;
    font-weight: 400;
    margin-bottom: 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.card_box_item_operate {
  display: flex;
  height: 48px;
  background: #f7f9fa;
  box-shadow: inset 0px 1px 0px 0px rgba(232, 232, 232, 1);
  border-radius: 0px 0px 4px 4px;

  .operate_item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 50%;
    position: relative;

    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    span {
      font-size: 14px;
      color: #358aff;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
    }
    .del {
      color: #fe4758;
    }

    &:first-child::after {
      content: "|";
      position: absolute;
      color: #e8e8e8;
      left: 100%;
      top: 25%;
    }
  }
}
.empty_block {
  text-align: center;
  margin-top: 88px;
  img {
    width: 200px;
  }
  span {
    display: block;
    color: #999999;
  }
}
</style>