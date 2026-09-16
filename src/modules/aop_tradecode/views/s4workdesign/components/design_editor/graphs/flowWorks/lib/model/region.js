
import _ from 'lodash'
import Basic from './basic'

export default class Region extends Basic {

    get regions(){
        return this.graph.getNodes().filter(node => node.shape == 'Connection' )
    }

    constructor(context){
        super(context)
    }

    formatRegion(meta = {}){

        let { point = {}, ...other } = meta
        let info = {
            shape: 'Connection',
            width: 360, // 240
            height: 600, // 520
            x: 10,
            y: 10,
            zIndex: -2,
            data: Object.assign({
                fnId: new Date().getTime(),
                fnName: '默认标题',
                fnCode: '',
                fnDesc: ''
            }, other)
        }
        if(point.width){
            info.width = Number(point.width)
        }
        if(point.height){
            info.height = Number(point.height)
        }
        if(point.pointX){
            info.x = Number(point.pointX)
        }
        if(point.pointY){
            info.y = Number(point.pointY)
        }
        return info
    }

    createRegion(meta = {}){
        let region = this.graph.createNode(meta)
        this.store.set(meta.data.fnId, region.id)
        return region
    }

    adjustRegionPositon(meta){

        let regions = this.regions.sort((a,b) => a.position().x - b.position().x)
        let lastRegion = regions[regions.length - 1]
        let { x, y } = lastRegion.position()
        let { width, height } = lastRegion.size()
        return {
            ...meta,
            point: {
                pointX: x + width - 1,
                pointY: y,
                width: 360,
                height
            }
        }
    }

    async add(){
        let valid = await this.dialog.showRegion()
        if(valid){
            let info = this.adjustRegionPositon(valid)
            let meta = this.formatRegion(info)
            let newRegion = this.createRegion(meta)
            this.graph.addNode(newRegion)
        }
    }

    async edit(region){
        let data = _.cloneDeep(region.data || {})
        let valid = await this.dialog.showRegion(data)
        if(valid){
            region.replaceData(valid)
        }
    }

    move(e){
        this.regions.forEach(region => {
            if(region.id != e.node.id ){
                e.node.embed(region)
            }
        })
    }

    moved(e){
        (e.node.children || []).forEach(child => {
            if(child.shape == 'Connection'){
                e.node.unembed(child)
            }
        })
    }

    resize(e){
        this.list = this.regions
        this.group = []
        let { x } = e.node.position()
        let { width } = e.node.size()
        for(let region of this.list){
            if(region.id != e.node.id){
                let distance
                let position
                let rx = region.position().x
                if(rx < x){
                    //左边
                    distance = rx - x
                    position = 'before'
                }else{
                    distance = rx - (x + width)
                    position = 'after'
                }
                this.group.push({
                    node: region,
                    distance,
                    position
                })
            }
        }
    }

    resized(){
        this.group = null
        this.list = null
    }

    resizing(e){
        let { width, height } = e.node.size()
        let { x, y } = e.node.position()
        this.group.forEach(region => {
            let { node } = region
            let size = node.size()
            node.size(size.width, height)
            if(region.position == 'after'){
                node.position(x + width + region.distance, y)
            }else{
                node.position(x + region.distance, y)
            }
        })
    }

    remove(region){
        if(this.regions.length <= 1){
            return this.vm.$message({
                message: '不可删除最后一个',
                type: 'error'
            })
        }
        this.graph.startBatch('custom-batch-name')
        this.graph.removeNode(region)
        let regions = this.regions.sort((a,b) => a.position().x - b.position().x)
        regions.map((item, index, arr) => {
            let { x,y } = item.position()
            let { width } = item.size()
            let item2 = arr[index + 1]
            if(item2){
                item2.position((x + width - 1), y)
            }
        })
        this.graph.stopBatch('custom-batch-name')
    }

}
