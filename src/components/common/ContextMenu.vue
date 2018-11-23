<template>
    <div
        :style="{
            left: x + 'px',
            top: y + 'px'
        }" 
        v-if="iShow"
        class="ivu-select-dropdown context-menu">
        <div class="ivu-dropdown-menu context-menu-list">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            show: Boolean,
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            },
            value: null
        },
        watch: {
            show(v) {
                this.iShow = v
            },
            iShow(v) {
                this.$emit('update:show', v)
            },
            value(v) {
                this.iValue = v
            },
            iValue(v) {
                this.$emit('input', v)
            }
        },
        data() {
            return {
                iShow: this.show,
                iValue: this.value
            }
        },
    }
</script>

<style lang="less">
    .context-menu {
        position: absolute;
        .context-menu-list {

        }
    }
</style>