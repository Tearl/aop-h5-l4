<template>
	<div class="aop-graph-bizWorks">
		<graph-header :label="label" :btns="btns" @confirm="saveBatchObject"></graph-header>
		<graph-skeleton>
			<template v-slot:sider>
				<graph-sider :showSide.sync="showSide">
					<graph-model :showEdit="!editorOptions.preview" :list="nodeList" @itemSelect="itemSelect" @itemEdit="itemEdit"></graph-model>
				</graph-sider>
			</template>
			<template v-slot:header>
				<graph-shortcut ref="shortcut" :excludeIcons="excludeIcons" @iconClick="iconClick"></graph-shortcut>
			</template>
			<template>
				<graph-legend></graph-legend>
				<graph-scale></graph-scale>
				<graph-context-menu ref="contextMenu"></graph-context-menu>
				<graph-view ref="editor" :options="editorOptions"></graph-view>
			</template>
		</graph-skeleton>
		<graphs-dialog ref="graphsDialog" />
	</div>
</template>
<script>
import graphSkeleton from '../skeleton'
import graphHeader from '../skeleton/components/header'
import graphSider from '../skeleton/components/sider'
import graphShortcut from '../skeleton/components/shortcut'
import graphScale from '../skeleton/components/scale'
import graphLegend from '../skeleton/components/legend'
import graphModel from '../skeleton/components/model'
import graphContextMenu from './components/contextMenu'
import graphView from './components/view'
import mixin from '@m/core/mixin'
import graphsDialog from "./components/detail_tabs/graphsDialog.vue"
export default {
	mixins: [mixin],
	components: {
		graphSkeleton,
		graphHeader,
		graphSider,
		graphShortcut,
		graphScale,
		graphLegend,
		graphModel,
		graphContextMenu,
		graphView,
		graphsDialog
	},
	data(){
		let { action } = this.$route.query
		return {
			label: '对象关系',
			btns: [{ label: '保存', value: 'save' }],
			showSide: false,
			nodeList: [],
			excludeIcons: ['del'],
			editorOptions: {
				preview: action == 'preview'
			}
		}
	},
	provide(){
		return {
			getEditor: () => {
				return this.$refs.editor
			},
			getDialog: () => {
				return this.$refs.graphsDialog
			},
			getContextMenu: () => {
				return this.$refs.contextMenu
			}
		}
	},
	mounted(){
		this.getBizObjectList()
		if(!this.editorOptions.preview){
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
					}else{
						uncomand.push('undo')
					}
					if(redo){
						comand.push('redo')
					}else{
						uncomand.push('redo')
					}
					if(comand.length){
						this.$refs.shortcut.cleanDisabledIcon(comand)
					}
					if(uncomand.length){
						this.$refs.shortcut.setDisabledIcon(uncomand)
					}
				})
			})
		}else{
			this.btns = []
		}
	},
	methods: {
		async getBizObjectList() {
			let { baiId: taskId, fnId, channel, assetId, objList,designRouter } = this.$route.query
			let objIdList = window.sessionStorage.getItem("objIdList")
			let query = {
				taskId,
				channel,
				fnId,
				assetId,
				objList: objList ? JSON.parse(objIdList) : [],
			}
			  if (designRouter == "aop_l5design") {

			} else {
				let res = await this.rpc.graph.getBizObjectList(query);
				this.$refs.editor.render(res.bizObjectLists);
			}
		},
		async saveBatchObject() {

			let picture = await this.$refs.editor.view.render.toPicture()
			let { baiId: taskId, fnId, channel, assetId,designRouter } = this.$route.query
			let query = {
				taskId, fnId, channel, assetId
			}
			let bizObjectLists = this.$refs.editor.getNodesData()
			 if (designRouter == 'aop_l5design') {
                    //对象关系编辑器兼容自有L5研发

            } else{
				this.rpc.graph.saveBatchObject({ ...query, picture, bizObjectLists }).then(res => {
					this.$notify({
						title: '成功',
						message: '保存成功！',
						duration: 2000,
						type: 'success'
					})
				})
		 	}
		},
		updateNodeModel(){
			if(this.showSide){
				let nodes = this.$refs.editor.getNodesData()
				this.nodeList = Object.freeze(nodes)
			}
		},
		itemSelect(options){
			let editor = this.$refs.editor
			let nodeId = editor.view.store.get(options.objCode)
			let node = editor.view.graph.getCellById(nodeId)
			editor.view.graph.centerCell(node).resetSelection(node)
			node.toFront()
		},
		itemEdit(options){
			let editor = this.$refs.editor
			let nodeId = editor.view.store.get(options.objCode)
			let node = editor.view.graph.getCellById(nodeId)
			editor.view.node.dblclick({node})
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
		}
	},
	watch: {
		showSide(val){
			if(val){
				this.updateNodeModel()
			}
		}
	}
}
</script>
<style lang="scss">
@import "./style.scss";
</style>
