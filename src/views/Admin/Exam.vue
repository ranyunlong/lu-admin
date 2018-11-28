<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <DatePicker type="datetime" @on-change="date => beforTime = date" placeholder="开始日期和时间" style="width: 160px"></DatePicker>
            <DatePicker type="datetime" @on-change="date => afterTime = date" placeholder="结束日期和时间" style="width: 160px; margin-left: 10px;"></DatePicker>
            <Button type="success" @click="showModal=true, modalTitle='新增考场', actionType='add'">新增</Button>
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
                <FormItem prop="miWebexNumber" label="编号">
                    <Input v-model="form.miWebexNumber" placeholder="考场编号" />
                </FormItem>
                <FormItem prop="miWebexUrl" label="地址">
                    <Input v-model="form.miWebexUrl" placeholder="考场地址" />
                </FormItem>
                <FormItem prop="miWebexUrl" label="密码">
                    <Input v-model="form.miPassword" placeholder="考场密码" />
                </FormItem>
                <FormItem prop="miWebexUrl" label="时间">
                    <Input v-model="form.miOrdertime" placeholder="考场时间" />
                </FormItem>
                <FormItem label="名额">
                    <Input placeholder="考场名额" />
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
    export default {
        data() {
            return {
                beforTime: '',          // 搜索框结束时间
                afterTime: '',          // 搜索框开始时间
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
                    miWebexNumber: [
                        { required: true, message: '考场名称必须', trigger: 'blur' },
                    ],
                    miWebexUrl: [
                        { required: true, message: '考场地址必须', trigger: 'blur' },
                    ],
                    miPassword: [
                        { required: true, message: '考场密码必须', trigger: 'blur' },
                    ],
                    miOrdertime: [
                        { required: true, message: '考场时间必须', trigger: 'blur' },
                    ]
                },                   
                form: {                         // 表单
                    miId: 0,
                    miWebexNumber: '',
                    miWebexUrl: '',
                    miPassword: '',
                    miOrdertime: ''
                },     
                columns: [              // 表头数据: value
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'id',
                        key: 'miId',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '编号',
                        key: 'miWebexNumber',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '考场地址',
                        key: 'miWebexUrl',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '考场密码',
                        key: 'miPassword',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '考场时间',
                        key: 'miOrdertime',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '考场名额',
                        key: '',
                        align: 'center',
                    },
                    {
                        title: '已报名人数',
                        key: '',
                        align: 'center',
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
                                            this.modalTitle = '修改考场'
                                            this.showModal = true
                                            this.actionType = 'edit'
                                            const { miId, miWebexNumber, miWebexUrl, miPassword, miOrdertime  } = params.row
                                            this.form = {
                                                miId,
                                                miWebexNumber,
                                                miWebexUrl, 
                                                miPassword, 
                                                miOrdertime
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
                                                content: `您正在删除考场<b>${params.row.miWebexNumber}</b>, 确认删除吗？`,
                                                onOk: () => {
                                                    this.EXAM_DELETE([params.row.miId]).then(({data}) => {
                                                        const { code, msg } = data
                                                        this.$Modal.remove()
                                                        if (code === 0) {
                                                            this.$Notice.success({
                                                                title: '成功',
                                                                desc: `考场<b>${params.row.miWebexNumber}</b>,已删除！`
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
                'EXAM_LIST',
                'EXAM_INFO',
                'EXAM_ADD',
                'EXAM_UPDATE',
                'EXAM_DELETE'
            ]),
            getList() {
                this.loading = true
                this.EXAM_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    beforTime: this.beforTime,
                    afterTime: this.afterTime
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
                const deletes = this.tableSelection.map(k => k.miId)
                if (deletes.length === 0) return this.$Notice.error({
                    title: '错误',
                    desc: '请选择要删除的考场!'
                })
                this.$Modal.confirm({
                    title: '提示',
                    content: `您正在删除考场 ${this.tableSelection.map(k => `<b>${k.miWebexNumber}</b>`).join('，')} 确认删除吗？`,
                    loading: true,
                    onOk:() => {
                        this.EXAM_DELETE(deletes).then(({data}) => {
                            const { code, msg } = data
                            if (code === 0) {
                                this.$Modal.remove()
                                this.$Notice.success({
                                    title: '成功',
                                    desc: `考场 ${this.tableSelection.map(k => `<b>${k.miWebexNumber}</b>`).join('，')} 已删除！`
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
                            this.EXAM_ADD(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已添加相关考场信息!'
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
                            this.EXAM_UPDATE(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: '已更新相关考场信息!'
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
            beforTime() {
                this.currPage = 1
                this.getList()
            },
            afterTime() {
                this.currPage = 1
                this.getList()
            },
            showModal(v) {
                if (!v) {
                    this.form = {
                        miWebexNumber: '',
                        miWebexUrl: '',
                        miPassword: '',
                        miOrdertime: ''
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