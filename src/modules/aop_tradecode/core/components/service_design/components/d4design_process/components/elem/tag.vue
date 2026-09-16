<template>
    <div class="tag">
        <!-- :type="colorMap[dataType]" -->
        <el-tag size="mini" :class="tagBg" type="info" effect="plain">{{ tagText }}</el-tag>
    </div>
</template>

<script>
export default {
    props: {
        dataType: "",
    },
    data() {
        return {
            tagTextMap: {
                GN: "功能",
                YM: "页面",
                YS: "要素",
                SJ: "事件",
                JK: "接口",
                FW: "服务",
                XQ: "需求",
                GZ: '规则'
            },
            colorMap: {
                GN: "",
                YM: "success",
                YS: "info",
                SJ: "warning",
                JK: "danger",
                FW: "danger",
                GZ: 'info',
            },
        };
    },
    computed: {
        tagText() {
            return this.tagTextMap[this.dataType] || "";
        },
        tagBg() {
            if(this.dataType=='GN')return 'blue_bg';
            if(this.dataType=='YM')return 'green_bg';
            if(this.dataType=='YS')return 'green_l_bg';
            if(this.dataType=='SJ')return 'orange_bg';
            if(this.dataType=='JK')return 'sky_bg';
            if(this.dataType=='FW')return 'red_l_bg';
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.orange_bg {
    background-color: #ff9104;
    color: #fff4e5;
}
.green_bg {
    background-color: #36d542;
    color: #e5ffe7;
}
.green_l_bg {
    background-color: #8DC63F;
    color: #e5ffe7;
}
.blue_bg {
    background-color: #358aff;
    color: #f2f8ff;
}
.sky_bg {
    background-color: #1CBBB4;
    color: #f2f8ff;
}
.red_l_bg {
    background-color: #fe4758;
    color: #ffeaec;
}
.red_bg {
    background-color: #ff0019;
    color: #ffeaec;
}
</style>
