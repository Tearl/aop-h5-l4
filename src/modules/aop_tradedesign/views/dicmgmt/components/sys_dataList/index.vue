<template>
  <div class="aop_tradedesign_comps_dicmgmt_data_list_mgmt">
    <List
      v-if="flag === '0'"
      :arsId="arsId"
      @addDataList="addDataList"
      @moddDataList="moddDataList"
      @toDetail="toDetail"
    ></List>

    <Mod
      v-if="flag === '1'"
      :sysId="arsId"
      :type="type"
      :dataColletId="dataColletId"
      @toList="toList"
    ></Mod>

    <Detail
      v-if="flag === '2'"
      :dataColletId="dataColletId"
      @toList="toList"
    ></Detail>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import List from "./components/list";
import Mod from "./components/mod";
import Detail from "./components/detail";

export default {
  mixins: [mixin],
  components: {
    List,
    Mod,
    Detail
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      flag: "0",
      type: "add",
      dataColletId: ""
    };
  },
  methods: {
    addDataList() {
      this.type = "add"
      this.flag = "1"
    },
    moddDataList(e) {
      console.log("moddDataList", e);
      this.dataColletId = e.dataColletId
      this.type = "mod"
      this.flag = "1"
    },
    toDetail(e) {
      this.dataColletId = e.dataColletId
      this.flag = "2"
    },
    toList() {
      this.flag = "0"
    }
  },
  created() {},
  watch: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_data_list_mgmt {
}
</style>

