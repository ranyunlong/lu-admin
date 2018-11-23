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
            <FormItem label="名称" prop="roleName">
                <i-input v-model="form.roleName" clearable placeholder="请输入角色名称" type="text">
                        <span slot="prepend">
                            <Icon type="md-people" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="备注" prop="remark">
                <i-input v-model="form.remark" clearable placeholder="请输入备注" type="text">
                        <span slot="prepend">
                            <Icon type="md-text" />
                        </span>
                </i-input>
            </FormItem>
            <FormItem label="状态">
                <i-switch :true-value="1" :false-value="0" v-model="form.status" size="large">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                </i-switch>
            </FormItem>
            <FormItem label="授权">
               <RoleAuthorization :value="menuList[0]" />
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
    import RoleAuthorization from './RoleAuthorization'
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
                    roleId: 0,
                    roleName: '',
                    menuIdList: [],
                    status: 1
                },
                menuList: [],
                formRule: {
                    roleName: [
                        { required: true, message: '角色名称必须', trigger: 'blur' },
                    ]
                }
            }
        },
        created() {
            this.GET_MENU_LIST()
        },
        watch: {
            show(v) {
                this.$emit('input', v)
                if (!v) {
                    this.handlerClear()
                }
                this.menuList = this.parseMenu(this.menu)
            },
            value(v){
                this.show = v
            },
            data(v = {}) {
                const { roleId = 0, status = 1 } = v
                this.GET_ROLE_INFO(roleId).then(({data}) => {
                    const { code, msg, role } = data
                    if (code === 0) {
                        const { roleId = 0, menuIdList = [], remark = '', roleName = '', status = 1 } = role
                        this.form.roleId = roleId
                        this.form.menuIdList = menuIdList
                        this.form.remark = remark
                        this.form.roleName = roleName
                        this.form.status = status
                    } else {
                        this.show = false
                        this.$Notice.error({
                            title: msg
                        })
                    }
                    // deep menu
                    function deep(arr) {
                        if (!Array.isArray(arr)) return;
                        arr.forEach(key => {
                            if (!!~role.menuIdList.indexOf(key.menuId)) {
                                key.selected = true
                            }
                            deep(key.children)
                        })
                    }
                    deep(this.menuList)
                }).catch(err => console.log(err))
            },
            menuList: {
                handler(e) {
                    const result = []
                    function deepFilter(arr, p) {
                        if (!Array.isArray(arr)) return;
                        if (!p) return;
                        arr.forEach(k => {
                            if (k.selected) {
                                result.push(k.menuId)
                            }
                            if (k.children) {
                                deepFilter(k.children, k.selected)
                            }
                        })
                    }
                    deepFilter(e, true)
                    this.form.menuIdList = result
                },
                deep: true
            },
        },
        computed: {
            ...system.mapGetters([
                'menu'
            ]),
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
                    roleId: 0,
                    roleName: '',
                    menuIdList: [],
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
                'GET_MENU_LIST',
                'GET_ROLE_INFO'
            ]),
            parseMenu() {
                // 递归数据
                function deep(arr) {
                    if (!Array.isArray(arr)) return;
                    return arr.map(k => {
                        return {
                            selected: false,
                            name: k.name,
                            menuId: k.menuId,
                            icon: k.icon,
                            type: k.type,
                            children: deep(k.children)
                        }
                    })
                }
                return deep(this.menu)
            }
        },
        components: {
            RoleAuthorization
        }
    }
</script>

<style scoped>

</style>