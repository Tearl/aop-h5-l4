
export default {
    inject: ['getNode', 'getGraph'],
    filters: {
        formatCode(value){
            return value ? `(${value})`: value
        }
    }
}