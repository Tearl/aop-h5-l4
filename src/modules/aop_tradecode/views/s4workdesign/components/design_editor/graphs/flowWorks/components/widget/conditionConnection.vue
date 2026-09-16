<template>
    <div v-once class="x6-custom-flowWorks-widget conditionConnection">
        <div>
            <svg>
                <g>
                    <polygon fill="none" stroke="#b2b2b2" stroke-width="1" points="0 19 43 1 86 19 43 37"></polygon>
                    <text font-size="12" xml:space="preserve" fill="#000000" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,43,19)"><tspan dy="0.3em" class="v-line">判断</tspan></text>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
export default {
    name: 'condition-connection'
}
</script>
<style lang="scss" scoped>
.conditionConnection{
    overflow:hidden;
    & > div {
        width: 86px;
        height: 38px;
    }
}
</style>