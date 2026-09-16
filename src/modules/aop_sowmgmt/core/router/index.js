import Entry from '../../Entry'

export default [
    {
        path: '/' + process.env.MODULE_NAME,
        component: Entry,
        children: [
            {
                path: '',
                name: 'aopSowmgmtHome',
                meta: {
                    title: 'SOW管理'
                },
                component: () => import('@m/views/home')
            },
            {
                path: 'edit/:id',
                name: 'aopSowmgmtEdit',
                meta: {
                    title: '编辑SOW',
                    hidden: true
                },
                component: () => import('@m/views/edit')
            },
            {
                path: 'view/:id',
                name: 'aopSowmgmtView',
                meta: {
                    title: 'SOW详情',
                    hidden: true
                },
                component: () => import('@m/views/view')
            }
        ]
    }
]