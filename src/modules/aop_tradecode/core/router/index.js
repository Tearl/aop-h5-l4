import Entry from '../../Entry'
import assetlist from './map/assetlist'
import editor from './map/editor'
import s4design from './map/s4design'
import s5design from './map/s5design'

export default [
    {
        path: '/' + process.env.MODULE_NAME,
        component: Entry,
        children: [
            ...assetlist,
            ...editor,
            ...s4design,
            ...s5design
        ]
    }
]
