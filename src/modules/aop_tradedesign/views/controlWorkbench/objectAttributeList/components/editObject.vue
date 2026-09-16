<template>
  <div class="edit_object">
    <aop-public-tabs v-model="activeName">
      <el-tab-pane label="" name="tab1">
        <span slot="label" :class="{ errorRule: firstError == true }">基本信息
          <i v-if="firstError == true" class="el-icon-warning-outline"></i></span></el-tab-pane>
      <el-tab-pane label="对象属性" name="tab2"></el-tab-pane>
      <el-tab-pane label="对象关系" name="tab3"></el-tab-pane>
      <el-tab-pane label="对象行为" name="tab4"></el-tab-pane>
      <el-tab-pane label="映射库表对象" name="tab5"></el-tab-pane>
    </aop-public-tabs>
    <div style="width: 100%; height: 1px; background: #e7e7ee"></div>
    <div class="demo-drawer__content" v-show="activeName == 'tab1'">
      <div class="body">
        <el-form :model="formData" ref="formDataOne" :rules="rules" label-width="90px">
          <el-form-item label="对象名称" prop="objName">
            <el-input v-model="formData.objName" placeholder="请输入对象名称" disabled />
          </el-form-item>
          <el-form-item label="编码" prop="objCode">
            <el-input v-model="formData.objCode" placeholder="字母、数字组合的编码，大写开头" disabled />
          </el-form-item>
          <el-form-item label="对象类型" placeholder="请选择对象类型" prop="objType" style="margin-right: 0; position: relative">
            <p style="display: flex; flex-direction: row; align-items: center">
              <el-select v-model="formData.objType" placeholder="请选择对象类型" style="width: 100%" disabled>
                <el-option v-for="item in optionsObjectType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-checkbox v-if="formData.objType == '00'" style="margin-left: 20px"
                v-model="formData.objAggRoor">聚合根</el-checkbox>
            </p>
          </el-form-item><el-form-item label="分类" prop="objClass">
            <el-select v-model="formData.objClass" collapse-tags style="width: 100%" placeholder="请选择分类" disabled>
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="objDesc">
            <el-input v-model="formData.objDesc" placeholder="请输入描述" class="widthInput" type="textarea" disabled
              :maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="demo-drawer__footer" v-show="activeName == 'tab1'">
        <div class="btmWrap">
          <el-button @click="closeHandle">取 消</el-button>
          <el-button type="primary" @click.native="txtSaveSubmitForm">
            确 定</el-button>
        </div>
      </div> -->
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab2' && !addAttr">
      <div class="body">
        <!-- <el-button type="primary" size="medium" @click="addParamVisible(0)" class="btn" style="margin-bottom: 15px"
          :disabled="type == 'object'">
          <i class="el-icon-plus"></i>
          添加对象属性</el-button> -->
        <el-table :data="tableData">
          <el-table-column prop="dictryName" label="字段名称" width="">
            <template slot-scope="scope">
              <div style="display: flex">
                <span>{{ scope.row.dictryName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dictryNo" label="编码" width="">
          </el-table-column>
          <el-table-column prop="dictryType" label="数据类型">
          </el-table-column>
          <!-- <el-table-column prop="attrDesc" label="描述说明">
            </el-table-column> -->
          <el-table-column prop="address" label="操作" min-width="60px" fixed="right" v-if="type != 'object'">
            <template slot-scope="scope">
              <div class="button">
                <span @click="doOperate1('delete', scope.$index, scope.row)" class="OperateTextR">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="demo-drawer__footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">
          确 定</el-button>
      </div> -->
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab2' && addAttr && !look">
      <div class="body">
        <!-- <el-button type="primary" size="medium" @click="addParamVisible(0)" class="btn"
          style="margin-bottom: 15px;margin-right: 20px;">
          <i class="el-icon-plus"></i>
          添加对象属性</el-button> -->
        <el-button size="medium" class="approve_btn" v-if="!look" style="margin-bottom: 20px;">未核实（{{ isVerifiedNum
        }}）</el-button>
        <el-table :data="tableData">
          <el-table-column prop="fieldName" label="字段名称" min-width="230">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldName || '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldKeyName" label="编码" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldKeyName || '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addFlag" label="是否新增" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.addFlag == '0'">原有属性</span>
              <span v-else-if="scope.row.addFlag == '1'">新增申请</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldFlag" label="是否贯标" min-width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.fieldFlag == '0'">已贯标</el-tag>
              <el-tag type="danger" v-else-if="scope.row.fieldFlag == '1'">未贯标</el-tag>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="aprvlStusCd" label="字段审批状态" min-width="160">
            <template slot-scope="{ row }">
              <el-tag type="danger" v-if="row.aprvlStusCd == '0'">待审批</el-tag>
              <el-tag type="warning" v-else-if="row.aprvlStusCd == '1'">已审批</el-tag>
              <el-tag type="info" v-else-if="row.aprvlStusCd == '2'">未提交</el-tag>
              <span type="info" v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="isVerified" label="是否核实" min-width="100" v-if="!look">
            <template slot-scope="{ row }">
              <el-tag type="danger" v-if="row.isVerified == '1'">未核实</el-tag>
              <el-tag type="success" v-else-if="row.isVerified == '0'">已核实</el-tag>
              <span type="info" v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="handleMode" label="处理方式" min-width="140">
            <!-- 未核实不展示 0-已核实 1-未核实 -->
            <template slot-scope="scope">
              <div v-if="scope.row.isVerified == '0'">
                <span v-if="scope.row.handleMode == '0'">使用字段申请</span>
                <span v-else-if="scope.row.handleMode == '1'">替换已有字段</span>
                <span v-else>/</span>
              </div>
              <div v-else>/</div>
            </template>
          </el-table-column>
          <el-table-column prop="useFieldName" label="使用字段名称" min-width="160">
            <!-- 未核实不展示 0-已核实 1-未核实 -->
            <template slot-scope="scope">
              <div v-if="scope.row.isVerified == '0'">
                <span class="handle_btn" @click="openMapDataDrawer(scope.row)" style="color: #358AFF;"
                  v-if="scope.row.useFieldName">{{ scope.row.useFieldName
                  }}</span>
                <span v-else>/</span>
              </div>
              <div v-else>/</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="attrDesc" label="描述说明">
            </el-table-column> -->
          <el-table-column prop="" label="操作" min-width="180px" fixed="right" v-if="!look">
            <template slot-scope="scope">
              <div class="button">
                <!-- <span @click="handleOperate('delete', scope.$index, scope.row)" class="OperateTextR">删除</span> -->
                <span @click="handleOperate('confirm', scope.$index, scope.row)" v-if="scope.row.isVerified == '1' && scope.row.aprvlStusCd != '0'"
                  class="handle_btn" style="margin-right: 10px;">核实</span>
                <span @click="handleOperate('replace', scope.$index, scope.row)" class="handle_btn"
                  style="margin-right: 10px;">替换</span>
                <span @click="handleOperate('approve', scope.$index, scope.row)" v-if="scope.row.aprvlStusCd == '0'"
                  class="handle_btn">审批字段</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="demo-drawer__footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">
          确 定</el-button>
      </div> -->
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab2' && addAttr && look">
      <div class="body">

        <el-table :data="tableData">
          <el-table-column prop="fieldName" label="字段名称" min-width="230">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldName || '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldKeyName" label="编码" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldKeyName || '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addFlag" label="是否新增" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.addFlag == '0'">原有属性</span>
              <span v-else-if="scope.row.addFlag == '1'">新增申请</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldFlag" label="是否贯标" min-width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.fieldFlag == '0'">已贯标</el-tag>
              <el-tag type="danger" v-else-if="scope.row.fieldFlag == '1'">未贯标</el-tag>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="aprvlStusCd" label="字段审批状态" min-width="160">
            <template slot-scope="{ row }">
              <el-tag type="danger" v-if="row.aprvlStusCd == '0'">待审批</el-tag>
              <el-tag type="warning" v-else-if="row.aprvlStusCd == '1'">已审批</el-tag>
              <el-tag type="info" v-else-if="row.aprvlStusCd == '2'">未提交</el-tag>
              <span type="info" v-else>/</span>
            </template>
          </el-table-column>

          <el-table-column prop="handleMode" label="处理方式" min-width="140">
            <!-- 未核实不展示 0-已核实 1-未核实 -->
            <template slot-scope="scope">
              <span v-if="scope.row.handleMode == '0'">使用字段申请</span>
              <span v-else-if="scope.row.handleMode == '1'">替换已有字段</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="useFieldName" label="使用字段名称" min-width="160">
            <!-- 未核实不展示 0-已核实 1-未核实 -->
            <template slot-scope="scope">
              <span class="handle_btn" @click="openMapDataDrawer(scope.row)" style="color: #358AFF;"
                v-if="scope.row.useFieldName">{{ scope.row.useFieldName
                }}</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="attrDesc" label="描述说明">
            </el-table-column> -->

        </el-table>
      </div>
      <!-- <div class="demo-drawer__footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">
          确 定</el-button>
      </div> -->
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab3'">
      <!-- <div class="obj-relation-content-tips">
        <p class="el-icon-warning">
          请选择目标对象，建立当前对象与其的业务关系。
        </p>
      </div> -->
      <div class="body content">
        <div class="obj-relation-content">
          <!-- <el-button type="primary" size="medium" class="el-icon-plus" @click="addObjRelationFun">添加对象关系</el-button> -->
          <el-table :data="relationTableData" :key="itemKey" style="width: 100%; margin-top: 14px">
            <el-table-column prop="objRelNm" label="关系名称">
            </el-table-column>
            <el-table-column prop="objRelCd" label="编码"> </el-table-column>
            <el-table-column prop="curObjName" label="当前对象">
            </el-table-column>
            <el-table-column prop="targetObjName" label="目标对象">
            </el-table-column>
            <el-table-column prop="obrRelashName" label="关系类型">
            </el-table-column>
            <el-table-column prop="relashMultName" label="关系重数">
            </el-table-column>
            <!-- <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button @click="updateObjRelationFun(scope.$index, scope.row)" type="text">编辑</el-button>
                <el-button @click="
                  handleClickDeleteRelationFun(scope.$index, scope.row)
                  " type="text" style="color: #fe4758">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>

      <!-- <div class="demo-drawer__footer">
        <el-button @click="addKeyActVisible = false">取 消</el-button>
        <el-button type="primary" @click="txtSaveSubmitForm">确 定</el-button>
      </div> -->
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab4'">
      <div class="body" style="padding-bottom: 20px;">
        <!-- <el-button type="primary" size="medium" @click="addBehavior('add')" class="btn" style="margin-bottom: 15px">
          <i class="el-icon-plus"></i>
          添加对象行为</el-button> -->
        <div class="behavior_box" v-if="sideTabList && sideTabList.length > 0">
          <div class="list_box" v-if="sideTabList && sideTabList.length > 0">
            <div v-for="(item, index) in sideTabList" :key="index" :class="{ active: tabActive == index }"
              @click="clickTab(index)">
              <span class="apply_desc" v-if="item.approvalStatus == '01'">申请</span>
              <el-tooltip class="item" effect="dark" :content="item.obeName" placement="top-start">
                <span class="tag_name">
                  {{ item.obeName }}
                </span>
              </el-tooltip>
            </div>
          </div>
          <div class="content_list" v-if="showForm || sideTabList.length > 0">
            <el-form ref="behaviorForm" :model="form" label-width="120px" :rules="behaviorRules">
              <div class="card_title">
                <div class="title">
                  <span class="d_line"></span>
                  <span class="d_detail">基本信息</span>
                </div>
                <!-- <div class="btn">
                  <el-button type="primary" size="mini" @click="saveForm" v-if="!isEdit">确定</el-button>
                  <el-button plain size="mini" @click="cancle" v-if="!isEdit">取消</el-button>
                  <el-button type="primary" plain size="mini" @click="addBehavior('edit')" v-if="isEdit">编辑</el-button>
                  <el-button plain size="mini" @click="deleteForm" v-if="isEdit">删除</el-button>
                </div> -->
              </div>
              <el-form-item label="行为名称：" prop="obeName">
                <el-input class="input" v-model="form.obeName" :disabled="isEdit" clearable placeholder="请输入行为名称">
                </el-input>
              </el-form-item>
              <el-form-item label="行为编码：" prop="obeNo">
                <el-input class="input" v-model="form.obeNo" :disabled="isEdit" clearable placeholder="字母、数字组合的编码，小写开头">
                </el-input>
              </el-form-item>
              <el-form-item label="行为描述：" prop="obeDesc">
                <el-input type="textarea" class="input" v-model="form.obeDesc" :disabled="isEdit" placeholder="请输入行为描述"
                  clearable>
                </el-input>
              </el-form-item>
            </el-form>
            <div class="card_title">
              <div class="title">
                <span class="d_line"></span>
                <span class="d_detail">映射S6</span>
              </div>
            </div>

            <!-- <el-button type="primary" size="medium" @click.native="openS6" :disabled="isEdit || data1.length == 0"
              style="margin-bottom: 12px;">选择S6</el-button> -->

            <template v-if="s6Info">
              <el-table :data="[s6Info]" ref="s6Info">
                <el-table-column prop="aiCode" label="服务编码" min-width="100">
                </el-table-column>
                <el-table-column prop="aiName" label="服务名称" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.aiName || "/" }}
                  </template>
                </el-table-column>
                <el-table-column prop="objNm" label="所属对象" min-width="60">
                  <template slot-scope="scope">
                    {{ scope.row.objNm || "/" }}
                  </template>
                </el-table-column>
                <el-table-column prop="aiCreateUsernm" label="更新人" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.aiCreateUsernm || "/" }}
                  </template>
                </el-table-column>
                <el-table-column prop="aiCreateTime" label="更新时间" min-width="160">
                  <template slot-scope="scope">
                    {{ scope.row.aiCreateTime || "/" }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-empty v-else description="暂无数据" :image-size="100" style="padding: 0;"></el-empty>
          </div>
        </div>
        <el-empty v-else description="暂无数据" :image-size="100" style="padding: 0;"></el-empty>
      </div>

      <!-- <compStandard ref="compStandard" @confirm="addObjectAttrSubmit" /> -->
      <addServiceType @confirm="getGroupList" ref="serviceTypeLog"></addServiceType>
    </div>
    <div class="demo-drawer__content" v-show="activeName == 'tab5'">
      <!-- 映射库表对象 -->
      <div class="body">
        <!-- <el-button type="primary" size="medium" class="btn" style="margin-bottom: 15px"
          @click="selectLibraryTableObject">
          <i class="el-icon-plus"></i>
          选择库表对象</el-button> -->

        <el-table :data="data1" ref="multipleTableTwo">
          <el-table-column show-overflow-tooltip prop="objCd" label="库表对象编码" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.objCd || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="objNm" label="库表对象名称" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.objNm || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="objClsNm" label="分类" min-width="60">
            <template slot-scope="scope">
              {{ scope.row.objClsNm || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="attributesStr" label="属性" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.attributesStr || "/" }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <!-- <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="designData1" type="text" style="color: #358aff">设计</el-button>
              <el-button @click="openObjectInfo(scope.row.objId)" type="text" style="color: #358aff">查看</el-button>
              <el-button @click="deleteData1" type="text" style="color: #fe4758">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <!-- <addModel v-if="showAddModel" ref="addModel" @selectData="selectData" :bizDomain="bizDomain"> </addModel>
    <ObjectInfo :objId="objectInfoId" v-if="showObjectInfo" :visible="showObjectInfo" @close="showObjectInfo = false">
    </ObjectInfo> -->
    <!-- <SelectS6 v-if="showS6" ref="s6" @confirm="handleS6Confirm" :bizDomain="bizDomain" :currentObj="objMain" /> -->
    <!-- <mapData ref="mapData" /> -->
    <!-- 添加对象关系弹窗 -->
    <el-dialog width="60%" :title="relationTitle" :visible.sync="dialogVisibleRelation" :close-on-click-modal="false"
      class="inner_cheetah_common_dialog">
      <div class="relationObjMain">
        <div class="relationObjMain-canvas">
          <div class="relationObjMain-obj">
            <div class="obj-infom obj1">
              {{ formData.objName }}（{{ formData.objCode }}）
            </div>
            <div class="obj-null"></div>
          </div>
          <div class="obj-line">
            <div class="obj-line-content"></div>
            <div class="obj-line-num">
              {{ relationshipNum.label }}
            </div>
          </div>
          <div class="relationObjMain-obj">
            <div class="obj-infom" :class="{
              obj1: relationshipObj.label,
              obj2: !relationshipObj.label,
            }">
              {{ relationshipObj.label
              }}{{
                relationshipObj.value ? "（" + relationshipObj.value + "）" : ""
              }}
            </div>
            <div class="obj-null"></div>
          </div>
        </div>
        <div class="relationObjMain-select">
          <div class="relationObjMain-select-content">
            <label>当前对象</label>
            <p>{{ formData.objName }}</p>
          </div>
          <div class="relationObjMain-select-content">
            <label>&nbsp;</label>
            <el-select v-model="relationshipVal" placeholder="请选择关联关系" size="small" style="width: 140px">
              <el-option v-for="item in optionsRelation" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
            <el-select v-model="relationshipNum" v-if="relationshipVal.value != 'extends'" placeholder="请选择关系重数"
              size="small" style="width: 140px; margin-top: 12px">
              <el-option v-for="item in optionsNum" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="relationObjMain-select-content">
            <label>目标对象</label>
            <el-select v-model="relationshipObj" filterable remote placeholder="请选择目标对象" :remote-method="remoteMethod"
              :loading="loading" size="small" style="width: 140px">
              <el-option v-for="item in optionsObj" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="relationObjMain-form">
          <el-form :model="relationForm" ref="relationForm" :rules="rules3" label-width="80px">
            <el-form-item label="关系名称" prop="objRelNm">
              <el-input disabled v-model="relationName" placeholder="请输入关系名称"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="objRelCd">
              <el-input disabled v-model="relationCode" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="objRelDesc" type="textarea" row="2" placeholder="请输入描述" class="widthInput"
                :maxlength="500"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleObjectRelation">取 消</el-button>
        <el-button type="primary" @click="addObjectRelationSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <compStandard ref="aopBusinessDatadict" :isEdit="true" :activeName="'second'" @confirm="saveParamsDataset" />
    <mapData ref="mapData" />
  </div>
</template>
<script>
// import compStandard from "./compStandard";
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import { unduplicated } from "@m/utils/array";
import PagePagination from "@m/core/components/page_pagination";
// import ObjectNameInput from "./ObjectNameInput";
// import addServiceType from "./addServiceType.vue";
// import ObjectInfo from "./ObjectInfo";
// import addModel from "./popObjSelect";
import { getLocalStorage } from "@m/utils/localStorage.js";
// import SelectS6 from "./SelectS6";
// import mapData from "../fieldDataList/components/mapData";
import compStandard from "../../components/compStandard/index_new";
import mapData from '../../fieldDataList/components/mapData'
export default {
  mixins: [mixin],
  components: {
    Table,
    PagePagination,
    // ObjectNameInput,
    // compStandard,
    // ObjectInfo,
    // addModel,
    // addServiceType,
    // SelectS6,
    // mapData
    compStandard,
    mapData
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    objId: {
      type: String,
      default: "",
    },
    newObjectId: {
      type: String,
    },
    value: {
      type: Boolean,
      default: () => false,
    },
    targetData: [],
    updateNode: {
      type: Function,
      default: () => { },
    },
    bizDomainNo: {
      type: String,
      default: "",
    },
    activeName: {
      type: String,
      default: "tab1",
    },
    type: {
      type: String,
      default: 'bussiness',
    },
    addAttr: {
      type: Boolean,
      default: false,
    },
    look: {
      type: Boolean,
      default: false,
    },
    viewData: {},
  },
  data() {
    return {
      loading: false,
      introduceInfo: {},
      imgUrlDelete: require("@m/assets/images/delete-light.png"),
      sideTabActive: -1,
      sideTabList: [],
      centeroptions: [], //任务中心数据
      editStorage: [], //浅拷贝原数据
      firstError: false,
      objDesign: "true",
      editDialogVisiable: false,
      bizDomainNo1: "",
      //默认显示tab1
      optiType: "",
      optiName: "",
      formData: {
        objName: "",
        objCode: "",
        objType: "00",
        objClass: "",
        objDesc: "",
        objAggRoor: true,
      },

      optionsObjectType: [
        {
          value: "00",
          label: "实体对象",
        },
        {
          value: "01",
          label: "值对象",
        },
      ],
      optionsType: [
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
      rules: {
        objName: [
          {
            required: true,
            message: "请输入对象中文名称",
          },
        ],
        // objCode: [
        //   {
        //     required: true,
        //     pattern: "^[A-Z]{1}([a-zA-Z0-9._]){0,}$",
        //     message: "字母、数字组合的编码，大写开头",
        //     trigger: "blur",
        //   },
        // ],
        // objType: [
        //   {
        //     required: true,

        //     message: "请选择对象类型",
        //   },
        // ],
        // objClass: [{ required: true, message: "请选择分类" }],
      },
      rules2: {
        obeName: [
          {
            required: true,
            message: "请输入对象行为",
          },
        ],
        obeNo: [
          {
            required: true,
            message: "请输入对象行为编码",
          },
        ],
      },

      rules3: {
        objRelNm: [
          {
            required: true,
            message: "请选择目标对象",
          },
        ],
        objRelCd: [
          {
            required: true,
            message: "请选择目标对象",
          },
        ],
      },
      behaviorRules: {
        obeNo: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
        obeName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入对象行为",
          },
        ],
      },
      rulesRelation: {
        objRelNm: [{ required: true }],
        objRelCd: [{ required: true }],
      },
      inputs: [],
      outputs: [],
      dialogVisibleRelation: false,
      objRelDesc: "",
      relationForm: {
        objRelNm: "",
        objRelCd: "",
        objRelDesc: "",
      },
      optionsRelation: [
        {
          value: "association",
          label: "关联",
        },
        {
          value: "aggregation",
          label: "聚合",
        },
        {
          value: "combination",
          label: "组合",
        },
        {
          value: "extends",
          label: "继承",
        },
      ],
      relationMap: {
        association: "关联",
        aggregation: "聚合",
        combination: "组合",
        extends: "继承",
      },
      optionsNum: [
        {
          value: "0-N",
          label: "1:0..*",
        },
        {
          value: "1-N",
          label: "1:1..*",
        },
        {
          value: "0-1",
          label: "1:0..1",
        },
        {
          value: "1-1",
          label: "1:1",
        },
      ],
      optionsObj: [],
      relationshipVal: {},
      relationshipNum: {},
      relationshipObj: {},
      tableData: [],
      tableMetaData: [],

      isRequired: false,
      objActionCurrent: 0,
      objActionCurrentData: {
        obeName: "",
        obeNo: "",
        obeDesc: "",
        inputs: [],
        outputs: [],
      },
      relationTableData: [],
      addObjAttrKey: "",
      editAttrData: {},
      editTitle: "编辑字段",
      relationTitle: "新建对象关系",
      relationFlag: "",
      relationIndex: "",
      itemKey: 0,
      checkList: {},
      updateIndx: "",
      hasDefaultMicroCenter: false,
      addKeyActVisible: false,
      targetObjCd: '',
      optionsTypeMap: {
        1: "用户",
        2: "机构",
        3: "渠道",
        4: "产品",
        5: "合约",
        6: "系统",
      },
      objectBehaviorList: [],
      tabActive: 0,
      form: {
        obeNo: "",
        obeName: "",
        obeDesc: "",
        // isInit: false
        approvalStatus: '00' // 如果编辑新增的时候，直接走无审批
      },
      showForm: false,
      isEdit: false,
      currentIndex: "",
      cstNo: '',
      data1: [],
      showObjectInfo: false,
      objectInfoId: "",
      s6Info: null,
      showS6: false,
      bizDomain: {},
      bizDomainList: [],
      objMain: {},
      showAddModel: false,
      showl5ObjId: '',
      l5ObjId: '',
      tempTab: "",
      behaviorType: "",
      handleIndex: '',
      rowData: {},
      tableDataAttr: []
    };
  },

  watch: {
    value(v) {
      this.addKeyActVisible = v;
    },
  },

  computed: {
    relationName: {
      get() {
        this.relationForm.objRelNm = this.relationshipObj.label;
        return this.relationshipObj.label;
      },
      set(val) { },
    },
    relationCode: {
      get() {
        if (
          (this.relationshipNum.value ||
            this.relationshipVal.value == "extends") &&
          this.relationshipObj.value
        ) {
          const name = this.relationshipObj.value.replace(
            this.relationshipObj.value[0],
            this.relationshipObj.value[0].toLowerCase()
          );
          let code =
            name +
            ((this.relationshipNum.value == "0-N" ||
              this.relationshipNum.value == "1-N") &&
              this.relationshipVal.value != "extends"
              ? "list"
              : "");
          this.relationForm.objRelCd = code;
          return code;
        } else {
          this.relationForm.objRelCd = "";
          return "";
        }
      },
      set(val) { },
    },
    isVerifiedNum() {
      let num = 0;
      this.tableData.forEach(item => {
        if (item.isVerified == '1') {
          num++
        }
      })
      return num
    },
    isApproved() {
      let num = 0;
      this.tableData.forEach(item => {
        if (item.aprvlStusCd == '0') {
          num++
        }
      })
      return num
    }
  },

  created() {
    this.addKeyActVisible = this.value;
    this.qryObjBizObjectInfoV2();
    this.getRoleFn()
    // this.queryBizDomainList()
  },
  methods: {
    getIsVerifiedNum() {
      return this.isVerifiedNum
    },
    getIsApprovedNum(){
      return this.isApproved
    },
    getTableData() {
      return this.tableData
    },
    getTableDataAttr() {
      return this.tableDataAttr
    },
    openS6() {
      this.showS6 = true;
      this.$nextTick(() => {
        this.$refs.s6.openDialog();
      });
    },
    openMapDataDrawer(row) {
      if (row.handleMode == '1') {
        if (this.look) {
          let fieldRow = {
            ...row,
            fieldId: row.directNo,
            fieldKeyName:''
          }
          this.$refs.mapData.openDrawer(fieldRow)
        } else {
          this.$refs.mapData.openDrawer(this.rowData)
        }
      } else {
        this.$refs.mapData.openDrawer(row)
      }
    },
    concelDialog() {
      this.dialogVisible = false;
    },
    async confirmDialog() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit("confirm", { ...this.form, s6Info: this.s6Info }, this.currentIndex);
          this.dialogVisible = false;
        }
      });
    },
    openObjectInfo(id) {
      this.objectInfoId = id;
      this.showObjectInfo = true;
    },
    getRoleFn() { //获取角色
      let userInfo = JSON.parse(getLocalStorage('_userInfo'));
      this.cstNo = userInfo.cstName
    },
    async queryBizDomainList() {
      let res = await this.rpc.controlWorkbench.queryBizDomainList();
      this.bizDomainList = res.businessDomainLists
    },
    async qryObjBizObjectInfoV2() {
      try {
        let res = await this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
          objId: this.objId,
        });

        this.formData.objName = res.objName;
        this.formData.objCode = res.objCode;
        this.formData.objType = res.objType;
        this.formData.objClass = res.objClass;
        this.optiName = this.optionsTypeMap[res.objClass];
        this.formData.objDesc = res.objDesc;
        this.formData.objAggRoor = res.objAggRoor == "01" ? true : false;
        this.tableData = res.attributeInfos || [];

        if (this.addAttr && !this.look) {
          let data = await this.rpc.controlWorkbench.qryBizObjectV2Field({
            aplySrlNo: this.$route.query.aplySrlNo,
            objId: this.objId,
            currentPage: 1,
            turnPageShowNum: 999,
          })
          this.tableData = data.infoList || [];
          this.tableData = this.tableData.map(item => ({
            ...item,
            isVerified: item.addFlag == '0' ? '0' : '1',
            handleType: '0', // 0-使用字段申请 1-替换已有字段
            oldObaId: item.obaId,
          }))
          this.tableDataAttr = JSON.parse(JSON.stringify(this.tableData)) || [];
        } else if (this.addAttr && this.look) {
          // this.tableData = this.viewData.attributeInfos || [];
          // let afterChangeJson = JSON.parse(this.viewData.afterChangeJson);
          // this.tableData = afterChangeJson || [];
          let data = await this.rpc.controlWorkbench.qryCurBizObjectV2FieldList({
            aplySrlNo: this.$route.query.aplySrlNo,
            objId: this.objId,
            currentPage: 1,
            turnPageShowNum: 999,
          })
          this.tableData = data.infoList || [];
        }
        else {
          this.tableData = res.attributeInfos || [];
        }
        this.bizDomainNo1 = res.bizDomainNo;
        const { businessDomainLists } = await this.rpc.controlWorkbench.queryBizDomainList();
        this.bizDomainList = businessDomainLists
        this.bizDomain = this.bizDomainList.find(item => item.bizDomainNo == res.bizDomainNo)
        // this.objMain = {
        //   objName: res.objName,
        //   objId: res.objId,
        // };

        this.relationTableData = res.objectRelInfos.map((item) => {
          return {
            ...item,
            obrId: item.obrId,
            objRelNm: item.obrName,
            objRelCd: item.obrCode,
            curObjId: item.curObjId,
            curObjCd: item.curObjCode,
            targetObjId: item.tgtObjId,
            targetObjCd: item.tgtObjCode,
            objRelDesc: item.obrDesc,
            obrRelashName: this.relationMap[item.obrRelash],
            bjRelEnum: item.relashMult,
            targetObjName: item.tgtObjName,
            relashMultName: item.relashMult,
            ...item,
          };
        });
        // this.sideTabList = res.objectBehaviorInfos;
        // 处理排序
        this.sideTabList = res.objectBehaviorInfos
          .map(item => ({ ...item }))
          .sort((a, b) => {
            const statusA = a.approvalStatus || "";
            const statusB = b.approvalStatus || "";
            if (statusA === "01" && statusB !== "01") {
              return -1;
            }
            if (statusA !== "01" && statusB === "01") {
              return 1;
            }
            if (statusA === "00" && statusB === "02") {
              return -1;
            }
            if (statusA === "02" && statusB === "00") {
              return 1;
            }
            return 0;
          });

        // if (this.sideTabList.length > 0) {
        //   this.form = JSON.parse(JSON.stringify(this.sideTabList[0]))
        //   let s6 = this.form.s6Info
        //   let s6InfoList = await this.getS6InfoFn(s6.aiCode, res.l5ObjId)
        //   this.s6Info = s6InfoList[0] || ""
        //   this.isEdit = true
        // }
        if (this.sideTabList.length > 0) {
          for (const tabItem of this.sideTabList) {
            const formData = JSON.parse(JSON.stringify(tabItem));
            const s6 = formData.s6Info;
            const s6InfoList = s6 ? await this.getS6InfoFn(s6.aiCode, res.l5ObjId) : [];
            tabItem.s6Info = s6InfoList[0] || '';
          }
          this.form = JSON.parse(JSON.stringify(this.sideTabList[0]));
          this.s6Info = this.sideTabList[0].s6Info;
          this.isEdit = true;
        }
        if (res.l5ObjId) {
          const _data1 = await this.rpc.controlWorkbench.qrySysBizObjectInfo({
            objId: res.l5ObjId,
          });
          this.data1 = [_data1];
          this.objMain = _data1
          this.l5ObjId = res.l5ObjId || ''
        }
      } catch (error) {
      }
    },
    async getS6InfoFn(aiNmOrCd, objId) {
      let params = {
        aiNmOrCd: aiNmOrCd,
        objId: objId,
        beltLine: this.bizDomain.bizDomainNo,
        currentPage: 1,
        turnPageShowNum: 10,
      };
      const { infoList } =
        await this.rpc.controlWorkbench.qryS6ServiceInfoPage(params);
      return infoList
    },
    selectLibraryTableObject() {
      this.showAddModel = true
      this.$nextTick(() => {
        this.$refs.addModel.openDialog();
      })
    },
    selectData(info) {
      this.data1 = info ? [info] : [];
      this.objMain = info
    },
    deleteData1() {
      this.data1 = [];
    },
    designData1() {
      const a = this.data1[0];
      window.open(
        `/aop-h5/#/aop_businessd1/graphs/bizWorks?projectId=${a.appCntrNo}&bizDomainNo=${a.bizDomainNo}&designRouter=aop_l5design`,
        "_blank"
      );
    },
    addBehavior(type) {
      // this.$refs.serviceTypeLog.show(info, index);
      this.behaviorType = type
      if (type == 'add') {
        this.form = {
          obeNo: "",
          obeName: "",
          obeDesc: "",
          // isInit: false
          approvalStatus: '00' // 如果编辑新增的时候，直接走无审批
        };
        this.s6Info = ""
        this.isEdit = false;
        this.showForm = true
        this.tabActive = this.sideTabList.length;
      } else if (type == 'edit') {
        this.isEdit = false;
        this.form = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive]))
        this.s6Info = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive].s6Info)) || ""
      }
      // if (!!data.obeName) {
      //   this.isEdit = true;
      //   this.form = data;
      //   this.currentIndex = index;
      // }
      // this.dialogVisible = true;
      // this.$refs.behaviorForm.clearValidate();

    },
    saveForm() {
      this.$refs.behaviorForm.validate(async (valid) => {
        if (valid) {
          // this.$emit("confirm", { ...this.form }, this.currentIndex);
          // this.dialogVisible = false;
          this.getGroupList({ ...this.form, s6Info: this.s6Info }, this.behaviorType == 'add' ? this.sideTabList.length : this.tabActive)
          this.isEdit = true
          this.tabActive = this.behaviorType == 'add' ? this.sideTabList.length - 1 : this.tabActive
        }
      });
    },
    getGroupList(info = {}, index = "") {
      if (index !== "") {
        this.sideTabList[index] = info;
      } else {
        this.sideTabList.push(info);
      }
    },
    deleteForm() {
      this.$confirm("确定删除当前对象行为？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$emit("delete", this.currentIndex);
          this.sideTabList.splice(this.tabActive, 1);
          if (this.sideTabList.length > 0) {
            this.tabActive = this.sideTabList.length - 1;
            this.form = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive]))
            this.s6Info = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive].s6Info)) || ""
          } else {
            this.tabActive = ''
            this.form = {
              obeNo: "",
              obeName: "",
              obeDesc: "",
              approvalStatus: '00'
            }
            this.s6Info = ""
            this.showForm = false
          }

        })
        .catch(() => { });
    },

    cancle() {
      if (this.sideTabList.length > 0) {
        // this.tabActive = this.sideTabList.length - 1;
        this.tabActive = this.behaviorType == 'add' ? this.sideTabList.length - 1 : this.tabActive;
        this.form = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive]))
        this.s6Info = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive].s6Info)) || ""
      } else {
        this.form = {
          obeNo: "",
          obeName: "",
          obeDesc: "",
          approvalStatus: '00'
        }
        this.s6Info = ""
        this.showForm = false
      }
      // this.form = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive]))
      this.isEdit = true
      this.showForm = false

    },
    deleteData(index) {
      this.$confirm("确定删除当前对象行为？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.sideTabList.splice(index, 1);
        })
        .catch(() => { });
    },

    closeHandle() {
      this.closeTrigger();
      this.updateNode();
    },

    closeTrigger() {
      this.addKeyActVisible = false;
      this.$emit("input", false);
    },

    itemInfo(key) {
      this.$set(this.$data, "objActionCurrent", key);
    },
    //元数据弹窗打开 添加参数
    addParamVisible(key) {
      this.$refs.compStandard.showDialog(this.introduceInfo);
    },

    handleClickDelete(index, key) {
      this.$confirm("确定删除当前属性？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (key == "input") {
            this.objActionCurrentData.inputs.splice(index, 1);
            this.editStorage.splice(iattrTpCdndex, 1);
          } else {
            this.objActionCurrentData.outputs.splice(index, 1);
            this.editStorage.splice(index, 1);
          }
        })
        .catch(() => { });
    },

    /**
     * 对象属性保存
     */

    addObjectAttrSubmit(data) {
      let extractedData = data.map((item) => ({
        dictryName: item.fieldName,
        dictryNo: item.fieldKeyName,
        dictryId: item.fieldId,
        dictryType: item.fieldType,
        sourceSysType: "1",
        attrDesc: item.attrDesc,
        required: "",
      }));

      if (this.addObjAttrKey != 0) {
        extractedData.map((item) => {
          item.required = "0";
        });
      }
      this.tableData = unduplicated(
        [...this.tableData, ...extractedData],
        ["dictryId"]
      );
    },

    saveParamsDataset(data) {
      let dataIndex = JSON.parse(JSON.stringify(data))
      // dataIndex.addFlag = '1';
      // dataIndex.isVerified = '0';
      // dataIndex.handleType = '1';
      // dataIndex.useFieldName = data.fieldName
      this.$set(this.tableDataAttr, this.handleIndex, dataIndex)
      this.rowData = {
        fieldId: data.fieldId,
        fieldKeyName: data.fieldKeyName,
        fieldSource: data.fieldSource,
      }
      this.$set(this.tableData, this.handleIndex, {
        ...this.tableData[this.handleIndex],  // 保留原有字段
        addFlag: '1',
        isVerified: '0',
        handleMode: '1',
        useFieldName: data.fieldName,
        directNo: data.fieldId
        // oldObaId: data.obaId,
      });
    },

    doOperate1(operate, index, info) {
      switch (operate) {
        case "delete":
          this.objPropertyDelete(index);
          break;
      }
    },
    handleOperate(operate, index, info) {
      switch (operate) {
        case "delete":
          this.objPropertyDelete(index);
          break;
        case "confirm":
          this.tableData[index].isVerified = '0'
          this.tableData[index].handleMode = '0'
          this.tableData[index].useFieldName = this.tableData[index].fieldName
          // 临时保存
          this.tableDataAttr[index].isVerified = '0'
          this.tableDataAttr[index].handleMode = '0'
          this.tableDataAttr[index].useFieldName = this.tableDataAttr[index].fieldName
          break;
        case "replace":
          this.handleIndex = index
          this.$refs.aopBusinessDatadict.showDialog();
          break;
        case "look":
          this.$refs.mapData.openDrawer({
            ...info,
          });
          break
        case "approve":
          this.$router.push({
            path: '/aop_tradedesign/controlWorkbench/addFieldData',
            query: {
              listType: 'waitApprove',
              sideType: 2,
              rowId: info.fieldId,
              aplySrlNo: info.aplySrlNo,
              fieldName: info.fieldName,
            }
            
          })
          break;
      }
    },


    objPropertyDelete(index) {
      this.$confirm("确定删除当前属性？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.editStorage.splice(index, 1);
        })
        .catch(() => { });
    },

    handleChange2(value) {
      // 将选中的值传递给接口
      this.optiType = value;
      const selectedOption = this.optionsType.find(
        (option) => option.value === value
      );
      this.optiName = selectedOption ? selectedOption.label : "";
    },
    async clickTab(index) {
      this.tabActive = index;
      this.form = JSON.parse(JSON.stringify(this.sideTabList[this.tabActive]))
      // let s6 = this.form.s6Info
      // let s6InfoList = await this.getS6InfoFn(s6.aiCode, this.l5ObjId)
      this.s6Info = this.sideTabList[index].s6Info || ""
      this.isEdit = true
    },
    handleS6Confirm(info) {
      console.log("info s6:", info);
      this.s6Info = info;
      // this.getGroupList({ ...this.form, s6Info: this.s6Info }, this.tabActive)
      // this.sideTabList[this.tabActive].s6Info = this.s6Info
      this.$forceUpdate()
    },
    //点击确定校验基本信息、对象行为
    txtSaveSubmitForm() {
      let rulesSuccess = false;
      this.$refs.formDataOne.validate((valid) => {
        if (valid) {
          this.firstError = false;
        } else {
          this.firstError = true;
        }
      });

      if (!this.firstError) {
        rulesSuccess = true;
      }

      if (rulesSuccess) {
        let attributeInfos = this.tableData.map((item) => {
          return {
            ...item,
          };
        });
        let objectRelInfos = this.relationTableData.map((item) => {
          return {
            ...item,
            obrId: item.obrId,
            obrName: item.objRelNm,
            obrCode: item.objRelCd,
            curObjId: item.curObjId,
            curObjCode: item.curObjCd,
            tgtObjId: item.targetObjId,
            tgtObjCode: item.targetObjCd,
            obrDesc: item.objRelDesc,
            obrRelash: item.objRelTpCd,
            relashMult: item.bjRelEnum,
            tgtObjName: item.targetObjName,
          };
        });

        let objectBehaviorInfos = this.sideTabList.map((item) => {
          return {
            ...item,
            s6Info: !item.s6Info ? {} : item.s6Info,
            // s6ApiId: item.s6Info ? item.s6Info?.aiId : this.s6Info?.aiId,
            s6ApiId: item.s6Info ? item.s6Info.aiId : ''
          };
        });
        let query = {
          createUser: this.cstNo,
          createTime: formatCurrentTime(),
          bizDomainNo: this.bizDomainNo1,
          objId: this.objId,
          objName: this.formData.objName,
          objCode: this.formData.objCode,
          objType: this.formData.objType,
          objClass: this.formData.objClass,
          objDesc: this.formData.objDesc,
          objClassName: this.optiName,
          attributeInfos: attributeInfos,
          objectRelInfos: objectRelInfos,
          objectBehaviorInfos: objectBehaviorInfos,
          objAggRoor: this.formData.objAggRoor ? "01" : "00",
          l5ObjId: this.data1.length > 0 ? this.data1[0].objId : "",
          approvalStatus: "00"
          // approvalStatus: "00",
          // approvalInfo: {
          //   aplySourceId: "",
          //   aplyTargetSource: "",
          //   aplyTargetType: ""
          // }
        };
        console.log(query, 'query')
        function formatCurrentTime() {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        this.rpc.controlWorkbench.saveBizObjectInfoV2(query).then((res) => {
          this.rpc.controlWorkbench.qryObjBizObjectInfoV2({
            objId: this.objId,
          }).then(data => {
            this.$emit('confim', {
              ...data,
              tabActive: this.tabActive,
              sideTabList: this.sideTabList,
            })
          })
        });
      }
    },
    /**
     * 添加对象关系
     */
    addObjRelationFun() {
      let relationFlag = false;
      this.$refs.formDataOne.validate((valid) => {
        if (valid) {
          this.firstError = false;
          relationFlag = true;
        } else {
          this.firstError = true;
        }
      });
      if (!relationFlag) {
        this.$message({
          message: "对象基本信息为填写正确，请先完成",
          type: "warning",
        });
        return;
      }
      this.relationTitle = "新建对象关系";
      this.relationFlag = "add";
      this.relationshipVal = {};
      this.relationshipNum = {};
      this.relationshipObj = {};
      this.objRelDesc = "";
      this.selectOptions();
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
    async remoteMethod(val = '') {
      this.loading = true;
      await this.selectOptions(val)
      this.loading = false;
    },
    async selectOptions(val = '') {
      this.optionsObj = [];
      const data = await this.rpc.controlWorkbench.qryBizObjectV2BaseInfoList({
        currentPage: 1,
        turnPageShowNum: 100,
        bizDomainNo: this.bizDomainNo,
        objName: val
      });
      this.targetData = data.bizObjectLists;
      this.targetData.forEach((item) => {
        if (
          (!this.relationTableData.find(
            (data) => data.targetObjCd == item.objCode
          ) &&
            this.formData.objCode != item.objCode) ||
          item.objCode == this.targetObjCd
        ) {
          this.optionsObj.push({
            value: item.objCode,
            label: item.objName,
            objId: item.objId,
          });
        }
      });
    },
    updateObjRelationFun(index, data) {
      this.relationTitle = "编辑对象关系 ";
      this.relationFlag = "update";
      this.relationshipVal = {
        label: data.obrRelashName,
        value: data.obrRelash,
      };
      this.relationshipNum = {
        label: data.relashMultName,
        value: data.bjRelEnum,
      };
      this.relationshipObj = {
        label: data.targetObjName,
        value: data.targetObjCd,
        objId: data.targetObjId,
      };
      this.objRelDesc = data.objRelDesc;
      this.relationIndex = index;
      this.targetObjCd = data.targetObjCd
      this.selectOptions();
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
    handleClickDeleteRelationFun(index, data) {
      this.$confirm("确定删除当前关系？是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.relationTableData.splice(index, 1);
        })
        .catch(() => { });
    },
    addObjectRelationSubmit() {
      let tmpFlag = true;
      this.$refs.relationForm.validate((valid) => {
        if (valid) {
          tmpFlag = false;
        } else {
          tmpFlag = true;
        }
      });
      if (tmpFlag) {
        return;
      }
      //校验 name和code有没有
      let tmp = {
        obrId: "",
        objRelNm: this.relationName,
        objRelCd: this.relationCode,
        objRelDesc: this.objRelDesc,
        curObjId: this.objId,
        curObjCd: this.formData.objCode,
        curObjName: this.formData.objName,
        targetObjId: this.relationshipObj.objId,
        targetObjCd: this.relationshipObj.value,
        targetObjName: this.relationshipObj.label,
        objRelTpCd: this.relationshipVal.value,
        obrRelashName: this.relationshipVal.label,
        bjRelEnum:
          this.relationshipVal.value != "extends"
            ? this.relationshipNum.value
            : "",
        relashMultName:
          this.relationshipVal.value != "extends"
            ? this.relationshipNum.label
            : "",
      };
      if (this.relationFlag == "add") {
        this.relationTableData.push(tmp);
      } else {
        this.relationTableData[this.relationIndex] = tmp;
      }

      this.itemKey++;
      this.cancleObjectRelation();
    },
    /**
     * 取消对象关系
     */
    cancleObjectRelation() {
      this.$refs.relationForm.resetFields();
      this.relationshipVal = {};
      this.relationshipNum = {};
      this.relationshipObj = {};
      this.dialogVisibleRelation = !this.dialogVisibleRelation;
    },
  },
};
</script>
<style lang="scss" scoped>
.edit_object {
  height: 100%;
  width: 80%;

  ::v-deep.workspace_common_drawer {
    .el-form-item {
      margin-bottom: 18px;
    }

    .el-drawer__container {
      .el-drawer {
        .el-drawer__header {
          border-bottom: 1px solid rgba(238, 240, 245, 1);
          margin-bottom: 0px;
          padding: 16px 24px;
          text-align: left;

          span {
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            line-height: 16px;
            font-weight: 600;
          }
        }
      }
    }
  }

  /deep/.el-tabs {
    min-height: 48px;
    border-bottom: 0 !important;

    .el-tabs__header {
      padding-left: 0px;
      background: #fff;
      margin: 0;
    }

    .el-tabs__nav {
      font-family: PingFangSC-Semibold;
    }

    .el-tabs__nav-wrap::after {
      background: #fff;
    }

    .el-tabs--top .el-tabs__item.is-top {
      font-size: 14px;
    }

    .el-tabs__content {
      position: static;
    }

    .el-tabs__item {
      height: 48px;
      line-height: 48px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      font-weight: 400;
    }

    .el-tabs__item.is-active {
      color: #358aff;
    }

    .el-tabs__item.is-active {
      outline-offset: 0 !important;
      box-shadow: none !important;
    }

    .el-tabs__item:hover {
      color: #358aff;
    }

    .el-tabs__active-bar {
      background-color: #358aff;
      height: 3px;
    }

    .is-disabled {
      cursor: not-allowed;

      &:hover {
        color: #c0c4cc;
      }
    }
  }

  .demo-drawer__content {
    height: 90%;

    .body {
      padding: 0 20px;
      margin-top: 20px;
      padding-bottom: 72px;
    }
  }

  .demo-drawer__footer {
    padding: 20px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    position: absolute;
    text-align: center;
    bottom: 0;
    width: 100%;
    z-index: 10;
    background-color: #fff;
    height: 72px;
    border-top: 1px solid #e7e7e7;
  }

  .button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;

    .handle_btn {
      color: #358AFF;
    }

    // line-height: 16px;
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

  .OperateTextR {
    cursor: pointer;
    width: 28px;
    height: 16px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #fe4758;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 400;
  }

  .Text {
    width: 1px;
    height: 14px;
    background: #e9e9e9;
    margin: 0 6px;
  }

  .dialog_body {
    height: 90%;
    width: 100%;

    .hederBox {
      height: 64px;
      background: #ffffff;
      margin-bottom: 14px;
      display: flex;

      .main {
        flex: 1;
      }
    }

    .title {
      height: 22px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
      font-weight: 600;
      margin-bottom: 12px;
    }
  }

  .dialog_box {
    text-align: center;
    color: #999;
  }

  .dialog_footer {
    text-align: center;
  }

  .selectWide /deep/ .el-select__input {
    width: 180px;
    // padding-right: 0;
  }

  .listStyle {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: 600;
  }

  // .selectAmount {
  // }
  .selectText {
    height: 28px;
    background: #f7f7f9;
    border-radius: 2px;
    margin-right: 5px;

    span {
      cursor: pointer;
    }
  }

  ::v-deep .widthInput .el-input__inner {
    height: 80px;
    vertical-align: top;
  }

  .behavier-save {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep .inputBak .el-input__inner {
    background: #fafafc;
  }

  .obj-action-cont {
    display: flex;

    .obj-action-cont-itemList {
      width: 152px;

      .obj-action-cont-itemList-item {
        width: 144px;
        height: 34px;
        line-height: 34px;
        border-radius: 2px;
        font-size: 14px;
        margin-top: 8px;
        display: flex;
        justify-content: space-around;
        padding: 0 6px;

        .obj-action-cont-itemList-item-icon {
          content: " ";
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url("~@m/assets/images/icon_移动@2x.png");
          background-size: cover;
          margin-top: 9px;
        }

        .obj-action-cont-itemList-item-name {
          flex: 1;
          margin-left: 6px;
          width: 96px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .obj-action-cont-itemList-item-delete {
          padding-top: 9px;
        }
      }

      .actived {
        background: #f0f5ff;
        color: #358aff;
      }
    }

    .obj-action-cont-item-cont {
      padding: 0 24px;
      border-left: 1px solid #dde0e4;
      flex: 1;
      margin-left: 8px;
      overflow: scroll;
    }
  }

  ::v-deep .el-dialog__header {
    background-color: #fafafc;
  }

  .searchMain {
    border-bottom: 1px solid #dde0e4;
  }

  .search-content {
    margin-top: 14px;
  }

  .search-content-title {
    display: flex;
    justify-content: space-between;

    span {
      color: #333333;
      font-size: 16px;
      line-height: 36px;
    }
  }

  .search-content-foot {
    margin-top: 14px;
  }

  .search-content-foot-check {
    color: #333333;
    height: 28px;
    line-height: 28px;

    .search-content-foot-check-content {
      display: flex;
      flex-wrap: wrap;
    }

    span {
      height: 28px;
      background: #f7f7f9;
      border-radius: 2px;
      padding: 0 6px;
      display: inline-block;
      margin-left: 3px;

      &:after {
        content: " ";
        display: inline-block;
        width: 16px;
        height: 16px;
        // background: url("~@m/assets/images/icon_关闭.png");
        background-size: cover;
        margin-left: 4px;
        vertical-align: middle;
      }
    }
  }

  .dialog-footer {
    text-align: center;
  }

  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e7e7ee;
  }

  .obj-relation-content-tips {
    height: 32px;
    line-height: 32px;
    background: #fef2de;
    color: #f5a623;
    margin-bottom: 24px;

    p {
      padding-left: 20px;
    }
  }

  ::v-deep .inner_cheetah_common_dialog {
    .relationObjMain-canvas {
      display: flex;
      justify-content: space-between;

      .relationObjMain-obj {
        width: 200px;
        border: 1px solid rgba(219, 219, 219, 1);
        border-radius: 6px;
        height: 100px;
        overflow: hidden;

        .obj-infom {
          width: 200px;
          height: 56px;
          font-size: 14px;
          line-height: 56px;
          padding: 0 20px;
          color: #fff;
        }

        .obj1 {
          background: #358aff;
          color: #fff;
        }

        .obj2 {
          background: #d7d7d7;
        }

        .obj-null {
          width: 200px;
          height: 44px;
        }
      }

      .obj-line {
        position: relative;
        flex: auto;

        .obj-line-content {
          width: 100%;
          height: 2px;
          background-color: #b5b5bb;
          margin-top: 56px;
          position: relative;

          &:before {
            content: " ";
            width: 10px;
            height: 10px;
            border-radius: 10px;
            border: 1px solid #b5b5bb;
            position: absolute;
            top: -4px;
            background: #fff;
          }

          &:after {
            content: " ";
            width: 0;
            height: 0;
            border-left: 10px solid #b5b5bb;
            border-top: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid transparent;
            position: absolute;
            right: -5px;
            top: -4px;
          }
        }

        .obj-line-num {
          position: absolute;
          font-size: 14px;
          text-align: center;
          width: 64px;
          height: 28px;
          line-height: 28px;
          border: 1px solid #b5b5bb;
          border-radius: 4px;
          top: 43px;
          left: calc(50% - 32px);
          background: #fff;
        }
      }
    }

    .relationObjMain-select {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin-top: 12px;
      color: #666666;

      .relationObjMain-select-content {
        width: 200px;

        label {
          font-size: 14px;
          margin-bottom: 12px;
          display: block;
        }
      }
    }

    .relationObjMain-form {
      border-top: 1px solid #eef0f5;
      margin-top: 30px;
      padding-top: 12px;
    }
  }


  .errorRule {
    color: #d11211;
  }

  ::v-deep .widthInput .el-textarea__inner {
    min-height: 100px !important;
  }

  ::v-deep .el-form-item__error {
    font-size: 14px !important;
  }

  .serviceList-wrapper {
    display: flex;
  }

  .serviceList-right {
    margin-top: 24px;
  }

  .aop_l5design_serviceList-left {
    border-right: 1px solid #ececec;
    margin-top: 16px;

    .tab-list {
      height: calc(100vh - 190px);
      overflow-y: auto;
      padding: 0px 8px;

      img {
        width: 16px;
      }

      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .normal_item {
      background: #fff;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
      padding: 8px;
      margin-bottom: 6px;
      cursor: pointer;
    }

    .select_item {
      background: #f0f5ff;
      border-radius: 2px;
      color: #358aff;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
    }
  }

  .behavior_box {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;

    .list_box {
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      overflow-y: auto;
      // box-sizing: border-box;

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        // text-align: center;
        // flex-shrink: 1;
        border: 1px solid #e5e5e5;
        font-size: 14px;
        line-height: 36px;
        margin-bottom: 10px;
        cursor: pointer;
        width: 100%;
        // padding: 0 10px;

        .apply_desc {
          color: #67c23a;
          margin: 0 4px;
          white-space: nowrap;
          font-size: 12px;
          border: 1px solid #67c23a;
          line-height: normal;
          padding: 2px 4px;
        }

        .tag_name {
          min-width: 0;
          /* 防止内容撑开 */
          padding: 4px 8px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }

        &.active {
          border: 1px solid #358AFF;
          color: #358AFF;
        }
      }
    }

    .content_list {
      flex: 1;
      padding: 0 20px;
      border-left: 1px solid #e5e5e5;

      .card_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;
        margin-bottom: 24px;

        .d_line {
          display: inline-block;
          width: 3px;
          height: 14px;
          margin-right: 6px;
          background: #358AFF;
          flex-shrink: 0;
        }

        .d_detail {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          font-weight: 500;
        }

        .card_desc_tips {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          font-weight: 400;
          margin-left: 8px;
          line-height: 22px;
        }
      }

      .info_item {
        font-size: 14px;
        margin-bottom: 24px;

        .info_label {
          display: inline-block;
          width: 100px;
          text-align: right;
        }
      }
    }
  }

  .approve_btn {
    border: 1px solid #fe5161;
    color: #fe5161;
  }
}
</style>
