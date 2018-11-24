<template>
    <Header class="header">
        <div
            @click="$router.push('/admin')" 
            class="layout-logo" 
            :class="{
                collapsed: value
            }">
            <img src="@/assets/images/logo.png" alt="">
            <h1 v-show="!value">后台管理系统</h1>
        </div>
        <div class="layout-nav">
            <div class="collapsible">
                <Button icon="md-menu" @click="isFold = !isFold"></Button>
            </div>
            <div class="right">
                <div class="tools">
                    <Icon title="主题设置" type="md-color-palette" size="26" />
                    <Badge dot>
                        <Icon title="最新动态" type="ios-notifications-outline" size="26"></Icon>
                    </Badge>
                </div>
                <div class="user">
                    <Avatar />
                    <Dropdown trigger="click" @on-click="selectMenu">
                        <span>{{user.username}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                        <DropdownMenu slot="list">
                            <DropdownItem name="changePassword">
                                <Icon type="md-lock" />
                                修改密码
                            </DropdownItem>
                            <DropdownItem name="loginOut">
                                <Icon type="md-log-out" />
                                安全退出
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
    </Header>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        props: {
            value: Boolean
        },
        data() {
            return {
                isFold: this.value,
                username: 'admin'
            }
        },
        watch: {
            isFold(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.isFold = val
            }
        },
        methods: {
            selectMenu(name) {
                if (name === 'loginOut'){
                    this.LOG_OUT()
                    this.$router.push('/login')
                }
                if (name === 'changePassword') {
                    this.$emit('changePassword')
                }
            },
            ...system.mapActions([
                'LOG_OUT'
            ])
        },
        computed: {
            ...system.mapGetters([
                'user'
            ])
        }
    }
</script>

<style scoped lang="less">
.header {
    background: #fff;
    padding: 0;
    z-index: 1;
    display: flex;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    .layout-logo {
        width: 200px;
        padding: 0 15px;
        transition: all .2s ease-in-out;
        white-space: nowrap;
        display: flex;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        img {
            width: 30px;
            height: 30px;
        }
        &.collapsed {
            width: 64px;
            overflow: hidden;
        }
    }
    .layout-nav {
        padding: 0 20px;
        flex: 1;
        display: flex;
        justify-content: space-between;
        border-left: 1px solid #ddd;
        .right {
            height: inherit;
            display: flex;
            flex-direction: row;
            align-items: center;
            .tools {
                height: 100%;
                .ivu-icon {
                    cursor: pointer;
                }
            }
            .user {
                margin-left: 30px;
                display: flex;
                align-items: center;
                height: 100%;
                span{
                    cursor: pointer;
                    font-size: 16px;
                    margin-left: 10px;
                }
                .ivu-dropdown-rel {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
}
</style>