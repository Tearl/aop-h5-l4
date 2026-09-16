export default class MouseEvent {
    constructor() {
        this.moveFlag = false
        this.extra = {}
        this.startX = 0
        this.startY = 0
        this.__onDownHandler = () => {}
        this.__onMoveHandler = () => {}
        this.__onUpHandler = () => {}
        this._mouseUp = this._mouseUp.bind(this)
        this._mouseMove = this._mouseMove.bind(this)

        document.addEventListener('mouseup', this._mouseUp)
        document.addEventListener('mousemove', this._mouseMove)
    }

    destroy() {
        document.removeEventListener('mouseup', this._mouseUp)
        document.removeEventListener('mousemove', this._mouseMove)
    }

    mouseDownHandler(ev, extra = {}) {
        this.moveFlag = true
        this.startX = ev.x
        this.startY = ev.y
        this.extra = extra
        this.__onDownHandler(ev)
        ev.stopPropagation()
    }

    on(event, handler) {
        this[`__${event}Handler`] = handler
    }

    _mouseUp(ev) {
        this.moveFlag = false
        this.startX = 0
        this.startY = 0
        this.extra = {}
        this.__onUpHandler(ev)
    }

    _mouseMove(ev) {
        if (this.moveFlag) {
            const deltaX = ev.x - this.startX
            const deltaY = ev.y - this.startY
            this.__onMoveHandler(ev, deltaX, deltaY, this.extra)
        }
    }
}
