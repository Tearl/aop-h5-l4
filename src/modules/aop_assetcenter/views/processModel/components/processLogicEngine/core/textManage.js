import { EventType, } from '@logicflow/core'
import BasicManage from "./basicManage"
import { customEventType } from "../adapter/typeMap"
import { stripHtmlAttributes, htmlToPlainText } from '../utils'

export default class TextManage extends BasicManage {
    constructor(context) {
        super(context)
        const lf = this.logic

        lf.on(EventType.TEXT_UPDATE, this.textUpdate.bind(this))
        lf.on(customEventType.CUSTOM_TEXT_DBLCLICK, this.customTextDblclick.bind(this))
    }

    textUpdate({ data }) {
        const model = this.logic.graphModel.getNodeModelById(data.id)
        if (!model) {
            return
        }
        const prop = model.getProperties()
        model.setProperty("data", {
            ...prop.data,
            fnName: data.text
        })
    }

    getDomPosition({ x, y }) {
        const {
            transformModel: { TRANSLATE_X, TRANSLATE_Y },
        } = this.logic.graphModel

        return {
            x: x + TRANSLATE_X,
            y: y + TRANSLATE_Y,
        }
    }

    customTextDblclick({
        x, y,
        className,
        singleRow,
        isRich,
        vertical,
        showBackground,
        width,
        height,
        getText,
        callback
    }) {
        let ignore = false
        const lf = this.logic
        // 获取当前画布的缩放比例
        const { transformModel } = lf.graphModel
        const scale = transformModel.SCALE_X.toFixed(2)
        const { flowId } = lf.graphModel
        const overlayEl = document.getElementById(`ToolOverlay_${flowId}`)
        const editorWrap = document.createElement('div')
        const editor = document.createElement('div')
        editorWrap.appendChild(editor)

        editor.setAttribute('contentEditable', 'true')
        editorWrap.className = ['lf-text-input', className]
            .filter(Boolean)
            .join(' ')
        editor.className = 'lf-text-input__inner'

        // const poz = this.getDomPosition({ x, y })
        // 获取编辑器的位置，并根据缩放比例调整
        const poz = this.getDomPosition({ x: x * scale, y: y * scale })
        editorWrap.style.cssText = `
            left: ${poz.x}px;
            top: ${poz.y}px;
            min-height:${showBackground ? height - 2 : height}px;
            width:${showBackground ? width - 2 : width}px;
            display: flex;
            align-items: center;
            justify-content: center;
            ${
                showBackground ? '' : 'background: none;'
            }

            border: none;
        `

        if (!singleRow) {
            editor.style.cssText = `
                white-space: wrap;
                word-break: break-all;
            `
        }

        editor.innerHTML = getText() || ' '
        overlayEl.appendChild(editorWrap)
        lf.clearSelectElements()

        const clearHandler = (ev) => {
            editor.blur()
            document.removeEventListener('click', clearHandler)
            document.removeEventListener('wheel', clearHandler)
        }

        const stopHandler = (ev) => {
            if (ev.key ==='Escape') {
                ignore = true
                clearHandler()
            } else {
                ignore = false
            }
            ev.stopPropagation()
        }

        const blurHandler = () => {
            if (!ignore) {
                callback(
                    isRich
                        ? stripHtmlAttributes(editor.innerHTML)
                        : editor.innerText.trim(),
                    editorWrap,
                )
            }
            if (overlayEl?.contains(editorWrap)) {
                overlayEl.removeChild(editorWrap)
            }
        }

        const pasteHandler = (ev) => {
            ev.preventDefault()

            const clipboardData = ev.clipboardData || window.clipboardData
            const text = clipboardData?.getData(isRich ? 'text/html' : 'text/plain') || ''
            const plainText = isRich ? stripHtmlAttributes(text) : htmlToPlainText(text)

            // 创建一个临时 div 来处理富文本
            const temp = document.createElement('div')
            temp.innerHTML = plainText

            // 使用 insertAdjacentHTML 插入内容
            editor.insertAdjacentHTML('beforeend', temp.innerHTML)

            // 移动光标到末尾
            const selection = window.getSelection()
            selection.selectAllChildren(editor)
            selection.collapseToEnd()
        }

        const focusHandler = () => {
            const range = document.createRange()
            const selection = window.getSelection()

            range.selectNodeContents(editor)
            selection.removeAllRanges()
            selection.addRange(range)

        }

        editor.addEventListener('keydown', stopHandler)
        editor.addEventListener('keyup', stopHandler)
        editor.addEventListener('click', stopHandler)
        editor.addEventListener('blur', blurHandler)
        editor.addEventListener('focus', focusHandler)
        editor.addEventListener('paste', pasteHandler)
        document.addEventListener('click', clearHandler)
        document.addEventListener('wheel', clearHandler)

        editor.focus()
    }
}
