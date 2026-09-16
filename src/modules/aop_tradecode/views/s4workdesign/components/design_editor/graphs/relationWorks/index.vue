<template>
	<div class="aop-graph-relationWorks">
		<graph-header :btns="btns" @confirm="saveBatchObject">
			<template v-slot:left>
				<span>{{name}}</span>
				<span class="aop-graph-relationWorks-header-tag" :class="'level' + level">{{ level | formatLevelText }}</span>
			</template>
		</graph-header>
		<graph-skeleton>
			<template v-slot:sider>
				<graph-sider :showSide.sync="showSide" :tabs="tabs" @tabChange="tabChange">
					<template slot-scope="{ data }">
						<widget-wrap v-show="data.value == '00'" :level="level" :preview="preview"></widget-wrap>
						<graph-model
							v-show="data.value == '01'"
							:showEdit="!preview"
							:list="nodeList"
							@itemSelect="itemSelect"
							@itemEdit="itemEdit"
						></graph-model>
					</template>
				</graph-sider>
			</template>
			<template v-slot:header>
				<graph-shortcut ref="shortcut" @iconClick="iconClick"></graph-shortcut>
			</template>
			<template>
				<graph-scale></graph-scale>
				<graph-view ref="editor" :preview="preview"></graph-view>
			</template>
		</graph-skeleton>
	</div>
</template>
<script>
import widgetWrap from './components/widget/index.vue'
import graphSkeleton from '../skeleton'
import graphHeader from '../skeleton/components/header'
import graphSider from '../skeleton/components/sider'
import graphModel from '../skeleton/components/model'
import graphShortcut from '../skeleton/components/shortcut'
import graphScale from '../skeleton/components/scale'
import graphView from './components/view'
import mixin from '@m/core/mixin'
export default {
	mixins: [mixin],
	components: {
		widgetWrap,
		graphSkeleton,
		graphHeader,
		graphSider,
		graphShortcut,
		graphScale,
		graphView,
		graphModel
	},
	filters: {
		formatLevelText(value){
			let maps = {
				'1': '一',
				'2': '二',
				'3': '三',
				'4': '四',
				'5': '五'
			}
			return maps[value] + '级流程'
		}
	},
	provide(){
		return {
			getEditor: () => {
				return this.$refs.editor
			}
		}
	},
	data() {
		const { level = "1", action } = this.$route.query;
		return {
			level,
			preview: action == 'preview',
			name: '流程设计',
			btns: [{ label: '保存', value: 'save' }],
			showSide: true,
			tabs: [
				{label:'领域模型',value:'00'},
				{label:'流程节点',value:'01'}
			],
			nodeList: [],
		};
	},
	mounted(){
		this.queryRelationChart()
		if(!this.preview){
			this.$nextTick(() => {
				let graph = this.$refs.editor.view.graph
				graph.on('node:changed', () => {
					this.updateNodeModel()
				})
				graph.on('history:change', e => {
					let undo = graph.canUndo()
					let redo = graph.canRedo()
					let comand = []
					let uncomand = []
					if(undo){
						comand.push('undo')
						this.updateNodeModel()
					}else{
						uncomand.push('undo')
						this.updateNodeModel()
					}
					if(redo){
						comand.push('redo')
						this.updateNodeModel()
					}else{
						uncomand.push('redo')
						this.updateNodeModel()
					}
					if(comand.length){
						this.$refs.shortcut.cleanDisabledIcon(comand)
					}
					if(uncomand.length){
						this.$refs.shortcut.setDisabledIcon(uncomand)
					}
				})
				graph.on('shortcut:change', (options) => {
					let { action, value } = options
					this.$refs.shortcut[action](value)
				})
				graph.on('shortcut:action', (options) => {
					this.iconClick(options.key)
				})
			})
		}else{
			this.btns = []
		}
	},
	methods: {
		queryRelationChart() {
			let { belongId, fcType } = this.$route.query
			this.rpc.graph.queryRelationChart({
				fcId: belongId, fcType
			}).then(res => {
				this.$refs.editor.render({
					flowNodeInfos: res.flowNodeInfos,
					laneNodeInfos: res.laneNodeInfos,
					nodeRels: res.nodeRels
				})
			})
		},
		async saveBatchObject(){
			let options = await this.$refs.editor.view.render.toJSON()
			let { belongId, taskId, fcType } = this.$route.query
			options.flowNodeInfos.map((item) => {
				const vouchers = item.vouchers
				const objects = item.objects
				const rules = item.rules
				item.vouchers = vouchers.map((v) => v.voId || v)
				item.objects = objects.map((v) => v.objId || v)
				item.rules = rules.map((v) => v.ruleDesc || v)
			})
			return this.rpc.graph.saveRelationChart({
				belongId, taskId, fcType,
				...options
			}).then(res => {
				this.$notify({
					title: '成功',
					message: '保存成功！',
					duration: 2000,
					type: 'success'
				})
			})

		},
		queryRelationChartList(nodesLen) {
            return this.rpc.graph.queryRelationChartList({ count: nodesLen })
        },
		itemSelect(options){
			let editor = this.$refs.editor
			let node = editor.view.graph.getCellById(options.id)
			editor.view.graph.centerCell(node).resetSelection(node)
			node.toFront()
		},
		itemEdit(options){
			let editor = this.$refs.editor
			let node = editor.view.graph.getCellById(options.id)
			editor.view.node.validate(node)
		},
		iconClick(key){
			let editor = this.$refs.editor
			if(key == 'move'){
				editor.view.graph.toggleSelection(false).togglePanning(true)
			}

			if(key == 'select'){
				editor.view.graph.toggleSelection(true).togglePanning(false)
			}

			if(key == 'undo'){
				editor.view.graph.cleanSelection().undo()
			}

			if(key == 'redo'){
				editor.view.graph.cleanSelection().redo()
			}

			if(key == 'copy'){
				editor.view.node.copy()
				this.$refs.shortcut.cleanDisabledIcon(['paste'])
			}

			if(key == 'paste'){
				editor.view.node.paste(this.queryRelationChartList)
			}

			if(key == 'del'){
				let nodes = editor.view.graph.getSelectedCells()
				editor.view.node.batchRemove(nodes)
			}
		},
		tabChange(options){
			if(options.value == '01'){
				this.updateNodeModel()
			}
		},
		updateNodeModel(){
			if(this.showSide){
				let nodes = this.$refs.editor.view.graph.getNodes()
				let datas = nodes.map(node => {
					let objName = node.data.fnName
					let objCode = node.data.fnCode
					return {
						objName,
						objCode,
						id: node.id,
						...node.data
					}
				})
				this.nodeList = Object.freeze(datas)
			}
		}
	}
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
