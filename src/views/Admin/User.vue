<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="username" search placeholder="用户名" />
            <!-- <Button type="primary">查询</Button> -->
            <Button type="success">新增</Button>
        </div>
        <div class="content">
            <Table  highlight-row :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error">批量删除</Button>
            <Page  :page-size-opts="[10, 20]" @on-page-size-change="e => limit = e" :total="totalCount" current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
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
                                    value: params.row.status === 1 ? true : false
                                },
                                on: {
                                    'on-change':(e) => {
                                        this.UPDATE_ADMIN({
                                            ...params.row,
                                            status: e ? 1 : 0
                                        }).then(res => {
                                            if (res.data.code === 1) {
                                                this.$Message.sucess('操作成功')
                                            }
                                        }).catch(e => console.log(e))
                                    }
                                }
                            })
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
                        key: '',
                        align: 'center'
                    }
                ],
                data:[],
                currPage: 1,
                pageSize: 0,
                totalCount: 0,
                totalPage: 0,
                loading: true,
                limit: 10,
                username: ''
            }
        },
        created() {
            this.getAdminList()
        },
        watch: {
            username() {
                this.getAdminList()
            }
        },
        methods: {
            ...system.mapActions([
                'GET_ADMIN_LIST',
                'UPDATE_ADMIN'
            ]),
            getAdminList() {
                this.loading = true
                this.GET_ADMIN_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    username: this.username
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