<template>
    <CollectionItem :shape.sync="shape" />
</template>
<script>
import CollectionItem from './CollectionItem'
export default {
    name: 'ConnectionObject',
    data(){
        return {
            shape: 'ConnectionObject'
        }
    },
    components: {
        CollectionItem
    }
}
</script>