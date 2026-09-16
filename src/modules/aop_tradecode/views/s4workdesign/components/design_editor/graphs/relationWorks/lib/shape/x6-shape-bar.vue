
<script>
export default {
    functional: true,
    render(h, ctx){

        let grpah = ctx.parent.getGraph()
        let node = ctx.parent.getNode() 

        return h('div', {
            class: { bar: true },
            on: {
                mousedown: e => {
                    e.stopPropagation()
                }
            }
        }, [
            h('i', { 
                class: { 'el-icon-edit': true },
                on: {
                    click: e => {
                        grpah.__view__.node.validate(node)
                    }
                }
            }),
            h('i', { 
                class: { 'el-icon-delete': true },
                on: {
                    click: e => {
                        grpah.__view__.node.remove(node)
                    }
                }
            })
        ])
    }
}
</script>