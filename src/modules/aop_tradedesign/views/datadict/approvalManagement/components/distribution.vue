<template>
  <div class="grid-card dashboard">
    <card-header
      title="引用不规范数据分布"
      type="chart"
      @change="changEchart"
    />
    <div class="canvas" ref="canvas"></div>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import cardHeader from "./cardHeader";
import * as echarts from "echarts";

export default {
  data() {
    let productList = [
      "业务流程",
      "资产数量",
      "功能数量",
      "页面数量",
      "4B交易",
      "L5服务",
      "UI设计",
      "数据集",
      "元数据",
      "数据属性",
    ];
    return {
      myChart: null,
      xAxisData: [...productList],
      seriesData: [3, 6, 12, 4, 10, 21, 12, 7, 15, 18],
    };
  },

  props: {
    nonStandardReport: {
      type: Object,
      default: () => {},
    },
  },

  computed: {},

  mixins: [mixin],

  components: {
    cardHeader,
  },

  mounted() {
    if (
      this.nonStandardReport?.distributionList &&
      this.nonStandardReport.distributionList.length
    ) {
      let tempDataList = [];
      let tempNumList = [];
      this.nonStandardReport?.distributionList.forEach((item) => {
        tempDataList.push(item.dataName);
        tempNumList.push(item.dataCount);
      });
      this.xAxisData = tempDataList;
      this.seriesData = tempNumList;
    }
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.canvas, null, {
        width: 1200,
        height: 300,
      });
      this.setOption(this.xAxisData, this.seriesData, "bar");
    });
  },

  methods: {
    setOption(xAxisData, seriesData, currentType) {
      this.myChart.setOption(
        (option = {
          series: [
            {
              data: seriesData,
              type: currentType,
              itemStyle: {
                borderRadius: [5, 5, 0, 0],
                color: "#358AFF",
              },
              barWidth: "30%",
            },
          ],
          xAxis: {
            type: "category",
            data: xAxisData,
            axisTick: {
              show: false,
            },
          },
          tooltip: {
            show: true,
            padding: 0,
            borderWidth: 0,
            formatter: function (params, b, c) {
              return `
                <div style="
                  font-size: 14px;
                  color: #358AFF;
                  letter-spacing: 0;
                  text-align: center;
                  font-weight: 700;
                  padding:5px 19px;"
                  >${params.value}<div style="font-size: 10px;
                  color: #A0AEC0;font-weight: 400;">数据数量<div>
                </div>
              `;
            },
          },
          yAxis: {
            type: "value",
          },
          grid: {
            left: "5%",
            top: 15,
            bottom: 50,
            right: "2%",
          },
        })
      );
    },
    changEchart(val = "") {
      if (val == "柱状图") {
        this.setOption(this.xAxisData, this.seriesData, "bar");
      } else if (val == "折线图") {
        this.setOption(this.xAxisData, this.seriesData, "line");
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.dashboard {
  padding: 16px 24px;

  .list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    .item {
      height: 104px;
      background-color: rgba(#ff9600, 0.06);
      border-radius: 4px;
      flex: 1;
      min-width: 180px;
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      align-items: center;
      cursor: pointer;

      h1 {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
        &.iso {
          color: rgb(103, 194, 58);
        }
      }

      .count {
        font-size: 36px;
        font-weight: 600;
        color: #333;
        line-height: 1;
      }

      .icon {
        width: 36px;
        height: 36px;
        background: url("~@m/assets/images/todo.svg") no-repeat;
        background-size: 100% auto;
      }

      &.finish {
        background-color: rgba(#53c41a, 0.06);

        .icon {
          background-image: url("~@m/assets/images/done.svg");
        }
      }

      &.submit {
        background-color: rgba(#8f66ff, 0.06);

        .icon {
          background-image: url("~@m/assets/images/upload.svg");
        }
      }

      &.receive {
        background-color: #f1f6fd;

        .icon {
          background-image: url("~@m/assets/images/receive.svg");
        }
      }
    }
  }
}
</style>
  