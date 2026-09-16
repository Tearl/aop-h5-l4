const STORAGE_PREFIX = "drawio-architecture";

const normalizeContext = (context = {}) => ({
    systemId: context.systemId || "default",
    diagramType: context.diagramType || "integration",
    version: context.version || "V1.0.0",
});

const recordKey = (context) => {
    const normalized = normalizeContext(context);
    return `${STORAGE_PREFIX}:${normalized.systemId}:${normalized.diagramType}:${normalized.version}:record`;
};

const legacyPrefix = (context) => {
    const normalized = normalizeContext(context);
    return `${STORAGE_PREFIX}:${normalized.systemId}:${normalized.diagramType}`;
};

const parseRecord = (value) => {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
};

export const loadDiagramRecord = (context) => {
    const normalized = normalizeContext(context);
    const stored = parseRecord(localStorage.getItem(recordKey(normalized)));
    if (stored) return stored;

    // 兼容改造前按 XML、SVG 分开存储的本地数据。
    const oldPrefix = legacyPrefix(normalized);
    const diagramXml = localStorage.getItem(`${oldPrefix}:xml`) || "";
    const previewSvg = localStorage.getItem(`${oldPrefix}:svg`) || "";
    if (!diagramXml && !previewSvg) return null;

    const migrated = {
        diagramId: `LOCAL-${normalized.systemId}-${normalized.diagramType}`,
        diagramName: context.diagramName || "集成架构图",
        ...normalized,
        diagramXml,
        previewSvg,
        revision: diagramXml ? 1 : 0,
        status: "draft",
        updatedTime: new Date().toISOString(),
    };
    localStorage.setItem(recordKey(normalized), JSON.stringify(migrated));
    localStorage.removeItem(`${oldPrefix}:xml`);
    localStorage.removeItem(`${oldPrefix}:svg`);
    return migrated;
};

export const saveDiagramRecord = (context, changes = {}) => {
    const normalized = normalizeContext(context);
    const previous = loadDiagramRecord(normalized) || {};
    const xmlChanged =
        Object.prototype.hasOwnProperty.call(changes, "diagramXml") &&
        changes.diagramXml !== previous.diagramXml;
    const record = {
        ...previous,
        ...normalized,
        ...changes,
        diagramId:
            previous.diagramId ||
            `LOCAL-${normalized.systemId}-${normalized.diagramType}-${Date.now()}`,
        diagramName:
            changes.diagramName ||
            previous.diagramName ||
            context.diagramName ||
            "集成架构图",
        diagramXml:
            changes.diagramXml !== undefined
                ? changes.diagramXml
                : previous.diagramXml || "",
        previewSvg:
            changes.previewSvg !== undefined
                ? changes.previewSvg
                : previous.previewSvg || "",
        status: changes.status || previous.status || "draft",
        revision: (previous.revision || 0) + (xmlChanged ? 1 : 0),
        updatedTime: new Date().toISOString(),
    };
    localStorage.setItem(recordKey(normalized), JSON.stringify(record));
    return record;
};
