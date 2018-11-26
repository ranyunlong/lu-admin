<template>
    <Layout class="layout">
        <MHeader v-model="isFold" @changePassword="showChangePasswordModal = true">
        </MHeader>
        <Layout>
            <Sider 
                v-model="isFold"
                collapsible>
                 <Menu class="menu" @on-select="selectMenu" ref="menu" accordion theme="dark" width="auto" :open-names="menuOpenNames" :active-name="menuActiveName">
                     <Menu-Item to="/admin" name="home">
                        <Icon type="md-home" />
                        <span v-show="!isFold">首页</span>
                    </Menu-Item>
                    <Submenu v-for="item in menuList" :key="item.menuId" v-if="item.type === 0" :name="item.menuId">
                        <span slot="title" :title="item.name">
                            <Icon :type="item.icon" :title="item.name" />
                            <span v-show="!isFold">{{item.name}}</span>
                        </span>
                        <Menu-Item :title="child.name" :to="child.url" v-for="child in item.children" v-if="child.type === 1" :key="child.menuId" :name="child.menuId">
                            <Icon :type="child.icon" :title="child.name" />
                            <span v-show="!isFold">{{child.name}}</span>
                        </Menu-Item>
                    </Submenu>
                    <Menu-Item :title="item.name" :to="item.url" v-for="item in menuList" :key="item.menuId" v-if="item.type === 1" :name="item.menuId">
                        <Icon :type="item.icon" :title="item.name" />
                        <span v-show="!isFold">{{item.name}}</span>
                    </Menu-Item>
                </Menu>
            </Sider>
            <Content class="content">
                <a ref="tab-bar" href="javascript:void(0)" tabindex="99" style="position: relative; display:block;" @blur.stop="contextMenuShow=false" @contextmenu.stop.prevent="contextmenu">
                    <Tabs :animated="false" v-show="tabTags.length > 0" type="card" class="tab" v-model="tabActiveName" @on-tab-remove="handleTabRemove" closable >
                        <TabPane 
                            :label="item.name"
                            :name="item.name"
                            v-for="item in tabTags"
                            :key="item.menuId"
                            >
                        </TabPane>
                    </Tabs>
                    <ContextMenu :show.sync="contextMenuShow" :x="contextMenuX" :y="contextMenuY">
                        <ContextMenuItem @click="tabTags = []">关闭所有</ContextMenuItem>
                        <ContextMenuItem divided @click="closeTabBefore">关闭左侧</ContextMenuItem>
                        <ContextMenuItem divided @click="closeTabAfter">关闭右侧</ContextMenuItem>
                        <ContextMenuItem divided @click="closeTabOther">关闭其他</ContextMenuItem>
                    </ContextMenu>
                </a>
                <Layout class="route-view">
                    <keep-alive>
                        <router-view />
                    </keep-alive>
                </Layout>
            </Content>
            <ChangePasswordModal ref="changepassword" v-model="showChangePasswordModal" @ok="handleChangePassword" title="修改密码" />
        </Layout>
    </Layout>
</template>

