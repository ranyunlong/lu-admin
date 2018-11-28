<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="名称" />
            <Button type="success" @click="showModal=true, modalTitle='新增二维码', actionType='add'">新增</Button>
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
                <FormItem prop="qrDesc" label="名称">
                    <Input v-model="form.qrDesc" placeholder="名称" />
                </FormItem>
                <FormItem prop="qrUrl" label="二维码">
                    <UploadPic v-model="form.qrUrl" />
                </FormItem>
                <FormItem prop="qrTime" label="有效期至">
                    <DatePicker :value="form.qrTime" @on-change="e => form.qrTime = e" type="datetime" placeholder="请选择日期和时间"></DatePicker>
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
    const teach = createNamespacedHelpers('teach')
    const system = createNamespacedHelpers('system')
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
                actionType: '',                 // 表单提交方式 add 添加 edit 编辑
                showModal: false,                // 模态框显示状态
                modalTitle: '添加公司',          // 模态框标题
                modalLoading: false,            // 模态框加载状态
                formRule: {                     // 表单验证规则
                    qrUrl: [
                        { required: true, message: '二维码必须', trigger: 'blur' },
                    ],
                    qrDesc: [
                        { required: true, message: '名称必须', trigger: 'blur' },
                    ],
                    qrTime: [
                        { required: true, message: '有效期必须', trigger: 'blur' },
                    ]
                },                   
                form: {                         // 表单
                    qrId: 0,
                    qrUrl: '',
                    qrTime: '',
                    qrDesc: ''
                },     
                columns: [              // 表头数据: value
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'id',
                        key: 'qrId',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '名称',
                        key: 'qrDesc',
                        align: 'center',
                        sortable: true,
                        tooltip: true
                    },
                    {
                        title: '二维码',
                        key: 'qrUrl',
                        align: 'center',
                        tooltip: true,
                        render: (h, params) => {
                            let url = params.row.qrUrl
                            if (/\?/g.test(url)) {
                                url += '&token=' + this.user.token
                            }
                            return h('div', {
                                style: {
                                    'white-space': 'nowrap',
                                    'text-overflow':'ellipsis',
                                    'overflow':'hidden'
                                }
                            }, [
                                h('Poptip', {
                                    props: {
                                        placement: 'top-start',
                                        content: '查看大图',
                                        width: 150,
                                        transfer: true,
                                        trigger: "hover"
                                    }
                                }, [
                                    h('span', params.row.qrUrl),
                                    h('div', {
                                        slot: 'content'
                                    },[
                                        h('img', {
                                            domProps: {
                                                src: url
                                            },
                                            style: {
                                                width: '100%'
                                            }
                                        })
                                    ])
                                ])
                            ])
                        }
                    },
                    {
                        title: '有效期',
                        key: 'qrTime',
                        align: 'center',
                        tooltip: true,
                        sortable: true
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
                                            this.modalTitle = '修改二维码'
                                            this.showModal = true
                                            this.actionType = 'edit'
                                            const { qrId, qrUrl, qrDesc, qrTime  } = params.row
                                            this.form = {
                                                qrId,
                                                qrUrl,
                                                qrDesc,
                                                qrTime
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
                                                content: `您正在删除二维码<b>${params.row.qrUrl}</b>, 确认删除吗？`,
                                                onOk: () => {
                                                    this.QRCODE_DELETE([params.row.qrId]).then(({data}) => {
                                                        const { code, msg } = data
                                                        this.$Modal.remove()
                                                        if (code === 0) {
                                                            this.$Notice.success({
                                                                title: '成功',
                                                                desc: `二维码<b>${params.row.qrUrl}</b>,已删除！`
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
            ...teach.mapActions([
                'QRCODE_LIST',
                'QRCODE_INFO',
                'QRCODE_ADD',
                'QRCODE_UPDATE',
                'QRCODE_DELETE'
            ]),
            getList() {
                this.loading = true
                this.QRCODE_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    qrDesc: this.search
                }).then(({data}) => {
                    const { code, msg, page } = data
                    if (code === 0) {
                        const { list = [], currPage, totalCount } = page
                        this.currPage = currPage
                        this.data = list.map(k => {
                            if (/^\/renren-fast/.test(k.qrUrl)) {
                                k.qrUrl = location.protocol + '//' + location.host + k.qrUrl.replace(/^\/renren-fast/, '/api')
                            }
                            return k
                        })
                        this.totalCount = totalCount
                    }
                    this.loading = false
                })
            },
            // 批量删除
            deleteMany() {
                const deletes = this.tableSelection.map(k => k.qrId)
                if (deletes.length === 0) return this.$Notice.error({
                    title: '错误',
                    desc: '请选择要删除的二维码!'
                })
                this.$Modal.confirm({
                    title: '提示',
                    content: `您正在删除二维码 ${this.tableSelection.map(k => `<b>${k.qrUrl}</b>`).join('，')} 确认删除吗？`,
                    loading: true,
                    onOk:() => {
                        this.QRCODE_DELETE(deletes).then(({data}) => {
                            const { code, msg } = data
                            if (code === 0) {
                                this.$Modal.remove()
                                this.$Notice.success({
                                    title: '成功',
                                    desc: `二维码 ${this.tableSelection.map(k => `<b>${k.qrUrl}</b>`).join('，')} 已删除！`
                                })
                                this.tableSelection = []
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
                            this.QRCODE_ADD(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已添加相关二维码信息!'
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
                            this.QRCODE_UPDATE(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已更新相关二维码信息!'
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
                        qrId: 0,
                        qrUrl: '',
                        qrDesc: '',
                        qrTime: ''
                    }
                    this.modalLoading = false
                }                
            }
        },
        computed: {
            ...system.mapGetters([
                'user'
            ])
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