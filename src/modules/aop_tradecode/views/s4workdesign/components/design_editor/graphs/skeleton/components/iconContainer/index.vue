<template>
    <i class="x6-graph-custom-works-next-icon">
        <svg class="next-icon-remote" focusable="false" :fill="fill">
            <use :xlink:href="name"></use>
        </svg>
    </i>
</template>
<script>
export default {
    props: ['name', 'fill']
}
</script>