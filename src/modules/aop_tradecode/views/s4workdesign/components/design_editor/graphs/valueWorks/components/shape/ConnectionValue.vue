
<template>
    <div class="valueWorks-shape">
        <i>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="88" height="44" viewBox="0 0 400 200">
                <g>
                    <rect fill="none" stroke="none" width="400" height="200"></rect>
                    <polygon style="fill:#1a77d2;stroke:none;stroke-width:4" points="0,10 290,10 390,100 290,190 0,190 100,100"></polygon>
                    <text font-size="60" font-style="normal" xml:space="preserve" fill="#fff" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,200,100)"><tspan dy="0.3em" class="v-line">分段</tspan></text>
                </g>
            </svg>
        </i>
    </div>
</template>
<script>
export default {
    name: 'MiniCollectionValue'
}
</script>
<style lang="scss" scoped>
.valueWorks-shape{
    i{
        display: block;
        svg{
            vertical-align: top;
        }
    }
}
</style>