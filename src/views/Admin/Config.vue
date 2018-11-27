<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="参数名" />
            <Button type="success" @click="showModal = true, modalTitle ='添加参数配置', actionType = 'add'">新增</Button>
        </div>
        <div class="content">
            <Table @on-selection-change="d => tableSelection = d" highlight-row stripe border size="small" no-data-text="没有相关日志" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error" :disabled="loading" @click="deleteMany">批量删除</Button>
            <Page :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
        <ConfigFormModal
            ref="modal"
            v-model="showModal"
            :data="modalDefaultData"
            :title="modalTitle"
            @ok="handlerAction"
            :action-type="actionType" />
    </Layout>
</template>


<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    // ConfigFormModal 表单模态框
    import ConfigFormModal from './components/ConfigFormModal'
    export default {
        data() {
            return {
                search: '',                 // 搜索框值
                loading: false,             // 异步loading状态
                data: [],                   // 表格数据
                limit: 10,                  // 查询条数限制
                totalCount: 0,              // 后台数据总数
                currPage: 1,                // 当前页码
                showModal: false,           // 模态框显示状态
                modalTitle: '',             // 模态框标题
                modalDefaultData: {},       // 模态框的默认数据
                actionType: '',             // 表单提交的类型 add 添加数据 edit 编辑数据
                tableSelection: [],         // 表格多选数据
                columns: [                  // 表头数据
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '参数名',
                        key: 'paramKey',
                        align: 'center',
                    },
                    {
                        title: '参数值',
                        key: 'paramValue',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div',[
                                h('Button',{
                                    props: {
                                        size: 'small',
                                        type: 'success'
                                    },
                                    on: {
                                        click: () =>{
                                            this.showModal = true
                                            this.actionType = 'edit'
                                            this.modalDefaultData = JSON.parse(JSON.stringify(params.row))
                                            this.modalTitle = '修改参数'
                                        }
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }, '修改'),
                                h('Button',{
                                    props: {
                                        size: 'small',
                                        type: 'error',
                                        loading: params.row.loading
                                    },
                                    style: {
                                        width: '40px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `您正在删除参数 ${params.row.paramKey}, 确认删除吗？`,
                                                loading: true,
                                                onOk: () => {
                                                    return this.DELETE_CONFIG([params.row.id]).then(({data}) => {
                                                        this.$Modal.remove()
                                                        const { code, msg } = data
                                                        if (code === 0) {
                                                            this.$Notice.success({
                                                                title: '成功',
                                                                desc: '已删除！'
                                                            })
                                                            return this.getConfigList()
                                                        }
                                                        this.$Notice.error({
                                                            title: '错误',
                                                            desc: msg
                                                        })
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }, params.row.loading ? '' : '删除')
                            ])
                        }
                    }
                ]
            }
        },
        created() {
            // 加载表格数据列表
            this.getConfigList()
        },
        methods: {
            // 处理提交修改请求
            handlerAction(postData) {
                if(this.actionType === 'add') {
                    this.ADD_CONFIG(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                                this.showModal = false
                                this.getConfigList()
                                this.$Notice.success({
                                    title: '成功',
                                    desc: '参数配置已添加！'
                                })
                            } else {
                                this.$Notice.error({
                                    title: '错误',
                                    desc: msg
                                })
                                this.$refs['modal'].clearLoading()
                            }
                    })
                } else if (this.actionType === 'edit') {
                    this.UPDATE_CONFIG(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                                this.showModal = false
                                this.getConfigList()
                                this.$Notice.success({
                                    title: '成功',
                                    desc: '参数配置已修改！'
                                })
                            } else {
                                this.$Notice.error({
                                    title: '错误',
                                    desc: msg
                                })
                                this.$refs['modal'].clearLoading()
                            }
                    })
                }
            },
            // 获取表格数据列表
            getConfigList() {
                this.loading = true
                this.GET_CONFIG_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    paramKey: this.search
                }).then(({data}) => {
                    const { code, msg, page } = data
                    if (code === 0) {
                        const { currPage, totalCount, list } = page
                        this.currPage = currPage
                        this.totalCount = totalCount
                        this.data = list
                    }
                    this.loading = false
                }).catch(err => console.log(err))
            },
            // 批量删除
            deleteMany() {
                const deletes = this.tableSelection.map(k => k.id)
                if (deletes.length > 0) {
                    return this.$Modal.confirm({
                        title: '提示',
                        content: `您正在删除参数 ${this.tableSelection.map(k => `<b>${k.paramKey}</b>`).join('，')}, 确认删除吗？`,
                        loading: true,
                        onOk: () => {
                            return this.DELETE_CONFIG(deletes).then(({data}) => {
                                this.$Modal.remove()
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '批量删除成功！'
                                    })
                                    this.tableSelection = []
                                    return this.getConfigList()
                                }
                                this.$Notice.error({
                                    title: '错误',
                                    desc: msg
                                })
                            })
                        }
                    })
                }
                this.$Notice.error({
                    title: '没有选择数据'
                })
            },
            ...system.mapActions([
                'GET_CONFIG_LIST',
                'ADD_CONFIG',
                'UPDATE_CONFIG',
                'DELETE_CONFIG'
            ])
        },
        watch: {
            currPage() {
                this.getConfigList()
            },
            limit() {
                this.getConfigList()
            },
            search() {
                this.currPage = 1
                this.getConfigList()
            }
        },
        components:{ ConfigFormModal }
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