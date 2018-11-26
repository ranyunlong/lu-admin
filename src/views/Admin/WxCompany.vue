<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="公司名称" />
            <Button type="success" @click="showModal=true, modalTitle='添加公司', actionType='add'">新增</Button>
        </div>
        <div class="content">
            <Table @on-selection-change="d => tableSelection = d" highlight-row stripe border size="small" no-data-text="没有相关日志" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <div></div>
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
                <FormItem prop="comCompany" label="公司名称">
                    <Input v-model="form.comCompany" placeholder="公司名称" />
                </FormItem>
                <FormItem label="公司LOGO">
                    <UploadPic v-model="form.comLogo" />
                </FormItem>
                <FormItem label="公司描述">
                    <Input v-model="form.comLable" type="textarea" placeholder="描述" />
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
                search: '',                     // 搜索框值
                loading: false,                 // 异步loading状态
                data: [],                       // 表格数据
                limit: 10,                      // 查询条数限制
                totalCount: 1,                  // 后台数据总数
                currPage: 1,                    // 当前页码
                tableSelection: [],             // 表格多选列表
                actionType: '',                 // 表单提交方式 add 添加 edit 编辑
                showModal: false,                // 模态框显示状态
                modalTitle: '添加公司',          // 模态框标题
                modalLoading: false,            // 模态框加载状态
                formRule: {                     // 表单验证规则
                    comCompany: [
                        { required: true, message: '公司名称必须', trigger: 'blur' },
                    ]
                },                   
                form: {                         // 表单
                    comId: 0,
                    comCompany: '',
                    comLogo: '',
                    comLable: ''
                },                      
                columns: [                      // 表头数据: value
                    {
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: 'id',
                        key: 'comId',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '公司名称',
                        key: 'comCompany',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '公司logo',
                        key: 'comLogo',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.comLogo) {
                                return h('img', {
                                    domProps: {
                                        src: params.row.comLogo
                                    },
                                    style: {
                                        height: '20px',
                                        display: 'block'
                                    }
                                })
                            }
                        }
                    },
                    {
                        title: '公司描述',
                        key: 'comLable',
                        align: 'center',
                        tooltip: true
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
                                    }
                                },'修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
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
                'WX_COMPANY_LIST',
                'WX_COMPANY_INFO',
                'WX_COMPANY_ADD',
                'WX_COMPANY_UPDATE',
                'WX_COMPANY_DELETE'
            ]),
            getList() {
                this.loading = true
                this.WX_COMPANY_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    companyName: this.search
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
            handlerOk() {
                this.modalLoading = true
                this.WX_COMPANY_ADD(JSON.parse(JSON.stringify(this.form))).then(({data})=> {
                    const { code, msg } = data
                    if (code === 0) {
                        this.$Notice.success({
                            title: '成功',
                            desc: '已添加，相关公司信息!'
                        })
                    } else {
                        this.$Notice.error({
                            title: '错误',
                            desc: msg
                        })
                    }
                    this.modalLoading = false
                    this.form = {
                        comId: 0,
                        comCompany: '',
                        comLogo: '',
                        comLable: ''
                    }
                    this.showModal = false
                    this.getList()
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