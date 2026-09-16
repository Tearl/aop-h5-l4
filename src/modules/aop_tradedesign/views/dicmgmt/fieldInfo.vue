<template>
  <div class="container">
    <!-- <common-header :label="` ${name} /  数据集详情 / 字段详情`"> -->
    <common-header label="数据集详情 / 字段详情"> </common-header>
    <div class="body">
      <div class="titles">
        <div class="name">基本信息</div>
        <div class="message">
          <div class="datasetname">
            <span>参数名称：</span>
            <p>{{ formData.dictryNo || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>参数中文名称：</span>
            <p>{{ formData.dictryNm || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>关键字：</span>
            <p>{{ formData.dictryKeyWord || "/" }}</p>
          </div>
        </div>
        <div class="message">
          <div class="datasetname">
            <span>英文名字全称：</span>
            <p>{{ formData.dictryEnglishFullName || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>所属域：</span>
            <p>{{ $route.query.bizDomainName || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>参数类型：</span>
            <p>{{ formData.dictryTyp || "/" }}</p>
          </div>
        </div>

        <div class="message">
          <div class="datasetname">
            <span>最大长度：</span>
            <p>{{ formData.dictryLength || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>所属数据集：</span>
            <p>{{ $route.query.objName || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>所属分段：</span>
            <p>{{ formData.xx || "/" }}</p>
          </div>
        </div>

        <div class="message" style="margin-bottom: 0">
          <div class="datasetname">
            <span>创建人：</span>
            <p>{{ formData.creatrNm || "/" }}</p>
          </div>
          <div class="datasetname">
            <span>创建时间：</span>
            <p v-if="formData.crtTm > 0">
              {{ formData.crtTm | crtTm_yyyyMMddhhmmss }}
            </p>
            <p v-if="!formData.crtTm">
              {{ "/" }}
            </p>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="message">
          <div class="datasetnames">
            <span>参数描述：</span>
            <div>{{ formData.dictryDescr || "/" }}</div>
          </div>
        </div>
      </div>
      <div class="titles">
        <div class="name">枚举值</div>
        <div>
          <el-table :data="tableData" class="D2_workspace_common_table">
            <el-table-column label="枚举值" prop="key">
              <template slot-scope="scope">
                <span>{{ scope.row.key || "/" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="内容" prop="value">
              <template slot-scope="scope">
                <span>{{ scope.row.value || "/" }}</span>
              </template></el-table-column
            >
          </el-table>
        </div>
      </div>
      <div class="titles">
        <div class="name">验证规则</div>
        <div>
          <el-table :data="testTableData" class="D2_workspace_common_table">
            <el-table-column label="规则名称" prop="ruleNo">
              <template slot-scope="scope">
                <span>{{ scope.row.ruleNo || "/" }}</span>
              </template></el-table-column
            >
            <el-table-column label="规则中文名称" prop="ruleNm">
              <template slot-scope="scope">
                <span>{{ scope.row.ruleNm || "/" }}</span>
              </template></el-table-column
            >
            <el-table-column label="规则描述" prop="ruleDescr">
              <template slot-scope="scope">
                <span>{{ scope.row.ruleDescr || "/" }}</span>
              </template></el-table-column
            >
            <el-table-column label="所属分类" prop="clsfCnNm">
              <template slot-scope="scope">
                <span>{{ scope.row.clsfCnNm || "/" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="正则表达式" prop="ruleExps">
              <template slot-scope="scope">
                <span>{{ scope.row.ruleExps || "/" }}</span>
              </template></el-table-column
            >
            <el-table-column label="提示信息" prop="ruleTip">
              <template slot-scope="scope">
                <span>{{ scope.row.ruleTip || "/" }}</span>
              </template></el-table-column
            >
          </el-table>
        </div>
      </div>
      <div class="titles">
        <div class="name">示例列表</div>
        <div>
          <el-table :data="tableDatashow" class="D2_workspace_common_table">
            <el-table-column label="排序" prop="exampleOrder"></el-table-column>
            <el-table-column
              label="示例值"
              prop="exampleValue"
            ></el-table-column>
            <el-table-column label="创建人" prop="creatrNm"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.crtTm | crtTm }}
                </div>
              </template></el-table-column
            >
          </el-table>
        </div>
      </div>
    </div>
    <!-- <div class="btn">
            <el-button
                @click="$router.go(-1)"
                style="height: 40px; width: 112px"
                >返 回</el-button
            >
        </div> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import commonHeader from "@m/core/components/ApplicationHeader/index";
export default {
  mixins: [mixin],
  components: {
    commonHeader,
  },
  data() {
    return {
      ObjName: "数据集规范 / " + name + " / 字段详情",
      name: "",
      formData: [
        {
          dictryNo: "",
          dictryNm: "",
          dictryKeyWord: "",
          dictryEnglishFullName: "",
          dictryDescr: "",
          attributeTypNm: "",
          dictryTyp: "",
          dictryLength: "",
          creatrNm: "",
          crtTm: "",
        },
      ],
      activeName: "first",
      active: "",
      tableDatashow: [],
      testTableData: [],
      tableData: [],
    };
  },
  filters: {
    // 创建时间 格式:yyyy-MM-dd hh:mm:ss
    crtTm_yyyyMMddhhmmss(value) {
      if (!!value) {
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        const hour = value.slice(8, 10);
        const minute = value.slice(10, 12);
        const second = value.slice(12, 14);
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
      return "";
    },
    // 创建时间 格式:yyyy-MM-dd
    crtTm(value) {
      if (!!value) {
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        return `${year}-${month}-${day}`;
      }
      return "";
    },
  },
  methods: {
    tabClick() {
      console.log(this.activeName);
    },

    //获取列表数据字典
    async getEleOlist() {
      const params = {
        dictryId: this.$route.query.dictryId,
      };
      const res = await this.rpc.dicmgmt.editList(params);
      this.formData = res;
      this.testTableData = res.ruleList;

      this.tableData =
        res.dictryEnum.length > 0
          ? res.dictryEnum.split(";").map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            })
          : "";
    },
    // 获取列表数据字典示例
    async getDictExampleList() {
      const data = {
        dictryId: this.$route.query.dictryId,
      };
      const res = await this.rpc.dictionary.getDictExampleList(data);
      this.tableDatashow = res.dictExampleList;
    },
    getTableName() {
      this.name = window.sessionStorage.getItem("nameTab");
    },
  },
  created() {
    console.log("Created")
    this.getEleOlist();
    this.getTableName();
    this.getDictExampleList();
  },
};
</script>

// <style lang="scss">
// @import "@m/assets/css/public.scss";
// </style>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .body {
    padding: 16px;
    // height: 90%;
    width: 100%;
    .titles {
      width: 100%;
      min-height: 192px;
      padding: 20px 24px;
      background-color: #fff;
      margin-bottom: 12px;
      border-radius: 4px;
      position: relative;
      .el-divider {
        background-color: rgba(238, 240, 245, 1);
      }
      .name {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .des {
        display: flex;
        align-items: center;
        span {
          display: flex;
          align-items: center;
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
      .message {
        display: flex;
        // justify-content: space-between;
        margin-bottom: 16px;
        .datasetname {
          width: 33%;
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
        .datasetnames {
          display: flex;
          // align-items: center;
          overflow: hidden;
          span {
            min-width: 70px;
            // display: flex;
            // align-items: center;
            // width: 42px;
            // min-height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            letter-spacing: 0;
            // line-height: 20px;
            font-weight: 400;
          }
          div {
            display: flex;
            // align-items: center;
            min-height: 20px;
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
    .tabs {
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
          // .items {
          //     height: 40px;
          //     background: #f5f9ff;
          //     border: 0.5px solid rgba(53, 138, 255, 1);
          //     border-radius: 2px;
          // }
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
.btn {
  display: flex;
  justify-content: center;
}
</style>
