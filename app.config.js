
const path = require('path')
module.exports = {


    externals: {
        'vue': 'window.Vue',
        'vuex': 'window.Vuex',
        'vue-router': 'window.VueRouter',
        'element-ui': 'window.ElementUI',
        'axios': 'window.Axios',
        'lodash': 'window.Lodash',
    },


    babel: {
        include: [path.join(__dirname, 'node_modules/d3-graphviz'), path.join(__dirname, 'node_modules/@hpcc-js/wasm')]
    },

    devServer: {

        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*'
        },

        proxy: {
        },
        host: '127.0.0.1',
        port: 8010
    }
}
