<template>
  <div class="aop_tradedesign_comps_page_card_data_set">
    <div class="card"  v-for="(item,index) in dataList" :key="index">

    
    <div class="list">
      <div class="item">
        <div class="service_list">
          <div class="title">
            L5列表({{ serviceCount }})
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              class="add_btn"
              @click="addServ"
              >定义新服务</el-button
            >
          </div>
          <el-divider></el-divider>
          <div class="content_list">
            <div class="table" v-if="serviceList.length > 0">
              <ul>
                <li
                  @click.stop="clickChange(item, index, 1)"
                  v-for="(item, index) in serviceList"
                  :key="index"
                  :class="serviceCurrent == index ? 'item_active' : ''"
                >
                  {{ item.svcNm }}
                  <!-- <i class="el-icon-arrow-right"> </i>
                  -->
                  <el-checkbox v-model="item.checked"></el-checkbox>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      serviceList: [
        { id: "1", svcNm: "服务1" },
        { id: "2", svcNm: "服务2" },
      ],
      fieldCount: 0,
      serviceCount: 0,
      //当前选中
      functionCurrent: "0",
      serviceCurrent: "0",
      dataList: [
        {
          
        },
        
      ]
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_card_data_set {
  .list {
    display: flex;
    justify-content: flex-start;
    // justify-content: space-around;
    .item {
      border: 1px solid #dcdfe6;
      width: 300px;
      height: 450px;
      // overflow: auto;
      margin-right: 10px;
      border-radius: 5px;
      // height: 100%;
      .title {
        display: flex;
        justify-content: space-between;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        padding: 10px;
        .add_btn {
          border-radius: 2px;
        }
      }
      /deep/ .el-divider--horizontal {
        margin: 7px 0;
      }
    }
  }

  .item_active {
    background: #f0f5ff;
    color: #358aff;
    border: 1px solid #358aff;
  }
  ul li {
    margin: 10px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>