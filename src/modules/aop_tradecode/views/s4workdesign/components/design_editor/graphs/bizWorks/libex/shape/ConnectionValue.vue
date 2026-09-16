<template>
    <CollectionItem :shape.sync="shape" />
</template>
<script>
import CollectionItem from './CollectionItem'
export default {
    name: 'ConnectionValue',
    components: {
        CollectionItem
    },
    data(){
        return {
            shape: 'ConnectionValue'
        }
    }
}
</script>