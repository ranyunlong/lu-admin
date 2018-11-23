<template>
<Layout id="app">
    <keep-alive>
        <router-view/>
    </keep-alive>
</Layout>
</template>

<script>
export default {
    name: "App"
};
</script>

<style lang="less">

html,body {
    width: 100%;
    height: 100%;
}
#app {
    width: 100%;
    height: 100%;
    min-width: 1200px;
}
.ivu-badge {
    line-height: normal;
    cursor: pointer;
}

.ivu-menu-submenu-title-icon {
    opacity: 1;
    transition: opacity 1s linear;
}

.ivu-layout-sider-collapsed {
    .ivu-menu-submenu-title-icon {
        transition: opacity .1s linear;
        opacity: 0;
    }
    .ivu-menu-submenu {
        .ivu-menu-item {
            padding-left: 25px !important;
            text-align: center;
            &:hover{
                background-color: rgba(45, 140, 240, .5) !important;
                color: #fff;
            }
        }
    }
}

.tab {
    .ivu-tabs-bar {
        margin-bottom: 0;
        border: none;
    }
    .ivu-tabs-nav{
        .ivu-tabs-tab{
            border: none;
        }
    }
}
.ivu-tree-children {
    user-select: none;
}
</style>
