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
            <FormItem label="菜单名称" prop="name">
                <Input v-model="form.name" clearable placeholder="请输入名称" type="text" />
            </FormItem>
            <FormItem  label="菜单图标" prop="icon">
                <IconSelect v-if="show" v-model="form.icon" />
            </FormItem>
            <FormItem label="菜单地址" prop="url">
                <Input v-model="form.url" clearable placeholder="请输入菜单地址" type="text" />
            </FormItem>
            <FormItem label="上级菜单">
                <Select v-model="form.parentId">
                    <Option 
                        :style="{
                            paddingLeft: 15 * (item.type + 2) + 'px'
                        }" 
                        v-for="item in menuList"
                        :value="item.menuId"
                        :key="item.menuId">
                        <Icon :size="16" v-if="item.type < 1" type="md-arrow-dropdown" />
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="菜单类型" prop="type">
                <RadioGroup v-model="form.type">
                    <Radio :label="0">
                        <span>目录</span>
                    </Radio>
                    <Radio :label="1">
                        <span>菜单</span>
                    </Radio>
                    <Radio :label="2">
                        <span>权限</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="菜单排序">
                <InputNumber :max="999" :min="0" v-model="form.orderNum"></InputNumber>
            </FormItem>
            <FormItem v-if="user.username === 'admin'" label="绑定模块">
                <Select v-model="form.module">
                    <Option
                        v-for="item in adminModules"
                        :value="item.id"
                        :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem v-if="user.username === 'admin'" label="授权标识">
                <Input type="text" v-model="form.perms" placeholder="多个用逗号分隔, 如: user:list,user:create" />
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
    const system = createNamespacedHelpers('system')
    import { adminModules } from '@/router'
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
                adminModules: adminModules,
                form: {
                    menuId: 0,
                    name: '',
                    parentId: 0,
                    url: '',
                    perms: '',
                    type: 0,
                    icon: '',
                    orderNum: 0,
                    module: 0,
                    parentName: '',
                    list: [],
                    open: true
                },
                formRule: {
                    name: [
                        { required: true, message: '名称必须', trigger: 'blur' },
                    ],
                    icon: [
                        { required: true, message: '图标必须', trigger: 'blur' },
                    ]
                }
            }
        },
        watch: {
            value(v) {
                this.show = v
            },
            show(v) {
                this.$emit('input', v)
                if (!v) this.handlerClear()
            },
            data(v) {
                const { menuId, parentId, parentName, open, name, url, icon, type, orderNum, module, perms, list } = v
                if (this.actionType === 'add') {
                    this.form.parentId = menuId || 0
                    this.form.type = type === -1 ? 0 : type
                    this.form.parentName = name
                } else if (this.actionType === 'edit') {
                    this.form.menuId = menuId
                    this.form.parentId = parentId
                    this.form.name = name
                    this.form.parentName = parentName
                    this.form.url = url
                    this.form.icon = icon
                    this.form.type = type
                    this.form.module = module
                    this.form.perms = perms
                    this.form.orderNum = orderNum
                    this.form.list = list
                    this.form.open = open
                }
            }
        },
        computed: {
            ...system.mapGetters([
                'user',
                'menu',
                'originMenu'
            ]),
            menuList() {
                return [
                    {
                        type: -1,
                        name: '顶级菜单',
                        menuId: 0
                    },
                    ...this.originMenu.filter(k => k.type === 0 || k.type === 1)
                ]
            },
            parseForm() {
                return JSON.parse(JSON.stringify(this.form))
            },
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
                    open: true,
                    menuId: 0,
                    name: '',
                    parentId: 0,
                    url: '',
                    perms: '',
                    type: 0,
                    icon: '',
                    orderNum: 0,
                    module: 0,
                    parentName: '',
                    list: []
                }
                // 重置表单验证
                this.$refs['iForm'].resetFields()
                // 清除加载状态
                this.loading = false
            },
            cancelLoading() {
                this.loading = false
            }
        }
    }
</script>

<style scoped lang="less">
</style>