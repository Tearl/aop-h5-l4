<template>
    <el-dialog
        title="验收不通过原因"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_checkNoPassDialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <div class="submit_record_not_pass_content">
            <el-input v-model="textareaValue" type="textarea" placeholder="请输入不通过原因" :rows="8">

            </el-input>
        </div>
        <div class="inner_cheetah_common_btns_area" slot="footer">
            <el-button @click="dialogVisible = false" :disabled="buttonDisabled">取 消</el-button>
            <el-button type="primary" @click="submitForm" :disabled="buttonDisabled">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],

    props: {
        value: {
            type: Boolean,
            default: false,
        }
    },

    computed: {
        
    },

    data() {
        return {
            buttonDisabled: false,
            textareaValue: ''
        };
    },

    created() {
    },

    methods: {
        submitForm() {
            if(!this.textareaValue) {
                this.$message.error('请输入不通过原因！')
            } else {
                this.$emit('output', this.textareaValue)
            }
        }
    },

    computed: {
        

        dialogVisible: {
            get() {
                return this.value;
            },

            set(val) {
                this.$emit("input", val);
            },
        },
    },
};
</script>
<style lang="scss">
@import "../../assets/public.scss";
</style>
<style lang="scss">
.inner_cheetah_comps_checkNoPassDialog {
    
}
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_checkNoPassDialog {
    .submit_record_not_pass_content {
        // height: 234px;
        // border: 1px solid rgba(221,224,228,1);
        // padding: 22px 24px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;

        .el-textarea {
            height: 180px;
        }
    }
}
</style>
