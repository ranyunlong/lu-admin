<template>
    <Modal 
        :title="title"
        :ok-text="okText"
        :cancel-text="cancelText"
        v-model="show"
        :scrollable="scrollable"
        :width="width"
        :fullscreen="fullscreen"
        >
        <Form ref="iForm" v-if="show" :rules="formRule" :model="form" style="width: 85%" :label-width="100">
            <FormItem label="账号" prop="username">
                <i-input v-model="form.username" clearable placeholder="请输入账号" type="text">
                        <span slot="prepend">
                            <Icon type="md-person" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <i-input 
                    v-model="form.password" 
                    clearable 
                    :placeholder="actionType === 'add' ? '请输入密码' : '不填写不更新密码'" 
                    type="password">
                        <span slot="prepend">
                            <Icon type="md-lock" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <i-input v-model="form.email" clearable placeholder="请输入邮箱" type="email">
                        <span slot="prepend">
                            <Icon type="md-mail" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="手机" prop="mobile">
                <i-input v-model="form.mobile" clearable placeholder="请输入手机" type="email">
                        <span slot="prepend">
                        <Icon type="md-phone-portrait" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="角色">
                <CheckboxGroup v-model="form.roleIdList">
                    <Checkbox 
                        :label="item.roleId"
                        v-for="item in roleList"
                        :key="item.roleId"
                        >
                        <span>{{item.roleName}}</span>
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="状态">
                <i-switch :disabled="form.userId === 1" :true-value="1" :false-value="0" v-model="form.status" size="large">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                </i-switch>
            </FormItem>
        </Form>
        <template slot="footer">
            <Button @click="show = false, $emit('cancel'), handlerClear()">取消</Button>
            <Button type="primary" :loading="loading" @click="handlerOk">确认</Button>
        </template>
    </Modal>
</template>

<script>
    import { createNamespacedHelpers  } from 'vuex'
    import { MobilePhone } from '@/utils/validators'
    const system = createNamespacedHelpers('system')
    export default {
        props: {
            value: Boolean,
            scrollable: Boolean,
            fullscreen: Boolean,
            draggable: Boolean,
            width: [Number, String],
            data: Object,
            actionType: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            okText: {
                type: String,
                default: '确认'
            },
            cancelText: {
                type: String,
                default: '取消'
            }
        },
        data() {
            return {
                show: this.value,
                loading: false,
                form: {
                    userId: 0,
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    roleIdList: [],
                    status: 1
                },
                roleList: [],
                formRule: {
                    username: [
                        { required: true, message: '用户名必须', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '密码必须', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱必须', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '手机必须', trigger: 'blur' },
                        { validator: MobilePhone, locale:'zh-CN',  message: '手机格式不正确',  trigger: 'blur'  }
                    ]
                }
            }
        },
        created() {
            this.GET_ROLE_SELECT().then(({data = {}}) => {
                const { code, list = [] } = data
                if (code === 0) {
                    this.roleList = list
                }
            }).catch(e => console.log(e))
        },
        watch: {
            show(v) {
                this.$emit('input', v)
                if (!v) {
                    this.handlerClear()
                }
            },
            actionType(v) {
                if (v === 'add') {
                    this.formRule.password[0].required = true
                } else {
                    this.formRule.password[0].required = false
                }
            },
            value(v){
                this.show = v
            },
            data(v = {}) {
                const { salt, userId = 0, username = '', password = '', email = '', mobile = '', roleIdList =[], status = 1 } = v
                this.form.roleIdList = roleIdList ? roleIdList : []
                this.form.salt = salt
                this.form.mobile = mobile
                this.form.email = email
                this.form.userId = userId
                this.form.username = username
                this.form.status = status
                this.GET_ADMIN_INFO(userId).then(({data}) => {
                    const { code, user, msg } = data
                    if (code === 0) {
                        const { roleIdList = [], salt = '', mobile = '', email = '', userId = 0, username = '', status = 1 } = user
                        this.form.roleIdList = roleIdList
                        this.form.salt = salt
                        this.form.mobile = mobile
                        this.form.email = email
                        this.form.userId = userId
                        this.form.username = username
                        this.form.status = status
                    } else {
                        this.show = false
                        this.$Notice.error({
                            title: msg
                        })
                    }
                })
            }
        },
        computed: {
            parseForm() {
                return JSON.parse(JSON.stringify(this.form))
            }
        },
        methods: {
            handlerOk() {
                this.$refs['iForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$emit('ok', this.parseForm)
                    }
                })
            },
            handlerClear() {
                // 清除历史数据
                this.form = {
                    userId: 0,
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    roleIdList: [],
                    status: 1
                }
                // 重置表单验证
                this.$refs['iForm'].resetFields()
                // 清除加载状态
                this.loading = false
            },
            cancelLoading() {
                this.loading = false
            },
            ...system.mapActions([
                'GET_ROLE_SELECT',
                'GET_ADMIN_INFO'
            ])
        }
    }
</script>

<style scoped>

</style>