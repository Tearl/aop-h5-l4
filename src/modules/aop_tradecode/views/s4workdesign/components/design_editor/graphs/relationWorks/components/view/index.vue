<template>
	<div class="x6-graph-custom-relationWorks-container" style="width: 100%; height: 100%">
		<div ref="view" class="x6-custom-relationWorks-view"></div>
		<multistageDialog ref="dialog" />
	</div>
</template>
<script>
import props from "./props";
import View from "../../lib";
import multistageDialog from '../multistageDialog'
export default {
	props,
	components: {
		multistageDialog
	},
	mounted() {
		this.$nextTick(() => {
			this.view = new View(this, {
				container: this.$refs.view,
			}, this.$props)
			this.$emit('ready')
		})
		if(this.eventBus){
			this.eventBus.$on("aMsg", (object) => {
				const { shape, data } = object;
				console.log("this.eventBus");
				this.$refs.dialog.show(shape, data);
			});
		}
	},
	methods: {
		getNodesData(){
            return this.view.graph.getNodes().map(node => node.data)
        },
		dispose() {
			this.view.graph.dispose();
		},
		render(metas) {
			if(this.embed){
				return this.view.render.render(metas)
			}
			setTimeout(() => {
				this.view.render.render(metas)
			}, 30)
		},
	},
};
</script>
<style lang="scss">
@import "./style.scss";
.x6-custom-relationWorks-view {
	width: 100% !important;
	height: 100% !important;
}
</style>