<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_service_define">
    <!-- 顶部菜单 -->
    <AsNav @navBack="navBack" :nameProject="nameProject" :asideActive="asideActive">
      <div slot="textProps"></div>
      <!-- <div slot="radioProps">
        <el-radio-group v-model="topNavActive" @change="radioChange" size="small">
          <el-radio-button label="read">浏览</el-radio-button>
          <el-radio-button label="edit" :disabled="noEdit">编辑</el-radio-button>
          <el-radio-button label="a">案例设置</el-radio-button>
        </el-radio-group>
      </div> -->
      <!-- <div slot="btnProps">
        <el-button v-if="pageMode != 'read' && topNavActive == 'edit'" type="primary" @click="toSave">保存</el-button>
      </div> -->
    </AsNav>
    <!-- 主体 -->
    <div class="design_container">
      <!-- <div class="design_container_aside">
        <Aside isClickTips @goTo="handleGoTo" :active="asideActive"></Aside>
      </div> -->
      <div class="design_container_process">
        <div class="process_contain_box">
          <div class="process_container">
            <!-- 元素 -->
            <Pelem
              ref="pelem"
              class="process_left"
              :fnctId="fnctId"
              :fnctCd="fnctCd"
              :authId="authId"
              :fnctInfo="fnctInfo"
              :d4bSvcList="d4bSvcList"
              :r4bSvcList="r4bSvcList"
              :currentD4bObj="currentD4bObj"
              :currentR4bObj="currentR4bObj"
              :currentDatasetObj="currentDatasetObj"
              :menuDatasetList="menuDatasetList"
              :pageMode="pageMode"
              :detailType="detailType"
              :admiId="admiId"
              :isolateWorkspace="isolateWorkspace"
              :competitorId="competitorId"
              :bizLineId="bizLineId"
              :jobId="jobId"
              @showCreateDialog="showCreateDialog"
              @showD2InfoDialog="showD2InfoDialog"
              @pickElemEvent="pickElemEvent"
              @elemTabClick="elemTabClick"
              @getD4bServiceList="getDicServiceList"
              @getR4bServiceList="getR4bServiceList"
              @d4bServClick="d4bServClick"
              @r4bServClick="r4bServClick"
              @handleEdit="handleEdit"
              @getDataList="getDatasetList"
              @getDataSetList="getDataSetList"
              @treeClick="treeClick"
              @handleDataSet="handleDataSet"
              @serviceConfirm="serviceConfirm"
            ></Pelem>
            <!-- 浏览 -->
            <div class="content_wrapper" v-show="topNavActive == 'read'">
              <!-- 画布 -->
              <div
                class="process_middle_wrapper"
                v-show="tabsType == '服务列表'"
              >
                <!-- 页签 -->
                <!-- <ServiceTabs
                  :tabsList="tabsList"
                  :defaultActive="defaultActive"
                  :type="'2'"
                  @tabClick="handleTabClick"
                  @tabEdit="handleTabsEdit"
                >
                </ServiceTabs> -->
                <div class="add_service_page_tabs">
                  <el-tabs v-model="defaultActive" @tab-click="handleTabClick(defaultActive)">
                    <el-tab-pane label="服务信息" name="serviceInfo"></el-tab-pane>
                    <el-tab-pane label="所属数据集" name="belongDataset"></el-tab-pane>
                    <el-tab-pane label="4b交易" name="4bTransaction"></el-tab-pane>
                    <el-tab-pane label="订单信息" name="orderInfo"></el-tab-pane>
                  </el-tabs>
                </div>
                <div class="process_middle">
                  <div v-show="defaultActive == 'serviceInfo'">
                    <BaseInfo ref="baseInfoRef" :currentD4bObj="currentD4bObj" :isEdit="isEdit"> </BaseInfo>
                  </div>
                  <!-- <div v-show="defaultActive == 'demandInfo'">
                    <DemandInfo
                      ref="demandInfoRef"
                      :elemActive="elemActive"
                      :currentR4bObj="currentR4bObj"
                    >
                    </DemandInfo>
                  </div> -->
                  <div v-show="defaultActive == 'orderInfo'">
                    <!-- <div>订单信息</div> -->
                    <OrderInfo ref="orderInfoRef" :isolateWorkspace="isolateWorkspace" :authCode="authCode" :admiId="admiId"></OrderInfo>
                  </div>
                  <div v-show="defaultActive == 'businessRule'">
                    <BusinessRule
                      ref="businessRuleRef"
                      :apiId="apiId"
                      :currentD4bObj="currentD4bObj"
                    >
                    </BusinessRule>
                  </div>
                  <div v-show="defaultActive == 'belongDataset'">
                    <BelongDataset
                      ref="belongDatasetRef"
                      @cellOp="cellBelongOp"
                      :currentD4bObj="currentD4bObj"
                    ></BelongDataset>
                  </div>
                  <div v-show="defaultActive == '4bTransaction'">
                    <TransactionList
                      ref="transactionRef"
                      :currentD4bObj="currentD4bObj"
                    ></TransactionList>
                  </div>
                  <div v-show="defaultActive == 'similarService'">
                    <SimilarServiceList
                      ref="similarServiceRef"
                      :currentD4bObj="currentD4bObj"
                    ></SimilarServiceList>
                  </div>
                  <div v-show="defaultActive == 'servSubDetail'">
                    <SubDetail
                      ref="servSubDetailRef"
                      @cellBelong="cellSubBelong"
                      :currentSubObj="detailSubObj"
                    ></SubDetail>
                  </div>
                  <div v-show="defaultActive == 'servFiledDetail'">
                    <FieldDetail
                      ref="servFiledDetailRef"
                      :fieldInfo="currentFieldObj"
                    ></FieldDetail>
                  </div>
                  <div v-show="defaultActive == 'servL5Detail'">
                    <BaseInfo ref="L5ServiceDetailRef" :isEdit="false"></BaseInfo>
                  </div>
                  <div v-show="defaultActive == 'businessProcess'">
                    <div>
                      <Ptools
                        @toServ="toServ"
                        @pickElemEvent="pickElemEvent"
                        :fourRAttrFlag="fourRAttrFlag"
                        :style="{ width: toolsWidth }"
                      >
                      </Ptools>
                      <Process
                        class="process_main"
                        ref="process"
                        pageType="assetDesign"
                        :dataObj="dataObj"
                        :fourRAttrFlag="fourRAttrFlag"
                        @getAttrEvent="getAttrEvent"
                        @getConditionEvent="getConditionEvent"
                        @getSvgClickEvent="getSvgClickEvent"
                        @handleNewRectAdd="handleNewRectAdd"
                        @generateLineCondPrit="generateLineCondPrit"
                        @handleActionChange="handleActionChange"
                        :isRead="true"
                      >
                        <!-- <template #createNeedsProps="data">
                          <el-button type="primary" size="mini" @click="editNeeds(data)"
                            >编辑需求</el-button
                          >
                          <div class="process_divMb"></div>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="checkNeeds(data)"
                            >需求详情</el-button
                          >
                        </template>
                        <template #hasCreateNeedsProps="data">
                          <el-button
                            type="primary"
                            size="mini"
                            @click="checkNeeds(data)"
                            >组件详情</el-button
                          >
                        </template> -->
                      </Process>
                    </div>
                  </div>
                </div>
              </div>
              <div class="process_middle_wrapper" v-show="tabsType == '数据集'">
                <!-- 页签 -->
                <ServiceTabs
                  :tabsList="dataTabsList"
                  :defaultActive="dataDefaultActive"
                  @tabClick="dataHandleTabClick"
                  @tabEdit="dataHandleTabsEdit"
                >
                </ServiceTabs>
                <div v-show="dataDefaultActive == 'dataSet'">
                  <div class="process_middle">
                    <DatasetDetail
                      :isEdit="true"
                      @addOp="addOp"
                      @cellOp="cellOp"
                      :dataSetNo="dataSetNo"
                      @filedItem="filedItem"
                      @itemField="itemField"
                      :currentDatasetObj="currentDatasetObj"
                      ref="datasetDetailRef"
                    ></DatasetDetail>
                  </div>
                </div>
                <div v-show="dataDefaultActive == 'subDetail'">
                  <div class="process_middle">
                    <!-- <div>分段详情</div> -->
                    <SubDetail
                      ref="subDetailRef"
                      @cellBelong="cellSubData"
                      :currentSubObj="detailSubObj"
                    ></SubDetail>
                  </div>
                </div>
                <div v-show="dataDefaultActive == 'filedDetail'">
                  <div class="process_middle">
                    <!-- <div>字段详情</div> -->
                    <FieldDetail
                      ref="filedDetailRef"
                      :fieldInfo="currentFieldObj"
                    ></FieldDetail>
                  </div>
                </div>
                <div v-show="dataDefaultActive == 'serviceDetail'">
                  <div class="process_middle">
                    <!-- <div>服务详情</div> -->
                    <BaseInfo ref="serviceDetailRef" :isEdit="false"> </BaseInfo>
                  </div>
                </div>
                <div v-show="dataDefaultActive == 'L5Service'">
                  <!-- <div>L5服务</div> -->
                  <L5ServiceList
                    ref="L5ServiceListRef"
                    @servDetail="servDetail"
                    :currentDatasetObj="currentDatasetObj"
                  ></L5ServiceList>
                </div>
              </div>
            </div>
            <!-- 编辑 -->
            <div class="content_wrapper" v-show="topNavActive == 'edit'">
              <ServiceEdit
                ref="serviceEditRef"
                @setTopNavActive="setTopNavActive"
              ></ServiceEdit>
              <!-- 属性 -->
              <EditPattr
                v-show="sidebarVisible"
                ref="editAttr"
                class="process_right"
                :r4bSvcList="r4bSvcList"
                :dicArray="dicArray"
                @updateConditionEvent="updateConditionEvent"
                @upDateFlowParams="upDateFlowParams"
                @updateDataParams="updateDataParams"
                @handleCondPritChange="handleCondPritChange"
                @updateRecordFlow="updateRecordFlow"
              ></EditPattr>
              <div
                class="trigger_diy"
                :class="sidebarVisible ? '' : 'trigger_diy_without_sidebar'"
                @click="sidebarVisible = !sidebarVisible"
              >
                <i class="el-icon-arrow-right" v-if="sidebarVisible"></i>
                <i class="el-icon-arrow-left" v-else></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 服务列表添加弹框 -->
    <PageDialog
      :dialogWidth="'90%'"
      dialogTitle="基本信息"
      :dialogVisiable.sync="sourceVis"
      @closeDialog="closeSerDialog"
    >
      <template slot="box">
        <el-card class="stepProgress" shadow="never">
          <el-steps :space="400" :active="activeSteps" align-center>
            <el-step title="查重"></el-step>
            <el-step title="创建"></el-step>
          </el-steps>
        </el-card>
        <div shadow="never">
          <div class="" v-if="activeShow">
            <div class="pageSearchTop">
              <el-form :inline="true" size="small" :model="formInline">
                <el-rw class="search_bottom">
                  <el-col :span="20">
                    <el-form-item label="服务名称/编号：" prop="serviceNo">
                      <el-input
                        v-model="formInline.serviceNo"
                        placeholder="请输入服务名称/编号"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <div class="form_btn">
                      <el-button size="small" type="primary" @click="searchSer"
                        >查询</el-button
                      >
                      <el-button size="small" @click="resetSer">重置</el-button>
                    </div>
                  </el-col>
                </el-rw>
              </el-form>
            </div>
            <div class="table">
              <Table
                class="table"
                :data="tableData"
                :table="tableSerColumn"
                @operate="operateFn"
              ></Table>
            </div>
            <div class="pagePagination">
              <PagePagination
                class="pn_style"
                @size-change="handleSerSizeChange"
                @current-change="handleSerCurrentChange"
                :pager="pagerSer"
              ></PagePagination>
            </div>
          </div>
          <div class="" v-if="!activeShow">
            <SerBasic :isEdit="true"></SerBasic>
          </div>
        </div>
      </template>
      <div slot="footer">
        <div v-if="activeShow">
          <el-button @click.native="closeSerDialog">取消</el-button>
          <el-button type="primary" @click.native="gotoNext">下一步</el-button>
        </div>
        <div v-else>
          <el-button @click.native="gotoBack">上一步</el-button>
          <el-button type="primary" @click.native="confirmSer">确定</el-button>
        </div>
      </div>
    </PageDialog>

    <!-- <ServiceDialog :visible.sync="visibleService"></ServiceDialog> -->
    <!-- 创建组件 -->
    <PageDialog
      :dialogWidth="'75%'"
      :dialogTitle="steps == 1 ? '绑定D4b服务' : '创建D4b服务'"
      :dialogVisiable="newServiceVisiable"
      @closeDialog="closeDialog"
      class="newService_dialog"
    >
      <div slot="box">
        <div class="info_container_main" v-show="steps == 1">
          <div class="info_container_fr">
            <SearchTop
              class="search_bar"
              ref="searchFormRef"
              :serviceForm="searchForm"
              :form="form"
            >
              <div slot="rightButton">
                <el-button
                  type="primary"
                  size="small"
                  @click="confirm"
                  class="right_button"
                  >创建D4b服务</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="search"
                  class="right_button"
                  >查询</el-button
                >
                <el-button size="small" @click="reset" class="right_button"
                  >重置</el-button
                >
              </div>
            </SearchTop>
            <Table
              class="table"
              :data="d4bApiList"
              :table="tableColumn"
              :radioModel="currentRadio"
              @operate="operate"
              @radioChange="createRadioChange"
            ></Table>

            <!-- 分页器 -->
            <PagePagination
              class="pn_style"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager="pager"
            >
            </PagePagination>
          </div>
        </div>
        <div class="form_box" v-show="steps == 2">
          <el-form
            :rules="newServiceRules"
            :model="newServiceForm"
            ref="form"
            label-width="120px"
          >
            <el-form-item label="服务名称" prop="apiName">
              <el-input
                v-model="newServiceForm.apiName"
                clearable
                placeholder="请输入服务名称"
              />
            </el-form-item>

            <el-form-item label="服务编码" prop="apiCode">
              <el-input
                v-model="newServiceForm.apiCode"
                clearable
                placeholder="请输入服务编码"
              />
            </el-form-item>
            <el-form-item label="归属银行" prop="bkId">
              <el-select
                v-model="newServiceForm.bkId"
                placeholder="请选择归属银行"
                clearable
                @change="bankChange"
              >
                <el-option
                  v-for="item in bkList"
                  :label="item.bkNm"
                  :key="item.bkId"
                  :value="item.bkId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务系统" prop="arsId">
              <el-select
                v-model="newServiceForm.arsId"
                placeholder="请选择服务系统"
                clearable
                @change="arsIdChange"
              >
                <el-option
                  v-for="item in sysList"
                  :label="item.arsName"
                  :key="item.arsId"
                  :value="item.arsId"
                ></el-option>
              </el-select>
              <el-button
                icon="el-icon-plus"
                class="check_formater_btn"
                type="primary"
                :disabled="newServiceForm.bkId == ''"
                @click="showDialog('system')"
                >新增服务系统</el-button
              >
            </el-form-item>
            <el-form-item label="API分组" prop="groupId">
              <el-select
                v-model="newServiceForm.groupId"
                placeholder="请选择API分组"
                clearable
                @change="changeApiGroup"
              >
                <el-option
                  v-for="item in apiGroupList"
                  :label="item.sgName"
                  :key="item.sgId"
                  :value="item.sgId"
                ></el-option>
              </el-select>
              <el-button
                icon="el-icon-plus"
                class="check_formater_btn"
                type="primary"
                :disabled="newServiceForm.arsId == ''"
                @click="showDialog('group')"
                >新增API分组</el-button
              >
            </el-form-item>
            <el-form-item label="版本号" prop="apiVersion">
              <div class="form_item_flex">
                <el-input
                  v-model="newServiceForm.apiVersion"
                  clearable
                  placeholder="请输入版本号，例如1.0.0"
                />
                <span class="icon_right">
                  <i class="el-icon-caret-top" @click="iconClick('add')"></i>
                  <i
                    class="el-icon-caret-bottom"
                    @click="iconClick('lose')"
                  ></i>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="报文格式" prop="formater">
              <span>{{ headerInfo.templateName || "自定义" }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-show="steps == 1" type="primary" @click="createConfirm"
          >确 定</el-button
        >
        <el-button
          v-show="steps == 2"
          type="primary"
          @click="doNewServiceDemand"
          >创建完成</el-button
        >
      </div>
    </PageDialog>
    <!-- 数据集添加 -->
    <PageDialog
      :dialogWidth="'50%'"
      :dialogVisiable="addDataVisible"
      :dialogTitle="dataTitle"
      @closeDialog="closeDataDialog"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="dataSetForm"
          :rules="dataRules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="名称" prop="dataSetNm">
            <el-input
              placeholder="请输入名称"
              v-model="dataSetForm.dataSetNm"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属部" prop="beltLine">
            <el-select
              placeholder="请选择所属部"
              v-model="dataSetForm.beltLine"
              :disabled="type == 'edit'"
            >
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属册" prop="classifyId">
            <el-select
              placeholder="请选择所属册"
              v-model="dataSetForm.classifyId"
              :disabled="type == 'edit'"
            >
              <el-option
                v-for="(item, index) in volumeList"
                :key="index"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="dataSetDesc">
            <el-input
              type="textarea"
              :rows="3"
              v-model="dataSetForm.dataSetDesc"
              clearable
              placeholder="请输入描述"
              :maxlength="length"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeDataDialog">取 消</el-button>
        <el-button type="primary" @click="dataConfirm">确 定</el-button>
      </div>
    </PageDialog>
    <!-- 数据集添加 -->
    <AddDataset ref="addDatasetRef" @confirmComplete="dataConfirm"></AddDataset>
    <!-- 分段弹框 -->
    <AddSub @addSub="addSub" ref="addSubRef"></AddSub>
    <!-- 字段弹框 -->
    <AddFiled
      ref="addFiledRef"
      @confirmFiled="confirmFiled"
      :datasetInfo="currentDatasetObj"
      :subInfo="currentSubObj"
    ></AddFiled>
    <!-- 字段编辑弹框 -->
    <EditFiled
      ref="editFiledRef"
      @confirmFiled="confirmFiled"
      @filedItem="filedItem"
      :datasetInfo="currentDatasetObj"
      :subInfo="currentSubObj"
      :fieldInfo="currentFieldObj"
      type="edit"
    ></EditFiled>
    <!-- 服务确认 -->
    <ServiceConfirm ref="serviceConfirmRef" @designConfirm="designConfirm"></ServiceConfirm>
    <!-- 新增服务系统 -->
    <CreateSystem
      ref="createSystemRef"
      :dialogVisiable="systemVisible"
      :bkList="bkList"
      @updateSelect="updateSelect"
      @closeDialog="systemVisible = false"
    ></CreateSystem>

    <!-- 新增服务系统 -->
    <CreateGroup
      ref="createGroupRef"
      :dialogVisiable="groupVisible"
      @updateSelect="updateSelect"
      @closeDialog="groupVisible = false"
    ></CreateGroup>
    <el-drawer 
    :title="drawerTitle" 
    :visible.sync="drawer"
    :direction="direction" 
    :wrapperClosable="false"
    size="700px"
    >
      <div v-if="drawerTitle == '分段详情'">
        <BelongSubDetail ref="belongSubDetailRef"></BelongSubDetail>
      </div>
      <div v-if="drawerTitle == '字段详情'">
        <!-- 字段详情 -->
        <BelongFieldDetail ref="belongFieldDetailRef"></BelongFieldDetail>
      </div>
      <div v-if="drawerTitle == '服务信息'">
        <!-- 服务信息 -->
        <BelongServiceDetail ref="belongServiceDetailRef"></BelongServiceDetail>
        <!-- <Pattr ref="belongServiceDetailRef"></Pattr> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapActions, mapState } from "vuex";
