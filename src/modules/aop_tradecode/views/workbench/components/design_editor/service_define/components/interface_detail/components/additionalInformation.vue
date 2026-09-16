<template>
  <div class="aop_tradecode_comps_trans_detail_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content" :style="isEditing?'margin-left: 4px;':''">
          <span :class="isEditing?'label_info':''">所在类-所属工程模块：</span>
          <span v-if="!isEditing" class="content_info">{{ extendInfo.modName || '/' }}</span>
           <el-select v-if="isEditing" v-model="extendInfo.modName" placeholder="请选择" >
            <el-option v-for="(item,index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="left_content" :style="isEditing?'margin-left: 4px;':''">
          <span :class="isEditing?'label_info':''">所在类-包路径：</span>
          <span v-if="!isEditing" class="content_info">{{ extendInfo.packageName || '/' }}</span>
          <el-input v-if="isEditing" v-model="extendInfo.packageName" placeholder="请输入" size="small" class="edit_input"  :class="{ 'is-invalid': isInputInvalidOne}"/>
        </div>
        <div class="left_content" :style="isEditing?'margin-left: 4px;':''">
          <span :class="isEditing?'label_info':''">所在类-英文名：</span>
          <span v-if="!isEditing" class="content_info">{{ extendInfo.classEnName || '/' }}</span>
          <el-input v-if="isEditing" v-model="extendInfo.classEnName" placeholder="请输入" size="small" class="edit_input"  :class="{ 'is-invalid': isInputInvalidOne}"/>
        </div>
        <div class="left_content" :style="isEditing?'margin-left: 4px;':''">
          <span :class="isEditing?'label_info':''">所在类-中文名：</span>
          <span v-if="!isEditing" class="content_info">{{ extendInfo.classCnName || '/' }}</span>
          <el-input v-if="isEditing" v-model="extendInfo.classCnName" placeholder="请输入" size="small" class="edit_input"  :class="{ 'is-invalid': isInputInvalidOne}"/>
        </div>
          <!-- <div class="right_content">
          <span :class="isEditing?'label_info':''">所在类-继承类索引：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.methodIndex">{{ extendInfo.methodIndex  || '/'}}</span>
          <el-input v-if="isEditing" v-model="extendInfo.methodIndex" placeholder="请输入" size="small" class="edit_input" :class="{ 'is-invalid': isInputInvalid }"/>
        </div> -->
        <div class="right_content">
          <span :class="isEditing?'label_info':''">在类中的注解：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.aiAnnotations">{{ extendInfo.aiAnnotations  || '/'}}</span>
          <el-input v-if="isEditing" v-model="extendInfo.aiAnnotations" placeholder="请输入" size="small" class="edit_input" :class="{ 'is-invalid': isInputInvalid }"/>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span :class="isEditing?'label_info':''">在类中的索引：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.methodIndex">{{ extendInfo.methodIndex  || '/'}}</span>
          <el-input v-if="isEditing" v-model="extendInfo.methodIndex" placeholder="请输入" size="small" class="edit_input" :class="{ 'is-invalid': isInputInvalid }"/>
        </div>
        <div class="right_content">
          <span :class="isEditing?'label_info':''">请求方式：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.requestType">{{ extendInfo.requestType  || '/'}}</span>
           <el-select v-if="isEditing" v-model="extendInfo.requestType" placeholder="请选择" >
            <el-option  label="POST" value="POST"></el-option>
            <el-option  label="GET" value="GET"></el-option>
          </el-select>
        </div>
        <div class="right_content">
          <span :class="isEditing?'label_info':''">是否模板：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.isTemplate">{{ extendInfo.isTemplate == '1'?'是':'否'}}</span>
          <el-radio v-if="isEditing" v-model="extendInfo.isTemplate" label="1">是</el-radio>
          <el-radio v-if="isEditing" v-model="extendInfo.isTemplate" label="0">否</el-radio>
        </div>
        <div class="right_content">
          <span :class="isEditing?'label_info':''">AI生成代码：</span>
          <span v-if="!isEditing" class="content_info isLong" :title="extendInfo.isCreated">{{ extendInfo.isCreated == '1'?'不禁止':'禁止'}}</span>
           <el-switch
            v-if="isEditing"
            v-model="extendInfo.isCreated"
            active-value="1"
            inactive-value="0"
            >
          </el-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  components: {},
  mixins: [mixin],
  props: {
    isEditing: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      isInputInvalid :false,
      isInputInvalidOne:false,
      bizDomainList: [],
      options: [],
      extendInfo:{},
       sourceList:[
        {
          label: 'application',
          value: 'application'
        },
        {
          label: 'deploy',
          value: 'deploy'
        },
        {
          label: 'domain',
          value: 'domain'
        },
        {
          label: 'facade',
          value: 'facade'
        },
        {
          label: 'infrastructure',
          value: 'infrastructure'
        },
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'sundry',
          value: 'sundry'
        },
        {
          label: 'types',
          value: 'types'
        },
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.queryBizDomainList();
      this.serachLabelOptions('01')
    },

    exportInfo(){
      return this.extendInfo
    },
    async queryS4ExtendInfo(info){
      const res = await this.rpc.s4design.queryS4ExtendInfo({
        svcId: info.svcId,
      })
      res.isTemplate = !!res.isTemplate?res.isTemplate:'0'
      res.isCreated = !!res.isCreated?res.isCreated:'0'
      this.extendInfo = res
    },
    
     async serachLabelOptions(type) {
      const res = await this.rpc.s4design.queryInterfaceAttributeList({
        atrTpCd: type,
      })
      const intefaceAttributeInfoList = res.intefaceAttributeInfoList
      this.options = intefaceAttributeInfoList.map((item) => {
          return {
            label: item.atrNm,
            value: item.atrNm,
          }
        })
    },
    async queryBizDomainList() {
      try {
        const { businessDomainLists } = await this.rpc.s4design.queryBizDomainList();
        this.bizDomainList = businessDomainLists.map(item => ({
          value: item.bizDomainNo,
          label: item.bizDomainName,
        }));
      } catch (error) {
        console.error("接口请求异常:", error);
        this.$message.error("业务域加载失败");
      }
    },
     validateInput(type='') {
      if(type=='0'){
         if (this.extendInfo.svcNm === '') {
          this.isInputInvalidOne = true;
          this.$message.error('请输入');
        }else {
          this.isInputInvalidOne = false;
        }
      }else if(type=='1'){
        if (this.extendInfo.svcCd === '') {
          this.isInputInvalid = true;
          this.$message.error('请输入');
        } else if (!/^[a-zA-Z0-9]+$/.test(this.extendInfo.svcCd)) {
          this.isInputInvalid = true;
          this.$message.error('只允许输入字母、数字组合的编码');
        } else {
          this.isInputInvalid = false;
        }
      }

    }
      
     
  },
  
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_trans_detail_info {
  .label_info{
     width: 180px;
     text-align: right;
    //  &::before {
    //   content: "*";
    //   color: $sec_danger_color;
    //   margin-right: 4px;
    // }
  }
    ::v-deep .el-input__inner{
    height: 32px;
    width: 360px;
  }
  ::v-deep .el-select .el-input .el-select__caret{
    line-height: 32px;
  }
  .content {
    display: flex;
    align-items: flex-start;
    .detail_list_left,
    .detail_list_right {
      width: 49%;
    }

    .left_content,
    .right_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      height: 32px;
      // color: $sec_ft_color;
       color: #606266;
      letter-spacing: 0;
      display: flex;
      align-items: center;
      .content_info {
        color: $pri_ft_color;
        &.isLong{
          width: 300px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.cursor {
          color: $theme_color;
          cursor: pointer;
        }
      }
      .content_versNo {
        background: #f2f8ff;
        color: $theme_color;
      }
      .text_style {
        color: $theme_color;
        font-family: $font_regular;
        font-size: 14px;
        cursor: pointer;
      }
      .status {
        display: inline-block;
        text-align: center;
        line-height: 20px;
        padding: 0px 5px;
        &.unpublish {
          background: #dffff6;
          color: #2ddaac;
        }
        &.publishing {
          background: #fff4e5;
          color: #ff9104;
        }
        &.unchecked {
          background: #ffeaec;
          color: #fe4758;
        }
        &.finished {
          background: #f2f8ff;
          color: #358aff;
        }
      }
      .edit_input {
        width: 200px;
        &.is-invalid{
        ::v-deep .el-input__inner {
            border-color: red;
          }
        }
      }
    }
  }
  .btn_style {
    margin-left: 8px;
    background: #fff;
    color: #358aff;
    border: 0.5px solid #358aff;
    padding: 4px 6px;
    font-size: 12px;
  }
  
}
</style>
