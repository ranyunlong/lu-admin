<template>
    <Layout style="background: #fff;">
        <div class="top-bar">
            <Button type="primary" @click="showModal = true">云存储配置</Button>
            <Button type="success" @click="showUploadModal = true" icon="md-cloud-upload">上传文件</Button>
        </div>
        <div class="content">
            <Table  @on-selection-change="d => tableSelection = d" highlight-row stripe border size="small" no-data-text="暂无上传文件" :columns="columns" :loading="loading" :data="data"></Table>
        </div>
        <div class="bottom-bar">
            <Button type="error" @click="deleteMany">批量删除</Button>
            <Page :page-size-opts="[5, 10]"  @on-page-size-change="e => limit = e" :total="totalCount" :current.sync="currPage" size="small" show-elevator show-sizer />
        </div>
        <Modal
            :loading="modalLoading"
            title='云存储配置'
            v-model="showModal">
             <Tabs v-model="tabName">
                <TabPane label="七牛" name="qiniu">
                    <Form
                        style="width: 85%"  
                        :label-width="100">
                        <FormItem label="域名">
                            <Input v-model="form.qiniuDomain" placeholder="七牛绑定的域名" />
                        </FormItem>
                        <FormItem label="路径前缀">
                            <Input v-model="form.qiniuPrefix" placeholder="不设置默认为空" />
                        </FormItem>
                        <FormItem label="AccessKey">
                            <Input v-model="form.qiniuAccessKey" placeholder="七牛的AccessKey" />
                        </FormItem>
                        <FormItem label="SecretKey">
                            <Input v-model="form.qiniuSecretKey" placeholder="七牛的SecretKey" />
                        </FormItem>
                        <FormItem label="空间名">
                            <Input v-model="form.qiniuBucketName" placeholder="七牛的存储空间名" />
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="阿里" name="aliyun">
                    <Form
                        style="width: 85%"  
                        :label-width="100">
                        <FormItem label="域名">
                            <Input v-model="form.aliyunDomain" placeholder="阿里云绑定的域名" />
                        </FormItem>
                        <FormItem label="路径前缀">
                            <Input v-model="form.aliyunPrefix" placeholder="不设置默认为空" />
                        </FormItem>
                        <FormItem label="EndPoint">
                            <Input v-model="form.aliyunEndPoint" placeholder="阿里云EndPoint" />
                        </FormItem>
                        <FormItem label="AccessKeyId">
                            <Input v-model="form.aliyunAccessKeyId" placeholder="阿里云AccessKeyId" />
                        </FormItem>
                        <FormItem label="AccessKeySecret">
                            <Input v-model="form.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret" />
                        </FormItem>
                        <FormItem label="BucketName">
                            <Input v-model="form.aliyunBucketName" placeholder="阿里云BucketName" />
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="腾讯" name="qcloud">
                    <Form
                        style="width: 85%"  
                        :label-width="100">
                        <FormItem label="域名">
                            <Input v-model="form.qcloudDomain" placeholder="腾讯云绑定的域名" />
                        </FormItem>
                        <FormItem label="路径前缀">
                            <Input v-model="form.qcloudPrefix" placeholder="不设置默认为空" />
                        </FormItem>
                        <FormItem label="AppId">
                            <Input v-model="form.qcloudAppId" placeholder="腾讯云AppId" />
                        </FormItem>
                        <FormItem label="SecretId">
                            <Input v-model="form.qcloudSecretId" placeholder="腾讯云SecretId" />
                        </FormItem>
                        <FormItem  label="SecretKey">
                            <Input v-model="form.qcloudSecretKey" placeholder="腾讯云SecretKey" />
                        </FormItem>
                        <FormItem label="BucketName">
                            <Input v-model="form.qcloudBucketName" placeholder="腾讯云BucketName" />
                        </FormItem>
                        <FormItem label="Bucket所属地区">
                            <Input v-model="form.qcloudRegion" placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）" />
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
            <template slot="footer">
                <Button @click="showModal=false, modalLoading = false">取消</Button>
                <Button type="primary" :loading="modalLoading" @click="handleOk">确认</Button>
            </template>
        </Modal>
        <Modal 
            title="上传文件"
            v-model="showUploadModal"
            >
            <Upload
                ref="upload"
                type="drag"
                :headers="{
                    token: user.token
                }"
                multiple
                show-upload-list
                with-credentials
                paste
                :on-success="handlerUploadSuccess"
                :on-error="handlerUploadError"
                action="/api/sys/oss/upload">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件到这里上传.</p>
                </div>
            </Upload>
            <div slot="footer">
                <Button type="warning" @click="$refs['upload'].clearFiles()">清空</Button>
                <Button type="error" @click="showUploadModal = false">关闭</Button>
            </div>
        </Modal>
    </Layout>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        data() {
            return {
                loading: false,         // 异步loading状态
                data: [],               // 表格数据
                limit: 10,              // 查询条数限制
                totalCount: 1,          // 后台数据总数
                currPage: 1,            // 当前页码
                showModal: false,       // 模态框
                tabName: 'qiniu',       // 模态框tabName
                modalLoading: false,    // 模态框Loading状态
                showUploadModal: false, // 上传模态框显示状态
                tableSelection: [],     // 表格多选状态
                form: {                 // 表单
                    type: 1,
                    qiniuDomain: "",
                    qiniuPrefix: "",
                    qiniuAccessKey: "",
                    qiniuSecretKey: "",
                    qiniuBucketName: "",
                    aliyunDomain: "",
                    aliyunPrefix: "",
                    aliyunEndPoint: "",
                    aliyunAccessKeyId: "",
                    aliyunAccessKeySecret: "",
                    aliyunBucketName: "",
                    qcloudDomain: "",
                    qcloudPrefix: "",
                    qcloudAppId: "",
                    qcloudSecretId: "",
                    qcloudSecretKey: "",
                    qcloudBucketName: "",
                    qcloudRegion: ""
                },           
                columns: [              // 表头数据
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
                        title: 'URL地址',
                        key: 'url',
                        tooltip: true,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        align: 'center',
                        sortable: true,
                        width: 150
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return h('Button',{
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click:() => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: `您正在删除文件id: <b>${params.row.id}</b>, 确认删除吗？`,
                                            loading: true,
                                            onOk: () => {
                                                this.OSS_DELETE([params.row.id]).then(({data})=> {
                                                    const { code, msg } = data
                                                    if (code === 0) {
                                                        this.$Notice.success({
                                                            title: '成功',
                                                            desc: `已删除!`
                                                        })
                                                        this.getOssList()
                                                        return this.$Modal.remove()
                                                    }
                                                    this.$Modal.remove()
                                                    return this.$Notice.error({
                                                        title: '错误',
                                                        desc: msg
                                                    })
                                                })
                                            }
                                        })
                                    }
                                }
                            },'删除')
                        } 
                    }
                ]
            }
        },
        watch: {
            showModal(v) {
                if (v) this.GET_OSS_CONFIG().then(({data}) => {
                    const { code, msg, config = {} } = data
                    if (code === 0) {
                        this.form = config
                    }
                })
            },
            tabName(v) {
                switch(v) {
                    case 'qiniu':
                    this.form.type = 1
                    break;
                    case 'aliyun':
                    this.form.type = 2
                    break;
                    case 'qcloud':
                    this.form.type = 3
                    break;
                }
            },
            form(v) {
                if (v.type) {
                    if(v.type === 1) {
                        this.tabName = 'qiniu'
                    }
                    if(v.type === 2) {
                        this.tabName = 'aliyun'
                    }
                    if(v.type === 3) {
                        this.tabName = 'qcloud'
                    }
                }
            },
            showUploadModal(v) {
                if (v) this.$refs['upload'].clearFiles()
            }
        },
        created() {
            this.getOssList()
        },
        computed: {
            ...system.mapGetters([
                'user'
            ])
        },
        methods: {
            ...system.mapActions([
                'GET_OSS_CONFIG',
                'GET_OSS_LIST',
                'SAVE_OSS_CONFIG',
                'OSS_DELETE'
            ]),
            handlerUploadSuccess(response, file, fileList) {
                const { code, msg } = response
                if (code === 500) {
                    fileList.splice(fileList.indexOf(file), 1)
                    return this.$Notice.error({
                        title: '错误',
                        desc: msg
                    })
                }
                this.$Notice.success({
                    title: '成功',
                    desc: '文件已上传！'
                })
                this.getOssList()
            },
            handlerUploadError(error, file, fileList) {
                 console.log(1)
                console.log(error)
            },
            deleteMany() {
                const deletes = this.tableSelection.map(k => k.id)
                if (deletes.length > 0) {
                    return this.$Modal.confirm({
                        title: '提示',
                        content: `您正在批量删除文件,确认删除吗？`,
                        loading: true,
                        onOk: () => {
                            this.OSS_DELETE(deletes).then(({data})=> {
                                const { code, msg } = data
                                if (code === 0) {
                                    this.$Notice.success({
                                        title: '成功',
                                        desc: `已删除!`
                                    })
                                    this.getOssList()
                                    return this.$Modal.remove()
                                }
                                this.$Modal.remove()
                                return this.$Notice.error({
                                    title: '错误',
                                    desc: msg
                                })
                            })
                        }
                    })
                }
                this.$Notice.error({
                    title: '错误',
                    desc: '请选择要删除的数据!'
                })
            },
            // 获取上传文件列表
            getOssList() {
                this.GET_OSS_LIST({
                    page: this.currPage,
                    limit: this.limit
                }).then(({data}) => {
                    const { code, msg, page } = data
                    if (code === 0) {
                        const { currPage = 1, list = [], totalCount = 1 } = page
                        this.currPage = currPage
                        this.data = list
                        this.totalCount = totalCount
                    }
                })
            },
            handleOk(){
                this.modalLoading = true
                this.SAVE_OSS_CONFIG(this.form).then(({data}) => {
                    const { code, msg = '' } = data
                    if (code === 0) {
                        this.showModal = false
                        this.$Notice.success({
                            title: '成功',
                            desc: '配置修改成功！'
                        })
                    } else {
                        this.$Notice.error({
                            title: '错误',
                            desc: msg
                        })
                    }
                    this.modalLoading = false
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