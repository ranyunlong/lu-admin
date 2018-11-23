<template>
    <Layout class="layout">
        <MHeader v-model="isFold">
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
                <div style="position: relative;" @contextmenu.stop.prevent="contextmenu">
                    <Tabs :animated="false" v-show="tabTags.length > 0" type="card" class="tab" v-model="tabActiveName" @on-tab-remove="handleTabRemove" closable >
                        <TabPane 
                            :label="item.name"
                            :name="item.name"
                            v-for="item in tabTags"
                            :key="item.menuId"
                            >
                        </TabPane>
                    </Tabs>
                </div>
                <Layout class="route-view">
                    <router-view />
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import MHeader from './components/Header'
import { createNamespacedHelpers } from 'vuex'
const system = createNamespacedHelpers('system')
export default {
    data() {
        return {
            isFold: false,
            username: 'admin',
            tabTags: [],
            tabActiveName: '',
            menuActiveName: 'home',
            menuOpenNames: [],
            tabDropdownShow: false,
            dropdownLeft: 0
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
            'GET_MENU_LIST'
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
        contextmenu(e) {
            this.tabDropdownShow = !this.tabDropdownShow
            this.dropdownLeft = e.clientX - 200
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
        MHeader
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
            .tab {
                padding: 10px 15px 0 15px;
                background: #363e4f;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
                user-select: none;
            }
            .route-view {
                flex: 1;
                background: #fff;
                margin: 15px;
                border: 1px solid #f1f1f1;
                border-radius: 5px;
                padding: 15px;
            }
        }
    }
</style>