<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="bean名称" />
            <Button type="success" @click="showModal = true, modalTitle = '新建任务', actionType = 'add'">新建任务</Button>
        </div>
        <div class="content">
            <Table highlight-row stripe border size="small" no-data-text="没有相关定时任务" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <div>
                <Button type="primary" @click="handleAction(null, SCHEDULE_RUN)">批量立即运行</Button>
                <Button type="success"  @click="handleAction(null, SCHEDULE_RESUME)">批量恢复</Button>
                <Button type="error"  @click="handleAction(null, DELETE_SCHEDULE)">批量删除</Button>
                <Button type="warning"  @click="handleAction(null, SCHEDULE_PAUSE)">批量停止</Button>
            </div>
            <Page :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
            <JobScheduleFormModal
                ref="modal"
                v-model="showModal"
                :data="modalDefaultData"
                :title="modalTitle"
                @ok="handlerAction"
                :action-type="actionType" />
        </div>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    import JobScheduleTool from './components/JobScheduleTool'
    import JobScheduleFormModal from './components/JobScheduleFormModal'
    export default {
        data() {
            return {
                search: '',
                loading: false,
                showModal: false,
                data: [],
                limit: 10,
                totalCount: 0,
                currPage: 0,
                actionLoading: false,
                selecteAll: false,
                modalTitle: '',
                actionType: '',
                modalDefaultData: {},
                columns: [
                    {
                        renderHeader: (h, params) => {
                            return h('Checkbox',{
                                on: {
                                    'on-change': (e) => {
                                        this.data.forEach(k => k.selected = e)
                                    }
                                }
                            })
                        },
                        value: false,
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
                        key: 'jobId',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: 'bean名称',
                        key: 'beanName',
                        align: 'center',
                    },
                    {
                        title: '方法名称',
                        key: 'methodName',
                        align: 'center',
                    },
                    {
                        title: '参数',
                        key: 'params',
                        align: 'center',
                    },
                    {
                        title: 'cron表达式',
                        key: 'cronExpression',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.status === 0 ? 'success' : 'defalut',
                                    type: 'dot',
                                    fade: true
                                }
                            }, params.row.status === 0 ? '运行' : '暂停')
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 260,
                        render: (h, params) => {
                            return h(JobScheduleTool, {
                                props: {
                                    state: params.row.state
                                },
                                on: {
                                    run:() => {
                                        this.data[params.index].state.run = true
                                        this.handleAction(params.row.jobId, this.SCHEDULE_RUN, ()=> {
                                            this.data[params.index].state.run = false
                                            this.$Notice.success({
                                                title: '运行成功！'
                                            })
                                        })
                                    },
                                    update:() => {
                                        this.showModal = true
                                        this.actionType = 'edit'
                                        this.modalTitle = '修改任务'
                                        this.modalDefaultData = JSON.parse(JSON.stringify(params.row))
                                    },
                                    resume:() => {
                                        this.data[params.index].state.resume = true
                                        this.handleAction(params.row.jobId, this.SCHEDULE_RESUME, ()=> {
                                            this.data[params.index].state.resume = false
                                            this.$Notice.success({
                                                title: '恢复成功！'
                                            })
                                        })
                                    },
                                    pause:() => {
                                        this.data[params.index].state.pause = true
                                        this.handleAction(params.row.jobId, this.SCHEDULE_PAUSE, ()=> {
                                            this.data[params.index].state.pause = false
                                            this.$Notice.success({
                                                title: '暂停成功！'
                                            })
                                        })
                                    },
                                    delete:() => {
                                        this.data[params.index].state.delete = true
                                        this.handleAction(params.row.jobId, this.DELETE_SCHEDULE, ()=> {
                                            this.data[params.index].state.delete = false
                                            this.$Notice.success({
                                                title: '删除成功！'
                                            })
                                        })
                                    }
                                }
                            })
                        }
                    }
                ]
            }
        },
        watch: {
            limit() {
                this.getScheduleList()
            },
            currPage() {
                this.getScheduleList()
            },
            search() {
                this.getScheduleList()
            }
        },
        created() {
            this.getScheduleList()
        },
        methods: {
            ...system.mapActions([
                'GET_SCHEDULE_LIST',
                'GET_SCHEDULE_INFO',
                'SCHEDULE_PAUSE',
                'SCHEDULE_RUN',
                'SCHEDULE_RESUME',
                'ADD_SCHEDULE',
                'UPDATE_SCHEDULE',
                'DELETE_SCHEDULE'
            ]),
            //处理新增编辑
            handlerAction(postData) {
                if (this.actionType === 'add') {
                    this.ADD_SCHEDULE(postData).then(({data})=> {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getScheduleList()
                            this.$Notice.success({
                                title: '任务添加成功！'
                            })
                        } else {
                            this.$Notice.error({
                                title: msg
                            })
                            this.$refs['modal'].clearLoading()
                        }
                    })
                } else if (this.actionType === 'edit') {
                    this.UPDATE_SCHEDULE(postData).then(({data})=> {
                        const { code, msg } = data
                        if (code === 0) {
                            this.showModal = false
                            this.getScheduleList()
                            this.$Notice.success({
                                title: '任务修改成功！'
                            })
                        } else {
                            this.$Notice.error({
                                title: msg
                            })
                            this.$refs['modal'].clearLoading()
                        }
                    })
                }
            },
            // 处理恢复
            handleAction(jobId, actionType, callback) {
                let jobIds = []
                if (jobId) {
                    jobIds.push(jobId)
                    
                } else {
                    jobIds = this.selectes
                }

                if(jobIds.length === 0) {
                    this.$Notice.error({
                        title: '未选择任何操作选项！'
                    })
                    return;
                }
                actionType(jobIds).then(({data}) => {
                    const { code, msg } = data
                    if (code === 0) {
                        this.getScheduleList()
                        if (typeof callback === 'function') {
                            callback()
                        } else {
                            this.$Notice.success({
                                title: '批量处理成功！'
                            })
                        }
                    } else {
                        this.$Notice.error({
                            title: msg
                        })
                    }
                })
            },
            getScheduleList() {
                this.loading = true
                this.GET_SCHEDULE_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    beanName: this.search
                }).then(({data}) => {  
                    const { code, page, msg } = data
                    if (code === 0) {
                        const { currPage = 0, totalCount = 0, list = [] } = page
                        this.data = list.map(k => {
                            k.selected = false
                            k.state = {
                                run: false,
                                pause: false,
                                update: false,
                                delete: false,
                                resume: false
                            }
                            return k
                        })
                        this.currPage = currPage
                        this.totalCount = totalCount
                    }
                    this.loading = false
                })
            }
        },
        computed: {
            selectes() {
                return this.data.filter(k => k.selected).map(k => k.jobId)
            }
        },
        components: {
            JobScheduleFormModal
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