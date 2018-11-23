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
            <FormItem label="bean名称" prop="beanName">
                <Input v-model="form.beanName" placeholder="spring bean名称, 如: testTask" />
            </FormItem>
            <FormItem label="方法名称" prop="methodName">
                <Input v-model="form.methodName" placeholder="方法名称" />
            </FormItem>
            <FormItem label="cron表达式" prop="cronExpression">
                <Input v-model="form.cronExpression" placeholder="如: 0 0 12 * * ?" />
            </FormItem>
            <FormItem label="状态">
                <iSwitch v-model="form.status" size="large" :trueValue="0" falseValue="1">
                    <span slot="open">运行</span>
                    <span slot="close">停止</span>
                </iSwitch>
            </FormItem>
            <FormItem label="参数" prop="params">
                <Input v-model="form.params" placeholder="参数" />
            </FormItem>
            <FormItem label="备注" prop="remark">
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
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        data() {
            return {
                form: {
                    jobId: 0,
                    beanName: "",
                    methodName: "",
                    params: "",
                    cronExpression: "",
                    status: 0,
                    remark: ""
                },
                show: this.value,
                loading: false,
                formRule: {
                    beanName: [
                        { required: true, message: '名称必须', trigger: 'blur' },
                    ],
                    methodName: [
                        { required: true, message: '方法名称必须', trigger: 'blur' },
                    ],
                    cronExpression: [
                        { required: true, message: 'cron表达式必须', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            ...system.mapActions([
                'GET_SCHEDULE_INFO'
            ]),
            getScheduleInfo(jobId) {
                this.GET_SCHEDULE_INFO(jobId).then(({data}) => {
                    const { code, msg, schedule } = data
                    if (code === 0) {
                        this.form = schedule
                    }
                })
            },
            init() {
                this.form = {
                    jobId: 0,
                    beanName: "",
                    methodName: "",
                    params: "",
                    cronExpression: "",
                    status: 0,
                    remark: ""
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
                const { jobId } = data
                this.form = data
                this.getScheduleInfo(jobId)
            }
        }
    }
</script>

<style scoped>

</style>