<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="角色名称" />
            <Button type="success" @click="showModal = true, actionType = 'add', modalTitle = '新增角色'">新增</Button>
        </div>
        <div class="content">
            <Table @on-selection-change="d => tableSelection = d" no-data-text="暂无权限数据" stripe border size="small" highlight-row :columns="columns" :loading="loading" :data="data"></Table>
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
                search: '',                     // 搜索框值
                actionType: '',                 // 表单提交的类型 add 添加数据 edit 编辑数据
                showModal: false,               // 模态框显示状态
                loading: false,                 // 异步loading状态
                limit: 10,                      // 查询条数限制
                totalCount: 0,                  // 后台数据总数
                currPage: 1,                    // 当前页码
                modalDefaultData: {},           // 模态框的默认数据
                modalTitle: '',                 // 模态框标题
                tableSelection: [],             // 表格多选数据
                columns: [                      // 表格数据
                    {
                        type: 'selection',
                        width: 50
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
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `您正在删除角色 ${params.row.roleName}, 确认删除吗？`,
                                                loading: true,
                                                onOk: () => {
                                                    this.DELETE_ROLE([params.row.roleId]).then(({data}) => {
                                                        this.$Modal.remove()
                                                        const { code, msg} = data
                                                        if (code === 0) {
                                                            this.$Notice.warning({
                                                                title: '成功',
                                                                desc: `角色 ${params.row.roleName} 已删除!`
                                                            })
                                                            this.getRoleList()
                                                        } else {
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
                                },'删除')
                            ])
                        }
                    }
                ],
                data: []                        // 表格列表
            }
        },
        created() {
            // 获取权限列表
            this.getRoleList()
        },
        watch: {
            search() {
                this.currPage = 1
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
            // 获取权限列表
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
            // 批量删除
            deleteMany() {
                 this.$Modal.confirm({
                    title: '提示',
                    content: `您正在删除角色 ${this.tableSelection.map(k => `<b>${k.roleName}</b>`).join('，')}, 确认删除吗？`,
                    loading: true,
                    onOk: () => {
                        const deletes = this.tableSelection.map(k => k.roleId)
                        this.DELETE_ROLE(deletes).then(({data}) => {
                            this.$Modal.remove()
                            const { code, msg} = data
                            if (code === 0) {
                                this.$Notice.warning({
                                    title: '成功',
                                    desc: '批量删除成功!'
                                })
                                this.getRoleList()
                                this.tableSelection = []
                            } else {
                                this.$Notice.error({
                                    title: '错误',
                                    desc: msg
                                })
                            }
                        })
                    }
                })
            },
            // 处理添加删除请求
            handlerAction(postData) {
                if (this.actionType === 'add') {
                    this.ADD_ROLE(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getRoleList()
                            this.$Notice.success({
                                title: '成功',
                                desc: '角色添加成功！'
                            })
                        } else {
                            this.$refs['modal'].cancelLoading()
                            this.$Notice.error({
                                title:'错误',
                                desc: msg
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
                                title: '成功',
                                desc: '角色修改成功！'
                            })
                        }  else {
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