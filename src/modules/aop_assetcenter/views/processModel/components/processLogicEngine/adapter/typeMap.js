export const nodeType = {
    'CONNECT_START': 'connect:start', // 开始
    'CONNECT_END': 'connect:end', // 结束
    'CONNECT_FLOW': 'connect:flow', // 流程
    'CONNECT_CONDITION': 'connect:condition', // 判断
    'CONNECT_PROCESS': 'connect:process', // 子流程
    'CONNECT_DATA': 'connect:data', // 调用数据
    'CONNECT_DOCUMENT': 'connect:document', // 文档框
    'CONNECT_STORE': 'connect:store', // 数据储存
    'CONNECT_PARALLEL': 'connect:parallel', // 并行

    'LANE_VERTICAL': 'lane:vertical', // 泳道（垂直）
    'LANE_HORIZONTAL': 'lane:horizontal', // 泳道（水平）

    'SOLID_VERTICAL': 'solid:vertical', // 竖横线
    'SOLID_HORIZONTAL': 'solid:horizontal', // 横线段

    'COMMENT_LEFT': 'comment:left', // 注释（左）
    'COMMENT_RIGHT': 'comment:right', // 注释（左）
}

export const nodeTypeKeys = Object.keys(nodeType)
export const nodeTypeValues = Object.values(nodeType)
export const laneTypes = [nodeType.LANE_HORIZONTAL, nodeType.LANE_VERTICAL]
export const solidTypes = [nodeType.SOLID_HORIZONTAL, nodeType.SOLID_VERTICAL]
export const commentTypes = [nodeType.COMMENT_LEFT, nodeType.COMMENT_RIGHT]
export const processType = [nodeType.CONNECT_PROCESS]

export const customEventType = {
    'NODE_CLICK': 'node:click',
    'NODE_DBLCLICK': 'node:dbclick',
    'NODE_CONFIG': 'node:config',
    'LANE_SHOW_PANEL': 'lane:show_panel',
    'LANE_HIDE_PANEL': 'lane:hide_panel',
    'LANE_STEP_SET': 'lane:step_add',
    'LANE_TRACK_ADD': 'lane:track_add',
    'CUSTOM_TEXT_DBLCLICK': 'custom:text_dblclick',
    'CUSTOM_PROCESS_CLICK': 'custom:process_click',
}

export default {
    //泳道
    'laneGroup': nodeType.LANE_VERTICAL,
    //开始节点
    '00': nodeType.CONNECT_START,
    //结束
    '01': nodeType.CONNECT_END,
    //流程
    '02': nodeType.CONNECT_FLOW,
    //判断
    '03': nodeType.CONNECT_CONDITION,
    //分类
    '04': '',
    //产品
    '05': '',
    //活动
    '06': '',
    //步骤
    '07': '',
    //操作
    '08': '',
    //子流程
    '09': nodeType.CONNECT_PROCESS,
    //横线段
    '10': nodeType.SOLID_HORIZONTAL,
    //竖横线
    '11': nodeType.SOLID_VERTICAL,
    //并行
    '12': nodeType.CONNECT_PARALLEL,
    //注释
    '13': nodeType.COMMENT_RIGHT,
    //调用数据
    '14': nodeType.CONNECT_DATA,
    //文档框
    '15': nodeType.CONNECT_DOCUMENT,
    //数据储存
    '16': nodeType.CONNECT_STORE
}
