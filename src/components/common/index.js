import Avatar from './Avatar'
import IconSelect from './IconSelect'

const components = {
    Avatar,
    IconSelect
}
export default {
    install(Vue) {
        Object.keys(components).forEach((key) => {
            Vue.component(key, components[key])
        })
    }
}