
import Basic from './basic'
export default class Region extends Basic {

    constructor(context){
        super(context) 
        this.group = []
    }

    getRegions(){
        return this.graph.getNodes().filter(node => node.shape == 'x6-shape-region')
    }

    getDrop(node){
        let shape = node.shape.replace('widget', 'shape')
        let region = this.tool.formatRegion({shape, visible: false})
        this.insert(region)
        return region
    }

    validate(node){
        let box = this.graph.getNodesUnderNode(node)
        let target = (box || []).find(bb => bb.shape == 'x6-shape-region')
        if(target){
            target.embed(node)
        }else{
            // this.graph.removeNode(node)
            // this.vm.$alert('该节点只允许在泳道节点内','警告', {
            //     confirmButtonText: '确定',
            //     type: 'warning'
            // })
        }
        return Promise.resolve(true)
    }

    remove(node){
        this.graph.removeNode(node)
        let regions = this.getRegions().sort((a,b) => a.position().x - b.position().x)
        this.updatePosition(regions)
    }

    move(node){
        let regions = this.getRegions().filter(region => region.id != node.id)
        if(regions.length > 0){
            regions.forEach(r => {
                node.embed(r)
            })
        }
    }

    moved(node){
        node.eachChild(child => {
            if(child.shape == 'x6-shape-region'){
                node.unembed(child)
            }
        })
    }

    async add(region){
        let newRegion = this.tool.formatRegion({shape: 'x6-shape-region', visible: false})
        let res = await this.node.validate(newRegion)
        if(res){
            this.graph.startBatch('custom-batch-name')
            let { x:dx, y:dy } = region.position()
            let { width, height } = region.size()
            this.getRegions().map(re => {
                let { x } = re.position()
                if(x > dx){
                    re.position(x + 220 - 1 ,dy)
                }
            })
            this.graph.addNode(newRegion)
            newRegion.position(dx + width - 1, dy)
            newRegion.size(220, height)
            newRegion.setZIndex(-1)
            newRegion.prop('visible', true)
            this.graph.stopBatch('custom-batch-name')
        }
    }

    async insert(region){
        let regions = this.getRegions()
        let box = this.graph.getCellsBBox(regions || [])
        let res = await this.node.validate(region)
        if(!res){
            return this.graph.removeNode(region)
        }

        let curRegionSize = region.size()
        let curRegionPosition = region.position()
        let curRegionOrigin = { x: curRegionPosition.x + curRegionSize.width / 2, y: curRegionPosition.y + curRegionSize.height / 2 }

        this.graph.startBatch('custom-batch-name')
        if(!box){
            region.position(curRegionOrigin.x, curRegionOrigin.y)
        }else{
            if(curRegionOrigin.x < box.x){
                region.position(
                    box.x - curRegionSize.width + 1,
                    box.y
                )
            }else if(curRegionOrigin.x > (box.x + box.width)){
                region.position(
                    box.x + box.width - 1,
                    box.y
                )
            }else{
                regions = regions.sort((a,b) => a.position().x - b.position().x)
                let underIndex = regions.findIndex(item => {
                    let { x } = item.position()
                    let { width } = item.size()
                    return (curRegionOrigin.x > x && curRegionOrigin.x < (x + width))
                })
                regions.splice(underIndex + 1, 0, region)
                this.updatePosition(regions)
            }
        }

        region.setZIndex(-1)
        region.prop('visible', true)
        this.graph.stopBatch('custom-batch-name')
    }

    updatePosition(regions){
        let rect = {}
        regions.forEach((item, i) => {
            let { x, y } = item.position()
            let { width, height } = item.size()
            if(i == 0){
                Object.assign(rect, {x,y,width,height})
            }else{
                rect.x += width - 1
                item.position(rect.x, rect.y)
                item.size(width, rect.height)
            }
        })
    }


    resize(e){
        this.group = []
        let { x } = e.node.position()
        let { width } = e.node.size()
        let list = this.graph.getNodes().filter(g => g.shape == 'x6-shape-region')
        for(let region of list){
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

    resized(){
        this.group = null
    }
}