import Process from "@m/core/components/process/comps";
import AsNav from "./components/dictionary_nav";
import EditPattr from "./components/dictionary_process/attr";
import Pattr from "@m/core/components/process/attr";
import Pelem from "./components/dictionary_process/elem";
import PageDialog from "@m/core/components/page_dialog";
// import Pattr from "@m/core/components/process/attr";
import { html2Escape } from "@m/utils/html2e.js";
import validate from "@m/utils/validate";
import { mixList } from "@m/utils/paramTree";
import Aside from "./components/dictionary_process/aside";
import Ptools from "./components/dictionary_process/tools";
import Params from "./components/dictionary_process/params";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import { unduplicatedByKeys } from "@m/utils/array";
import ServiceTabs from "../public/page_tabs";
import BaseInfo from "./components/base_info";
// import DemandInfo from "./components/demand_info";
import BusinessRule from "./components/business_rule";
import ServiceEdit from "./components/service_edit";
import BelongDataset from "./components/belongDataset/dataDetail"; //所属数据集
import TransactionList from "./components/4bTransaction/transactionList"; //所属数据集
import SimilarServiceList from "./components/similarService/similarServiceList"; //相似服务
import OrderInfo from "./components/order_info"; //订单信息
import SerBasic from "./components/service_list/basic"; //添加服务弹框
import AddDataset from "./components/dataSet_list/addDataset"; //添加数据集弹框
import AddSub from "./components/dataSet_list/addSub"; //添加分段弹框
import AddFiled from "./components/dataSet_list/addFiled"; //添加字段弹框
import EditFiled from "./components/dataSet_list/addFiled"; //编辑字段弹框
import DatasetDetail from "./components/dataSet_list/datasetDetail"; //数据集详情
import SubDetail from "./components/dataSet_list/subDetail"; //分段详情
import FieldDetail from "./components/dataSet_list/fieldDetail"; //分段详情
import L5ServiceList from "./components/L5Service_list/servList"; //L5列表
import BelongSubDetail from "./components/belongDataset/components/subDetail"; //新分段详情
import BelongFieldDetail from "./components/belongDataset/components/fieldDetail"; //新字段详情
import BelongServiceDetail from "./components/belongDataset/components/serviceDetail"; //新服务详情
import ServiceConfirm from "./components/service_confirm"; //服务确认
import CreateSystem from "./components/service_edit/create_system";
import CreateGroup from "./components/service_edit/create_group";
import { getSessionStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Pattr,
    EditPattr,
    Process,
    Pelem,
    AsNav,
    PageDialog,
    Params,
    Aside,
    Ptools,
    Table,
    PagePagination,
    SearchTop,
    ServiceTabs,
    BaseInfo,
    // DemandInfo,
    BusinessRule,
    ServiceEdit,
    CreateSystem,
    CreateGroup,
    BelongDataset, //所属数据集
    TransactionList, //4b交易
    SimilarServiceList, //相似服务
    OrderInfo,       //订单信息
    SerBasic,
    AddDataset,
    AddSub,
    AddFiled,
    EditFiled,
    DatasetDetail,
    SubDetail,
    FieldDetail,
    L5ServiceList,
    ServiceConfirm,
    BelongSubDetail,
    BelongFieldDetail,
    BelongServiceDetail,
    Pattr
  },
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    fnctId: {
      type: String,
      default: () => "",
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    authAppDtlId: {
      type: String,
      default: () => "",
    },
    admiId: {
      type: String,
      default: () => "",
    },
    modelVersion: {
      type: String,
      default: () => "",
    },
    detailType: {
      type: String,
      default: () => "",
    },
    authId: {
      type: String,
      default: () => "",
    },
    isolateWorkspace:{
      type:String,
      default:() => ""
    },
    competitorId:{
      type:String,
      default:() => ""
    },
    bizLineId:{
      type:String,
      default:() => ""
    },
    jobId:{
      type:String,
      default:() => ""
    },
    authCode:{
      type: String,
      default: () => "",
    }
  },
  data() {
    d2Url = `${window.origin}/#/aop_enddesign/layoutdesign/detail?admiId=20000244&orderId=10001865`;
    return {
      //4R组件默认数据
      defaultFourRObj: {
        flow: [
          {
            cpntId: "",
            id: "inputAction1",
            referId: "inputAction",
            type: "inputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "input",
              },
            ],
            paramList: [],
          },
          {
            cpntId: "",
            id: "outputAction2",
            referId: "outputAction",
            type: "outputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "output",
              },
            ],
            paramList: [],
          },
        ],
        position:
          "{&quot;inputAction1&quot;:&quot;197.1092529296875 66.00421142578125 100 48&quot;,&quot;outputAction2&quot;:&quot;198.1092529296875 249.00421142578125 100 48&quot;}",
      },
      // 默认数据
      defaultObj: {
        flow: [
          {
            cpntId: "",
            id: "inputAction1",
            referId: "inputAction",
            type: "inputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "input",
              },
            ],
            paramList: [],
          },
          {
            cpntId: "",
            id: "outputAction2",
            referId: "outputAction",
            type: "outputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "output",
              },
            ],
            paramList: [],
          },
          {
            cpntId: "",
            id: "4RAction3",
            referId: "4RAction",
            type: "4RAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "4R",
              },
            ],
            paramList: [],
          },
        ],
        position:
          "{&quot;inputAction1&quot;:&quot;195.1092529296875 31.00421142578125 100 48&quot;,&quot;outputAction2&quot;:&quot;198.1092529296875 290.00421142578125 100 48&quot;,&quot;4RAction3&quot;:&quot;197.375 127 100 48&quot;}",
      },
      dataObj: {
        flow: [],
        position: "",
      },
      //当前ID与状态
      servId: "",
      //状态 stusCd: 01-待开发，02-开发中，03-开发完成
      stusCd: "",
      // 服务定义 (04-完成服务定义，05-暂定服务定义)
      deployFlg: "",
      //参数下拉数据
      dicArray: [],
      //页面传参
      activeView: "page",
      showType: "process",

      //服务组件相关
      //控制创建服务组件对话框显示或隐藏
      newServiceVisiable: false,
      //创建服务组件数据
      newServiceForm: {
        apiName: "", // D4b服务名称
        apiCode: "", // D4b服务编码
        apiVersion: "1.0.0", // 版本号
        bkId: "",
        bkNm: "",
        arsId: "",
        arsNm: "",
        groupId: "",
        groupNm: "",
      },
      // 创建D4b服务校验
      newServiceRules: {
        apiName: [
          { required: true, trigger: "blur", message: "请输入D4b服务名称" },
          {
            required: true,
            trigger: "blur",
            message: "请输入包含中文的内容",
            validator: validate.containChinese,
          },
        ],
        apiCode: [
          { required: true, trigger: "blur", message: "请输入D4b服务编码" },
        ],
        bkId: [{ required: true, trigger: "change", message: "请选择银行" }],
        arsId: [{ required: true, trigger: "change", message: "请选择系统" }],
        groupId: [{ required: true, trigger: "change", message: "请选择分组" }],
        apiVersion: [
          {
            required: true,
            validator: validate.validateVersion,
            trigger: "blur",
          },
        ],
      },
      currentNewService: {},
      //开发完成
      isConfirmPop: false,
      //服务定义
      isDefinePop: false,
      definePopDesc: "暂停服务定义",
      definePopType: "0",
      atomId: "",
      // 业务类型下拉框数据
      businessList: [],
      // 导航栏页签
      topNavActive: "read",
      // 新增组件页签
      steps: 1,
      // 服务组件列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "apiId",
          width: "45",
          type: "radio",
          tooltip: false,
        },
        {
          prop: "apiSeq",
          label: "D4服务ID",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "D4服务名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiDesc",
          label: "D4b服务描述",
          minWidth: "25%",
          type: "html",
          tooltip: true,
        },
        {
          prop: "apiGroupName",
          label: "D4b服务分组",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiState",
          label: "服务状态",
          width: "90",
          filter: "apiState",
          type: "textClassList",
          align: "center",
          textClassList: [
            { class: "unpublish status", val: "1" },
            { class: "publishing status", val: "2" },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: "1", turnPageShowNum: "10", total: 0 },
      //头部搜索
      searchForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "搜索D4服务名称",
          style: {
            width: "400px",
          },
        },
      ],
      // 搜索条件
      form: {
        cpntNm: "", // 名称
      },
      pageMode: "",
      // 记录流程图数据
      recordFlow: "",
      // 记录流程图位置信息
      recordPosition: "",
      // 返回位置 home 为返回列表
      navReturn: "",
      // 侧边栏的当前选中项索引
      asideActive: "2",
      // 跳转确认框的配置信息
      confirmOptions: {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存后跳转",
        cancelButtonText: "不保存直接跳转",
      },
      // 是否已创建D4分析
      // hasCreated: true,
      // D2信息对话框显示或隐藏
      d2InfoVisiable: false,
      // D2页面的URL
      d2Url,
      // 工具栏宽度
      toolsWidth: "",
      //页签列表
      tabsList: [
        { v: "服务信息", k: "serviceInfo" },
        { v: "所属数据集", k: "belongDataset" },
        { v: "4b交易", k: "4bTransaction" },
        { v: "订单信息", k: "orderInfo" },
        // { v: "相似服务", k: "similarService" },
        // { v: "编辑", k: "edit" },
        // { v: "需求信息", k: "demandInfo" },
        // { v: "业务规则", k: "businessRule" },
        // { v: "业务流程", k: "businessProcess" },
      ],
      //当前页签
      defaultActive: "serviceInfo",
      // apiId: "12702194420047305153",
      editBtnDisabled: false, // 顶部导航的编辑按钮能否点击,
      sidebarVisible: true,
      r4bSvcList: [],
      d4bApiList: [],
      currentRadio: "",

      // 创建D4b服务
      bkList: [],
      sysList: [],
      apiGroupList: [],
      bkObj: {},
      arsObj: {},
      sgObj: {},

      currentApiId: "",
      currentD4bObj: {},
      currentR4bObj: {},

      // 左侧菜单数据
      fnctInfo: {},
      d4bSvcList: [],
      elemActive: "服务列表",

      currentServObj: {},
      // 接口调用完成才展示页面
      infoShow: false,

      systemVisible: false,
      groupVisible: false,
      headerInfo: {},

      fourRAttrFlag: false, //是否双击4R组件
      storeData: {}, //存放当前服务的流程图信息
      storeApiData: {}, //存放当前服务的信息
      isEdit: false, //服务信息页签是否处于可编辑状态

      visibleService: false, //添加服务弹框
      activeSteps: 1,
      activeShow: true,
      sourceVis: false,
      tabsType: "服务列表",
      formInline: {
        serviceNo: "",
      },
      tableData: [],
      pagerSer: { currentPage: "1", turnPageShowNum: "10", total: 0 },
      tableSerColumn: [
        {
          prop: "serviceNm",
          label: "服务名称",
          // width: "220",
          type: "text",
          tooltip: true,
          // operate: "detail",
        },
        {
          prop: "serviceNo",
          label: "服务编码",
          // width: "220",
          type: "textClick",
          tooltip: true,
          operate: "detail",
        },
        {
          prop: "serviceDes",
          label: "服务描述",
          // width: "220",
          type: "text",
          tooltip: true,
          // operate: "detail",
        },
      ],
      dataTabsList: [
        { v: "数据集", k: "dataSet" },
        { v: "L5服务", k: "L5Service" },
      ],
      dataDefaultActive: "dataSet",
      //添加数据集
      addDataVisible: false,
      dataTitle: "添加数据集",
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: "",
      },
      dataRules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" },
        ],
        beltLine: [{ required: true, trigger: "blur", message: "请选择部" }],
        classifyId: [{ required: true, trigger: "blur", message: "请选择册" }],
      },
      //所属部下拉框
      departmentList: [
        { value: "0", label: "对公业务" },
        { value: "1", label: "对私业务" },
        { value: "2", label: "营销业务" },
      ],
      //所属册下拉框
      volumeList: [
        { name: "1", label: "C1 用户册" },
        { name: "2", label: "P1 机构册" },
        { name: "3", label: "C2 渠道册" },
        { name: "4", label: "P2 产品册" },
        { name: "5", label: "C3 合约册" },
        { name: "6", label: "S 系统册" },
      ],
      typeFiled: "read",
      currentDatasetObj: {},
      dataSetNo: "",
      detailSubObj: {},
      menuDatasetList: [],
      currentSubObj: {},
      currentFieldObj: {},
      currentL5servObj: {},
      dataL5Info: {},
      drawerTitle:"",
      drawer:false,
      direction:"rtl",
      nameProject:""
      // fnctCd:"",
      // authCd:""
    };
  },
  computed: {
    ...mapState("aop_tradedesign", ["tempProcessObj", "isProcessTemp"]),
    noEdit() {
      return (
        this.editBtnDisabled ||
        this.pageType == "read" ||
        this.pageMode == "read" ||
        (this.currentD4bObj && this.currentD4bObj.dsgnFlg == 0) ||
        this.d4bSvcList.length == 0
      );
    },
    hasCreated() {
      if (this.elemActive == "服务列表") {
        return this.d4bSvcList.length > 0;
      } else {
        return this.d4bSvcList.length > 0 || this.r4bSvcList.length > 0;
      }
    },
  },
  provide() {
    return {
      getDataList: this.getDataList,
      // setCurrentActionId: this.setCurrentActionId,
      // deleteLineBySourceIdAndTargetId: this.deleteLineBySourceIdAndTargetId,
    };
  },
  methods: {
    ...mapActions("aop_tradedesign", ["saveTempProcessObj", "changeProcessTemp"]),
    //初始化
    init() {
      this.servId = this.$route.query.servId;
      this.atomId = this.$route.query.atomId;
      this.pageMode = this.$route.query.pageMode; // 开发页面进入隐藏保存
      this.apiId = this.$route.query.apiId;
      this.orderId = this.$route.query.orderId;
      this.nameProject = this.$route.query.modelName || "";
      // this.getDataById(this.servId);
      // this.getBusinessList();
      // this.getR4bServiceList();
      // this.getD4bServiceList();
      // this.getDataSetList();
      this.getDicServiceList(); //字典定义服务列表
      // this.detailType === "workbench"
      //   ? this.getWorkbenchInfo()
      //   : this.getFunctionInfo();
    },
    getDataList(e) {
      console.log(
        "getDataList",
        JSON.parse(JSON.stringify(this.$refs.process.dataList))
      );
      return JSON.parse(JSON.stringify(this.$refs.process.dataList));
      // this.$refs.pattr.dataList = JSON.parse(JSON.stringify(this.$refs.process.dataList))
    },
    // 功能详情查询
    async getFunctionInfo() {
      const parmas = {
        fnctId: this.fnctCd,
      };
      const res = await this.rpc.d4.getFunctionInfo(parmas);
      this.fnctInfo = res;
    },

    //工作台详情查询
    async getWorkbenchInfo() {
      const params = {
        admiId: this.admiId,
        modelVersion: this.modelVersion,
      };
      const res = await this.rpc.d4.getWorkInfo(params);
      this.fnctInfo = res;
    },
    // 服务列表查询
    async getD4bServiceList(data) {
      let nmOrNo = data;
      console.log(nmOrNo);
      //模块授权
      const modParams = {
        authAppDtlId: this.fnctId,
        qryCntnt: nmOrNo,
        funcCd: this.fnctCd,
      };
      //工作台授权
      const workParams = {
        authAppDtlId: this.authAppDtlId,
        qryCntnt: nmOrNo,
      };
      const api =
        this.detailType === "workbench"
          ? "getModD4bServiceList"
          : "getFnctD4bServiceList";
      const res = await this.rpc.d4[api](
        this.detailType === "workbench" ? workParams : modParams
      );
      this.d4bSvcList = res.d4bSvcList;
      this.infoShow = true;
      if (this.apiId) {
        this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcId == this.apiId) || {};
      } else {
        this.currentD4bObj = this.d4bSvcList[0];
      }
      // 初次加载
      if (!this.getD4bServiceList.flag && res.d4bSvcList.length > 0) {
        this.getD4bServiceInfo();
        this.getD4bServiceList.flag = true;
      }
    },
    //字典定义服务列表查询
    async getDicServiceList(data) {
      const params = {
        // fnctCd: this.fnctCd,
        // authCd: this.authId,
        // authNo: this.isolateWorkspace,
        authNo: this.authCode || "",
        astNo: this.admiId,
        apiName: data || "",
      };
      // const res = await this.rpc.dicmgmtDefine.getServiceList(params);
      const res = await this.rpc.downloadDesign.getTwoConfirmedServiceList(params);
      this.d4bSvcList = res.apiInfoList;
      this.currentD4bObj = this.d4bSvcList[0];
      if (res.apiInfoList.length > 0) {
        this.getD4bServiceInfo();
      }
      // console.log("getDicServiceList=>", res, this.currentD4bObj);
    },
    //L5所属数据集服务详情
    async getL5SerDetail() {
      console.log(this.currentL5servObj, "getL5SerDetail");
      const params = {
        apiId: this.currentL5servObj.l5SvcId,
      };
      const res = await this.rpc.dicmgmtDefine.getApiDetail(params);
      this.$refs.L5ServiceDetailRef.basicData = res;
    },
    //数据集/L5服务详情
    async getDataServDetail() {
      const params = {
        apiId: this.dataL5Info.apiId || this.dataL5Info.l5SvcId,
      };
      const res = await this.rpc.dicmgmtDefine.getApiDetail(params);
      this.$refs.serviceDetailRef.basicData = res;
    },
    async d4bServClick(e) {
      console.log("d4bServClick", e);
      this.fourRAttrFlag = false;
      this.currentD4bObj = e;
      this.currentApiId = e.svcId;
      this.storeApiData = e;
      this.isEdit = false;

      if (this.defaultActive == "serviceInfo") {
        this.getD4bServiceInfo();
      }
      if (this.topNavActive == "edit") {
        if (this.noEdit) return (this.topNavActive = "read");
        this.$refs.serviceEditRef.getData(e);
      }
      if (this.defaultActive == "demandInfo") {
        this.getR4bSelectList();
      }
      if (this.defaultActive == "businessRule") {
        this.$nextTick(() => {
          this.$refs.businessRuleRef.init();
        });
      }
      if (this.defaultActive == "businessProcess") {
        this.$nextTick(() => {
          this.adjustSize();
          this.getServiceDesignDetail().then(() => {
            this.$refs.pattr.getFlowParams(this.currentServObj);
          });
        });
      }
      if (this.defaultActive == "4bTransaction") {
        this.$nextTick(() => {
          this.$refs.transactionRef.init();
        });
      }
      if (this.defaultActive == "belongDataset") {
        this.$nextTick(() => {
          this.$refs.belongDatasetRef.init();
        });
      }
      if (this.defaultActive == "similarService") {
        this.$nextTick(() => {
          this.$refs.similarServiceRef.init();
        });
      }
      // this.getR4bSelectList()
      // this.servId = e.svcId
      // this.apiState = e.serviceSts
      // this.getDataById(e.svcId)
    },
    async r4bServClick(e) {
      console.log("r4bServClick", e);
      this.$refs.demandInfoRef.currentR4bObj = e;
      this.$refs.demandInfoRef.getR4bServiceDetail({
        r4bSvcId: e.svcId,
      });
      this.getD4bInfoByR4bId(e);
    },
    // 根据R4bid查询D4b服务详情
    async getD4bInfoByR4bId(e) {
      const res = await this.rpc.d4.getD4bInfoByR4bId({
        svcId: e.svcId,
      });
      console.log(res);
      this.$refs.baseInfoRef.basicData = res;
    },
    // 查询D4b服务详情
    async getD4bServiceInfo() {
      const res = await this.rpc.dicmgmt.getApiDetail({
        apiId: this.currentD4bObj && this.currentD4bObj.apiId,
        // svcStsCd: this.currentD4bObj && this.currentD4bObj.svcRlsFlg, // 1发布，0未发布
        // fnctId: this.isolateWorkspace,
        // fnctId:this.authCode || "",
        // dsgnFlg: "0",
      });
      this.currentServObj = res;
      this.$refs.baseInfoRef.basicData = res;
      this.setEditTabData(res);
    },
    async getQuoteNum(){
      const res = await this.rpc.downloadDesign.getQuoteNum({
        svcId:this.currentD4bObj && this.currentD4bObj.apiId,
      })
      this.$refs.baseInfoRef.totalNum = res;
    },
    async getServiceDesignDetail() {
      const params = {
        apiId: this.currentD4bObj.svcId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: this.currentD4bObj.dsgnFlg,
        // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
      };
      const res = await this.rpc.d4.getServiceDesignDetail(params);
      this.currentServObj = {};
      this.currentServObj = res;
      if (!res.flow || res.flow.length == 0) {
        res.flow = this.defaultObj.flow;
        res.position = this.defaultObj.position;
      }
      this.dataObj = res;
    },
    // 设置编辑页签的信息
    async setEditTabData(res) {
      this.$refs.serviceEditRef.setData(res);
    },
    // 查询需求信息下拉框
    async getR4bSelectList(e) {
      const params = {
        fnctId: this.fnctId,
        d4bSvcId: this.currentD4bObj.svcId,
      };
      const res = await this.rpc.d4.getR4bSelectList(params);
      const demandOptions = res.reqSvcList.map((item) => {
        return {
          svcId: item.svcId,
          svcNm: item.svcNm,
        };
      });
      const r4bSvcId = res.reqSvcList[0] ? res.reqSvcList[0].svcId : "";
      this.$refs.demandInfoRef.init({
        demandOptions,
        r4bSvcId,
      });
      this.$refs.editAttr.init({
        demandOptions,
        r4bSvcId,
      });
      // this.$refs.demandInfoRef.demandOptions = res.reqSvcList.map(item => {
      //   return {
      //     svcId: item.svcId,
      //     svcNm: item.svcNm
      //   }
      // })
      // this.$refs.demandInfoRef.currentSelect = r4bSvcId
      // 根据下拉框的第一条查询R4b详情
      // if (r4bSvcId != "") {
      //   this.$refs.demandInfoRef.getR4bServiceDetail({
      //     r4bSvcId: r4bSvcId
      //   })
      // }
    },
    //获取银行
    async getBankList() {
      const res = await this.rpc.public.getBankList();
      this.bkList = res.bkList;
    },
    bankChange(e) {
      this.newServiceForm.groupId = "";
      this.newServiceForm.arsId = "";
      if (!e) {
        this.sysList = [];
        this.apiGroupList = [];
        return;
      }
      this.newServiceForm.bkNm = this.bkList.find(
        (item) => item.bkId == e
      ).bkNm;
      this.getSysList();
    },
    // 获取服务系统列表
    async getSysList() {
      const params = {
        bkId: this.newServiceForm.bkId,
        serviceTypeNm: "D4b服务",
        allShowStatus: "0",
      };
      const res = await this.rpc.public.getServiceSysList(params);
      this.sysList = res.sysList;
    },
    arsIdChange(e) {
      this.newServiceForm.groupId = "";
      if (!e) {
        this.apiGroupList = [];
        return;
      }
      this.newServiceForm.arsNm = this.sysList.find(
        (item) => item.arsId == e
      ).arsName;
      this.getApiGroup();
      this.getHeaderInfo();
    },
    // 获取通讯报文格式
    async getHeaderInfo() {
      console.log("getHeaderInfo");
      const parmas = {
        arsId: this.newServiceForm.arsId,
      };
      const res = await this.rpc.d5.getHeaderInfo(parmas);
      this.headerInfo = res;
    },
    //获取API分组
    async getApiGroup() {
      const params = {
        arsId: this.newServiceForm.arsId,
        serviceType: "D4b服务",
      };
      const res = await this.rpc.public.getApiGroupList(params);
      this.apiGroupList = res.apiGroupList;
    },
    changeApiGroup(e) {
      if (!e) return;
      this.newServiceForm.groupNm = this.apiGroupList.find(
        (item) => item.sgId == e
      ).sgName;
    },
    //创建新D4b服务
    async doNewServiceDemand() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = Object.assign(
            {
              fnctId: this.fnctId,
              apiSource: "D4工作台",
              apiServiceType: "D4b服务",
            },
            this.newServiceForm
          );
          const { apiId } = await this.rpc.d4.addD4bServ(data);
          this.$notify({
            title: "成功",
            message: "创建成功",
            duration: 2000,
            type: "success",
          });
          this.steps = 1;
          this.newServiceVisiable = false;
          this.$refs.form.resetFields();
          this.getD4bServiceList();
        }
      });
    },
    handleGoTo(e) {
      if (this.asideActive == e) return;
      this.$emit("handleGoTo", e, this.currentD4bObj);
    },
    goTo(e) {
      if (this.asideActive == e) return;
      this.asideActive = e;
      if (e == "0") {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/definition",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
            pageType: "design",
          },
        });
      } else if (e == "1") {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/design",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
          },
        });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/assetsdev/modify",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
          },
        });
      }
    },
    // 导航栏返回
    navBack(e) {
      this.navReturn = e;
      this.goRoute();
      // const dataObj = this.pcTranform()
      // if(this.recordFlow !== JSON.stringify(dataObj.flow) || this.recordPosition !== JSON.stringify(dataObj.position)) {
      //   this.$confirm("您修改了流程图，还未保存，需要保存后再跳转吗？", this.confirmOptions).then(async () => {
      //     await this.save();
      //     this.isParams()
      //   }).catch(() => {
      //     this.isParams()
      //   })
      // } else {
      //   this.isParams()
      // }
    },
    // 判断输入输出参数是否修改
    isParams() {
      if (
        this.$refs.paramsRef.iInputListRecord !==
          JSON.stringify(this.$refs.paramsRef.iInputList) ||
        this.$refs.paramsRef.iOutputListRecord !==
          JSON.stringify(this.$refs.paramsRef.iOutputList)
      ) {
        this.$confirm(
          "您修改了输入输出参数，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.saveParams();
            this.goRoute();
          })
          .catch(() => {
            this.goRoute();
          });
      } else {
        this.goRoute();
      }
    },
    // 返回方法
    goRoute() {
      if (this.navReturn == "home") {
        // this.$router.push({
        //   path: "/aop_endentry/t2/list",
        // });
        this.$router.go(-1);
      } else {
        this.$router.back();
      }
    },
    // 获取业务类型下拉框列表
    async getBusinessList() {
      const res = await this.rpc.public.getBusinessList();
      this.businessList = res.dataList;
    },
    //保存所有服务资产参数
    async save() {
      const data = this.pcTranform();
      const ap = JSON.parse(JSON.stringify(this.dataObj));
      ap.flow = data.flow;
      ap.position = data.position;
      ap.suitScp = "CHANNEL";
      ap.commonFlag = false;
      // 校验错误信息映射组件是否有填写
      const setErrorMsgActionArray = ap.flow.filter(
        (item) => item.referId == "setErrorMsgAction"
      );
      for (let i in setErrorMsgActionArray) {
        if (
          setErrorMsgActionArray[i].conf.find(
            (item) => item.name == "errorCodeFieldName"
          ).value == ""
        ) {
          return this.$message.error("错误信息映射组件的列表不能为空");
        }
      }
      const res = await this.rpc.assets.saveServiceAssets(ap);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
    },
    // 保存按钮 触发保存不返回
    async toSave() {
      if (this.topNavActive == "p") {
        if (!(this.$refs.paramsRef.iInputList.length > 0)) {
          return this.$message.error("输入参数不可为空");
        }
        this.saveParams();
      } else {
        const res = await this.save();
      }
    },
    // 保存输入输出参数接口调用
    async saveParams() {
      const params = {
        blngtoId: this.servId,
        blngtoTyp: "1",
        paramList: this.$refs.paramsRef.iInputList.concat(
          this.$refs.paramsRef.iOutputList
        ),
      };
      const res = await this.rpc.public.saveParamsIn(params);
      this.$notify({
        title: "成功",
        message: "输入输出参数保存成功",
        duration: 2000,
        type: "success",
      });
      this.$refs.paramsRef.getAllParams("0");
      this.$refs.paramsRef.getAllParams("1");
    },
    // 暂存服务资产画布
    async tempSave() {
      const data = this.pcTranform();
      this.saveTempProcessObj(data);
    },
    // 画布数据转换
    pcTranform() {
      const k = this.$refs.process.dataList;
      const l = this.$refs.process.lineList;
      const flow = [];
      const p = {};
      for (let i in k) {
        let f = {
          cpntId: k[i].actionOwnId,
          id: k[i].actionId,
          referId: k[i].actionType,
          type: k[i].actionType,
          transition: [],
          conf: k[i].conf,
          paramList: k[i].paramList,
        };
        for (let c in l) {
          if (l[c].sourceId == k[i].actionId) {
            let m = {
              desc: "",
              ...l[c].condition,
              name: k[i].actionId + ".transition" + c,
              value: l[c].targetId,
              polyline: l[c].polyline,
            };
            f.transition.push(m);
          }
        }
        flow.push(f);
        p[k[i].actionId] =
          k[i].actionX +
          " " +
          k[i].actionY +
          " " +
          this.$refs.process.itemOptions.itemWidth +
          " " +
          this.$refs.process.itemOptions.itemHeight;
      }
      const data = JSON.parse(
        JSON.stringify({ flow: flow, position: html2Escape(JSON.stringify(p)) })
      );
      return data;
    },
    //展示创建新服务组件窗口
    showNewServiceDemand(e) {
      this.newServiceVisiable = true;
    },
    //取消创建新服务
    cancelNewService() {
      // this.$refs.process.dataList.pop();
      this.newServiceVisiable = false;
      // this.currentNewService = {};
      this.$refs.searchFormRef.resetFields();
      this.$refs.form.resetFields();
      // this.dataList = []
      this.steps = 1;
    },
    // 清除画布数据缓存
    clearAllData() {
      const data = { flow: [], position: "" };
      this.saveTempProcessObj(data);
      this.changeProcessTemp(false);
    },
    //组合字典
    mixDic() {
      const d = this.dataObj.puApiParams
        .map((item) => {
          return {
            paraNm: item.paraNm,
            paraNo: item.paraNo,
            paraId: item.paraId,
            paraPareId: item.paraPareId,
            paraPosition: item.paraPosition,
          };
        })
        .filter((item) => item.paraPosition == 0);

      // const dc = this.$refs.process.dataList;
      // const dca = [];
      // for (let i in dc) {
      //   for (let c in dc[i].paramList) {
      //     dca.push({
      //       paraNm: dc[i].paramList[c].paraNm,
      //       paraNo: dc[i].paramList[c].paraNo,
      //       paraId: dc[i].paramList[c].paraId,
      //       paraPareId: dc[i].paramList[c].paraPareId,
      //       paraPosition: dc[i].paramList[c].paraPosition,
      //     });
      //   }
      // }
      this.dicArray = unduplicatedByKeys(d, [
        "paraId",
        "paraPareId",
        "paraPosition",
      ]);
    },
    //编辑服务组件需求
    async editNeeds(e) {
      const dataObj = this.pcTranform();
      if (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      ) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.save();
          })
          .catch(() => {})
          .finally(() => {
            this.$router.push({
              path: "/aop_tradedesign/assetsdesign/cpnModify",
              query: {
                reqmentId: e.data.actionOwnId,
                servId: this.servId,
                pageType: "edit",
              },
            });
          });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/cpnModify",
          query: {
            reqmentId: e.data.actionOwnId,
            servId: this.servId,
            pageType: "edit",
          },
        });
      }
    },
    //查看服务组件需求
    async checkNeeds(e) {
      // this.tempSave();
      // this.changeProcessTemp(true);
      const dataObj = this.pcTranform();
      if (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      ) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.save();
          })
          .catch(() => {})
          .finally(() => {
            this.$router.push({
              path: "/aop_tradedesign/assetsdesign/cpnDetail",
              query: {
                reqmentId: e.data.actionOwnId,
              },
            });
          });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/cpnDetail",
          query: {
            reqmentId: e.data.actionOwnId,
          },
        });
      }
    },
    //返回
    goBack() {
      this.$router.go(-1);
    },
    //显示开发完成POP
    showConfirmPop() {
      this.isConfirmPop = true;
    },
    //关闭开发完成POP
    closeConfirmPop() {
      this.isConfirmPop = false;
    },
    //开发完成确认
    async confirmPop() {
      const data = { servId: this.servId };
      const res = await this.rpc.assets.completeServiceAssets(data);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.closeConfirmPop();
      this.$router.push({
        path: "/aop_tradedesign/assetsmgmt/list",
      });
    },
    //显示服务定义POP
    showDefinePop(e) {
      this.definePopDesc = e == "1" ? "完成服务定义" : "暂停服务定义";
      this.definePopType = e;
      this.isDefinePop = true;
    },
    //关闭服务定义POP
    closeDefinePop() {
      this.isDefinePop = false;
    },
    //服务定义
    async definePop() {
      const data = { servId: this.servId, operTyp: this.definePopType };
      const res = await this.rpc.assets.defineServiceAssets(data);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.closeDefinePop();
    },

    //切换视图
    changeType(e) {
      this.showType = e;
    },
    //画布触发
    //画布获取组件参数
    getAttrEvent(e, click) {
      this.$refs.pattr.getAttr(e, click);
      this.mixDic();
    },
    //画布条件
    getConditionEvent(lineObj, lineList) {
      this.$refs.pattr.getCondition(lineObj, lineList);
      this.mixDic();
    },
    //点击画布空白
    getSvgClickEvent(e) {
      if (e.flow.length !== 0) {
        this.$refs.pattr.getFlowParams(this.dataObj);
      }
    },
    //画布组件创建
    handleNewRectAdd(e) {
      if (e.actionType == "newAction") {
        this.currentNewService = e;
        this.showNewServiceDemand(e);
      }
    },
    // 双击4R组件
    async handleActionChange(e) {
      //临时存储服务数据
      this.storeData = this.currentServObj;
      const data = this.pcTranform();
      this.storeData.flow = data.flow;
      this.storeData.position = data.position;
      this.storeData.apiId = this.currentD4bObj.svcId;
      // this.currentD4bObj = e;
      this.currentD4bObj.svcId = e.compositeId;
      // this.currentApiId = e.compositeId;
      this.currentApiId = this.currentServObj.apiId;
      console.log("4R", this.currentApiId);
      //获取组件信息
      this.$nextTick(() => {
        console.log("D4服务数据", this.$refs.pattr);
        this.$refs.pattr.$refs.fourRAttrRefs.getParams(e, this.currentServObj);
        const parmaObj = JSON.parse(getSessionStorage("4R-paramsData"));
        this.currentServObj = parmaObj;
        // Object.assign(this.currentServObj, parmaObj);
      });
      this.$refs.pattr.get4RFlowParams();
      this.fourRAttrFlag = true;
      //获取组件流程图信息
      if (e.compositeId) {
        const params = {
          cpntPId: e.compositeId,
        };
        const res = await this.rpc.d4.getFlowdata(params);
        this.getAllData(res);
      } else {
        const res = {};
        this.getAllData(res);
      }
    },
    toServ() {
      this.fourRAttrFlag = false;
      this.currentServObj = this.storeData;
      // this.currentD4bObj = this.storeApiData;
      // this.currentApiId = this.storeApiData.svcId;
      this.currentD4bObj.svcId = this.currentApiId;
      this.getAllData(this.currentServObj);
      this.$refs.pattr.currentObj = this.currentServObj;
      this.$refs.pattr.getFlowParams(this.currentServObj);
    },
    //获取参数或配置默认参数
    getAllData(val) {
      if (!val.flow || val.flow.length == 0) {
        if (this.fourRAttrFlag) {
          val.flow = this.defaultFourRObj.flow;
          val.position = this.defaultFourRObj.position;
        } else {
          val.flow = this.defaultObj.flow;
          val.position = this.defaultObj.position;
        }
      }
      if (this.isProcessTemp) {
        val.flow = this.tempProcessObj.flow;
        val.position = this.tempProcessObj.position;
      }
      this.dataObj = val;
      // this.$refs.pattr.getFlowParams(this.dataObj);
      this.$nextTick(() => {
        const data = this.pcTranform();
        this.recordFlow = JSON.stringify(data.flow);
        this.recordPosition = JSON.stringify(data.position);
        // if (!this.fourRAttrFlag) {
        //   this.designerFlg = this.dataObj.designerFlg;
        //   this.designerDesc = this.dataObj.designerDesc;
        //   this.isDesign = this.designerFlg !== "2";
        // }
        // console.log("设计标识", this.designerFlg, this.dataObj);
      });
      // this.mixDic();
      this.clearAllData();
    },
    // 生成线条时的默认优先级
    generateLineCondPrit(lineObj, lineList) {
      this.$refs.pattr.generateLineCondPrit(lineObj, lineList);
    },
    //元素栏触发
    //元素创建到画布
    pickElemEvent(e) {
      if (e.item.referId != "executeFlowAction") {
        this.$refs.process.handleNewRectMousedown(e);
        this.mixDic();
        this.$refs.pattr.showType = "attr";
      } else {
        console.log("获取对应D4b服务的流程图，更新画布内容", e);
        this.$refs.pattr.showType = "service";
      }
    },

    //属性栏触发
    //更新线条条件
    updateConditionEvent(e) {
      this.$refs.process.updateCondition(e);
    },
    //更新flow参数
    upDateFlowParams(e) {
      this.dataObj.paramList = e.paramList;
      this.dataObj.input = e.input;
      this.dataObj.output = e.output;
      this.mixDic();
    },

    // 创建服务组件
    operate(operation, data) {
      if (operation == "textClick") {
        this.getRelatedAssets(data);
      } else if (operation == "check") {
        this.newServiceVisiable = false;
        this.$router.push({
          path: "/aop_tradedesign/cpndesign/detail",
          query: {
            pageType: "read",
            reqmentId: data.reqmentId,
          },
        });
      }
    },
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getD4bServiceSelectList();
    },
    //更改当前页
    handleCurrentChange() {
      this.getD4bServiceSelectList();
    },
    //获取数据
    async getList() {
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        cpntNm: this.searchForm.cpntNm,
      };
      const res = await this.rpc.cpn.cpnCheckDuplicate(params);
      this.dataList = res.serviceList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    //搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = "1";
      this.getD4bServiceSelectList();
    },
    reset() {
      this.$refs.searchFormRef.resetFields();
    },
    // 确认按钮
    confirm() {
      this.steps = 2;
      this.$refs.form.resetFields();
      this.getBankList();
      // this.newServiceForm.cpntNm = this.form.cpntNm
    },
    // 获取关联资产
    getRelatedAssets(data) {
      if (data.serviceCount * 1 > 0) {
        const cpn = this.$refs.relatedAssetsList;
        cpn.reqmentId = data.reqmentId;
        cpn.getRelatedAssets(data);
      }
    },
    // 创建服务组件版本号增减点击
    iconClick(e) {
      this.$refs.form.validateField(["apiVersion"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.newServiceForm.apiVersion.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.newServiceForm.apiVersion = n;
        } else {
          let list = this.newServiceForm.apiVersion.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.newServiceForm.apiVersion = n;
        }
      });
    },
    // 更新dataList
    updateDataParams(e) {
      console.log("updateDataParams", e);
      this.$refs.process.updateDataParams(e);
    },
    handleCondPritChange(newCondPrit, oldCondPrit, lineObj) {
      this.$refs.process.handleCondPritChange(
        newCondPrit,
        oldCondPrit,
        lineObj
      );
    },
    // 更新recordFlow
    updateRecordFlow(e) {
      const _recordFlow = JSON.parse(this.recordFlow);
      const updatedItem = _recordFlow.find((item) => item.id == e.actionId);
      if (updatedItem) {
        updatedItem.paramList = JSON.parse(JSON.stringify(e.paramList));
        this.recordFlow = JSON.stringify(_recordFlow);
      }
    },
    // 显示创建D4分析的对话框
    showCreateDialog() {
      // this.newServiceVisiable = true;
      // this.visibleService = true;
      //没有添加服务
      // this.sourceVis = true;
      console.log("showCreateDialog");
      // 获取D4b服务选择列表
      this.getD4bServiceSelectList();
    },
    async getD4bServiceSelectList() {
      const params = {
        apiName: this.searchForm.apiName,
        apiServiceType: "D4b服务",
        apiState: "2",
        // bkId: "69573898205943214251",
        currentPage: this.pager.currentPage,
        turnPageShowNum: "10",
      };
      const res = await this.rpc.public.getApiManageList(params);
      this.d4bApiList = res.apiList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    closeDialog() {
      this.newServiceVisiable = false;
      // this.currentR4bObj = {}
      this.currentRadio = "";
      this.steps = 1;
      this.$refs.searchFormRef.resetFields();
      this.$refs.form.resetFields();
    },
    createRadioChange(e) {
      console.log(e);
      this.currentRadio = e;
    },
    async createConfirm() {
      const target = this.d4bApiList.find(
        (item) => item.apiId == this.currentRadio
      );
      console.log(target);
      const params = {
        svcId: target.apiId,
        relsFlg: "1", // 0未发布 1已发布
        svcNm: target.apiName,
        inOutFlg: "1", // 0内 1外
        svcTpCd: "01",
        fnctId: this.fnctId,
      };
      const res = await this.rpc.d4.associateFunctionWithD4bService(params);
      this.$notify({
        title: "成功",
        message: `关联成功`,
        duration: 2000,
        type: "success",
      });
      this.getD4bServiceList();
      this.closeDialog();
      console.log("确认创建");
    },
    // 显示查看D2信息的对话框
    showD2InfoDialog() {
      console.log("showD2InfoDialog");
      let routeData = this.$router.resolve({
        path: "/aop_enddesign/layoutdesign/detail",
        query: {
          admiId: this.fnctId,
          orderId: this.orderId,
        },
      });
      window.open(routeData.href, "_blank");
      // this.d2InfoVisiable = true
    },
    adjustSize() {
      this.toolsWidth =
        document.querySelector(".process_middle").offsetWidth * 1 - 10 + "px";
    },
    // 添加事件监听器
    addEventListener() {
      window.addEventListener("resize", this.adjustSize, false);
      // document.querySelector(".process_middle").addEventListener("scroll", this.handleScroll, false)
    },
    // 删除事件监听器
    removeEventListener() {
      window.removeEventListener("resize", this.adjustSize, false);
      // document.querySelector(".process_middle").removeEventListener("scroll", this.handleScroll, false)
    },
    //切换当前页签
    handleTabClick(e) {
      this.defaultActive = e;
      if (e == "businessProcess") {
        this.$nextTick(() => {
          this.adjustSize();
          this.getServiceDesignDetail();
          console.log("this.currentServObj", this.currentServObj);
          this.$refs.pattr.getFlowParams(this.currentServObj);
        });
      } else if (e == "demandInfo") {
        this.getR4bSelectList();
      } else if (e == "businessRule") {
        this.$refs.businessRuleRef.init();
      } else if (e == "4bTransaction") {
        this.$refs.transactionRef.init();
      } else if (e == "belongDataset") {
        this.$nextTick(() => {
          this.$refs.belongDatasetRef.init();
        });
      } else if (e == "similarService") {
        this.$refs.similarServiceRef.init();
      } else if (e == "serviceInfo"){
        // this.getD4bServiceInfo();
      }else if (e == "orderInfo"){
        // console.log("订单信息")
        this.$refs.orderInfoRef.init();
      }
    },
    handleTabsEdit(e) {
      this.tabsList = this.tabsList.filter((item) => {
        return item.k !== e;
      });
      this.defaultActive = "belongDataset";
      if (e == "l5Info") {
        this.defaultActive = "edit";
      }
    },
    // 切换左侧菜单的页签
    elemTabClick(e) {
      this.elemActive = e;
      this.tabsType = e;
      console.log("elemTabClick", e);
      if (e == "服务列表") {
        // this.tabsList = [
        //   { v: "服务信息", k: "serviceInfo" },
        //   { v: "需求信息", k: "demandInfo" },
        //   { v: "业务规则", k: "businessRule" },
        //   { v: "业务流程", k: "businessProcess" },
        // ];
        this.defaultActive = "serviceInfo";
        this.editBtnDisabled = false;
        this.getDicServiceList();
      } else {
        console.log("查询数据集列表");
        // this.getDataSetList();
      }
    },
    radioChange(e) {
      if (e == "edit") {
        this.$refs.editAttr.showType = "demand";
        this.$refs.editAttr.getData();
        this.$refs.serviceEditRef.getData(this.dataObj);
        // this.getD4bServiceInfo();
      } else {
        this.getD4bServiceInfo();
      }
    },
    async getR4bServiceList(data) {
      let r4bNm = data;
      console.log(r4bNm);
      const params = {
        fnctId: this.fnctId,
        svcTpCd: "01", // 01-R4b服务;02-R5服务
        nmOrNo: r4bNm,
      };
      const res = await this.rpc.d4.getR4bServiceList(params);
      this.r4bSvcList = res.reqSvcList;
      this.currentR4bObj = this.r4bSvcList[0];
      this.r4bServClick(this.currentR4bObj);
    },
    setTopNavActive(e) {
      this.topNavActive = e;
      this.getD4bServiceInfo();
      // 刷新左侧菜单的列表
      this.getD4bServiceList();
    },

    // 新增系统 新增分组
    showDialog(e) {
      console.log(e);
      if (e == "system") {
        this.systemVisible = true;
        this.$refs.createSystemRef.formData.bkId = this.newServiceForm.bkId;
        this.$refs.createSystemRef.init();
      } else if (e == "group") {
        this.groupVisible = true;
        this.$refs.createGroupRef.formData.bkId = this.newServiceForm.bkId;
        this.$refs.createGroupRef.formData.arsId = this.newServiceForm.arsId;
        this.$refs.createGroupRef.init();
      }
    },
    updateSelect(e) {
      if (e == "system") {
        this.getSysList();
      } else if (e == "group") {
        this.getApiGroup();
      }
    },
    handleEdit(e, serviceEdit) {
      console.log("handleEdit", e, serviceEdit);
      this.fourRAttrFlag = false;
      this.currentD4bObj = e;
      this.currentApiId = e.svcId;
      this.storeApiData = e;
      this.getD4bServiceInfo();
      // this.isEdit = true;
      // this.isEdit = serviceEdit;
      let dataSer = JSON.stringify(e)
      sessionStorage.setItem("servInfo",dataSer);
    },
    //添加服务弹框方法
    searchSer() {},
    resetSer() {},
    closeSerDialog() {
      if (this.activeSteps) this.sourceVis = false;
    },
    handleSerSizeChange() {},
    handleSerCurrentChange() {},
    gotoNext() {
      this.activeSteps = 2;
      this.activeShow = false;
    },
    gotoBack() {
      this.activeSteps = 1;
      this.activeShow = true;
    },
    confirmSer() {
      this.activeSteps = 1;
      this.activeShow = true;
    },
    //数据集列表
    async getDataSetList(dataNm) {
      // console.log(dataNm, "getDataSetList");
      // const params = {
      //   dataSetNm:dataNm || "",
      //   fnctCd:this.fnctCd,
      //   authCd:this.authId,
      // };
      // const res = await this.rpc.dicmgmtDefine.getDataSetList(params);
      // res.classificationList.map((itemClassf) =>{
      //   itemClassf.dataSetNm = itemClassf.classification
      //   itemClassf.number = itemClassf.dataSetList.length;
      // })
      // this.menuDatasetList = res.classificationList;
      // this.dataSetNo = "FM-SJJ-111025";
      // if(res.classificationList.length > 0){
      //   this.currentDatasetObj = this.menuDatasetList[0];
      //   this.$nextTick(() =>{
      //     this.$refs.pelem.$refs.menuDatasetRef.getCurrentKey(this.menuDatasetList[0].dataSetNo)
      //   })
      // }
      // this.$nextTick(() => {
      //   this.$refs.datasetDetailRef.init();
      // });
    },
    //数据集标签点击
    dataHandleTabClick(e) {
      this.dataDefaultActive = e;
      console.log(e, "dataHandleTabClick");
      if (e == "L5Service") {
        this.$refs.L5ServiceListRef.init();
      }
      if (e == "dataSet") {
        if (Object.keys(this.currentDatasetObj).length !== 0) {
          this.$refs.datasetDetailRef.init();
        }
      }
    },
    //标签删除
    dataHandleTabsEdit(e) {
      this.dataTabsList = this.dataTabsList.filter((item) => {
        return item.k !== e;
      });
      this.dataDefaultActive = "dataSet";
    },
    //数据集添加
    treeClick(type, node, data) {
      console.log(type, node, data, "数据集合操作");
      // this.currentDatasetObj = data;
      if (type == "addData" || type == "editData") {
        if (node.level == 1) this.$refs.addDatasetRef.showDialog(type, data);
        else this.$refs.addDatasetRef.showDialog(type, data);
        // this.dataTitle = type == "addData" ? "添加数据集" : "编辑数据集";
        // this.dataSetForm = data;
        // this.addDataVisible = true;
      } else {
        console.log("删除数据集");
      }
    },
    //确认数据集编辑添加
    dataConfirm() {
      this.$refs.pelem.getDataSetList();
    },
    //分段添加确认
    async addSub() {
      console.log("addSub");
      let formData = this.$refs.addSubRef.subForm;
      const params = {
        ...formData,
        blgDataSetNo: this.currentDatasetObj.dataSetNo,
      };
      const api = formData.dataSubstnNo ? "editSubStn" : "addSubStn";
      console.log(formData.dataSubstnNo, "formData.dataSubstnNo");
      const res = await this.rpc.dicmgmtDefine[api](params);
      this.$notify({
        title: "成功",
        message: formData.dataSubstnNo ? "编辑成功" : "新增成功",
        duration: 2000,
        type: "success",
      });
      this.$refs.datasetDetailRef.init();
      this.$refs.addSubRef.closeDialog();
    },
    //字段确认
    confirmFiled() {
      this.$refs.datasetDetailRef.getFieldList();
    },
    //点击树方法
    handleDataSet(node, data) {
      console.log(node, data);
      if (data.level !== 1) {
        console.log("子类");
        this.currentDatasetObj = node;
        sessionStorage.setItem("dataInfo",JSON.stringify(this.currentDatasetObj))
        this.dataSetNo = node.dataSetNo;
        if (this.dataDefaultActive == "dataSet") {
          this.$nextTick(() => {
            this.$refs.datasetDetailRef.init();
          });
        }
        if (this.dataDefaultActive == "L5Service") {
          this.$nextTick(() => {
            this.$refs.L5ServiceListRef.init();
          });
        }

        // this.$refs.datasetDetailRef.init();
        // console.log(this.currentDatasetObj,'this.currentDatasetObj')
      }
    },
    //添加分段和字段弹框
    addOp(type) {
      console.log("分段添加", type);
      if (type == "subsection") {
        this.$refs.addSubRef.showDialog(""); //分段
      } else if (type == "field") {
        // this.currentSubObj = this.$refs.datasetDetailRef.substnData
        this.$refs.addFiledRef.showFiledDialog(); //字段
      }
    },
    //选中当条分段数据
    filedItem(data) {
      console.log("filedItem", data);
      this.currentSubObj = data;
    },
    //选中当条字段数据
    itemField(data) {
      this.currentSubObj = data;
    },
    //数据集每条数据操作
    cellOp(data, e, type) {
      console.log(data, e, type, "cellOp"); //e e:1分段 e:2字段 e:3L5服务 type：删除、编辑、查看
      if (e == "1" && type == "read") {
        const i = this.dataTabsList.find((item) => {
          return item.k == "subDetail";
        });
        if (!i) {
          this.dataTabsList.push({
            v: "分段详情",
            k: "subDetail",
            closable: true,
          });
        }
        this.detailSubObj = data;
        this.$nextTick(() => {
          this.$refs.subDetailRef.init();
        });
        this.dataDefaultActive = "subDetail";
      } else if (e == "1" && type == "mod") {
        this.$refs.addSubRef.showDialog(data);
      } else if (e == "2" && type == "read") {
        const i = this.dataTabsList.find((item) => {
          return item.k == "filedDetail";
        });
        this.currentFieldObj = data;
        this.$nextTick(() => {
          if (!i) {
            this.dataTabsList.push({
              v: "字段详情",
              k: "filedDetail",
              closable: true,
            });
          }
          this.$refs.filedDetailRef.init();
          this.dataDefaultActive = "filedDetail";
        });
      } else if (e == "2" && type == "mod") {
        this.currentFieldObj = data;
        this.$nextTick(() => {
          this.$refs.editFiledRef.showFiledDialog(); //字段
        });
      } else if (e == "3" && type == "read") {
        const i = this.dataTabsList.find((item) => {
          return item.k == "serviceDetail";
        });
        this.dataL5Info = data;
        this.$nextTick(() => {
          if (!i) {
            this.dataTabsList.push({
              v: "服务详情",
              k: "serviceDetail",
              closable: true,
            });
          }
          this.getDataServDetail();
          this.dataDefaultActive = "serviceDetail";
        });
      } else if (e == "1" && type == "delete") {
        this.deteleOp(e, data);
      } else if (e == "2" && type == "delete") {
        this.deteleOp(e, data);
      }
    },
    //数据集删除分段、字段
    deteleOp(e, data) {
      if (e == "1") {
        this.$confirm("是否删除该分段").then(async () => {
          const params = {
            dataSubstnNo: data.dataSubstnNo,
          };
          const res = await this.rpc.dicmgmtDefine.delSubStn(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.$refs.datasetDetailRef.getSubsList();
        });
      } else {
        this.$confirm("是否删除该字段").then(async () => {
          const params = {
            dataSetDataId: data.dataSetDataId,
          };
          const res = await this.rpc.dicmgmtDefine.delMyField(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.$refs.datasetDetailRef.getSubsList();
        });
      }
    },
    //所属数据集 -- 外层
    cellBelongOp(data, e, type) {
      console.log("cellBelongOp", data, e, type);
      if (e == "1" && type == "read") {
        // const i = this.tabsList.find((item) => {
        //   return item.k == "servSubDetail";
        // });
        // this.detailSubObj = data;
        // this.$nextTick(() => {
        //   if (!i) {
        //     this.tabsList.push({
        //       v: "分段详情",
        //       k: "servSubDetail",
        //       closable: true,
        //     });
        //   }
        //   this.$refs.servSubDetailRef.init();
        //   this.defaultActive = "servSubDetail";
        // });
        this.drawerTitle = "分段详情";
        this.drawer = true;
        this.$nextTick(()=>{
          this.$refs.belongSubDetailRef.getDetail(data);
        })
      } else if (e == "2" && type == "read") {
        // const i = this.tabsList.find((item) => {
        //   return item.k == "servFiledDetail";
        // });
        // this.currentFieldObj = data;
        // this.$nextTick(() => {
        //   if (!i) {
        //     this.tabsList.push({
        //       v: "字段详情",
        //       k: "servFiledDetail",
        //       closable: true,
        //     });
        //   }
        //   this.$refs.servFiledDetailRef.init();
        //   this.defaultActive = "servFiledDetail";
        // });
        this.drawerTitle = "字段详情";
        this.drawer = true;
        this.$nextTick(()=>{
          this.$refs.belongFieldDetailRef.getDetail(data);
        })
      } else if (e == "3" && type == "read") {
        // const i = this.tabsList.find((item) => {
        //   return item.k == "servL5Detail";
        // });
        // this.currentL5servObj = data;
        // this.$nextTick(() => {
        //   if (!i) {
        //     this.tabsList.push({
        //       v: "服务详情",
        //       k: "servL5Detail",
        //       closable: true,
        //     });
        //   }
        //   this.getL5SerDetail();
        //   this.defaultActive = "servL5Detail";
        // });
        this.drawerTitle = "服务信息";
        this.drawer = true;
        this.$nextTick(()=>{
          this.$refs.belongServiceDetailRef.getL5SerDetail(data);
        })
      }
    },
    //所属数据集 ---分段详情里面跳转字段详情
    cellSubBelong(data, type) {
      console.log(data, type, "cellSub");
      const i = this.tabsList.find((item) => {
        return item.k == "servFiledDetail";
      });
      this.currentFieldObj = data;
      this.$nextTick(() => {
        if (!i) {
          this.tabsList.push({
            v: "字段详情",
            k: "servFiledDetail",
            closable: true,
          });
        }
        this.$refs.servFiledDetailRef.init();
        this.defaultActive = "servFiledDetail";
      });
    },
    //数据集 ---分段详情里面跳转字段详情
    cellSubData(data, type) {
      console.log(data, type, "cellSubData");
      const i = this.dataTabsList.find((item) => {
        return item.k == "filedDetail";
      });
      this.currentFieldObj = data;
      this.$nextTick(() => {
        if (!i) {
          this.dataTabsList.push({
            v: "字段详情",
            k: "filedDetail",
            closable: true,
          });
        }
        this.$refs.filedDetailRef.init();
        this.dataDefaultActive = "filedDetail";
      });
    },
    //L5服务列表--跳转服务详情
    servDetail(data) {
      console.log(data, "L5服务详情");
      const i = this.dataTabsList.find((item) => {
        return item.k == "serviceDetail";
      });
      this.dataL5Info = data;
      this.$nextTick(() => {
        if (!i) {
          this.dataTabsList.push({
            v: "服务详情",
            k: "serviceDetail",
            closable: true,
          });
        }
        this.getDataServDetail();
        this.dataDefaultActive = "serviceDetail";
      });
    },
    //服务确认弹框
    serviceConfirm(data){
      console.log(data,"服务确认弹框");
      this.$refs.serviceConfirmRef.showDialog(data);
    },
    //设计确认成功回调
    async designConfirm(){
      console.log("设计确认成功回调");
      // this.$refs.pelem.getDataSetList();
      await this.getDicServiceList();
      if(!this.d4bSvcList.length > 0){
        this.$router.go(-1);
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.addEventListener();
      this.adjustSize();
    });
  },
  beforeDestroy() {
    this.removeEventListener();
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_service_define {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep .el-drawer__header{
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    padding: 14px 24px;
    font-family: $font_medium;
    color: $pri_ft_color;
    letter-spacing: 0;
    font-weight: $font_weight_600;
    margin-bottom: 20px;
  }
  .design_container {
    display: flex;
    width: 100%;
    overflow: hidden;
    .design_container_aside {
      flex: 0 0 40px;
    }
    .design_container_process {
      flex: 1;
      width: 0;
      .process_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        display: flex;
        overflow: hidden;
        padding: 12px 16px;
        .process_container {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          display: flex;
          font-family: $font_regular;
          overflow: hidden;
          ::v-deep .el-input__inner {
            border: 1px solid $pri_br_color;
            border-radius: $theme_radius;
          }
          .process_left {
            background: $base_white;
            flex: 0 0 240px;
            border-right: 1px solid $pri_br_color;
          }
          .process_right {
            background: $base_white;
            flex: 0 0 300px;
            // flex: 0 0 260px;
            border-left: 1px solid $pri_br_color;
          }
          .process_main {
            background: $base_white;
            display: inline-block;
            margin: 0px 24px;
            margin-top: 50px;
            .process_divMb {
              margin-bottom: 2px;
            }
          }
          .content_wrapper {
            display: flex;
            flex: 1;
            overflow: auto;
            margin-left: 12px;
            .process_middle_wrapper {
              display: flex;
              flex-direction: column;
              flex: 1;
              overflow: auto;
              .process_middle {
                @include scrollbar;
                // background-color: $base_white;
                flex: 1;
                overflow: auto;
                position: relative;
              }
            }
          }
          .create_container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: $theme_color;
            font-weight: 600;
            .el-icon-plus {
              font-size: 60px;
              cursor: pointer;
            }
          }
        }
      }
      .params_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        background-color: $base_white;
        overflow: auto;
      }
    }
  }
  .newService_dialog {
    .el-select {
      width: 100%;
    }
    ::v-deep .el-form-item__label {
      color: $reg_ft_color;
      font-weight: $font_weight_600;
    }
  }
  .params_contain_box {
    width: 100%;
    height: 100%;
    height: calc(100vh - 48px);
    background-color: $base_white;
    overflow: auto;
  }
  .info_container_main {
    background-color: $base_white;
    .info_container_fr {
      ::v-deep .search_bar {
        width: 100%;
        margin: 0 auto;
      }
      // padding: 16px 24px;
    }
  }
  .steps_box {
    background-color: $base_white;
    padding: 0px 100px;
    width: 100%;
    ::v-deep .el-step__head.is-finish {
      color: $base_white;
      border-color: #358aff;
      .el-step__icon.is-text {
        background-color: #358aff;
      }
    }
    ::v-deep .el-step__head.is-process {
      color: #333;
      border-color: #f8f8f8;
      .el-step__icon.is-text {
        background-color: #f8f8f8;
        .el-step__icon-inner {
          font-weight: normal;
        }
      }
    }
    ::v-deep .el-step__title.is-process {
      font-weight: normal;
      font-size: 12px;
    }
    ::v-deep .el-step__title.is-finish {
      color: #303133;
      font-size: 12px;
    }
  }
  .form_box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    ::v-deep .el-textarea__inner {
      width: 400px;
    }
    .el-input,
    .el-select {
      width: 400px;
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
  .d2Info_dialog {
    ::v-deep .el-dialog {
      margin-top: 5vh !important;
    }
    .iframe_content {
      width: 100%;
      height: 1200px;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
  .trigger_diy {
    position: absolute;
    right: 280px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 2;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-left: 11px solid #409eff;
    i {
      margin-left: -15px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    right: 0px;
  }
  .check_formater_btn {
    margin-left: 16px;
    @include normal_button_common;
  }
  .add_service_page_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    padding: 0 24px;

    ::v-deep .el-tabs__header {
      margin: 0;
    }
    ::v-deep.el-tabs__nav-wrap::after {
      height: 0px;
    }
    ::v-deep.el-tabs__item {
      height: 48px;
      line-height: 48px;
      color: #111111;
    }
  }
  ::v-deep .el-tabs__item {
    box-shadow: none !important;
  }
}

.stepProgress {
  @include el_steps;
}
.pageSearchTop {
  margin-top: 20px;
}
.pn_style {
  text-align: center;
}
.edit_form {
  @include form;
  .header_title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #131313;
    letter-spacing: 0;
    margin-bottom: 20px;
    font-weight: 600;
  }
  /deep/ .el-input,
  /deep/ .el-textarea__inner {
    width: 400px;
  }
  .no_before {
    ::v-deep .el-form-item__label::before {
      content: "";
    }
  }
}
</style>