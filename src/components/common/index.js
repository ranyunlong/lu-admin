import Avatar from './Avatar'
import IconSelect from './IconSelect'
import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'

const components = {
    Avatar,
    IconSelect,
    ContextMenu,
    ContextMenuItem
}
export default {
    install(Vue) {
        Object.keys(components).forEach((key) => {
            Vue.component(key, components[key])
        })
    }
}