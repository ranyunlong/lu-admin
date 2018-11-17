import Avatar from './Avatar'

const components = {
    Avatar
}
export default {
    install(Vue) {
        Object.keys(components).forEach((key) => {
            Vue.component(key, components[key])
        })
    }
}