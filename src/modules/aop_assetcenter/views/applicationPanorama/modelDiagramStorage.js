const STORAGE_PREFIX = 'model-architecture'

const normalizeContext = (context = {}) => ({
    systemId: context.systemId || 'default',
    diagramType: context.diagramType || 'integration',
    version: context.version || 'V1.0.0'
})

export const modelDiagramKey = (context) => {
    const normalized = normalizeContext(context)
    return `${STORAGE_PREFIX}:${normalized.systemId}:${normalized.diagramType}:${normalized.version}`
}

export const loadModelDiagram = (context) => {
    const raw = localStorage.getItem(modelDiagramKey(context))
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch (error) {
        return null
    }
}

export const saveModelDiagram = (context, graph, extra = {}) => {
    const normalized = normalizeContext(context)
    const record = {
        schemaVersion: 1,
        ...normalized,
        ...extra,
        graph,
        updatedTime: new Date().toISOString()
    }
    localStorage.setItem(modelDiagramKey(normalized), JSON.stringify(record))
    return record
}
