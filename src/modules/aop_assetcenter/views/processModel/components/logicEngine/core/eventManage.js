
import BasicManage from "./basicManage"
import EventEmitter from 'events'

export default class EventManage extends BasicManage {
    emitter = new EventEmitter()

    emit(name, data) {
        this.logic.eventCenter.emit(name, data)
    }

    on(ev, fn) {
        this.emitter.on(ev, fn)
    }

    off(ev, fn) {
        this.emitter.removeListener(ev, fn)
    }

    removeAllListeners() {
        this.emitter.removeAllListeners()
    }

    emit(event, data) {
        this.emitter.emit(event, data)
    }
}
