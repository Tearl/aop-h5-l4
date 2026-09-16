
import BasicManage from "./basicManage"
import connectStart from "../shape/connectStart"
import connectEnd from "../shape/connectEnd"
import connectFlow from "../shape/connectFlow"
import connectCondition from "../shape/connectCondition"
import connectProcess from "../shape/connectProcess"
import solidHorizontal from "../shape/solidHorizontal"
import solidVertical from "../shape/solidVertical"
import connectParallel from "../shape/connectParallel"
import commentRight from "../shape/commentRight"
import commentLeft from "../shape/commentLeft"
import connectData from "../shape/connectData"
import connectDocument from "../shape/connectDocument"
import connectStore from "../shape/connectStore"
import laneVertical from "../shape/laneVertical"
import laneHorizontal from "../shape/laneHorizontal"
import connectLine from "../shape/connectLine"

export default class registerManage extends BasicManage {
    constructor(context){
        super(context)
        this.registry(connectStart)
        this.registry(connectEnd)
        this.registry(connectFlow)
        this.registry(connectCondition)
        this.registry(connectProcess)
        this.registry(solidHorizontal)
        this.registry(solidVertical)
        this.registry(connectParallel)
        this.registry(commentRight)
        this.registry(commentLeft)
        this.registry(connectData)
        this.registry(connectDocument)
        this.registry(connectStore)
        this.registry(laneVertical)
        this.registry(laneHorizontal)
        this.registry(connectLine)
    }

    registry(meta){
        this.logic.register(meta)
    }
}
