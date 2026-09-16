import Entry from "../../Entry";

// D4工作台
import d4workbench from "./map/d4workbench";

//字典管理
import dicmgmt from "./map/dicmgmt";

// 数据字典
import datadict from "./map/datadict";

// 管控工作台
import controlWorkbench from './map/controlWorkbench'

export default [
    {
        path: "/" + process.env.MODULE_NAME,
        component: Entry,
        children: [...d4workbench, ...dicmgmt, ...datadict, ...controlWorkbench],
    },
];
