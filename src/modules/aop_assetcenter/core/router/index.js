import Entry from '../../Entry'
import architectureManagement from './map/architectureManagement'

export default [
    {
        path: '/' + process.env.MODULE_NAME,
        component: Entry,
        children: [
            ...architectureManagement
        ]
    }
]
