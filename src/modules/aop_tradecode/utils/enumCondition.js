export function enumCondition(type) {
    return [
        'String',
        'char',
        'byte',
        'short',
        'long',
        'Character',
        'Byte',
        'Short',
        'Long',
    ].includes(type)
}