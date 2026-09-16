
<template>
	<div class="aop-graph-flowWorks">
        <div  class="top_right_btn" v-if="editSt !='0'">
            <el-button v-show="$route.query.pageType != 'view'" size="small" type="primary" class="primaryBtn" id="service_save_btn" @click="saveBatchObject">保存</el-button>
        </div>
        <div>
            <graph-skeleton>
                <template v-slot:sider >
                    <graph-sider :showSide.sync="showSide" :tabs="tabs">
                        <template>
                            <widget-wrap :preivew="preivew" />
                        </template>
                    </graph-sider>
                </template>
                <template v-slot:header >
                    <graph-shortcut v-if="editSt=='1'" ref="shortcut" :excludeIcons="excludeIcons" @iconClick="iconClick"></graph-shortcut>
                </template>
                <template>
                    <graph-scale></graph-scale>
                    <graph-view ref="editor"></graph-view>
                </template>
            </graph-skeleton>
            <graph-dialog ref="graphsDialog" @cancelDialog="cancelDialog" @savePutText="savePutText" @saveDialog="saveDialog" />
        </div>
	</div>
</template>
<script>
import graphSkeleton from '../skeleton'
import graphHeader from '../skeleton/components/header'
import graphSider from '../skeleton/components/sider'
import graphShortcut from '../skeleton/components/shortcut'
import graphScale from '../skeleton/components/scale'
import widgetWrap from './components/widget/index.vue'
import graphView from './components/view'
import mixin from '@m/core/mixin'
import graphDialog from './components/flowDialog'
import _ from 'lodash'
export default {
	mixins: [mixin],
	components: {
		graphSkeleton,
		graphHeader,
		graphSider,
		graphShortcut,
		graphScale,
		graphView,
		widgetWrap,
		graphDialog
	},
    props: {
        mode: {
            type: String,
            default: "s4Design",
        },
        itemInfo: {
            type: Object,
            default: () => {},
        },
        editSt: { // 0否 1是可编辑
            type: String,
            default: () => '1',
        },
    },
	data() {
		const { action } = this.$route.query
		return {
			name: '流程画布',
			excludeIcons: ['copy','paste'],
			btns: [{ label: '保存', value: 'save' }],
			showSide: true,
			tabs: [
				{label:'流程节点',value:'00'}
			],
			preivew: action == 'preview',
            detailInfo:{
                flowChartId:'',
                flowChartNm:'',
                picAddr:'',
                flowChartDesc:'',
            },
		};
	},
	provide(){
		return {
			getEditor: () => {
				return this.$refs.editor
			},
			getDialog: () => {
				return this.$refs.graphsDialog
			}
		}
	},
	mounted() {
		this.getFlowCahrt()
        if(this.editSt=='0'){
            this.showSide = false;
        } else {
            this.showSide = true;
        }
		if(!this.preivew){
			this.$nextTick(() => {
				let graph = this.$refs.editor.view.graph
                if(this.editSt=='1'){
                    graph.on('shortcut:change', (options) => {
                        let { action, value } = options
                        this.$refs.shortcut[action](value)
                    })
                }
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
                        if(this.editSt=='1'){
                            this.$refs.shortcut.cleanDisabledIcon(comand)
                        }
					}
					if(uncomand.length){
                        if(this.editSt=='1'){
                            this.$refs.shortcut.setDisabledIcon(uncomand)
                        }
					}
				})
			})
		}else{
			this.btns = []
		}
	},
	methods: {
        base64ToPngFile(base64Data, filename) {
            // 将base64字符串转换为二进制数据
            let b64 = atob(base64Data.split(',')[1]);
            let mime = base64Data.match(/:([^;]+);/)[1];
            let arr = new Uint8Array(b64.length);
            
            for (let i = 0; i < b64.length; i++) {
                arr[i] = b64.charCodeAt(i);
            }
            
            // 使用Blob对象创建PNG文件
            let pngBlob = new Blob([arr], { type: mime });
            
            // 创建File对象
            let pngFile = new File([pngBlob], filename, {
                type: mime,
            });
            
            return pngFile;
        },
		async saveBatchObject(){

            // let picAddr = null
            // const _file = await this.$refs.editor.getPicBySvg(this.itemInfo.functionId);
            

            //  保存流程图节点
			// try{
				let options = await this.$refs.editor.view.render.toJSON()
				// let { beId, baiId, fcType, channel } = this.$route.query
                console.log(options,'流程图信息合集')
                let filename = `${this.itemInfo.functionId}.png`;
                let _file = this.base64ToPngFile(options.picture, filename);
                // 图片文件上送minio
                let fd = new FormData()
                fd.append('uploadFile', _file)
                const { fileInfoLists } = await this.rpc.s4design.processPicUpload(fd);
                if (Array.isArray(fileInfoLists) && fileInfoLists.length) {
                    picAddr = fileInfoLists[0].feAddr
                }
                let newArr = {
                    flowNodeInfos: [],
                    laneNodeInfos: [],
                    nodeRels:[],
                };
                if(Array.isArray(options.flowNodeInfos)){
                    let sublist = options.flowNodeInfos.filter((ele)=> (ele.fnName==''));
                    if(sublist && sublist.length > 0){
                        this.$message.error('组件名称不能为空,请编辑');
                        return;
                    }
                }
                if(Array.isArray(options.flowNodeInfos)){
                    let undefinedList = options.flowNodeInfos.filter((ele)=>ele.fnClass == '20' && (ele.fnSvcId=='' || ele.fnName==''));
                    if(undefinedList && undefinedList.length > 0){
                        this.$message.error('接口组件名称编号不能为空,请编辑');
                        return;
                    }
                }
                if(options){
                    if(Array.isArray(options.flowNodeInfos)){
                        newArr.flowNodeInfos = options.flowNodeInfos.map((ele)=>{
                            return {
                                nodeId: ele.fnId || '',
                                flowChartId: ele.fnId || '',
                                nodeClassCd: 'node', // 节点分类代码
                                nodeTypeCd: ele.fnClass || '', // 节点类型代码 00-开始;01-结束;02-流程;03-判断;20-接口
                                relObjId: ele.fnClass == '20'?ele.fnSvcId :'', // 关联对象 20 送接口id
                                nodeCd: ele.fnCode || '', // 节点编码
                                nodeNm: ele.fnName || '', // 节点名称
                                nodeDesc: ele.fnDesc || '', // 节点描述
                                coordinate: { // 位置信息
                                    xCoordVal: ele.point.pointX || '',
                                    yCoordVal: ele.point.pointY || '',
                                    widthVal: ele.point.width || '',
                                    heightVal: ele.point.height || '',
                                }
                            }
                        })
                    }
                    if(Array.isArray(options.laneNodeInfos)){
                        newArr.laneNodeInfos = options.laneNodeInfos.map((ele)=>{
                            return {
                                nodeId: ele.fnId || '',
                                flowChartId: ele.fnId || '',
                                nodeClassCd: 'lane', // 节点分类代码
                                nodeTypeCd: '02', // 节点类型代码 00-开始;01-结束;02-流程;03-判断;20-接口
                                relObjId: ele.relObjId || '', // 关联对象 20 送接口id
                                nodeCd: ele.fnCode || '', // 节点编码
                                nodeNm: ele.fnName || '', // 节点名称
                                nodeDesc: ele.fnDesc || '', // 节点描述
                                coordinate: { // 位置信息
                                    xCoordVal: ele.point.pointX || '',
                                    yCoordVal: ele.point.pointY || '',
                                    widthVal: ele.point.width || '',
                                    heightVal: ele.point.height || '',
                                }
                            }
                        })
                    }
                    if(Array.isArray(options.nodeRels)){
                        newArr.nodeRels = options.nodeRels.map((ele)=>{
                            return {
                                relId:ele.relId || '',
                                flowChartId: '',
                                relDesc: ele.fnrDesc || '',
                                startNodeId: ele.curFnId || '', // 起点
                                targetNodeId: ele.tgtFnId || '', // 目标节点
                                condFitFlg: '', // 条件满足标志
                                route: '', // 路由
                                port:{
                                    startPort: ele.sourcePort,
                                    targetPort: ele.targetPort,
                                }
                            }
                        })
                    }
                }
				this.rpc.s4design.commitFnctFlowChartDetailInfo({
                    // picAddr: picAddr,
					fnctId: this.itemInfo.functionId,
					flowChartNm: this.detailInfo.flowChartNm || '',
                    flowChartId: this.detailInfo.flowChartId || '',
                    flowChartDesc: this.detailInfo.flowChartDesc || '',
                    picAddr: picAddr || '',
                    // 功能流程节点信息列表-start
                    functionFlowNodeInfoList: newArr.flowNodeInfos || [],
                    // 功能流程泳道信息列表-start
                    functionFlowLaneInfoList: newArr.laneNodeInfos || [],
                    // 功能流程图节点关系列表-start
                    functionFlowChartNodeRelList: newArr.nodeRels || [],
					}).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '保存成功！',
                            duration: 2000,
                            type: 'success'
                        })
				})
                this.rpc.s4design.addFuntionJobCommitFlow({
                fnctId: this.$route.query.fnctId,
                jobTpCd: 'C4',
                })
			// }catch(e){
			// 	this.$message.error('未知异常！',e)
			// }
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

			if(key == 'del'){
				let nodes = editor.view.graph.getSelectedCells()
				editor.view.node.batchRemove(nodes)
			}
		},
		async getFlowCahrt(){
			const res = await this.rpc.s4design.queryFnctFlowChartDetailInfo({fnctId: this.itemInfo.functionId,});
            this.detailInfo = {
                flowChartId: res.flowChartId || '',
                flowChartNm: res.flowChartNm || '',
                picAddr: res.picAddr || '',
                flowChartDesc: res.flowChartDesc || '',
            };
            let options = {
                flowNodeInfos: [],
                laneNodeInfos: [],
                nodeRels:[],
            }
            if(res){
                if(Array.isArray(res.functionFlowNodeInfoList)){
                    options.flowNodeInfos = res.functionFlowNodeInfoList.map((ele)=>{
                        return {
                            fnId : ele.nodeId || ele.flowChartId,
                            nodeClassCd: 'node', // 节点分类代码
                            fnClass: ele.nodeTypeCd || '', // 节点类型代码 00-开始;01-结束;02-流程;03-判断;20-接口
                            relObjId: ele.relObjId || '', // 关联对象 20 送接口id
                            fnSvcId: ele.relObjId || '', // 关联对象 20 送接口id
                            fnCode: ele.nodeCd || '', // 节点编码
                            fnName: ele.nodeNm || '', // 节点名称
                            fnDesc: ele.nodeDesc || '', // 节点描述
                            point: { // 位置信息
                                pointX: ele.coordinate.xCoordVal || '',
                                pointY: ele.coordinate.yCoordVal || '',
                                width: ele.coordinate.widthVal || '',
                                height: ele.coordinate.heightVal || '',
                            }
                        }
                    })
                }
                if(Array.isArray(res.functionFlowLaneInfoList)){
                    options.laneNodeInfos = res.functionFlowLaneInfoList.map((ele)=>{
                        return {
                            fnId : ele.nodeId || ele.flowChartId,
                            nodeClassCd: 'lane', // 节点分类代码
                            fnClass: ele.nodeTypeCd || '', // 节点类型代码 00-开始;01-结束;02-流程;03-判断;20-接口
                            nodeTypeCd: '02', // 节点类型代码 00-开始;01-结束;02-流程;03-判断;20-接口
                            relObjId: ele.relObjId || '', // 关联对象 20 送接口id
                            fnCode: ele.nodeCd || '', // 节点编码
                            fnName: ele.nodeNm || '', // 节点名称
                            fnDesc: ele.nodeDesc || '', // 节点描述
                            point: { // 位置信息
                                pointX: ele.coordinate.xCoordVal || '',
                                pointY: ele.coordinate.yCoordVal || '',
                                width: ele.coordinate.widthVal || '',
                                height: ele.coordinate.heightVal || '',
                            }
                        }
                    })
                }
                if(Array.isArray(res.functionFlowChartNodeRelList)){
                    options.nodeRels = res.functionFlowChartNodeRelList.map((ele)=>{
                        return {
                            relId: ele.relId || '',
                            flowChartId: ele.flowChartId || '',
                            fnrDesc: ele.relDesc || '',
                            curFnId: ele.startNodeId || '', // 起点
                            tgtFnId: ele.targetNodeId || '', // 目标节点
                            condFitFlg: ele.condFitFlg || '', // 条件满足标志
                            route: ele.route || '', // 路由
                            sourcePort: ele.port.startPort || '',
                            targetPort: ele.port.targetPort || '',
                        }
                    })
                }
            }
            this.$refs.editor.render(options)
		},
        cancelDialog(type){
            console.log('===quxiaos')
            // 不做编辑则撤回 ==3步取消
            let editor = this.$refs.editor;
            editor.view.graph.cleanSelection().undo()
            if(type=='cancle'){
                this.$refs.graphsDialog.navSer = false;
                editor.view.graph.cleanSelection().undo()
                this.iconClick('undo')
            }else{}
        },
        saveDialog(type,data,node){
            // 首次拖入接口直接编辑==保存信息更新节点dom
            let editor = this.$refs.editor;
            let data1 = _.cloneDeep(data);
            if(type=='save'){
                this.$nextTick(()=>{
                    editor.view.graph.startBatch('custom-batch-name')
                    node.attr('label/text', data1.fnName)
                    node.replaceData(data1)
                    editor.view.graph.stopBatch('custom-batch-name')
                })
            }else{}
        },
        savePutText(type,data,node){
            // 首次拖入接口直接编辑==保存信息更新节点dom
            let editor = this.$refs.editor;
            let data1 = _.cloneDeep(data);
            // console.log(type,data,node,data1)
            if(type=='save'){
                this.$nextTick(()=>{
                    editor.view.graph.startBatch('custom-batch-name')
                    node.attr('label/text', data1.fnName)
                    node.replaceData(data1)
                    editor.view.graph.stopBatch('custom-batch-name')
                })
            }else{}
        },
	}
};
</script>
<style lang="scss">
@import "./style.scss";
.top_right_btn{
    position: fixed;
    right:15px;
    top:10px;
    z-index:99,
}
.primaryBtn{
    min-width: 55px;
    font-size: 12px;
    border-radius: 2px;
    cursor: pointer;
    padding: 0 8px;
    letter-spacing: 0;
    text-align: center;
    font-family: PingFangSC-Regular;
    height: 28px;
}
.noClick {
    pointer-events: none;
}
</style>
