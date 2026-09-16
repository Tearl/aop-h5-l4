<template>
  <div>
    <el-dialog
      title="添加对象属性"
      :visible.sync="visible"
      class="add-attr-dialog"
      width="80%"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="10vh"
      @close="close"
    >
      <div class="title-select" slot="title">
        <el-radio-group v-model="titleActive" size="small">
          <el-radio-button label="1">从业务对象选择</el-radio-button>
          <el-radio-button label="2">从库表对象选择</el-radio-button>
          <el-radio-button label="3">从数据字典选择</el-radio-button>
        </el-radio-group>
      </div>
      <div class="dialog-content">
        <div>
          <FromBusiness
            ref="business"
            :origin="selectedList"
            @changeSingle="changeSingleBusiness"
            @changeAll="changeAllBusiness"
            v-show="titleActive == '1'"
          />
          <FromSysObject
            ref="sysObject"
            :origin="selectedList"
            :ids="sysObjList"
            @changeSingle="changeSingleSysObj"
            @changeAll="changeAllSysObj"
            v-show="titleActive == '2'"
          />
          <FromDict
            ref="dict"
            :origin="selectedList"
            @changeSingle="changeSingleDict"
            @changeAll="changeAllDict"
            v-show="titleActive == '3'"
          />
        </div>
        <div class="selected-list">
          <div class="num">已选择 {{ selectedList.length }} 个：</div>
          <div class="list-block">
            <el-tag
              v-for="tag in selectedList"
              :key="tag.fieldId"
              closable
              size="mini"
              type="info"
              @close="removeTag(tag)"
            >
              {{ tag.attrChiNm }}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

import FromDict from "./AttrGroup/FromDict.vue";
import FromSysObject from "./AttrGroup/FromSysObject.vue";
import FromBusiness from "./AttrGroup/FromBusiness.vue";
export default {
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    sysObjList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    FromSysObject,
    FromDict,
    FromBusiness,
  },
  data() {
    return {
      titleActive: "1",

      selectedList: [],
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },

    confirm() {
      this.$emit("confirm", this.selectedList);
    },

    changeSingleDict(row, type) {
      let _row = {
        attrChiNm: row.fieldName,
        attrEngNm: row.fieldKeyName,
        objAttrId: row.fieldId,
        attrTpCd: row.fieldType,
        required: "",
      };
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, _row], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter(
          (item) => item.attrEngNm != _row.attrEngNm
        );
      }
    },
    changeAllDict(selection, type) {
      let _selection = selection.map((item) => ({
        attrChiNm: item.fieldName,
        attrEngNm: item.fieldKeyName,
        objAttrId: item.fieldId,
        attrTpCd: item.fieldType,
        required: "",
      }));
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, ..._selection], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter((item) =>
          _selection.every((i) => i.attrEngNm != item.attrEngNm)
        );
      }
    },

    changeSingleSysObj(row, type) {
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, row], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter(
          (item) => item.attrEngNm != row.attrEngNm
        );
      }
    },
    changeAllSysObj(selection, type) {
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, ...selection], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter((item) =>
          selection.every((i) => i.attrEngNm != item.attrEngNm)
        );
      }
    },
    changeSingleBusiness(row, type) {
      let _row = {
        attrChiNm: row.dictryName,
        attrEngNm: row.dictryNo,
        objAttrId: row.dictryId,
        attrTpCd: row.dictryType,
        required: "",
      };
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, _row], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter(
          (item) => item.attrEngNm != _row.attrEngNm
        );
      }
    },
    changeAllBusiness(selection, type) {
      console.log('selection', selection, type);
      
      let _selection = selection.map((item) => ({
        attrChiNm: item.dictryName,
        attrEngNm: item.dictryNo,
        objAttrId: item.dictryId,
        attrTpCd: item.dictryType,
        required: "",
      }));
      if (type == "add") {
        let arr = this.uniq([...this.selectedList, ..._selection], "attrEngNm");
        this.selectedList = arr;
      } else {
        this.selectedList = this.selectedList.filter((item) =>
          _selection.every((i) => i.attrEngNm != item.attrEngNm)
        );
      }
    },
    removeTag(item) {
      const row = this.selectedList.filter(
        (i) => i.attrEngNm == item.attrEngNm
      );
      this.selectedList = this.selectedList.filter(
        (i) => i.attrEngNm != item.attrEngNm
      );

      if (row.length) {
        this.$refs.dict.toggleRow(row[0]);
        this.$refs.sysObject.toggleRow(row[0]);
        this.$refs.business.toggleRow(row[0])
      }
    },
    uniq(arr, key) {
      if (arr.length == 0 || !arr) return [];
      const keys = [];
      return arr.filter((item) =>
        keys.indexOf(item[key]) == -1 ? keys.push(item[key]) : false
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.add-attr-dialog {
  /deep/.el-dialog__body {
    padding: 20px !important;
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f5f5fa;
    padding: 12px 20px;
    background: #fafafc;

    .el-dialog__title {
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
      font-family: PingFangSC-Medium;
    }

    .el-dialog__headerbtn {
      top: 14px;
    }
  }

  .title-select {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .dialog-content {
    // height: 600px;
    overflow: auto;

    .selected-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      .num {
        font-weight: bold;
      }
      .list-block {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        flex: 1;
        .el-tag {
          margin-right: 6px;
          margin-bottom: 6px;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }
  .btn-group {
    text-align: center;
  }
  /deep/.el-pagination {
    padding: 0 !important;
    margin: 12px 0;
    text-align: right;
    .btn-next {
      margin-right: 0;
    }
  }
}
</style>

