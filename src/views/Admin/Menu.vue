<template>
    <Layout class="menu">
        <Tree :data="menuList" :render="renderContent"></Tree>
        <MenuFormModal ref="modal" :data="modalDefaultData" :title="modalTitle" @ok="handlerAction" :action-type="actionType" v-model="showModal" />
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    import MenuListItem from './components/MenuListItem'
    import MenuFormModal from './components/MenuFormModal'
    export default {
        data() {
            return {
                data: [],                // 数据列表
                modalTitle: '添加菜单',   // 表单模态框表体
                showModal: false,        // 表单模态框显示状态
                actionType: 'add',       // 表单提交类型 add 添加 edit 编辑
                modalDefaultData: {}     // 表单的默认数据
            }
        },
        created() {
            // 获取菜单列表
            this.GET_MENU_LIST()
        },
        methods: {
            ...system.mapActions([
                'GET_MENU_LIST',
                    'ADD_MENU',
                'UPDATE_MENU',
                'DELETE_MENU',
            ]),
            // 编译菜单树
            renderContent(h, { root, node, data  }) {
                return h(MenuListItem,{
                    props: {
                        value: data,
                        deleteLoading: data.delLaoding
                    },
                    on: {
                        'on-add':(e) => {
                            this.showModal = true
                            this.actionType = 'add'
                            this.modalTitle = '添加菜单'
                            this.modalDefaultData = JSON.parse(JSON.stringify(data))
                        },
                        'on-edit':(e) => {
                            this.showModal = true
                            this.actionType = 'edit'
                            this.modalTitle = '编辑菜单'
                            this.modalDefaultData = JSON.parse(JSON.stringify(data))
                        },
                        'on-delete':(e) => {
                            this.$Modal.confirm({
                                title: '提示',
                                content: `您正在删除菜单，<b>${data.name}</b>，确认删除吗？`,
                                onOk: () => {
                                    this.$set(data, 'delLaoding', true)
                                    const d = data
                                    this.DELETE_MENU(data.menuId).then(({data}) => {
                                        const { code, msg } = data
                                        if (code === 0) {
                                            d.delLaoding = false
                                            this.$Notice.success({
                                                title: '成功',
                                                desc: '删除成功!'
                                            })
                                            this.GET_MENU_LIST()
                                        } else {
                                            d.delLaoding = false
                                            this.$Notice.error({
                                                title: '错误',
                                                desc: msg
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },
            // 处理请求
            handlerAction(postData) {
               if (this.actionType === 'add') {
                   this.ADD_MENU(postData).then(({data}) => {
                       const { code, msg } = data
                       if (code === 0) {
                           this.showModal = false
                            this.$Notice.success({
                                title: '成功',
                                desc: '菜单添加成功！'
                            })
                            this.GET_MENU_LIST()
                       } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: '错误',
                                desc: msg
                            })
                       }
                   })
               } else if(this.actionType === 'edit') {
                   this.UPDATE_MENU(postData).then(({data}) => {
                       const { code, msg } = data
                       if (code === 0) {
                           this.showModal = false
                            this.$Notice.success({
                                title: '成功',
                                desc: '菜单修改成功！'
                            })
                            this.GET_MENU_LIST()
                       } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: '错误',
                                desc: msg
                            })
                       }
                   })
               }
            }
        },
        computed: {
            ...system.mapGetters([
                'menu'
            ]),
            menuList() {
                const menu = JSON.parse(JSON.stringify(this.menu))
                function deep(arr) {
                    if (!Array.isArray(arr)) return;
                    arr.forEach((k) => {
                        k.expand = k.type === -1
                        deep(k.children)
                    })
                }
                deep(menu)
                return [{
                    expand: true,
                    name: '网站',
                    type: -1,
                    children: menu
                }]
            }
        },
        components: {
            MenuListItem,
            MenuFormModal
        }
    }
</script>

<style scoped>
.ivu-layout {
    overflow-y: scroll !important;
    background: #fff;
}
</style>