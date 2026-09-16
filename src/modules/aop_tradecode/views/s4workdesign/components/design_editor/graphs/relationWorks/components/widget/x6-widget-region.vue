
<template>
    <div class="x6-custom-widget-region">
        <span>泳道(竖)</span>
    </div>
</template>
<script>
export default {
    name: 'x6-widget-region'
}
</script>
<style lang="scss" scoped>
@import '../../var.scss';
.x6-custom-widget-region{
    width: 86px;
    height: 36px;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    border: solid 1px $regionBdColor;
    background-color: $regionBgColor;
    border-radius: $broderRadius;
    overflow: hidden;
    position: relative;
    cursor: move;
    user-select: none;
    span{
        padding-left: 20px;
    }
    &::after{
        content: "";
        position: absolute;
        left: 20px;
        top: 0;
        width: 1px;
        height: 100%;
        background-color: $regionBdColor;
    }
}
</style>