<template>
  <div class="view-object-drawer">
    <el-drawer
      title="查看对象"
      :visible.sync="isShow"
      size="800px"
      :wrapperClosable="false"
      :before-close="handleClose"
    >
      <div class="drawer-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="1">
            <div class="base-info">
              <BaseItem label="对象名称：" :value="nodeData.objNm" />
              <BaseItem label="编码：" :value="nodeData.objCd" />
              <BaseItem label="对象类型：" :value="nodeData.objTpCdNm" />
              <BaseItem label="所属业务域：" :value="nodeData.bizDomainNm" />
              <BaseItem label="所属中心：" :value="nodeData.appCntrNm" />
              <BaseItem label="分类：" :value="nodeData.objClsNm" />
              <BaseItem label="描述：" :value="nodeData.objDesc" />
              <BaseItem label="更新人：" :value="nodeData.upderNm" />
              <BaseItem label="更新时间：" :value="nodeData.updTm" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="对象属性" name="2">
            <el-table
              :data="nodeData.l5SysBizObjectAttributeDTOs"
              style="width: 100%"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="attrChiNm"
                label="字段名称"
              ></el-table-column>
              <el-table-column prop="attrEngNm" label="编码"></el-table-column>
              <el-table-column
                prop="attrTpCd"
                label="数据类型"
              ></el-table-column
              ><el-table-column prop="attrDesc" label="描述">
                <template slot-scope="scope">
                  <span>{{ scope.row.attrDesc || "/" }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="对象关系" name="3">
            <el-table
              :data="nodeData.l5SysBizObjectRelDTOs"
              style="width: 100%"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="objRelNm"
                label="关系名称"
              ></el-table-column>
              <el-table-column prop="objRelCd" label="编码"></el-table-column>
              <el-table-column
                prop="curObjName"
                label="当前对象"
              ></el-table-column>
              <el-table-column
                prop="targetObjName"
                label="目标对象"
              ></el-table-column>
              <el-table-column
                prop="objRelTpCdNm"
                label="关系类型"
              ></el-table-column>
              <el-table-column
                prop="bjRelEnumNm"
                label="关系重数"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="S6服务" name="4">
            <el-table
                :data="nodeData.s6InfoList"
                style="width: 100%; margin: 12px 0"
                size="small"
                align="center"
                :stripe="false"
                border
                :header-cell-style="{
                  background: '#F5F5F8',
                  color: '#333',
                }"
              >
                <el-table-column
                  prop="aiCode"
                  label="服务编码"
                ></el-table-column>
                <el-table-column
                  prop="aiName"
                  label="服务名称"
                ></el-table-column>
                <el-table-column prop="aiDesc" label="服务描述">
                  <template slot-scope="scope">
                    <span>{{ scope.row.aiDesc || "/" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="110px" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewS6(scope.row)"
                      >查看</el-button
                    >
                  </template></el-table-column
                >
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="映射业务对象" name="5">
            <el-table
              :data="nodeData.sysObjBizObjRelInfoListList"
              style="width: 100%"
              size="small"
              align="center"
              :stripe="false"
              border
              :header-cell-style="{
                background: '#F5F5F8',
                color: '#333',
              }"
            >
              <el-table-column
                prop="objCode"
                label="业务对象编码"
              ></el-table-column>
              <el-table-column
                prop="objName"
                label="业务对象名称"
              ></el-table-column>
              <el-table-column
                prop="objClassName"
                label="分类"
              ></el-table-column
              ><el-table-column
                prop="dictryName"
                label="属性"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import BaseItem from "./BaseItem.vue";
export default {
  components: {
    BaseItem,
  },
  data() {
    return {
      isShow: false,
      activeTab: "1",
      nodeData: {},
      objRelTpCdNmMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      relationMap: {
        "0-N": "1:0..*",
        "1-N": "1:1..*",
        "0-1": "1:0..1",
        "1-1": "1:1",
      },
    };
  },
  methods: {
    show(nodeData, tab) {
      console.log("View nodeData", nodeData);
      this.nodeData = nodeData;
      this.activeTab = tab;
      this.nodeData.objTpCdNm =
        this.nodeData.objTpCd == "00" ? "实体对象" : "值对象";
      this.nodeData.l5SysBizObjectRelDTOs.forEach((i) => {
        i.objRelTpCdNm = this.objRelTpCdNmMap[i.objRelTpCd] || "/";
        i.bjRelEnumNm = this.relationMap[i.bjRelEnum] || "/";
      });
      this.isShow = true;
    },
    viewS6(row) {
      window.open(
        `/aop-h5-sub/#/aop_l5design/application/serviceS6BaseInfo?apiId=${row.aiId}&bizDomainNo=${row.beltLine}&currentType=S5&mode=view`,
        "_blank"
      );
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__header {
  margin: 0;
  padding: 12px;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #e2e2e2;
}
/deep/ .el-drawer__body {
  padding: 12px 12px 0 12px;
  display: flex;
  flex-direction: column;
  .drawer-content {
    flex: 1;
    overflow-y: scroll;
  }
}
</style>

