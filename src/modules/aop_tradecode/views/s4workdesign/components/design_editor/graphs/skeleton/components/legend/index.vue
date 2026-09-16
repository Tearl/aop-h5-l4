
<template>
    <div class="x6-graph-custom-works-legend" style="inset: 0px 0px auto auto;">
        <div class="bwf-m-designer-do-legend">
            <div class="bwf-m-designer-do-legend-title">
                <span>图例</span>
                <span @click="collapse">
                    <icon-container v-show="!expand" name="#icon-view-collapse" style="width:16px;height:16px;line-height:16px;cursor: pointer;" />
                    <icon-container v-show="expand" name="#icon-view-expand" style="width:16px;height:16px;line-height:16px;cursor: pointer;" />
                </span>
            </div>
            <div class="bwf-m-designer-do-legend-content" v-if="expand">
                <div class="bwf-m-designer-do-legend-content-block-wrap">
                    <!-- <div class="bwf-m-designer-do-legend-content-block"><span class="bwf-m-designer-do-legend-content-block-rect bwf-m-designer-do-legend-content-block-root">&nbsp;</span><span>聚合根</span></div> -->
                    <div class="bwf-m-designer-do-legend-content-block"><span class="bwf-m-designer-do-legend-content-block-rect bwf-m-designer-do-legend-content-block-inst">&nbsp;</span><span>实体对象</span></div>
                    <div class="bwf-m-designer-do-legend-content-block"><span class="bwf-m-designer-do-legend-content-block-rect bwf-m-designer-do-legend-content-block-value">&nbsp;</span><span>值对象</span></div>
                    <!-- <div class="bwf-m-designer-do-legend-content-block"><span class="bwf-m-designer-do-legend-content-block-rect bwf-m-designer-do-legend-content-block-aggregate">&nbsp;</span><span>聚合</span></div> -->
                </div>
                <div class="legend-line-wrap">
                    <div class="legend-content-line">
                        <div class="relationship">
                            <div class="line-svg-wrap">
                                <svg class="line-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="12px"><path d="M0 6 L500 6"></path></svg>
                            </div>
                            <svg class="shape-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px"><path class="bwf-shared-obj-demo-relationship-arrow-p bwf-shared-obj-demo-relationship-arrow-p-fill" d="M0 6 L9 1 L18 6 L9 11 Z"></path></svg>
                        </div>
                        <span>组合</span>
                    </div>
                    <div class="legend-content-line">
                        <div class="relationship">
                            <div class="line-svg-wrap">
                                <svg class="line-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="12px"><path d="M0 6 L500 6"></path></svg>
                            </div>
                            <svg class="shape-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px"><path class="bwf-shared-obj-demo-relationship-arrow-p" d="M0 6 L9 1 L18 6 L9 11 Z" stroke="#000" fill="#fff"></path></svg>
                        </div>
                        <span>聚合</span>
                    </div>
                    <div class="legend-content-line">
                        <div class="relationship">
                            <div class="line-svg-wrap">
                                <svg class="line-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="12px"><path d="M0 6 L500 6"></path></svg>
                            </div>
                            <svg class="shape-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px">
                                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L0 6"></path>
                                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L8 2" stroke="#000" stroke-width="2" ></path>
                                <path class="bwf-shared-obj-demo-relationship-arrow-p" d="M18 6 L8 10" stroke="#000" stroke-width="2" ></path>
                            </svg>
                        </div>
                        <span>关联</span>
                    </div>
                    <div class="legend-content-line">
                        <div class="relationship">
                            <div class="line-svg-wrap">
                                <svg class="line-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="12px"><path d="M0 6 L500 6"></path></svg>
                            </div>
                            <svg class="shape-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="12px"><path class="bwf-shared-obj-demo-relationship-arrow-p" d="M0 6 L10 6 L10 2 L18 6 L10 10 L10 6 Z" stroke="#000" fill="#fff"></path></svg>
                        </div>
                        <span>继承</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import iconContainer from '../iconContainer'
export default {
    components: {
        iconContainer
    },
    data(){
        return {
            expand: true
        }
    },
    methods: {
        collapse(){
            this.expand = !this.expand
        }
    }
}
</script>