<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="公司名称" />
            <Button type="success" @click="showModal=true, modalTitle='新增企业家', actionType='add'">新增</Button>
        </div>
        <div class="content">
            <Table @on-selection-change="d => tableSelection = d" highlight-row stripe border size="small" no-data-text="没有相关日志" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error" @click="deleteMany">批量删除</Button>
            <Page :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
        <Modal
            v-model="showModal"
            :title="modalTitle"
            >
            <Form
                ref="iForm" 
                v-if="showModal" 
                :rules="formRule" 
                :model="form" 
                style="width: 85%" 
                :label-width="100"
                >
                <FormItem prop="eentrepreneur" label="姓名">
                    <Input v-model="form.eentrepreneur" placeholder="姓名" />
                </FormItem>
                <FormItem prop="epost" label="职务">
                    <Input v-model="form.epost" placeholder="职务" />
                </FormItem>
            </Form>
            <template slot="footer">
                <Button @click="showModal = false">取消</Button>
                <Button type="primary" :loading="modalLoading" @click="handlerOk">确认</Button>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const wechat = createNamespacedHelpers('wechat')
    export default {
        data() {
            return {
                search: '',             // 搜索框值
                loading: false,         // 异步loading状态
                data: [],               // 表格数据
                limit: 10,              // 查询条数限制
                totalCount: 1,          // 后台数据总数
                currPage: 1,            // 当前页码
                tableSelection: [],     // 表格多选列表
                modalTitle: '',         // 模态框标题
                actionType: '',         // 表单操作类型 add 添加 edit 删除
                showModal: false,       // 模态框显示状态
                formRule: {             // 表单验证规则
                    eentrepreneur: [
                        { required: true, message: '姓名必须', trigger: 'blur' },
                    ],
                    epost: [
                        { required: true, message: '职位必须', trigger: 'blur' },
                    ]
                },
                form: {                 // 表单
                    eid: 0,
                    eentrepreneur: '',
                    epost: ''
                },               
                modalLoading: false,    // 模态框加载状态
                columns: [              // 表头数据: value
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'id',
                        key: 'eid',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '姓名',
                        key: 'eentrepreneur',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '职务',
                        key: 'epost',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modalTitle = '修改企业家'
                                            this.showModal = true
                                            this.actionType = 'edit'
                                            const { eid, eentrepreneur, epost  } = params.row
                                            this.form = {
                                                eid,
                                                eentrepreneur,
                                                epost
                                            }
                                        }
                                    }
                                },'修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                loading: true,
                                                content: `您正在删除企业家<b>${params.row.eentrepreneur}</b>, 确认删除吗？`,
                                                onOk: () => {
                                                    this.WX_ENTREPRENEUR_DELETE([params.row.eid]).then(({data}) => {
                                                        const { code, msg } = data
                                                        this.$Modal.remove()
                                                        if (code === 0) {
                                                            this.$Notice.success({
                                                                title: '成功',
                                                                desc: `企业家<b>${params.row.eentrepreneur}</b>,已删除！`
                                                            })
                                                            return this.getList()
                                                        }
                                                        this.$Notice.error({
                                                            title: '失败',
                                                            desc: msg
                                                        })
                                                    })
                                                }
                                           })
                                        }
                                    }
                                },'删除')
                            ])
                        }
                    }
                ]
            }
        },
        created() {
            this.getList()
        },
        methods: {
            ...wechat.mapActions([
                'WX_ENTREPRENEUR_LIST',
                'WX_ENTREPRENEUR_INFO',
                'WX_ENTREPRENEUR_ADD',
                'WX_ENTREPRENEUR_UPDATE',
                'WX_ENTREPRENEUR_DELETE'
            ]),
            // 获取列表
            getList() {
                this.loading = true
                this.WX_ENTREPRENEUR_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    eName: this.search
                }).then(({data}) => {
                    const { code, msg, page } = data
                    if (code === 0) {
                        const { list = [], currPage, totalCount } = page
                        this.currPage = currPage
                        this.data = list
                        this.totalCount = totalCount
                    }
                    this.loading = false
                })
            },
            // 批量删除
            deleteMany() {
                const deletes = this.tableSelection.map(k => k.eid)
                if (deletes.length === 0) return this.$Notice.error({
                    title: '错误',
                    desc: '请选择要删除的企业家!'
                })
                this.$Modal.confirm({
                    title: '提示',
                    content: `您正在删除企业家 ${this.tableSelection.map(k => `<b>${k.eentrepreneur}</b>`).join('，')} 确认删除吗？`,
                    loading: true,
                    onOk:() => {
                        this.WX_ENTREPRENEUR_DELETE(deletes).then(({data}) => {
                            const { code, msg } = data
                            if (code === 0) {
                                this.$Modal.remove()
                                this.$Notice.success({
                                    title: '成功',
                                    desc: `企业家 ${this.tableSelection.map(k => `<b>${k.eentrepreneur}</b>`).join('，')} 已删除！`
                                })
                                return this.getList()
                            }
                            this.$Notice.error({
                                title: '失败',
                                desc: msg
                            })
                        })
                    }
                })
            },
            // 新增 编辑操作
            handlerOk() {
                this.$refs['iForm'].validate((valid) => {
                    if (valid) {
                         if (this.actionType === 'add') {
                            this.modalLoading = true
                            this.WX_ENTREPRENEUR_ADD(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已添加相关企业家信息!'
                                    })
                                } else {
                                    this.$Notice.error({
                                        title: '错误',
                                        desc: msg
                                    })
                                }
                                this.modalLoading = false
                                this.showModal = false
                                this.getList()
                            })
                        } else if (this.actionType === 'edit') {
                            this.modalLoading = true
                            this.WX_ENTREPRENEUR_UPDATE(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已更新相关企业家信息!'
                                    })
                                } else {
                                    this.$Notice.error({
                                        title: '错误',
                                        desc: msg
                                    })
                                }
                                this.modalLoading = false
                                this.showModal = false
                                this.getList()
                            })
                        }
                    }
                })
            }
        },
        watch: {
            currPage() {
                this.getList()
            },
            limit() {
                this.getList()
            },
            search() {
                this.currPage = 1
                this.getList()
            },
            showModal(v) {
                if (!v) {
                    this.form = {
                        eid: 0,
                        eentrepreneur: '',
                        epost: ''
                    }
                    this.modalLoading = false
                }                
            }
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