<template>
    <div
        :style="{
            left: x + 'px',
            top: y + 'px'
        }" 
        class="ivu-select-dropdown context-menu">
        <div class="ivu-dropdown-menu context-menu-list">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        }
    }
</script>

<style lang="less">
    .context-menu {
        position: absolute;
        .context-menu-list {

        }
    }
</style>