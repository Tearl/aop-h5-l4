
import Basic from './basic'
export default class Keyboard extends Basic {

    constructor(context){
        super(context)
    }

    backspace(e){
        let cells = this.graph.getSelectedCells()
        this.graph.startBatch('custom-batch-name')
        this.graph.removeCells(cells)
        this.graph.stopBatch('custom-batch-name')
    }
}