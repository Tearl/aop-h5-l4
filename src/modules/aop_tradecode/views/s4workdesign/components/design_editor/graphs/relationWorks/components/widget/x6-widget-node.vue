<template>
    <div class="x6-relation-custom-widget-node" :class="'level' + level">
        <span>{{ level | formatLevelClass }}</span>
    </div>
</template>
<script>
export default {
    filters: {
        formatLevelClass(value){
            let maps = {
                '1': '分类',
                '2': '产品',
                '3': '活动',
                '4': '步骤',
                '5': '操作'
            }
            return maps[value] || value
        }
    },
    props: {
        level: {
            type: String,
            default: '1'
        }
    }
}
</script>
<style lang="scss">
@import '../../var.scss';
.x6-relation-custom-widget-node{
    width: 86px;
    height: 36px;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    border-radius: $broderRadius;
    overflow: hidden;
    cursor: move;
    user-select: none;
    &.level1{
        border: solid 1px $level1;
        box-sizing: border-box;
        background-color: $level1Inner;
        color: $level1;
    }
    &.level2{
        border: solid 1px $level2;
        box-sizing: border-box;
        background-color: $level2Inner;
        color: $level2;
    }
    &.level3{
        border: solid 1px $level3;
        box-sizing: border-box;
        background-color: $level3Inner;
        color: $level3;
    }
    &.level4{
        border: solid 1px $level4;
        box-sizing: border-box;
        background-color: $level4Inner;
        color: $level4;
    }
    &.level5{
        border: solid 1px $level5;
        box-sizing: border-box;
        background-color: $level5Inner;
        color: #333;
    }
}
</style>