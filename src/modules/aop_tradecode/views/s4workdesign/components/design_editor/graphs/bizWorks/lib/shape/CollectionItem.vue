
<template>
    <div class="x6-graph-custom-bizWorks-shape">
        <div cass="x6-graph-custom-bizWorks-shape-body">
            <div class="x6-graph-custom-bizWorks-shape-header x6-graph-custom-bizWorks-shape-layout">
                <p>
                    <label>{{options.objName}}</label>
                    <span>({{options.objCode}})</span>
                </p>
                <label @click.stop="toggleExpand">
                    <icon-container v-if="!expand" name="#icon-arrow-down" fill="white" />
                    <icon-container v-if="expand" name="#icon-arrow-up" fill="white" />
                </label>
            </div>
            <div class="x6-graph-custom-bizWorks-shape-list">
                <div class="x6-graph-custom-bizWorks-shape-main" ref="main">
                    <div class="x6-graph-custom-bizWorks-shape-empty" v-if="!desc">
                        <div class="x6-graph-custom-bizWorks-shape-layout">
                            <p><span>暂未添加内容</span></p>
                        </div>
                    </div>
                    <div class="x6-graph-custom-bizWorks-shape-desc" v-if="(desc && expand == false)">
                        <div class="x6-graph-custom-bizWorks-shape-layout">
                            <p><label>{{desc}}</label></p>
                        </div>
                    </div>
                    <template v-if="expand">
                        <div class="x6-graph-custom-bizWorks-shape-attr" v-if="options.attributeInfos.length">
                            <div class="x6-graph-custom-bizWorks-shape-layout" v-for="(v, k) in options.attributeInfos" :key="k">
                                <p>
                                    <label>{{v.dictryName}}</label>
                                    <span>({{v.dictryNo}})</span>
                                </p>
                                <span>{{v.dictryType}}</span>
                            </div>
                        </div>
                        <!-- <div class="x6-graph-custom-bizWorks-shape-action" v-if="options.attr.length">
                            <div class="x6-graph-custom-bizWorks-shape-layout" v-for="v in options.action" :key="v.code">
                                <p>
                                    <label>{{v.name}}</label>
                                    <span>({{v.code}})</span>
                                </p>
                            </div>
                        </div> -->
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import iconContainer from '../../../skeleton/components/iconContainer'
import mixins from './mixins'
export default {
    name: 'ConnectionObject',
    mixins,
    components: {
        iconContainer
    }
}
</script>