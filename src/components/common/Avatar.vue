<template>
    <div 
        class="avatar"
        :style="{
            width: getSize,
            height: getSize,
            lineHeight: getSize,
            backgroundColor: color
        }"
        >
        <img v-if="src" :src="src">
        <Icon v-else :size="size / 2" type="md-person" />
    </div>
</template>

<script>
    export default {
        props: {
            src: String,
            size: {
                type: Number,
                default: 30
            },
            color: {
                type: String,
                default: '#ccc'
            }
        },
        computed: {
            getSize() {
                return this.size + 'px'
            }
        }
    }
</script>

<style>
    .avatar {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
    }
</style>