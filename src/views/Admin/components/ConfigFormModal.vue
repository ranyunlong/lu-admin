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
            <FormItem prop="paramKey" label="参数名">
                <Input v-model="form.paramKey" placeholder="参数名" />
            </FormItem>
            <FormItem prop="paramValue" label="参数值">
                <Input v-model="form.paramValue" placeholder="参数值" />
            </FormItem>
            <FormItem prop="remark" label="备注">
                <Input v-model="form.remark" placeholder="备注" />
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
                    id: 0,
                    key: '',
                    value: '',
                    remark: ''
                },
                formRule: {
                    paramKey: [
                        { required: true, message: '名称必须', trigger: 'blur' },
                    ],
                    paramValue: [
                        { required: true, message: '参数值必须', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            init() {
                this.form = {
                    id: 0,
                    paramKey: '',
                    paramValue: '',
                    remark: ''
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
        watch: {
            show(v) {
                this.$emit('input',v)
                if (v) this.init()
            },
            value(v) {
                this.show = v
            },
            data(data) {
                
            }
        }
    }
</script>

<style scoped>

</style>