<template>
  <div class="aop_tradecode_comps_design_comps_attr_list">
    <el-radio-group v-model="defaultActive" size="small">
      <el-radio-button label="used">已用组件</el-radio-button>
      <el-radio-button label="assigned">已赋值组件</el-radio-button>
    </el-radio-group>
    <div v-if="defaultActive == 'used'" class="list_box">
      <ul class="service_menu_list">
        <li
          class="list_item"
          :class="{ active: currentObj.actionId == item.actionId }"
          v-for="item in beUseActionList"
          :key="item.actionId"
          @click="handleClick(item)"
        >
          <div class="text_area">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.actionName+'-'+item.actionId"
              placement="top"
            >
              <span class="list_item_title"
                >{{ item.actionName }}-{{ item.actionId }}</span
              >
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="defaultActive == 'assigned'" class="list_box">
      <ul class="service_menu_list">
        <li
          class="list_item"
          :class="{ active: currentObj.actionId == item.actionId }"
          v-for="item in setValActionList"
          :key="item.actionId"
          @click="handleClick(item)"
        >
          <div class="text_area">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.actionName+'-'+item.actionId"
              placement="top"
            >
              <span class="list_item_title"
                >{{ item.actionName }}-{{ item.actionId }}</span
              >
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    Table,
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      defaultActive: "used",
      usedList: [
        {
          actionName: "测试服务080902",
          actionId: "D5SelfAction9",
        },
        {
          actionName: "测试服务003",
          actionId: "D5SelfAction8",
        },
        {
          actionName: "测试服务004",
          actionId: "D5SelfAction5",
        },
      ],
      currentObj: {},
      dataList: [],
      beUseActionList: [],
      setValActionList: [],
    };
  },
  inject: ["getDataList"],
  computed: {},
  methods: {
    init() {},
    getDataLists() {
      this.dataList = this.getDataList();
      this.getList()
    },
    getList() {
      this.beUseActionList = JSON.parse(getSessionStorage("beUseActionList"));
      this.setValActionList = JSON.parse(getSessionStorage("setValActionList"));
      console.log("列表", this.beUseActionList, this.setValActionList);
    },
    handleClick(e) {
      this.currentObj = e;
      let data = this.dataList.find((item) => {
        return item.actionId == e.actionId;
      });
      console.log("数据", data);
      let s = document.querySelector(".process_middle");
      console.log(s.offsetWidth, s.offsetHeight);
      s.scrollTo({
        top: data.actionY - s.offsetHeight / 2 + 40 + 50,
        left: data.actionX - s.offsetWidth / 2 + 50,
        behavior: "smooth",
      });
      this.$emit("handleListClick", data);
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_design_comps_attr_list {
  // width: 100%;
  background: #fff;
  box-shadow: #e7e7e7 0 0 10px;
  /deep/ .el-radio-button__inner {
    padding: 0px 8px;
    height: 28px;
    line-height: 28px;
    border-radius: 0px;
    font-size: 12px;
  }

  .list_box {
    height: 86px;
    overflow-y: scroll;
    border: 1px solid #e7e7e7;
    border-top: none;
  }
  .service_menu_list {
    // margin-top: 8px;
    // height: 100%;
    .list_item {
      font-size: 12px;
      // margin-bottom: 6px;
      // white-space: nowrap;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      cursor: pointer;
      padding: 4px 6px;
      &:hover,
      &.active {
        background: #eaf1ff;
        .text_area .list_item_title {
          color: $theme_color;
          font-weight: 600;
        }
      }
      .text_area {
        display: flex;
        .icon {
          margin-right: 4px;
        }
        .list_item_title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 120px;
          height: 20px;
          // padding: 0 10px;
          line-height: 20px;
          color: #000;
          cursor: pointer;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
