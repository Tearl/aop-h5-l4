
import Basic from './basic'
export default class Keyboard extends Basic {

    constructor(context){
        super(context)
    }

    ctrlC(e){
        this.graph.trigger('shortcut:action', {key:'copy'})
    }

    ctrlV(e){
        this.graph.trigger('shortcut:action', {key:'paste'})
    }

    backspace(){
        let cells = this.graph.getSelectedCells()
        if(cells.length){
            this.node.batchRemove(cells)
        }
    }
}