<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="username" search placeholder="用户名" />
            <Button type="success" @click="showModal = true, actionType = 'add', modalTitle = '添加管理员'">新增</Button>
        </div>
        <div class="content">
            <Table @on-selection-change="e => tableSelection = e" no-data-text="暂无管理员数据" stripe border size="small" highlight-row :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error" :loading="deleteLoadingState" @click="deleteMany">批量删除</Button>
            <Page :page-size-opts="[5, 10]" @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
        <UserFormModal :action-type="actionType" :data="modalDefaultData" ref="modal" @ok="handlerAction" :title="modalTitle" v-model="showModal" />
    </Layout>
</template>

<script>
    import UserFormModal from './components/UserFormModal'
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        data() {
            return {
                columns: [                      // 表单表头
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'ID',
                        key: 'userId',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '用户名',
                        key: 'username',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        align: 'center'
                    },
                    {
                        title: '手机',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('i-switch', {
                                props: {
                                    value: params.row.status,
                                    disabled: params.row.userId === 1,
                                    trueValue: 1,
                                    falseValue: 0,
                                    loading: params.row.loading,
                                    size: 'large'
                                },
                                on: {
                                    'on-change':(e) => {
                                        this.UPDATE_ADMIN({
                                            ...params.row,
                                            status: e
                                        }).then(res => {
                                            this.data[params.index].status = e
                                            this.$set(this.data[params.index], 'loading', true)
                                            if (res.data.code === 0) {
                                                setTimeout(() => {
                                                    this.data[params.index].loading = false
                                                    this.data[params.index].status = e
                                                    if (e === 1) {
                                                        this.$Notice.success({
                                                            title: `管理员${params.row.username} 已启用`,
                                                            desc: false
                                                        }) 
                                                    } else {
                                                        this.$Notice.warning({
                                                            title: `管理员${params.row.username} 已禁用`,
                                                            desc: false
                                                        }) 
                                                    }
                                                    
                                                }, 500);
                                            } else {
                                                this.data[params.index].status = e === 1 ? 0 : 1;
                                                this.$Message.error('操作失败')
                                            }
                                        }).catch(e => console.log(e))
                                    }
                                }
                            },[
                                h('template', { slot: 'open' }, '启用'),
                                h('template', { slot: 'close' }, '禁用')
                            ])
                        }
                    },
                    {
                        title: '创建时间',
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
                                            this.modalTitle = '修改管理员'
                                        }
                                    }
                                },'修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        loading: params.row.loading,
                                        disabled: params.row.userId === 1
                                    },
                                    on: {
                                        click:(e) => {
                                            this.$set(this.data[params.index], 'loading', true)
                                            this.DELETE_ADMIN([params.row.userId]).then(({data}) => {
                                                const { code, msg} = data
                                                if (code === 0) {
                                                    this.data[params.index].loading = false
                                                    this.$Notice.warning({
                                                        title: params.row.username + '已删除!'
                                                    })
                                                    this.getAdminList()
                                                } else {
                                                    this.data[params.index].loading = false
                                                    this.$Notice.error({
                                                        title: msg
                                                    })
                                                }
                                            }).catch(err => console.log(err))
                                        }
                                    }
                                },'删除')
                            ])
                        }
                    }
                ],
                actionType: '',                 // 表单提交的类型 add 添加数据 edit 编辑数据
                showModal: false,               // 模态框显示状态
                tableSelection: [],             // 表格多选数据
                modalDefaultData: {             // 模态框的默认数据
                    userId: 0,
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    roleIdList: [],
                    status: '1'
                },
                data:[],                        // 表格数据
                currPage: 1,                    // 当前页码
                pageSize: 0,                    // pageSize（暂时没用）
                totalCount: 0,                  // 后台数据总数
                totalPage: 0,                   // 后台页面数据总数
                loading: true,                  // 异步loading状态
                limit: 10,                      // 查询条数限制
                username: '',                   // 搜索框值
                modalTitle: '添加管理员',        // 模态框标题
                deleteLoadingState: false       // 删除按钮状态
            }
        },
        created() {
            this.getAdminList()
        },
        watch: {
            username() {
                this.currPage = 1
                this.getAdminList()
            },
            limit() {
                this.getAdminList()
            },
            currPage() {
                this.getAdminList()
            }
        },
        methods: {
            ...system.mapActions([
                'GET_ADMIN_LIST',
                'UPDATE_ADMIN',
                'ADD_ADMIN',
                'DELETE_ADMIN'
            ]),
            // 处理添加修改请求
            handlerAction(postData) {
                if (this.actionType === 'add') {
                    this.ADD_ADMIN(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getAdminList()
                        } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: msg
                            })
                        }
                    }).catch(err => console.log(err))
                } else if (this.actionType === 'edit') {
                    this.UPDATE_ADMIN(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getAdminList()
                             this.$Notice.success({
                                title: '操作成功'
                            })
                        } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title: msg
                            })
                        }
                    }).catch(err => console.log(err))
                }
            },
            // 获取管理员列表
            getAdminList() {
                this.loading = true
                this.GET_ADMIN_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    username: this.username,
                    order: 'desc'
                }).then(({data}) => {
                    const { list = [], currPage = 1, pageSize = 1, totalCount = 1, totalPage = 1, msg = '' } = data.page
                    if (data.code === 0) {
                        this.data = list
                        this.currPage = currPage
                        this.pageSize = pageSize
                        this.totalCount = totalCount
                        this.totalPage = totalPage
                        this.loading = false
                    } else {
                        this.loading = false
                        this.$Message.error(data.msg);
                    }
                }).catch(err => console.log(err))
            },
            // 批量删除
            deleteMany() {
                const deletes = this.tableSelection.map(k => k.userId)
                if (!!~deletes.indexOf(1)) {
                    return this.$Notice.warning({
                        title: '超级管理员，不能删除！'
                    })
                }
                if (deletes.length === 0) return;
                this.deleteLoadingState = true
                this.DELETE_ADMIN(deletes).then(({data}) => {
                    const { code, message} = data
                    if(code === 0) {
                        this.$Notice.success({
                            title: '批量删除操作成功！'
                        })
                        this.getAdminList()
                        this.deleteLoadingState = false
                    } else {
                        this.deleteLoadingState = false
                        this.$Notice.error({
                            title: '批量删除操作失败！'
                        })
                    }
                })
            }
        },
        components: {
            UserFormModal
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