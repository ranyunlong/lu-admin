<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="角色名称" />
            <!-- <Button type="primary">查询</Button> -->
            <Button type="success" @click="showModal = true, actionType = 'add', modalTitle = '新增角色'">新增</Button>
        </div>
        <div class="content">
            <Table  no-data-text="暂无权限数据" stripe border size="small" highlight-row :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error" :loading="deleteLoadingState" @click="deleteMany">批量删除</Button>
            <Page :page-size-opts="[5, 10]" @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
        <RoleFormModal 
            :title="modalTitle" 
            :action-type="actionType" 
            :data="modalDefaultData" 
            ref="modal" 
            @ok="handlerAction" 
            v-model="showModal"/>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    import RoleFormModal from './components/RoleFormModal'
    export default {
        data() {
            return {
                search: '',
                actionType: '',
                showModal: false,
                loading: false,
                limit: 10,
                totalCount: 0,
                currPage: 1,
                deleteLoadingState: false,
                modalDefaultData: {},
                modalTitle: '',
                columns: [
                    {
                        renderHeader: (h) => {
                            return h('Checkbox', {
                                on: {
                                    'on-change': (e) => {
                                        this.data.forEach(k => k.selected = e)
                                    }
                                }
                            })
                        },
                        width: 60,
                        align: 'center',
                        key: 'selected',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                    value: params.row.selected
                                },
                                on: {
                                    'on-change':(e) => {
                                        this.data[params.index].selected = e
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: 'ID',
                        key: 'roleId',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '操作',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click:() => {
                                            this.actionType = 'edit'
                                            this.modalDefaultData = JSON.parse(JSON.stringify(params.row))
                                            this.showModal = true
                                            this.modalTitle = '修改角色'
                                        }
                                    }
                                },'修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        loading: params.row.loading,
                                    },
                                    on: {
                                        click:(e) => {
                                            this.$set(this.data[params.index], 'loading', true)
                                            this.DELETE_ROLE([params.row.roleId]).then(({data}) => {
                                                const { code, msg} = data
                                                if (code === 0) {
                                                    this.data[params.index].loading = false
                                                    this.$Notice.warning({
                                                        title: params.row.roleName + '已删除!'
                                                    })
                                                    this.getRoleList()
                                                } else {
                                                    this.data[params.index].loading = false
                                                    this.$Notice.error({
                                                        title: msg
                                                    })
                                                }
                                            })
                                        }
                                    }
                                },'删除')
                            ])
                        }
                    }
                ],
                data: []
            }
        },
        created() {
            this.getRoleList()
        },
        watch: {
            search() {
                this.getRoleList()
            },
            currPage() {
                this.getRoleList()
            },
            limit() {
                this.getRoleList()
            }
        },
        methods: {
            ...system.mapActions([
                'GET_ROLE_LIST',
                'ADD_ROLE',
                'UPDATE_ROLE',
                'DELETE_ROLE'
            ]),
            getRoleList() {
                this.loading = true
                this.GET_ROLE_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    order: 'desc',
                    roleName: this.search
                }).then(({data})=>{
                    const { code = 500, msg = '', page = {} } = data
                    if (code === 0) {
                        const { currPage = 1, list = [], totalCount = 1 } = page
                        this.currPage = currPage
                        this.data = list.map(k => {
                            k.selected = false
                            return k
                        })
                        this.totalCount = totalCount
                    }
                    this.loading = false
                }).catch()
            },
            deleteMany() {
                this.deleteLoadingState = true
                const deletes = this.data.filter(k => k.selected).map(k => k.roleId)
                this.DELETE_ROLE(deletes).then(({data}) => {
                    const { code, msg} = data
                    if (code === 0) {
                        this.deleteLoadingState = true
                        this.$Notice.warning({
                            title: '批量删除成功!'
                        })
                        this.getRoleList()
                    } else {
                        this.deleteLoadingState = true
                        this.$Notice.error({
                            title: msg
                        })
                    }
                })
            },
            handlerAction(postData) {
                if (this.actionType === 'add') {
                    this.ADD_ROLE(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getRoleList()
                            this.$Notice.success({
                                title: '角色添加成功！'
                            })
                        } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: msg
                            })
                        }
                    }).catch(err => console.log(err))
                } else if (this.actionType === 'edit') {
                    this.UPDATE_ROLE(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getRoleList()
                            this.$Notice.success({
                                title: '角色修改成功！'
                            })
                        }  else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: msg
                            })
                        }
                    })
                }
            }
        },
        components: {
            RoleFormModal
        }
    }
</script>

<style scoped lang="less">
    .top-bar {
        display: flex;
        button{
            margin-left: 15px;
        }
    }
    .content {
        margin-top: 20px;
    }
    .bottom-bar {
        margin-top: 20px;
        user-select: none;
        display: flex;
        justify-content: space-between;
    }
</style>