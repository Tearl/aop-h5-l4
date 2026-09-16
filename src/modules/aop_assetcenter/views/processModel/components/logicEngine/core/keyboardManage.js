import BasicManage from "./basicManage"

export default class KeyboardManage extends BasicManage {
    constructor(context) {
        super(context)

        this.isAltOrCmdPressed = false
        this.selectedNodesStepMoveStep = 1
        this.selectedNodesStepMoveTimer = null
        this.keyboardBindEvent()
    }

    debounceSelectedNodesStepMove(dir) {
        const getStep = () => {
            this.selectedNodesStepMoveStep += 1

            const gap = this.selectedNodesStepMoveStep - 10

            return gap > 0
                ? gap > 10 ? 10 : ~~gap
                : 1
        }

        this.nodeManage.selectedNodesStepMove(dir, getStep())

        this.selectedNodesStepMoveTimer && clearTimeout(this.selectedNodesStepMoveTimer)
        this.selectedNodesStepMoveTimer = setTimeout(() => {
            this.selectedNodesStepMoveStep = 1
        }, 600)
    }
    keyboardBindEvent() {
        const graph = this.logic.graphModel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Alt' || e.key === 'Meta') {
                this.isAltOrCmdPressed = true
            }

            if(e.key === 'Backspace' || e.key === 'Delete') {
                let cells = graph.getSelectElements()
                const { nodes, edges } = cells
                for(let i = 0; i < nodes.length; i++) {
                    graph.deleteNode(nodes[i].id)
                }
            }

            if (this.isAltOrCmdPressed && e.key === 'ArrowUp') {
                this.debounceSelectedNodesStepMove('up')
                e.preventDefault()
            }

            if (this.isAltOrCmdPressed && e.key === 'ArrowDown') {
                this.debounceSelectedNodesStepMove('down')
                e.preventDefault()
            }

            if (this.isAltOrCmdPressed && e.key === 'ArrowLeft') {
                this.debounceSelectedNodesStepMove('left')
                e.preventDefault()
            }

            if (this.isAltOrCmdPressed && e.key === 'ArrowRight') {
                this.debounceSelectedNodesStepMove('right')
                e.preventDefault()
            }

            
        }, true)

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Alt' || e.key === 'Meta') {
                this.isAltOrCmdPressed = false
            }

            this.selectedNodesStepMoveStep = 1
        })
    }
}
