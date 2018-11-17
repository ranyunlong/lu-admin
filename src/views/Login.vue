<template>
    <Layout class="login">
        <Content class="content">
            
        </Content>
        <Content class="login-box">
            <Form class="form" ref="form" :model="form" :rules="rules">
                <FormItem>
                    <h1>管理系统登陆</h1>
                </FormItem>
                <FormItem prop="username">
                    <Input 
                        placeholder="请输入账号" 
                        type="text" 
                        prefix="md-person" 
                        autocomplete="off"
                        v-model="form.username"
                        clearable
                        />
                </FormItem>
                <FormItem prop="password">
                    <Input
                        placeholder="请输入密码" 
                        type="password" 
                        prefix="md-lock"
                        autocomplete="off"
                        v-model="form.password"
                        clearable />
                </FormItem>
                <FormItem prop="captcha" class="captcha-box">
                    <Input
                        class="captcha"
                        placeholder="请输入验证码" 
                        type="password" 
                        prefix="md-image"
                        autocomplete="off"
                        v-model="form.captcha"
                        clearable />
                    <img class="captcha-img" :src="captchaSrc" @click="reFreshcaptcha">
                    <div style="clear:both;"></div>
                </FormItem>
                <FormItem>
                    <Button type="primary" long @click="login">登陆</Button>
                </FormItem>
            </Form>
        </Content>
    </Layout>
</template>

<script>
import uuid from 'uuid/v4'
import { createNamespacedHelpers } from 'vuex'
const system = createNamespacedHelpers('system')
export default {
    data() {
        return {
            show: false,
            captchaSrc: '',
            loading: false,
            form: {
                captcha: '',
                password: '',
                username: '',
                uuid: ''
            },
            rules: {
                username: [
                    { required: true, message: '用户名必须', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码必须', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '验证码必须', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.captchaSrc = '/api/captcha.jpg?uuid=' + this.getUid()
    },
    mounted() {
        document.addEventListener('keydown', this.login)
    },
    destroyed() {
        document.removeEventListener('keydown', this.login)
    },
    methods: {
        // 刷新验证码
        reFreshcaptcha() {
            this.captchaSrc = `/api/captcha.jpg?uuid=` + this.getUid()
        },
        ...system.mapActions([
            'LOGIN'
        ]),
        // 获取uuid
        getUid() {
            const uid = uuid()
            this.form.uuid = uid
            return uid
        },
        // 登陆
        login(e) {
            if (typeof e === "object") {
                if (e.type === 'keydown') {
                    if (e.keyCode !== 13) return;
                }
            } 
            if (this.loading) return;
            this.$refs['form'].validate((valid) => {
                if(valid) {
                    this.loading = true
                    this.LOGIN(this.form).then(({data}) => {
                        if (data.code === 500) {
                            this.reFreshcaptcha()
                            this.$Message.error(data.msg);
                            this.loading = false
                        } else if (data.code === 0) {
                            this.loading = false
                            this.$router.push({
                                path: '/admin'
                            })
                        }
                    })
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .login {
        min-width: 1200px;
        display: flex;
        flex-direction: row;
        .content {
            background-color: rgba(38, 50, 56, 0.6);
            flex: 3;
        }
        .login-box {
            flex: 1;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 380px;
            .form {
                width: 300px;
                margin-top: -100px;
                .captcha-box {
                    .captcha {
                        width: 150px;
                        float: left;
                    }
                    .captcha-img{
                        display: block;
                        height: 32px;
                        float: right;
                    }
                }   
            }
        }
    }
</style>