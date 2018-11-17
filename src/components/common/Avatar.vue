<template>
    <div 
        class="avatar"
        :style="{
            width: getSize,
            height: getSize,
            backgroundColor: color
        }"
        >
        <img v-show="src" :src="src">
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
    }
</style>