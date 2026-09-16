

import { ports, usePorts } from '../config'
import x6ShapeNodelevel1 from './x6-shape-level1'
import x6ShapeNodelevel2 from './x6-shape-level2'
import x6ShapeNodelevel3 from './x6-shape-level3'
import x6ShapeNodelevel4 from './x6-shape-level4'
import x6ShapeNodelevel5 from './x6-shape-level5'
import x6ShapeRegion from './x6-shape-region'
export default [
    {
        shape: x6ShapeNodelevel1.name,
        component: x6ShapeNodelevel1,
        width: 180,
        height: 46,
        ports: {
            ...ports,
            ...usePorts
        }
    },
    {
        shape: x6ShapeNodelevel2.name,
        component: x6ShapeNodelevel2,
        width: 180,
        height: 46,
        ports: {
            ...ports,
            ...usePorts
        }
    },
    {
        shape: x6ShapeNodelevel3.name,
        component: x6ShapeNodelevel3,
        width: 180,
        height: 94,
        ports: {
            ...ports,
            ...usePorts
        }
    },
    {
        shape: x6ShapeNodelevel4.name,
        component: x6ShapeNodelevel4,
        width: 180,
        height: 94,
        ports: {
            ...ports,
            ...usePorts
        }
    },
    {
        shape: x6ShapeNodelevel5.name,
        component: x6ShapeNodelevel5,
        width: 180,
        height: 94,
        ports: {
            ...ports,
            ...usePorts
        }
    },
    {
        shape: x6ShapeRegion.name,
        component: x6ShapeRegion,
        width: 220,
        height: 520
    }
]