<template>
    <el-dialog
        title="查看用户故事"
        :append-to-body="true"
        class="inner_cheetah_common_dialog inner_cheetah_comps_servicedetaildialog"
        :visible.sync="dialogVisible"
        width="1000px"
        :close-on-click-modal="false"
    >
        <div class="submit_record_not_pass_content">
            <div class="service_info">
                <div class="info">
                    <div class="info_cell">
                        <span class="label">用户故事标题：</span>
                         <span class="label_value">{{storyInfo.userStoryTtl}}</span>
                    </div>
                </div>
            </div>
            <div class="cut_line"></div>

            <div class="other_block">
                <span class="label">用户故事：</span>
                <div class="value_block">
                    <span>{{storyInfo.userStory}}</span>
                    <!-- <span>2.客户需要选择转出账户信息、转出金额、转出方式、转入账户信息、转账备注附言等信息。</span>
                    <span>3.用户使用安全工具完成安全验证。</span> -->
                </div>
            </div>
            <div class="cut_line"></div>
            <div class="other_block">
                <span class="label">前置条件：</span>
                <div class="value_block">
                    <span>{{storyInfo.frntCdtn}}</span>
                    <!-- <span>2.客户需要选择转出账户信息、转出金额、转出方式、转入账户信息、转账备注附言等信息。</span>
                    <span>3.用户使用安全工具完成安全验证。</span> -->
                </div>
            </div>
            <div class="cut_line"></div>
            
            <div class="step">
                <h1>用例步骤</h1>
                <el-table class="common_table" :data="storyInfo.caseStepList">
                    <el-table-column label="序号" prop="stepSeqNo"></el-table-column>
                    <el-table-column label="步骤" prop="stepDesc"></el-table-column>
                    <el-table-column label="预期" prop="expc">
                    </el-table-column>
                </el-table>
            </div>
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
        params: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        
    },

    data() {
        return {
            storyInfo: {}
        };
    },

    mounted() {
        this.queryUserStoryInfo()
    },

    methods: {
        queryUserStoryInfo() {
            this.rpc.d1workspace.queryUserStoryInfo({
                authorizationId: this.params.authorizationId,
                userStoryId: this.params.userStoryId
            }).then(res => {
                this.storyInfo = res || {}
            })
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
.inner_cheetah_comps_servicedetaildialog {
    
}
</style>
<style lang="scss">
.inner_cheetah_comps_servicedetaildialog {
    .submit_record_not_pass_content {
        
        .service_info {
           

            .info {
                display: flex;
                flex-wrap: wrap;
                padding: 8px 0;
                .info_cell {
                    width: 50%;
                    margin-bottom: 16px;

                    .label {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #999999;
                    }
                    .label_value {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #333330;
                    }
                }
            }
            
        }

        .cut_line {
            width: 952px;
            height: 1px;
            background: #E7E7EE;
        }

        .other_block {
            display: flex;
            justify-content: space-between;
            margin-top: 22px;
            margin-bottom: 22px;

            .label {
                display: block;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #999999;
                
            }
            .value_block {
                background: #F6F6F6;
                border-radius: 2px;
                width: 860px;
                padding: 10px 16px;
                span {
                    display: block;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333330;
                    margin-bottom: 4px;
                }
            }
            .underline {
                span {
                    color: #358AFF;
                    text-decoration: underline;
                }
            }
        }

        .step {
            h1 {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #111111;
                margin: 23px 0 16px 0;
            }
        }

        .common_table {
            &.el-table .el-table__body tr{
                cursor: pointer;
            }

            &.el-table th{
                background: #FAFAFC;
                font-size: 14px;
                color: #333333;
            }
            
            &.el-table th .cell{
                padding-left: 24px;
                line-height: 23px;
            }

            &.el-table td{
                padding: 11px 0;
                font-size: 14px;
                color: #666666;
                position: relative;
            }

            &.el-table td .cell{
                padding-left: 24px;
                line-height: 23px;
            }
            .blue_span {
                color: #3489FE;
                cursor: pointer;
            }
        }
    }
    
}
</style>
