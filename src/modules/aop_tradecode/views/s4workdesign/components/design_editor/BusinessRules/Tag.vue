<template>
    <div class="tag">
        <el-tag size="mini" :type="tagType">{{ tagText }}</el-tag>
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
                YM: "页面",
                YS: "要素",
                SJ: "事件",
                JK: "接口",
                FW: "服务",
            },
            tagTypeMap: {
                YM: "",
                YS: "success",
                SJ: "warning",
                JK: "danger",
                FW: "info",
            },
        };
    },
    computed: {
        tagText() {
            return this.tagTextMap[this.dataType] || "";
        },
        tagType() {
          return this.tagTypeMap[this.dataType] || "";
        }
    },
};
</script>
<style scoped>

</style>