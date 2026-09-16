<template>
    <el-dialog
        title="查看需求评估"
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
                        <span class="label">需求评估时间：</span>
                         <span class="label_value">{{demandInfo.rqmEvltTm}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">需求评估人：</span>
                         <span class="label_value">{{demandInfo.rqmEvltr}}</span>
                    </div>
                     <div class="info_cell">
                        <span class="label">匹配领域：</span>
                         <span class="label_value">{{matchDomainMap[demandInfo.matchDomain]}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">匹配需求级别：</span>
                         <span class="label_value">{{leaveMap[demandInfo.demandLevel]}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">对标竞品：</span>
                         <span class="label_value">{{demandInfo.bechmkgCoptiPrdc}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">对标模块：</span>
                         <span class="label_value">{{demandInfo.bechmkgMdu}}</span>
                    </div>
                    <div class="info_cell">
                        <span class="label">预计响应时间：</span>
                         <span class="label_value">{{demandInfo.estConclusion}}</span>
                    </div>
                </div>
            </div>
            <div class="cut_line"></div>

            <div class="other_block">
                <span class="label">客户关注点：</span>
                <div class="value_block">
                    <span>{{demandInfo.cstFocus}}</span>
                    <!-- <span>2、交互体验</span>
                    <span>3、业务流程简化</span> -->
                </div>
            </div>
            <div class="cut_line"></div>
            <div class="other_block">
                <span class="label">评估要点：</span>
                <div class="value_block">
                    <span>{{demandInfo.evalPoint}}</span>
                    <!-- <span>2、交互体验</span>
                    <span>3、业务流程简化</span> -->
                </div>
            </div>
            <div class="cut_line"></div>
            <div class="other_block">
                <span class="label">评估附件：</span>
                <div class="value_block underline">

                    <a :href="transformDownUrl(item.path)" v-for="item in demandInfo.uploadFileList" :key="item">{{item.originalFilename}}</a>
                    <!-- <span>账户体系.pdf</span>
                    <span>交互体验.pptx</span> -->
                </div>
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
            demandInfo: {},
            leaveMap: {
                '0': '应用',
                '1': '模块'
            },
            matchDomainMap: {
                '0': '零售',
                '1': '企业',
                '2': '营销'
            }
        };
    },

    mounted() {
        this.queryDemandAccessInfo()
    },

    methods: {

        transformDownUrl(url){
            if(url){
                return this.$replaceUrl(url)
            }
            return ''
        },

        queryDemandAccessInfo() {
            this.rpc.d1workspace.queryDemandVouchInfo({
                authorizationId: this.params.authorizationId,
                rqmEvltNo: this.params.rqmEvltNo
            }).then(res => {
                this.demandInfo = res || {}
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
                a {
                    color: #358AFF;
                    text-decoration: underline;
                    cursor: pointer;
                    display: block;
                }
            }
        }
    }
    
}
</style>
