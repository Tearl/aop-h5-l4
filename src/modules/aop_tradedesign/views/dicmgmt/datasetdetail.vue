<template>
  <div class="container">
    <common-header :label="objName"> </common-header>
    <div class="body">
      <div class="titles">
        <div class="names">基本信息</div>
        <div class="messages">
          <div class="datasetnames">
            <span>名称：</span>
            <p>{{ $route.query.objName || "/" }}</p>
          </div>
          <div class="datasetnames">
            <span>所属域：</span>
            <p>{{ $route.query.bizDomainName || "/" }}</p>
          </div>
          <div class="datasetnames">
            <span>分类：</span>
            <p>{{ $route.query.objClassName || "/" }}</p>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="descrip">
          <span class="leftName">描述：</span>
          <div>
            {{ $route.query.objDesc || "/" }}
          </div>
        </div>
      </div>
      <div class="tabss">
        <!-- <div class="left">
          <div class="paragraph">
            分段<span>({{ leftList.length }})</span>
          </div>
          <div class="detail">
            <div class="search">
              <img
                src="../../../../assets/assets/icon_搜索栏_搜索_d@2x.png"
                alt=""
              />

              <el-input
                placeholder="请输入关键字搜索"
                v-model="leftInput"
                @input="leftFilterDivs()"
              >
              </el-input>
            </div>
            <div
              class="items"
              v-for="item in leftList"
              :key="item.value"
              @click="activeShow(item.value)"
              :class="{ item_active: dataStyle === item.value }"
            >
              <div class="add">
                <div class="addleft">新增</div>
                <div class="addleft register" v-if="active == '4'">登记</div>
                <div class="addright">{{ item.value }}</div>
              </div>
              <div class="add">
                <div class="iconleft">
                  <img
                    :src="dataStyle === item.value ? seletImg : initImg"
                    alt=""
                  />
                </div>

                <div class="iconright">
                  <img
                    :src="dataStyle === item.value ? seletImgNext : initImgNext"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div class="left leftMargin">
          <div class="paragraph">
            字段<span>({{ objectInfoData.length }})</span>
          </div>
          <div class="detail">
            <div class="search">
              <img src="@m/assets/images/common_search.png" alt="" />

              <el-input
                placeholder="请输入关键字搜索"
                v-model="input4"
                @input="filterDivs()"
              >
              </el-input>
            </div>
            <div v-if="leftList.value == '默认分段'">
              <div
                class="items"
                v-for="(item, index) in objectInfoData"
                :key="index"
                @click="lookField(item)"
                :class="{
                  item_active: index == 0,
                }"
              >
                <div class="add">
                  <!-- <div class="addleft">新增11</div> -->
                  <div class="addleft register" v-if="active == '4'">登记</div>
                  <div class="addright">
                    {{ item.dictryName || "" }}
                  </div>
                </div>
                <div class="add">
                  <div class="iconleft">
                    <img :src="index == 0 ? seletImg : initImg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import commonHeader from "@m/core/components/ApplicationHeader/index";
