<template>
  <div class="aop_tradecode_comps_trans_detail_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content" :style="isEditing?'margin-left: 4px;':''">
          <span :class="isEditing?'label_info':''">接口名称：</span>
          <span v-if="!isEditing" class="content_info">{{ detailInfo.svcNm || '/' }}</span>
          <el-input v-if="isEditing" v-model="detailInfo.svcNm" placeholder="请输入接口名称" size="small" class="edit_input" @blur="validateInput('0')" :class="{ 'is-invalid': isInputInvalidOne}"/>
        </div>
        <div class="right_content">
          <span>归属业务域：</span>
          <span v-if="!isEditing" class="content_info">
            {{ detailInfo.beltLineNm || '/' }}
          </span>
          <el-select
            v-if="isEditing"
            v-model="detailInfo.beltLine"
            filterable
            clearable
            disabled
            size="small"
            placeholder="请选择业务域"
            style="width: 300px;"
          >
            <el-option
              v-for="(item, index) in bizDomainList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
         <div class="left_content" v-if="!isEditing">
          <span>标签：</span>
          <span class="content_info">{{ aiLabel || '/' }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span :class="isEditing?'label_info':''">接口编码：</span>
          <span v-if="!isEditing" class="content_info">{{ detailInfo.svcCd  || '/'}}</span>
          <el-input v-if="isEditing" v-model="detailInfo.svcCd" placeholder="请输入接口编码" size="small" class="edit_input" @blur="validateInput('1')" :class="{ 'is-invalid': isInputInvalid }"/>
        </div>
        <div class="left_content" :style="isEditing?'margin-left: 10px;':''">
          <span>接口类型：</span>
          <span class="content_info" v-if="!isEditing" >{{ detailInfo.aiClass || '/' }}</span>
           <el-select
            v-if="isEditing"
            v-model="detailInfo.aiClass"
            clearable
            size="small"
            placeholder="请选择业务域"
            style="width: 300px;"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="left_content" v-if="!isEditing">
          <span>创建人：</span>
          <span class="content_info">{{ detailInfo.crtNm || '/'}}</span>
        </div>
        
      </div>
       <div class="detail_list_right">
        <div class="right_content">
          <span>接口编号：</span>
          <span v-if="!isEditing" class="content_info">{{ detailInfo.svcSeq || '/'}}</span>
          <el-input v-if="isEditing" disabled v-model="detailInfo.svcSeq" placeholder="请输入接口编号" size="small" class="edit_input" />
        </div>
         <div class="right_content" v-if="!isEditing">
          <span>来源功能：</span>
          <span class="content_info">{{ detailInfo.srcFnctNm || '/'}}</span>
        </div>
        <div class="right_content" v-if="!isEditing">
          <span>创建时间：</span>
          <span class="content_info">{{ detailInfo.crtTm  || '/'}}</span>
        </div>
      </div>
    </div>
    <div class="detail_list_bottom">
      <div class="bottom_content" :style="isEditing?'margin-left: 10px;':''">
        <span>接口描述：</span>
        <span v-if="!isEditing" class="content_info">{{ detailInfo.svcDesc || '/' }}</span>
        <el-input v-if="isEditing" v-model="detailInfo.svcDesc" type="textarea" placeholder="请输入接口描述" rows="4" class="edit_textarea" />
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
    detailInfo: {
      type: Object,
      default: () => {}
    },
    uploadFlag: {
      type: Boolean,
      default: () => false
    },
    noTrans: {
      type: Boolean,
      default: () => false
    },
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
    }
  },
  created() {
      this.queryBizDomainList();
      this.serachLabelOptions('01')
  },
  methods: {
     async serachLabelOptions(type) {
      const res = await this.rpc.newEditor.queryInterfaceAttributeList({
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
        const { businessDomainLists } = await this.rpc.newEditor.queryBizDomainList();
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
         if (this.detailInfo.svcNm === '') {
          this.isInputInvalidOne = true;
          this.$message.error('请输入接口名称');
        }else {
          this.isInputInvalidOne = false;
        }
      }else if(type=='1'){
        if (this.detailInfo.svcCd === '') {
          this.isInputInvalid = true;
          this.$message.error('请输入接口编码');
        } else if (!/^[a-zA-Z0-9]+$/.test(this.detailInfo.svcCd)) {
          this.isInputInvalid = true;
          this.$message.error('只允许输入字母、数字组合的编码');
        } else {
          this.isInputInvalid = false;
        }
      }

    }
      
     
  },
  computed: {
    aiLabel() {
      const list = this.detailInfo.aiLabel?.split('&&')
      if (!list[0]) {
        return ''
      }
      return list?.join('、')
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_trans_detail_info {
  .label_info{
     &::before {
      content: "*";
      color: $sec_danger_color;
      margin-right: 4px;
    }
  }
  .content {
    display: flex;
    align-items: flex-start;
    .detail_list_left,
    .detail_list_right {
      width: 33%;
    }

    .left_content,
    .right_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      .content_info {
        color: $pri_ft_color;
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
        width: 300px;
        &.is-invalid{
        ::v-deep .el-input__inner {
            border-color: red;
          }
        }
      }
    }
  }
  .left_content {
    margin-right: 300px;
    width: 100%;
  }
  .btn_style {
    margin-left: 8px;
    background: #fff;
    color: #358aff;
    border: 0.5px solid #358aff;
    padding: 4px 6px;
    font-size: 12px;
  }
  .detail_list_bottom {
    margin-top: 24px;
    .bottom_content {
      border-top: 1px solid #e7e7ee;
      color: $sec_ft_color;
      padding: 16px 0;
      display: flex;
      .content_info {
        display: block;
        color: #333330;
        line-height: 1;
        margin-top: 4px;
      }
      span {
        min-width: 74px;
      }
      .desc {
        color: #333;
      }
      /deep/ .el-textarea__inner {
        height: 80px;
        margin-top: -5px;
        border-radius: 2px;
      }
      .edit_textarea {
        width: 100%;
        margin-top: 5px;
      }
    }
  }
  
}
</style>
