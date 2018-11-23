<template>
    <div class="menu-list-item">
        <div class="content" @click.self="expand">
            <div class="title" @click="expand">
                <Icon v-if="/(0|1|-1)/.test(value.type)" style="margin-top: -4px;margin-right:8px" :size="20" :type="value.expand ? 'ios-folder-open' : 'ios-folder'" />
                <Icon v-else style="margin-top: -4px;margin-right:8px" :size="20" type="ios-document" />
                <span style="font-size: 14px;">{{value.name}}</span>
                <Tag :color="typeColor(value.type)" class="tag">{{typeText(value.type)}}</Tag>
            </div>
            <div class="tools">
                <div class="icon col" v-if="value.icon"><Icon :size="16" :type="value.icon" /></div>
                <span class="url col" :title="value.url" @click="expand">
                    <span v-if="value.url">{{value.url}}</span>
                </span>
                <Input v-if="false" style="width:200px;" type="text" size="small" v-model="value.url" />
                <Button
                    v-if="/(0|1|-1)/.test(value.type)" 
                    size="small"
                    type="success" 
                    @click="handlerAdd"
                    title="添加子菜单">
                    <span v-if="value.type === -1">添加顶级菜单</span>
                    <span v-else>添加</span>
                </Button>
                <Button v-if="value.type !== -1" size="small" @click="handlerEdit" type="primary" title="编辑">编辑</Button>
                <Button :loading="deleteLoading" v-if="value.type !== -1" size="small" @click="handlerDel" type="error" title="删除">
                    <span v-if="!deleteLoading">删除</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: Object,
            deleteLoading: false
        },
        methods: {
            expand() {
                if (this.value.children.length > 0) {
                    this.value.expand = !this.value.expand
                }
            },
            handlerAdd() {
                this.$emit('on-add', this.value)
            },
            handlerEdit() {
                this.$emit('on-edit', this.value)
            },
            handlerDel() {
                this.$emit('on-delete', this.value)
            },
            typeText(type) {
                switch(type) {
                    case 0:
                    return '目录'
                    case 1:
                    return '菜单'
                    case -1:
                    return '根目录'
                    default:
                    return '权限'
                }
            },
            typeColor(type) {
                switch(type) {
                    case -1:
                    return 'warning'
                    case 0:
                    return 'primary'
                    case 1:
                    return 'success'
                    default:
                    return 'error'
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .menu-list-item {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        padding-right: 20px;
        .tag {
            margin-left: 10px;
            transform: scale(0.8,0.8)
        }
        cursor: pointer;
        .content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &:hover {
                background: #f0f0f0;
                transition: background 0.3s linear;
            }
            .tools{
                display: flex;
                align-items: center;
                .icon {
                    display: flex;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    border: 1px dashed #ccc;
                    border-radius: 5px;
                    align-items: center;
                    justify-content: center;
                }
                .url {
                    overflow: hidden;
                    width: 200px;
                    font-weight: bold;
                    display: inline-block;
                    margin-left: 10px;
                    margin-right: 50px;
                    height: 26px;
                    line-height: 26px;
                    padding: 0 10px;
                    text-overflow:ellipsis;
                }
                .sort {
                    display: inline-block;
                    width: 60px;
                    font-weight: bold;
                }
                button {
                    display: inline-block;
                    margin-left: 8px;
                    min-width: 40px;
                    text-align: center;
                }
            }
        }
    }
</style>