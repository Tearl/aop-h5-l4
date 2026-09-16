import { h } from "@logicflow/core"

export const getEnvPrefix = () => {
    const { host } = window.location
    const pre = host.split('.')[0]

    const envMap = {
        'dev': 'A1',
        'sit': 'A2',
        'uat': 'A3',
        'prd': 'A4',
    }

    return envMap[pre] || 'A1'
}

export const calcChildInParent = (parent, child) => {
    const px = parent.x
    const py = parent.y
    const pw = parent.width
    const ph = parent.height
    const cx = child.x
    const cy = child.y
    const cw = child.width
    const ch = child.height

    const matchStart = (px - pw / 2) <= (cx - cw / 2) && (py - ph / 2) <= (cy - ch / 2)
    const matchEnd = (px + pw / 2) >= (cx + cw / 2) && (py + ph / 2) >= (cy + ch / 2)

    return matchStart && matchEnd
}

export const isDebugEnv = () => {
    return window.location.href.includes('__LOGIC_FLOW_DEBUG__')
}

export const logger = (...props) => {
    if (isDebugEnv()) {
        console.log(...props)
    }
}

export const stripHtmlTags = (html) => {
    if (!html) return ''

    const doc = new DOMParser().parseFromString(html, 'text/html')
    const tempDiv = doc.body

    // 处理特殊标签
    const brElements = tempDiv.getElementsByTagName('br')
    for (const br of Array.from(brElements)) {
        br.replaceWith('\n')
    }

    const pElements = tempDiv.getElementsByTagName('p')
    for (const p of Array.from(pElements)) {
        p.appendChild(document.createTextNode('\n'))
    }

    const divElements = tempDiv.getElementsByTagName('div')
    for (const div of Array.from(divElements)) {
        div.appendChild(document.createTextNode('\n'))
    }

    // 获取处理后的纯文本
    let text = tempDiv.textContent || ''

    return text
}

export const stripHtmlAttributes = (html) => {
    const temp = document.createElement('div')
    temp.innerHTML = html

    // 递归处理所有元素
    const removeAttributes = (element) => {
        const attributes = element.attributes
        if (attributes) {
            // 保留标签，但移除所有属性
            while (attributes.length > 0) {
                element.removeAttribute(attributes[0].name)
            }
        }
        // 处理子元素
        Array.from(element.children).forEach(removeAttributes)
    }

    removeAttributes(temp)
    return temp.innerHTML
}

export const htmlToPlainText = (html) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
}

export const getStartPoint = ({ x, y, width, height }) => {
    return {
        x: x - width / 2,
        y: y - height / 2,
    }
}

export const getEndPoint = ({ x, y, width, height }) => {
    return {
        x: x + width / 2,
        y: y + height / 2,
    }
}

export const checkPointInGroup = (point, group) => {
    if (!group) return null

    const item = group.find(item => {
        const startPoint = getStartPoint(item)
        const endPoint = getEndPoint(item)

        return point.x >= startPoint.x
            && point.x <= endPoint.x
            && point.y >= startPoint.y
            && point.y <= endPoint.y
    })

    return item
}

export const getSvg = ({ model, type = 'path', strokeWidth = 1 }, render = () =>({})) => {
    const { x, y, width, height } = model

    return h('svg', {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
    }, [
        h(type, {
            fill: "#FFF",
            strokeWidth,
            stroke: "#239edd",
            ...render({
                width: width - strokeWidth,
                height: height - strokeWidth,
                offsetX: strokeWidth / 2,
                offsetY: strokeWidth / 2,
            })
        })
    ])
}
