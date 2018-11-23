<template>
    <li class="ivu-dropdown-item" 
        :class="{
            'ivu-dropdown-item-divided': divided
        }" 
        @click="click">
        <slot />
    </li>
</template>

<script>
    export default {
        props: {
            value: null,
            divided: Boolean
        },
        methods: {
            click() {
                this.$emit('click', this.value)
                this.$parent.iShow = false
                this.$parent.iValue = this.value
            }
        },
    }
</script>

<style lang="less">
</style>