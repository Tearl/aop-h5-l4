<template>
    <div class="aop_developer_comps_message">
        <div class="messageBox">
            <p><i class="el-icon-info tag"></i>{{ info.msgCont }}</p>
            <div class="flex_btns">
                <el-button v-if="tabType=='1'" type="text" size="mini" @click="close('1',info)">确定</el-button>
                <el-button v-if="tabType=='2'" type="text" size="mini" @click="close('2',info)">我知道了</el-button>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {},
        },
        tabType: {
            type: String,
            default: () => "",
        }
    },
    data() {
        return {
        };
    },
    methods: {
        close(e,info) {
            this.$emit("closeMessage", e,info);
        },
    },
    watch: {
        info(o) {
            console.log(o,'101')
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_message {
    background-color: $base_white;
    min-width: 380px;
    z-index: 2004;
    position: fixed;
    top: 20px;
    .messageBox{
        min-width: 380px;
        box-sizing: border-box;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: #EBEEF5;
        position: fixed;
        left: 50%;
        top: 20px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        background-color: #edf2fc;
        -webkit-transition: opacity 0.3s, top 0.4s, -webkit-transform .4s;
        transition: opacity 0.3s, top 0.4s, -webkit-transform .4s;
        transition: opacity 0.3s, transform .4s, top 0.4s;
        transition: opacity 0.3s, transform .4s, top 0.4s, -webkit-transform .4s;
        overflow: hidden;
        padding: 8px 8px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        p{
            color:#909399;
            .tag{
                color: #999999;
                margin-right:5px;
                margin-left:5px;
            }
        }
    }
    .flex_btns{
        position: absolute;
        top: 50%;
        right: 15px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        cursor: pointer;
        color: #C0C4CC;
        font-size: 16px;
    }
}
</style>
