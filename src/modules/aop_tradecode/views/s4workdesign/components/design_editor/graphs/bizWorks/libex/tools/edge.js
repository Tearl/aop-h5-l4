import { Graph, ToolsView } from "@antv/x6"
import { Point } from '@antv/x6-geometry';
import { parseTransformString, matrixToTransformString } from '@antv/x6-common/es/dom/matrix';
import { Button } from "@antv/x6/es/registry/tool/button"

class EdgeTools extends Button {
    onRender(){
        const Dom = ToolsView.createElement()
        Dom.setAttribute('class', 'inner-box')
        Dom.innerHTML = '<i class="bwf-icon-wrap" id="bwf-icon-editor"><svg fill="white" class="next-icon-remote" focusable="false"><use xlink:href="#icon-edit"></use></svg></i><i class="bwf-icon-wrap" id="bwf-icon-del"><svg fill="white" class="next-icon-remote" focusable="false"><use xlink:href="#icon-ashbin"></use></svg></i>'
        this.container.appendChild(Dom)
        this.update()
    }
    update(){
        this.updatePosition();
        return this;
    }
    updatePosition(){
        let pos = Point.create()
        let matrix = this.getEdgeMatrix()
        let matrixStr = matrixToTransformString(matrix)
        // let rect = this.cellView.path.bbox()
        // let rectCenter = { x: rect.width/2, y: rect.height / 2 }
        // let pos = Point.create()
        // let matrix = this.cellView.labelContainer.firstChild.getAttribute('transform')
        let { translation, rotation } = parseTransformString(matrixStr)
        let scale = this.graph.scale()
        pos = new Point(translation.tx, translation.ty)
        pos = this.graph.localToGraph(pos)

        // const view = this.cellView;
        // const d = view.path.closestPointLength(pos);
        // this.distance = d


        this.container.style.left = `${pos.x}px`
        this.container.style.top = `${pos.y}px`
        this.container.style.transform = `scale(${scale.sx}, ${scale.sy}) rotate(${rotation.angle}deg) translate(-50%, -50%)`
        // const matrix = this.getEdgeMatrix()
        // const htmlContainer = this.parent.htmlContainer
        // const viewport = document.querySelector('.x6-graph-svg-viewport')
        // const viewMatrix = viewport.getAttribute('transform')
        // if(viewMatrix){
        //     htmlContainer.style.transform = viewMatrix
        // }else{
        //     htmlContainer.style.transform = ''
        // }
        // this.container.style.transform = matrixToTransformString(matrix)
    }
    onMouseDown(e) {
        
        // if (this.guard(e)) {
        //     return;
        // }
        e.stopPropagation();
        e.preventDefault();
        const onClick = this.options.onClick;
        if (typeof onClick === 'function') {
            onClick({
                e,
                view: this.cellView,
                cell: this.cellView.cell,
                btn: this,
            })
            // FunctionExt.call(onClick, this.cellView, {
            //     e,
            //     view: this.cellView,
            //     cell: this.cellView.cell,
            //     btn: this,
            // });
        }
    }
}

EdgeTools.config({
    name: 'EdgeTools',
    tagName: 'div',
    isSVGElement: false
})

Graph.registerEdgeTool('EdgeTools', EdgeTools, true)
// export default new EdgeTools()z