<script>
import MHeader from './components/Header'
import ChangePasswordModal from './components/ChangePasswordModal'
import { createNamespacedHelpers } from 'vuex'
const system = createNamespacedHelpers('system')
export default {
    data() {
        return {
            isFold: false,                      // 菜单是否展开
            tabTags: [],                        // tab 已打开列表
            tabActiveName: '',                  // tab 选项卡 激活名称
            menuActiveName: 'home',             // 菜单激活名称
            menuOpenNames: [],                  // 菜单打开的名称列表
            contextMenuShow: false,             // tab 选项卡右键菜单显示状态
            contextMenuX: 0,                    // tab 选项卡右键菜单 X 坐标
            contextMenuY: 0,                    // tab 选项卡右键菜单 Y 坐标
            showChangePasswordModal: false      // 修改密码模态框显示在状态
        }
    },
    created() {
        // 获取管理员信息
        this.GET_USER_INFO().then(({data}) => {
            if (data.code !== 0) this.$router.push('/login')
        }).catch(err => this.$router.push('/login'))
        // 获取菜单列表
        this.GET_MENU_LIST().then(res => {
            const { path } = this.$route
            this.originMenu.forEach(k => {
                if (RegExp('^'+k.url).test(path)) {
                    this.tabTags.push(k)
                    this.tabActiveName = k.name
                    this.menuActiveName = k.menuId
                    this.menuOpenNames = [k.parentId]
                }
            })
        })
    },
    watch: {
        // tab同步路由
        tabActiveName(val) {
            if (!~val) return;
            const url = this.tabTags.filter(k => k.name === val)[0].url
            this.$router.push(url)
        },
        tabTags(val) {
            if (val.length === 0) this.$router.push('/admin')
        },
        $route(val) {
            if (val.fullPath === '/admin') {
                this.tabTags = []
            }
        }
    },
    mounted() {
        // 异步展开菜单
         this.$refs['menu'].$nextTick(function() {
            this.$watch('openNames',() => {
                this.updateOpened() 
            })
         })
    },
    methods: {
        ...system.mapActions([
            'GET_USER_INFO',
            'GET_MENU_LIST',
            'CHANGE_PASSWORD',
            'LOG_OUT'
        ]),
        // 选择菜单
        selectMenu(menuId) {
            if (menuId === 'home') return;
            const item = this.originMenu.filter((k) => {
                return menuId === k.menuId
            })
            const repeat = this.tabTags.filter(k => k.menuId === item[0].menuId)
            if (!repeat.length) {
                this.tabTags.push({
                    ...item[0]
                })
            }
            this.tabActiveName = item[0].name
        },
        // 从tab中移除
        handleTabRemove(name) {
            this.tabTags = this.tabTags.filter(k => k.name !== name)
        },
        handleChangePassword(data) {
            this.CHANGE_PASSWORD(data).then(({data}) => {
                const { code, msg } = data
                if (code === 0) {
                    this.$Modal.info({
                        title: '成功',
                        content: '密码修改成功,现在跳转至登陆页面重新登陆',
                        onOk: () => {
                            this.LOG_OUT()
                            this.$router.push('/login')
                        }
                    })
                } else {
                    this.$Notice.error({
                        title: '错误',
                        desc: msg
                    })
                    this.$refs['changepassword'].clearLoading()
                }
            })
        },
        // tab选项卡关闭左侧
        closeTabBefore() {
            let index = null
            const active = this.tabTags.find((k, i) => {
                if (k.name === this.tabActiveName) {
                    index = i
                    return true
                }
            })
            if (active) {
                this.tabTags = this.tabTags.filter((k, i) => i >= index)
            }
        },
        // tab选项卡 关闭右侧
        closeTabAfter() {
            let index = null
            const active = this.tabTags.find((k, i) => {
                if (k.name === this.tabActiveName) {
                    index = i
                    return true
                }
            })
            if (active) {
                this.tabTags = this.tabTags.filter((k, i) => i <= index)
            }
        },
        // tab选项卡 关闭其他
        closeTabOther() {
            const active = this.tabTags.find(k => k.name === this.tabActiveName)
            if (active) {
                this.tabTags = this.tabTags.filter(k => k.name === active.name)
            }
        },
        // tab选修课 右键菜单
        contextmenu(e) {
            const l = this.$refs['tab-bar'].offsetLeft
            const t = this.$refs['tab-bar'].offsetTop
            this.$refs['tab-bar'].focus()
            this.contextMenuShow = !this.contextMenuShow
            this.contextMenuX = e.clientX - l
            this.contextMenuY = e.clientY - t
        }
    },
    computed: {
        ...system.mapGetters([
            'menu',
            'originMenu'
        ]),
        menuList() {
            return this.menu
        }
    },
    components: {
        MHeader,
        ChangePasswordModal
    }
};

</script>

<style scoped lang="less">
    .layout {
        height: 100%;
        .menu {
            white-space: nowrap;
            overflow: hidden;
        }
        .content {
            display: flex;
            flex-direction: column;
            min-height: 600px;
            overflow: hidden;
            .tab {
                padding: 10px 15px 0 15px;
                background: #363e4f;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
                user-select: none;
            }
            .route-view {
                flex: 1;
                min-height: 570px;
                overflow: hidden;
                background: #fff;
                margin: 15px;
                border: 1px solid #f1f1f1;
                border-radius: 5px;
                padding: 15px;
            }
        }
    }
</style>