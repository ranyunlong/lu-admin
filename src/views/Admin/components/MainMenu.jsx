import { Menu, MenuItem, Submenu, Icon } from 'iview'
export default {
    render() {
        return (
            <Menu
                class="menu"
                open-names={this.openNames} 
                active-name={this.activeName}
                width="auto"
                ref="menu"
                theme="dark"
                {...{on: {
                    'on-select': this.selectMenu
                }}}
                accordion>
                <MenuItem to="/admin" name={-1}>
                    <Icon type="md-home" />
                    {
                        !this.isFold ? <span>首页</span> : null
                    }
                </MenuItem>
                {
                    this.mapChildren(this.list)
                }
            </Menu>
        )
    },
    props: {
        openNames: Array,
        isFold: Boolean,
        list: Array,
        activeName: {
            type: Number
        } 
    },
    mounted() {
        // 异步展开菜单
        this.$refs.menu.$nextTick(function() {
            this.$watch('openNames',() => {
                this.updateOpened() 
            })
        })
    },
    methods: {
        mapChildren(arr = []) {
            return arr.map(item => {
                if (item.type === 1) {
                    return (
                        <MenuItem 
                            to={item.url} 
                            name={item.menuId}
                            >
                            <Icon type={item.icon} />
                            {
                                !this.isFold ? <span>{item.name}</span> : null
                            }
                        </MenuItem>
                    )
                } else if (item.type === 0) {
                    return (
                        <Submenu
                            name={item.menuId}>
                            <span slot="title" title={item.name}>
                                <Icon type={item.icon} title={item.name} />
                                { !this.isFold ? <span>{item.name}</span>: null}
                            </span>
                            {this.mapChildren(item.children)}
                        </Submenu>
                    )
                }
            })
        },
        selectMenu(e) {
            if (e === -1) return;
            this.$emit('select-menu', e)
        }
    }
}