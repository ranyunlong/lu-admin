<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Input style="width: 200px;" clearable v-model="search" search placeholder="参数名" />
            <Button type="success" @click="showModal = true, modalTitle ='添加参数配置', actionType = 'add'">新增</Button>
        </div>
        <div class="content">
            <Table highlight-row stripe border size="small" no-data-text="没有相关日志" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error">批量删除</Button>
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
    import ConfigFormModal from './components/ConfigFormModal'
    export default {
        data() {
            return {
                search: '',
                loading: false,
                data: [],
                limit: 10,
                totalCount: 0,
                currPage: 1,
                showModal: false,
                modalTitle: '',
                modalDefaultData: {},
                actionType: '',
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '参数名',
                        key: 'key',
                        align: 'center',
                    },
                    {
                        title: '参数值',
                        key: 'value',
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
                    }
                ]
            }
        },
        created() {
            this.getConfigList()
        },
        methods: {
            handlerAction(postData) {
                if(this.actionType === 'add') {
                    console.log(postData)
                    this.ADD_CONFIG(postData).then(({data}) => {
                        const { code, msg } = data
                        if (code === 0) {
                                this.showModal = false
                                this.getConfigList()
                                this.$Notice.success({
                                    title: '参数配置添加成功！'
                                })
                            } else {
                                this.$Notice.error({
                                    title: msg
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
                                    title: '参数配置添加成功！'
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
            getConfigList() {
                this.loading = true
                this.GET_CONFIG_LIST({
                    page: this.currPage,
                    limit: this.limit,
                    key: this.search
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
            ...system.mapActions([
                'GET_CONFIG_LIST',
                'ADD_CONFIG',
                'UPDATE_CONFIG',
                'DELETE_CONFIG'
            ])
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