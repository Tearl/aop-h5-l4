<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <div class="content">
      <div class="search" v-if="showsearch">
        <div class="aop-public-search" :class="customClassName">
          <div class="body">
            <div class="main">
              <el-form :model="form" inline height="32">
                <el-form-item
                  label="关键字："
                  prop="keyInput"
                  label-width="68px"
                >
                  <el-input
                    v-model="form.keyInput"
                    placeholder="请输入"
                    class="el-inputs"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item
                  label="分类："
                  prop="objClass"
                  label-width="68px"
                >
                  <el-select v-model="form.objClass" @change="objcla">
                    <el-option
                      v-for="(option, index) in options2"
                      :key="index"
                      :label="option.label"
                      :value="option.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
            </div>
            <div class="btns" style="height: 32px">
              <el-button
                type="primary"
                size="small"
                @click="search"
                style="height: 32px; width: 64px"
                >查询</el-button
              >
              <el-button size="small" plain @click="reset">重置</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="datasetList">
        <div class="head-left">
          <slot name="left">
            <span class="title">业务对象列表</span>
            <div class="tabs_area">
              <div
                class="tab_item"
                :class="{ active: form.objClass == item.code }"
                v-for="item in objectClassCountList"
                :key="item"
                @click="tabItemClick(item)"
              >
                {{ `${item.name}${item.num}` }}
              </div>
            </div>
          </slot>
        </div>
        <div class="head-right">
          <div class="logo">
            <img
              :src="require('@m/assets/images/common_search.png')"
              alt="Image 1"
              @click="searchGroup"
            />
          </div>
          <div class="logo">
            <img
              :src="require('@m/assets/images/icon_图表.png')"
              alt="Image 1"
              @click="listShowClose"
            />
          </div>
          <div class="logo">
            <img
              :src="require('@m/assets/images/common_list.png')"
              alt="Image 1"
              @click="stripe"
            />
          </div>
          <div class="logo" v-popover:popover>
            <img
              :src="require('@m/assets/images/common_operate.png')"
              alt="Image 1"
              @click="handleImageClick(1)"
            />
          </div>
          <el-popover
            ref="popover"
            placement="bottom"
            popper-class="aop-public-tools-popper"
            width="120px"
            trigger="click"
          >
            <div style="width: 50px">
              <el-checkbox-group v-model="itemList" @change="itemChange">
                <el-checkbox
                  v-for="(item, index) in more"
                  :key="index"
                  :label="item.name"
                  :value="item.operate"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </el-popover>
        </div>
      </div>
      <div
        style="flex: 1; overflow: -Scroll; overflow-x: hidden"
        :class="{ whiteBack: listShow == true }"
      >
        <div class="dataContent" v-if="listShowDra" v-loading="tableLoading">
          <div
            class="dataBox"
            v-for="item in list"
            :key="item"
            @click="detail(item)"
          >
            <div class="dataTop">
              <div class="topLeft">
                <img
                  :src="require('@m/assets/images/编组 7.png')"
                  alt="Image 1"
                  @click="handleImageClick(1)"
                />
              </div>
              <div class="topRight">
                <div class="topRightDetail">{{ item.objName }}</div>
                <span class="belongTo">{{ item.bizDomainName }}</span>
                <span class="category mr8">{{ item.objClassName }}</span>
                <span class="category">{{ `属性${item.paramNum || 0}` }}</span>
              </div>
            </div>
            <div
              class="dataBottom"
              style="
                width: 93%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ item.objDesc }}
            </div>
          </div>
        </div>

        <div class="litstTableShow" v-if="listShow">
          <el-table
            :data="tableData"
            :stripe="striping"
            v-loading="tableLoading"
          >
            <el-table-column
              prop="objId"
              label="业务对象ID"
              min-width="180"
              v-if="itemList.some((item) => item === '业务对象ID')"
            ></el-table-column>
            <el-table-column prop="objName" label="业务对象名称" min-width="180">
              <template slot-scope="scope">
                <span
                  @click="doOperateDetail(scope.$index, scope.row)"
                  class="OperateTextB"
                  >{{ scope.row.objName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="objDesc"
              label="业务对象描述"
              min-width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.objDesc.length > 0 ? scope.row.objDesc : "/"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bizDomainName"
              label="所属域"
              min-width="150"
            >
            </el-table-column>

            <el-table-column prop="objClassName" label="分类" min-width="150">
            </el-table-column>
            <el-table-column
              min-width="180"
              prop="createTime"
              label="创建时间"
              v-if="itemList.some((item) => item === '创建时间')"
            >
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <div class="button">
                  <span
                    @click="doOperateDetail(scope.$index, scope.row)"
                    class="OperateTextB"
                    >查看</span
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-pagination
            v-show="turnPageTotalNum > 9"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[9, 18, 27]"
            :page-size="turnPageShowNum"
            layout="total, prev, pager, next, sizes, jumper"
            :total="turnPageTotalNum"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {},
  props: {
    item: {
      type: Object,
      required: true,
    },
    currentMenuObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableLoading: false, //列表加载
      visible: "",
      showsearch: true, //查询图标
      listShowDra: true,
      listShow: false, //图标隐藏展示列表
      striping: false, //table斑马线
      // 列表分页器
      currentPage: 1,
      turnPageShowNum: 9,
      turnPageTotalNum: 0,
      list: [],
      tableData: [],
      form: {
        keyInput: "",
        objClass: "",
      },
      options1: [
        // {
        //     label: "全部",
        //     value: "",
        // },
      ],
      options2: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "用户",
        },
        {
          value: "2",
          label: "机构",
        },
        {
          value: "3",
          label: "渠道",
        },
        {
          value: "4",
          label: "产品",
        },
        {
          value: "5",
          label: "合约",
        },
        {
          value: "6",
          label: "系统",
        },
      ],
      objclaData: "",
      itemList: [], //图标对应每项列表
      more: [
        {
          name: "业务对象ID",
          operate: "domains",
        },
        {
          name: "创建时间",
          operate: "workNo",
        },
      ],
      objectClassCountList: [],
    };
  },
  computed: {
    allObjectClassCount() {
      return this.objectClassCountList.reduce((prev, item) => {
        return prev + item.num * 1;
      }, 0);
    },
  },
  created() {
    // this.form.name = "";
    // this.getObjList();
    // this.initData();
  },
  methods: {
    objcla(value) {
      // this.objclaData = this.options2[inex].value;
      console.log("打印objclaData", value);
    },
    initData() {
      this.rpc.d1.getBizDomainList().then((res) => {
        this.options1 = res.businessDomainLists;
        this.options1.unshift({
          bizDomainName: "全部",
          bizDomainCode: "",
        });
        console.log(res, "业务领域");
      });
    },
    //翻页器
    handleSizeChange(e) {
      this.turnPageShowNum = e;
      this.getObjList();
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getObjList();
    },
    detail(info) {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/datasetdetail",
        query: info || {},
      });
    },
    doOperateDetail(i, row) {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/datasetdetail",
        query: row || {},
      });
    },
    async getObjList() {
      console.log("getObjList", this.form)
      const res = await this.rpc.dicmgmt.getObjectList({
        currentPage: this.currentPage,
        turnPageShowNum: this.turnPageShowNum,
        // taskId: this.$route.query.taskId,
        // bizDomainNo: this.form.selectedOption1,
        objClass: this.form.objClass,
        objName: this.form.keyInput,
        bizDomainNo: this.currentMenuObj.bizDomainNo,
      })
      this.list = res.objectInfos;
      this.tableData = res.objectInfos;
      this.turnPageTotalNum = res.turnPageTotalNum;
    },
    search() {
      this.currentPage = 1;
      this.getObjList();
    },
    reset() {
      this.form = {
        keyInput: "",
        objClass: "",
      };
      this.getObjList();
    },
    searchGroup() {
      this.showsearch = !this.showsearch;
    },
    listShowClose() {
      console.log("listShowClose")
      this.listShow = !this.listShow;
      this.listShowDra = !this.listShowDra;
    },
    stripe() {
      this.striping = !this.striping;
    },
    tabItemClick(item) {
      console.log("tabItemClick", item);
      this.form.objClass = item.code
      this.search()
    },
    async init() {
      Promise.all([
        this.getObjList(),
        this.rpc.dicmgmt.queryObjCountByObjClass({
          bizDomainNo: this.currentMenuObj.bizDomainNo,
        }),
      ]).then(([objectListData, classCountData]) => {
        const allObjectClassCount = classCountData.countList.reduce(
          (prev, item) => {
            return prev + item.num * 1;
          },
          0
        );
        this.objectClassCountList = [
          {
            code: "",
            name: "全部",
            num: allObjectClassCount,
          },
          ...classCountData.countList,
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  // width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    // height: 64px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 14px;

    .body {
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .main {
        display: flex;
        flex: 1;
        align-items: center;
        // flex-wrap: wrap;
        // margin-top: 11px;
        ::v-deep .el-input,
        ::v-deep .el-select {
          width: 180px;
        }

        ::v-deep .el-form-item__label {
          color: #000;
          font-family: PingFangSC-Regular;
        }

        ::v-deep .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
  }
  .datasetList {
    height: 64px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 14px;
    padding: 20px 24px 16px 24px;
    display: flex;
    .head-left {
      display: flex;
      flex: 1;
      align-items: center;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 600;
        margin-right: 16px;
      }
      .tabs_area {
        display: flex;
        .tab_item {
          height: 24px;
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          margin-right: 5px;
          cursor: pointer;
          background: #f5f5f5;
          border-radius: 20px;
          padding: 0 10px;
          &.active {
            color: #358aff;
            background: #f0f5ff;
          }
        }
      }
    }
    .head-right {
      display: flex;
      // flex-direction: row;
      .logo {
        cursor: pointer;
        width: 36px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(220, 224, 228, 1);
        img {
          width: 20px;
          height: 20px;
        }
      }
      .logo:hover {
        border: 1px solid #2271de !important;
        img {
          margin-right: 3px;
        }
      }
    }
  }
  .dataContent {
    // display: flex;
    // flex-wrap: wrap;
    display: grid;
    grid-template-columns: 33.1% 33.1% 33.1%;
    justify-items: center;
    grid-gap: 12px 0.7%;

    // .dataBox:nth-child(3n) {
    //   margin-right: 0;
    // }
    .dataBox {
      cursor: pointer;
      width: 100%;
      border-radius: 4px;
      height: 148px;
      background: #fff;
      border-radius: 4px;
      padding: 24px 0;
      // margin-right: 12px;
      // margin-bottom: 12px;
      // width: calc((100% - 24px) / 3);

      .dataTop {
        display: flex;
        flex-direction: row;
        .topLeft {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 48px;
          height: 48px;
          border-radius: 4px;
          background: #597ef7;
          margin: 0 12px 12px 16px;
        }
        .topRight {
          .topRightDetail {
            height: 20px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .belongTo {
            height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.65);
            text-align: left;
            line-height: 20px;
            font-weight: 400;
            background: #f5f5f5;
            border: 0.5px solid rgba(217, 217, 217, 1);
            border-radius: 2px;
            margin-right: 8px;
            padding: 0 2px;
          }
          .category {
            height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.65);
            text-align: left;
            line-height: 20px;
            font-weight: 400;
            background: #f5f5f5;
            border: 0.5px solid rgba(217, 217, 217, 1);
            border-radius: 2px;
            padding: 0 2px;
            &.mr8 {
              margin-right: 8px;
            }
          }
        }
      }
      .dataBottom {
        height: 40px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        text-align: left;
        line-height: 20px;
        font-weight: 400;
        margin: 0 19px;
      }
    }
  }
}
.footer {
  text-align: right;
  margin-top: 20px;
}
::v-deep .el-table__header {
  color: #333;
  th {
    font-size: 14px;
    color: rgb(51, 51, 51);
    background: #f5f5f8;
    padding: 10px 0;
  }
}

::v-deep .el-table__body {
  color: #333;
}
.litstTableShow {
  background: #fff;
  // padding: 16px 16px 12px;
}
.OperateTextB {
  width: 28px;
  height: 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #358aff;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: 400;
  cursor: pointer;
}
.aop-public-tools-popper.el-popover {
  min-width: 120px;
}
.aop-public-tools-popper .el-checkbox,
.aop-public-tools-popper .el-checkbox__label {
  display: flex;
  align-items: center;
  color: #333333;
  font-family: PingFangSC-Regular;
  font-size: 12px;
}
::v-deep .el-input__inner {
  height: 32px; /* 设置输入框的高度 */
}
::v-deep .custom-tooltip .el-tooltip__popper {
  height: 50px; /* 修改高度为50px */
}
.whiteBack {
  background-color: #fff;
  padding: 24px;
}
</style>
