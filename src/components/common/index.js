import Avatar from './Avatar'
import IconSelect from './IconSelect'
import ContextMenu from './ContextMenu'

const components = {
    Avatar,
    IconSelect,
    ContextMenu
}
export default {
    install(Vue) {
        Object.keys(components).forEach((key) => {
            Vue.component(key, components[key])
        })
    }
}