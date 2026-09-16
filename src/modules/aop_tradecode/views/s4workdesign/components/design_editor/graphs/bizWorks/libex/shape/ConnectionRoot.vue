<template>
    <CollectionItem :shape.sync="shape" />
</template>
<script>
import CollectionItem from './CollectionItem'
export default {
    name: 'ConnectionRoot',
    data(){
        return {
            shape: 'ConnectionRoot'
        }
    },
    components: {
        CollectionItem
    }
}
</script>
