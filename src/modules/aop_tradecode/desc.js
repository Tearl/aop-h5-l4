import Vue from 'vue';
Vue.component('aopBasicMessageCompare', () => import('./views/workbench/components/design_editor/service_design/components/dialog/servChangeList.vue'));
Vue.component('aopS4DesignBusinessFlow', () => import('./views/s4workdesign/components/design_editor/BusinessFlow/index.vue'));
module.exports = {
    "moduleName": "交易开发模块",
    "moduleDesc": "交易开发模块"
}
