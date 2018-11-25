<template>
    <Modal
        v-model="show"
        draggable
        :width='1000'
        footer-hide
        title="任务日志"
        >
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="任务ID" />
        </div>
        <Table 
            highlight-row 
            stripe 
            border 
            size="small" 
            no-data-text="没有相关任务日志" 
            :columns="columns" 
            :loading="loading" 
            :data="data" />
        <Page style="margin-top: 20px;" :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
    </Modal>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        props: {
            value: Boolean
        },
        data() {
            return {
                show: this.value,
                loading: false,
                columns: [
                    {
                        title: 'id',
                        key: 'logId',
                        align:'center',
                        sortable: true,
                        width: 80,
                        fixed: 'left'
                    },
                    {
                        title: '任务id',
                        key: 'jobId',
                        align:'center',
                        sortable: true,
                    },
                    {
                        title: 'bean名称',
                        key: 'beanName',
                        align:'center',
                        sortable: true,
                    },
                    {
                        title: '方法名称',
                        key: 'methodName',
                        align:'center'
                    },
                    {
                        title: '参数',
                        key: 'params',
                        align:'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align:'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: params.row.status === 1 ? 'success' : 'error'
                                }
                            }, params.row.status === 1 ? '成功' : '失败')
                        }
                    },
                    {
                        title: '耗时/毫秒',
                        key: 'times',
                        align:'center',
                        sortable: true,
                    },
                    {
                        title: '执行时间',
                        key: 'createTime',
                        align:'center',
                        width: 150,
                        sortable: true,
                        fixed: 'right'
                    }
                ],
                data: [],
                limit: 10,
                currPage: 1,
                totalCount: 1,
                search: ''
            }
        },
        methods: {
            getList() {
                this.loading = true
                this.GET_SCHEDULE_LOG_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    beanName: this.search
                }).then(({data}) => {
                    const { page, msg, code } = data
                    if (code === 0) {
                        const { currPage, totalCount, list = [] } = page 
                        this.currPage = currPage
                        this.totalCount = totalCount
                        this.data = list
                    }
                    this.loading = false
                })
            },
            ...system.mapActions([
                'GET_SCHEDULE_LOG_LIST'
            ])
        },
        watch: {
            value(v) {
                this.show = v
            },
            show(v) {
                this.$emit('input', v)
                if (v) this.getList() 
            },
            search() {
                this.currPage = 1
                this.getList()
            },
            limit() {
                this.getList()
            },
            currPage() {
                this.getList()
            }
        }
    }
</script>

<style scoped>
.top-bar {
    display: flex;
    margin-bottom: 20px;
}
</style>