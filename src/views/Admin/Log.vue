<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="用户名/用户操作" />
        </div>
        <div class="content">
            <Table highlight-row stripe border size="small" no-data-text="没有相关日志" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <div></div>
            <Page :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        data() {
            return {
                search: '',         // 搜索框值
                loading: false,     // 异步loading状态
                data: [],           // 表格数据
                limit: 10,          // 查询条数限制
                totalCount: 0,      // 后台数据总数
                currPage: 0,        // 当前页码
                columns: [           // 表头数据
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        sortable: true,
                        fixed: 'left',
                        width: 100
                    },
                    {
                        title: '用户',
                        key: 'username',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '请求方法',
                        key: 'method',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '参数',
                        key: 'params',
                        align: 'center',
                        sortable: true,
                        tooltip: true
                    },
                    {
                        title: '执行时长/毫秒',
                        key: 'time',
                        align: 'center',
                        sortable: true,
                        width: 130,
                    },
                    {
                        title: 'ip地址',
                        key: 'ip',
                        align: 'center',
                        width: 130,
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        align: 'center',
                        fixed: 'right',
                        width: 150,
                        sortable: true
                    }
                ]
            }
        },
        watch: {
            limit() {
                this.getLogList({
                    page: this.currPage,
                    limit: this.limit,
                    key: this.search
                })
            },
            currPage(v) {
                this.getLogList({
                    page: this.currPage,
                    limit: this.limit,
                    key: this.search
                })
            },
            search() {
                this.currPage = 1
                this.getLogList({
                    page: this.currPage,
                    limit: this.limit,
                    key: this.search
                })
            }
        }, 
        created() {
            this.currPage = 1
        },
        methods: {
            ...system.mapActions([
                'GET_LOG_LIST'
            ]),
            getLogList(params) {
                this.loading = true
                this.GET_LOG_LIST(params).then(({data}) => {
                    const { code, msg, page }  = data
                    if (code === 0) {
                        const { currPage, list, totalCount } = page
                        this.currPage = currPage
                        this.data = list
                        this.totalCount = totalCount
                    }
                    this.loading = false
                })
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