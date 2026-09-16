import { laneTypes } from "../adapter/typeMap"
import BasicManage from "./basicManage"

export default class ShortcutManage extends BasicManage {
    constructor(context) {
        super(context)
    }

    getOffsetSize(nodes, dir = 'left') {
        let offsetPoz = []

        const getAverage = (arr) => {
            const size = arr.length
            const total = arr.reduce((t, n) => t + n, 0)

            return total / size
        }

        const calcAverGapOffset = (nodes, key) => {
            const count = nodes.length
            const whKey = key === 'x' ? 'width' : 'height'

            const poz = nodes.map((n, i) => {
                const size = n.properties[whKey]
                return {
                    i,
                    start: n[key] - size / 2,
                    end: n[key] + size / 2,
                    size,
                }
            })

            const sortPoz = poz
                .slice(0)
                .sort((a, b) => {
                    return a.start - b.start
                })

            const firstPoz = sortPoz[0]
            const lastPoz = sortPoz[count - 1]
            const accAllSize = sortPoz.reduce((t, p) => t + p.size, 0)
            const gap = (lastPoz.end - firstPoz.start - accAllSize) / (count - 1)

            sortPoz.forEach((p, i) => {
                if (i > 0) {
                    const start = sortPoz[i - 1].end + gap
                    const end = start + p.size
                    const offset = start - p.start

                    p.start = start
                    p.end = end
                    p.offset = offset
                } else {
                    p.offset = 0
                }
            })

            return sortPoz.map(p => sortPoz[p.i].offset)
        }

        switch (dir) {
            case 'left': {
                const leftX = nodes.map(n => n.x - n.properties.width / 2)
                const rstPoz = Math.min(...leftX)
                offsetPoz = leftX.map(v => rstPoz - v)
                break
            }

            case 'top': {
                const topY = nodes.map(n => n.y - n.properties.height / 2)
                const rstPoz = Math.min(...topY)
                offsetPoz = topY.map(v => rstPoz - v)
                break
            }

            case 'right': {
                const rightX = nodes.map(n => n.x + n.properties.width / 2)
                const rstPoz = Math.max(...rightX)
                offsetPoz = rightX.map(v => rstPoz - v)
                break
            }

            case 'bottom': {
                const bottomY = nodes.map(n => n.y + n.properties.height / 2)
                const rstPoz = Math.max(...bottomY)
                offsetPoz = bottomY.map(v => rstPoz - v)
                break
            }

            case 'horizontalCenter': {
                const centerX = nodes.map(n => n.x)
                const rstPoz = getAverage(centerX)
                offsetPoz = centerX.map(v => rstPoz - v)
                break
            }

            case 'verticalCenter': {
                const centerY = nodes.map(n => n.y)
                const rstPoz = getAverage(centerY)
                offsetPoz = centerY.map(v => rstPoz - v)
                break
            }

            case 'horizontalAverage': {
                offsetPoz = calcAverGapOffset(nodes, 'x')
                break
            }

            case 'verticalAverage': {
                offsetPoz = calcAverGapOffset(nodes, 'y')
                break
            }

            default: {
                break
            }
        }

        return offsetPoz
    }

    alignSelectedNodes(dir = 'left') {
        const { nodes } = this.logic.graphModel.getSelectElements()
        const laneNodes = []
        const baseNodes = []

        nodes.forEach(n => {
            if (laneTypes.includes(n.type)) {
                laneNodes.push(n)
            } else {
                baseNodes.push(n)
            }
        })

        const isAverage = [
            'horizontalAverage',
            'verticalAverage'
        ].includes(dir)

        const isCenter = [
            'horizontalCenter',
            'verticalCenter',
        ].includes(dir)

        const isX = [
            'left',
            'right',
            'horizontalCenter',
            'horizontalAverage',
        ].includes(dir)

        // 只有一个元素没必要对齐
        if (nodes.length <= 1) return

        // 少于三个元素没必要计算分配
        if (isAverage && nodes.length < 3) return

        // 当全部非泳道节点为当前选中唯一泳道节点的子节点且触发居中对齐
        if (
            isCenter
            && laneNodes.length === 1
            && baseNodes.every(n => laneNodes[0].children.includes(n.id))
        ) {
            const laneNode = laneNodes[0]
            baseNodes.forEach(n => {
                if (dir === 'horizontalCenter') {
                    this.nodeManage.nodeStepMove(n.id, laneNode.x - n.x, 0)
                } else {
                    this.nodeManage.nodeStepMove(n.id, 0, laneNode.y - n.y)
                }
            })
            return
        }

        const offsetPozArr = this.getOffsetSize(nodes, dir)

        nodes.forEach((el, i) => {
            let offsetX = 0
            let offsetY = 0

            if (isX) {
                offsetX = offsetPozArr[i]
            } else {
                offsetY = offsetPozArr[i]
            }
            this.nodeManage.nodeStepMove(el.id, offsetX, offsetY)
        })
    }
}
