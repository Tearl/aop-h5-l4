<template>
    <el-dialog
        title="未通过原因"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_submitrecordnotpassdialog"
        :visible.sync="dialogVisible"
        width="720px"
        :close-on-click-modal="false"
    >
        <div class="submit_record_not_pass_content">
            {{checkInfo.marRejectReason}}
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
        },
        checkInfo: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        
    },

    data() {
        return {
            
        };
    },

    created() {
    },

    methods: {
        
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
.inner_cheetah_comps_submitrecordnotpassdialog {
    
}
</style>
<style lang="scss" scoped>
.inner_cheetah_comps_submitrecordnotpassdialog {
    .submit_record_not_pass_content {
        height: 234px;
        border: 1px solid rgba(221,224,228,1);
        padding: 22px 24px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
    }
}
</style>
