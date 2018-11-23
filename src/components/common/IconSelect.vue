<template>
    <div class="select-icon-view">
        <Select class="select-icon" v-model="icon" filterable clearable>
            <Option :value="item" v-for="(item, index) in icons" :key="index"><Icon :size="20" :type="item" />{{item}}</Option>
        </Select>
    </div>
</template>

<script>
    import icons from './icons'
    export default {
        props: {
            value: {
                type: String
            }
        },
        watch: {
            value(v) {
                this.icon = v
            },  
            icon(v) {
                this.$emit('input', v)
            }
        },
        data() {
            return {
                icons: icons,
                icon: this.value,
            }
        }
    }
</script>

<style lang="less">
.select-icon-view {
    .ivu-select-dropdown-list {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        .ivu-select-item {
            padding: 11px;
            width: 42px;
            height: 42px;
            overflow: hidden;
            .ivu-icon{
                margin-right: 11px;
            }
        }
    }
}
</style>