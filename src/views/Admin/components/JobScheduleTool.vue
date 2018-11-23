<template>
    <span class="tools">
        <Button size="small" :loading="state.run" @click="$emit('run')" type="primary">
            <span v-if="!state.run">运行</span>
        </Button>
        <Button size="small" :loading="state.update" @click="$emit('update')" type="info">
            <span v-if="!state.update">修改</span>
        </Button>
        <Button size="small" :loading="state.resume" @click="$emit('resume')" type="success">
            <span v-if="!state.resume">恢复</span>
        </Button>
        <Button size="small" :loading="state.pause" @click="$emit('pause')" type="warning">
            <span v-if="!state.pause">停止</span>
        </Button>
        <Button size="small" :loading="state.delete" @click="$emit('delete')" type="error">
            <span v-if="!state.delete">删除</span>
        </Button>
    </span>
</template>

<script>
export default {
    props: {
        state: Object,
    }
};
</script>

<style scoped lang="less">
.tools {
  display: inline-block;
  width: 100%;
  button{
      min-width: 40px;
  }
}
</style>