import initImg from "@m/assets/images/icon_look.png";
import seletImg from "@m/assets/images/icon_look_h.png";
import initImgNext from "@m/assets/images/icon_next.png";
import seletImgNext from "@m/assets/images/icon_next_blue.png";
export default {
  mixins: [mixin],
  components: {
    commonHeader,
  },
  data() {
    return {
      leftInput: "", //请输入查询左边
      input4: "", //请输入查询右边
      dataStyle: "默认分段", //高亮
      rightdataStyle: "0",
      // initImgNext: require("@m/assets/assets/下页.png"), //初始的灰色 下页 图片地址
      initImg, //初始的灰色 查看 图片地址
      initImgNext, //初始的灰色 下页 图片地址
      seletImg, //选中时蓝色 查看 图片地址
      seletImgNext, //选中时蓝色 下页 地址
      leftList: [
        {
          value: "默认分段",
        },
      ],
      activeName: "first",
      active: "",
      objName: this.$route.query.objName + "/ 业务对象详情",
      objectInfoData: [],
    };
  },
  methods: {
    initData() {
      this.dataStyle = this.leftList[0].value;
      this.leftList.value = this.leftList[0].value;
    },
    lookField(item) {
      window.sessionStorage.setItem("nameTab", this.$route.query.objName);
      console.log(555555, this.$route.query.bizDomainName);
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/fieldInfo",
        query: {
          objName: this.$route.query.objName,
          dictryId: item.dictryId,
          bizDomainName: this.$route.query.bizDomainName,
        },
      });
    },
    async qryBizObjectInfo() {
      let res = await this.rpc.dicmgmt.qryBizObjectInfo({
        objId: this.$route.query.objId,
      });
      this.objectInfoData = res.attributeInfos;
      console.log(res, "resobjName***", this.$route.query.objId);
    },
    activeShow(info) {
      this.dataStyle = info; //全局的等于选中每一项的item的属性值的值
      this.leftList.value = info;
    },
    getleftList() {
      this.leftList = [
        {
          value: "默认分段",
        },
      ];
    },
    filterDivs() {
      // 过滤数组并更新显示状态
      if (this.input4) {
        this.objectInfoData = this.objectInfoData.filter((divItem) =>
          divItem.dictryName.includes(this.input4)
        );
      } else {
        this.qryBizObjectInfo();
      }
    },
    leftFilterDivs() {
      // 过滤数组并更新显示状态
      if (this.leftInput) {
        this.leftList = this.leftList.filter((divItem) =>
          divItem.value.includes(this.leftInput)
        );
      } else {
        // this.qryBizObjectInfo();
        this.getleftList();
        this.initData();
      }
    },
  },

  created() {
    this.qryBizObjectInfo();
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .body {
    padding: 12px 16px;
    min-height: calc(100%-48px);
    height: 80%;
    width: 100%;
    .titles {
      width: 100%;
      // min-height: 192px;
      padding: 20px 24px 40px 24px;
      background-color: #fff;
      margin-bottom: 12px;
      border-radius: 4px;
      position: relative;
      .el-divider {
        background-color: rgba(238, 240, 245, 1);
      }
      .names {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .descrip {
        width: calc(100%-48px);
        display: flex;
        overflow: hidden;
        // align-items: center;
        // justify-content: flex-start;
        .leftName {
          // display: flex;
          // align-items: center;
          min-width: 42px;
          // min-height: 20px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          letter-spacing: 0;
          // line-height: 20px;
          font-weight: 400;
        }
        div {
          // display: flex;
          // align-items: center;
          // width: calc(100%-50px);
          // max-width: 300px;
          min-height: 20px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          // line-height: 20px;
          font-weight: 400;
          white-space: normal;
          // flex: 1;
        }
      }
      .messages {
        display: flex;
        // justify-content: space-between;
        .datasetnames {
          width: 34%;
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            // width: 42px;
            height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 400;
          }
          p {
            display: flex;
            align-items: center;
            height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 400;
          }
        }
      }
    }
    .tabss {
      height: 100%;
      display: flex;
      .left {
        width: 50%;
        margin-right: 12px;
        background-color: #fff;
        .paragraph {
          width: 100%;
          height: 48px;
          padding: 14px 24px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #010101;
          letter-spacing: 0;
          font-weight: 600;
          box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
        }
        .detail {
          width: 100%;
          padding: 16px 24px;
          .search {
            display: flex;
            background: #f7f7f9;
            height: 32px;
            align-items: center;
            padding: 0 12px;

            img {
              width: 16px;
              height: 16px;
            }

            ::v-deep.el-input {
              .el-input__inner {
                height: 32px;
                border: none;
                background: #f7f7f9;
                padding-left: 8px;
              }
            }
          }

          .items {
            cursor: pointer;
            width: 100%;
            margin-top: 12px;
            height: 40px;
            background: #ffffff;
            border: 0.5px solid rgba(219, 219, 219, 1);
            border-radius: 2px;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.item_active {
              background: #f0f5ff;
              color: #358aff !important;
              div {
                color: #358aff !important;
              }
            }
            .add {
              display: flex;
              align-items: center;
              .addleft {
                box-sizing: border-box;
                display: flex;
                // height: 16px;
                align-items: center;
                justify-content: center;
                width: 28px;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #fe4758;
                letter-spacing: 0;
                line-height: 16px;
                font-weight: 400;
                border: 0.5px solid rgba(254, 71, 88, 1);
                border-radius: 2px;
                margin-right: 8px;
              }
              .register {
                border: 0.5px solid rgba(54, 213, 66, 1);
                color: #36d542;
              }
              .addright {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                line-height: 20px;
                font-weight: 400;
              }
              .iconleft {
                height: 16px;
                margin-right: 9px;
                img {
                  width: 16px;
                  height: 16px;
                }
              }
              .iconright {
                height: 16px;
                img {
                  width: 16px;
                  height: 16px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.leftMargin {
  margin-right: 0px !important;
}
</style>
