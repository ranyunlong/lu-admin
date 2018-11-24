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
        <Form 
            ref="iForm" 
            v-if="show" 
            :rules="formRule" 
            :model="form" 
            style="width: 85%" 
            :label-width="100">
            <FormItem prop="password" label="原密码">
                <Input v-model="form.password" type="password" placeholder="原密码" />
            </FormItem>
            <FormItem prop="newPassword" label="新密码">
                <Input v-model="form.newPassword" type="password" placeholder="新密码" />
            </FormItem>
        </Form>
        <template slot="footer">
            <Button @click="show = false, $emit('cancel')">取消</Button>
            <Button type="primary" :loading="loading" @click="handlerOk">确认</Button>
        </template>
    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                show: this.value,
                form: {
                    password: '',
                    newPassword: ''
                },
                formRule: {
                    password: [
                        { required: true, message: '密码必须', trigger: 'blur' },
                    ],
                    newPassword: [
                        { required: true, message: '新密码必须', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            init() {
                this.form = {
                    password: '',
                    newPassword: ''
                }
                this.loading = false
            },
            handlerOk() {
                this.$refs['iForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$emit('ok', this.parseForm)
                    }
                })
            },
            clearLoading() {
                this.loading = false
            }
        },
        computed: {
            parseForm() {
                return JSON.parse(JSON.stringify(this.form))
            }
        },
        props: {
            value: Boolean,
            scrollable: Boolean,
            fullscreen: Boolean,
            draggable: Boolean,
            width: [Number, String],
            data: Object,
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
        watch: {
            show(v) {
                this.$emit('input',v)
                if (v) this.init()
            },
            value(v) {
                this.show = v
            }
        }
    }
</script>

<style scoped>

</style>