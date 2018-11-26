import Avatar from './Avatar'
import IconSelect from './IconSelect'
import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'
import UploadPic from './UploadPic'
const components = {
    Avatar,
    ContextMenu,
    ContextMenuItem,
    UploadPic,
    IconSelect
}
export default {
    install(Vue) {
        Object.keys(components).forEach((key) => {
            Vue.component(key, components[key])
        })
    }
}