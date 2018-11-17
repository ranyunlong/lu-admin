export default function(file) {
    if (process.env.NODE_ENV === 'development') {
        return require(`@/views/${file}.vue`).default
    } else if (process.env.NODE_ENV === 'production') {
        return () => import(`@/views/${file}.vue`)
    }
}